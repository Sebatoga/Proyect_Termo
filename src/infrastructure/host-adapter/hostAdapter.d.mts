import type {
  BatteryMode,
  LoadPriority,
} from "../device-protocol/protocol.mjs";

export interface HostInputValues {
  readonly lightProxy: number | null;
  readonly temperature: number | null;
  readonly hydroSetpoint: number | null;
  readonly batteryMode: BatteryMode | null;
  readonly loadPriority: LoadPriority | null;
  readonly confirm: boolean | null;
}

export interface HostAdapterIssue {
  readonly code: string;
  readonly detail: string | undefined;
}

export interface HostAdapterSnapshot {
  readonly transport: "connected" | "disconnected";
  readonly inputStatus: "valid" | "invalid" | "disconnected";
  readonly acceptedSequence: number | null;
  readonly calibrationVersion: string | null;
  readonly values: HostInputValues;
  readonly issue: HostAdapterIssue | null;
}

export interface HostAdapter {
  readonly ingest: (line: string) => HostAdapterSnapshot;
  readonly disconnect: () => void;
  readonly snapshot: () => HostAdapterSnapshot;
}

export function createHostAdapter(): HostAdapter;
