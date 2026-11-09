import Phaser from "phaser";

import { createSimulatedRoundSession } from "./application/round-session/createSimulatedRoundSession";
import { ConsoleBootstrapScene } from "./ConsoleBootstrapScene";
import { createRoundConsoleViewModel } from "./console/createRoundConsoleViewModel";
import { renderRoundConsoleStatus } from "./console/renderRoundConsoleStatus";
import { renderSimulatedObservation } from "./console/renderSimulatedObservation";
import { createGameConfig } from "./createGameConfig";
import "./styles.css";

const statusTarget = document.querySelector<HTMLElement>("#console-status");
if (statusTarget === null) throw new Error("Missing console status target.");
const loadInputButton = document.querySelector<HTMLButtonElement>("#load-simulated-input");
const confirmButton = document.querySelector<HTMLButtonElement>("#confirm-simulated-round");
if (loadInputButton === null || confirmButton === null) throw new Error("Missing simulated controls.");
const announcement = document.querySelector<HTMLElement>("#observation-announcement");
const acceptedSummary = document.querySelector<HTMLElement>("#accepted-input-summary");
const acceptedValues = document.querySelector<HTMLElement>("#accepted-input-values");
const traceList = document.querySelector<HTMLOListElement>("#simulated-trace");
if (announcement === null || acceptedSummary === null || acceptedValues === null || traceList === null) {
  throw new Error("Missing simulated observation targets.");
}

const session = createSimulatedRoundSession();
const renderSession = (): void => {
  const snapshot = session.snapshot();
  renderRoundConsoleStatus(statusTarget, createRoundConsoleViewModel(snapshot));
  renderSimulatedObservation(
    { announcement, acceptedSummary, acceptedValues, traceList },
    session.observe(),
  );
  loadInputButton.disabled = snapshot.status !== "waiting-input";
  confirmButton.disabled = !snapshot.confirmationAllowed;
};

loadInputButton.addEventListener("click", () => {
  session.loadInput();
  renderSession();
});
confirmButton.addEventListener("click", () => {
  session.confirm();
  renderSession();
});
renderSession();

const gameConfig: Phaser.Types.Core.GameConfig = createGameConfig({
  renderer: Phaser.AUTO,
  scaleMode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: ConsoleBootstrapScene,
});

new Phaser.Game(gameConfig);
