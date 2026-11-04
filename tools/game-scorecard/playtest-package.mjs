const VERSIONS = Object.freeze({
  manifest: "eco004-experiment-manifest/v1",
  policies: "eco004-policies/v1",
  record: "eco004-playtest-record/v1",
  package: "eco004-playtest-package/v1",
  validation: "eco004-package-validation/v1",
});

const ROUND_IDS = Object.freeze([
  "round-1", "round-2", "round-3", "round-4", "round-5", "round-6",
]);
const REQUIRED_POLICIES = Object.freeze([
  "do-nothing",
  "critical-only",
  "maximum-hydro-request",
  "environment-first",
  "resource-aware-balanced",
]);
const POLICY_ACTIONS = Object.freeze({
  "do-nothing": "retain-declared-state",
  "critical-only": "prioritize-critical",
  "maximum-hydro-request": "request-maximum-hydro",
  "environment-first": "protect-environmental-constraint",
  "resource-aware-balanced": "balance-declared-resources",
});
const REQUIRED_REPETITIONS = Object.freeze([
  Object.freeze({ id: "rep-1", order: "registered" }),
  Object.freeze({ id: "rep-2", order: "reverse" }),
]);
const REQUIRED_BLOCKERS = Object.freeze([
  "EXECUTION_NOT_RUN",
  "RESOLVER_VERSION_MISSING",
  "THRESHOLD_CANDIDATES_EMPTY",
  "ENVIRONMENTAL_REVIEW_PENDING",
]);
const HUMAN_FIELDS = Object.freeze([
  "applicability", "anonymousCode", "consent", "approximateAge", "gameExperience",
  "facilitatorCode",
]);
const ENVIRONMENT_CLASSIFICATION_FIELDS = Object.freeze([
  "status", "verdict", "causalTrigger", "compliantAlternative", "visibility",
]);
const RESULT_KEYS = new Set([
  "expected", "obtained", "outcome", "outcomes", "coverage", "coverages", "metric",
  "metrics", "result", "results", "service", "services", "scorecardoutput", "scorecardoutputs",
  "candidateevaluation", "candidateevaluations", "candidatescore", "candidatescores",
  "evaluation", "evaluations",
]);
const PARTICIPANT_KEYS = new Set(["participant", "participants"]);
const SCHEMA_PROPERTIES = Object.freeze({
  manifest: Object.freeze([
    "schemaVersion", "packageVersion", "policySchemaVersion", "recordSchemaVersion",
    "status", "roundSlots", "policyIds", "repetitions", "resolverVersion",
    "thresholdCandidates", "blockerCodes",
  ]),
  roundSlot: Object.freeze(["id"]),
  repetition: Object.freeze(["id", "order"]),
  thresholdCandidates: Object.freeze(["criticalCoverage", "totalCoverage"]),
  policies: Object.freeze(["schemaVersion", "packageVersion", "policies"]),
  policy: Object.freeze(["id", "decisions"]),
  decision: Object.freeze(["roundId", "action"]),
  record: Object.freeze([
    "schemaVersion", "packageVersion", "status", "header", "rounds", "result",
    "exclusionReason",
  ]),
  header: Object.freeze([
    "recordId", "mode", "policyId", "repetitionId", "order", "resolverVersion",
    "startedAt", "human",
  ]),
  human: Object.freeze(HUMAN_FIELDS),
  round: Object.freeze(["id", "expected", "obtained", "environment"]),
  environment: Object.freeze([
    "status", "environmentVerifiable", "evidence", "causalTrigger",
    "compliantAlternative", "visibility", "verdict",
  ]),
});
const MESSAGES = Object.freeze({
  PACKAGE_INVALID: "Manifest, policies and record must be objects.",
  UNKNOWN_FIELD: "A schema v1 object contains an unknown field.",
  VERSION_UNSUPPORTED: "A schema version is unsupported.",
  VERSION_INCONSISTENT: "Package and referenced schema versions must be consistent.",
  STATUS_INVALID: "Manifest and record status must both be exactly NOT_RUN.",
  RESOLVER_VERSION_INVALID: "Resolver versions must remain null in an empty package.",
  BLOCKER_SET_INVALID: "The empty package requires exactly the four preregistration blockers.",
  ROUND_COUNT_INVALID: "Exactly six round slots and record rounds are required.",
  ROUND_ID_INVALID: "Round ids and order must be exactly round-1 through round-6.",
  POLICY_SET_INVALID: "Exactly the five required policies must be preregistered in order.",
  POLICY_DECISIONS_INVALID: "Each policy requires one decision for every canonical round in order.",
  POLICY_ACTION_INVALID: "Policy actions must match the preregistered symbolic action.",
  POLICY_PREFILLED_RESULT: "Policies cannot contain expected or obtained results, scorecard outputs or evaluations.",
  REPETITIONS_INVALID: "Repetitions must be rep-1 registered then rep-2 reverse.",
  THRESHOLD_PREFILLED: "Threshold candidates and aliases must remain empty while status is NOT_RUN.",
  PARTICIPANT_PREFILLED: "Human participant fields and participant aliases must remain empty.",
  RESULT_PREFILLED: "Expected, obtained, outcome, scorecard and evaluation fields must remain empty.",
  HEADER_PREFILLED: "Policy, repetition, order and resolver header fields must remain null.",
  ENVIRONMENT_PREFILLED: "Environmental classification, causality and evidence must remain empty while NOT_RUN.",
  EVIDENCE_REFERENCE_INVALID: "Evidence references must be non-empty strings.",
});

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isText = (value) => typeof value === "string" && value.trim().length > 0;
const issue = (code, details = {}) => ({ code, message: MESSAGES[code], ...details });
const normalizeKey = (key) => key.toLowerCase().replace(/[^a-z0-9]/gu, "");
const arraysEqual = (actual, expected) => Array.isArray(actual)
  && actual.length === expected.length
  && actual.every((value, index) => value === expected[index]);

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function containsKey(value, keys) {
  if (Array.isArray(value)) return value.some((child) => containsKey(child, keys));
  if (!isObject(value)) return false;
  return Object.entries(value).some(([key, child]) => (
    keys.has(normalizeKey(key)) || containsKey(child, keys)
  ));
}

function containsPopulatedKey(value, keys) {
  if (Array.isArray(value)) return value.some((child) => containsPopulatedKey(child, keys));
  if (!isObject(value)) return false;
  return Object.entries(value).some(([key, child]) => (
    (keys.has(normalizeKey(key)) && child !== null && child !== undefined
      && child !== "not-applicable")
    || containsPopulatedKey(child, keys)
  ));
}

function validateExactProperties(value, allowedProperties, path, errors) {
  if (!isObject(value)) return;
  const allowed = new Set(allowedProperties);
  Object.keys(value).filter((key) => !allowed.has(key)).sort().forEach((key) => {
    errors.push(issue("UNKNOWN_FIELD", { path: `${path}.${key}` }));
  });
}

function validateClosedSchema(manifest, policies, record, errors) {
  validateExactProperties(manifest, SCHEMA_PROPERTIES.manifest, "manifest", errors);
  if (Array.isArray(manifest.roundSlots)) {
    manifest.roundSlots.forEach((slot, index) => {
      validateExactProperties(slot, SCHEMA_PROPERTIES.roundSlot, `manifest.roundSlots[${index}]`, errors);
    });
  }
  if (Array.isArray(manifest.repetitions)) {
    manifest.repetitions.forEach((repetition, index) => {
      validateExactProperties(
        repetition, SCHEMA_PROPERTIES.repetition, `manifest.repetitions[${index}]`, errors,
      );
    });
  }
  validateExactProperties(
    manifest.thresholdCandidates,
    SCHEMA_PROPERTIES.thresholdCandidates,
    "manifest.thresholdCandidates",
    errors,
  );

  validateExactProperties(policies, SCHEMA_PROPERTIES.policies, "policies", errors);
  if (Array.isArray(policies.policies)) {
    policies.policies.forEach((policy, policyIndex) => {
      const policyPath = `policies.policies[${policyIndex}]`;
      validateExactProperties(policy, SCHEMA_PROPERTIES.policy, policyPath, errors);
      if (Array.isArray(policy?.decisions)) {
        policy.decisions.forEach((decision, decisionIndex) => {
          validateExactProperties(
            decision,
            SCHEMA_PROPERTIES.decision,
            `${policyPath}.decisions[${decisionIndex}]`,
            errors,
          );
        });
      }
    });
  }

  validateExactProperties(record, SCHEMA_PROPERTIES.record, "record", errors);
  validateExactProperties(record.header, SCHEMA_PROPERTIES.header, "record.header", errors);
  validateExactProperties(record.header?.human, SCHEMA_PROPERTIES.human, "record.header.human", errors);
  if (Array.isArray(record.rounds)) {
    record.rounds.forEach((round, index) => {
      const roundPath = `record.rounds[${index}]`;
      validateExactProperties(round, SCHEMA_PROPERTIES.round, roundPath, errors);
      validateExactProperties(
        round?.environment, SCHEMA_PROPERTIES.environment, `${roundPath}.environment`, errors,
      );
    });
  }
}

function validateRounds(manifest, record, errors) {
  const slots = manifest.roundSlots;
  const rounds = record.rounds;
  if (!Array.isArray(slots) || !Array.isArray(rounds)
    || slots.length !== ROUND_IDS.length || rounds.length !== ROUND_IDS.length) {
    errors.push(issue("ROUND_COUNT_INVALID"));
    return;
  }
  if (!arraysEqual(slots.map((slot) => slot?.id), ROUND_IDS)
    || !arraysEqual(rounds.map((round) => round?.id), ROUND_IDS)) {
    errors.push(issue("ROUND_ID_INVALID"));
  }
}

function validatePolicies(manifest, policies, errors) {
  const policyEntries = policies.policies;
  if (!arraysEqual(manifest.policyIds, REQUIRED_POLICIES)
    || !Array.isArray(policyEntries)
    || !arraysEqual(policyEntries.map((policy) => policy?.id), REQUIRED_POLICIES)) {
    errors.push(issue("POLICY_SET_INVALID"));
    return;
  }
  if (containsPopulatedKey(policies, RESULT_KEYS)) {
    errors.push(issue("POLICY_PREFILLED_RESULT"));
  }
  for (const policy of policyEntries) {
    const decisions = policy.decisions;
    if (!Array.isArray(decisions)
      || !arraysEqual(decisions.map((decision) => decision?.roundId), ROUND_IDS)) {
      errors.push(issue("POLICY_DECISIONS_INVALID", { policyId: policy.id }));
      continue;
    }
    if (!decisions.every((decision) => decision?.action === POLICY_ACTIONS[policy.id])) {
      errors.push(issue("POLICY_ACTION_INVALID", { policyId: policy.id }));
    }
  }
}

function validateRepetitions(manifest, errors) {
  const repetitions = manifest.repetitions;
  if (!Array.isArray(repetitions) || repetitions.length !== REQUIRED_REPETITIONS.length
    || !repetitions.every((repetition, index) => (
      repetition?.id === REQUIRED_REPETITIONS[index].id
      && repetition?.order === REQUIRED_REPETITIONS[index].order
    ))) {
    errors.push(issue("REPETITIONS_INVALID"));
  }
}

function validateThresholds(manifest, errors) {
  const candidates = manifest.thresholdCandidates;
  const thresholdKeys = Object.keys(manifest).filter((key) => (
    normalizeKey(key).includes("threshold") && key !== "thresholdCandidates"
  ));
  if (!isObject(candidates)
    || !arraysEqual(Object.keys(candidates).sort(), ["criticalCoverage", "totalCoverage"])
    || !Array.isArray(candidates.criticalCoverage) || candidates.criticalCoverage.length !== 0
    || !Array.isArray(candidates.totalCoverage) || candidates.totalCoverage.length !== 0
    || thresholdKeys.length !== 0) {
    errors.push(issue("THRESHOLD_PREFILLED"));
  }
}

function validateHeaderAndParticipants(record, errors) {
  const header = record.header;
  if (!isObject(header)
    || ["policyId", "repetitionId", "order", "resolverVersion"]
      .some((key) => header[key] !== null)) {
    errors.push(issue("HEADER_PREFILLED"));
  }
  const human = header?.human;
  if (!isObject(human) || !HUMAN_FIELDS.every((key) => human[key] === null)
    || containsKey(record, PARTICIPANT_KEYS)) {
    errors.push(issue("PARTICIPANT_PREFILLED"));
  }
}

function validateEnvironment(record, errors) {
  if (!Array.isArray(record.rounds)) return;
  for (const round of record.rounds) {
    const environment = round?.environment;
    if (!isObject(environment)) {
      errors.push(issue("ENVIRONMENT_PREFILLED", { roundId: round?.id }));
      continue;
    }
    const evidence = environment.evidence;
    if (Array.isArray(evidence) && evidence.length > 0 && !evidence.every(isText)) {
      errors.push(issue("EVIDENCE_REFERENCE_INVALID", { roundId: round.id }));
    }
    if (ENVIRONMENT_CLASSIFICATION_FIELDS.some((key) => (
      environment[key] !== null && environment[key] !== "not-applicable"
    )) || environment.environmentVerifiable === true
      || !Array.isArray(evidence) || evidence.length !== 0) {
      errors.push(issue("ENVIRONMENT_PREFILLED", { roundId: round.id }));
    }
  }
}

function validateBlockers(manifest, errors) {
  const blockers = manifest.blockerCodes;
  if (!Array.isArray(blockers) || blockers.length !== REQUIRED_BLOCKERS.length
    || new Set(blockers).size !== REQUIRED_BLOCKERS.length
    || !REQUIRED_BLOCKERS.every((blocker) => blockers.includes(blocker))) {
    errors.push(issue("BLOCKER_SET_INVALID"));
  }
}

/** Validates already-loaded empty preregistration objects without filesystem access. */
export function validatePlaytestPackage(input = {}) {
  const manifest = isObject(input) ? input.manifest : undefined;
  const policies = isObject(input) ? input.policies : undefined;
  const record = isObject(input) ? input.record : undefined;
  const errors = [];
  if (![manifest, policies, record].every(isObject)) {
    return deepFreeze({ schemaVersion: VERSIONS.validation, valid: false, ready: false,
      errors: [issue("PACKAGE_INVALID")], blockers: [] });
  }
  validateClosedSchema(manifest, policies, record, errors);
  if (manifest.schemaVersion !== VERSIONS.manifest || policies.schemaVersion !== VERSIONS.policies
    || record.schemaVersion !== VERSIONS.record || manifest.packageVersion !== VERSIONS.package) {
    errors.push(issue("VERSION_UNSUPPORTED"));
  }
  if (policies.packageVersion !== manifest.packageVersion || record.packageVersion !== manifest.packageVersion
    || manifest.policySchemaVersion !== policies.schemaVersion
    || manifest.recordSchemaVersion !== record.schemaVersion) {
    errors.push(issue("VERSION_INCONSISTENT"));
  }
  if (manifest.status !== "NOT_RUN" || record.status !== "NOT_RUN") {
    errors.push(issue("STATUS_INVALID"));
  }
  if (manifest.resolverVersion !== null || record.header?.resolverVersion !== null) {
    errors.push(issue("RESOLVER_VERSION_INVALID"));
  }

  validateBlockers(manifest, errors);
  validateRounds(manifest, record, errors);
  validatePolicies(manifest, policies, errors);
  validateRepetitions(manifest, errors);
  validateThresholds(manifest, errors);
  validateHeaderAndParticipants(record, errors);
  if (containsPopulatedKey(record, RESULT_KEYS)) errors.push(issue("RESULT_PREFILLED"));
  validateEnvironment(record, errors);

  const blockers = Array.isArray(manifest.blockerCodes)
    ? manifest.blockerCodes.map((code) => ({ code })) : [];
  return deepFreeze({
    schemaVersion: VERSIONS.validation,
    valid: errors.length === 0,
    ready: false,
    errors,
    blockers,
  });
}

export const PLAYTEST_PACKAGE_VERSIONS = VERSIONS;
