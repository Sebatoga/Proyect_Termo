import { describe, expect, it } from "vitest";

import { createRoundSessionSnapshot } from "../src/application/round-session/createRoundSessionSnapshot";
import { createRoundHostIntegration } from "../src/application/round-session/roundHostIntegration.mjs";
import type { RoundLifecycleManifest } from "../src/application/round-session/roundLifecycle.mjs";
import { createRoundConsoleViewModel } from "../src/console/createRoundConsoleViewModel";

const manifest: RoundLifecycleManifest = {
  schemaVersion: "round-lifecycle-manifest/v1",
  rounds: Array.from({ length: 6 }, (_, index) => ({
    id: `round-${index + 1}`,
    event: { type: "synthetic", data: { key: `event-${index + 1}` } },
  })),
};

const createIntegration = () => createRoundHostIntegration({
  manifest,
  seed: "session-integration-seed",
  resolverVersion: "session-integration-v1",
  resolve: ({ round }) => ({ roundId: round.id }),
});

const inputLine = (sequence: number, confirm: boolean) => JSON.stringify({
  type: "inputs",
  protocolVersion: 1,
  sequence,
  uptimeMs: sequence * 100,
  calibrationVersion: "cal-v1",
  status: "valid",
  values: {
    lightProxy: { value: 0.5, status: "valid" },
    temperature: { value: 20, status: "valid" },
    hydroSetpoint: { value: 0.4, status: "valid" },
    batteryMode: { value: "idle", status: "valid" },
    loadPriority: { value: "balanced", status: "valid" },
    confirm: { value: confirm, status: "valid" },
  },
});

describe("round session application integration", () => {
  it("maps unavailable input, readiness, and advancement without UI dependencies", () => {
    const integration = createIntegration();
    const initial = createRoundSessionSnapshot(integration.snapshot());

    expect(initial).toMatchObject({
      status: "waiting-input",
      roundIndex: 0,
      roundCount: 6,
      currentRoundId: "round-1",
      reasonCode: "DEVICE_DISCONNECTED",
      confirmationAllowed: false,
    });

    integration.ingest(inputLine(0, false));
    expect(createRoundSessionSnapshot(integration.snapshot())).toMatchObject({
      status: "waiting-input",
      reasonCode: "CONFIRMATION_REQUIRED",
      confirmationAllowed: false,
    });

    integration.ingest(inputLine(1, true));
    const ready = createRoundSessionSnapshot(integration.snapshot());
    expect(ready.status).toBe("ready");
    expect(ready.confirmationAllowed).toBe(true);
    expect(createRoundConsoleViewModel(ready).status.reasonCode).toBe("SNAPSHOT_READY");

    integration.confirm("token-1");
    expect(createRoundSessionSnapshot(integration.snapshot())).toMatchObject({
      status: "waiting-input",
      roundIndex: 1,
      currentRoundId: "round-2",
      reasonCode: "NEW_INPUT_REQUIRED",
      confirmationAllowed: false,
    });
  });

  it("maps disconnect to a reset-required snapshot", () => {
    const integration = createIntegration();
    integration.disconnect();

    expect(createRoundSessionSnapshot(integration.snapshot())).toMatchObject({
      status: "reset-required",
      reasonCode: "SESSION_RESET_REQUIRED",
      confirmationAllowed: false,
    });
  });

  it("maps six confirmed rounds to the terminal product snapshot", () => {
    const integration = createIntegration();
    for (let sequence = 0; sequence < 6; sequence += 1) {
      integration.ingest(inputLine(sequence, true));
      expect(integration.confirm(`token-${sequence}`).ok).toBe(true);
    }

    const completed = createRoundSessionSnapshot(integration.snapshot());
    expect(completed).toEqual({
      status: "completed",
      roundIndex: 6,
      roundCount: 6,
      currentRoundId: null,
      reasonCode: "LIFECYCLE_COMPLETED",
      confirmationAllowed: false,
    });
    expect(Object.isFrozen(completed)).toBe(true);
  });
});
