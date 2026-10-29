import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";
import {
  parseLine, serializeDeviceScenario, serializeHostScenario, validateSequence,
} from "./protocol.mjs";

const fixtureUrl = (name) => new URL(`fixtures/${name}`, import.meta.url);
const fixture = async (name) => readFile(fixtureUrl(name), "utf8");
const lines = (text) => text.trimEnd().split("\n");

const cli = (...args) => spawnSync(process.execPath, [new URL("cli.mjs", import.meta.url).pathname, ...args], {
  encoding: "utf8",
});

test("accepts the nominal device v1 fixture", async () => {
  let previous = null;
  for (const line of lines(await fixture("v1-device-nominal.jsonl"))) {
    const parsed = parseLine(line);
    assert.equal(parsed.ok, true);
    assert.equal(validateSequence(previous, parsed.message.sequence), null);
    previous = parsed.message.sequence;
  }
});

test("serializes device scenarios exactly without host output", async () => {
  for (const scenario of ["nominal", "disconnected"]) {
    const serialized = serializeDeviceScenario(scenario);
    assert.equal(serialized, await fixture(`v1-device-${scenario}.jsonl`));
    assert.equal(lines(serialized).some((line) => JSON.parse(line).type === "output"), false);
  }
});

test("serializes the host scenario exactly with output only", async () => {
  const serialized = serializeHostScenario("nominal");
  assert.equal(serialized, await fixture("v1-host-output-nominal.jsonl"));
  assert.deepEqual(lines(serialized).map((line) => JSON.parse(line).type), ["output"]);
});

test("CLI emits direction-specific fixtures byte for byte", async () => {
  for (const [command, scenario, name] of [
    ["emit-device", "nominal", "v1-device-nominal.jsonl"],
    ["emit-device", "disconnected", "v1-device-disconnected.jsonl"],
    ["emit-host", "nominal", "v1-host-output-nominal.jsonl"],
  ]) {
    const result = cli(command, scenario);
    assert.equal(result.status, 0);
    assert.equal(result.stdout, await fixture(name));
  }
});

test("legacy emit fails with direction-specific migration guidance", () => {
  const result = cli("emit", "nominal");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /emit-device <nominal\|disconnected>/);
  assert.match(result.stderr, /emit-host <nominal>/);
});

test("direction-specific emission is byte-identical across runs", () => {
  for (const args of [["emit-device", "nominal"], ["emit-device", "disconnected"], ["emit-host", "nominal"]]) {
    assert.equal(cli(...args).stdout, cli(...args).stdout);
  }
});

test("rejects malformed JSON with a stable code", async () => {
  const parsed = parseLine(await fixture("v1-malformed-json.jsonl"));
  assert.equal(parsed.error.code, "MALFORMED_JSON");
});

test("rejects an unsupported protocol version", async () => {
  const parsed = parseLine(await fixture("v1-unsupported-version.jsonl"));
  assert.equal(parsed.error.code, "UNSUPPORTED_VERSION");
});

test("rejects invalid status and provisional enum values", async () => {
  for (const line of lines(await fixture("v1-invalid-status-enum.jsonl"))) {
    assert.equal(parseLine(line).error.code, "SCHEMA_INVALID");
  }
});

test("rejects unsupported message types", async () => {
  const parsed = parseLine(await fixture("v1-unsupported-type.jsonl"));
  assert.equal(parsed.error.code, "TYPE_UNSUPPORTED");
});

test("rejects a sequence gap", async () => {
  const parsed = lines(await fixture("v1-invalid-sequence.jsonl")).map(parseLine);
  assert.equal(validateSequence(parsed[0].message.sequence, parsed[1].message.sequence), "SEQUENCE_INVALID");
});

test("does not retain values while disconnected", async () => {
  const parsed = lines(await fixture("v1-device-disconnected.jsonl")).map(parseLine);
  const message = parsed.at(-1).message;
  assert.equal(message.status, "disconnected");
  for (const input of Object.values(message.values)) {
    assert.equal(input.status, "disconnected");
    assert.equal(input.value, null);
  }
});
