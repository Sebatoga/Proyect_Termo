import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { get } from "node:http";
import { createServer } from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { afterEach, test } from "node:test";

import { preflightBuild, startLocalConsole } from "./local-console-server.mjs";

const temporaryRoots = [];
const runningServers = [];

afterEach(async () => {
  await Promise.allSettled(runningServers.splice(0).map((server) => server.close()));
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function fixture({ index, asset = "console.log('local');", css = "body{}" } = {}) {
  const root = await mkdtemp("/tmp/opencode/ecogrid-console-");
  temporaryRoots.push(root);
  await mkdir(path.join(root, "assets"));
  await writeFile(path.join(root, "index.html"), index ?? '<title>EcoGrid | Consola local</title><script src="/assets/app.js"></script><link href="/assets/app.css" rel="stylesheet">');
  await writeFile(path.join(root, "assets/app.js"), asset);
  await writeFile(path.join(root, "assets/app.css"), css);
  return root;
}

function rawRequest(origin, requestPath) {
  return new Promise((resolve, reject) => {
    const url = new URL(origin);
    const request = get({ hostname: url.hostname, port: url.port, path: requestPath }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks).toString() }));
    });
    request.on("error", reject);
  });
}

async function start(root, port) {
  const running = await startLocalConsole({ buildRoot: root, port });
  runningServers.push(running);
  return running;
}

function reserve(port = 0) {
  return new Promise((resolve, reject) => {
    const server = createServer().listen({ host: "127.0.0.1", port }, () => resolve(server));
    server.once("error", reject);
  });
}

async function availablePort() {
  const server = await reserve(); const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

test("import installs no process signal handlers", async () => {
  const before = [process.listenerCount("SIGINT"), process.listenerCount("SIGTERM")];
  await import(`./local-console-server.mjs?test=${Date.now()}`);
  assert.deepEqual([process.listenerCount("SIGINT"), process.listenerCount("SIGTERM")], before);
});

test("preflight creates a deterministic identity from sorted local assets", async () => {
  const root = await fixture();
  const first = await preflightBuild(root);
  const second = await preflightBuild(root);
  assert.equal(first.buildId, second.buildId);
  assert.match(first.buildId, /^[a-f0-9]{64}$/);
  assert.deepEqual(first.assets, ["/assets/app.css", "/assets/app.js"]);
});

test("preflight rejects missing index, title, asset, and external references", async (context) => {
  await context.test("missing index", async () => {
    const root = await fixture();
    await rm(path.join(root, "index.html"));
    await assert.rejects(preflightBuild(root));
  });
  await context.test("missing title", async () => assert.rejects(preflightBuild(await fixture({ index: '<script src="/assets/app.js"></script>' })), /title marker/));
  await context.test("missing asset", async () => assert.rejects(preflightBuild(await fixture({ index: '<title>EcoGrid | Consola local<\/title><script src="/assets/missing.js"></script>' }))));
  await context.test("external reference", async () => assert.rejects(preflightBuild(await fixture({ index: '<title>EcoGrid | Consola local<\/title><script src="https://example.com/app.js"></script>' })), /External/));
  await context.test("missing runtime references", async () => assert.rejects(preflightBuild(await fixture({ index: '<title>EcoGrid | Consola local<\/title>' })), /JavaScript and CSS/));
  await context.test("external CSS resource", async () => assert.rejects(preflightBuild(await fixture({ css: 'body{background:url("https://example.com/x.png")}' })), /External/));
  await context.test("external CSS import", async () => assert.rejects(preflightBuild(await fixture({ css: '@import "https://example.com/x.css";' })), /External/));
  await context.test("external static import", async () => assert.rejects(preflightBuild(await fixture({ asset: 'import "https://example.com/x.js";' })), /External/));
  await context.test("missing static import", async () => assert.rejects(preflightBuild(await fixture({ asset: 'import "./missing.js";' })), /Missing runtime dependency/));
  await context.test("unsupported nested asset", async () => {
    const root = await fixture({ css: 'body{background:url("./image.bin")}' });
    await writeFile(path.join(root, "assets/image.bin"), "x");
    await assert.rejects(preflightBuild(root), /Unsupported runtime dependency/);
  });
});

test("preflight bounds the complete in-memory snapshot", async () => {
  const root = await fixture();
  await Promise.all(Array.from({ length: 254 }, (_, index) => writeFile(path.join(root, `extra-${index}.txt`), "x")));
  await assert.rejects(preflightBuild(root), /snapshot limits/);
});

test("preflight rejects symlinks and references that traverse outside the root", async () => {
  const outside = await fixture();
  const root = await fixture({ index: '<title>EcoGrid | Consola local</title><script src="/assets/link.js"></script>' });
  await symlink(path.join(outside, "assets/app.js"), path.join(root, "assets/link.js"));
  await assert.rejects(preflightBuild(root), /Forbidden/);
  await assert.rejects(preflightBuild(await fixture({ index: '<title>EcoGrid | Consola local</title><script src="../outside.js"></script>' })), /Forbidden/);
});

test("server serves root, assets, MIME types, and path-free health", async () => {
  const buildRoot = await fixture();
  const running = await start(buildRoot, await availablePort());
  await writeFile(path.join(buildRoot, "assets/app.js"), "console.log('changed');");
  const [root, script, style, health] = await Promise.all([
    rawRequest(running.origin, "/"), rawRequest(running.origin, "/assets/app.js"),
    rawRequest(running.origin, "/assets/app.css"), rawRequest(running.origin, "/.well-known/ecogrid-health"),
  ]);
  assert.equal(root.status, 200);
  assert.equal(root.headers["content-type"], "text/html; charset=utf-8");
  assert.equal(script.headers["content-type"], "text/javascript; charset=utf-8");
  assert.equal(style.headers["content-type"], "text/css; charset=utf-8");
  assert.equal(script.body, "console.log('local');");
  assert.deepEqual(JSON.parse(health.body), { schema: "ecogrid-health/v1", product: "ecogrid-local-console", buildId: running.build.buildId });
  assert.equal(health.body.includes(running.build.root), false);
  const [post, head] = await Promise.all([fetch(running.origin, { method: "POST" }), fetch(`${running.origin}/assets/app.js`, { method: "HEAD" })]);
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET, HEAD");
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
});

test("server rejects malformed and encoded traversal and returns 404 for missing files", async () => {
  const running = await start(await fixture(), await availablePort());
  assert.equal((await rawRequest(running.origin, "/%ZZ")).status, 400);
  assert.equal((await rawRequest(running.origin, "/%2e%2e/%2e%2e/etc/passwd")).status, 403);
  assert.equal((await rawRequest(running.origin, "/missing.js")).status, 404);
});

test("occupied port fails strictly without READY or fallback", async () => {
  const root = await fixture();
  const blocker = await reserve(); const port = blocker.address().port;
  await assert.rejects(startLocalConsole({ buildRoot: root, host: "0.0.0.0", port }), /loopback/);
  await assert.rejects(startLocalConsole({ buildRoot: root, port }), (error) => error.code === "EADDRINUSE");
  const child = spawn(process.execPath, ["tools/local-console-server.mjs", "--root", root, "--host", "127.0.0.1", "--port", String(port)]);
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const code = await new Promise((resolve) => child.once("close", resolve));
  assert.notEqual(code, 0);
  assert.equal(output.includes("ECOGRID_LOCAL_READY"), false);
  assert.equal(blocker.address().port, port);
  await new Promise((resolve) => blocker.close(resolve));
});

test("close releases the requested port", async () => {
  const port = await availablePort(); const running = await start(await fixture(), port);
  await running.close();
  runningServers.pop();
  const rebound = await reserve(port);
  await new Promise((resolve) => rebound.close(resolve));
});
