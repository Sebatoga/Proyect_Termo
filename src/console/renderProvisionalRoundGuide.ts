import type { RoundConsoleViewModel } from "./createRoundConsoleViewModel";

export interface ProvisionalRoundGuideTargets {
  readonly container: HTMLElement;
  readonly title: HTMLElement;
  readonly question: HTMLElement;
}

export function renderProvisionalRoundGuide(
  targets: ProvisionalRoundGuideTargets,
  viewModel: RoundConsoleViewModel,
): void {
  const scenario = viewModel.scenario;
  targets.container.hidden = scenario === null;
  targets.title.textContent = scenario?.title ?? "";
  targets.question.textContent = scenario?.question ?? "";
  if (scenario === null) {
    delete targets.container.dataset.eventKey;
  } else {
    targets.container.dataset.eventKey = scenario.eventKey;
  }
}
