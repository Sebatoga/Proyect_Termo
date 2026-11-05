import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { connect } from "node:net";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { closeServer, createStaticServer, listen } from "./offline-smoke.mjs";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(evidenceDir, "../../..");

test("static server rejects encoded path traversal", async () => {
  const server = createStaticServer();
  await listen(server);
  try {
    const response = await new Promise((resolve, reject) => {
      const socket = connect(4174, "127.0.0.1");
      let data = "";
      socket.setEncoding("utf8");
      socket.once("error", reject);
      socket.on("data", (chunk) => (data += chunk));
      socket.on("end", () => resolve(data));
      socket.once("connect", () => socket.end("GET /%2e%2e/package.json HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n"));
    });
    assert.match(response, /^HTTP\/1\.1 400 Bad Request/);
    assert.doesNotMatch(response, /ecogrid-local-console/);
  } finally { await closeServer(server); }
});

test("offline harness fails non-zero when its port is occupied", async () => {
  const impostor = createServer((_, response) => response.writeHead(200).end("EcoGrid | Consola local"));
  await new Promise((resolve, reject) => { impostor.once("error", reject); impostor.listen(4174, "127.0.0.1", resolve); });
  try {
    const child = spawn(process.execPath, [path.join(evidenceDir, "offline-smoke.mjs")], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    const timer = setTimeout(() => child.kill("SIGKILL"), 30_000);
    const [code] = await once(child, "exit");
    clearTimeout(timer);
    assert.notEqual(code, 0, output);
    assert.doesNotMatch(output, /OFFLINE_STATIC_SMOKE=PASS|CHROME_VERSION=/);
    assert.match(output, /EADDRINUSE/);
  } finally { await new Promise((resolve, reject) => impostor.close((error) => error ? reject(error) : resolve())); }
  const probe = createStaticServer();
  await listen(probe);
  await closeServer(probe);
});
