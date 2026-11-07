import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(evidenceDir, "../../..");
const screenshotPath = path.join(evidenceDir, "product-browser-smoke.png");
const url = "http://127.0.0.1:4173/";
const marker = "<title>EcoGrid | Consola local</title>";
const children = new Set();

function start(command, args, options = {}) {
  const child = spawn(command, args, {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
}

function killGroup(child, signal) {
  if (child && child.exitCode === null && child.signalCode === null) {
    try {
      process.kill(-child.pid, signal);
    } catch (error) {
      if (error.code !== "ESRCH") throw error;
    }
  }
}

function waitForExit(child, timeoutMs) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.off("exit", onExit);
      reject(new Error(`Process ${child.pid} did not exit within ${timeoutMs} ms`));
    }, timeoutMs);
    const onExit = () => {
      clearTimeout(timer);
      resolve();
    };
    child.once("exit", onExit);
  });
}

async function stop(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  killGroup(child, "SIGTERM");
  try {
    await waitForExit(child, 3_000);
  } catch {
    killGroup(child, "SIGKILL");
    await waitForExit(child, 2_000);
  }
}

function chromeCommand() {
  for (const command of ["google-chrome", "chromium", "chromium-browser"]) {
    const result = spawnSync(command, ["--version"], { encoding: "utf8" });
    if (result.status === 0) return { command, version: result.stdout.trim() };
  }
  throw new Error("No installed Chrome or Chromium executable was found");
}

async function waitForProduct(server) {
  let output = "";
  server.stdout.setEncoding("utf8");
  server.stderr.setEncoding("utf8");
  server.stdout.on("data", (chunk) => (output += chunk));
  server.stderr.on("data", (chunk) => (output += chunk));
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null || server.signalCode !== null) {
      throw new Error(`Vite exited before readiness: ${output.trim()}`);
    }
    if (output.includes("http://127.0.0.1:4173/")) {
      const response = await fetch(url);
      const body = await response.text();
      if (server.exitCode !== null || server.signalCode !== null) {
        throw new Error("Vite exited during the product ownership check");
      }
      if (response.status === 200 && body.includes(marker)) return;
      throw new Error(`Product marker check failed: status=${response.status} marker=${body.includes(marker)}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Product readiness timed out: ${output.trim()}`);
}

async function debuggerUrl(chrome) {
  let pending = "";
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome DevTools endpoint timed out")), 10_000);
    chrome.stderr.setEncoding("utf8");
    chrome.stderr.on("data", (chunk) => {
      pending += chunk;
      const match = pending.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    chrome.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Chrome exited before verification with code ${code}`));
    });
  });
}

async function connect(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const listeners = new Set();
  let id = 0;
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const promise = pending.get(message.id);
      pending.delete(message.id);
      message.error ? promise.reject(new Error(message.error.message)) : promise.resolve(message.result);
    } else {
      for (const listener of listeners) listener(message);
    }
  });
  return {
    close: () => socket.close(),
    onEvent: (listener) => listeners.add(listener),
    send(method, params = {}, sessionId) {
      const messageId = ++id;
      socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
      return new Promise((resolve, reject) => pending.set(messageId, { resolve, reject }));
    },
  };
}

function pngDimensions(buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function run() {
  await mkdir(evidenceDir, { recursive: true });
  const browser = chromeCommand();
  const server = start("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], { cwd: root });
  let chrome;
  let cdp;
  let primaryError;

  try {
    await waitForProduct(server);
    chrome = start(browser.command, [
      "--headless=new", "--window-size=800,450", "--force-device-scale-factor=1",
      "--hide-scrollbars", "--remote-debugging-port=0", "about:blank",
    ]);
    cdp = await connect(await debuggerUrl(chrome));
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    const errors = [];
    cdp.onEvent((message) => {
      if (message.sessionId !== sessionId) return;
      if (message.method === "Runtime.exceptionThrown") errors.push(message.params);
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") errors.push(message.params);
      if (message.method === "Log.entryAdded" && message.params.entry.level === "error" && message.params.entry.source === "javascript") errors.push(message.params);
    });
    await Promise.all([
      cdp.send("Page.enable", {}, sessionId), cdp.send("Runtime.enable", {}, sessionId),
      cdp.send("Log.enable", {}, sessionId),
      cdp.send("Emulation.setDeviceMetricsOverride", { width: 800, height: 450, deviceScaleFactor: 1, mobile: false }, sessionId),
    ]);
    await cdp.send("Page.navigate", { url }, sessionId);

    let observed;
    const deadline = Date.now() + 5_000;
    while (!observed?.ready && Date.now() < deadline) {
      try {
        const evaluation = await cdp.send("Runtime.evaluate", {
          expression: `(() => { const host = document.querySelector('#game-container'); const canvas = host?.querySelector('canvas'); const text = document.body?.innerText ?? ''; return { ready: document.readyState === 'complete' && Boolean(canvas), shell: text.includes('EcoGrid: Ciudad al Límite'), secondary: text.includes('Consola local secundaria'), simulated: text.toLowerCase().includes('modo simulado'), waiting: text.includes('Esperando una entrada validada.'), confirmationUnavailable: text.includes('Confirmación disponible: no.'), canvasWidth: canvas?.width ?? 0, canvasHeight: canvas?.height ?? 0, rectWidth: canvas?.getBoundingClientRect().width ?? 0, rectHeight: canvas?.getBoundingClientRect().height ?? 0 }; })()`,
          returnByValue: true,
        }, sessionId);
        observed = evaluation.result.value;
      } catch {
        // Navigation can briefly replace the execution context.
      }
      if (!observed?.ready) await new Promise((resolve) => setTimeout(resolve, 100));
    }
    const interaction = (await cdp.send("Runtime.evaluate", {
      expression: `(() => {
        const load = document.querySelector('#load-simulated-input');
        const confirm = document.querySelector('#confirm-simulated-round');
        const transitions = [];
        for (let round = 0; round < 6; round += 1) {
          load?.click();
          const readyText = document.querySelector('#console-status')?.textContent ?? '';
          const ready = readyText.includes('Entrada validada lista para confirmar.')
            && readyText.includes('ronda ' + (round + 1) + ' de 6')
            && readyText.includes('Confirmación disponible: sí.')
            && load?.disabled === true && confirm?.disabled === false;
          confirm?.click();
          const advancedText = document.querySelector('#console-status')?.textContent ?? '';
          const advanced = round === 5
            ? advancedText.includes('Sesión completada.')
            : advancedText.includes('ronda ' + (round + 2) + ' de 6')
              && advancedText.includes('NEW_INPUT_REQUIRED');
          transitions.push({ ready, advanced });
        }
        const finalText = document.querySelector('#console-status')?.textContent ?? '';
        return {
          rounds: transitions.length,
          allReady: transitions.every(({ ready }) => ready),
          allAdvanced: transitions.every(({ advanced }) => advanced),
          completed: finalText.includes('Sesión completada.')
            && finalText.includes('ronda 6 de 6')
            && finalText.includes('Confirmación disponible: no.'),
          controlsDisabled: load?.disabled === true && confirm?.disabled === true,
        };
      })()`,
      returnByValue: true,
    }, sessionId)).result.value;
    await new Promise((resolve) => setTimeout(resolve, 300));
    const capture = await cdp.send("Page.captureScreenshot", { format: "png" }, sessionId);
    const screenshot = Buffer.from(capture.data, "base64");
    const dimensions = pngDimensions(screenshot);
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const mobile = (await cdp.send("Runtime.evaluate", {
      expression: `(() => { const load = document.querySelector('#load-simulated-input')?.getBoundingClientRect(); const confirm = document.querySelector('#confirm-simulated-round')?.getBoundingClientRect(); const canvas = document.querySelector('#game-container canvas')?.getBoundingClientRect(); return { viewport: window.innerWidth === 390, noOverflow: document.documentElement.scrollWidth <= window.innerWidth, controlsVisible: (load?.width ?? 0) > 0 && (confirm?.width ?? 0) > 0, canvasVisible: (canvas?.width ?? 0) > 0 && (canvas?.height ?? 0) > 0 }; })()`,
      returnByValue: true,
    }, sessionId)).result.value;
    const passed = observed?.ready && observed.shell && observed.secondary && observed.simulated && observed.waiting && observed.confirmationUnavailable && interaction.rounds === 6 && interaction.allReady && interaction.allAdvanced && interaction.completed && interaction.controlsDisabled && mobile.viewport && mobile.noOverflow && mobile.controlsVisible && mobile.canvasVisible && observed.canvasWidth > 0 && observed.canvasHeight > 0 && observed.rectWidth > 0 && observed.rectHeight > 0 && errors.length === 0 && screenshot.length > 0 && dimensions?.width === 800 && dimensions?.height === 450;
    if (!passed) throw new Error(`Browser assertions failed: ${JSON.stringify({ observed, interaction, mobile, errors: errors.length, screenshotBytes: screenshot.length, dimensions })}`);
    await writeFile(screenshotPath, screenshot);
    console.log(`CHROME_VERSION=${browser.version}`);
    console.log(`PRODUCT_BROWSER_SMOKE=PASS marker=true shell=true secondary=true mode=simulated initial_status=waiting-input interaction=six-rounds-completed controls=disabled mobile=390px-no-overflow canvas=${observed.canvasWidth}x${observed.canvasHeight} displayed=${observed.rectWidth}x${observed.rectHeight} screenshot=${dimensions.width}x${dimensions.height} screenshot_bytes=${screenshot.length} javascript_errors=${errors.length}`);
  } catch (error) {
    primaryError = error;
  } finally {
    cdp?.close();
    const cleanup = await Promise.allSettled([stop(chrome), stop(server)]);
    const cleanupFailure = cleanup.find((result) => result.status === "rejected");
    if (cleanupFailure) primaryError = new Error(`Cleanup failed: ${cleanupFailure.reason}`);
  }
  if (primaryError) throw primaryError;
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => void Promise.allSettled([...children].map(stop)).finally(() => process.exit(1)));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
