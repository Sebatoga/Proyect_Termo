import { describe, expect, it } from "vitest";

import { consoleSpec } from "../src/consoleSpec";
import { createGameConfig } from "../src/createGameConfig";

class TestScene {}

describe("secondary console bootstrap", () => {
  it("declares deterministic metadata without product-domain behavior", () => {
    expect(consoleSpec).toEqual({
      title: "EcoGrid: Ciudad al Límite",
      sceneKey: "console-bootstrap",
      parentId: "game-container",
      width: 960,
      height: 540,
      backgroundColor: "#102a2a",
      heading: "Consola local lista",
      detail: "Bootstrap técnico · Sin gameplay",
      scientificDomainIncluded: false,
      physicalBoardReplaced: false,
    });
    expect(Object.isFrozen(consoleSpec)).toBe(true);
  });

  it("builds a stable game configuration from injected runtime bindings", () => {
    const config = createGameConfig({
      renderer: 3,
      scaleMode: 4,
      autoCenter: 1,
      scene: TestScene,
    });

    expect(config).toEqual({
      type: 3,
      parent: "game-container",
      width: 960,
      height: 540,
      backgroundColor: "#102a2a",
      scene: TestScene,
      scale: {
        mode: 4,
        autoCenter: 1,
        width: 960,
        height: 540,
      },
    });
  });
});
