import type { HostAdapterSnapshot } from "../../infrastructure/host-adapter/hostAdapter.mjs";
import type {
  RoundLifecycleOptions,
  RoundLifecycleState,
} from "./roundLifecycle.mjs";

export interface RoundHostIntegrationState {
  readonly schemaVersion: "round-host-integration-state/v1";
  readonly status: "active" | "reset-required";
  readonly adapter: HostAdapterSnapshot;
  readonly lifecycle: RoundLifecycleState;
}

export interface RoundHostIntegrationResponse {
  readonly ok: boolean;
  readonly reason: string;
  readonly state: RoundHostIntegrationState;
}

export interface RoundHostIntegration {
  readonly snapshot: () => RoundHostIntegrationState;
  readonly ingest: (line: unknown) => RoundHostIntegrationResponse;
  readonly confirm: (token: unknown) => RoundHostIntegrationResponse;
  readonly disconnect: () => RoundHostIntegrationResponse;
}

export function createRoundHostIntegration(
  lifecycleOptions: RoundLifecycleOptions,
): RoundHostIntegration;
