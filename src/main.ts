import Phaser from "phaser";

import type { RoundSessionSnapshot } from "./application/round-session/roundSessionPort";
import { ConsoleBootstrapScene } from "./ConsoleBootstrapScene";
import { createRoundConsoleViewModel } from "./console/createRoundConsoleViewModel";
import { renderRoundConsoleStatus } from "./console/renderRoundConsoleStatus";
import { createGameConfig } from "./createGameConfig";
import "./styles.css";

const initialSession: RoundSessionSnapshot = Object.freeze({
  status: "unavailable",
  roundIndex: 0,
  roundCount: 0,
  currentRoundId: null,
  reasonCode: "FUENTE_VALIDADA_PENDIENTE",
  confirmationAllowed: false,
});

const statusTarget = document.querySelector<HTMLElement>("#console-status");
if (statusTarget === null) throw new Error("Missing console status target.");
renderRoundConsoleStatus(statusTarget, createRoundConsoleViewModel(initialSession));

const gameConfig: Phaser.Types.Core.GameConfig = createGameConfig({
  renderer: Phaser.AUTO,
  scaleMode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: ConsoleBootstrapScene,
});

new Phaser.Game(gameConfig);
