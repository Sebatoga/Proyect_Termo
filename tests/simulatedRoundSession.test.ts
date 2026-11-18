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

  it("rejects an initial malformed diagnostic without consuming sequence zero", () => {
    const session = createSimulatedRoundSession();

    expect(session.runMalformedInputDiagnostic()).toMatchObject({
      status: "waiting-input",
      roundIndex: 0,
      reasonCode: "MALFORMED_JSON",
      confirmationAllowed: false,
    });
    expect(session.observe()).toEqual({ acceptedInput: null, trace: [] });
    expect(session.loadInput()).toMatchObject({ status: "ready", roundIndex: 0 });
    expect(session.observe().acceptedInput?.sequence).toBe(0);
  });

  it("preserves a confirmed round and the next sequence across malformed recovery", () => {
    const session = createSimulatedRoundSession();
    session.loadInput();
    session.confirm();
    const trace = session.observe().trace;

    expect(session.runMalformedInputDiagnostic()).toMatchObject({
      status: "waiting-input",
      roundIndex: 1,
      reasonCode: "MALFORMED_JSON",
      confirmationAllowed: false,
    });
    expect(session.observe()).toEqual({ acceptedInput: null, trace });
    expect(session.loadInput()).toMatchObject({ status: "ready", roundIndex: 1 });
    expect(session.observe().acceptedInput?.sequence).toBe(1);
    expect(session.snapshot().roundIndex).toBe(1);
    expect(session.confirm()).toMatchObject({ status: "waiting-input", roundIndex: 2 });
    expect(session.observe().trace).toHaveLength(2);
  });

  it("ignores malformed diagnostics while ready or completed", () => {
    const session = createSimulatedRoundSession();
    session.loadInput();
    const readySnapshot = session.snapshot();
    const readyObservation = session.observe();

    expect(session.runMalformedInputDiagnostic()).toEqual(readySnapshot);
    expect(session.observe()).toEqual(readyObservation);
    session.confirm();
    for (let round = 1; round < 6; round += 1) {
      session.loadInput();
      session.confirm();
    }
    const completedSnapshot = session.snapshot();
    const completedObservation = session.observe();

    expect(session.runMalformedInputDiagnostic()).toEqual(completedSnapshot);
    expect(session.observe()).toEqual(completedObservation);
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

  it("rejects reset before completion without changing snapshots or observations", () => {
    const session = createSimulatedRoundSession();
    const assertPreservedReset = () => {
      const snapshot = session.snapshot();
      const observation = session.observe();

      expect(session.reset()).toEqual(snapshot);
      expect(session.snapshot()).toEqual(snapshot);
      expect(session.observe()).toEqual(observation);
    };

    assertPreservedReset();
    session.loadInput();
    assertPreservedReset();
    session.confirm();
    assertPreservedReset();
    session.loadInput();
    assertPreservedReset();
  });

  it("resets only a completed session and replays the same six rounds", () => {
    const session = createSimulatedRoundSession();
    const run = () => {
      const snapshots = [];
      for (let round = 0; round < 6; round += 1) {
        snapshots.push(session.loadInput());
        snapshots.push(session.confirm());
      }
      return { snapshots, observation: session.observe() };
    };

    const first = run();
    const resetSnapshot = session.reset();

    expect(resetSnapshot).toEqual({
      status: "waiting-input",
      roundIndex: 0,
      roundCount: 6,
      currentRoundId: "round-1",
      reasonCode: "DEVICE_DISCONNECTED",
      confirmationAllowed: false,
    });
    expect(session.observe()).toEqual({ acceptedInput: null, trace: [] });
    expect(Object.isFrozen(resetSnapshot)).toBe(true);
    expect(Object.isFrozen(session.observe())).toBe(true);
    expect(Object.isFrozen(session.observe().trace)).toBe(true);

    expect(run()).toEqual(first);
  });
});
