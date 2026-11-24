import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  auditMarkdownLinks,
  extractMarkdownAnchors,
  extractMarkdownLinks,
} from "./markdown-links.mjs";

test("extracts inline and reference destinations outside fenced code", () => {
  const links = extractMarkdownLinks([
    "[manual](../docs/17_COMO_JUGAR.md)",
    "[reference]: ./evidence.md",
    "`[inline](missing.md)`",
    "```md",
    "[example](missing.md)",
    "```",
  ].join("\n"));

  assert.deepEqual(links.map(({ destination, line }) => ({ destination, line })), [
    { destination: "../docs/17_COMO_JUGAR.md", line: 1 },
    { destination: "./evidence.md", line: 2 },
  ]);
});

test("extracts heading slugs, duplicate suffixes, and explicit HTML anchors", () => {
  const anchors = extractMarkdownAnchors([
    "# Repeated",
    "# Repeated",
    "# Repeated-1",
    "# Repeated",
    "## **Hello**, `World`!",
    '<a id="custom-id"></a>',
    '<a name="legacy-name"></a>',
    '`<a id="ignored-inline"></a>`',
    "```html",
    '<a id="ignored"></a>',
    "```",
  ].join("\n"));

  assert.deepEqual([...anchors], [
    "repeated",
    "repeated-1",
    "repeated-1-1",
    "repeated-2",
    "hello-world",
    "custom-id",
    "legacy-name",
  ]);
});

test("audits local files, root-relative paths, encoded spaces, and external URLs", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ecogrid-doc-links-"));
  try {
    await mkdir(path.join(root, "docs"));
    await writeFile(path.join(root, "docs", "guide.md"), [
      "# Section",
      "[local](./target.md)",
      "[root](/docs/target.md)",
      "[encoded](./space%20name.md)",
      "[web](https://example.com/guide)",
      "[missing](./absent.md)",
      "[fragment](#section)",
      "[outside](../../../etc/passwd)",
    ].join("\n"));
    await writeFile(path.join(root, "docs", "target.md"), "# target");
    await writeFile(path.join(root, "docs", "space name.md"), "# target");

    const result = await auditMarkdownLinks(root, ["docs/guide.md"]);

    assert.equal(result.files, 1);
    assert.equal(result.links, 6);
    assert.equal(result.anchors, 1);
    assert.deepEqual(result.broken, [
      { file: "docs/guide.md", line: 6, destination: "./absent.md", kind: "target" },
      { file: "docs/guide.md", line: 8, destination: "../../../etc/passwd", kind: "target" },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("audits same-file and linked-file fragments, duplicates, Unicode, and missing anchors", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ecogrid-doc-links-"));
  try {
    await mkdir(path.join(root, "docs"));
    await writeFile(path.join(root, "docs", "guide.md"), [
      "# Guide",
      "[same file](#guide)",
      "[punctuation](./target.md#target-title)",
      "[duplicate](./target.md#target-title-1)",
      "[explicit](./target.md#custom-id)",
      "[unicode](./target.md#c%C3%B3digo)",
      "[missing](./target.md#not-there)",
    ].join("\n"));
    await writeFile(path.join(root, "docs", "target.md"), [
      "## Target: title!",
      "## Target: title!",
      '<a id="custom-id"></a>',
      "## Código",
    ].join("\n"));

    const result = await auditMarkdownLinks(root, ["docs/guide.md"]);

    assert.equal(result.links, 6);
    assert.equal(result.anchors, 6);
    assert.deepEqual(result.broken, [
      {
        file: "docs/guide.md",
        line: 7,
        destination: "./target.md#not-there",
        kind: "anchor",
      },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("checks existence but does not parse fragments on non-Markdown targets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ecogrid-doc-links-"));
  try {
    await mkdir(path.join(root, "docs"));
    await writeFile(path.join(root, "docs", "guide.md"), "[page](./manual.pdf#page=3)");
    await writeFile(path.join(root, "docs", "manual.pdf"), "placeholder");

    const result = await auditMarkdownLinks(root, ["docs/guide.md"]);

    assert.equal(result.links, 1);
    assert.equal(result.anchors, 0);
    assert.deepEqual(result.broken, []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("reports malformed local URL encoding as a broken link", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ecogrid-doc-links-"));
  try {
    await mkdir(path.join(root, "docs"));
    await writeFile(path.join(root, "docs", "guide.md"), "[bad](./bad%ZZ.md)");

    const result = await auditMarkdownLinks(root, ["docs/guide.md"]);

    assert.deepEqual(result.broken, [
      { file: "docs/guide.md", line: 1, destination: "./bad%ZZ.md", kind: "target" },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects a local symlink whose canonical target escapes the repository", async () => {
  const parent = await mkdtemp(path.join(os.tmpdir(), "ecogrid-doc-links-"));
  const root = path.join(parent, "repo");
  try {
    await mkdir(path.join(root, "docs"), { recursive: true });
    await writeFile(path.join(parent, "outside.md"), "# outside");
    await symlink(path.join(parent, "outside.md"), path.join(root, "docs", "outside.md"));
    await writeFile(path.join(root, "docs", "guide.md"), "[outside](./outside.md)");

    const result = await auditMarkdownLinks(root, ["docs/guide.md"]);

    assert.deepEqual(result.broken, [
      { file: "docs/guide.md", line: 1, destination: "./outside.md", kind: "target" },
    ]);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});
