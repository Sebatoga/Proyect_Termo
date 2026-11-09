import { createRoundSessionSnapshot } from "./createRoundSessionSnapshot";
import { PROVISIONAL_ROUND_MANIFEST } from "./provisionalRoundManifest.mjs";
import { createRoundHostIntegration } from "./roundHostIntegration.mjs";
import type { RoundSessionPort, RoundSessionSnapshot } from "./roundSessionPort";

export interface SimulatedAcceptedInput {
  readonly sourceMode: "Simulación local";
  readonly sequence: number;
  readonly calibrationLabel: string;
  readonly values: Readonly<{
    readonly lightProxy: number;
    readonly temperature: number;
    readonly hydroSetpoint: number;
    readonly batteryMode: string;
    readonly loadPriority: string;
    readonly confirm: boolean;
  }>;
}

export interface SimulatedTraceRow {
  readonly roundId: string;
  readonly eventKey: string;
  readonly inputSequence: number;
}

export interface SimulatedSessionObservation {
  readonly acceptedInput: SimulatedAcceptedInput | null;
  readonly trace: readonly SimulatedTraceRow[];
}

export interface SimulatedRoundSession extends RoundSessionPort {
  readonly loadInput: () => RoundSessionSnapshot;
  readonly confirm: () => RoundSessionSnapshot;
  readonly observe: () => SimulatedSessionObservation;
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
  const observe = (): SimulatedSessionObservation => {
    const state = integration.snapshot();
    const adapter = state.adapter;
    const values = adapter.values;
    const acceptedValues = typeof values.lightProxy === "number"
      && typeof values.temperature === "number"
      && typeof values.hydroSetpoint === "number"
      && typeof values.batteryMode === "string"
      && typeof values.loadPriority === "string"
      && typeof values.confirm === "boolean"
      ? Object.freeze({
          lightProxy: values.lightProxy,
          temperature: values.temperature,
          hydroSetpoint: values.hydroSetpoint,
          batteryMode: values.batteryMode,
          loadPriority: values.loadPriority,
          confirm: values.confirm,
        })
      : null;
    const acceptedInput = adapter.inputStatus === "valid"
      && adapter.acceptedSequence !== null
      && adapter.calibrationVersion !== null
      && acceptedValues !== null
      ? Object.freeze({
          sourceMode: "Simulación local" as const,
          sequence: adapter.acceptedSequence,
          calibrationLabel: adapter.calibrationVersion,
          values: acceptedValues,
        })
      : null;
    const trace = state.lifecycle.history.map((entry) => {
      const result = entry.result;
      const eventKey = result !== null && !Array.isArray(result)
        && typeof result === "object" && typeof result.eventKey === "string"
        ? result.eventKey
        : "unavailable";
      return Object.freeze({
        roundId: entry.roundId,
        eventKey,
        inputSequence: entry.input.sequence,
      });
    });
    return Object.freeze({ acceptedInput, trace: Object.freeze(trace) });
  };

  return Object.freeze({
    snapshot,
    observe,
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
