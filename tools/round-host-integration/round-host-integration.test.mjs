import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createRoundHostIntegration } from "./round-host-integration.mjs";

const manifest = async () => JSON.parse(await readFile(
  new URL("../round-lifecycle/fixtures/manifest-v1.json", import.meta.url), "utf8",
));
const hello = (sequence = 0) => JSON.stringify({
  type: "hello", protocolVersion: 1, sequence, uptimeMs: sequence,
  calibrationVersion: "sim-v1", status: "valid", capabilities: ["inputs"],
});
const inputs = (sequence, confirm = true, overrides = {}) => {
  const values = {
    lightProxy: { value: 0.5, status: "valid" },
    temperature: { value: 20, status: "valid" },
    hydroSetpoint: { value: 0.4, status: "valid" },
    batteryMode: { value: "idle", status: "valid" },
    loadPriority: { value: "balanced", status: "valid" },
    confirm: { value: confirm, status: "valid" },
    ...overrides,
  };
  return JSON.stringify({
    type: "inputs", protocolVersion: 1, sequence, uptimeMs: sequence,
    calibrationVersion: "sim-v1", status: "valid", values,
  });
};
const createHarness = async (onResolve = () => {}) => createRoundHostIntegration({
  manifest: await manifest(), seed: "integration-seed", resolverVersion: "synthetic-v1",
  resolve: ({ round, input, seed }) => {
    onResolve();
    return { roundId: round.id, sequence: input.sequence, trace: seed };
  },
});
const createHarnessWithResolver = async (resolve) => createRoundHostIntegration({
  manifest: await manifest(), seed: "integration-seed", resolverVersion: "synthetic-v1",
  resolve,
});

test("ingestion exposes only adapter snapshots and explicit confirmation resolves once", async () => {
  let calls = 0;
  const harness = await createHarness(() => { calls += 1; });
  assert.equal(harness.ingest(hello()).reason, "SNAPSHOT_UNAVAILABLE");
  assert.equal(harness.ingest(inputs(1)).reason, "SNAPSHOT_AVAILABLE");
  assert.equal(calls, 0);
  assert.equal(harness.snapshot().lifecycle.roundIndex, 0);
  const confirmed = harness.confirm("token-1");
  assert.equal(confirmed.ok, true);
  assert.equal(calls, 1);
  assert.equal(confirmed.state.lifecycle.roundIndex, 1);
});

test("invalid, disconnected, wrong-direction and unconfirmed input never resolves", async (context) => {
  const cases = [
    ["malformed", "{broken", "MALFORMED_JSON"],
    ["unsupported", JSON.stringify({ protocolVersion: 2 }), "UNSUPPORTED_VERSION"],
    ["wrong direction", JSON.stringify({
      type: "output", protocolVersion: 1, sequence: 1, uptimeMs: 1,
      calibrationVersion: "sim-v1", status: "valid", leds: {},
    }), "DIRECTION_INVALID"],
    ["sequence gap", inputs(2), "SEQUENCE_INVALID"],
    ["null control", inputs(1, true, {
      temperature: { value: null, status: "invalid" },
    }), "INPUTS_INVALID"],
    ["unconfirmed", inputs(1, false), "CONFIRMATION_REQUIRED"],
  ];
  for (const [name, line, reason] of cases) await context.test(name, async () => {
    let calls = 0;
    const harness = await createHarness(() => { calls += 1; });
    harness.ingest(hello());
    const ingested = harness.ingest(line);
    const result = reason === "CONFIRMATION_REQUIRED" ? harness.confirm("token") : ingested;
    assert.equal(result.reason, reason);
    assert.equal(calls, 0);
    assert.equal(harness.snapshot().lifecycle.roundIndex, 0);
  });

  await context.test("disconnected", async () => {
    let calls = 0;
    const harness = await createHarness(() => { calls += 1; });
    harness.ingest(hello());
    const disconnected = JSON.parse(inputs(1));
    disconnected.status = "disconnected";
    for (const field of Object.values(disconnected.values)) {
      field.status = "disconnected";
      field.value = null;
    }
    assert.equal(harness.ingest(JSON.stringify(disconnected)).reason, "SESSION_RESET_REQUIRED");
    assert.equal(harness.confirm("token").reason, "SESSION_RESET_REQUIRED");
    assert.equal(calls, 0);
  });
});

test("an invalid message clears a pending valid snapshot instead of reusing it", async () => {
  let calls = 0;
  const harness = await createHarness(() => { calls += 1; });
  harness.ingest(hello());
  harness.ingest(inputs(1));
  harness.ingest("{broken");
  assert.equal(harness.confirm("token-1").reason, "INPUT_INVALID");
  assert.equal(calls, 0);
  assert.deepEqual(harness.snapshot().lifecycle.history, []);
  assert.ok(Object.values(harness.snapshot().adapter.values).every((value) => value === null));
});

test("duplicate and reordered adapter sequences and repeated tokens fail closed", async () => {
  let calls = 0;
  const duplicate = await createHarness(() => { calls += 1; });
  duplicate.ingest(hello());
  duplicate.ingest(inputs(1));
  assert.equal(duplicate.confirm("token-1").ok, true);
  assert.equal(duplicate.ingest(inputs(1)).reason, "SEQUENCE_INVALID");
  assert.equal(duplicate.confirm("token-2").reason, "INPUT_INVALID");

  const reordered = await createHarness(() => { calls += 1; });
  reordered.ingest(hello());
  assert.equal(reordered.ingest(inputs(0)).reason, "SEQUENCE_INVALID");

  duplicate.ingest(inputs(2));
  assert.equal(duplicate.confirm("token-1").reason, "INPUT_REPLAYED");
  assert.equal(calls, 1);
  assert.equal(duplicate.snapshot().lifecycle.history.length, 1);
});

test("disconnect requires a new integration instance before sequence reset", async () => {
  let calls = 0;
  const first = await createHarness(() => { calls += 1; });
  first.ingest(hello());
  first.ingest(inputs(1));
  first.confirm("old-token");
  const disconnected = first.disconnect();
  assert.equal(disconnected.reason, "SESSION_RESET_REQUIRED");
  const clearedAdapter = disconnected.state.adapter;
  assert.equal(disconnected.state.status, "reset-required");
  for (const attempt of [
    first.ingest(hello()), first.ingest(inputs(1)), first.confirm("new-token"), first.disconnect(),
  ]) {
    assert.equal(attempt.reason, "SESSION_RESET_REQUIRED");
    assert.equal(attempt.state.status, "reset-required");
    assert.deepEqual(attempt.state.adapter, clearedAdapter);
  }

  const fresh = await createHarness(() => { calls += 1; });
  fresh.ingest(hello());
  fresh.ingest(inputs(1));
  assert.equal(fresh.confirm("new-token").ok, true);
  assert.equal(calls, 2);
});

test("non-string ingestion rejects before hostile coercion can confirm", async () => {
  let resolverCalls = 0;
  let coercionCalls = 0;
  const harness = await createHarness(() => { resolverCalls += 1; });
  harness.ingest(hello());
  harness.ingest(inputs(1));
  const before = harness.snapshot();
  const hostile = {
    [Symbol.toPrimitive]() {
      coercionCalls += 1;
      harness.confirm("coerced-token");
      return inputs(2);
    },
  };

  assert.equal(harness.ingest(hostile).reason, "INPUT_LINE_INVALID");
  assert.equal(coercionCalls, 0);
  assert.equal(resolverCalls, 0);
  assert.deepEqual(harness.snapshot(), before);
});

test("resolver reentry cannot ingest or disconnect the active integration", async () => {
  let harness;
  const nested = [];
  harness = await createHarnessWithResolver(({ round, input, seed }) => {
    nested.push(harness.ingest(inputs(2)), harness.disconnect());
    return { roundId: round.id, sequence: input.sequence, trace: seed };
  });
  harness.ingest(hello());
  harness.ingest(inputs(1));
  const adapterBefore = harness.snapshot().adapter;

  const result = harness.confirm("outer-token");
  assert.equal(result.ok, true);
  assert.deepEqual(nested.map(({ reason }) => reason), ["INTEGRATION_BUSY", "INTEGRATION_BUSY"]);
  assert.deepEqual(result.state.adapter, adapterBefore);
  assert.equal(result.state.status, "active");
  assert.equal(result.state.lifecycle.history.length, 1);
});

test("proxy capture reentry returns busy without changing the outer result", async () => {
  let harness;
  let nested;
  harness = await createHarnessWithResolver(({ round, input }) => new Proxy({
    roundId: round.id, sequence: input.sequence,
  }, {
    ownKeys(target) {
      nested = harness.confirm("nested-token");
      return Reflect.ownKeys(target);
    },
  }));
  harness.ingest(hello());
  harness.ingest(inputs(1));
  const adapterBefore = harness.snapshot().adapter;

  const result = harness.confirm("outer-token");
  assert.equal(result.ok, true);
  assert.equal(nested.reason, "INTEGRATION_BUSY");
  assert.deepEqual(result.state.adapter, adapterBefore);
  assert.equal(result.state.lifecycle.history.length, 1);
});

test("transaction guard clears after rejection, resolver failures and success", async () => {
  const ingestion = await createHarness();
  assert.equal(ingestion.ingest("{broken").reason, "MALFORMED_JSON");
  assert.equal(ingestion.ingest(JSON.stringify({ protocolVersion: 2 })).reason,
    "UNSUPPORTED_VERSION");
  assert.equal(ingestion.ingest(hello()).reason, "SNAPSHOT_UNAVAILABLE");
  assert.equal(ingestion.ingest(inputs(1)).reason, "SNAPSHOT_AVAILABLE");
  assert.equal(ingestion.confirm("success-token").ok, true);
  assert.equal(ingestion.ingest(inputs(2)).reason, "SNAPSHOT_AVAILABLE");

  let mode = "throw";
  const resolution = await createHarnessWithResolver(({ round, input }) => {
    if (mode === "throw") throw new Error("expected");
    if (mode === "invalid") return () => {};
    return { roundId: round.id, sequence: input.sequence };
  });
  resolution.ingest(hello());
  resolution.ingest(inputs(1));
  assert.equal(resolution.confirm("retry-token").reason, "RESOLVER_FAILED");
  mode = "invalid";
  assert.equal(resolution.confirm("retry-token").reason, "RESOLVER_RESULT_INVALID");
  mode = "valid";
  assert.equal(resolution.confirm("retry-token").ok, true);
  assert.equal(resolution.ingest(inputs(2)).reason, "SNAPSHOT_AVAILABLE");
});

test("six confirmations complete immutable history and a seventh skips resolution", async () => {
  let calls = 0;
  const harness = await createHarness(() => { calls += 1; });
  harness.ingest(hello());
  for (let sequence = 1; sequence <= 6; sequence += 1) {
    harness.ingest(inputs(sequence));
    assert.equal(harness.confirm(`token-${sequence}`).ok, true);
  }
  harness.ingest(inputs(7));
  const seventh = harness.confirm("token-7");
  assert.equal(seventh.reason, "LIFECYCLE_COMPLETED");
  assert.equal(calls, 6);
  assert.equal(seventh.state.lifecycle.history.length, 6);
  assert.ok(Object.isFrozen(seventh.state.adapter.values));
  assert.ok(Object.isFrozen(seventh.state.lifecycle.history));
  assert.throws(() => { seventh.state.lifecycle.history.push({}); }, TypeError);
});

test("equal streams, options, resolver and tokens replay deeply equally", async () => {
  const run = async () => {
    const harness = await createHarness();
    harness.ingest(hello());
    for (let sequence = 1; sequence <= 6; sequence += 1) {
      harness.ingest(inputs(sequence));
      harness.confirm(`token-${sequence}`);
    }
    return harness.snapshot();
  };
  assert.deepEqual(await run(), await run());
});
