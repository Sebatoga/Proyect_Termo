# Scorecard cooperativa de referencia v1

Referencia local, pura y sin dependencias para evaluar un ledger sintético de
rondas. No importa física, casos de ECO-002, hardware, transporte, UI ni reloj.
La implementación y sus pruebas están en el commit `6aa9af2` (379 líneas, 2
paths). ADR-011 adopta la estructura multidimensional sin pesos, no sus umbrales.

## Ruta rápida

```bash
node --test tools/game-scorecard/*.test.mjs
```

La API pública es `evaluateScorecard(mission, ledger)`. Devuelve un objeto
profundamente inmutable con `outcome`, tres métricas visibles y razones estables.
El input de dominio inválido o incompleto no lanza: produce `incomplete` y deja
las tres métricas en `null`.

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
3. Todas las rondas resueltas, ambas coberturas sobre sus umbrales y ambiente
   verificable/conforme → `victory`.

Las coberturas se agregan por sumas: `sum(service) / sum(demand)`. No existe
score ponderado. Si un denominador es cero, su cobertura vale `1`; sin embargo,
demanda total agregada cero produce `defeat` con `NO_TOTAL_DEMAND`, regla
conservadora que impide una victoria sin obligación externa. Si la demanda total
es positiva y no se sirve, la cobertura total vale `0` y nunca hay victoria.

## Límites y rollback

No es código productivo ni demuestra balance, validez científica o integración.
Tampoco consume ECO-002 ni acredita hardware. Los umbrales y la semántica de
`natural-unavailability` requieren playtesting reproducible y revisión ambiental.
Eliminar `tools/game-scorecard/` y sus enlaces documentales revierte esta
referencia; ninguna ruta productiva depende de ella.
