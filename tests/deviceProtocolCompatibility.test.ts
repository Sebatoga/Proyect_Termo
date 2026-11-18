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
});
