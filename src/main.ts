import Phaser from "phaser";

import { createSimulatedRoundSession } from "./application/round-session/createSimulatedRoundSession";
import { ConsoleBootstrapScene } from "./ConsoleBootstrapScene";
import { createDeviceObservationViewModel } from "./console/createDeviceObservationViewModel";
import { createRoundConsoleViewModel } from "./console/createRoundConsoleViewModel";
import { focusNextSimulatedAction } from "./console/focusNextSimulatedAction";
import { renderDeviceObservation } from "./console/renderDeviceObservation";
import { renderProvisionalRoundGuide } from "./console/renderProvisionalRoundGuide";
import { renderRoundConsoleStatus } from "./console/renderRoundConsoleStatus";
import { renderSessionNotice } from "./console/renderSessionNotice";
import { renderSimulatedObservation } from "./console/renderSimulatedObservation";
import { createGameConfig } from "./createGameConfig";
import { createHostAdapter } from "./infrastructure/host-adapter/hostAdapter.mjs";
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
const deviceLines = document.querySelector<HTMLTextAreaElement>("#device-lines");
const processDeviceButton = document.querySelector<HTMLButtonElement>("#process-device-lines");
const disconnectDeviceButton = document.querySelector<HTMLButtonElement>("#disconnect-device");
const resetDeviceButton = document.querySelector<HTMLButtonElement>("#reset-device-reading");
const deviceStatus = document.querySelector<HTMLElement>("#device-status");
const deviceSummary = document.querySelector<HTMLElement>("#device-summary");
const deviceIssue = document.querySelector<HTMLElement>("#device-issue");
const deviceValues = document.querySelector<HTMLElement>("#device-values");
const deviceAnnouncement = document.querySelector<HTMLElement>("#device-announcement");
if (deviceLines === null || processDeviceButton === null || disconnectDeviceButton === null
  || resetDeviceButton === null || deviceStatus === null || deviceSummary === null
  || deviceIssue === null || deviceValues === null || deviceAnnouncement === null) {
  throw new Error("Missing device observation targets.");
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

let deviceAdapter = createHostAdapter();
let processedDeviceLines = 0;
const deviceTargets = Object.freeze({
  status: deviceStatus,
  summary: deviceSummary,
  issue: deviceIssue,
  values: deviceValues,
  announcement: deviceAnnouncement,
});
const renderDevice = (): void => {
  const snapshot = deviceAdapter.snapshot();
  renderDeviceObservation(
    deviceTargets,
    createDeviceObservationViewModel(snapshot, processedDeviceLines),
  );
  processDeviceButton.disabled = false;
  disconnectDeviceButton.disabled = processedDeviceLines === 0 || snapshot.transport === "disconnected";
  resetDeviceButton.disabled = processedDeviceLines === 0;
};

processDeviceButton.addEventListener("click", () => {
  const lines = deviceLines.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  for (const line of lines) {
    deviceAdapter.ingest(line);
    processedDeviceLines += 1;
  }
  renderDevice();
});
disconnectDeviceButton.addEventListener("click", () => {
  deviceAdapter.disconnect();
  renderDevice();
});
resetDeviceButton.addEventListener("click", () => {
  deviceAdapter = createHostAdapter();
  processedDeviceLines = 0;
  deviceLines.value = "";
  renderDevice();
  deviceLines.focus();
});
renderDevice();

const gameConfig: Phaser.Types.Core.GameConfig = createGameConfig({
  renderer: Phaser.AUTO,
  scaleMode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  scene: ConsoleBootstrapScene,
});

new Phaser.Game(gameConfig);
