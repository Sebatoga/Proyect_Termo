import Phaser from "phaser";

import { runtimeDescriptor } from "./runtimeDescriptor";

class CompatibilityScene extends Phaser.Scene {
  constructor() {
    super("compatibility");
  }

  create(): void {
    this.cameras.main.setBackgroundColor("#102a2a");
    this.add
      .text(400, 225, runtimeDescriptor.message, {
        color: "#f2f7f5",
        fontFamily: "system-ui, sans-serif",
        fontSize: "24px",
      })
      .setOrigin(0.5);
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "app",
  width: 800,
  height: 450,
  scene: CompatibilityScene,
});
