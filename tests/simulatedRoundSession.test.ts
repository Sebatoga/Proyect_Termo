import { describe, expect, it } from "vitest";

import { createSimulatedRoundSession } from "../src/application/round-session/createSimulatedRoundSession";
import { PROVISIONAL_EVENT_KEYS } from "../src/application/round-session/provisionalRoundManifest.mjs";

describe("local simulated round session", () => {
  it("requires separate deterministic load and confirmation actions", () => {
    const session = createSimulatedRoundSession();

    expect(session.observe()).toEqual({ acceptedInput: null, trace: [] });
    expect(session.snapshot()).toMatchObject({
      status: "waiting-input",
      roundIndex: 0,
      reasonCode: "DEVICE_DISCONNECTED",
      confirmationAllowed: false,
    });
    expect(session.confirm()).toEqual(session.snapshot());

    expect(session.loadInput()).toMatchObject({
      status: "ready",
      roundIndex: 0,
      reasonCode: "SNAPSHOT_READY",
      confirmationAllowed: true,
    });
    expect(session.observe()).toEqual({
      acceptedInput: {
        sourceMode: "Simulación local",
        sequence: 0,
        calibrationLabel: "simulated-not-calibrated-v1",
        values: {
          lightProxy: 0.5,
          temperature: 20,
          hydroSetpoint: 0.4,
          batteryMode: "idle",
          loadPriority: "balanced",
          confirm: true,
        },
      },
      trace: [],
    });
    expect(session.loadInput()).toEqual(session.snapshot());

    expect(session.confirm()).toMatchObject({
      status: "waiting-input",
      roundIndex: 1,
      currentRoundId: "round-2",
      reasonCode: "NEW_INPUT_REQUIRED",
      confirmationAllowed: false,
    });
    expect(session.observe().trace).toEqual([
      { roundId: "round-1", eventKey: "base-demand", inputSequence: 0 },
    ]);
    session.confirm();
    expect(session.observe().trace).toHaveLength(1);
  });

  it("completes exactly six simulated rounds without ambient entropy", () => {
    const run = () => {
      const session = createSimulatedRoundSession();
      const snapshots = [];
      for (let round = 0; round < 6; round += 1) {
        snapshots.push(session.loadInput());
        snapshots.push(session.confirm());
      }
      return { snapshots, observation: session.observe() };
    };

    const first = run();
    expect(first).toEqual(run());
    expect(first.snapshots.at(-1)).toEqual({
      status: "completed",
      roundIndex: 6,
      roundCount: 6,
      currentRoundId: null,
      reasonCode: "LIFECYCLE_COMPLETED",
      confirmationAllowed: false,
    });
    expect(first.observation.trace).toEqual(PROVISIONAL_EVENT_KEYS.map((eventKey, index) => ({
      roundId: `round-${index + 1}`,
      eventKey,
      inputSequence: index,
    })));
    expect(Object.isFrozen(first.observation)).toBe(true);
    expect(Object.isFrozen(first.observation.trace)).toBe(true);
    expect(first.observation.trace.every(Object.isFrozen)).toBe(true);
    expect(Object.isFrozen(first.observation.acceptedInput)).toBe(true);
    expect(Object.isFrozen(first.observation.acceptedInput?.values)).toBe(true);
  });
});
