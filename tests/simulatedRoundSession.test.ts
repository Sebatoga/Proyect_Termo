import { describe, expect, it } from "vitest";

import { createSimulatedRoundSession } from "../src/application/round-session/createSimulatedRoundSession";

describe("local simulated round session", () => {
  it("requires separate deterministic load and confirmation actions", () => {
    const session = createSimulatedRoundSession();

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
    expect(session.loadInput()).toEqual(session.snapshot());

    expect(session.confirm()).toMatchObject({
      status: "waiting-input",
      roundIndex: 1,
      currentRoundId: "round-2",
      reasonCode: "NEW_INPUT_REQUIRED",
      confirmationAllowed: false,
    });
  });

  it("completes exactly six simulated rounds without ambient entropy", () => {
    const run = () => {
      const session = createSimulatedRoundSession();
      const snapshots = [];
      for (let round = 0; round < 6; round += 1) {
        snapshots.push(session.loadInput());
        snapshots.push(session.confirm());
      }
      return snapshots;
    };

    const first = run();
    expect(first).toEqual(run());
    expect(first.at(-1)).toEqual({
      status: "completed",
      roundIndex: 6,
      roundCount: 6,
      currentRoundId: null,
      reasonCode: "LIFECYCLE_COMPLETED",
      confirmationAllowed: false,
    });
  });
});
