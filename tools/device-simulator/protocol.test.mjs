import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parseLine, serializeScenario, validateSequence } from "./protocol.mjs";

const fixtureUrl = (name) => new URL(`fixtures/${name}`, import.meta.url);
const fixture = async (name) => readFile(fixtureUrl(name), "utf8");
const lines = (text) => text.trimEnd().split("\n");

test("accepts the nominal v1 fixture", async () => {
  let previous = null;
  for (const line of lines(await fixture("v1-nominal.jsonl"))) {
    const parsed = parseLine(line);
    assert.equal(parsed.ok, true);
    assert.equal(validateSequence(previous, parsed.message.sequence), null);
    previous = parsed.message.sequence;
  }
});

test("serializes scenarios exactly as their versioned fixtures", async () => {
  for (const scenario of ["nominal", "disconnected"]) {
    assert.equal(serializeScenario(scenario), await fixture(`v1-${scenario}.jsonl`));
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
  const parsed = lines(await fixture("v1-disconnected.jsonl")).map(parseLine);
  const message = parsed.at(-1).message;
  assert.equal(message.status, "disconnected");
  for (const input of Object.values(message.values)) {
    assert.equal(input.status, "disconnected");
    assert.equal(input.value, null);
  }
});
