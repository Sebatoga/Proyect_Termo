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

HOST-002 añadió `tools/host-adapter/` como referencia descartable de esa frontera:
consume JSON Lines dispositivo → host, reutiliza el schema del simulador y limpia
los seis valores ante invalidez, desconexión, error o dirección incorrecta. No es
el adaptador productivo ni decide transporte, timeout, reconexión o puerto serial.

## Contrato de resolución (esquema lógico, aún no implementado)
`resolveRound(state, validatedInputs, roundCard): RoundResult`
- **Entrada:** estado de instalaciones y batería, entradas físicas validadas, carta de ronda e intervalo simulado declarado.
- **Salida:** nuevo estado inmutable, telemetría con unidad en nombre/campo, eventos, consecuencias de tablero y balance energético.
- **No permite** llamadas directas a UI, DOM, Date.now, Math.random o lectura de datos globales ocultos.
- Mismo estado, entradas validadas, carta y versión de calibración produce el mismo resultado.
- Prevenir mutación de objetos de entrada; conservar `schemaVersion` para replay y exportación de resultados.

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
