import Phaser from "phaser";

import { consoleSpec } from "./consoleSpec";

export class ConsoleBootstrapScene extends Phaser.Scene {
  constructor() {
    super(consoleSpec.sceneKey);
  }

  create(): void {
    const centerX = consoleSpec.width / 2;
    const centerY = consoleSpec.height / 2;

    this.add
      .text(centerX, centerY - 18, consoleSpec.heading, {
        color: "#f2f7f5",
        fontFamily: "system-ui, sans-serif",
        fontSize: "32px",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + 34, consoleSpec.detail, {
        color: "#c7ded8",
        fontFamily: "system-ui, sans-serif",
        fontSize: "20px",
      })
      .setOrigin(0.5);
  }
}
