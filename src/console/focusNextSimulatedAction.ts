export interface SimulatedActionTargets {
  readonly load: HTMLButtonElement;
  readonly confirm: HTMLButtonElement;
  readonly reset: HTMLButtonElement;
}

export function focusNextSimulatedAction(targets: SimulatedActionTargets): void {
  const next = !targets.confirm.disabled
    ? targets.confirm
    : !targets.load.disabled
      ? targets.load
      : !targets.reset.disabled
        ? targets.reset
        : null;
  next?.focus();
}
