import type {
  HostAdapterSnapshot,
  HostInputValues,
} from "../infrastructure/host-adapter/hostAdapter.mjs";

export type DeviceObservationLevel =
  | "empty"
  | "awaiting-input"
  | "valid"
  | "invalid"
  | "disconnected";

export interface DeviceObservationRow {
  readonly field: string;
  readonly label: string;
  readonly value: string;
}

export interface DeviceObservationViewModel {
  readonly level: DeviceObservationLevel;
  readonly statusLabel: string;
  readonly summary: string;
  readonly issue: string | null;
  readonly announcement: string;
  readonly rows: readonly DeviceObservationRow[];
}

const FIELD_ORDER: readonly (keyof HostInputValues)[] = Object.freeze([
  "lightProxy",
  "temperature",
  "hydroSetpoint",
  "batteryMode",
  "loadPriority",
  "confirm",
]);

const NO_VALUE = "sin valor";

const STATUS_LABELS: Readonly<Record<DeviceObservationLevel, string>> = Object.freeze({
  empty: "Sin líneas procesadas",
  "awaiting-input": "Saludo aceptado; entradas pendientes",
  valid: "Snapshot válido",
  invalid: "Snapshot inválido",
  disconnected: "Dispositivo desconectado",
});

function formatValue(value: HostInputValues[keyof HostInputValues]): string {
  if (value === null) return NO_VALUE;
  if (typeof value === "boolean") return value ? "sí" : "no";
  return String(value);
}

function summarize(
  level: DeviceObservationLevel,
  snapshot: HostAdapterSnapshot,
): string {
  if (level === "empty") {
    return "Aún no se procesó ninguna línea; los seis valores están vacíos.";
  }
  if (level === "awaiting-input") {
    return "La línea hello v1 fue aceptada; aún se espera un snapshot inputs válido. Los seis campos están vacíos.";
  }
  if (level === "valid") {
    return `Secuencia ${String(snapshot.acceptedSequence)} aceptada con calibración `
      + `“${String(snapshot.calibrationVersion)}”. Estos valores no modifican la partida.`;
  }
  if (level === "invalid") {
    return "La última línea fue rechazada; los seis valores quedan vacíos hasta una entrada válida.";
  }
  return "No hay dispositivo conectado; los seis valores quedan vacíos hasta reconectar.";
}

function describeIssue(snapshot: HostAdapterSnapshot): string | null {
  if (snapshot.issue === null) return null;
  return snapshot.issue.detail === undefined
    ? snapshot.issue.code
    : `${snapshot.issue.code}: ${snapshot.issue.detail}`;
}

export function createDeviceObservationViewModel(
  snapshot: HostAdapterSnapshot,
  processedLines: number,
): DeviceObservationViewModel {
  const level: DeviceObservationLevel = processedLines === 0
    ? "empty"
    : snapshot.transport === "connected"
        && snapshot.inputStatus === "invalid"
        && snapshot.issue === null
      ? "awaiting-input"
      : snapshot.inputStatus;

  const statusLabel = STATUS_LABELS[level];
  const summary = summarize(level, snapshot);
  const rows = level === "empty"
    ? []
    : FIELD_ORDER.map((field) => Object.freeze({
      field,
      label: `${field} (transporte)`,
      value: formatValue(snapshot.values[field]),
    }));

  return Object.freeze({
    level,
    statusLabel,
    summary,
    issue: level === "empty" ? null : describeIssue(snapshot),
    announcement: `${statusLabel}. ${summary}`,
    rows: Object.freeze(rows),
  });
}
