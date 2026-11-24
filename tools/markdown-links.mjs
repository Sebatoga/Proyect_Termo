import { readdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".codegraph",
  "coverage",
  "dist",
  "node_modules",
]);

export function extractMarkdownLinks(markdown) {
  const links = [];
  let fenceCharacter = null;
  let fenceLength = 0;
  const lines = markdown.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fenceCharacter !== null) {
      if (fence !== null && fence[1][0] === fenceCharacter && fence[1].length >= fenceLength) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }
    if (fence !== null) {
      fenceCharacter = fence[1][0];
      fenceLength = fence[1].length;
      continue;
    }

    const prose = line.replace(/(`+).*?\1/g, (match) => " ".repeat(match.length));
    const inline = /\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+[^)]*)?\)/g;
    for (const match of prose.matchAll(inline)) {
      links.push({
        destination: match[1].startsWith("<") ? match[1].slice(1, -1) : match[1],
        line: index + 1,
      });
    }
    const definition = /^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|[^\s]+)/.exec(prose);
    if (definition) {
      links.push({
        destination: definition[1].startsWith("<")
          ? definition[1].slice(1, -1)
          : definition[1],
        line: index + 1,
      });
    }
  }
  return links;
}

export function extractMarkdownAnchors(markdown) {
  const anchors = new Set();
  const headingSlugs = new Set();
  let fenceCharacter = null;
  let fenceLength = 0;

  for (const line of markdown.split(/\r?\n/)) {
    const fence = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fenceCharacter !== null) {
      if (fence !== null && fence[1][0] === fenceCharacter && fence[1].length >= fenceLength) {
        fenceCharacter = null;
        fenceLength = 0;
      }
      continue;
    }
    if (fence !== null) {
      fenceCharacter = fence[1][0];
      fenceLength = fence[1].length;
      continue;
    }

    const prose = line.replace(/(`+).*?\1/g, (match) => " ".repeat(match.length));
    for (const match of prose.matchAll(/<[^>]+\b(?:id|name)\s*=\s*(["'])(.*?)\1[^>]*>/gi)) {
      if (match[2]) anchors.add(match[2]);
    }

    const heading = /^ {0,3}#{1,6}(?:\s+|$)(.*?)\s*$/.exec(line);
    if (!heading) continue;
    const visibleText = heading[1]
      .replace(/\s+#+\s*$/, "")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<[^>]*>/g, "")
      .replace(/[`*_~]/g, "");
    const baseSlug = visibleText
      .toLocaleLowerCase("en-US")
      .replace(/[^\p{L}\p{N}_\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!baseSlug) continue;

    let slug = baseSlug;
    let suffix = 0;
    while (headingSlugs.has(slug)) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }
    headingSlugs.add(slug);
    anchors.add(slug);
  }
  return anchors;
}

async function collectMarkdownFiles(root, directory = root) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        files.push(...await collectMarkdownFiles(root, absolute));
      }
    } else if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
      files.push(path.relative(root, absolute));
    }
  }
  return files;
}

function isExternal(destination) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(destination);
}

function resolveLocalDestination(root, file, destination) {
  if (isExternal(destination)) return { skipped: true };
  try {
    let resolved;
    let url;
    if (destination.startsWith("/")) {
      url = new URL(destination, "http://ecogrid.local/");
      resolved = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
    } else {
      url = new URL(destination, pathToFileURL(path.resolve(root, file)));
      if (url.protocol !== "file:") return { skipped: true };
      resolved = fileURLToPath(url);
    }
    const relative = path.relative(root, resolved);
    if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
      return { invalid: true };
    }
    return {
      path: resolved,
      fragment: url.hash ? decodeURIComponent(url.hash.slice(1)) : "",
    };
  } catch {
    return { invalid: true };
  }
}

export async function auditMarkdownLinks(root, requestedFiles) {
  const projectRoot = await realpath(path.resolve(root));
  const files = requestedFiles
    ? [...requestedFiles]
    : (await collectMarkdownFiles(projectRoot)).sort();
  const broken = [];
  let links = 0;
  let anchors = 0;

  for (const file of files) {
    const markdown = await readFile(path.resolve(projectRoot, file), "utf8");
    for (const { destination, line } of extractMarkdownLinks(markdown)) {
      const resolved = resolveLocalDestination(projectRoot, file, destination);
      if (resolved.skipped) continue;
      links += 1;
      if (resolved.invalid) {
        broken.push({ file, line, destination, kind: "target" });
        continue;
      }
      try {
        const canonical = await realpath(resolved.path);
        const relative = path.relative(projectRoot, canonical);
        if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
          broken.push({ file, line, destination, kind: "target" });
          continue;
        }
        if (resolved.fragment && /\.mdx?$/i.test(canonical)) {
          anchors += 1;
          const target = await readFile(canonical, "utf8");
          if (!extractMarkdownAnchors(target).has(resolved.fragment)) {
            broken.push({ file, line, destination, kind: "anchor" });
          }
        }
      } catch {
        broken.push({ file, line, destination, kind: "target" });
      }
    }
  }

  return { files: files.length, links, anchors, broken };
}

async function cli() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const result = await auditMarkdownLinks(root);
  for (const issue of result.broken) {
    console.error(
      `${issue.file}:${issue.line}: missing local ${issue.kind} ${issue.destination}`,
    );
  }
  console.log(
    `MARKDOWN_LINK_AUDIT files=${result.files} links=${result.links} anchors=${result.anchors} broken=${result.broken.length}`,
  );
  if (result.broken.length > 0) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  cli().catch((error) => {
    console.error(`MARKDOWN_LINK_AUDIT_ERROR ${error.message}`);
    process.exitCode = 1;
  });
}
