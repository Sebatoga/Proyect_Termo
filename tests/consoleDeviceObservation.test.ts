import { describe, expect, it } from "vitest";

import { createDeviceObservationViewModel } from "../src/console/createDeviceObservationViewModel";
import { createHostAdapter } from "../src/infrastructure/host-adapter/hostAdapter.mjs";

const helloLine = JSON.stringify({
  type: "hello",
  protocolVersion: 1,
  sequence: 0,
  uptimeMs: 0,
  calibrationVersion: "sim-v1",
  status: "valid",
  capabilities: ["inputs", "output"],
});

const inputsLine = (sequence: number): string => JSON.stringify({
  type: "inputs",
  protocolVersion: 1,
  sequence,
  uptimeMs: sequence * 100,
  calibrationVersion: "sim-v1",
  status: "valid",
  values: {
    lightProxy: { value: 0.72, status: "valid" },
    temperature: { value: 24.5, status: "valid" },
    hydroSetpoint: { value: 0.4, status: "valid" },
    batteryMode: { value: "idle", status: "valid" },
    loadPriority: { value: "balanced", status: "valid" },
    confirm: { value: false, status: "valid" },
  },
});

const disconnectedInputsLine = JSON.stringify({
  type: "inputs",
  protocolVersion: 1,
  sequence: 1,
  uptimeMs: 100,
  calibrationVersion: "sim-v1",
  status: "disconnected",
  values: {
    lightProxy: { value: null, status: "disconnected" },
    temperature: { value: null, status: "disconnected" },
    hydroSetpoint: { value: null, status: "disconnected" },
    batteryMode: { value: null, status: "disconnected" },
    loadPriority: { value: null, status: "disconnected" },
    confirm: { value: null, status: "disconnected" },
  },
});

const ingestAll = (...lines: string[]) => {
  const adapter = createHostAdapter();
  for (const line of lines) adapter.ingest(line);
  return adapter.snapshot();
};

describe("device observation view model", () => {
  it("reports an empty panel before any line is processed", () => {
    const viewModel = createDeviceObservationViewModel(ingestAll(), 0);

    expect(viewModel.level).toBe("empty");
    expect(viewModel.statusLabel).toBe("Sin líneas procesadas");
    expect(viewModel.rows).toEqual([]);
    expect(viewModel.issue).toBeNull();
  });

  it("distinguishes an accepted hello from an invalid snapshot", () => {
    const viewModel = createDeviceObservationViewModel(
      ingestAll(helloLine),
      1,
    );

    expect(viewModel.level).toBe("awaiting-input");
    expect(viewModel.statusLabel).toBe("Saludo aceptado; entradas pendientes");
    expect(viewModel.issue).toBeNull();
    expect(viewModel.summary).toContain("hello v1 fue aceptada");
    expect(viewModel.rows).toHaveLength(6);
    expect(viewModel.rows.every((row) => row.value === "sin valor")).toBe(true);
  });

  it("exposes the six transport values of an accepted snapshot", () => {
    const viewModel = createDeviceObservationViewModel(
      ingestAll(helloLine, inputsLine(1)),
      2,
    );

    expect(viewModel.level).toBe("valid");
    expect(viewModel.issue).toBeNull();
    expect(viewModel.rows.map((row) => row.field)).toEqual([
      "lightProxy",
      "temperature",
      "hydroSetpoint",
      "batteryMode",
      "loadPriority",
      "confirm",
    ]);
    expect(viewModel.rows.map((row) => row.value)).toEqual([
      "0.72",
      "24.5",
      "0.4",
      "idle",
      "balanced",
      "no",
    ]);
    expect(viewModel.summary).toContain("Secuencia 1");
    expect(viewModel.summary).toContain("no modifican la partida");
  });

  it("clears every value when a later line is rejected", () => {
    const adapter = createHostAdapter();
    adapter.ingest(helloLine);
    adapter.ingest(inputsLine(1));
    adapter.ingest("{not json");

    const viewModel = createDeviceObservationViewModel(adapter.snapshot(), 3);

    expect(viewModel.level).toBe("invalid");
    expect(viewModel.issue).toContain("MALFORMED_JSON");
    expect(viewModel.rows.every((row) => row.value === "sin valor")).toBe(true);
  });

  it("recovers after a rejected unsequenced line when the next expected sequence arrives", () => {
    const adapter = createHostAdapter();
    adapter.ingest(helloLine);
    adapter.ingest(inputsLine(1));
    adapter.ingest("{not json");

    const rejected = createDeviceObservationViewModel(adapter.snapshot(), 3);
    expect(rejected.level).toBe("invalid");
    expect(rejected.rows.every((row) => row.value === "sin valor")).toBe(true);

    adapter.ingest(inputsLine(2));
    const recovered = createDeviceObservationViewModel(adapter.snapshot(), 4);

    expect(recovered.level).toBe("valid");
    expect(recovered.issue).toBeNull();
    expect(recovered.rows.find((row) => row.field === "temperature")?.value).toBe("24.5");
  });

  it("rejects a sequence gap without keeping previous values", () => {
    const viewModel = createDeviceObservationViewModel(
      ingestAll(helloLine, inputsLine(2)),
      2,
    );

    expect(viewModel.level).toBe("invalid");
    expect(viewModel.issue).toContain("SEQUENCE_INVALID");
    expect(viewModel.rows.every((row) => row.value === "sin valor")).toBe(true);
  });

  it("reports a disconnected snapshot from a device message", () => {
    const viewModel = createDeviceObservationViewModel(
      ingestAll(helloLine, disconnectedInputsLine),
      2,
    );

    expect(viewModel.level).toBe("disconnected");
    expect(viewModel.statusLabel).toBe("Dispositivo desconectado");
    expect(viewModel.issue).toContain("DISCONNECTED");
    expect(viewModel.rows).toHaveLength(6);
    expect(viewModel.rows.every((row) => row.value === "sin valor")).toBe(true);
  });

  it("announces the state and reason for assistive output", () => {
    const viewModel = createDeviceObservationViewModel(ingestAll("{", "x"), 2);

    expect(viewModel.announcement).toContain("Snapshot inválido");
    expect(viewModel.announcement).toContain("seis valores quedan vacíos");
  });
});
