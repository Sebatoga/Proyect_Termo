import { createRoundSessionSnapshot } from "./createRoundSessionSnapshot";
import { PROVISIONAL_ROUND_MANIFEST } from "./provisionalRoundManifest.mjs";
import { createRoundHostIntegration } from "./roundHostIntegration.mjs";
import type { RoundSessionPort, RoundSessionSnapshot } from "./roundSessionPort";

export interface SimulatedRoundSession extends RoundSessionPort {
  readonly loadInput: () => RoundSessionSnapshot;
  readonly confirm: () => RoundSessionSnapshot;
}

const simulatedInputLine = (sequence: number): string => JSON.stringify({
  type: "inputs",
  protocolVersion: 1,
  sequence,
  uptimeMs: sequence * 100,
  calibrationVersion: "simulated-not-calibrated-v1",
  status: "valid",
  values: {
    lightProxy: { value: 0.5, status: "valid" },
    temperature: { value: 20, status: "valid" },
    hydroSetpoint: { value: 0.4, status: "valid" },
    batteryMode: { value: "idle", status: "valid" },
    loadPriority: { value: "balanced", status: "valid" },
    confirm: { value: true, status: "valid" },
  },
});

export function createSimulatedRoundSession(): SimulatedRoundSession {
  const integration = createRoundHostIntegration({
    manifest: PROVISIONAL_ROUND_MANIFEST,
    seed: "local-simulated-session-v1",
    resolverVersion: "trace-only-simulated-v1",
    resolve: ({ round, input }) => Object.freeze({
      mode: "simulated",
      eventKey: round.event.data.key,
      inputSequence: input.sequence,
    }),
  });
  let nextSequence = 0;

  const snapshot = (): RoundSessionSnapshot => createRoundSessionSnapshot(integration.snapshot());

  return Object.freeze({
    snapshot,
    loadInput() {
      const current = snapshot();
      if (current.status !== "waiting-input") return current;
      integration.ingest(simulatedInputLine(nextSequence));
      nextSequence += 1;
      return snapshot();
    },
    confirm() {
      const current = snapshot();
      if (!current.confirmationAllowed) return current;
      integration.confirm(`simulated-token-${nextSequence - 1}`);
      return snapshot();
    },
  });
}
