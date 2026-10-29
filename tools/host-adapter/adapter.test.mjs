import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { createHostAdapter } from "./adapter.mjs";

const fixture = (name) => readFile(new URL(`../device-simulator/fixtures/${name}`, import.meta.url), "utf8");
const lines = (text) => text.trimEnd().split("\n");
const ingestFixture = async (adapter, name) => {
  for (const line of lines(await fixture(name))) adapter.ingest(line);
  return adapter.snapshot();
};
const cli = (input) => spawnSync(process.execPath, [new URL("cli.mjs", import.meta.url).pathname], {
  input, encoding: "utf8",
});
const validValues = {
  lightProxy: 0.72, temperature: 24.5, hydroSetpoint: 0.4,
  batteryMode: "idle", loadPriority: "balanced", confirm: false,
};

test("nominal device stream ends connected with six valid values", async () => {
  const snapshot = await ingestFixture(createHostAdapter(), "v1-device-nominal.jsonl");
  assert.equal(snapshot.transport, "connected");
  assert.equal(snapshot.inputStatus, "valid");
  assert.deepEqual(snapshot.values, validValues);
  assert.equal(Object.keys(snapshot.values).length, 6);
  assert.equal(snapshot.acceptedSequence, 1);
});

test("hello connects without making missing inputs valid", async () => {
  const adapter = createHostAdapter();
  adapter.ingest(lines(await fixture("v1-device-nominal.jsonl"))[0]);
  assert.deepEqual(adapter.snapshot(), {
    transport: "connected", inputStatus: "invalid", acceptedSequence: 0,
    calibrationVersion: "sim-v1", values: Object.fromEntries(Object.keys(validValues).map((key) => [key, null])),
    issue: null,
  });
});

test("disconnected stream removes prior valid values", async () => {
  const adapter = createHostAdapter();
  await ingestFixture(adapter, "v1-device-nominal.jsonl");
  const disconnected = JSON.parse(lines(await fixture("v1-device-disconnected.jsonl"))[1]);
  disconnected.sequence = 2;
  adapter.ingest(JSON.stringify(disconnected));
  const snapshot = adapter.snapshot();
  assert.equal(snapshot.transport, "disconnected");
  assert.equal(snapshot.inputStatus, "disconnected");
  assert.ok(Object.values(snapshot.values).every((value) => value === null));
});

for (const [name, expected] of [
  ["v1-malformed-json.jsonl", "MALFORMED_JSON"],
  ["v1-unsupported-version.jsonl", "UNSUPPORTED_VERSION"],
  ["v1-invalid-status-enum.jsonl", "SCHEMA_INVALID"],
]) {
  test(`${name} clears values with ${expected}`, async () => {
    const adapter = createHostAdapter();
    await ingestFixture(adapter, "v1-device-nominal.jsonl");
    adapter.ingest(lines(await fixture(name))[0]);
    assert.equal(adapter.snapshot().issue.code, expected);
    assert.ok(Object.values(adapter.snapshot().values).every((value) => value === null));
  });
}

test("sequence gap clears values with SEQUENCE_INVALID", async () => {
  const adapter = createHostAdapter();
  await ingestFixture(adapter, "v1-invalid-sequence.jsonl");
  assert.equal(adapter.snapshot().issue.code, "SEQUENCE_INVALID");
  assert.ok(Object.values(adapter.snapshot().values).every((value) => value === null));
});

test("incoming output clears values with DIRECTION_INVALID", async () => {
  const adapter = createHostAdapter();
  adapter.ingest((await fixture("v1-host-output-nominal.jsonl")).trim());
  assert.equal(adapter.snapshot().issue.code, "DIRECTION_INVALID");
  assert.ok(Object.values(adapter.snapshot().values).every((value) => value === null));
});

test("device error clears values and preserves its code", async () => {
  const adapter = createHostAdapter();
  await ingestFixture(adapter, "v1-device-nominal.jsonl");
  adapter.ingest(JSON.stringify({
    type: "error", protocolVersion: 1, sequence: 2, uptimeMs: 101,
    calibrationVersion: "sim-v1", status: "invalid", code: "SENSOR_RANGE", detail: "Light input out of range.",
  }));
  assert.equal(adapter.snapshot().issue.code, "SENSOR_RANGE");
  assert.ok(Object.values(adapter.snapshot().values).every((value) => value === null));
});

test("explicit disconnect resets state and permits a defined reconnection", async () => {
  const adapter = createHostAdapter();
  await ingestFixture(adapter, "v1-device-nominal.jsonl");
  adapter.disconnect();
  assert.equal(adapter.snapshot().acceptedSequence, null);
  assert.equal(adapter.snapshot().calibrationVersion, null);
  assert.ok(Object.values(adapter.snapshot().values).every((value) => value === null));
  const reconnected = await ingestFixture(adapter, "v1-device-nominal.jsonl");
  assert.deepEqual(reconnected.values, validValues);
});

test("CLI nominal output is byte-identical across executions", async () => {
  const input = await fixture("v1-device-nominal.jsonl");
  const first = cli(input);
  const second = cli(input);
  assert.equal(first.status, 0);
  assert.equal(second.status, 0);
  assert.equal(first.stdout, second.stdout);
  assert.deepEqual(JSON.parse(lines(first.stdout).at(-1)).values, validValues);
});
