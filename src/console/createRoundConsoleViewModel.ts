import type {
  RoundSessionSnapshot,
  RoundSessionStatus,
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

function isStatus(value: unknown): value is RoundSessionStatus {
  return statuses.has(value as RoundSessionStatus);
}

function isReasonCode(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function hasActiveRound(snapshot: RoundSessionSnapshot): boolean {
  return Number.isInteger(snapshot.roundCount)
    && snapshot.roundCount > 0
    && Number.isInteger(snapshot.roundIndex)
    && snapshot.roundIndex >= 0
    && snapshot.roundIndex < snapshot.roundCount
    && typeof snapshot.currentRoundId === "string"
    && snapshot.currentRoundId.length > 0;
}

function hasCompletedRounds(snapshot: RoundSessionSnapshot): boolean {
  return Number.isInteger(snapshot.roundCount)
    && snapshot.roundCount > 0
    && snapshot.roundIndex === snapshot.roundCount
    && snapshot.currentRoundId === null;
}

function isUnavailableWithoutRounds(snapshot: RoundSessionSnapshot): boolean {
  return snapshot.status === "unavailable"
    && snapshot.roundIndex === 0
    && snapshot.roundCount === 0
    && snapshot.currentRoundId === null;
}

function isSafeSnapshot(value: unknown): value is RoundSessionSnapshot {
  if (value === null || typeof value !== "object") return false;
  const snapshot = value as RoundSessionSnapshot;
  if (!isStatus(snapshot.status)
    || !isReasonCode(snapshot.reasonCode)
    || typeof snapshot.confirmationAllowed !== "boolean") return false;
  if (snapshot.status === "completed") return hasCompletedRounds(snapshot);
  return hasActiveRound(snapshot) || isUnavailableWithoutRounds(snapshot);
}

export function createRoundConsoleViewModel(value: unknown): RoundConsoleViewModel {
  const valid = isSafeSnapshot(value);
  const snapshot = valid ? value : null;
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
