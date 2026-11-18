import { describe, expect, it } from "vitest";

import {
  EXPECTED_ROUND_COUNT,
  type RoundSessionSnapshot,
} from "../src/application/round-session/roundSessionPort";
import {
  createRoundConsoleViewModel,
  MAX_CURRENT_ROUND_ID_LENGTH,
  MAX_REASON_CODE_LENGTH,
} from "../src/console/createRoundConsoleViewModel";
import { focusNextSimulatedAction } from "../src/console/focusNextSimulatedAction";
import { renderProvisionalRoundGuide } from "../src/console/renderProvisionalRoundGuide";
import { renderRoundConsoleStatus } from "../src/console/renderRoundConsoleStatus";
import { renderSessionNotice } from "../src/console/renderSessionNotice";

const activeSnapshot = (overrides: Partial<RoundSessionSnapshot> = {}): RoundSessionSnapshot => ({
  status: "waiting-input",
  roundIndex: 1,
  roundCount: EXPECTED_ROUND_COUNT,
  currentRoundId: "round-2",
  reasonCode: "ENTRADA_PENDIENTE",
  confirmationAllowed: false,
  ...overrides,
});

describe("round console view model", () => {
  it("exports the fixed six-round product contract", () => {
    expect(EXPECTED_ROUND_COUNT).toBe(6);
  });

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
      confirmationAllowed: allowed,
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
    activeSnapshot({ status: "ready", roundIndex: Number.MAX_SAFE_INTEGER, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", roundCount: 5, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", roundCount: 7, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", roundCount: Number.MAX_SAFE_INTEGER, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", roundCount: 0, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", currentRoundId: "", confirmationAllowed: true }),
    activeSnapshot({ status: "ready", currentRoundId: null, confirmationAllowed: true }),
    activeSnapshot({ status: "ready", currentRoundId: "round-1", confirmationAllowed: true }),
    activeSnapshot({ status: "ready", currentRoundId: "round-unknown", confirmationAllowed: true }),
    activeSnapshot({ status: "completed", roundIndex: 6, currentRoundId: "round-6" }),
    activeSnapshot({ status: "completed", roundIndex: 5, currentRoundId: null }),
    activeSnapshot({ status: "completed", roundIndex: 7, currentRoundId: null }),
    activeSnapshot({ status: "completed", roundIndex: Number.MAX_SAFE_INTEGER, currentRoundId: null }),
    activeSnapshot({ status: "completed", roundIndex: 6, roundCount: 5, currentRoundId: null }),
    activeSnapshot({ status: "completed", roundIndex: 6, roundCount: 7, currentRoundId: null }),
    activeSnapshot({ status: "completed", roundIndex: 6, roundCount: Number.MAX_SAFE_INTEGER, currentRoundId: null }),
    activeSnapshot({ status: "unavailable", roundIndex: 0, roundCount: 6, currentRoundId: null }),
    activeSnapshot({ roundIndex: Number.NaN }),
    activeSnapshot({ roundCount: Number.POSITIVE_INFINITY }),
    activeSnapshot({ roundIndex: Number.MAX_SAFE_INTEGER + 1 }),
    activeSnapshot({ currentRoundId: "r".repeat(MAX_CURRENT_ROUND_ID_LENGTH + 1) }),
    activeSnapshot({ reasonCode: "R".repeat(MAX_REASON_CODE_LENGTH + 1) }),
    { ...activeSnapshot(), status: "unknown" } as unknown as RoundSessionSnapshot,
  ])("fails closed for invalid bounds or combinations", (snapshot) => {
    const viewModel = createRoundConsoleViewModel(snapshot);

    expect(viewModel.status.code).toBe("unavailable");
    expect(viewModel.status.reasonCode).toBe("SNAPSHOT_INVALIDO");
    expect(viewModel.progress.text).toBe("Progreso: ronda no disponible.");
    expect(viewModel.confirmation.allowed).toBe(false);
  });

  it.each([0, EXPECTED_ROUND_COUNT - 1])("accepts active boundary index %s", (roundIndex) => {
    const viewModel = createRoundConsoleViewModel(activeSnapshot({
      roundIndex,
      currentRoundId: `round-${roundIndex + 1}`,
    }));

    expect(viewModel.status.reasonCode).toBe("ENTRADA_PENDIENTE");
    expect(viewModel.progress.index).toBe(roundIndex);
    expect(viewModel.progress.count).toBe(EXPECTED_ROUND_COUNT);
  });

  it.each([
    [0, "Condición base", "¿Entendemos el tablero y qué cargas debemos priorizar?"],
    [1, "Temperatura alta", "¿Cómo cambia la estrategia cuando el panel trabaja más caliente?"],
    [2, "Río bajo", "¿Qué consigna hidro es posible sin vulnerar el caudal ecológico?"],
    [3, "Pico de demanda", "¿Qué cargas protegemos y cuándo usamos la batería?"],
    [4, "Luz reducida", "¿Cómo administramos la reserva sin inventar generación?"],
    [5, "Combinación final", "¿Podemos sostener la ciudad y justificar todas las decisiones?"],
  ] as const)("maps round %s to canonical provisional copy", (roundIndex, title, question) => {
    const viewModel = createRoundConsoleViewModel(activeSnapshot({
      roundIndex,
      currentRoundId: `round-${roundIndex + 1}`,
    }));

    expect(viewModel.scenario).toMatchObject({ title, question });
  });

  it.each([
    ["unavailable", false, true], ["unavailable", true, false],
    ["waiting-input", false, true], ["waiting-input", true, false],
    ["ready", false, false], ["ready", true, true],
    ["reset-required", false, true], ["reset-required", true, false],
    ["completed", false, true], ["completed", true, false],
  ] as const)("enforces the %s confirmation invariant for %s", (status, confirmationAllowed, valid) => {
    const shape = status === "unavailable"
      ? { roundIndex: 0, roundCount: 0, currentRoundId: null }
      : status === "completed"
        ? { roundIndex: 6, roundCount: 6, currentRoundId: null }
        : {};
    const viewModel = createRoundConsoleViewModel(activeSnapshot({ status, confirmationAllowed, ...shape }));
    expect(viewModel.status.reasonCode === "ENTRADA_PENDIENTE").toBe(valid);
    expect(viewModel.confirmation.allowed).toBe(valid && status === "ready");
  });

  it("rejects inherited, hidden, symbol, extra, accessor, and unsupported-prototype fields", () => {
    const inherited = Object.assign(Object.create({ status: "waiting-input" }), activeSnapshot());
    delete inherited.status;
    const hidden = activeSnapshot();
    Object.defineProperty(hidden, "hidden", { value: true });
    const symbol = Object.assign(activeSnapshot(), { [Symbol("extra")]: true });
    const accessor = activeSnapshot();
    let getterCalls = 0;
    Object.defineProperty(accessor, "reasonCode", { enumerable: true, get: () => { getterCalls += 1; return "NO"; } });

    for (const value of [inherited, hidden, symbol, { ...activeSnapshot(), extra: true }, accessor, new (class { constructor() { Object.assign(this, activeSnapshot()); } })()]) {
      expect(createRoundConsoleViewModel(value).status.reasonCode).toBe("SNAPSHOT_INVALIDO");
    }
    expect(getterCalls).toBe(0);
  });

  it("captures proxy-backed data once without direct reads or native error leaks", () => {
    let directReads = 0;
    const descriptorReads = new Map<PropertyKey, number>();
    const changing = new Proxy(activeSnapshot({ status: "ready", confirmationAllowed: true }), {
      get() { directReads += 1; return directReads % 2 ? "ready" : "completed"; },
      getOwnPropertyDescriptor(target, key) {
        descriptorReads.set(key, (descriptorReads.get(key) ?? 0) + 1);
        return Reflect.getOwnPropertyDescriptor(target, key);
      },
    });
    const throwing = new Proxy({}, { ownKeys() { throw new Error("trap"); } });
    const revoked = Proxy.revocable(activeSnapshot(), {});
    revoked.revoke();

    expect(createRoundConsoleViewModel(changing).status.code).toBe("ready");
    expect(directReads).toBe(0);
    expect([...descriptorReads.values()]).toEqual([1, 1, 1, 1, 1, 1]);
    for (const hostile of [throwing, revoked.proxy]) {
      expect(() => createRoundConsoleViewModel(hostile)).not.toThrow();
      expect(createRoundConsoleViewModel(hostile).status.reasonCode).toBe("SNAPSHOT_INVALIDO");
    }
  });

  it("returns deterministic, deeply immutable view models", () => {
    const snapshot = activeSnapshot({ status: "ready", confirmationAllowed: true });
    const first = createRoundConsoleViewModel(snapshot);
    const second = createRoundConsoleViewModel({ ...snapshot });

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.status)).toBe(true);
    expect(Object.isFrozen(first.progress)).toBe(true);
    expect(Object.isFrozen(first.scenario)).toBe(true);
    expect(Object.isFrozen(first.confirmation)).toBe(true);
    expect(Object.isFrozen(first.notice)).toBe(true);
  });

  it.each([
    ["unavailable", "SNAPSHOT_INVALIDO", "blocking", "Entrada no disponible"],
    ["reset-required", "SESSION_RESET_REQUIRED", "blocking", "Reinicio requerido"],
    ["waiting-input", "DEVICE_DISCONNECTED", "attention", "Entrada desconectada"],
    ["waiting-input", "NEW_INPUT_REQUIRED", "attention", "Nueva entrada requerida"],
    ["waiting-input", "MALFORMED_JSON", "attention", "Entrada rechazada o pendiente"],
  ] as const)("maps %s/%s to a redundant visible notice", (
    status,
    reasonCode,
    level,
    title,
  ) => {
    const shape = status === "unavailable"
      ? { roundIndex: 0, roundCount: 0, currentRoundId: null }
      : {};
    const viewModel = createRoundConsoleViewModel(activeSnapshot({
      status,
      reasonCode,
      ...shape,
    }));

    expect(viewModel.notice).toMatchObject({ level, title });
  });

  it.each([
    activeSnapshot({ status: "ready", reasonCode: "SNAPSHOT_READY", confirmationAllowed: true }),
    activeSnapshot({
      status: "completed",
      reasonCode: "LIFECYCLE_COMPLETED",
      roundIndex: 6,
      currentRoundId: null,
    }),
  ])("does not show an alert when no action is required", (snapshot) => {
    expect(createRoundConsoleViewModel(snapshot).notice).toBeNull();
  });

  it("renders operational status without duplicating the round guide", () => {
    const target = { textContent: null, dataset: {} } as unknown as HTMLElement;
    const viewModel = createRoundConsoleViewModel(activeSnapshot({
      status: "ready",
      confirmationAllowed: true,
    }));

    renderRoundConsoleStatus(target, viewModel);

    expect(target.textContent).toContain("ronda 2 de 6");
    expect(target.textContent).not.toContain("Temperatura alta");
    expect(target.textContent).not.toContain("Pregunta guía:");
    expect(target.textContent).toContain("Motivo: ENTRADA_PENDIENTE");
    expect(target.textContent).toContain("Confirmación disponible: sí");
    expect(target.dataset.confirmationAvailable).toBe("true");
  });

  it("renders the provisional round guide in dedicated semantic targets", () => {
    const container = { hidden: true, dataset: {} } as unknown as HTMLElement;
    const title = { textContent: null } as unknown as HTMLElement;
    const question = { textContent: null } as unknown as HTMLElement;

    renderProvisionalRoundGuide(
      { container, title, question },
      createRoundConsoleViewModel(activeSnapshot()),
    );

    expect(container.hidden).toBe(false);
    expect(container.dataset.eventKey).toBe("high-temperature");
    expect(title.textContent).toBe("Temperatura alta");
    expect(question.textContent).toBe(
      "¿Cómo cambia la estrategia cuando el panel trabaja más caliente?",
    );
  });

  it("hides and clears the guide when no active round is available", () => {
    const container = {
      hidden: false,
      dataset: { eventKey: "stale" },
    } as unknown as HTMLElement;
    const title = { textContent: "stale" } as unknown as HTMLElement;
    const question = { textContent: "stale" } as unknown as HTMLElement;

    renderProvisionalRoundGuide(
      { container, title, question },
      createRoundConsoleViewModel(null),
    );

    expect(container.hidden).toBe(true);
    expect(container.dataset.eventKey).toBeUndefined();
    expect(title.textContent).toBe("");
    expect(question.textContent).toBe("");
  });

  it("renders and clears session notices without relying on color", () => {
    const container = {
      hidden: true,
      dataset: {},
    } as unknown as HTMLElement;
    const label = { textContent: null } as unknown as HTMLElement;
    const title = { textContent: null } as unknown as HTMLElement;
    const message = { textContent: null } as unknown as HTMLElement;
    const targets = { container, label, title, message };

    renderSessionNotice(
      targets,
      createRoundConsoleViewModel(activeSnapshot({ reasonCode: "MALFORMED_JSON" })),
    );
    expect(container.hidden).toBe(false);
    expect(container.dataset.level).toBe("attention");
    expect(label.textContent).toBe("Atención");
    expect(title.textContent).toBe("Entrada rechazada o pendiente");
    expect(message.textContent).toContain("antes de confirmar");

    renderSessionNotice(
      targets,
      createRoundConsoleViewModel(activeSnapshot({
        status: "ready",
        reasonCode: "SNAPSHOT_READY",
        confirmationAllowed: true,
      })),
    );
    expect(container.hidden).toBe(true);
    expect(container.dataset.level).toBeUndefined();
    expect(label.textContent).toBe("");
    expect(title.textContent).toBe("");
    expect(message.textContent).toBe("");
  });

  it("renders untrusted-looking bounded text literally through textContent", () => {
    const target = { textContent: null, dataset: {} } as unknown as HTMLElement;
    renderRoundConsoleStatus(target, createRoundConsoleViewModel(activeSnapshot({ reasonCode: "<img src=x>" })));
    expect(target.textContent).toContain("Motivo: <img src=x>.");
    expect((target as unknown as { innerHTML?: string }).innerHTML).toBeUndefined();
  });
});

describe("product layer constraints", () => {
  const sources = import.meta.glob("../src/**/*.{ts,mjs}", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;

  it("keeps application and mapper layers independent from presentation runtimes", () => {
    const nonPresentation = Object.entries(sources)
      .filter(([path]) => path.includes("/application/") || path.includes("/infrastructure/"))
      .map(([, source]) => source)
      .join("\n");
    const mapper = sources["../src/console/createRoundConsoleViewModel.ts"];

    expect(nonPresentation).not.toMatch(/phaser|document|window|HTMLElement|Canvas|from\s+["']node:|process\.|\bBuffer\b/i);
    expect(mapper).not.toMatch(/phaser/i);
  });

  it("does not import reference tools or excluded product behavior", () => {
    const allSources = Object.values(sources).join("\n");

    expect(allSources).not.toMatch(/from\s+["'][^"']*tools\//);
    const excludedBehavior = new RegExp([
      "serial",
      "Web" + "Socket",
      "XMLHttp" + "Request",
      "Event" + "Source",
      "send" + "Beacon",
      "import" + "Scripts",
      "fe" + "tch\\(",
      "localStorage",
      "Math\\.random",
      "resolveRound",
    ].join("|"));
    expect(allSources).not.toMatch(excludedBehavior);
  });
});

describe("simulated action focus", () => {
  const button = (disabled: boolean, name: string, calls: string[]): HTMLButtonElement => ({
    disabled,
    focus: () => calls.push(name),
  }) as unknown as HTMLButtonElement;

  it.each([
    [false, true, true, "load"],
    [true, false, true, "confirm"],
    [true, true, false, "reset"],
  ] as const)("focuses the single enabled next action", (
    loadDisabled,
    confirmDisabled,
    resetDisabled,
    expected,
  ) => {
    const calls: string[] = [];

    focusNextSimulatedAction({
      load: button(loadDisabled, "load", calls),
      confirm: button(confirmDisabled, "confirm", calls),
      reset: button(resetDisabled, "reset", calls),
    });

    expect(calls).toEqual([expected]);
  });

  it("uses confirmation, load, then reset as a deterministic priority", () => {
    const calls: string[] = [];

    focusNextSimulatedAction({
      load: button(false, "load", calls),
      confirm: button(false, "confirm", calls),
      reset: button(false, "reset", calls),
    });

    expect(calls).toEqual(["confirm"]);
  });

  it("does not move focus when every action is disabled", () => {
    const calls: string[] = [];

    focusNextSimulatedAction({
      load: button(true, "load", calls),
      confirm: button(true, "confirm", calls),
      reset: button(true, "reset", calls),
    });

    expect(calls).toEqual([]);
  });
});

describe("simulated action markup", () => {
  const html = import.meta.glob("../index.html", {
    eager: true,
    query: "?raw",
    import: "default",
  })["../index.html"] as string;

  it("groups native actions with an explicit legend and help relation", () => {
    expect(html).toMatch(
      /<fieldset[\s\S]*class="simulation-actions"[\s\S]*aria-describedby="simulation-actions-help"[\s\S]*>/,
    );
    expect(html).toContain("<legend>Acciones de la prueba simulada</legend>");
    expect(html).toContain('id="simulation-actions-help"');
  });

  it.each([
    "load-simulated-input",
    "confirm-simulated-round",
    "reset-simulated-session",
  ])("keeps %s as a native non-submit button", (id) => {
    expect(html).toMatch(new RegExp(`<button id="${id}" type="button"`));
  });
});

describe("skip navigation markup", () => {
  const html = import.meta.glob("../index.html", {
    eager: true,
    query: "?raw",
    import: "default",
  })["../index.html"] as string;

  it("places a descriptive skip link before the main landmark", () => {
    const skipIndex = html.indexOf(
      '<a class="skip-link" href="#main-content">Saltar al contenido principal</a>',
    );
    const mainIndex = html.indexOf('<main');

    expect(skipIndex).toBeGreaterThan(-1);
    expect(mainIndex).toBeGreaterThan(skipIndex);
  });

  it("provides a programmatically focusable main target", () => {
    expect(html).toMatch(
      /<main[\s\S]*id="main-content"[\s\S]*aria-labelledby="console-title"[\s\S]*tabindex="-1"/,
    );
  });
});
