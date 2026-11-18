import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(evidenceDir, "../../..");
const harnessPath = path.join(evidenceDir, "browser-smoke.mjs");

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(5173, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function runHarness() {
  const child = spawn(process.execPath, [harnessPath], {
    cwd: repositoryRoot,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => (stdout += chunk));
  child.stderr.on("data", (chunk) => (stderr += chunk));

  const timeout = setTimeout(() => process.kill(-child.pid, "SIGKILL"), 20_000);
  const [code, signal] = await once(child, "exit");
  clearTimeout(timeout);
  return { code, signal, stdout, stderr };
}

test("browser smoke fails cleanly when port 5173 is already occupied", async () => {
  const blocker = createServer((_, response) => {
    response.writeHead(200, { "content-type": "text/html" });
    response.end("<title>EcoGrid Runtime Smoke</title><canvas></canvas>");
  });
  await listen(blocker);

  try {
    const result = await runHarness();
    const output = `${result.stdout}\n${result.stderr}`;

    assert.notEqual(result.code, 0, `harness unexpectedly succeeded:\n${output}`);
    assert.equal(result.signal, null, `harness was terminated by ${result.signal}`);
    assert.doesNotMatch(output, /BROWSER_SMOKE=PASS/);
    assert.doesNotMatch(output, /CHROME_VERSION=/);
    assert.match(output, /Port 5173 is already in use|Vite exited with code/);
  } finally {
    await close(blocker);
  }

  const probe = createServer();
  await listen(probe);
  await close(probe);
});
