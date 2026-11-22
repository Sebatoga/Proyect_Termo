import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { INPUT_FIELDS, parseLine } from "../src/infrastructure/device-protocol/protocol.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = join(root, "tools/device-simulator/fixtures/v1-device-disconnected.jsonl");
const runnerArguments = process.argv.slice(2);
if (runnerArguments.some((argument) => argument !== "--sanitizers")) {
  throw new Error("Usage: node tools/firmware-host-test.mjs [--sanitizers]");
}
const useSanitizers = runnerArguments.includes("--sanitizers");
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
    ...(useSanitizers ? ["-fsanitize=address,undefined", "-fno-omit-frame-pointer"] : []),
    "firmware/esp32-c6/protocol_v1.cpp",
    "firmware/esp32-c6/protocol_v1_test.cpp",
    "-o",
    executable,
  ]);

  const unitOutput = run(executable).toString("utf8");
  assert.equal(unitOutput, "ECO109_PROTOCOL_TESTS=PASS tests=5\n");

  const invalidArguments = spawnSync(executable, ["--unexpected"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(invalidArguments.error, undefined);
  assert.equal(invalidArguments.status, 2);
  assert.equal(invalidArguments.stdout, "");
  assert.equal(
    invalidArguments.stderr,
    "Usage: protocol-test [--emit-disconnected|--emit-boundary|--emit-numeric-sweep]\n",
  );

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

  const sweepValues = [
    0,
    1,
    9,
    10,
    99,
    100,
    999,
    1000,
    9999,
    10000,
    99999,
    100000,
    2147483647,
    2147483648,
    uint32Maximum - 1,
    uint32Maximum,
  ];
  const sweepLines = run(executable, ["--emit-numeric-sweep"])
    .toString("utf8")
    .trimEnd()
    .split(/\r?\n/);
  assert.equal(sweepLines.length, sweepValues.length * 2);
  const sweepParsed = sweepLines.map(parseLine);
  assert.ok(sweepParsed.every((result) => result.ok), "all numeric sweep messages must parse");
  for (let index = 0; index < sweepValues.length; index += 1) {
    const hello = sweepParsed[index * 2].message;
    const inputs = sweepParsed[index * 2 + 1].message;
    const expectedSequence = sweepValues[index];
    const expectedUptime = sweepValues[sweepValues.length - index - 1];
    for (const message of [hello, inputs]) {
      assert.equal(message.sequence, expectedSequence);
      assert.equal(message.uptimeMs, expectedUptime);
      assert.equal(message.calibrationVersion, "sweep-v1");
    }
    assert.equal(hello.type, "hello");
    assert.equal(inputs.type, "inputs");
    assert.equal(inputs.status, "disconnected");
  }

  const parserMessageCount = parsed.length + boundaryParsed.length + sweepParsed.length;
  const instrumentation = useSanitizers ? " sanitizers=address,undefined" : "";
  console.log(
    `ECO109_HOST_VERIFICATION=PASS compiler=g++17${instrumentation} unit_tests=5 `
      + `fixture=byte-identical parser=${parserMessageCount}/${parserMessageCount} `
      + `numeric_sweep=${sweepValues.length}`,
  );
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
