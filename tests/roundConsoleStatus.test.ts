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
import { renderRoundConsoleStatus } from "../src/console/renderRoundConsoleStatus";

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
    const viewModel = createRoundConsoleViewModel(activeSnapshot({ roundIndex }));

    expect(viewModel.status.reasonCode).toBe("ENTRADA_PENDIENTE");
    expect(viewModel.progress.index).toBe(roundIndex);
    expect(viewModel.progress.count).toBe(EXPECTED_ROUND_COUNT);
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
