import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validatePlaytestPackage } from "./playtest-package.mjs";

const load = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const sourcePackage = async () => ({
  manifest: await load("../../evidencias/ECO-004/fixtures/experiment-manifest.json"),
  policies: await load("../../evidencias/ECO-004/fixtures/policies.json"),
  record: await load("../../evidencias/ECO-004/templates/playtest-record.json"),
});
const clone = (value) => structuredClone(value);
const errorCodes = (result) => result.errors.map(({ code }) => code);
const assertRejected = (result, code) => {
  assert.equal(result.valid, false);
  assert.equal(result.ready, false);
  assert.ok(errorCodes(result).includes(code));
};
const assertUnknownField = (result, path) => {
  assertRejected(result, "UNKNOWN_FIELD");
  assert.ok(result.errors.some((error) => error.code === "UNKNOWN_FIELD" && error.path === path));
};

test("accepts the canonical empty package as valid but never ready", async () => {
  const result = validatePlaytestPackage(await sourcePackage());
  assert.equal(result.valid, true);
  assert.equal(result.ready, false);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.blockers.map(({ code }) => code), [
    "EXECUTION_NOT_RUN", "RESOLVER_VERSION_MISSING",
    "THRESHOLD_CANDIDATES_EMPTY", "ENVIRONMENTAL_REVIEW_PENDING",
  ]);
});

test("rejects empty blockers combined with an invented resolver", async () => {
  const input = await sourcePackage();
  input.manifest.blockerCodes = [];
  input.manifest.resolverVersion = "resolver/fake";
  assertRejected(validatePlaytestPackage(input), "BLOCKER_SET_INVALID");
  assert.ok(errorCodes(validatePlaytestPackage(input)).includes("RESOLVER_VERSION_INVALID"));
});

test("rejects populated obtained and expected fields", async () => {
  const input = await sourcePackage();
  input.record.rounds[0].obtained = { criticalCoverage: 1 };
  input.record.rounds[1].expected = "victory";
  assertRejected(validatePlaytestPackage(input), "RESULT_PREFILLED");
});

test("rejects participants arrays, including nested aliases", async () => {
  const input = await sourcePackage();
  input.record.metadata = { cohort: { participants: [{ anonymousCode: "person-1" }] } };
  assertRejected(validatePlaytestPackage(input), "PARTICIPANT_PREFILLED");
});

test("rejects compliant environmental classification while NOT_RUN", async () => {
  const input = await sourcePackage();
  input.record.rounds[0].environment.status = "compliant";
  assertRejected(validatePlaytestPackage(input), "ENVIRONMENT_PREFILLED");
});

test("rejects null evidence references", async () => {
  const input = await sourcePackage();
  input.record.rounds[0].environment.evidence = [null];
  const result = validatePlaytestPackage(input);
  assertRejected(result, "EVIDENCE_REFERENCE_INVALID");
  assert.ok(errorCodes(result).includes("ENVIRONMENT_PREFILLED"));
});

test("rejects a COMPLETE record", async () => {
  const input = await sourcePackage();
  input.record.status = "COMPLETE";
  assertRejected(validatePlaytestPackage(input), "STATUS_INVALID");
});

test("rejects invented header policy, repetition, order and resolver", async () => {
  const input = await sourcePackage();
  Object.assign(input.record.header, {
    policyId: "do-nothing",
    repetitionId: "rep-1",
    order: "registered",
    resolverVersion: "resolver/fake",
  });
  const result = validatePlaytestPackage(input);
  assertRejected(result, "HEADER_PREFILLED");
  assert.ok(errorCodes(result).includes("RESOLVER_VERSION_INVALID"));
});

test("rejects arbitrary canonical-slot replacements in manifest and record", async () => {
  const input = await sourcePackage();
  input.manifest.roundSlots[0].id = "opening-round";
  input.record.rounds[0].id = "opening-round";
  input.policies.policies.forEach((policy) => {
    policy.decisions[0].roundId = "opening-round";
  });
  assertRejected(validatePlaytestPackage(input), "ROUND_ID_INVALID");
});

test("rejects arbitrary repetition ids even with the correct order", async () => {
  const input = await sourcePackage();
  input.manifest.repetitions[0].id = "repetition-1";
  input.manifest.repetitions[1].id = "repetition-2";
  assertRejected(validatePlaytestPackage(input), "REPETITIONS_INVALID");
});

test("rejects top-level threshold aliases", async () => {
  const input = await sourcePackage();
  input.manifest.thresholds = { critical: [0.8], total: [0.7] };
  assertRejected(validatePlaytestPackage(input), "THRESHOLD_PREFILLED");
});

test("rejects a victory action not present in the preregistered policy", async () => {
  const input = await sourcePackage();
  input.policies.policies[0].decisions[0].action = "victory";
  assertRejected(validatePlaytestPackage(input), "POLICY_ACTION_INVALID");
});

test("rejects scorecard outputs and candidate evaluations", async () => {
  const input = await sourcePackage();
  input.record.scorecardOutputs = { criticalCoverage: 1 };
  input.record.candidateEvaluations = [{ candidate: 0.8, accepted: true }];
  assertRejected(validatePlaytestPackage(input), "RESULT_PREFILLED");
});

test("rejects missing, duplicate and extra blockers", async () => {
  for (const blockerCodes of [
    ["EXECUTION_NOT_RUN"],
    ["EXECUTION_NOT_RUN", "RESOLVER_VERSION_MISSING", "THRESHOLD_CANDIDATES_EMPTY",
      "THRESHOLD_CANDIDATES_EMPTY"],
    ["EXECUTION_NOT_RUN", "RESOLVER_VERSION_MISSING", "THRESHOLD_CANDIDATES_EMPTY",
      "ENVIRONMENTAL_REVIEW_PENDING", "EXTRA"],
  ]) {
    const input = await sourcePackage();
    input.manifest.blockerCodes = blockerCodes;
    assertRejected(validatePlaytestPackage(input), "BLOCKER_SET_INVALID");
  }
});

for (const [name, mutate, code] of [
  ["duplicate round", (p) => { p.record.rounds[1].id = "round-1"; }, "ROUND_ID_INVALID"],
  ["missing round", (p) => { p.record.rounds.pop(); }, "ROUND_COUNT_INVALID"],
  ["missing policy", (p) => { p.policies.policies.pop(); }, "POLICY_SET_INVALID"],
  ["reordered policy", (p) => { p.policies.policies.reverse(); }, "POLICY_SET_INVALID"],
  ["missing decision", (p) => { p.policies.policies[0].decisions.pop(); }, "POLICY_DECISIONS_INVALID"],
  ["reordered decision", (p) => { p.policies.policies[0].decisions.reverse(); }, "POLICY_DECISIONS_INVALID"],
  ["missing repetition", (p) => { p.manifest.repetitions.pop(); }, "REPETITIONS_INVALID"],
  ["invalid repetition order", (p) => { p.manifest.repetitions[1].order = "registered"; }, "REPETITIONS_INVALID"],
  ["inconsistent versions", (p) => { p.record.packageVersion = "other"; }, "VERSION_INCONSISTENT"],
]) {
  test(`rejects ${name}`, async () => {
    const input = await sourcePackage();
    mutate(input);
    assertRejected(validatePlaytestPackage(input), code);
  });
}

test("rejects services or outcomes embedded in preregistered policies", async () => {
  const input = await sourcePackage();
  input.policies.policies[0].decisions[0].services = { total: 1 };
  input.policies.policies[0].decisions[1].outcome = "victory";
  assertRejected(validatePlaytestPackage(input), "POLICY_PREFILLED_RESULT");
});

test("rejects non-null human template fields", async () => {
  const input = await sourcePackage();
  input.record.header.human.anonymousCode = "person-1";
  assertRejected(validatePlaytestPackage(input), "PARTICIPANT_PREFILLED");
});

test("rejects populated threshold candidates", async () => {
  const input = await sourcePackage();
  input.manifest.thresholdCandidates.totalCoverage.push(0.7);
  assertRejected(validatePlaytestPackage(input), "THRESHOLD_PREFILLED");
});

for (const [name, mutate, path] of [
  ["manifest.resolver", (p) => { p.manifest.resolver = "paper"; }, "manifest.resolver"],
  ["header.human.name", (p) => { p.record.header.human.name = "Ada"; }, "record.header.human.name"],
  ["record.finalOutcome", (p) => { p.record.finalOutcome = "victory"; }, "record.finalOutcome"],
  ["record.metadata.thresholds", (p) => {
    p.record.metadata = { thresholds: { criticalCoverage: 1 } };
  }, "record.metadata"],
  ["environment.reviewer", (p) => {
    p.record.rounds[0].environment.reviewer = "reviewer-1";
  }, "record.rounds[0].environment.reviewer"],
  ["record.science.validated", (p) => {
    p.record.science = { validated: true };
  }, "record.science"],
  ["decision.resolvedAction", (p) => {
    p.policies.policies[0].decisions[0].resolvedAction = "retain-declared-state";
  }, "policies.policies[0].decisions[0].resolvedAction"],
  ["roundSlot.label", (p) => {
    p.manifest.roundSlots[0].label = "Opening";
  }, "manifest.roundSlots[0].label"],
  ["repetition.seed", (p) => {
    p.manifest.repetitions[0].seed = 1;
  }, "manifest.repetitions[0].seed"],
  ["thresholdCandidates.units", (p) => {
    p.manifest.thresholdCandidates.units = "ratio";
  }, "manifest.thresholdCandidates.units"],
  ["policies.source", (p) => {
    p.policies.source = "facilitator";
  }, "policies.source"],
  ["policy.notes", (p) => {
    p.policies.policies[0].notes = [];
  }, "policies.policies[0].notes"],
  ["header.notes", (p) => {
    p.record.header.notes = null;
  }, "record.header.notes"],
  ["round.notes", (p) => {
    p.record.rounds[0].notes = null;
  }, "record.rounds[0].notes"],
]) {
  test(`rejects closed-schema bypass ${name} with its field path`, async () => {
    const input = await sourcePackage();
    mutate(input);
    assertUnknownField(validatePlaytestPackage(input), path);
  });
}

test("ordinary malformed inputs do not throw", () => {
  for (const input of [undefined, null, [], {}, { manifest: {}, policies: null, record: {} }]) {
    assert.doesNotThrow(() => validatePlaytestPackage(input));
    const result = validatePlaytestPackage(input);
    assert.equal(result.valid, false);
    assert.equal(result.ready, false);
  }
});

test("no mutation can make a schema v1 package ready", async () => {
  const mutations = [
    () => {},
    (input) => { input.manifest.blockerCodes = []; },
    (input) => { input.manifest.resolverVersion = "resolver/fake"; },
    (input) => { input.record.status = "COMPLETE"; },
  ];
  for (const mutate of mutations) {
    const input = await sourcePackage();
    mutate(input);
    assert.equal(validatePlaytestPackage(input).ready, false);
  }
});

test("is deterministic, deeply immutable and does not mutate input", async () => {
  const input = await sourcePackage();
  const before = clone(input);
  const first = validatePlaytestPackage(input);
  const second = validatePlaytestPackage(input);
  assert.deepEqual(first, second);
  assert.deepEqual(input, before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.errors), true);
  assert.equal(Object.isFrozen(first.blockers), true);
  assert.equal(Object.isFrozen(first.blockers[0]), true);
  assert.throws(() => first.blockers.push({ code: "TAMPER" }), TypeError);
});
