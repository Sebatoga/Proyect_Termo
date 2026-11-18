import type { RoundHostIntegrationState } from "./roundHostIntegration.mjs";
import {
  EXPECTED_ROUND_COUNT,
  type RoundSessionSnapshot,
} from "./roundSessionPort";

const safeReasonCode = (value: string | undefined): string => (
  value !== undefined && value.length > 0 && value.length <= 64 ? value : "INPUT_INVALID"
);

export function createRoundSessionSnapshot(
  state: RoundHostIntegrationState,
): RoundSessionSnapshot {
  const { adapter, lifecycle } = state;
  const lastCommittedSequence = lifecycle.history.at(-1)?.input.sequence;
  const hasFreshInput = adapter.acceptedSequence !== null
    && (lastCommittedSequence === undefined || adapter.acceptedSequence > lastCommittedSequence);
  let status: RoundSessionSnapshot["status"] = "waiting-input";
  let reasonCode = "INPUT_SNAPSHOT_UNAVAILABLE";
  let confirmationAllowed = false;

  if (state.status === "reset-required") {
    status = "reset-required";
    reasonCode = "SESSION_RESET_REQUIRED";
  } else if (lifecycle.status === "completed") {
    status = "completed";
    reasonCode = "LIFECYCLE_COMPLETED";
  } else if (adapter.transport !== "connected") {
    reasonCode = "DEVICE_DISCONNECTED";
  } else if (adapter.inputStatus !== "valid") {
    reasonCode = safeReasonCode(adapter.issue?.code);
  } else if (!hasFreshInput) {
    reasonCode = "NEW_INPUT_REQUIRED";
  } else if (adapter.values.confirm === true) {
    status = "ready";
    reasonCode = "SNAPSHOT_READY";
    confirmationAllowed = true;
  } else {
    reasonCode = "CONFIRMATION_REQUIRED";
  }

  return Object.freeze({
    status,
    roundIndex: lifecycle.roundIndex,
    roundCount: EXPECTED_ROUND_COUNT,
    currentRoundId: lifecycle.currentRoundId,
    reasonCode,
    confirmationAllowed,
  });
}
