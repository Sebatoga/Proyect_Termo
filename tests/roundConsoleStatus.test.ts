import { describe, expect, it } from "vitest";

import type { RoundSessionSnapshot } from "../src/application/round-session/roundSessionPort";
import { createRoundConsoleViewModel } from "../src/console/createRoundConsoleViewModel";
import { renderRoundConsoleStatus } from "../src/console/renderRoundConsoleStatus";

const activeSnapshot = (overrides: Partial<RoundSessionSnapshot> = {}): RoundSessionSnapshot => ({
  status: "waiting-input",
  roundIndex: 1,
  roundCount: 6,
  currentRoundId: "round-2",
  reasonCode: "ENTRADA_PENDIENTE",
  confirmationAllowed: false,
  ...overrides,
});

describe("round console view model", () => {
  it.each([
    ["unavailable", "Sesión no disponible.", false, 0, 0, null],
    ["waiting-input", "Esperando una entrada validada.", false, 1, 6, "round-2"],
    ["ready", "Entrada validada lista para confirmar.", true, 1, 6, "round-2"],
    ["reset-required", "Se requiere reiniciar la sesión.", false, 1, 6, "round-2"],
    ["completed", "Sesión completada.", false, 6, 6, null],
  ] as const)("maps %s with honest status and confirmation text", (
    status,
    text,
    allowed,
    roundIndex,
    roundCount,
    currentRoundId,
  ) => {
    const snapshot = activeSnapshot({
      status,
      roundIndex,
      roundCount,
      currentRoundId,
      confirmationAllowed: true,
    });
    const viewModel = createRoundConsoleViewModel(snapshot);

    expect(viewModel.status.text).toBe(text);
    expect(viewModel.confirmation).toEqual({
      allowed,
      text: `Confirmación disponible: ${allowed ? "sí" : "no"}.`,
    });
    expect(viewModel.status.reasonText).toBe("Motivo: ENTRADA_PENDIENTE.");
  });

  it.each([
    activeSnapshot({ status: "ready", roundIndex: -1, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", roundIndex: 6, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", roundCount: 0, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", currentRoundId: null, confirmationAllowed: true }),
    activeSnapshot({ status: "completed", roundIndex: 6, currentRoundId: "round-6" }),
    activeSnapshot({ status: "completed", roundIndex: 5, currentRoundId: null }),
    { ...activeSnapshot(), status: "unknown" } as unknown as RoundSessionSnapshot,
  ])("fails closed for invalid bounds or combinations", (snapshot) => {
    const viewModel = createRoundConsoleViewModel(snapshot);

    expect(viewModel.status.code).toBe("unavailable");
    expect(viewModel.status.reasonCode).toBe("SNAPSHOT_INVALIDO");
    expect(viewModel.progress.text).toBe("Progreso: ronda no disponible.");
    expect(viewModel.confirmation.allowed).toBe(false);
  });

  it("disables confirmation when a non-ready status or caller flag forbids it", () => {
    expect(createRoundConsoleViewModel(activeSnapshot({ confirmationAllowed: true }))
      .confirmation.allowed).toBe(false);
    expect(createRoundConsoleViewModel(activeSnapshot({ status: "ready" }))
      .confirmation.allowed).toBe(false);
  });

  it("returns deterministic, deeply immutable view models", () => {
    const snapshot = activeSnapshot({ status: "ready", confirmationAllowed: true });
    const first = createRoundConsoleViewModel(snapshot);
    const second = createRoundConsoleViewModel({ ...snapshot });

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.status)).toBe(true);
    expect(Object.isFrozen(first.progress)).toBe(true);
    expect(Object.isFrozen(first.confirmation)).toBe(true);
  });

  it("renders status, progress, reason, and non-color confirmation semantics", () => {
    const target = { textContent: null, dataset: {} } as unknown as HTMLElement;
    const viewModel = createRoundConsoleViewModel(activeSnapshot({
      status: "ready",
      confirmationAllowed: true,
    }));

    renderRoundConsoleStatus(target, viewModel);

    expect(target.textContent).toContain("ronda 2 de 6");
    expect(target.textContent).toContain("Motivo: ENTRADA_PENDIENTE");
    expect(target.textContent).toContain("Confirmación disponible: sí");
    expect(target.dataset.confirmationAvailable).toBe("true");
  });
});

describe("product layer constraints", () => {
  const sources = import.meta.glob("../src/**/*.ts", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;

  it("keeps application and mapper layers independent from presentation runtimes", () => {
    const application = Object.entries(sources)
      .filter(([path]) => path.includes("/application/"))
      .map(([, source]) => source)
      .join("\n");
    const mapper = sources["../src/console/createRoundConsoleViewModel.ts"];

    expect(application).not.toMatch(/phaser|document|window|HTMLElement|Canvas/i);
    expect(mapper).not.toMatch(/phaser/i);
  });

  it("does not import reference tools or excluded product behavior", () => {
    const allSources = Object.values(sources).join("\n");

    expect(allSources).not.toMatch(/from\s+["'][^"']*tools\//);
    expect(allSources).not.toMatch(/serial|WebSocket|fetch\(|localStorage|Math\.random|resolveRound/);
  });
});
