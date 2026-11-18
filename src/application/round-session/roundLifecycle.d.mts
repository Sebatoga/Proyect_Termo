export type RoundLifecycleStatus = "waiting-input" | "completed";

export interface SyntheticEventData {
  readonly key: string;
}

export interface SyntheticRoundEvent {
  readonly type: "synthetic";
  readonly data: SyntheticEventData;
}

export interface RoundManifestEntry {
  readonly id: string;
  readonly event: SyntheticRoundEvent;
}

export interface RoundLifecycleManifest {
  readonly schemaVersion: "round-lifecycle-manifest/v1";
  readonly rounds: readonly RoundManifestEntry[];
}

export interface NormalizedRoundControls {
  readonly lightProxy: number;
  readonly temperature: number;
  readonly hydroSetpoint: number;
  readonly batteryMode: string;
  readonly loadPriority: string;
  readonly confirm: boolean;
}

export interface NormalizedHostSnapshot {
  readonly transport: "connected" | "disconnected";
  readonly inputStatus: "valid" | "invalid" | "unavailable";
  readonly acceptedSequence: number | null;
  readonly calibrationVersion: string | null;
  readonly values: NormalizedRoundControls | null;
  readonly issue: unknown;
}

export interface AcceptedRoundInput {
  readonly sequence: number;
  readonly token: string;
  readonly calibrationVersion: string;
  readonly controls: NormalizedRoundControls;
}

export interface RoundResolverInput {
  readonly seed: string;
  readonly resolverVersion: string;
  readonly round: RoundManifestEntry;
  readonly input: AcceptedRoundInput;
}

export type CapturedPlainData =
  | null
  | string
  | number
  | boolean
  | readonly CapturedPlainData[]
  | Readonly<Record<string, CapturedPlainData>>;

export type RoundResolver = (input: RoundResolverInput) => unknown;

export interface RoundLifecycleOptions {
  readonly manifest: RoundLifecycleManifest;
  readonly seed: string;
  readonly resolverVersion: string;
  readonly resolve: RoundResolver;
}

export interface RoundHistoryEntry {
  readonly roundId: string;
  readonly input: AcceptedRoundInput;
  readonly result: CapturedPlainData;
}

export interface RoundLifecycleState {
  readonly schemaVersion: "round-lifecycle-state/v1";
  readonly manifestVersion: "round-lifecycle-manifest/v1";
  readonly seed: string;
  readonly resolverVersion: string;
  readonly roundIndex: number;
  readonly currentRoundId: string | null;
  readonly status: RoundLifecycleStatus;
  readonly history: readonly RoundHistoryEntry[];
}

export type RoundLifecycleReason =
  | "RESOLUTION_IN_PROGRESS"
  | "LIFECYCLE_COMPLETED"
  | "INPUT_DATA_INVALID"
  | "INPUT_DATA_LIMIT_EXCEEDED"
  | "INPUT_SHAPE_INVALID"
  | "INPUT_DISCONNECTED"
  | "INPUT_INVALID"
  | "INPUT_SEQUENCE_INVALID"
  | "CALIBRATION_VERSION_INVALID"
  | "CONTROL_SHAPE_INVALID"
  | "CONTROL_VALUE_INVALID"
  | "INPUT_TOKEN_INVALID"
  | "CONFIRMATION_REQUIRED"
  | "INPUT_REPLAYED"
  | "INPUT_SEQUENCE_NOT_INCREASING"
  | "RESOLVER_FAILED"
  | "RESOLVER_RESULT_INVALID"
  | "RESOLVER_RESULT_LIMIT_EXCEEDED"
  | "ROUND_RESOLVED";

export interface RoundLifecycleResponse {
  readonly ok: boolean;
  readonly reason: RoundLifecycleReason;
  readonly state: RoundLifecycleState;
}

export interface RoundLifecycle {
  readonly snapshot: () => RoundLifecycleState;
  readonly confirm: (snapshot: unknown, token: unknown) => RoundLifecycleResponse;
}

export class LifecycleValidationError extends Error {
  readonly code: string;
  constructor(code: string, message: string);
}

export function createRoundLifecycle(options: RoundLifecycleOptions): RoundLifecycle;
