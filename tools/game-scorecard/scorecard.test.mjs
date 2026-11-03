import assert from "node:assert/strict";
import test from "node:test";
import { evaluateScorecard } from "./scorecard.mjs";

const mission = (overrides = {}) => ({
  schemaVersion: "scorecard-mission/v1",
  id: "synthetic-mission",
  expectedRounds: 2,
  thresholds: { criticalCoverage: 0.8, totalCoverage: 0.7 },
  ...overrides,
});

const round = (id, overrides = {}) => ({
  id,
  status: "resolved",
  demand: { critical: 4, total: 10 },
  service: { critical: 4, total: 8 },
  environment: { status: "compliant", verifiable: true },
  ...overrides,
});

const ledger = (...rounds) => ({ schemaVersion: "scorecard-ledger/v1", rounds });
const codes = (result) => result.reasons.map(({ code }) => code);

test("returns victory with three visible unweighted dimensions", () => {
  const result = evaluateScorecard(mission(), ledger(round("r1"), round("r2")));
  assert.equal(result.outcome, "victory");
  assert.deepEqual(result.metrics, {
    criticalCoverage: 1,
    totalCoverage: 0.8,
    environmentalCompliance: true,
  });
  assert.deepEqual(codes(result), ["VICTORY"]);
  assert.equal("score" in result, false);
});

test("shutdown of positive demand cannot win", () => {
  const off = { critical: 0, total: 0 };
  const result = evaluateScorecard(mission(), ledger(
    round("r1", { service: off }),
    round("r2", { service: off }),
  ));
  assert.equal(result.outcome, "defeat");
  assert.deepEqual(result.metrics, {
    criticalCoverage: 0,
    totalCoverage: 0,
    environmentalCompliance: true,
  });
  assert.deepEqual(codes(result), [
    "CRITICAL_COVERAGE_BELOW_THRESHOLD",
    "TOTAL_COVERAGE_BELOW_THRESHOLD",
  ]);
});

test("serving only critical loads fails total coverage", () => {
  const criticalOnly = { critical: 4, total: 4 };
  const result = evaluateScorecard(mission(), ledger(
    round("r1", { service: criticalOnly }),
    round("r2", { service: criticalOnly }),
  ));
  assert.equal(result.outcome, "defeat");
  assert.equal(result.metrics.criticalCoverage, 1);
  assert.equal(result.metrics.totalCoverage, 0.4);
  assert.deepEqual(codes(result), ["TOTAL_COVERAGE_BELOW_THRESHOLD"]);
});

test("player-attributable environmental noncompliance defeats an otherwise passing ledger", () => {
  const result = evaluateScorecard(mission(), ledger(
    round("r1"),
    round("r2", { environment: { status: "player-noncompliant", verifiable: true } }),
  ));
  assert.equal(result.outcome, "defeat");
  assert.equal(result.metrics.environmentalCompliance, false);
  assert.deepEqual(codes(result), ["ENVIRONMENT_NONCOMPLIANT"]);
});

test("verified natural unavailability is not attributed to the player", () => {
  const result = evaluateScorecard(mission(), ledger(
    round("r1"),
    round("r2", { environment: { status: "natural-unavailability", verifiable: true } }),
  ));
  assert.equal(result.outcome, "victory");
  assert.equal(result.metrics.environmentalCompliance, true);
});

test("unverifiable environmental evidence makes metrics unscorable", () => {
  const result = evaluateScorecard(mission(), ledger(
    round("r1"),
    round("r2", { environment: { status: "compliant", verifiable: false } }),
  ));
  assert.equal(result.outcome, "incomplete");
  assert.deepEqual(result.metrics, {
    criticalCoverage: null,
    totalCoverage: null,
    environmentalCompliance: null,
  });
  assert.deepEqual(codes(result), ["ENVIRONMENT_UNVERIFIABLE"]);
});

test("zero denominators report full coverage but cannot create a trivial victory", () => {
  const zero = { critical: 0, total: 0 };
  const result = evaluateScorecard(mission(), ledger(
    round("r1", { demand: zero, service: zero }),
    round("r2", { demand: zero, service: zero }),
  ));
  assert.equal(result.outcome, "defeat");
  assert.deepEqual(result.metrics, {
    criticalCoverage: 1,
    totalCoverage: 1,
    environmentalCompliance: true,
  });
  assert.deepEqual(codes(result), ["NO_TOTAL_DEMAND"]);
});

test("non-finite aggregate quantities are incomplete without throwing", () => {
  const maximum = { critical: Number.MAX_VALUE, total: Number.MAX_VALUE };
  const result = evaluateScorecard(mission(), ledger(
    round("r1", { demand: maximum, service: maximum }),
    round("r2", { demand: maximum, service: maximum }),
  ));

  assert.equal(result.outcome, "incomplete");
  assert.deepEqual(result.metrics, {
    criticalCoverage: null,
    totalCoverage: null,
    environmentalCompliance: null,
  });
  assert.deepEqual(codes(result), ["AGGREGATE_QUANTITY_INVALID"]);
});

test("coverage uses aggregate service over aggregate demand across unequal rounds", () => {
  const result = evaluateScorecard(mission(), ledger(
    round("r1", {
      demand: { critical: 1, total: 1 },
      service: { critical: 1, total: 1 },
    }),
    round("r2", {
      demand: { critical: 9, total: 9 },
      service: { critical: 0, total: 0 },
    }),
  ));

  assert.equal(result.metrics.criticalCoverage, 0.1);
  assert.equal(result.metrics.totalCoverage, 0.1);
  assert.notEqual(result.metrics.totalCoverage, 0.5);
});

for (const [name, badRound, expectedCodes] of [
  ["negative quantity", round("r1", { demand: { critical: -1, total: 10 } }), ["QUANTITY_INVALID"]],
  ["non-finite quantity", round("r1", { service: { critical: 4, total: Infinity } }), ["QUANTITY_INVALID"]],
  ["service over demand", round("r1", { service: { critical: 4, total: 11 } }), ["SERVICE_EXCEEDS_DEMAND"]],
  ["critical demand over total", round("r1", { demand: { critical: 11, total: 10 } }), ["CRITICAL_DEMAND_EXCEEDS_TOTAL"]],
  ["critical service over total", round("r1", { service: { critical: 4, total: 3 } }), ["CRITICAL_SERVICE_EXCEEDS_TOTAL"]],
]) {
  test(`${name} returns incomplete with stable reasons`, () => {
    const result = evaluateScorecard(mission(), ledger(badRound, round("r2")));
    assert.equal(result.outcome, "incomplete");
    assert.deepEqual(codes(result), expectedCodes);
    assert.ok(Object.values(result.metrics).every((value) => value === null));
  });
}

test("an explicitly incomplete round is not scored", () => {
  const result = evaluateScorecard(mission(), ledger(round("r1"), { id: "r2", status: "incomplete" }));
  assert.equal(result.outcome, "incomplete");
  assert.deepEqual(codes(result), ["ROUND_INCOMPLETE"]);
});

test("incomplete rounds take precedence over low service and environmental noncompliance", () => {
  const result = evaluateScorecard(mission(), ledger(
    { id: "r1", status: "incomplete" },
    round("r2", {
      service: { critical: 0, total: 0 },
      environment: { status: "player-noncompliant", verifiable: true },
    }),
  ));

  assert.equal(result.outcome, "incomplete");
  assert.ok(Object.values(result.metrics).every((value) => value === null));
  assert.deepEqual(codes(result), ["ROUND_INCOMPLETE"]);
});

test("wrong round count is incomplete", () => {
  const result = evaluateScorecard(mission(), ledger(round("r1")));
  assert.equal(result.outcome, "incomplete");
  assert.deepEqual(codes(result), ["ROUND_COUNT_MISMATCH"]);
});

test("duplicate round ids are incomplete", () => {
  const result = evaluateScorecard(mission(), ledger(round("r1"), round("r1")));
  assert.equal(result.outcome, "incomplete");
  assert.deepEqual(codes(result), ["ROUND_ID_DUPLICATE"]);
});

for (const thresholds of [
  { criticalCoverage: -0.1, totalCoverage: 0.7 },
  { criticalCoverage: 0.8, totalCoverage: 1.1 },
  { criticalCoverage: Number.NaN, totalCoverage: 0.7 },
]) {
  test(`invalid thresholds ${JSON.stringify(thresholds)} are incomplete`, () => {
    const result = evaluateScorecard(mission({ thresholds }), ledger(round("r1"), round("r2")));
    assert.equal(result.outcome, "incomplete");
    assert.deepEqual(codes(result), ["THRESHOLD_INVALID"]);
  });
}

test("unsupported versions and invalid expected round count are incomplete without throwing", () => {
  assert.deepEqual(codes(evaluateScorecard(
    mission({ schemaVersion: "future", expectedRounds: 0 }),
    { schemaVersion: "future", rounds: [] },
  )), ["MISSION_VERSION_UNSUPPORTED", "EXPECTED_ROUNDS_INVALID", "LEDGER_VERSION_UNSUPPORTED"]);
  assert.equal(evaluateScorecard(null, null).outcome, "incomplete");
});

test("same input is deeply deterministic and neither input nor output can be mutated", () => {
  const inputMission = mission();
  const inputLedger = ledger(round("r1"), round("r2"));
  const before = structuredClone({ inputMission, inputLedger });
  const first = evaluateScorecard(inputMission, inputLedger);
  const second = evaluateScorecard(inputMission, inputLedger);

  assert.deepEqual(first, second);
  assert.deepEqual({ inputMission, inputLedger }, before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.metrics), true);
  assert.equal(Object.isFrozen(first.reasons), true);
  assert.equal(Object.isFrozen(first.reasons[0]), true);
  assert.throws(() => { first.metrics.totalCoverage = 0; }, TypeError);
  assert.throws(() => { first.reasons.push({ code: "TAMPER" }); }, TypeError);
});

test("incomplete results are deeply immutable without mutating inputs", () => {
  const inputMission = mission();
  const inputLedger = ledger(
    round("r1"),
    round("r2", { environment: { status: "compliant", verifiable: false } }),
  );
  const before = structuredClone({ inputMission, inputLedger });
  const result = evaluateScorecard(inputMission, inputLedger);

  assert.equal(result.outcome, "incomplete");
  assert.deepEqual({ inputMission, inputLedger }, before);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.metrics), true);
  assert.equal(Object.isFrozen(result.reasons), true);
  assert.equal(Object.isFrozen(result.reasons[0]), true);
  assert.throws(() => { result.metrics.totalCoverage = 0; }, TypeError);
  assert.throws(() => { result.reasons[0].code = "TAMPER"; }, TypeError);
  assert.throws(() => { result.reasons.push({ code: "TAMPER" }); }, TypeError);
});
