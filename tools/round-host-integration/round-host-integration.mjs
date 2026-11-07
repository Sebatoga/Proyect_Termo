import { createHostAdapter } from "../host-adapter/adapter.mjs";
import { createRoundLifecycle } from "../../src/application/round-session/roundLifecycle.mjs";

const freezeTree = (value) => {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeTree(child);
    Object.freeze(value);
  }
  return value;
};

export function createRoundHostIntegration(lifecycleOptions) {
  const adapter = createHostAdapter();
  const lifecycle = createRoundLifecycle(lifecycleOptions);
  let resetRequired = false;
  let mutating = false;

  const state = () => Object.freeze({
    schemaVersion: "round-host-integration-state/v1",
    status: resetRequired ? "reset-required" : "active",
    adapter: freezeTree(adapter.snapshot()),
    lifecycle: lifecycle.snapshot(),
  });
  const response = (ok, reason) => Object.freeze({ ok, reason, state: state() });
  const mutate = (operation) => {
    if (mutating) return response(false, "INTEGRATION_BUSY");
    mutating = true;
    try {
      return operation();
    } finally {
      mutating = false;
    }
  };

  return Object.freeze({
    snapshot: state,
    ingest(line) {
      return mutate(() => {
        if (resetRequired) return response(false, "SESSION_RESET_REQUIRED");
        if (typeof line !== "string") return response(false, "INPUT_LINE_INVALID");
        const snapshot = adapter.ingest(line);
        if (snapshot.transport === "disconnected") resetRequired = true;
        if (resetRequired) return response(false, "SESSION_RESET_REQUIRED");
        if (snapshot.issue !== null) return response(false, snapshot.issue.code);
        return response(snapshot.inputStatus === "valid",
          snapshot.inputStatus === "valid" ? "SNAPSHOT_AVAILABLE" : "SNAPSHOT_UNAVAILABLE");
      });
    },
    confirm(token) {
      return mutate(() => {
        if (resetRequired) return response(false, "SESSION_RESET_REQUIRED");
        const result = lifecycle.confirm(adapter.snapshot(), token);
        return response(result.ok, result.reason);
      });
    },
    disconnect() {
      return mutate(() => {
        if (resetRequired) return response(false, "SESSION_RESET_REQUIRED");
        adapter.disconnect();
        resetRequired = true;
        return response(false, "SESSION_RESET_REQUIRED");
      });
    },
  });
}
