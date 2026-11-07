import { describe, expect, it } from "vitest";

import {
  createRoundLifecycle,
  type NormalizedHostSnapshot,
  type RoundLifecycleManifest,
} from "../src/application/round-session/roundLifecycle.mjs";

const manifest: RoundLifecycleManifest = {
  schemaVersion: "round-lifecycle-manifest/v1",
  rounds: Array.from({ length: 6 }, (_, index) => ({
    id: `round-${index + 1}`,
    event: { type: "synthetic", data: { key: `event-${index + 1}` } },
  })),
};

const snapshot: NormalizedHostSnapshot = {
  transport: "connected",
  inputStatus: "valid",
  acceptedSequence: 1,
  calibrationVersion: "cal-v1",
  values: {
    lightProxy: 0.5,
    temperature: 20,
    hydroSetpoint: 0.4,
    batteryMode: "idle",
    loadPriority: "balanced",
    confirm: true,
  },
  issue: null,
};

const createLifecycle = () => createRoundLifecycle({
  manifest,
  seed: "compatibility-seed",
  resolverVersion: "compatibility-v1",
  resolve: ({ round, input }) => ({ roundId: round.id, sequence: input.sequence }),
});

describe("round lifecycle application compatibility", () => {
  it("constructs deterministically through the adjacent declaration", () => {
    expect(createLifecycle().snapshot()).toEqual(createLifecycle().snapshot());
  });

  it("confirms one normalized input through the declared runtime API", () => {
    const response = createLifecycle().confirm(snapshot, "token-1");

    expect(response.ok).toBe(true);
    expect(response.reason).toBe("ROUND_RESOLVED");
    expect(response.state.roundIndex).toBe(1);
    expect(response.state.history[0]?.result).toEqual({ roundId: "round-1", sequence: 1 });
  });
});
