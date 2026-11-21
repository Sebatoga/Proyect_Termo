import type { DeviceObservationViewModel } from "./createDeviceObservationViewModel";

export interface DeviceObservationTargets {
  readonly status: HTMLElement;
  readonly summary: HTMLElement;
  readonly issue: HTMLElement;
  readonly values: HTMLElement;
  readonly announcement: HTMLElement;
}

export function renderDeviceObservation(
  targets: DeviceObservationTargets,
  viewModel: DeviceObservationViewModel,
): void {
  targets.status.textContent = viewModel.statusLabel;
  targets.status.dataset.level = viewModel.level;
  targets.summary.textContent = viewModel.summary;
  targets.announcement.textContent = viewModel.issue === null
    ? viewModel.announcement
    : `${viewModel.announcement} Motivo: ${viewModel.issue}`;

  targets.issue.hidden = viewModel.issue === null;
  targets.issue.textContent = viewModel.issue === null ? "" : `Motivo: ${viewModel.issue}`;

  targets.values.replaceChildren();
  for (const row of viewModel.rows) {
    const term = document.createElement("dt");
    term.textContent = row.label;
    const description = document.createElement("dd");
    description.dataset.field = row.field;
    description.textContent = row.value;
    targets.values.append(term, description);
  }
}
