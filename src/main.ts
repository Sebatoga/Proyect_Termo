import Phaser from "phaser";

import { ConsoleBootstrapScene } from "./ConsoleBootstrapScene";
import { createGameConfig } from "./createGameConfig";
import "./styles.css";

const gameConfig: Phaser.Types.Core.GameConfig = createGameConfig({
  renderer: Phaser.AUTO,
  scaleMode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: ConsoleBootstrapScene,
});

new Phaser.Game(gameConfig);
