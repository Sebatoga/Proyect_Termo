import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { lstat, open, readdir, realpath } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const TITLE = "<title>EcoGrid | Consola local</title>";
const HEALTH_PATH = "/.well-known/ecogrid-health";
const MAX_INDEX_BYTES = 1_000_000;
const MAX_ASSETS = 128;
const MAX_ASSET_BYTES = 32_000_000;
const MAX_BUILD_FILES = 256;
const MAX_BUILD_BYTES = 64_000_000;
const BUILD_FILES = new WeakMap();
const CONTENT_TYPES = new Map([
  [".css", "text/css; charset=utf-8"], [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"], [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".map", "application/json; charset=utf-8"],
  [".png", "image/png"], [".svg", "image/svg+xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

function inside(root, target) {
  return target === root || target.startsWith(`${root}${path.sep}`);
}

function decodeLocalPath(rawPath) {
  if (rawPath.includes("\0") || rawPath.includes("\\")) throw Object.assign(new Error("Invalid path"), { statusCode: 400 });
  let decoded;
  try { decoded = decodeURIComponent(rawPath); } catch { throw Object.assign(new Error("Malformed path encoding"), { statusCode: 400 }); }
  if (decoded.includes("\0") || decoded.includes("\\") || decoded.split("/").includes("..") || /%(?:00|2e|2f|5c)/i.test(decoded)) {
    throw Object.assign(new Error("Forbidden path"), { statusCode: 403 });
  }
  return decoded;
}

async function readExact(handle, size) {
  const bytes = Buffer.alloc(size);
  let offset = 0;
  while (offset < size) {
    const result = await handle.read(bytes, offset, size - offset, offset);
    if (result.bytesRead === 0) throw new Error("Build asset changed during preflight");
    offset += result.bytesRead;
  }
  if ((await handle.read(Buffer.alloc(1), 0, 1, size)).bytesRead !== 0) throw new Error("Build asset changed during preflight");
  return bytes;
}

async function snapshotBuild(root) {
  const files = new Map();
  let totalBytes = 0;
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Forbidden symbolic link: ${file}`);
      if (entry.isDirectory()) { await visit(file); continue; }
      if (!entry.isFile()) throw new Error(`Build asset is not a regular file: ${file}`);
      const handle = await open(file, constants.O_RDONLY | constants.O_NOFOLLOW);
      try {
        const [canonical, info] = await Promise.all([realpath(file), handle.stat()]);
        if (!inside(root, canonical) || !info.isFile() || info.size > MAX_ASSET_BYTES) throw new Error(`Invalid build asset: ${file}`);
        if (files.size >= MAX_BUILD_FILES || totalBytes + info.size > MAX_BUILD_BYTES) throw new Error("Production build exceeds snapshot limits");
        const bytes = await readExact(handle, info.size);
        totalBytes += bytes.length;
        files.set(`/${path.relative(root, canonical).split(path.sep).join("/")}`, bytes);
      } finally { await handle.close(); }
    }
  }
  await visit(root);
  return files;
}

function runtimeReferences(index) {
  const references = [];
  for (const match of index.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi)) references.push(match[1]);
  for (const match of index.matchAll(/<link\b(?=[^>]*\brel\s*=\s*["'][^"']*stylesheet[^"']*["'])[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi)) references.push(match[1]);
  return [...new Set(references)].sort();
}

function referencePath(reference) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) throw new Error(`External runtime reference: ${reference}`);
  const rawPath = reference.split(/[?#]/, 1)[0];
  decodeLocalPath(rawPath);
  let url;
  try { url = new URL(reference, "http://ecogrid.local/"); } catch { throw new Error(`Invalid runtime reference: ${reference}`); }
  if (url.origin !== "http://ecogrid.local") throw new Error(`External runtime reference: ${reference}`);
  return decodeLocalPath(url.pathname);
}

function dependencyPath(owner, reference) {
  if (/^(?:data:|#)/i.test(reference)) return null;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) throw new Error(`External runtime reference: ${reference}`);
  let url;
  try { url = new URL(reference, `http://ecogrid.local${owner}`); } catch { throw new Error(`Invalid runtime reference: ${reference}`); }
  return decodeLocalPath(url.pathname);
}

function nestedReferences(name, text) {
  const references = [];
  const patterns = name.endsWith(".css")
    ? [/@import\s+(?:url\(\s*)?["']([^"']+)["']/gi, /url\(\s*["']?([^"')\s]+)["']?\s*\)/gi]
    : [/\b(?:import|export)\s+(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/g, /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g];
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) references.push(match[1]);
  return [...new Set(references)];
}

export async function preflightBuild(buildRoot) {
  const requestedRoot = path.resolve(buildRoot);
  const rootInfo = await lstat(requestedRoot);
  if (rootInfo.isSymbolicLink() || !rootInfo.isDirectory()) throw new Error("Build root must be a regular directory");
  const root = await realpath(requestedRoot);
  const files = await snapshotBuild(root);
  const index = files.get("/index.html");
  if (!index) throw new Error("Built index is missing");
  if (index.length > MAX_INDEX_BYTES) throw new Error("Built index exceeds the preflight limit");
  const indexText = index.toString("utf8");
  if (!indexText.includes(TITLE)) throw new Error(`Built index is missing exact title marker: ${TITLE}`);
  const references = runtimeReferences(indexText);
  if (references.length > MAX_ASSETS) throw new Error("Built index references too many runtime assets");
  const localPaths = [...new Set(references.map(referencePath))].sort();
  if (!localPaths.some((file) => file.endsWith(".js")) || !localPaths.some((file) => file.endsWith(".css"))) throw new Error("Built index must reference local JavaScript and CSS assets");
  let assetBytes = 0;
  for (const localPath of localPaths) {
    const bytes = files.get(localPath);
    if (!bytes) throw new Error(`Missing runtime asset: ${localPath}`);
    const extension = path.extname(localPath).toLowerCase();
    if (!CONTENT_TYPES.has(extension) || ![".js", ".css"].includes(extension)) throw new Error(`Unsupported runtime asset: ${localPath}`);
    assetBytes += bytes.length;
    if (assetBytes > MAX_ASSET_BYTES) throw new Error("Runtime assets exceed the preflight limit");
  }
  const externalRuntimeResource = /(?:\b(?:src|href)\s*=|url\s*\(|\b(?:fetch|import|importScripts)\s*\()\s*["']?\s*(?:https?:)?\/\//i;
  const hash = createHash("sha256");
  for (const [name, bytes] of [...files].sort(([left], [right]) => left.localeCompare(right))) {
    const text = bytes.toString("utf8");
    if (/\.(?:html|css|js)$/i.test(name) && externalRuntimeResource.test(text)) throw new Error(`External runtime reference in: ${name}`);
    if (/\.(?:css|js)$/i.test(name)) for (const reference of nestedReferences(name, text)) {
      const dependency = dependencyPath(name, reference);
      if (dependency && !files.has(dependency)) throw new Error(`Missing runtime dependency from ${name}: ${reference}`);
      if (dependency && !CONTENT_TYPES.has(path.extname(dependency).toLowerCase())) throw new Error(`Unsupported runtime dependency from ${name}: ${reference}`);
    }
    hash.update(name).update("\0").update(bytes);
  }
  const build = Object.freeze({
    root,
    buildId: hash.digest("hex"),
    assets: Object.freeze(localPaths),
  });
  BUILD_FILES.set(build, files);
  return build;
}

function loopbackHost(host) {
  return host === "127.0.0.1" || host === "::1";
}

function closeHttpServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections?.();
  });
}

export async function startLocalConsole({ buildRoot, host = "127.0.0.1", port = 4174 }) {
  if (!loopbackHost(host)) throw new Error(`Host must be an explicit loopback address: ${host}`);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Port must be an integer from 1 to 65535: ${port}`);
  const build = await preflightBuild(buildRoot);
  const health = Buffer.from(JSON.stringify({ schema: "ecogrid-health/v1", product: "ecogrid-local-console", buildId: build.buildId }));
  const server = createServer(async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { allow: "GET, HEAD" }).end();
        return;
      }
      const rawPath = (request.url ?? "/").split("?", 1)[0];
      if (rawPath === HEALTH_PATH) {
        response.writeHead(200, { "content-type": "application/json; charset=utf-8", "content-length": health.length, "cache-control": "no-store", "x-content-type-options": "nosniff" }).end(request.method === "HEAD" ? undefined : health);
        return;
      }
      const decoded = decodeLocalPath(rawPath);
      const localPath = decoded === "/" ? "/index.html" : `/${decoded.replace(/^\/+/, "")}`;
       const contents = BUILD_FILES.get(build)?.get(localPath);
      if (!contents) throw Object.assign(new Error("Not found"), { statusCode: 404 });
      const contentType = CONTENT_TYPES.get(path.extname(localPath).toLowerCase());
      if (!contentType) throw Object.assign(new Error("Unsupported file type"), { statusCode: 404 });
      response.writeHead(200, { "content-type": contentType, "content-length": contents.length, "x-content-type-options": "nosniff" });
      response.end(request.method === "HEAD" ? undefined : contents);
    } catch (error) {
      const status = error.statusCode ?? (error.code === "ENOENT" || error.code === "ENOTDIR" ? 404 : 500);
      response.writeHead(status, { "content-type": "text/plain; charset=utf-8", "x-content-type-options": "nosniff" }).end(status === 404 ? "Not found" : status < 500 ? "Invalid path" : "Server error");
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => { server.off("error", reject); resolve(); });
  });
  return Object.freeze({ build, origin: `http://${host === "::1" ? "[::1]" : host}:${port}`, close: () => closeHttpServer(server) });
}

async function cli() {
  const options = { buildRoot: "dist", host: "127.0.0.1", port: 4174 };
  for (let index = 2; index < process.argv.length; index += 2) {
    const flag = process.argv[index]; const value = process.argv[index + 1];
    if (!value || !["--root", "--host", "--port"].includes(flag)) throw new Error("Usage: --root <dir> --host <loopback> --port <number>");
    if (flag === "--root") options.buildRoot = value;
    if (flag === "--host") options.host = value;
    if (flag === "--port") options.port = Number(value);
  }
  const running = await startLocalConsole(options);
  console.log(`ECOGRID_LOCAL_READY url=${running.origin}/ build=${running.build.buildId}`);
  const shutdown = async () => { process.removeListener("SIGINT", shutdown); process.removeListener("SIGTERM", shutdown); await running.close(); };
  process.once("SIGINT", shutdown); process.once("SIGTERM", shutdown);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) cli().catch((error) => { console.error(`ECOGRID_LOCAL_ERROR ${error.message}`); process.exitCode = 1; });
