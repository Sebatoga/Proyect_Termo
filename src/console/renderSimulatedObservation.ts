import type { SimulatedSessionObservation } from "../application/round-session/createSimulatedRoundSession";

export interface SimulatedObservationTargets {
  readonly announcement: HTMLElement;
  readonly acceptedSummary: HTMLElement;
  readonly acceptedValues: HTMLElement;
  readonly traceList: HTMLOListElement;
}

const addTerm = (target: HTMLElement, field: string, label: string, value: string): void => {
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.dataset.field = field;
  description.textContent = value;
  target.append(term, description);
};

export function renderSimulatedObservation(
  targets: SimulatedObservationTargets,
  observation: SimulatedSessionObservation,
): void {
  targets.acceptedValues.replaceChildren();
  targets.traceList.replaceChildren();

  if (observation.acceptedInput === null) {
    targets.acceptedSummary.textContent = "Aún no hay una entrada simulada aceptada.";
    targets.announcement.textContent = "Sin entrada simulada aceptada. Traza vacía.";
  } else {
    const input = observation.acceptedInput;
    targets.acceptedSummary.textContent = "Última entrada simulada aceptada:";
    targets.announcement.textContent = `Entrada simulada aceptada, secuencia ${input.sequence}. Rondas confirmadas: ${observation.trace.length}.`;
    addTerm(targets.acceptedValues, "sourceMode", "Fuente y modo", input.sourceMode);
    addTerm(targets.acceptedValues, "sequence", "Secuencia", String(input.sequence));
    addTerm(targets.acceptedValues, "calibrationLabel", "Etiqueta de calibración", input.calibrationLabel);
    addTerm(targets.acceptedValues, "lightProxy", "Campo simulado lightProxy", String(input.values.lightProxy));
    addTerm(targets.acceptedValues, "temperature", "Campo simulado temperature", String(input.values.temperature));
    addTerm(targets.acceptedValues, "hydroSetpoint", "Campo simulado hydroSetpoint", String(input.values.hydroSetpoint));
    addTerm(targets.acceptedValues, "batteryMode", "Campo simulado batteryMode", input.values.batteryMode);
    addTerm(targets.acceptedValues, "loadPriority", "Campo simulado loadPriority", input.values.loadPriority);
    addTerm(targets.acceptedValues, "confirm", "Campo simulado confirm", input.values.confirm ? "sí" : "no");
  }

  for (const row of observation.trace) {
    const item = document.createElement("li");
    item.textContent = `${row.roundId} · evento provisional: ${row.eventKey} · secuencia: ${row.inputSequence}`;
    targets.traceList.append(item);
  }
}
