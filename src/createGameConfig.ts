import type Phaser from "phaser";

import { consoleSpec } from "./consoleSpec";

export interface PhaserRuntimeBindings {
  readonly renderer: number;
  readonly scaleMode: number;
  readonly autoCenter: number;
  readonly scene: Phaser.Types.Scenes.SceneType;
}

export function createGameConfig(
  bindings: PhaserRuntimeBindings,
): Phaser.Types.Core.GameConfig {
  return {
    type: bindings.renderer,
    parent: consoleSpec.parentId,
    width: consoleSpec.width,
    height: consoleSpec.height,
    backgroundColor: consoleSpec.backgroundColor,
    scene: bindings.scene,
    scale: {
      mode: bindings.scaleMode,
      autoCenter: bindings.autoCenter,
      width: consoleSpec.width,
      height: consoleSpec.height,
    },
  };
}
