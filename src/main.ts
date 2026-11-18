import Phaser from "phaser";

import { createSimulatedRoundSession } from "./application/round-session/createSimulatedRoundSession";
import { ConsoleBootstrapScene } from "./ConsoleBootstrapScene";
import { createRoundConsoleViewModel } from "./console/createRoundConsoleViewModel";
import { focusNextSimulatedAction } from "./console/focusNextSimulatedAction";
import { renderProvisionalRoundGuide } from "./console/renderProvisionalRoundGuide";
import { renderRoundConsoleStatus } from "./console/renderRoundConsoleStatus";
import { renderSessionNotice } from "./console/renderSessionNotice";
import { renderSimulatedObservation } from "./console/renderSimulatedObservation";
import { createGameConfig } from "./createGameConfig";
import "./styles.css";

const statusTarget = document.querySelector<HTMLElement>("#console-status");
if (statusTarget === null) throw new Error("Missing console status target.");
const roundGuideContainer = document.querySelector<HTMLElement>("#round-guide");
const roundGuideTitle = document.querySelector<HTMLElement>("#round-guide-title");
const roundGuideQuestion = document.querySelector<HTMLElement>("#round-guide-question");
if (roundGuideContainer === null || roundGuideTitle === null || roundGuideQuestion === null) {
  throw new Error("Missing provisional round guide targets.");
}
const noticeContainer = document.querySelector<HTMLElement>("#session-notice");
const noticeLabel = document.querySelector<HTMLElement>("#session-notice-label");
const noticeTitle = document.querySelector<HTMLElement>("#session-notice-title");
const noticeMessage = document.querySelector<HTMLElement>("#session-notice-message");
if (noticeContainer === null || noticeLabel === null || noticeTitle === null || noticeMessage === null) {
  throw new Error("Missing session notice targets.");
}
const loadInputButton = document.querySelector<HTMLButtonElement>("#load-simulated-input");
const confirmButton = document.querySelector<HTMLButtonElement>("#confirm-simulated-round");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-simulated-session");
const diagnosticButton = document.querySelector<HTMLButtonElement>("#run-malformed-input-diagnostic");
if (loadInputButton === null || confirmButton === null || resetButton === null || diagnosticButton === null) {
  throw new Error("Missing simulated controls.");
}
const announcement = document.querySelector<HTMLElement>("#observation-announcement");
const acceptedSummary = document.querySelector<HTMLElement>("#accepted-input-summary");
const acceptedValues = document.querySelector<HTMLElement>("#accepted-input-values");
const traceList = document.querySelector<HTMLOListElement>("#simulated-trace");
if (announcement === null || acceptedSummary === null || acceptedValues === null || traceList === null) {
  throw new Error("Missing simulated observation targets.");
}

const session = createSimulatedRoundSession();
const actionTargets = Object.freeze({
  load: loadInputButton,
  confirm: confirmButton,
  reset: resetButton,
});
const renderSession = (): void => {
  const snapshot = session.snapshot();
  const viewModel = createRoundConsoleViewModel(snapshot);
  renderRoundConsoleStatus(statusTarget, viewModel);
  renderProvisionalRoundGuide({
    container: roundGuideContainer,
    title: roundGuideTitle,
    question: roundGuideQuestion,
  }, viewModel);
  renderSessionNotice({
    container: noticeContainer,
    label: noticeLabel,
    title: noticeTitle,
    message: noticeMessage,
  }, viewModel);
  renderSimulatedObservation(
    { announcement, acceptedSummary, acceptedValues, traceList },
    session.observe(),
  );
  loadInputButton.disabled = snapshot.status !== "waiting-input";
  confirmButton.disabled = !snapshot.confirmationAllowed;
  resetButton.disabled = snapshot.status !== "completed";
  diagnosticButton.disabled = snapshot.status !== "waiting-input";
};

loadInputButton.addEventListener("click", () => {
  session.loadInput();
  renderSession();
  focusNextSimulatedAction(actionTargets);
});
confirmButton.addEventListener("click", () => {
  session.confirm();
  renderSession();
  focusNextSimulatedAction(actionTargets);
});
resetButton.addEventListener("click", () => {
  session.reset();
  renderSession();
  focusNextSimulatedAction(actionTargets);
});
diagnosticButton.addEventListener("click", () => {
  session.runMalformedInputDiagnostic();
  renderSession();
  focusNextSimulatedAction(actionTargets);
});
renderSession();

const gameConfig: Phaser.Types.Core.GameConfig = createGameConfig({
  renderer: Phaser.AUTO,
  scaleMode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: ConsoleBootstrapScene,
});

new Phaser.Game(gameConfig);
