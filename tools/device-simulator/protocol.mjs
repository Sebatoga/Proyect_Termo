export const PROTOCOL_VERSION = 1;
export const STATUSES = Object.freeze(["valid", "invalid", "disconnected"]);
// Transport-only placeholders; they are not final gameplay or control rules.
export const BATTERY_MODES = Object.freeze(["idle", "charge", "discharge"]);
export const LOAD_PRIORITIES = Object.freeze(["critical", "balanced", "comfort"]);

const TYPES = ["hello", "inputs", "output", "error"];
export const INPUT_FIELDS = Object.freeze([
  "lightProxy", "temperature", "hydroSetpoint", "batteryMode", "loadPriority", "confirm",
]);
const DETAILS = Object.freeze({
  MALFORMED_JSON: "Line is not valid JSON.",
  UNSUPPORTED_VERSION: "Only protocolVersion 1 is supported.",
  SCHEMA_INVALID: "Message does not match the JSON Lines v1 schema.",
  SEQUENCE_INVALID: "Sequence must increase by exactly one.",
  TYPE_UNSUPPORTED: "Message type is not supported.",
});

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isStatus = (value) => STATUSES.includes(value);

export function errorMessage(code, sequence = 0) {
  return {
    type: "error", protocolVersion: PROTOCOL_VERSION, sequence, uptimeMs: 0,
    calibrationVersion: "pending", status: "invalid", code, detail: DETAILS[code],
  };
}

function schemaCode(message) {
  if (!isRecord(message)) return "SCHEMA_INVALID";
  if (!("protocolVersion" in message)) return "SCHEMA_INVALID";
  if (message.protocolVersion !== PROTOCOL_VERSION) return "UNSUPPORTED_VERSION";
  if (typeof message.type !== "string") return "SCHEMA_INVALID";
  if (!TYPES.includes(message.type)) return "TYPE_UNSUPPORTED";
  if (!Number.isInteger(message.sequence) || message.sequence < 0
    || !Number.isInteger(message.uptimeMs) || message.uptimeMs < 0
    || typeof message.calibrationVersion !== "string" || message.calibrationVersion.length === 0
    || !isStatus(message.status)) return "SCHEMA_INVALID";

  if (message.type === "hello") {
    return Array.isArray(message.capabilities) && message.capabilities.every((item) => typeof item === "string")
      ? null : "SCHEMA_INVALID";
  }
  if (message.type === "output") return isRecord(message.leds) ? null : "SCHEMA_INVALID";
  if (message.type === "error") {
    return typeof message.code === "string" && typeof message.detail === "string"
      ? null : "SCHEMA_INVALID";
  }
  if (!isRecord(message.values)) return "SCHEMA_INVALID";
  for (const field of INPUT_FIELDS) {
    const input = message.values[field];
    if (!isRecord(input) || !isStatus(input.status)) return "SCHEMA_INVALID";
    if (input.status !== "valid" && input.value !== null) return "SCHEMA_INVALID";
    if (input.status === "valid" && !validInputValue(field, input.value)) return "SCHEMA_INVALID";
  }
  return null;
}

function validInputValue(field, value) {
  if (["lightProxy", "temperature", "hydroSetpoint"].includes(field)) {
    return typeof value === "number" && Number.isFinite(value);
  }
  if (field === "batteryMode") return BATTERY_MODES.includes(value);
  if (field === "loadPriority") return LOAD_PRIORITIES.includes(value);
  return typeof value === "boolean";
}

export function parseLine(line) {
  let message;
  try { message = JSON.parse(line); } catch { return { ok: false, error: errorMessage("MALFORMED_JSON") }; }
  const code = schemaCode(message);
  return code
    ? { ok: false, error: errorMessage(code, Number.isInteger(message?.sequence) ? message.sequence : 0) }
    : { ok: true, message };
}

export function validateSequence(previous, current) {
  return previous === null || current === previous + 1 ? null : "SEQUENCE_INVALID";
}

const base = (type, sequence, uptimeMs, status = "valid") => ({
  type, protocolVersion: 1, sequence, uptimeMs, calibrationVersion: "sim-v1", status,
});

export const DEVICE_SCENARIOS = Object.freeze({
  nominal: [
    { ...base("hello", 0, 0), capabilities: ["inputs", "output"] },
    { ...base("inputs", 1, 100), values: {
      lightProxy: { value: 0.72, status: "valid" }, temperature: { value: 24.5, status: "valid" },
      hydroSetpoint: { value: 0.4, status: "valid" }, batteryMode: { value: "idle", status: "valid" },
      loadPriority: { value: "balanced", status: "valid" }, confirm: { value: false, status: "valid" },
    } },
  ],
  disconnected: [
    { ...base("hello", 0, 0), capabilities: ["inputs", "output"] },
    { ...base("inputs", 1, 100, "disconnected"), values: Object.fromEntries(
      INPUT_FIELDS.map((field) => [field, { value: null, status: "disconnected" }]),
    ) },
  ],
});

export const HOST_SCENARIOS = Object.freeze({
  nominal: [
    { ...base("output", 2, 200), leds: { connection: "on", inputStatus: "ok", supply: "off", reserveAlert: "off" } },
  ],
});

function serialize(messages, direction, name) {
  if (!messages) throw new Error(`Unknown ${direction} scenario: ${name}`);
  return `${messages.map((message) => JSON.stringify(message)).join("\n")}\n`;
}

export function serializeDeviceScenario(name) {
  return serialize(DEVICE_SCENARIOS[name], "device", name);
}

export function serializeHostScenario(name) {
  const messages = HOST_SCENARIOS[name];
  return serialize(messages, "host", name);
}
