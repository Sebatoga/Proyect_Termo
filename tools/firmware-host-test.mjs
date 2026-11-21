import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { INPUT_FIELDS, parseLine } from "../src/infrastructure/device-protocol/protocol.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = join(root, "tools/device-simulator/fixtures/v1-device-disconnected.jsonl");
const temporaryDirectory = mkdtempSync(join(tmpdir(), "ecogrid-firmware-host-"));
const executable = join(temporaryDirectory, process.platform === "win32" ? "protocol-test.exe" : "protocol-test");

function run(command, arguments_, options = {}) {
  const result = spawnSync(command, arguments_, {
    cwd: root,
    encoding: null,
    ...options,
  });

  if (result.error) {
    throw new Error(`Could not run ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const stderr = result.stderr?.toString("utf8") ?? "";
    throw new Error(`${command} exited with status ${result.status}: ${stderr}`);
  }
  return result.stdout ?? Buffer.alloc(0);
}

try {
  run("g++", [
    "-std=c++17",
    "-Wall",
    "-Wextra",
    "-Werror",
    "-pedantic",
    "firmware/esp32-c6/protocol_v1.cpp",
    "firmware/esp32-c6/protocol_v1_test.cpp",
    "-o",
    executable,
  ]);

  const unitOutput = run(executable).toString("utf8");
  assert.equal(unitOutput, "ECO109_PROTOCOL_TESTS=PASS tests=5\n");

  const emitted = run(executable, ["--emit-disconnected"]);
  const fixture = readFileSync(fixturePath);
  assert.deepEqual(emitted, fixture, "firmware output must match the fixture byte-for-byte");

  const lines = emitted.toString("utf8").trimEnd().split(/\r?\n/);
  assert.equal(lines.length, 2, "expected hello followed by one disconnected inputs message");
  const parsed = lines.map(parseLine);
  assert.ok(parsed.every((result) => result.ok), "all emitted lines must pass the canonical parser");
  assert.equal(parsed[0].message.type, "hello");
  assert.equal(parsed[0].message.sequence, 0);
  assert.equal(parsed[1].message.type, "inputs");
  assert.equal(parsed[1].message.sequence, 1);
  assert.equal(parsed[1].message.status, "disconnected");
  assert.deepEqual(
    Object.fromEntries(INPUT_FIELDS.map((field) => [field, parsed[1].message.values[field]])),
    Object.fromEntries(INPUT_FIELDS.map((field) => [
      field,
      { value: null, status: "disconnected" },
    ])),
  );

  const boundaryLines = run(executable, ["--emit-boundary"])
    .toString("utf8")
    .trimEnd()
    .split(/\r?\n/);
  assert.equal(boundaryLines.length, 2, "expected two boundary messages");
  const boundaryParsed = boundaryLines.map(parseLine);
  assert.ok(
    boundaryParsed.every((result) => result.ok),
    "boundary messages must pass the canonical parser",
  );
  const uint32Maximum = 0xffff_ffff;
  assert.equal(boundaryParsed[0].message.type, "hello");
  assert.equal(boundaryParsed[0].message.sequence, uint32Maximum);
  assert.equal(boundaryParsed[0].message.uptimeMs, uint32Maximum);
  assert.equal(boundaryParsed[0].message.calibrationVersion.length, 32);
  assert.equal(boundaryParsed[1].message.type, "inputs");
  assert.equal(boundaryParsed[1].message.sequence, uint32Maximum);
  assert.equal(boundaryParsed[1].message.uptimeMs, uint32Maximum);
  assert.equal(boundaryParsed[1].message.calibrationVersion.length, 32);

  console.log("ECO109_HOST_VERIFICATION=PASS compiler=g++17 unit_tests=5 fixture=byte-identical parser=4/4");
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
