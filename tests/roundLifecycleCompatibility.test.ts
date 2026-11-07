import { describe, expect, it } from "vitest";

import {
  createRoundLifecycle,
  type NormalizedHostSnapshot,
} from "../src/application/round-session/roundLifecycle.mjs";
import {
  PROVISIONAL_EVENT_KEYS,
  PROVISIONAL_ROUND_MANIFEST,
} from "../src/application/round-session/provisionalRoundManifest.mjs";

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
  manifest: PROVISIONAL_ROUND_MANIFEST,
  seed: "compatibility-seed",
  resolverVersion: "compatibility-v1",
  resolve: ({ round, input }) => ({ roundId: round.id, sequence: input.sequence }),
});

describe("round lifecycle application compatibility", () => {
  it("owns the exact deeply immutable provisional round order", () => {
    expect(PROVISIONAL_EVENT_KEYS).toEqual([
      "base-demand",
      "high-temperature",
      "low-river",
      "demand-peak",
      "reduced-light",
      "seeded-combination",
    ]);
    expect(Object.isFrozen(PROVISIONAL_EVENT_KEYS)).toBe(true);
    expect(Object.isFrozen(PROVISIONAL_ROUND_MANIFEST)).toBe(true);
    expect(Object.isFrozen(PROVISIONAL_ROUND_MANIFEST.rounds)).toBe(true);
    expect(PROVISIONAL_ROUND_MANIFEST.rounds.every((round) => (
      Object.isFrozen(round) && Object.isFrozen(round.event) && Object.isFrozen(round.event.data)
    ))).toBe(true);
  });

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
