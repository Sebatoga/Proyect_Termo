# Scorecard cooperativa de referencia v1

Referencia local, pura y sin dependencias para evaluar un ledger sintético de
rondas. No importa física, casos de ECO-002, hardware, transporte, UI ni reloj.
La implementación y sus pruebas están en `6aa9af2` y el guard de agregados en
`11d325d` (PR 1 lógico: 450 líneas, 2 paths). El validador del paquete vacío está
en `727c36b` (PR 3 lógico: 605 líneas, 2 paths). Las dos rebanadas tienen
`size:exception` explícitamente autorizada. ADR-011 adopta la estructura sin
pesos, no sus umbrales.

## Ruta rápida

```bash
node --test tools/game-scorecard/*.test.mjs
```

La API pública es `evaluateScorecard(mission, ledger)`. Devuelve un objeto
profundamente inmutable con `outcome`, tres métricas visibles y razones estables.
El input de dominio inválido o incompleto no lanza: produce `incomplete` y deja
las tres métricas en `null`.

`validatePlaytestPackage({ manifest, policies, record })`, exportada desde
`playtest-package.mjs`, valida objetos ya cargados sin acceder al filesystem. Un
paquete vacío correcto devuelve `valid: true` y `ready: false` con blockers; una
corrupción devuelve `valid: false` con reason codes deterministas. La API no
ejecuta sesiones ni completa datos.

El schema v1 es cerrado: aliases o campos desconocidos producen
`UNKNOWN_FIELD`. Mientras el paquete permanezca `NOT_RUN`, el validador exige
blockers exactos, resolutor `null`, IDs/acciones canónicos y ausencia de
participantes, resultados, thresholds y ambiente; `ready` queda siempre en
`false`.

## Contrato de entrada

```js
const mission = {
  schemaVersion: "scorecard-mission/v1",
  id: "mission-id",
  expectedRounds: 6,
  thresholds: { criticalCoverage: 0.8, totalCoverage: 0.7 },
};

const ledger = {
  schemaVersion: "scorecard-ledger/v1",
  rounds: [{
    id: "round-1",
    status: "resolved", // o "incomplete"
    demand: { critical: 4, total: 10 },
    service: { critical: 4, total: 8 },
    environment: { status: "compliant", verifiable: true },
  }],
};
```

Las cantidades son unidades sintéticas homogéneas y no kW/kWh inferidos. Deben
ser finitas y no negativas. Demanda crítica ≤ demanda total; servicio crítico ≤
servicio total; ningún servicio puede superar su demanda. Los umbrales son
fracciones `[0,1]`, inyectadas por misión y **provisionales** hasta playtesting
reproducible.

`environment.status` admite `compliant`, `player-noncompliant` y
`natural-unavailability`. La indisponibilidad natural verificable cuenta como
conforme porque no se atribuye al equipo; esta semántica sigue provisional. La
evidencia ambiental no verificable hace que la partida quede incompleta.

## Resultado y precedencia

1. Misión, ledger o ronda inválida/incompleta → `incomplete`, métricas `null`.
2. Ledger puntuable que incumple una dimensión → `defeat`.
3. Todas las rondas resueltas, ambas coberturas iguales o superiores a sus
   umbrales y ambiente verificable/conforme → `victory`.

Las coberturas se agregan por sumas: `sum(service) / sum(demand)`. No existe
score ponderado. Si un denominador es cero, su cobertura vale `1`; sin embargo,
demanda total agregada cero produce `defeat` con `NO_TOTAL_DEMAND`, regla
conservadora que impide una victoria sin obligación externa. Si la demanda total
es positiva y no se sirve, `NO_SERVICE` impide la victoria incluso si una misión
provisional configura umbrales de cobertura en cero.
Si cualquier suma agregada deja de ser finita, el resultado es `incomplete`, las
métricas quedan en `null` y se informa `AGGREGATE_QUANTITY_INVALID`.

## Límites y rollback

No es código productivo ni demuestra balance, validez científica o integración.
Tampoco consume ECO-002 ni acredita hardware. Los umbrales y la semántica de
`natural-unavailability` requieren playtesting reproducible y revisión ambiental.
El protocolo y paquete vacío están en `docs/20_PROTOCOLO_PLAYTEST_ECO_004.md` y
`evidencias/ECO-004/`. `synthetic-replay` sólo valida scorecard/sensibilidad;
`paper-facilitated`/`human-paper` sólo observa comprensión y decisiones con un
resolutor provisional explícito. Ninguno acredita física, hardware, balance final
ni producto.
Eliminar `tools/game-scorecard/` y sus enlaces documentales revierte esta
referencia; ninguna ruta productiva depende de ella.
