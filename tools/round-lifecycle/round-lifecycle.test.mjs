import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createRoundLifecycle, LifecycleValidationError } from "./round-lifecycle.mjs";

const loadManifest = async () => JSON.parse(await readFile(
  new URL("fixtures/manifest-v1.json", import.meta.url), "utf8",
));
const validSnapshot = (sequence = 1, confirm = true) => ({
  transport: "connected",
  inputStatus: "valid",
  acceptedSequence: sequence,
  calibrationVersion: "cal-v1",
  values: {
    lightProxy: 0.5,
    temperature: 20,
    hydroSetpoint: 0.4,
    batteryMode: "idle",
    loadPriority: "balanced",
    confirm,
  },
  issue: null,
});
const syntheticResolver = ({ round, input, seed, resolverVersion }) => ({
  key: round.event.data.key,
  sequence: input.sequence,
  trace: `${seed}:${resolverVersion}`,
});
const lifecycle = async (overrides = {}) => createRoundLifecycle({
  manifest: await loadManifest(),
  seed: "seed-a",
  resolverVersion: "synthetic-v1",
  resolve: syntheticResolver,
  ...overrides,
});
const expectCode = async (mutate, code) => {
  const manifest = await loadManifest();
  mutate(manifest);
  assert.throws(
    () => createRoundLifecycle({ manifest, seed: "seed-a", resolverVersion: "v1", resolve: syntheticResolver }),
    (error) => error instanceof LifecycleValidationError && error.code === code,
  );
};

test("accepts a closed manifest with exactly six ordered unique rounds", async () => {
  const engine = await lifecycle();
  assert.deepEqual(engine.snapshot(), {
    schemaVersion: "round-lifecycle-state/v1",
    manifestVersion: "round-lifecycle-manifest/v1",
    seed: "seed-a",
    resolverVersion: "synthetic-v1",
    roundIndex: 0,
    currentRoundId: "round-1",
    status: "waiting-input",
    history: [],
  });
});

for (const [name, mutate, code] of [
  ["unsupported manifest version", (value) => { value.schemaVersion = "v2"; }, "MANIFEST_VERSION_UNSUPPORTED"],
  ["wrong round count", (value) => { value.rounds.pop(); }, "ROUND_COUNT_INVALID"],
  ["duplicate round ids", (value) => { value.rounds[1].id = value.rounds[0].id; }, "ROUND_ID_DUPLICATE"],
  ["unknown manifest field", (value) => { value.extra = true; }, "MANIFEST_SHAPE_INVALID"],
  ["unknown round field", (value) => { value.rounds[0].extra = true; }, "ROUND_SHAPE_INVALID"],
  ["unsupported event type", (value) => { value.rounds[0].event.type = "physical"; }, "EVENT_TYPE_UNSUPPORTED"],
  ["malformed event data", (value) => { value.rounds[0].event.data = { key: "x", extra: true }; }, "EVENT_DATA_INVALID"],
]) {
  test(`rejects ${name}`, () => expectCode(mutate, code));
}

test("records caller-provided trace values and resolves through frozen inputs", async () => {
  let calls = 0;
  const engine = await lifecycle({
    seed: "caller-seed",
    resolverVersion: "resolver-7",
    resolve(input) {
      calls += 1;
      assert.ok(Object.isFrozen(input));
      assert.ok(Object.isFrozen(input.round.event.data));
      assert.ok(Object.isFrozen(input.input.controls));
      return { accepted: input.round.id };
    },
  });
  const response = engine.confirm(validSnapshot(), "token-1");
  assert.equal(calls, 1);
  assert.equal(response.ok, true);
  assert.equal(response.state.seed, "caller-seed");
  assert.equal(response.state.resolverVersion, "resolver-7");
  assert.equal(response.state.history[0].result.accepted, "round-1");
});

for (const [name, mutate, reason] of [
  ["missing fields", (value) => { delete value.values; }, "INPUT_SHAPE_INVALID"],
  ["disconnected transport", (value) => { value.transport = "disconnected"; }, "INPUT_DISCONNECTED"],
  ["invalid status", (value) => { value.inputStatus = "invalid"; }, "INPUT_INVALID"],
  ["null control", (value) => { value.values.lightProxy = null; }, "CONTROL_VALUE_INVALID"],
  ["unknown control", (value) => { value.values.extra = true; }, "CONTROL_SHAPE_INVALID"],
]) {
  test(`${name} does not resolve, append, or advance`, async () => {
    let calls = 0;
    const engine = await lifecycle({ resolve: () => { calls += 1; return {}; } });
    const input = validSnapshot();
    mutate(input);
    const response = engine.confirm(input, "token-1");
    assert.equal(response.reason, reason);
    assert.equal(calls, 0);
    assert.equal(response.state.roundIndex, 0);
    assert.deepEqual(response.state.history, []);
  });
}

test("confirm false remains retryable without stale-value reuse", async () => {
  let calls = 0;
  const engine = await lifecycle({ resolve: () => { calls += 1; return { ok: true }; } });
  assert.equal(engine.confirm(validSnapshot(1, false), "token-1").reason, "CONFIRMATION_REQUIRED");
  const invalid = validSnapshot(2);
  invalid.values.temperature = null;
  assert.equal(engine.confirm(invalid, "token-2").reason, "CONTROL_VALUE_INVALID");
  assert.equal(engine.snapshot().currentRoundId, "round-1");
  assert.equal(calls, 0);
  assert.equal(engine.confirm(validSnapshot(3), "token-3").ok, true);
  assert.equal(calls, 1);
});

test("duplicate sequence or token resolves exactly once", async () => {
  let calls = 0;
  const engine = await lifecycle({ resolve: () => ({ call: ++calls }) });
  assert.equal(engine.confirm(validSnapshot(1), "token-1").ok, true);
  assert.equal(engine.confirm(validSnapshot(1), "token-2").reason, "INPUT_REPLAYED");
  assert.equal(engine.confirm(validSnapshot(2), "token-1").reason, "INPUT_REPLAYED");
  assert.equal(calls, 1);
  assert.equal(engine.snapshot().history.length, 1);
});

test("resolver failure or non-plain result leaves the same round retryable", async () => {
  let mode = "throw";
  const engine = await lifecycle({ resolve: () => {
    if (mode === "throw") throw new Error("synthetic failure");
    if (mode === "invalid") return { value: Number.NaN };
    return { value: "accepted" };
  } });
  assert.equal(engine.confirm(validSnapshot(1), "token-1").reason, "RESOLVER_FAILED");
  mode = "invalid";
  assert.equal(engine.confirm(validSnapshot(1), "token-1").reason, "RESOLVER_RESULT_INVALID");
  mode = "valid";
  assert.equal(engine.confirm(validSnapshot(1), "token-1").ok, true);
});

test("six resolutions complete and a seventh is rejected deterministically", async () => {
  const engine = await lifecycle();
  for (let index = 1; index <= 6; index += 1) {
    assert.equal(engine.confirm(validSnapshot(index), `token-${index}`).ok, true);
  }
  assert.equal(engine.snapshot().status, "completed");
  assert.equal(engine.snapshot().currentRoundId, null);
  const seventh = engine.confirm(validSnapshot(7), "token-7");
  assert.equal(seventh.reason, "LIFECYCLE_COMPLETED");
  assert.equal(seventh.state.history.length, 6);
});

test("identical replay produces deeply equal immutable snapshots and histories", async () => {
  const run = async () => {
    const engine = await lifecycle();
    for (let index = 1; index <= 6; index += 1) engine.confirm(validSnapshot(index), `token-${index}`);
    return engine.snapshot();
  };
  const first = await run();
  const second = await run();
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.history));
  assert.ok(Object.isFrozen(first.history[0].input.controls));
  assert.ok(Object.isFrozen(first.history[0].result));
  assert.throws(() => { first.history.push({}); }, TypeError);
});

test("caller manifest and snapshots remain unchanged", async () => {
  const manifest = await loadManifest();
  const manifestBefore = structuredClone(manifest);
  const input = validSnapshot();
  const inputBefore = structuredClone(input);
  const engine = await lifecycle({ manifest });
  engine.confirm(input, "token-1");
  assert.deepEqual(manifest, manifestBefore);
  assert.deepEqual(input, inputBefore);
});
