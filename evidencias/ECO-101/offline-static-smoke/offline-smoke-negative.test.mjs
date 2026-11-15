import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { connect, createServer as createNetServer } from "node:net";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { startLocalConsole } from "../../../tools/local-console-server.mjs";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(evidenceDir, "../../..");
const temporary = new Set();

async function fixture() {
  const directory = await mkdtemp("/tmp/opencode/ecogrid-smoke-");
  temporary.add(directory);
  await mkdir(path.join(directory, "assets"));
  await writeFile(path.join(directory, "index.html"), '<!doctype html><title>EcoGrid | Consola local</title><link rel="stylesheet" href="/assets/app.css"><script type="module" src="/assets/app.js"></script>');
  await writeFile(path.join(directory, "assets/app.css"), "body { color: white; }");
  await writeFile(path.join(directory, "assets/app.js"), "console.log('local');");
  return directory;
}

async function freePort() {
  const probe = createNetServer();
  await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(0, "127.0.0.1", resolve); });
  const port = probe.address().port;
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
  return port;
}

function rawRequest(port, target) {
  return new Promise((resolve, reject) => {
    const socket = connect(port, "127.0.0.1");
    let data = "";
    socket.setEncoding("utf8");
    socket.once("error", reject);
    socket.on("data", (chunk) => (data += chunk));
    socket.on("end", () => resolve(data));
    socket.once("connect", () => socket.end(`GET ${target} HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n`));
  });
}

test.after(async () => Promise.all([...temporary].map((directory) => rm(directory, { recursive: true, force: true }))));

test("offline smoke rejects encoded traversal through the shared server", async () => {
  const directory = await fixture();
  const port = await freePort();
  const running = await startLocalConsole({ buildRoot: directory, port });
  try {
    const response = await rawRequest(port, "/%2e%2e/package.json");
    assert.match(response, /^HTTP\/1\.1 403 Forbidden/);
    assert.doesNotMatch(response, /ecogrid-local-console/);
  } finally { await running.close(); }
});

test("offline harness fails safely and releases resources when its fixed port is occupied", async () => {
  const blocker = createServer((_, response) => response.end("occupied"));
  await new Promise((resolve, reject) => { blocker.once("error", reject); blocker.listen(4174, "127.0.0.1", resolve); });
  try {
    const child = spawn(process.execPath, [path.join(evidenceDir, "offline-smoke.mjs")], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk)); child.stderr.on("data", (chunk) => (output += chunk));
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; child.kill("SIGKILL"); }, 30_000);
    const [code] = await once(child, "exit");
    clearTimeout(timer);
    assert.equal(timedOut, false, output);
    assert.notEqual(code, 0, output);
    assert.doesNotMatch(output, /OFFLINE_STATIC_SMOKE=PASS|CHROME_VERSION=/);
    assert.match(output, /EADDRINUSE/);
  } finally { await new Promise((resolve, reject) => blocker.close((error) => error ? reject(error) : resolve())); }
  const probe = createNetServer();
  await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(4174, "127.0.0.1", resolve); });
  await new Promise((resolve, reject) => probe.close((error) => error ? reject(error) : resolve()));
});
