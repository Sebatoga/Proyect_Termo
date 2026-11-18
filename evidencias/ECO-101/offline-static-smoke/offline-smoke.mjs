import { spawn, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { startLocalConsole } from "../../../tools/local-console-server.mjs";

const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(evidenceDir, "../../..");
const dist = path.join(root, "dist");
const host = "127.0.0.1";
const port = 4174;
const productUrl = `http://${host}:${port}/`;
const marker = "EcoGrid | Consola local";
function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", timeout: 30_000 });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed:\n${result.stdout}${result.stderr}`);
  return result.stdout.trim();
}

function browserCommand() {
  for (const command of ["google-chrome", "chromium", "chromium-browser"]) {
    const result = spawnSync(command, ["--version"], { encoding: "utf8", timeout: 5_000 });
    if (result.status === 0) return { command, version: result.stdout.trim() };
  }
  throw new Error("No installed Chrome or Chromium executable was found");
}

async function builtFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? builtFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}

async function staticScan() {
  const tracked = run("git", ["ls-files"]).split("\n").filter((file) => /(?:\.html|\.css|\.tsx?|package\.json|tsconfig.*\.json|vite\.config\.ts)$/.test(file) || /^src\/.*\.m(?:j|t)s$/.test(file));
  const built = (await builtFiles(dist)).filter((file) => /\.(?:html|css|js)$/.test(file));
  const externalResource = /(?:\b(?:src|href)\s*=|url\s*\(|\b(?:fetch|importScripts)\s*\(|\.open\s*\(\s*["'](?:GET|POST)["']\s*,)\s*["']?\s*(?:https?:)?\/\//i;
  const authoredNetworkApi = /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\b/;
  const failures = [];
  for (const file of tracked) {
    const text = await readFile(path.join(root, file), "utf8");
    if (externalResource.test(text) || authoredNetworkApi.test(text)) failures.push(file);
  }
  for (const file of built) {
    if (externalResource.test(await readFile(file, "utf8"))) failures.push(path.relative(root, file));
  }
  if (failures.length) throw new Error(`Forbidden external resource or authored network API: ${failures.join(", ")}`);
  return { tracked: tracked.length, built: built.length };
}

function startChrome(command, profile) {
  return spawn(command, ["--headless=new", "--window-size=800,450", "--force-device-scale-factor=1", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { detached: true, stdio: ["ignore", "ignore", "pipe"] });
}

function stopChrome(chrome) {
  if (!chrome || chrome.exitCode !== null) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { try { process.kill(-chrome.pid, "SIGKILL"); } catch {} reject(new Error("Chrome cleanup timed out")); }, 3_000);
    chrome.once("exit", () => { clearTimeout(timer); resolve(); });
    try { process.kill(-chrome.pid, "SIGTERM"); } catch (error) { clearTimeout(timer); reject(error); }
  });
}

function debuggerUrl(chrome) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Chrome DevTools endpoint timed out")), 10_000);
    chrome.stderr.setEncoding("utf8");
    chrome.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
    chrome.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Chrome exited before verification: ${code}`)); });
  });
}

async function connect(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  const listeners = new Set();
  let id = 0;
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Chrome DevTools connection timed out")), 5_000);
    socket.addEventListener("open", () => { clearTimeout(timer); resolve(); }, { once: true });
    socket.addEventListener("error", (error) => { clearTimeout(timer); reject(error); }, { once: true });
  });
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) {
      const promise = pending.get(message.id); pending.delete(message.id);
      message.error ? promise.reject(new Error(message.error.message)) : promise.resolve(message.result);
    } else for (const listener of listeners) listener(message);
  });
  return { close: () => socket.close(), on: (listener) => listeners.add(listener), send(method, params = {}, sessionId) {
    const messageId = ++id; socket.send(JSON.stringify({ id: messageId, method, params, ...(sessionId ? { sessionId } : {}) }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(messageId); reject(new Error(`${method} timed out`)); }, 5_000);
      pending.set(messageId, { resolve: (value) => { clearTimeout(timer); resolve(value); }, reject: (error) => { clearTimeout(timer); reject(error); } });
    });
  } };
}

async function observe(cdp, sessionId) {
  const expression = `(() => { const canvas=document.querySelector('#game-container canvas'); const text=document.body?.innerText??''; const rect=canvas?.getBoundingClientRect(); return {ready:document.readyState==='complete'&&Boolean(canvas),shell:text.includes('EcoGrid: Ciudad al Límite'),canvasWidth:canvas?.width??0,canvasHeight:canvas?.height??0,rectWidth:rect?.width??0,rectHeight:rect?.height??0};})()`;
  const deadline = Date.now() + 5_000;
  let value;
  while (Date.now() < deadline) {
    try { value = (await cdp.send("Runtime.evaluate", { expression, returnByValue: true }, sessionId)).result.value; } catch {}
    if (value?.ready && value.shell && value.rectWidth > 0 && value.rectHeight > 0) return value;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Product shell/canvas timed out: ${JSON.stringify(value)}`);
}

async function main() {
  await rm(dist, { recursive: true, force: true });
  run("npm", ["run", "build"]);
  const scan = await staticScan();
  const browser = browserCommand();
  let server;
  let chrome;
  let cdp;
  let profile;
  let cleanupError;
  try {
    server = await startLocalConsole({ buildRoot: dist, host, port });
    const owner = await fetch(productUrl, { signal: AbortSignal.timeout(3_000) });
    if (owner.status !== 200 || !(await owner.text()).includes(marker)) throw new Error("Static server ownership marker failed");
    profile = await mkdtemp("/tmp/opencode/ecogrid-offline-");
    chrome = startChrome(browser.command, profile);
    cdp = await connect(await debuggerUrl(chrome));
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    const requests = new Map();
    const failures = [];
    const errors = [];
    cdp.on((message) => {
      if (message.sessionId !== sessionId) return;
      const params = message.params;
      if (message.method === "Network.requestWillBeSent") requests.set(params.requestId, { url: params.request.url, type: params.type, status: null });
      if (message.method === "Network.responseReceived" && requests.has(params.requestId)) requests.get(params.requestId).status = params.response.status;
      if (message.method === "Network.loadingFailed") failures.push(params);
      if (message.method === "Runtime.exceptionThrown" || (message.method === "Runtime.consoleAPICalled" && params.type === "error") || (message.method === "Log.entryAdded" && params.entry.level === "error")) errors.push(params);
    });
    await Promise.all(["Page", "Runtime", "Log", "Network"].map((domain) => cdp.send(`${domain}.enable`, {}, sessionId)));
    await cdp.send("Page.navigate", { url: productUrl }, sessionId);
    const loaded = await observe(cdp, sessionId);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const inventory = [...requests.values()];
    const badUrl = inventory.find(({ url }) => /^https?:/i.test(url) && new URL(url).origin !== new URL(productUrl).origin);
    const badLocal = inventory.find(({ url, status }) => /^https?:/i.test(url) && (status === null || status >= 400));
    if (badUrl || badLocal || failures.length || errors.length) throw new Error(`Network/runtime failure: ${JSON.stringify({ badUrl, badLocal, failures: failures.length, errors: errors.length })}`);
    await server.close();
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const offline = await observe(cdp, sessionId);
    const finalInventory = [...requests.values()];
    if (finalInventory.some(({ url }) => /^https?:/i.test(url) && new URL(url).origin !== new URL(productUrl).origin) || failures.length || errors.length) throw new Error(`Post-shutdown network/runtime failure: ${JSON.stringify({ failures: failures.length, errors: errors.length })}`);
    const lines = finalInventory.map(({ type, status, url }) => `- ${status} ${type} ${url}`);
    const report = `# ECO-101 offline static production smoke\n\n- Definition: no Internet or external resource dependency while served by a loopback static server.\n- Browser: \`${browser.version}\`.\n- Result: PASS; ${finalInventory.length} product requests, ${errors.length} JavaScript/console errors.\n- Canvas: ${loaded.canvasWidth} × ${loaded.canvasHeight}; displayed ${loaded.rectWidth} × ${loaded.rectHeight}.\n- Static scan: ${scan.tracked} committed source/config files and ${scan.built} built HTML/CSS/JS files.\n- Post-shutdown: shell/canvas remained present for 1,000 ms (${offline.rectWidth} × ${offline.rectHeight}); no refresh was attempted.\n\n## Request inventory\n\n${lines.join("\n")}\n\n## Reproduce\n\n\`npm run test:offline-smoke\`\n\`node --test evidencias/ECO-101/offline-static-smoke/offline-smoke-negative.test.mjs\`\n\n## Limits\n\nNo claim is made for file://, service-worker caching, refresh after shutdown, other browsers, serial/hardware, gameplay, physics, accessibility, or prolonged performance. Generic dormant loader APIs and metadata inside bundled Phaser/Vite are not external resource references; attempted requests are enforced dynamically.\n`;
    await mkdir(evidenceDir, { recursive: true });
    await writeFile(path.join(evidenceDir, "report.md"), report);
    console.log(`CHROME_VERSION=${browser.version}`);
    console.log(`OFFLINE_STATIC_SMOKE=PASS requests=${finalInventory.length} canvas=${loaded.canvasWidth}x${loaded.canvasHeight} displayed=${loaded.rectWidth}x${loaded.rectHeight} javascript_errors=${errors.length} post_shutdown_ms=1000 static_scan=${scan.tracked}+${scan.built}`);
  } finally {
    cdp?.close();
    if (server) try { await server.close(); } catch (error) { if (error.code !== "ERR_SERVER_NOT_RUNNING") cleanupError = error; }
    try { await stopChrome(chrome); } catch (error) { cleanupError ??= error; }
    if (profile) try { await rm(profile, { recursive: true, force: true }); } catch (error) { cleanupError ??= error; }
  }
  if (cleanupError) throw new Error(`Cleanup failed: ${cleanupError.message}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
