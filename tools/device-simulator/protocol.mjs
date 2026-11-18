import { INPUT_FIELDS } from "../../src/infrastructure/device-protocol/protocol.mjs";

export {
  BATTERY_MODES,
  errorMessage,
  INPUT_FIELDS,
  LOAD_PRIORITIES,
  parseLine,
  PROTOCOL_VERSION,
  STATUSES,
  validateSequence,
} from "../../src/infrastructure/device-protocol/protocol.mjs";

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
