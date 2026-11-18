const MISSION_VERSION = "scorecard-mission/v1";
const LEDGER_VERSION = "scorecard-ledger/v1";
const RESULT_VERSION = "scorecard-result/v1";

const ENVIRONMENT_STATUSES = new Set([
  "compliant",
  "player-noncompliant",
  "natural-unavailability",
]);

const MESSAGES = Object.freeze({
  MISSION_INVALID: "Mission must be an object.",
  MISSION_VERSION_UNSUPPORTED: `Mission schemaVersion must be ${MISSION_VERSION}.`,
  MISSION_ID_INVALID: "Mission id must be a non-empty string.",
  EXPECTED_ROUNDS_INVALID: "Mission expectedRounds must be a positive integer.",
  THRESHOLD_INVALID: "Mission coverage thresholds must be finite numbers between 0 and 1.",
  LEDGER_INVALID: "Ledger must be an object with a rounds array.",
  LEDGER_VERSION_UNSUPPORTED: `Ledger schemaVersion must be ${LEDGER_VERSION}.`,
  ROUND_COUNT_MISMATCH: "Ledger round count does not match the mission.",
  ROUND_INVALID: "Each round must be an object.",
  ROUND_ID_INVALID: "Each round id must be a non-empty string.",
  ROUND_ID_DUPLICATE: "Round ids must be unique.",
  ROUND_STATUS_INVALID: "Round status must be resolved or incomplete.",
  ROUND_INCOMPLETE: "Every expected round must be resolved before scoring.",
  QUANTITY_INVALID: "Demand and service quantities must be finite and non-negative.",
  AGGREGATE_QUANTITY_INVALID: "Aggregate demand and service totals must be finite and non-negative.",
  CRITICAL_DEMAND_EXCEEDS_TOTAL: "Critical demand cannot exceed total demand.",
  SERVICE_EXCEEDS_DEMAND: "Service cannot exceed its corresponding demand.",
  CRITICAL_SERVICE_EXCEEDS_TOTAL: "Critical service cannot exceed total service.",
  ENVIRONMENT_INVALID: "Resolved rounds require a recognized environmental status and boolean verifiable flag.",
  ENVIRONMENT_UNVERIFIABLE: "Environmental evidence must be verifiable before scoring.",
  NO_TOTAL_DEMAND: "A mission with no external total demand cannot produce a victory.",
  CRITICAL_COVERAGE_BELOW_THRESHOLD: "Critical coverage is below the mission threshold.",
  TOTAL_COVERAGE_BELOW_THRESHOLD: "Total coverage is below the mission threshold.",
  ENVIRONMENT_NONCOMPLIANT: "A player-attributable environmental breach prevents victory.",
  VICTORY: "All scorecard conditions were met.",
});

const reason = (code, details = {}) => ({ code, message: MESSAGES[code], ...details });
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isQuantity = (value) => Number.isFinite(value) && value >= 0;
const isThreshold = (value) => Number.isFinite(value) && value >= 0 && value <= 1;

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

function incomplete(reasons) {
  return deepFreeze({
    schemaVersion: RESULT_VERSION,
    outcome: "incomplete",
    metrics: {
      criticalCoverage: null,
      totalCoverage: null,
      environmentalCompliance: null,
    },
    reasons,
  });
}

function validateMission(mission) {
  const reasons = [];
  if (!isObject(mission)) return [reason("MISSION_INVALID")];
  if (mission.schemaVersion !== MISSION_VERSION) reasons.push(reason("MISSION_VERSION_UNSUPPORTED"));
  if (!isNonEmptyString(mission.id)) reasons.push(reason("MISSION_ID_INVALID"));
  if (!Number.isInteger(mission.expectedRounds) || mission.expectedRounds <= 0) {
    reasons.push(reason("EXPECTED_ROUNDS_INVALID"));
  }
  if (!isObject(mission.thresholds)
    || !isThreshold(mission.thresholds.criticalCoverage)
    || !isThreshold(mission.thresholds.totalCoverage)) {
    reasons.push(reason("THRESHOLD_INVALID"));
  }
  return reasons;
}

function validateRound(round, index, seenIds) {
  const reasons = [];
  if (!isObject(round)) return [reason("ROUND_INVALID", { roundIndex: index })];

  if (!isNonEmptyString(round.id)) {
    reasons.push(reason("ROUND_ID_INVALID", { roundIndex: index }));
  } else if (seenIds.has(round.id)) {
    reasons.push(reason("ROUND_ID_DUPLICATE", { roundId: round.id, roundIndex: index }));
  } else {
    seenIds.add(round.id);
  }

  if (round.status !== "resolved" && round.status !== "incomplete") {
    reasons.push(reason("ROUND_STATUS_INVALID", { roundId: round.id, roundIndex: index }));
    return reasons;
  }
  if (round.status === "incomplete") {
    reasons.push(reason("ROUND_INCOMPLETE", { roundId: round.id, roundIndex: index }));
    return reasons;
  }

  const quantities = [
    round.demand?.critical,
    round.demand?.total,
    round.service?.critical,
    round.service?.total,
  ];
  if (!quantities.every(isQuantity)) {
    reasons.push(reason("QUANTITY_INVALID", { roundId: round.id, roundIndex: index }));
  } else {
    if (round.demand.critical > round.demand.total) {
      reasons.push(reason("CRITICAL_DEMAND_EXCEEDS_TOTAL", { roundId: round.id, roundIndex: index }));
    }
    if (round.service.critical > round.demand.critical || round.service.total > round.demand.total) {
      reasons.push(reason("SERVICE_EXCEEDS_DEMAND", { roundId: round.id, roundIndex: index }));
    }
    if (round.service.critical > round.service.total) {
      reasons.push(reason("CRITICAL_SERVICE_EXCEEDS_TOTAL", { roundId: round.id, roundIndex: index }));
    }
  }

  if (!isObject(round.environment)
    || !ENVIRONMENT_STATUSES.has(round.environment.status)
    || typeof round.environment.verifiable !== "boolean") {
    reasons.push(reason("ENVIRONMENT_INVALID", { roundId: round.id, roundIndex: index }));
  } else if (!round.environment.verifiable) {
    reasons.push(reason("ENVIRONMENT_UNVERIFIABLE", { roundId: round.id, roundIndex: index }));
  }
  return reasons;
}

function coverage(served, required) {
  return required === 0 ? 1 : served / required;
}

/**
 * Evaluates a synthetic mission ledger without physics, hardware, time or randomness.
 * Ordinary invalid domain input returns an incomplete result instead of throwing.
 */
export function evaluateScorecard(mission, ledger) {
  const validationReasons = validateMission(mission);
  if (!isObject(ledger) || !Array.isArray(ledger.rounds)) {
    return incomplete([...validationReasons, reason("LEDGER_INVALID")]);
  }
  if (ledger.schemaVersion !== LEDGER_VERSION) {
    validationReasons.push(reason("LEDGER_VERSION_UNSUPPORTED"));
  }
  if (Number.isInteger(mission?.expectedRounds) && mission.expectedRounds > 0
    && ledger.rounds.length !== mission.expectedRounds) {
    validationReasons.push(reason("ROUND_COUNT_MISMATCH", {
      expected: mission.expectedRounds,
      actual: ledger.rounds.length,
    }));
  }

  const seenIds = new Set();
  ledger.rounds.forEach((round, index) => validationReasons.push(...validateRound(round, index, seenIds)));
  if (validationReasons.length > 0) return incomplete(validationReasons);

  const totals = ledger.rounds.reduce((sum, round) => ({
    criticalDemand: sum.criticalDemand + round.demand.critical,
    totalDemand: sum.totalDemand + round.demand.total,
    criticalService: sum.criticalService + round.service.critical,
    totalService: sum.totalService + round.service.total,
  }), { criticalDemand: 0, totalDemand: 0, criticalService: 0, totalService: 0 });
  if (!Object.values(totals).every(isQuantity)) {
    return incomplete([reason("AGGREGATE_QUANTITY_INVALID")]);
  }

  const metrics = {
    criticalCoverage: coverage(totals.criticalService, totals.criticalDemand),
    totalCoverage: coverage(totals.totalService, totals.totalDemand),
    environmentalCompliance: ledger.rounds.every(
      (round) => round.environment.status !== "player-noncompliant",
    ),
  };
  const outcomeReasons = [];
  if (totals.totalDemand === 0) outcomeReasons.push(reason("NO_TOTAL_DEMAND"));
  if (metrics.criticalCoverage < mission.thresholds.criticalCoverage) {
    outcomeReasons.push(reason("CRITICAL_COVERAGE_BELOW_THRESHOLD"));
  }
  if (metrics.totalCoverage < mission.thresholds.totalCoverage) {
    outcomeReasons.push(reason("TOTAL_COVERAGE_BELOW_THRESHOLD"));
  }
  if (!metrics.environmentalCompliance) outcomeReasons.push(reason("ENVIRONMENT_NONCOMPLIANT"));

  return deepFreeze({
    schemaVersion: RESULT_VERSION,
    outcome: outcomeReasons.length === 0 ? "victory" : "defeat",
    metrics,
    reasons: outcomeReasons.length === 0 ? [reason("VICTORY")] : outcomeReasons,
  });
}

export const SCORECARD_VERSIONS = Object.freeze({
  mission: MISSION_VERSION,
  ledger: LEDGER_VERSION,
  result: RESULT_VERSION,
});
