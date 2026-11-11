import { spawn, spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { PROVISIONAL_EVENT_KEYS } from "../../../src/application/round-session/provisionalRoundManifest.mjs";

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
        const reset = document.querySelector('#reset-simulated-session');
        const diagnostic = document.querySelector('#run-malformed-input-diagnostic');
        const diagnosticDetails = document.querySelector('.simulation-diagnostic');
        const diagnosticSummary = diagnosticDetails?.querySelector('summary');
        const originalCanvas = document.querySelector('#game-container canvas');
        const readOutput = () => {
          const acceptedEntries = [...document.querySelectorAll('#accepted-input-values dd')];
          return {
            acceptedFields: Object.fromEntries(acceptedEntries.map((value) => [value.dataset.field, value.textContent ?? ''])),
            acceptedFieldCount: acceptedEntries.length,
            traceRows: [...document.querySelectorAll('#simulated-trace li')].map((row) => row.textContent ?? ''),
          };
        };
        const run = (firstInputAlreadyLoaded = false, diagnoseAfterFirstConfirmation = false) => {
          const snapshots = [];
          const transitions = [];
          let midSessionDiagnostic = !diagnoseAfterFirstConfirmation;
          for (let round = 0; round < 6; round += 1) {
            if (!firstInputAlreadyLoaded || round > 0) load?.click();
            const readyText = document.querySelector('#console-status')?.textContent ?? '';
            snapshots.push(readyText);
            const ready = readyText.includes('Entrada validada lista para confirmar.')
              && readyText.includes('ronda ' + (round + 1) + ' de 6')
              && readyText.includes('Confirmación disponible: sí.')
              && load?.disabled === true && confirm?.disabled === false && reset?.disabled === true;
            confirm?.click();
            const advancedText = document.querySelector('#console-status')?.textContent ?? '';
            snapshots.push(advancedText);
            const advanced = round === 5
              ? advancedText.includes('Sesión completada.') && reset?.disabled === false
              : advancedText.includes('ronda ' + (round + 2) + ' de 6')
                && advancedText.includes('NEW_INPUT_REQUIRED') && reset?.disabled === true;
            transitions.push({ ready, advanced });
            if (diagnoseAfterFirstConfirmation && round === 0) {
              diagnostic?.click();
              const diagnosticText = document.querySelector('#console-status')?.textContent ?? '';
              const diagnosticOutput = readOutput();
              midSessionDiagnostic = diagnosticText.includes('MALFORMED_JSON')
                && diagnosticText.includes('ronda 2 de 6')
                && diagnosticOutput.acceptedFieldCount === 0
                && diagnosticOutput.traceRows.length === 1
                && (document.querySelector('#observation-announcement')?.textContent ?? '')
                  === 'Sin entrada simulada aceptada. Rondas confirmadas: 1.';
            }
          }
          return { snapshots, transitions, midSessionDiagnostic, output: readOutput() };
        };
        const resetDisabledInitially = reset?.disabled === true;
        diagnosticSummary?.click();
        const detailsOpened = diagnosticDetails?.open === true;
        const traceBeforeDiagnostic = readOutput().traceRows;
        const diagnosticEnabledInitially = diagnostic?.disabled === false;
        diagnostic?.click();
        const diagnosticText = document.querySelector('#console-status')?.textContent ?? '';
        const diagnosticOutput = readOutput();
        const diagnosticAnnouncement = document.querySelector('#observation-announcement')?.textContent ?? '';
        const malformedRejected = diagnosticText.includes('Esperando una entrada validada.')
          && diagnosticText.includes('ronda 1 de 6') && diagnosticText.includes('MALFORMED_JSON')
          && diagnosticText.includes('Confirmación disponible: no.')
          && diagnosticOutput.acceptedFieldCount === 0
          && JSON.stringify(diagnosticOutput.traceRows) === JSON.stringify(traceBeforeDiagnostic)
          && load?.disabled === false && confirm?.disabled === true && reset?.disabled === true
          && diagnostic?.disabled === false
          && diagnosticAnnouncement === 'Sin entrada simulada aceptada. Rondas confirmadas: 0.';
        load?.click();
        const recoveredReadyText = document.querySelector('#console-status')?.textContent ?? '';
        const recoveredReady = recoveredReadyText.includes('Entrada validada lista para confirmar.')
          && recoveredReadyText.includes('ronda 1 de 6')
          && load?.disabled === true && confirm?.disabled === false && reset?.disabled === true
          && diagnostic?.disabled === true;
        const first = run(true, true);
        const resetEnabledAfterCompletion = reset?.disabled === false;
        reset?.click();
        const freshText = document.querySelector('#console-status')?.textContent ?? '';
        const freshOutput = readOutput();
        const fresh = freshText.includes('Esperando una entrada validada.')
          && freshText.includes('ronda 1 de 6')
          && freshText.includes('DEVICE_DISCONNECTED')
          && freshText.includes('Confirmación disponible: no.')
          && freshOutput.acceptedFieldCount === 0 && freshOutput.traceRows.length === 0
          && load?.disabled === false && confirm?.disabled === true && reset?.disabled === true
          && document.activeElement === load;
        const second = run();
        const finalText = document.querySelector('#console-status')?.textContent ?? '';
        const traceItems = [...document.querySelectorAll('#simulated-trace li')];
        const panel = document.querySelector('.observation-panel');
        const panelRect = panel?.getBoundingClientRect();
        const panelStyle = panel ? getComputedStyle(panel) : null;
        const controlCopyRect = document.querySelector('.simulated-controls > div:first-child')?.getBoundingClientRect();
        const controlRects = [load, confirm, reset].map((control) => control?.getBoundingClientRect());
        const diagnosticRects = [diagnosticSummary, diagnostic].map((control) => control?.getBoundingClientRect());
        const interactiveRects = [...controlRects, ...diagnosticRects];
        const controlsContained = controlRects.every((rect) => (rect?.width ?? 0) > 0
          && (rect?.height ?? 0) > 0 && (rect?.left ?? -1) >= 0 && (rect?.right ?? Infinity) <= window.innerWidth);
        const controlsDoNotOverlap = controlRects.every((rect, index) => controlRects.slice(index + 1)
          .every((other) => !rect || !other || rect.right <= other.left || other.right <= rect.left || rect.bottom <= other.top || other.bottom <= rect.top));
        return {
          roundsPerRun: first.transitions.length,
          detailsOpened,
          diagnosticEnabledInitially,
          malformedRejected,
          recoveredReady,
          midSessionDiagnostic: first.midSessionDiagnostic,
          allReady: [...first.transitions, ...second.transitions].every(({ ready }) => ready),
          allAdvanced: [...first.transitions, ...second.transitions].every(({ advanced }) => advanced),
          resetDisabledInitially,
          resetEnabledAfterCompletion,
          fresh,
          replaySnapshotsEqual: JSON.stringify(second.snapshots) === JSON.stringify(first.snapshots),
          replayAcceptedFieldsEqual: JSON.stringify(second.output.acceptedFields) === JSON.stringify(first.output.acceptedFields),
          replayTraceEqual: JSON.stringify(second.output.traceRows) === JSON.stringify(first.output.traceRows),
          sameCanvas: document.querySelectorAll('#game-container canvas').length === 1
            && document.querySelector('#game-container canvas') === originalCanvas,
          completed: finalText.includes('Sesión completada.')
            && finalText.includes('ronda 6 de 6')
            && finalText.includes('Confirmación disponible: no.'),
          terminalControls: load?.disabled === true && confirm?.disabled === true && reset?.disabled === false,
          acceptedFields: second.output.acceptedFields,
          acceptedFieldCount: second.output.acceptedFieldCount,
          panelRendered: (panelRect?.width ?? 0) > 0 && (panelRect?.height ?? 0) > 0
            && (panelRect?.left ?? -1) >= 0 && (panelRect?.right ?? Infinity) <= window.innerWidth
            && panelStyle?.display !== 'none' && panelStyle?.visibility !== 'hidden',
          controlsReadable: (controlCopyRect?.width ?? 0) >= 240 && controlsContained && controlsDoNotOverlap,
          diagnosticGeometry: diagnosticRects.every((rect) => (rect?.width ?? 0) > 0
             && (rect?.height ?? 0) > 0 && (rect?.left ?? -1) >= 0 && (rect?.right ?? Infinity) <= window.innerWidth)
             && interactiveRects.every((rect, index) => interactiveRects.slice(index + 1)
               .every((other) => !rect || !other || rect.right <= other.left || other.right <= rect.left || rect.bottom <= other.top || other.bottom <= rect.top)),
          traceRendered: traceItems.length === 6
            && traceItems.every((row) => { const rect = row.getBoundingClientRect(); return rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.right <= window.innerWidth; }),
          traceRows: second.output.traceRows,
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
      expression: `(() => { const load = document.querySelector('#load-simulated-input')?.getBoundingClientRect(); const confirm = document.querySelector('#confirm-simulated-round')?.getBoundingClientRect(); const reset = document.querySelector('#reset-simulated-session')?.getBoundingClientRect(); const diagnosticSummary = document.querySelector('.simulation-diagnostic summary')?.getBoundingClientRect(); const diagnostic = document.querySelector('#run-malformed-input-diagnostic')?.getBoundingClientRect(); const canvas = document.querySelector('#game-container canvas')?.getBoundingClientRect(); const panel = document.querySelector('.observation-panel')?.getBoundingClientRect(); const traceRows = [...document.querySelectorAll('#simulated-trace li')].map((row) => row.getBoundingClientRect()); const contained = (rect) => (rect?.width ?? 0) > 0 && (rect?.height ?? 0) > 0 && rect.left >= 0 && rect.right <= window.innerWidth; const interactive = [load, confirm, reset, diagnosticSummary, diagnostic]; const separate = interactive.every((rect, index) => interactive.slice(index + 1).every((other) => !rect || !other || rect.right <= other.left || other.right <= rect.left || rect.bottom <= other.top || other.bottom <= rect.top)); return { viewport: window.innerWidth === 390, noOverflow: document.documentElement.scrollWidth <= window.innerWidth, controlsVisible: [load, confirm, reset].every(contained), diagnosticVisible: [diagnosticSummary, diagnostic].every(contained) && separate, canvasVisible: contained(canvas), observationVisible: contained(panel) && traceRows.length === 6 && traceRows.every(contained) }; })()`,
      returnByValue: true,
    }, sessionId)).result.value;
    const expectedAcceptedFields = { sourceMode: 'Simulación local', sequence: '5', calibrationLabel: 'simulated-not-calibrated-v1', lightProxy: '0.5', temperature: '20', hydroSetpoint: '0.4', batteryMode: 'idle', loadPriority: 'balanced', confirm: 'sí' };
    const acceptedValues = interaction.acceptedFieldCount === Object.keys(expectedAcceptedFields).length
      && Object.keys(interaction.acceptedFields).length === Object.keys(expectedAcceptedFields).length
      && Object.entries(expectedAcceptedFields).every(([field, value]) => interaction.acceptedFields[field] === value);
    const expectedTrace = PROVISIONAL_EVENT_KEYS.map((eventKey, index) => `round-${index + 1} · evento provisional: ${eventKey} · secuencia: ${index}`);
    const orderedTrace = JSON.stringify(interaction.traceRows) === JSON.stringify(expectedTrace);
    const passed = observed?.ready && observed.shell && observed.secondary && observed.simulated && observed.waiting && observed.confirmationUnavailable && interaction.roundsPerRun === 6 && interaction.detailsOpened && interaction.diagnosticEnabledInitially && interaction.malformedRejected && interaction.recoveredReady && interaction.midSessionDiagnostic && interaction.allReady && interaction.allAdvanced && interaction.resetDisabledInitially && interaction.resetEnabledAfterCompletion && interaction.fresh && interaction.replaySnapshotsEqual && interaction.replayAcceptedFieldsEqual && interaction.replayTraceEqual && interaction.sameCanvas && interaction.completed && interaction.terminalControls && acceptedValues && interaction.panelRendered && interaction.controlsReadable && interaction.diagnosticGeometry && interaction.traceRendered && orderedTrace && mobile.viewport && mobile.noOverflow && mobile.controlsVisible && mobile.diagnosticVisible && mobile.canvasVisible && mobile.observationVisible && observed.canvasWidth > 0 && observed.canvasHeight > 0 && observed.rectWidth > 0 && observed.rectHeight > 0 && errors.length === 0 && screenshot.length > 0 && dimensions?.width === 800 && dimensions?.height === 450;
    if (!passed) throw new Error(`Browser assertions failed: ${JSON.stringify({ observed, interaction, mobile, errors: errors.length, screenshotBytes: screenshot.length, dimensions })}`);
    await writeFile(screenshotPath, screenshot);
    console.log(`CHROME_VERSION=${browser.version}`);
    console.log(`PRODUCT_BROWSER_SMOKE=PASS marker=true shell=true secondary=true mode=simulated initial_status=waiting-input diagnostic=malformed-rejected-recovered-counts-0-and-1 observation_panel=rendered accepted_values=exact trace_rows=6-ordered interaction=two-six-round-runs-identical reset=fresh-focused-load canvas_instance=preserved terminal_controls=load-confirm-disabled-reset-enabled mobile=390px-diagnostic-panel-visible-no-overflow canvas=${observed.canvasWidth}x${observed.canvasHeight} displayed=${observed.rectWidth}x${observed.rectHeight} screenshot=${dimensions.width}x${dimensions.height} screenshot_bytes=${screenshot.length} javascript_errors=${errors.length}`);
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
