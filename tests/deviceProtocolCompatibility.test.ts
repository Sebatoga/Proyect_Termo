import { describe, expect, it } from "vitest";

import {
  INPUT_FIELDS,
  parseLine,
  validateSequence,
} from "../src/infrastructure/device-protocol/protocol.mjs";

const helloLine = JSON.stringify({
  type: "hello",
  protocolVersion: 1,
  sequence: 0,
  uptimeMs: 0,
  calibrationVersion: "compatibility-v1",
  status: "valid",
  capabilities: ["inputs", "output"],
});

const helloLineWith = (sequence: number, uptimeMs: number) => JSON.stringify({
  type: "hello",
  protocolVersion: 1,
  sequence,
  uptimeMs,
  calibrationVersion: "compatibility-v1",
  status: "valid",
  capabilities: ["inputs", "output"],
});

const inputsLineWithNumericValues = (
  sequence: number,
  lightProxy: number,
  temperature: number,
  hydroSetpoint: number,
) => JSON.stringify({
  type: "inputs",
  protocolVersion: 1,
  sequence,
  uptimeMs: sequence,
  calibrationVersion: "compatibility-v1",
  status: "valid",
  values: {
    lightProxy: { value: lightProxy, status: "valid" },
    temperature: { value: temperature, status: "valid" },
    hydroSetpoint: { value: hydroSetpoint, status: "valid" },
    batteryMode: { value: "idle", status: "valid" },
    loadPriority: { value: "balanced", status: "valid" },
    confirm: { value: false, status: "valid" },
  },
});

describe("device protocol infrastructure compatibility", () => {
  it("parses a valid message through the typed infrastructure API", () => {
    const parsed = parseLine(helloLine);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error("Expected a valid protocol message.");
    expect(parsed.message.type).toBe("hello");
    expect(parsed.message.sequence).toBe(0);
    expect(INPUT_FIELDS).toHaveLength(6);
  });

  it("keeps parse and sequence failures explicit", () => {
    const malformed = parseLine("{");

    expect(malformed.ok).toBe(false);
    if (malformed.ok) throw new Error("Expected an invalid protocol message.");
    expect(malformed.error.code).toBe("MALFORMED_JSON");
    expect(validateSequence(0, 2)).toBe("SEQUENCE_INVALID");
  });

  it("accepts safe-integer maxima and rejects precision-unsafe sequence and uptime", () => {
    const maximumSafeInteger = Number.MAX_SAFE_INTEGER;
    const validBoundary = parseLine(helloLineWith(maximumSafeInteger, maximumSafeInteger));

    expect(validBoundary.ok).toBe(true);
    if (!validBoundary.ok) throw new Error("Expected safe-integer boundary values to parse.");
    expect(validBoundary.message.sequence).toBe(maximumSafeInteger);
    expect(validBoundary.message.uptimeMs).toBe(maximumSafeInteger);

    const unsafeSequence = parseLine(helloLineWith(maximumSafeInteger + 1, 10));
    expect(unsafeSequence.ok).toBe(false);
    if (unsafeSequence.ok) throw new Error("Expected an unsafe sequence to be rejected.");
    expect(unsafeSequence.error.code).toBe("SCHEMA_INVALID");
    expect(unsafeSequence.error.sequence).toBe(0);

    const unsafeUptime = parseLine(helloLineWith(7, maximumSafeInteger + 1));
    expect(unsafeUptime.ok).toBe(false);
    if (unsafeUptime.ok) throw new Error("Expected an unsafe uptime to be rejected.");
    expect(unsafeUptime.error.code).toBe("SCHEMA_INVALID");
    expect(unsafeUptime.error.sequence).toBe(7);
  });

  it("does not echo a negative invalid sequence into the error message", () => {
    const invalidSequence = parseLine(helloLineWith(-1, 10));

    expect(invalidSequence.ok).toBe(false);
    if (invalidSequence.ok) throw new Error("Expected a negative sequence to be rejected.");
    expect(invalidSequence.error.code).toBe("SCHEMA_INVALID");
    expect(invalidSequence.error.sequence).toBe(0);
  });

  it("accepts finite transport numbers without imposing physical-domain ranges", () => {
    const parsed = parseLine(inputsLineWithNumericValues(1, -1e300, 1e300, -1e100));

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) throw new Error("Expected finite transport numbers to parse.");
    expect(parsed.message.type).toBe("inputs");
    if (parsed.message.type !== "inputs") throw new Error("Expected an inputs message.");
    expect(parsed.message.values.lightProxy.value).toBe(-1e300);
    expect(parsed.message.values.temperature.value).toBe(1e300);
    expect(parsed.message.values.hydroSetpoint.value).toBe(-1e100);
  });
});
