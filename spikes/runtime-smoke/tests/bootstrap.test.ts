import { describe, expect, it } from "vitest";

import { runtimeDescriptor } from "../src/runtimeDescriptor";

describe("runtime descriptor", () => {
  it("identifies an isolated compatibility spike without scientific domain", () => {
    expect(runtimeDescriptor).toEqual({
      name: "EcoGrid runtime smoke",
      message: "Phaser + Vite + TypeScript compatibility spike",
      scientificDomainIncluded: false,
    });
    expect(Object.isFrozen(runtimeDescriptor)).toBe(true);
  });
});
