import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(evidenceDir, "../../..");
const harness = path.join(evidenceDir, "browser-smoke.mjs");

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(4173, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

test("browser smoke rejects an impostor on the product port and releases its children", async () => {
  const impostor = createServer((_, response) => {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<title>EcoGrid | Consola local</title><div id='game-container'><canvas></canvas></div>");
  });
  await listen(impostor);
  try {
    const child = spawn(process.execPath, [harness], { cwd: root, detached: true, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    const timeout = setTimeout(() => process.kill(-child.pid, "SIGKILL"), 20_000);
    const [code, signal] = await once(child, "exit");
    clearTimeout(timeout);
    assert.notEqual(code, 0, `harness unexpectedly passed:\n${output}`);
    assert.equal(signal, null);
    assert.doesNotMatch(output, /PRODUCT_BROWSER_SMOKE=PASS|CHROME_VERSION=/);
    assert.match(output, /Port 4173 is already in use|Vite exited before readiness/);
  } finally {
    await close(impostor);
  }
  const probe = createServer();
  await listen(probe);
  await close(probe);
});
