import { spawn, spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const evidenceDir = path.dirname(new URL(import.meta.url).pathname);
const repositoryRoot = path.resolve(evidenceDir, "../../..");
const spikeDir = path.join(repositoryRoot, "spikes/runtime-smoke");
const pageUrl = "http://127.0.0.1:5173";
const pageMarker = "<title>EcoGrid Runtime Smoke</title>";
const screenshotPath = path.join(evidenceDir, "browser-smoke.png");
const domPath = path.join(evidenceDir, "browser-smoke.dom.html");
const managedProcesses = new Set();

function startProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  managedProcesses.add(child);
  child.once("exit", () => managedProcesses.delete(child));
  return child;
}

function signalProcess(child, signal = "SIGTERM") {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  try {
    process.kill(-child.pid, signal);
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
}

async function waitForExit(child, timeoutMs = 5_000) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  await new Promise((resolve, reject) => {
    const onExit = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      child.off("exit", onExit);
      reject(new Error(`Process ${child.pid} did not exit in time`));
    }, timeoutMs);
    child.once("exit", onExit);
  });
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  signalProcess(child);
  try {
    await waitForExit(child, 3_000);
  } catch {
    signalProcess(child, "SIGKILL");
    await waitForExit(child, 2_000);
  }
}

async function stopAllProcesses() {
  await Promise.allSettled([...managedProcesses].map(stopProcess));
}

async function runChromeArtifact() {
  const chrome = startProcess("google-chrome", [
    "--headless=new",
    "--window-size=800,450",
    "--force-device-scale-factor=1",
    "--hide-scrollbars",
    "--virtual-time-budget=5000",
    `--screenshot=${screenshotPath}`,
    "--dump-dom",
    pageUrl,
  ]);
  let stdout = "";
  let stderr = "";
  chrome.stdout.setEncoding("utf8");
  chrome.stderr.setEncoding("utf8");
  chrome.stdout.on("data", (chunk) => (stdout += chunk));
  chrome.stderr.on("data", (chunk) => (stderr += chunk));
  await waitForExit(chrome, 15_000);
  if (chrome.exitCode !== 0) throw new Error(`Artifact Chrome failed: ${stderr.trim()}`);
  return stdout;
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    const exitCode = 128 + (signal === "SIGINT" ? 2 : signal === "SIGTERM" ? 15 : 1);
    void stopAllProcesses().finally(() => process.exit(exitCode));
  });
}

async function waitForVite(server) {
  let output = "";

  await new Promise((resolve, reject) => {
    const onData = (chunk) => {
      output += chunk;
      if (output.includes("http://127.0.0.1:5173/")) finish(resolve);
    };
    const onExit = (code) => finish(reject, new Error(`Vite exited with code ${code}: ${output.trim()}`));
    const timer = setTimeout(
      () => finish(reject, new Error(`Vite was not ready within 15 seconds: ${output.trim()}`)),
      15_000,
    );
    const finish = (complete, value) => {
      clearTimeout(timer);
      server.stdout.off("data", onData);
      server.stderr.off("data", onData);
      server.off("exit", onExit);
      complete(value);
    };

    server.stdout.setEncoding("utf8");
    server.stderr.setEncoding("utf8");
    server.stdout.on("data", onData);
    server.stderr.on("data", onData);
    server.once("exit", onExit);
  });

  if (server.exitCode !== null || server.signalCode !== null) {
    throw new Error("Vite exited before the ownership check");
  }
  const response = await fetch(pageUrl);
  const body = await response.text();
  if (server.exitCode !== null || server.signalCode !== null) {
    throw new Error("Vite exited during the ownership check");
  }
  if (response.status !== 200 || !body.includes(pageMarker)) {
    throw new Error(`Owned page check failed: status=${response.status} marker=${body.includes(pageMarker)}`);
  }
}

async function waitForDebuggerUrl(chrome, stderrLines) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome DevTools endpoint was not ready")), 10_000);
    let pending = "";

    chrome.stderr.setEncoding("utf8");
    chrome.stderr.on("data", (chunk) => {
      pending += chunk;
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      for (const line of lines) {
        stderrLines.push(line);
        const match = line.match(/DevTools listening on (ws:\/\/\S+)/);
        if (match) {
          clearTimeout(timer);
          resolve(match[1]);
        }
      }
    });
    chrome.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before verification with code ${code}`));
    });
  });
}

async function openCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const listeners = new Set();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    for (const listener of listeners) listener(message);
  });

  return {
    close: () => socket.close(),
    onEvent: (listener) => listeners.add(listener),
    send(method, params = {}, sessionId) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
  };
}

async function run() {
  await mkdir(evidenceDir, { recursive: true });
  const version = spawnSync("google-chrome", ["--version"], { encoding: "utf8" }).stdout.trim();
  const server = startProcess(
    "npm",
    ["run", "dev", "--", "--host", "127.0.0.1", "--port", "5173", "--strictPort"],
    { cwd: spikeDir },
  );
  const chromeStderr = [];
  let chrome;
  let cdp;

  try {
    await waitForVite(server);
    console.log("VITE_READY=true");

    chrome = startProcess("google-chrome", [
      "--headless=new",
      "--window-size=800,450",
      "--force-device-scale-factor=1",
      "--hide-scrollbars",
      "--remote-debugging-port=0",
      "about:blank",
    ]);

    const debuggerUrl = await waitForDebuggerUrl(chrome, chromeStderr);
    cdp = await openCdp(debuggerUrl);
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    const runtimeErrors = [];

    cdp.onEvent((message) => {
      if (message.sessionId !== sessionId) return;
      if (message.method === "Runtime.exceptionThrown") runtimeErrors.push(message.params);
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
        runtimeErrors.push(message.params);
      }
      if (
        message.method === "Log.entryAdded" &&
        message.params.entry.level === "error" &&
        message.params.entry.source === "javascript"
      ) {
        runtimeErrors.push(message.params);
      }
    });

    await Promise.all([
      cdp.send("Page.enable", {}, sessionId),
      cdp.send("Runtime.enable", {}, sessionId),
      cdp.send("Log.enable", {}, sessionId),
      cdp.send(
        "Emulation.setDeviceMetricsOverride",
        { width: 800, height: 450, deviceScaleFactor: 1, mobile: false },
        sessionId,
      ),
    ]);

    await cdp.send("Page.navigate", { url: pageUrl }, sessionId);

    let canvas = false;
    const deadline = Date.now() + 5_000;
    while (!canvas && Date.now() < deadline) {
      try {
        const result = await cdp.send(
          "Runtime.evaluate",
          {
            expression: "document.readyState === 'complete' && Boolean(document.querySelector('canvas'))",
            returnByValue: true,
          },
          sessionId,
        );
        canvas = result.result.value === true;
      } catch {
        // Navigation can briefly replace the execution context.
      }
      if (!canvas) await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    await cdp.send("Browser.close");
    await waitForExit(chrome);
    cdp = undefined;
    chrome = undefined;

    const dom = await runChromeArtifact();
    const screenshotBuffer = await readFile(screenshotPath);

    await writeFile(domPath, `${dom}\n`, "utf8");

    const domHasCanvas = dom.includes("<canvas");
    const screenshotNonEmpty = screenshotBuffer.length > 0;
    const passed = canvas && domHasCanvas && screenshotNonEmpty && runtimeErrors.length === 0;

    console.log(`CHROME_VERSION=${version}`);
    console.log(
      `BROWSER_SMOKE=${passed ? "PASS" : "FAIL"} canvas=${canvas && domHasCanvas} screenshot_bytes=${screenshotBuffer.length} console_runtime_errors=${runtimeErrors.length}`,
    );

    if (!passed) {
      console.error(`BROWSER_ERRORS=${JSON.stringify(runtimeErrors)}`);
      throw new Error("Browser smoke assertions failed");
    }
  } finally {
    cdp?.close();
    await Promise.allSettled([stopProcess(chrome), stopProcess(server)]);
  }
}

run().catch((error) => {
  console.error(error);
  void stopAllProcesses().finally(() => {
    process.exitCode = 1;
  });
});
