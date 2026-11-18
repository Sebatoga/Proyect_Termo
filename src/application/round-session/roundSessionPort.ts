export type RoundSessionStatus =
  | "unavailable"
  | "waiting-input"
  | "ready"
  | "reset-required"
  | "completed";

export const EXPECTED_ROUND_COUNT = 6;

export interface RoundSessionSnapshot {
  readonly status: RoundSessionStatus;
  readonly roundIndex: number;
  readonly roundCount: number;
  readonly currentRoundId: string | null;
  readonly reasonCode: string;
  readonly confirmationAllowed: boolean;
}

export interface RoundSessionPort {
  readonly snapshot: () => RoundSessionSnapshot;
}
