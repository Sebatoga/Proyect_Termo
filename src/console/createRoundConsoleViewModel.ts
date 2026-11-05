import {
  EXPECTED_ROUND_COUNT,
  type RoundSessionSnapshot,
  type RoundSessionStatus,
} from "../application/round-session/roundSessionPort";

export interface RoundConsoleViewModel {
  readonly status: Readonly<{
    code: RoundSessionStatus;
    text: string;
    reasonCode: string;
    reasonText: string;
  }>;
  readonly progress: Readonly<{
    index: number | null;
    count: number | null;
    currentRoundId: string | null;
    text: string;
  }>;
  readonly confirmation: Readonly<{
    allowed: boolean;
    text: string;
  }>;
}

const statusText: Readonly<Record<RoundSessionStatus, string>> = Object.freeze({
  unavailable: "Sesión no disponible.",
  "waiting-input": "Esperando una entrada validada.",
  ready: "Entrada validada lista para confirmar.",
  "reset-required": "Se requiere reiniciar la sesión.",
  completed: "Sesión completada.",
});

const statuses = new Set<RoundSessionStatus>(Object.keys(statusText) as RoundSessionStatus[]);
const snapshotKeys = [
  "status",
  "roundIndex",
  "roundCount",
  "currentRoundId",
  "reasonCode",
  "confirmationAllowed",
] as const;
const snapshotKeySet = new Set<PropertyKey>(snapshotKeys);

export const MAX_CURRENT_ROUND_ID_LENGTH = 64;
export const MAX_REASON_CODE_LENGTH = 64;

function isStatus(value: unknown): value is RoundSessionStatus {
  return statuses.has(value as RoundSessionStatus);
}

function isReasonCode(value: unknown): value is string {
  return typeof value === "string"
    && value.length > 0
    && value.length <= MAX_REASON_CODE_LENGTH;
}

function isRoundNumber(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function hasActiveRound(snapshot: RoundSessionSnapshot): boolean {
  return snapshot.roundCount === EXPECTED_ROUND_COUNT
    && isRoundNumber(snapshot.roundIndex)
    && snapshot.roundIndex < EXPECTED_ROUND_COUNT
    && typeof snapshot.currentRoundId === "string"
    && snapshot.currentRoundId.length > 0
    && snapshot.currentRoundId.length <= MAX_CURRENT_ROUND_ID_LENGTH;
}

function hasCompletedRounds(snapshot: RoundSessionSnapshot): boolean {
  return snapshot.roundCount === EXPECTED_ROUND_COUNT
    && snapshot.roundIndex === EXPECTED_ROUND_COUNT
    && snapshot.currentRoundId === null;
}

function isUnavailableWithoutRounds(snapshot: RoundSessionSnapshot): boolean {
  return snapshot.status === "unavailable"
    && snapshot.roundIndex === 0
    && snapshot.roundCount === 0
    && snapshot.currentRoundId === null;
}

function captureSnapshot(value: unknown): RoundSessionSnapshot | null {
  if (value === null || typeof value !== "object") return null;
  try {
    const keys = Reflect.ownKeys(value);
    if (keys.length !== snapshotKeys.length
      || keys.some((key) => typeof key !== "string" || !snapshotKeySet.has(key))) return null;
    const prototype = Reflect.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) return null;

    const captured: Record<string, unknown> = Object.create(null);
    for (const key of snapshotKeys) {
      const descriptor = Reflect.getOwnPropertyDescriptor(value, key);
      if (descriptor === undefined
        || !descriptor.enumerable
        || !("value" in descriptor)) return null;
      captured[key] = descriptor.value;
    }
    return captured as unknown as RoundSessionSnapshot;
  } catch {
    return null;
  }
}

function isSafeSnapshot(snapshot: RoundSessionSnapshot): boolean {
  if (!isStatus(snapshot.status)
    || !isReasonCode(snapshot.reasonCode)
    || typeof snapshot.confirmationAllowed !== "boolean") return false;
  if (snapshot.status === "unavailable") {
    return !snapshot.confirmationAllowed && isUnavailableWithoutRounds(snapshot);
  }
  if (snapshot.status === "completed") {
    return !snapshot.confirmationAllowed && hasCompletedRounds(snapshot);
  }
  if (!hasActiveRound(snapshot)) return false;
  return snapshot.status === "ready"
    ? snapshot.confirmationAllowed
    : !snapshot.confirmationAllowed;
}

export function createRoundConsoleViewModel(value: unknown): RoundConsoleViewModel {
  const captured = captureSnapshot(value);
  const snapshot = captured !== null && isSafeSnapshot(captured) ? captured : null;
  const code = snapshot?.status ?? "unavailable";
  const reasonCode = snapshot?.reasonCode ?? "SNAPSHOT_INVALIDO";
  const hasProgress = snapshot !== null && (hasActiveRound(snapshot) || hasCompletedRounds(snapshot));
  const allowed = snapshot?.status === "ready" && snapshot.confirmationAllowed && hasActiveRound(snapshot);

  const status = Object.freeze({
    code,
    text: statusText[code],
    reasonCode,
    reasonText: `Motivo: ${reasonCode}.`,
  });
  const progress = Object.freeze({
    index: hasProgress ? snapshot.roundIndex : null,
    count: hasProgress ? snapshot.roundCount : null,
    currentRoundId: hasProgress ? snapshot.currentRoundId : null,
    text: hasProgress
      ? `Progreso: ronda ${Math.min(snapshot.roundIndex + 1, snapshot.roundCount)} de ${snapshot.roundCount}.`
      : "Progreso: ronda no disponible.",
  });
  const confirmation = Object.freeze({
    allowed,
    text: `Confirmación disponible: ${allowed ? "sí" : "no"}.`,
  });

  return Object.freeze({ status, progress, confirmation });
}
