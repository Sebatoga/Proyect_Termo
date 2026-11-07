# Arquitectura híbrida y contratos v0.2

## Objetivo
Separar adquisición física, transporte, adaptación, dominio científico, reglas por rondas y presentación. El flujo obligatorio es: sensores/controles → firmware → protocolo USB serial → adaptador host → dominio TypeScript puro → reglas por rondas → consola/feedback.

## Propuesta de árbol futuro (no implementada por HYBRID-001)
```
src/
  main.ts
  adapters/
    serial/                  # puerto, framing, reconexión y schema
  domain/
    units.ts                # tipos y funciones de conversión
    types.ts                # PhysicalState, PlayerActions, Scenario, TickResult
    physics/solar.ts        # balance térmico y PV
    physics/hydro.ts        # Q, H, potencia
    physics/battery.ts      # SOC y pérdidas
    physics/energyBus.ts    # balance y pérdidas
    controllers/dispatch.ts # BMS, prioridades, consignas
    scoring/scoring.ts      # KPI y puntuación independiente
    scenario/prng.ts        # PRNG sembrado
    scenario/weather.ts     # series y eventos
    sim/engine.ts           # step(state, action, scenario, dt)
    rounds/resolveRound.ts   # reglas de seis rondas
  console/                  # consola local secundaria y feedback
  data/                      # escenarios versionados
  app/                       # bootstrap, preferencias, guardado
 tests/
   unit/                     # físicos independientes
   integration/              # serial, dominio, conservación y rondas
```

El firmware se versionará fuera de `src/domain/`. El dominio no importa Phaser, serial, DOM, Canvas ni UI; recibe valores ya validados mediante puertos neutrales.

## Bootstrap productivo actual de la consola

ECO-101 implementa la entrada raíz de Vite y limita Phaser a presentación. `src/consoleSpec.ts` contiene metadata determinista, `createGameConfig.ts` construye la configuración tipada mediante bindings inyectados, `ConsoleBootstrapScene.ts` dibuja una única escena técnica y `main.ts` crea `Phaser.Game`. Este corte no crea `src/domain/`, no importa ECO-002 y no implementa física, serial, reglas ni gameplay.

BOOTSTRAP-004 añade un puerto de snapshot de sesión en `src/application/round-session/` y un mapper/presentador en `src/console/`. BOOTSTRAP-005 captura exactamente sus seis propiedades de datos propias y enumerables mediante descriptores, sin ejecutar accessors ni releer el objeto llamador. Sólo admite prototipo `Object.prototype` o nulo, IDs y razones de 1–64 unidades de código. BOOTSTRAP-006 fija en el puerto el contrato de producto de seis rondas: estado activo `roundCount=6` e índice 0–5, completado `6/6/null`, y bootstrap no disponible `0/0/null`. `ready` exige confirmación habilitada; los demás estados la exigen deshabilitada. Todo incumplimiento se degrada a `unavailable/SNAPSHOT_INVALIDO`; el view model queda profundamente inmutable y sólo el presentador `textContent` y `main.ts` tocan DOM.

HOST-002 añadió `tools/host-adapter/` como referencia descartable de esa frontera:
consume JSON Lines dispositivo → host, reutiliza el schema del simulador y limpia
los seis valores ante invalidez, desconexión, error o dirección incorrecta. No es
el adaptador productivo ni decide transporte, timeout, reconexión o puerto serial.

ECO-004 añadió `tools/game-scorecard/` como referencia separada y descartable de
las reglas futuras. Expone `evaluateScorecard(mission, ledger)`, no importa el
adaptador, física, datos de ECO-002, hardware ni UI, y sólo consume cantidades
sintéticas ya resueltas. No es la implementación productiva ni acredita balance.

BOOTSTRAP-007/ECO104-9 promueve el coordinador canónico, sin cambiar sus bytes,
a `src/application/round-session/roundLifecycle.mjs`; su declaración estricta
adyacente expone el contrato browser-neutral. Las pruebas y fixtures permanecen
en `tools/round-lifecycle/`, pero no existe una segunda implementación. No hay
wiring desde `main.ts` o consola ni física, puntuación, hardware o UI.

ECO104-6 añade `tools/round-host-integration/` como evidencia de composición:
los mensajes pasan sólo por el adaptador y el snapshot actual llega al ciclo
únicamente mediante confirmación explícita. Una desconexión exige una nueva
instancia y no reutiliza el ciclo anterior. No es una ruta de producto.

## Contrato de resolución (esquema lógico, aún no implementado)
`resolveRound(state, validatedInputs, roundCard): RoundResult`
- **Entrada:** estado de instalaciones y batería, entradas físicas validadas, carta de ronda e intervalo simulado declarado.
- **Salida:** nuevo estado inmutable, telemetría con unidad en nombre/campo, eventos, consecuencias de tablero y balance energético.
- **No permite** llamadas directas a UI, DOM, Date.now, Math.random o lectura de datos globales ocultos.
- Mismo estado, entradas validadas, carta y versión de calibración produce el mismo resultado.
- Prevenir mutación de objetos de entrada; conservar `schemaVersion` para replay y exportación de resultados.

## Contrato de scorecard v1 (referencia implementada)

`evaluateScorecard(mission, ledger): ScorecardResult`

- `mission` usa `scorecard-mission/v1`, ID, cantidad positiva de rondas y
  umbrales provisionales `criticalCoverage`/`totalCoverage` en `[0,1]`.
- `ledger` usa `scorecard-ledger/v1`; cada ID de ronda es único y cada ronda se
  declara `resolved` o `incomplete`. Las cantidades finitas no negativas cumplen
  demanda crítica ≤ total, servicio crítico ≤ total y servicio ≤ demanda.
- La cobertura se calcula por sumas agregadas, nunca por promedio de porcentajes
  de ronda ni score ponderado. Denominador cero da cobertura `1`, pero demanda
  total agregada cero produce derrota conservadora `NO_TOTAL_DEMAND`.
- Primero se valida: cualquier dato inválido, ronda incompleta o evidencia
  ambiental no verificable produce `incomplete`, métricas `null` y razones. Sólo
  un ledger puntuable puede producir `defeat` o `victory`.
- Victoria requiere todas las rondas esperadas resueltas, ambas coberturas sobre
  sus umbrales y estado ambiental verificable/conforme. `natural-unavailability`
  verificable no se atribuye al jugador; la semántica sigue provisional.
- El resultado `scorecard-result/v1` es profundamente inmutable y contiene
  `outcome`, métricas visibles y reason codes estables. No usa reloj,
  aleatoriedad, estado global ni mutación de entradas.
- La referencia ejecutable corresponde al commit `6aa9af2`; permanece aislada
  de ECO-002 y no se integra todavía con resolución de rondas ni producto.

## Modelo de datos mínimo
- `ValidatedInputs`: proxy de luz para gameplay, temperatura, consigna hidro, modo batería, prioridad de cargas, estado y versión de calibración.
- `Scenario`: id, versión, seis cartas/rondas, demanda crítica/no crítica, caudal disponible y límite ecológico.
- `SimState`: tiempo_s, temperatura_panel_C, batería_kWh, contadores energía atendida, energía no atendida, energía vertida, último evento.
- `PlayerActions`: caudal_turbina_m3s, modo_bateria enum, política_prioridad enum, consigna de cargas no críticas (fracción 0–1).
- `RoundResult`: `nextState`, `telemetry`, `events`, `boardEffects`, `conservationResidual_kW` (tolerancia definida).
- Config física por archivo de datos con unidad y fuente/estatus; validación runtime de rangos y no finitos.

## Diagrama conceptual
```
SENSORES + CONTROLES → FIRMWARE → USB SERIAL → ADAPTADOR HOST
                                                    ↓
TABLERO + CARTA ← FEEDBACK/CONSOLA ← REGLAS ← DOMINIO TS PURO
```

## Dependencias y principios
- TypeScript strict, módulos pequeños y funciones puras para fórmulas.
- Serial, Phaser y cualquier UI permanecen fuera de `domain/`.
- Validación en frontera de entrada; nunca asumir que los sliders garantizan validez.
- Cada lectura lleva unidad o condición adimensional declarada, rango, calibración y estado; desconexión e invalidez bloquean la confirmación o activan un fallback explícito y visible.
- No usar network ni CDN en runtime del juego entregado; activos locales, fuentes de licencia registrada.
- Pruebas unitarias rápidas, integración determinista y E2E por flujo de jugador.
- Imágenes y audio con procedencia/licencia, no inventar permiso de uso.

## Despliegue y seguridad
- Consola y firmware operan localmente sin backend ni dependencia de Internet durante la partida.
- USB de baja tensión, carcasa, cableado fijo y montaje protegido. El MVP excluye agua real, bombas, calor peligroso y batería de potencia.
- Modelos exactos de microcontrolador, sensores y montaje quedan pendientes de inventario, compatibilidad y presupuesto.

## Políticas de cambios
Cada interfaz pública versionada requiere test y ADR si cambia semántica/ecuaciones. No hacer migración masiva de stack sin aprobación. Contener la complejidad: preferir monorepo frontend simple, no microservicios ni API innecesaria.
