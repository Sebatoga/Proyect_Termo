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
const EXPECTED_ROUND_GUIDES = Object.freeze([
  Object.freeze({
    eventKey: "base-demand",
    title: "Condición base",
    question: "¿Entendemos el tablero y qué cargas debemos priorizar?",
  }),
  Object.freeze({
    eventKey: "high-temperature",
    title: "Temperatura alta",
    question: "¿Cómo cambia la estrategia cuando el panel trabaja más caliente?",
  }),
  Object.freeze({
    eventKey: "low-river",
    title: "Río bajo",
    question: "¿Qué consigna hidro es posible sin vulnerar el caudal ecológico?",
  }),
  Object.freeze({
    eventKey: "demand-peak",
    title: "Pico de demanda",
    question: "¿Qué cargas protegemos y cuándo usamos la batería?",
  }),
  Object.freeze({
    eventKey: "reduced-light",
    title: "Luz reducida",
    question: "¿Cómo administramos la reserva sin inventar generación?",
  }),
  Object.freeze({
    eventKey: "seeded-combination",
    title: "Combinación final",
    question: "¿Podemos sostener la ciudad y justificar todas las decisiones?",
  }),
]);

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
          expression: `(() => { const host = document.querySelector('#game-container'); const canvas = host?.querySelector('canvas'); const text = document.body?.innerText ?? ''; const guide = document.querySelector('#round-guide'); const notice = document.querySelector('#session-notice'); return { ready: document.readyState === 'complete' && Boolean(canvas), shell: text.includes('EcoGrid: Ciudad al Límite'), secondary: text.includes('Consola local secundaria'), simulated: text.toLowerCase().includes('modo simulado'), waiting: text.includes('Esperando una entrada validada.'), confirmationUnavailable: text.includes('Confirmación disponible: no.'), initialGuide: guide?.hidden === false && guide?.dataset.eventKey === 'base-demand' && document.querySelector('#round-guide-title')?.textContent === 'Condición base' && document.querySelector('#round-guide-question')?.textContent?.trim() === '¿Entendemos el tablero y qué cargas debemos priorizar?', initialNotice: notice?.hidden === false && notice?.dataset.level === 'attention' && document.querySelector('#session-notice-label')?.textContent === 'Atención' && document.querySelector('#session-notice-title')?.textContent === 'Entrada desconectada', canvasWidth: canvas?.width ?? 0, canvasHeight: canvas?.height ?? 0, rectWidth: canvas?.getBoundingClientRect().width ?? 0, rectHeight: canvas?.getBoundingClientRect().height ?? 0 }; })()`,
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
        const deviceLines = document.querySelector('#device-lines');
        const processDevice = document.querySelector('#process-device-lines');
        const disconnectDevice = document.querySelector('#disconnect-device');
        const resetDevice = document.querySelector('#reset-device-reading');
        const diagnostic = document.querySelector('#run-malformed-input-diagnostic');
        const diagnosticDetails = document.querySelector('.simulation-diagnostic');
        const diagnosticSummary = diagnosticDetails?.querySelector('summary');
        const actionGroup = document.querySelector('.simulation-actions');
        const actionLegend = actionGroup?.querySelector('legend');
        const actionHelp = document.querySelector('#simulation-actions-help');
        const skipLink = document.querySelector('.skip-link');
        const mainContent = document.querySelector('#main-content');
        const originalCanvas = document.querySelector('#game-container canvas');
        const readOutput = () => {
          const acceptedEntries = [...document.querySelectorAll('#accepted-input-values dd')];
          return {
            acceptedFields: Object.fromEntries(acceptedEntries.map((value) => [value.dataset.field, value.textContent ?? ''])),
            acceptedFieldCount: acceptedEntries.length,
            traceRows: [...document.querySelectorAll('#simulated-trace li')].map((row) => row.textContent ?? ''),
          };
        };
        const readNotice = () => {
          const container = document.querySelector('#session-notice');
          const rect = container?.getBoundingClientRect();
          return {
            hidden: container?.hidden !== false,
            level: container?.dataset.level ?? '',
            label: document.querySelector('#session-notice-label')?.textContent ?? '',
            title: document.querySelector('#session-notice-title')?.textContent ?? '',
            message: document.querySelector('#session-notice-message')?.textContent ?? '',
            visible: container?.hidden === false
              && (rect?.width ?? 0) > 0
              && (rect?.height ?? 0) > 0
              && (rect?.left ?? -1) >= 0
              && (rect?.right ?? Infinity) <= window.innerWidth,
          };
        };
        const expectedRoundGuides = ${JSON.stringify(EXPECTED_ROUND_GUIDES)};
        const run = (firstInputAlreadyLoaded = false, diagnoseAfterFirstConfirmation = false) => {
          const snapshots = [];
          const transitions = [];
          const roundGuides = [];
          let midSessionDiagnostic = !diagnoseAfterFirstConfirmation;
          for (let round = 0; round < 6; round += 1) {
            if (!firstInputAlreadyLoaded || round > 0) load?.click();
            const readyText = document.querySelector('#console-status')?.textContent ?? '';
            const expectedGuide = expectedRoundGuides[round];
            const guideContainer = document.querySelector('#round-guide');
            const guideTitle = document.querySelector('#round-guide-title')?.textContent ?? '';
            const guideQuestion = document.querySelector('#round-guide-question')?.textContent ?? '';
            const guideRect = guideContainer?.getBoundingClientRect();
            snapshots.push(readyText);
            roundGuides.push({
              eventKey: guideContainer?.dataset.eventKey ?? '',
              title: guideTitle,
              question: guideQuestion,
              visible: guideContainer?.hidden === false
                && (guideRect?.width ?? 0) > 0
                && (guideRect?.height ?? 0) > 0
                && (guideRect?.left ?? -1) >= 0
                && (guideRect?.right ?? Infinity) <= window.innerWidth,
            });
            const ready = readyText.includes('Entrada validada lista para confirmar.')
              && readyText.includes('ronda ' + (round + 1) + ' de 6')
              && roundGuides[round].visible
              && readNotice().hidden
              && readyText.includes('Confirmación disponible: sí.')
              && load?.disabled === true && confirm?.disabled === false && reset?.disabled === true
              && document.activeElement === confirm;
            confirm?.click();
            const advancedText = document.querySelector('#console-status')?.textContent ?? '';
            const advancedNotice = readNotice();
            snapshots.push(advancedText);
            const advanced = round === 5
              ? advancedText.includes('Sesión completada.')
                && advancedNotice.hidden
                && reset?.disabled === false
                && document.activeElement === reset
              : advancedText.includes('ronda ' + (round + 2) + ' de 6')
                && advancedText.includes('NEW_INPUT_REQUIRED')
                && advancedNotice.visible
                && advancedNotice.label === 'Siguiente paso'
                && advancedNotice.title === 'Nueva entrada requerida'
                && reset?.disabled === true
                && document.activeElement === load;
            transitions.push({ ready, advanced });
            if (diagnoseAfterFirstConfirmation && round === 0) {
              diagnostic?.click();
              const diagnosticText = document.querySelector('#console-status')?.textContent ?? '';
              const diagnosticOutput = readOutput();
              const diagnosticNotice = readNotice();
              midSessionDiagnostic = diagnosticText.includes('MALFORMED_JSON')
                && diagnosticNotice.visible
                && diagnosticNotice.title === 'Entrada rechazada o pendiente'
                && diagnosticText.includes('ronda 2 de 6')
                && document.activeElement === load
                && diagnosticOutput.acceptedFieldCount === 0
                && diagnosticOutput.traceRows.length === 1
                && (document.querySelector('#observation-announcement')?.textContent ?? '')
                  === 'Sin entrada simulada aceptada. Rondas confirmadas: 1.';
            }
          }
          return { snapshots, transitions, roundGuides, midSessionDiagnostic, output: readOutput() };
        };
        skipLink?.focus();
        const skipRect = skipLink?.getBoundingClientRect();
        const skipVisibleOnFocus = document.activeElement === skipLink
          && (skipRect?.width ?? 0) > 0
          && (skipRect?.height ?? 0) > 0
          && (skipRect?.top ?? -1) >= 0
          && (skipRect?.left ?? -1) >= 0
          && (skipRect?.right ?? Infinity) <= window.innerWidth;
        skipLink?.click();
        const skipNavigation = skipVisibleOnFocus
          && location.hash === '#main-content'
          && document.activeElement === mainContent;
        const resetDisabledInitially = reset?.disabled === true;
        diagnosticSummary?.click();
        const detailsOpened = diagnosticDetails?.open === true;
        const traceBeforeDiagnostic = readOutput().traceRows;
        const diagnosticEnabledInitially = diagnostic?.disabled === false;
        diagnostic?.click();
        const diagnosticText = document.querySelector('#console-status')?.textContent ?? '';
        const diagnosticOutput = readOutput();
        const diagnosticNotice = readNotice();
        const diagnosticAnnouncement = document.querySelector('#observation-announcement')?.textContent ?? '';
        const malformedRejected = diagnosticText.includes('Esperando una entrada validada.')
          && diagnosticText.includes('ronda 1 de 6') && diagnosticText.includes('MALFORMED_JSON')
          && diagnosticText.includes('Confirmación disponible: no.')
          && diagnosticNotice.visible
          && diagnosticNotice.level === 'attention'
          && diagnosticNotice.label === 'Atención'
          && diagnosticNotice.title === 'Entrada rechazada o pendiente'
          && document.activeElement === load
          && diagnosticOutput.acceptedFieldCount === 0
          && JSON.stringify(diagnosticOutput.traceRows) === JSON.stringify(traceBeforeDiagnostic)
          && load?.disabled === false && confirm?.disabled === true && reset?.disabled === true
          && diagnostic?.disabled === false
          && diagnosticAnnouncement === 'Sin entrada simulada aceptada. Rondas confirmadas: 0.';
        load?.click();
        const recoveredReadyText = document.querySelector('#console-status')?.textContent ?? '';
        const recoveredReady = recoveredReadyText.includes('Entrada validada lista para confirmar.')
          && recoveredReadyText.includes('ronda 1 de 6')
          && readNotice().hidden
          && document.activeElement === confirm
          && load?.disabled === true && confirm?.disabled === false && reset?.disabled === true
          && diagnostic?.disabled === true;
        const first = run(true, true);
        const resetEnabledAfterCompletion = reset?.disabled === false;
        reset?.click();
        const freshText = document.querySelector('#console-status')?.textContent ?? '';
        const freshOutput = readOutput();
        const freshNotice = readNotice();
        const fresh = freshText.includes('Esperando una entrada validada.')
          && freshText.includes('ronda 1 de 6')
          && freshText.includes('DEVICE_DISCONNECTED')
          && freshText.includes('Confirmación disponible: no.')
          && freshNotice.visible
          && freshNotice.level === 'attention'
          && freshNotice.title === 'Entrada desconectada'
          && freshOutput.acceptedFieldCount === 0 && freshOutput.traceRows.length === 0
          && load?.disabled === false && confirm?.disabled === true && reset?.disabled === true
          && document.activeElement === load;
        const second = run();
        const finalText = document.querySelector('#console-status')?.textContent ?? '';
        const terminalControls = load?.disabled === true
          && confirm?.disabled === true
          && reset?.disabled === false
          && document.activeElement === reset;
        const gameStateBeforeDevice = {
          status: finalText,
          traceRows: readOutput().traceRows,
          acceptedFields: readOutput().acceptedFields,
        };
        const nominalDeviceLines = [
          {
            type: 'hello', protocolVersion: 1, sequence: 0, uptimeMs: 0,
            calibrationVersion: 'smoke-v1', status: 'valid', capabilities: ['inputs', 'output'],
          },
          {
            type: 'inputs', protocolVersion: 1, sequence: 1, uptimeMs: 100,
            calibrationVersion: 'smoke-v1', status: 'valid',
            values: {
              lightProxy: { value: 0.72, status: 'valid' },
              temperature: { value: 24.5, status: 'valid' },
              hydroSetpoint: { value: 0.4, status: 'valid' },
              batteryMode: { value: 'idle', status: 'valid' },
              loadPriority: { value: 'balanced', status: 'valid' },
              confirm: { value: false, status: 'valid' },
            },
          },
        ].map((line) => JSON.stringify(line)).join(String.fromCharCode(10));
        deviceLines.value = nominalDeviceLines;
        processDevice?.click();
        const deviceValid = document.querySelector('#device-status')?.dataset.level === 'valid'
          && document.querySelectorAll('#device-values dd').length === 6
          && document.querySelector('#device-values [data-field="temperature"]')?.textContent === '24.5'
          && document.querySelector('#device-summary')?.textContent?.includes('no modifican la partida')
          && disconnectDevice?.disabled === false
          && resetDevice?.disabled === false;
        deviceLines.value = '{not json';
        processDevice?.click();
        const deviceInvalid = document.querySelector('#device-status')?.dataset.level === 'invalid'
          && document.querySelector('#device-issue')?.textContent?.includes('MALFORMED_JSON')
          && [...document.querySelectorAll('#device-values dd')].length === 6
          && [...document.querySelectorAll('#device-values dd')].every((row) => row.textContent === 'sin valor');
        const recoveryMessage = JSON.parse(nominalDeviceLines.split(String.fromCharCode(10))[1]);
        recoveryMessage.sequence = 2;
        recoveryMessage.uptimeMs = 200;
        deviceLines.value = JSON.stringify(recoveryMessage);
        processDevice?.click();
        const deviceRecoveredWithoutReset = document.querySelector('#device-status')?.dataset.level === 'valid'
          && document.querySelector('#device-issue')?.hidden === true
          && document.querySelector('#device-values [data-field="temperature"]')?.textContent === '24.5';
        resetDevice?.click();
        const deviceReset = document.querySelector('#device-status')?.dataset.level === 'empty'
          && document.querySelector('#device-values')?.children.length === 0
          && disconnectDevice?.disabled === true;
        const deviceResetClearsInput = deviceLines?.value === ''
          && document.activeElement === deviceLines
          && deviceLines.matches(':focus-visible')
          && getComputedStyle(deviceLines).outlineStyle !== 'none'
          && getComputedStyle(deviceLines).outlineWidth !== '0px';
        deviceLines.value = JSON.stringify({
          type: 'hello',
          protocolVersion: 1,
          sequence: 0,
          uptimeMs: 0,
          calibrationVersion: 'smoke-v1',
          status: 'valid',
          capabilities: ['inputs', 'output'],
        });
        processDevice?.click();
        const deviceAwaitingInput = document.querySelector('#device-status')?.dataset.level === 'awaiting-input'
          && document.querySelector('#device-status')?.textContent === 'Saludo aceptado; entradas pendientes'
          && document.querySelector('#device-issue')?.hidden === true
          && [...document.querySelectorAll('#device-values dd')].length === 6
          && [...document.querySelectorAll('#device-values dd')].every((row) => row.textContent === 'sin valor');
        resetDevice?.click();
        const deviceHelloResetClean = document.querySelector('#device-status')?.dataset.level === 'empty'
          && deviceLines?.value === ''
          && document.activeElement === deviceLines;
        deviceLines.value = nominalDeviceLines;
        processDevice?.click();
        disconnectDevice?.click();
        const deviceDisconnected = document.querySelector('#device-status')?.dataset.level === 'disconnected'
          && document.querySelector('#device-issue')?.textContent?.includes('DISCONNECTED')
          && [...document.querySelectorAll('#device-values dd')].length === 6
          && [...document.querySelectorAll('#device-values dd')].every((row) => row.textContent === 'sin valor');
        const deviceResetAfterDisconnect = resetDevice?.disabled === false;
        resetDevice?.click();
        const gameUnchangedByDevice = document.querySelector('#console-status')?.textContent === gameStateBeforeDevice.status
          && JSON.stringify(readOutput().traceRows) === JSON.stringify(gameStateBeforeDevice.traceRows)
          && JSON.stringify(readOutput().acceptedFields) === JSON.stringify(gameStateBeforeDevice.acceptedFields);
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
          skipNavigation,
          deviceValid,
          deviceInvalid,
          deviceRecoveredWithoutReset,
          deviceReset,
          deviceResetClearsInput,
          deviceAwaitingInput,
          deviceHelloResetClean,
          deviceDisconnected,
          deviceResetAfterDisconnect,
          gameUnchangedByDevice,
          actionSemantics: actionGroup instanceof HTMLFieldSetElement
            && actionGroup.getAttribute('aria-describedby') === 'simulation-actions-help'
            && actionLegend?.textContent?.trim() === 'Acciones de la prueba simulada'
            && (actionHelp?.textContent ?? '').includes('el foco avanzará al siguiente paso')
            && [load, confirm, reset].every((control) => control instanceof HTMLButtonElement
              && control.type === 'button'),
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
          replayRoundGuidesEqual: JSON.stringify(second.roundGuides) === JSON.stringify(first.roundGuides),
          roundGuides: second.roundGuides,
          replayAcceptedFieldsEqual: JSON.stringify(second.output.acceptedFields) === JSON.stringify(first.output.acceptedFields),
          replayTraceEqual: JSON.stringify(second.output.traceRows) === JSON.stringify(first.output.traceRows),
          sameCanvas: document.querySelectorAll('#game-container canvas').length === 1
            && document.querySelector('#game-container canvas') === originalCanvas,
          completed: finalText.includes('Sesión completada.')
            && finalText.includes('ronda 6 de 6')
            && finalText.includes('Confirmación disponible: no.')
            && readNotice().hidden,
          terminalControls,
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
    const responsiveExpression = `(() => {
      const load = document.querySelector('#load-simulated-input')?.getBoundingClientRect();
      const confirm = document.querySelector('#confirm-simulated-round')?.getBoundingClientRect();
      const reset = document.querySelector('#reset-simulated-session')?.getBoundingClientRect();
      const diagnosticSummary = document.querySelector('.simulation-diagnostic summary')?.getBoundingClientRect();
      const diagnostic = document.querySelector('#run-malformed-input-diagnostic')?.getBoundingClientRect();
      const canvas = document.querySelector('#game-container canvas')?.getBoundingClientRect();
      const status = document.querySelector('#console-status')?.getBoundingClientRect();
      const actions = document.querySelector('.simulation-actions')?.getBoundingClientRect();
      const actionHelp = document.querySelector('#simulation-actions-help')?.getBoundingClientRect();
      const panel = document.querySelector('.observation-panel')?.getBoundingClientRect();
      const devicePanel = document.querySelector('.device-panel')?.getBoundingClientRect();
      const deviceInput = document.querySelector('#device-lines')?.getBoundingClientRect();
      const deviceActions = document.querySelector('.device-actions')?.getBoundingClientRect();
      const deviceActionButtons = [...document.querySelectorAll('#process-device-lines, #disconnect-device, #reset-device-reading')].map((element) => element.getBoundingClientRect());
      const traceRows = [...document.querySelectorAll('#simulated-trace li')].map((row) => row.getBoundingClientRect());
      const contained = (rect) => (rect?.width ?? 0) > 0 && (rect?.height ?? 0) > 0
        && rect.left >= 0 && rect.right <= window.innerWidth;
      const interactive = [load, confirm, reset, diagnosticSummary, diagnostic];
      const separate = interactive.every((rect, index) => interactive.slice(index + 1)
        .every((other) => !rect || !other || rect.right <= other.left || other.right <= rect.left
          || rect.bottom <= other.top || other.bottom <= rect.top));
      return {
        width: window.innerWidth,
        noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
        controlsVisible: [load, confirm, reset].every(contained),
        diagnosticVisible: [diagnosticSummary, diagnostic].every(contained) && separate,
        canvasVisible: contained(canvas),
        statusVisible: contained(status),
        actionsVisible: contained(actions) && contained(actionHelp),
        observationVisible: contained(panel) && traceRows.length === 6 && traceRows.every(contained),
        devicePanelVisible: contained(devicePanel) && contained(deviceInput) && contained(deviceActions)
          && deviceActionButtons.length === 3 && deviceActionButtons.every(contained),
      };
    })()`;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const mobile = (await cdp.send("Runtime.evaluate", {
      expression: responsiveExpression,
      returnByValue: true,
    }, sessionId)).result.value;
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 320, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const narrow = (await cdp.send("Runtime.evaluate", {
      expression: responsiveExpression,
      returnByValue: true,
    }, sessionId)).result.value;
    const expectedAcceptedFields = { sourceMode: 'Simulación local', sequence: '5', calibrationLabel: 'simulated-not-calibrated-v1', lightProxy: '0.5', temperature: '20', hydroSetpoint: '0.4', batteryMode: 'idle', loadPriority: 'balanced', confirm: 'sí' };
    const acceptedValues = interaction.acceptedFieldCount === Object.keys(expectedAcceptedFields).length
      && Object.keys(interaction.acceptedFields).length === Object.keys(expectedAcceptedFields).length
      && Object.entries(expectedAcceptedFields).every(([field, value]) => interaction.acceptedFields[field] === value);
    const expectedTrace = PROVISIONAL_EVENT_KEYS.map((eventKey, index) => `round-${index + 1} · evento provisional: ${eventKey} · secuencia: ${index}`);
    const orderedTrace = JSON.stringify(interaction.traceRows) === JSON.stringify(expectedTrace);
    const orderedRoundGuides = interaction.roundGuides.length === EXPECTED_ROUND_GUIDES.length
      && interaction.roundGuides.every((guide, index) => guide.visible
        && guide.eventKey === EXPECTED_ROUND_GUIDES[index].eventKey
        && guide.title === EXPECTED_ROUND_GUIDES[index].title
        && guide.question === EXPECTED_ROUND_GUIDES[index].question);
    const responsivePass = (result, expectedWidth) => result.width === expectedWidth
      && result.noOverflow && result.controlsVisible && result.diagnosticVisible
      && result.canvasVisible && result.statusVisible && result.actionsVisible
      && result.observationVisible && result.devicePanelVisible;
    const passed = observed?.ready && observed.shell && observed.secondary && observed.simulated && observed.waiting && observed.confirmationUnavailable && observed.initialGuide && observed.initialNotice && interaction.roundsPerRun === 6 && interaction.skipNavigation && interaction.deviceValid && interaction.deviceInvalid && interaction.deviceRecoveredWithoutReset && interaction.deviceReset && interaction.deviceResetClearsInput && interaction.deviceAwaitingInput && interaction.deviceHelloResetClean && interaction.deviceDisconnected && interaction.deviceResetAfterDisconnect && interaction.gameUnchangedByDevice && interaction.actionSemantics && interaction.detailsOpened && interaction.diagnosticEnabledInitially && interaction.malformedRejected && interaction.recoveredReady && interaction.midSessionDiagnostic && interaction.allReady && interaction.allAdvanced && interaction.resetDisabledInitially && interaction.resetEnabledAfterCompletion && interaction.fresh && interaction.replaySnapshotsEqual && interaction.replayRoundGuidesEqual && interaction.replayAcceptedFieldsEqual && interaction.replayTraceEqual && interaction.sameCanvas && interaction.completed && interaction.terminalControls && acceptedValues && orderedRoundGuides && interaction.panelRendered && interaction.controlsReadable && interaction.diagnosticGeometry && interaction.traceRendered && orderedTrace && responsivePass(mobile, 390) && responsivePass(narrow, 320) && observed.canvasWidth > 0 && observed.canvasHeight > 0 && observed.rectWidth > 0 && observed.rectHeight > 0 && errors.length === 0 && screenshot.length > 0 && dimensions?.width === 800 && dimensions?.height === 450;
    if (!passed) throw new Error(`Browser assertions failed: ${JSON.stringify({ observed, interaction, mobile, narrow, errors: errors.length, screenshotBytes: screenshot.length, dimensions })}`);
    await writeFile(screenshotPath, screenshot);
    console.log(`CHROME_VERSION=${browser.version}`);
    console.log(`PRODUCT_BROWSER_SMOKE=PASS marker=true shell=true secondary=true mode=simulated-device-manual-jsonl initial_status=waiting-input skip_navigation=focus-visible-target-main device_snapshot=hello-awaiting-input-valid-invalid-recovered-without-reset-disconnected-reset-buffer-cleared-focus-returned game_state=unchanged notices=disconnected-invalid-next-step-visible-ready-completed-hidden keyboard_focus=load-confirm-load-reset-cycle action_semantics=fieldset-legend-help-native-buttons diagnostic=malformed-rejected-recovered-counts-0-and-1 observation_panel=rendered accepted_values=exact round_guides=6-ordered-visible-replayed trace_rows=6-ordered interaction=two-six-round-runs-identical reset=fresh-focused-load canvas_instance=preserved terminal_controls=load-confirm-disabled-reset-enabled reflow=390px-and-320px-contained-no-overflow canvas=${observed.canvasWidth}x${observed.canvasHeight} displayed=${observed.rectWidth}x${observed.rectHeight} screenshot=${dimensions.width}x${dimensions.height} screenshot_bytes=${screenshot.length} javascript_errors=${errors.length}`);
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
