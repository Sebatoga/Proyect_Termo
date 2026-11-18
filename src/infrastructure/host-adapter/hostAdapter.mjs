import {
  INPUT_FIELDS,
  parseLine,
  validateSequence,
} from "../device-protocol/protocol.mjs";

const LOCAL_ISSUES = Object.freeze({
  DIRECTION_INVALID: "Host output is not valid in the device-to-host direction.",
  DISCONNECTED: "The device transport is disconnected.",
  INPUTS_INVALID: "The input message does not contain six valid current values.",
});

const emptyValues = () => Object.fromEntries(INPUT_FIELDS.map((field) => [field, null]));

export function createHostAdapter() {
  let state;

  const clear = (transport, inputStatus, issue, acceptedSequence = state.acceptedSequence,
    calibrationVersion = state.calibrationVersion) => {
    state = { transport, inputStatus, acceptedSequence, calibrationVersion, values: emptyValues(), issue };
  };

  const disconnect = () => {
    state = {
      transport: "disconnected", inputStatus: "disconnected", acceptedSequence: null,
      calibrationVersion: null, values: emptyValues(),
      issue: { code: "DISCONNECTED", detail: LOCAL_ISSUES.DISCONNECTED },
    };
  };

  disconnect();
  const snapshot = () => structuredClone(state);

  return Object.freeze({
    ingest(line) {
      const parsed = parseLine(line);
      if (!parsed.ok) {
        clear("connected", "invalid", {
          code: parsed.error.code, detail: parsed.error.detail,
        });
        return snapshot();
      }

      const message = parsed.message;
      const sequenceIssue = validateSequence(state.acceptedSequence, message.sequence);
      if (sequenceIssue) {
        clear("connected", "invalid", { code: sequenceIssue, detail: "Sequence must increase by exactly one." });
        return snapshot();
      }
      if (message.type === "output") {
        clear("connected", "invalid", {
          code: "DIRECTION_INVALID", detail: LOCAL_ISSUES.DIRECTION_INVALID,
        });
        return snapshot();
      }

      const accepted = [message.sequence, message.calibrationVersion];
      if (message.type === "error") {
        clear("connected", "invalid", { code: message.code, detail: message.detail }, ...accepted);
      } else if (message.status === "disconnected"
        || (message.type === "inputs"
          && INPUT_FIELDS.some((field) => message.values[field].status === "disconnected"))) {
        clear("disconnected", "disconnected", {
          code: "DISCONNECTED", detail: LOCAL_ISSUES.DISCONNECTED,
        }, ...accepted);
      } else if (message.type === "hello" && message.status === "valid") {
        clear("connected", "invalid", null, ...accepted);
      } else if (message.type === "inputs" && message.status === "valid"
        && INPUT_FIELDS.every((field) => message.values[field].status === "valid")) {
        state = {
          transport: "connected", inputStatus: "valid", acceptedSequence: message.sequence,
          calibrationVersion: message.calibrationVersion,
          values: Object.fromEntries(INPUT_FIELDS.map((field) => [field, message.values[field].value])),
          issue: null,
        };
      } else {
        clear("connected", "invalid", {
          code: "INPUTS_INVALID", detail: LOCAL_ISSUES.INPUTS_INVALID,
        }, ...accepted);
      }
      return snapshot();
    },
    disconnect,
    snapshot,
  });
}
