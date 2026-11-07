import { describe, expect, it } from "vitest";

import {
  createHostAdapter,
  type HostAdapterSnapshot,
} from "../src/infrastructure/host-adapter/hostAdapter.mjs";

describe("host adapter infrastructure compatibility", () => {
  it("starts disconnected without current values", () => {
    const snapshot: HostAdapterSnapshot = createHostAdapter().snapshot();

    expect(snapshot.transport).toBe("disconnected");
    expect(snapshot.inputStatus).toBe("disconnected");
    expect(snapshot.acceptedSequence).toBeNull();
    expect(Object.values(snapshot.values)).toEqual(Array(6).fill(null));
    expect(snapshot.issue?.code).toBe("DISCONNECTED");
  });

  it("fails closed and returns detached snapshots", () => {
    const adapter = createHostAdapter();
    const first = adapter.ingest("{");
    const second = adapter.snapshot();

    expect(first.inputStatus).toBe("invalid");
    expect(first.issue?.code).toBe("MALFORMED_JSON");
    expect(Object.values(first.values)).toEqual(Array(6).fill(null));
    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(first.values).not.toBe(second.values);
  });
});
