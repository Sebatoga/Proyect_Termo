import type { RoundConsoleViewModel } from "./createRoundConsoleViewModel";

export function renderRoundConsoleStatus(
  target: HTMLElement,
  viewModel: RoundConsoleViewModel,
): void {
  target.textContent = [
    viewModel.status.text,
    viewModel.progress.text,
    viewModel.status.reasonText,
    viewModel.confirmation.text,
  ].join(" ");
  target.dataset.confirmationAvailable = String(viewModel.confirmation.allowed);
}
