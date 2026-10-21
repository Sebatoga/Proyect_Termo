# Arquitectura de software y contratos v0.1

## Objetivo
Separar en capas: (1) motor físico SI determinista; (2) control / gestión de sistemas; (3) reglas de juego y escenarios; (4) renderizado; (5) UI/accesibilidad; (6) tests y evidencia. El motor físico no depende de Phaser ni del DOM.

## Propuesta de árbol a crear en F1
```
src/
  main.ts
  domain/
    units.ts                # tipos y funciones de conversión
    types.ts                # PhysicalState, PlayerActions, Scenario, TickResult
    physics/solar.ts        # balance térmico y PV
    physics/hydro.ts        # Q, H, potencia
    physics/wind.ts         # turbina eólica
    physics/battery.ts      # SOC y pérdidas
    physics/energyBus.ts    # balance y pérdidas
    controllers/dispatch.ts # BMS, prioridades, consignas
    scoring/scoring.ts      # KPI y puntuación independiente
    scenario/prng.ts        # PRNG sembrado
    scenario/weather.ts     # series y eventos
    sim/engine.ts           # step(state, action, scenario, dt)
  game/
    scenes/BootScene.ts
    scenes/MenuScene.ts
    scenes/TutorialScene.ts
    scenes/CityScene.ts
    scenes/ResultsScene.ts
    visuals/                # sprites, animación, layers
  ui/                       # HUD y accesibilidad
  assets/                    # activos locales con licencias
  data/                      # escenarios versionados
  app/                       # bootstrap, preferencias, guardado
 tests/
   unit/                     # físicos independientes
   integration/              # despachos y conservación
   e2e/                      # interacción navegador
```

## Contrato de tick (esquema lógico, aún no implementado)
`step(state: SimState, actions: PlayerActions, scenario: Scenario, dtSeconds: number): TickResult`
- **Entrada:** estado de instalaciones y batería, escenario y condiciones del tick, acciones del jugador validadas, `dtSeconds` no negativo.
- **Salida:** nuevo estado inmutable, telemetría con unidad en nombre/campo, registro de eventos, métricas parciales y balance energético.
- **No permite** llamadas directas a UI, DOM, Date.now, Math.random o lectura de datos globales ocultos.
- Si la simulación es determinista, mismo estado+acciones+escenario+semilla+tick produce mismos datos y score.
- Prevenir mutación de objetos de entrada; conservar `schemaVersion` para replay y exportación de resultados.

## Modelo de datos mínimo
- `Scenario`: id, versión, seed, horizonte_s, clima por tick (G_Wm2, Tair_C, wind_ms, river_m3s), demanda crítica y no crítica kW, límites ecológicos.
- `SimState`: tiempo_s, temperatura_panel_C, batería_kWh, contadores energía atendida, energía no atendida, energía vertida, último evento.
- `PlayerActions`: caudal_turbina_m3s, modo_bateria enum, política_prioridad enum, consigna de cargas no críticas (fracción 0–1).
- `TickResult`: `nextState`, `telemetry`, `events`, `conservationResidual_kW` (tolerancia definida).
- Config física por archivo de datos con unidad y fuente/estatus; validación runtime de rangos y no finitos.

## Diagrama conceptual
```
ESCENARIO CLIMÁTICO + SEMILLA ──> MODELOS FÍSICOS (PV / viento / hidro)
           │                                     │
           └────> DEMANDA CRÍTICA / NO CRÍTICA   │
                                                 v
ACCIONES JUGADOR ──> CONTROL / BMS / DESPACHO ──> BUS ENERGÉTICO
                            │                          │
                            └────> MÉTRICAS + SCORE <─┘
                                          │
                                EVENTOS + ESTADO
                                          │
                          PHASER (MAPA) + HTML HUD / AUDIO
```

## Dependencias y principios
- TypeScript strict, módulos pequeños y funciones puras para fórmulas.
- Phaser solo en `game/` y jamás en `domain/`.
- Validación en frontera de entrada; nunca asumir que los sliders garantizan validez.
- No usar network ni CDN en runtime del juego entregado; activos locales, fuentes de licencia registrada.
- Pruebas unitarias rápidas, integración determinista y E2E por flujo de jugador.
- Imágenes y audio con procedencia/licencia, no inventar permiso de uso.

## Rendimiento y portabilidad
- Objetivo provisional: 60 FPS escritorio, ~30 FPS portátil de gama baja; medido y revisado tras MVP.
- Motor físico discreto, render interpolado visualmente, sin un solver por cuadro visual.
- Exportación a `dist/` con recursos empaquetados; un servidor estático local o PWA offline verificada según requisitos de navegador. No afirmar que abrir `index.html` por `file://` sirve sin pruebas.

## Políticas de cambios
Cada interfaz pública versionada requiere test y ADR si cambia semántica/ecuaciones. No hacer migración masiva de stack sin aprobación. Contener la complejidad: preferir monorepo frontend simple, no microservicios ni API innecesaria.
