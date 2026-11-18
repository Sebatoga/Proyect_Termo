import type { RoundConsoleViewModel } from "./createRoundConsoleViewModel";

export interface SessionNoticeTargets {
  readonly container: HTMLElement;
  readonly label: HTMLElement;
  readonly title: HTMLElement;
  readonly message: HTMLElement;
}

export function renderSessionNotice(
  targets: SessionNoticeTargets,
  viewModel: RoundConsoleViewModel,
): void {
  const notice = viewModel.notice;
  targets.container.hidden = notice === null;
  targets.label.textContent = notice?.label ?? "";
  targets.title.textContent = notice?.title ?? "";
  targets.message.textContent = notice?.message ?? "";
  if (notice === null) {
    delete targets.container.dataset.level;
  } else {
    targets.container.dataset.level = notice.level;
  }
}
