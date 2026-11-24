import { describe, expect, it, vi } from "vitest";

import { createRoundSessionSnapshot } from "../src/application/round-session/createRoundSessionSnapshot";
import {
  PROVISIONAL_ROUND_MANIFEST,
} from "../src/application/round-session/provisionalRoundManifest.mjs";
import { createRoundHostIntegration } from "../src/application/round-session/roundHostIntegration.mjs";
import type { RoundResolverInput } from "../src/application/round-session/roundLifecycle.mjs";
import { createRoundConsoleViewModel } from "../src/console/createRoundConsoleViewModel";

const createIntegration = () => createRoundHostIntegration({
  manifest: PROVISIONAL_ROUND_MANIFEST,
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

  it("keeps the closed immutable snapshot shape across every session status", () => {
    const integration = createIntegration();
    const snapshots = [
      createRoundSessionSnapshot(integration.snapshot()),
    ];

    integration.ingest(inputLine(0, false));
    snapshots.push(createRoundSessionSnapshot(integration.snapshot()));

    integration.ingest(inputLine(1, true));
    snapshots.push(createRoundSessionSnapshot(integration.snapshot()));
    integration.confirm("snapshot-boundary-token");
    snapshots.push(createRoundSessionSnapshot(integration.snapshot()));

    integration.disconnect();
    snapshots.push(createRoundSessionSnapshot(integration.snapshot()));

    const completedIntegration = createIntegration();
    for (let sequence = 0; sequence < 6; sequence += 1) {
      completedIntegration.ingest(inputLine(sequence, true));
      expect(completedIntegration.confirm(`snapshot-boundary-${sequence}`).ok).toBe(true);
    }
    snapshots.push(createRoundSessionSnapshot(completedIntegration.snapshot()));

    expect(snapshots.map(({ status, reasonCode }) => [status, reasonCode])).toEqual([
      ["waiting-input", "DEVICE_DISCONNECTED"],
      ["waiting-input", "CONFIRMATION_REQUIRED"],
      ["ready", "SNAPSHOT_READY"],
      ["waiting-input", "NEW_INPUT_REQUIRED"],
      ["reset-required", "SESSION_RESET_REQUIRED"],
      ["completed", "LIFECYCLE_COMPLETED"],
    ]);

    for (const snapshot of snapshots) {
      expect(Object.keys(snapshot)).toEqual([
        "status",
        "roundIndex",
        "roundCount",
        "currentRoundId",
        "reasonCode",
        "confirmationAllowed",
      ]);
      expect(Object.isFrozen(snapshot)).toBe(true);
      expect(Reflect.set(snapshot, "status", "tampered")).toBe(false);
    }
  });

  it("fails closed when a uint32 protocol sequence wraps to zero", () => {
    const resolve = vi.fn(({ round }) => ({ roundId: round.id }));
    const integration = createRoundHostIntegration({
      manifest: PROVISIONAL_ROUND_MANIFEST,
      seed: "sequence-wrap-seed",
      resolverVersion: "sequence-wrap-v1",
      resolve,
    });
    const maximumSequence = 0xffff_ffff;

    expect(integration.ingest(inputLine(maximumSequence, true)).ok).toBe(true);
    expect(integration.confirm("maximum-sequence-token").ok).toBe(true);
    expect(resolve).toHaveBeenCalledTimes(1);

    const wrapped = integration.ingest(inputLine(0, true));

    expect(wrapped).toMatchObject({ ok: false, reason: "SEQUENCE_INVALID" });
    expect(wrapped.state.lifecycle.roundIndex).toBe(1);
    expect(wrapped.state.lifecycle.history).toHaveLength(1);
    expect(wrapped.state.adapter.acceptedSequence).toBe(maximumSequence);
    expect(Object.values(wrapped.state.adapter.values)).toEqual(Array(6).fill(null));
    expect(createRoundSessionSnapshot(wrapped.state)).toMatchObject({
      status: "waiting-input",
      roundIndex: 1,
      currentRoundId: "round-2",
      reasonCode: "SEQUENCE_INVALID",
      confirmationAllowed: false,
    });
    expect(resolve).toHaveBeenCalledTimes(1);
  });

  it("forwards one immutable normalized envelope only after explicit confirmation", () => {
    const resolve = vi.fn((resolverInput: RoundResolverInput) => ({
      roundId: resolverInput.round.id,
      sequence: resolverInput.input.sequence,
    }));
    const integration = createRoundHostIntegration({
      manifest: PROVISIONAL_ROUND_MANIFEST,
      seed: "resolver-handoff-seed",
      resolverVersion: "resolver-handoff-v1",
      resolve,
    });

    integration.ingest(inputLine(0, true));
    expect(resolve).not.toHaveBeenCalled();

    const confirmed = integration.confirm("handoff-token");

    expect(confirmed.ok).toBe(true);
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve).toHaveBeenCalledWith(expect.objectContaining({
      seed: "resolver-handoff-seed",
      resolverVersion: "resolver-handoff-v1",
      round: expect.objectContaining({
        id: "round-1",
        event: expect.objectContaining({
          type: "synthetic",
          data: { key: "base-demand" },
        }),
      }),
      input: {
        sequence: 0,
        token: "handoff-token",
        calibrationVersion: "cal-v1",
        controls: {
          lightProxy: 0.5,
          temperature: 20,
          hydroSetpoint: 0.4,
          batteryMode: "idle",
          loadPriority: "balanced",
          confirm: true,
        },
      },
    }));

    const resolverInput = resolve.mock.calls[0]?.[0];
    expect(Object.isFrozen(resolverInput)).toBe(true);
    expect(Object.isFrozen(resolverInput?.round)).toBe(true);
    expect(Object.isFrozen(resolverInput?.round.event)).toBe(true);
    expect(Object.isFrozen(resolverInput?.round.event.data)).toBe(true);
    expect(Object.isFrozen(resolverInput?.input)).toBe(true);
    expect(Object.isFrozen(resolverInput?.input.controls)).toBe(true);

    const replay = integration.confirm("handoff-token");
    expect(replay).toMatchObject({ ok: false, reason: "INPUT_REPLAYED" });
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(replay.state.lifecycle.history).toHaveLength(1);

    const duplicateSequence = integration.confirm("new-token-same-sequence");
    expect(duplicateSequence).toMatchObject({ ok: false, reason: "INPUT_REPLAYED" });
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(duplicateSequence.state.lifecycle.history).toHaveLength(1);
  });

  it("keeps committed controls and identifiers behind the session snapshot port", () => {
    const integration = createIntegration();
    integration.ingest(inputLine(0, true));
    integration.confirm("private-round-token");

    const internal = integration.snapshot();
    expect(internal.lifecycle.history[0]?.input).toMatchObject({
      token: "private-round-token",
      calibrationVersion: "cal-v1",
      controls: {
        lightProxy: 0.5,
        temperature: 20,
        hydroSetpoint: 0.4,
        batteryMode: "idle",
        loadPriority: "balanced",
        confirm: true,
      },
    });

    const session = createRoundSessionSnapshot(internal);
    const viewModel = createRoundConsoleViewModel(session);

    expect(Object.keys(session)).toEqual([
      "status",
      "roundIndex",
      "roundCount",
      "currentRoundId",
      "reasonCode",
      "confirmationAllowed",
    ]);
    expect(Object.keys(viewModel)).toEqual([
      "status",
      "progress",
      "scenario",
      "confirmation",
      "notice",
    ]);
    for (const serialized of [JSON.stringify(session), JSON.stringify(viewModel)]) {
      expect(serialized).not.toContain("private-round-token");
      expect(serialized).not.toContain("calibrationVersion");
      expect(serialized).not.toContain("lightProxy");
      expect(serialized).not.toContain("hydroSetpoint");
      expect(serialized).not.toContain("batteryMode");
      expect(serialized).not.toContain("loadPriority");
    }
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
