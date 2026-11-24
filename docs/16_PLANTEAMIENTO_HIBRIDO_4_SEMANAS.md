# EcoGrid — planteamiento híbrido para cuatro semanas

## Decisión central

EcoGrid será un **juego cooperativo de mesa con electrónica** para 2–4 jugadores. En seis rondas de 8–12 minutos, variables reales y controles físicos cambian consignas y resultados. Esta decisión, adoptada por el equipo el 2026-10-23, sustituye el objetivo digital de ADR-004 sin afirmar que existió permiso docente para aquel formato.

El flujo público provisional para preparar y ensayar una partida está en
[`docs/17_COMO_JUGAR.md`](17_COMO_JUGAR.md); sus reglas y umbrales continúan
sujetos a G1, ECO-002 y playtesting.

La planificación operativa de componentes, compatibilidad, ensamblaje,
calibración y pruebas está en
[`docs/18_MANUAL_HARDWARE.md`](18_MANUAL_HARDWARE.md). Es un manual provisional:
no demuestra disponibilidad, compra, montaje ni pruebas físicas.

## Problema y objetivo

Una ciudad debe sostener cargas críticas con recursos renovables variables sin vulnerar el caudal ecológico. El equipo jugador debe interpretar condiciones, acordar prioridades y operar el sistema energético. El objetivo educativo es hacer observables un balance térmico PV, la relación caudal–pérdidas–potencia de una hidro de pasada y el balance de batería/bus.

## Experiencia y flujo de ronda

1. Revelar una carta de demanda o evento y preparar sus fichas.
2. Leer el tablero, el proxy de luz calibrado para gameplay y la temperatura ambiente.
3. Acordar prioridad de cargas, consigna hidro y modo de batería.
4. Ajustar los controles físicos y pulsar confirmar.
5. Validar lecturas; una entrada inválida o desconectada no se usa silenciosamente.
6. Resolver modelos y reglas; actualizar fichas, LEDs y consola local.
7. Explicar qué cambió y continuar hasta completar seis rondas.

## Tablero y material físico

El tablero representa PV, río, central de pasada, batería/bus y cargas críticas/no críticas. Cartas o marcadores definen rondas; fichas representan energía, suministro y reserva. Las posiciones del tablero y los controles deben cambiar entradas o resultados: ningún elemento electrónico es meramente decorativo.

## Electrónica mínima

- Microcontrolador compatible, sin seleccionar todavía modelo exacto.
- Sensor de luz y sensor de temperatura.
- Potenciómetro o slider para consigna hidro.
- Selector de batería, botón confirmar y LEDs de feedback.
- Conexión USB de baja tensión y montaje protegido con carcasa y cableado fijo.

Componentes exactos, disponibilidad, tolerancias y presupuesto quedan pendientes de inventario. El MVP no usa agua real, bombas, calor peligroso ni batería de potencia.

## Causalidad y tratamiento de variables reales

| Entrada física | Transformación válida | Consecuencia de juego |
|---|---|---|
| Luz | calibración de gameplay + rango + estado | selecciona condición PV; no se llama irradiancia física |
| Temperatura | calibración y validación | modifica la eficiencia PV mediante el modelo térmico |
| Slider hidro | mapeo a consigna acotada | cambia caudal derivado, pérdidas, potencia y bypass |
| Selector batería | modo válido | cambia carga/descarga y reserva disponible |
| Prioridad de cargas | regla de despacho | determina qué fichas/cargas se atienden ante déficit |

Cada dato conserva rango, versión de calibración y estado válido, inválido o desconectado. La denominación obligatoria mientras no exista calibración metrológica es **proxy de luz calibrado para gameplay**.

## Modelos científicos del MVP

- **PV térmico:** balance concentrado de temperatura y reducción de rendimiento con temperatura; la luz de gameplay no se presenta como medición de `W/m²`.
- **Hidro de pasada:** caudal disponible después del caudal ecológico, pérdidas proporcionales a `Q²`, salto neto y potencia; nunca se inventa agua.
- **Batería y bus:** SOC, límites y pérdidas de carga/descarga, conservación del balance y prioridad de cargas.

Las ecuaciones y vectores de `docs/02_MODELOS_FISICOS.md` son candidatos
provisionales. ECO-002 permanece **BLOQUEADA**: se permite prototipar durante
desarrollo sin presentarlos como aceptados; la revisión y validación científica
final se ejecutará al completar el MVP y antes de la entrega (ADR-013).

## Arquitectura

```text
sensores/controles → firmware → protocolo USB serial → adaptador host
    → dominio TypeScript puro → reglas por rondas → consola/feedback
```

El firmware adquiere y rotula datos; el protocolo transporta mensajes; el adaptador valida esquema y conexión. El dominio científico no importa Phaser, serial, DOM, Canvas ni UI. La consola local es secundaria: muestra variables, alertas y causalidad, pero no reemplaza el tablero.

## Alcance

**Incluido:** tablero y fichas; seis rondas; PV térmico; hidro de pasada con caudal ecológico y pérdidas; batería/bus; prioridad de cargas; sensores y controles mínimos; feedback LED; consola local offline; calibración, estados de error y seguridad de baja tensión.

**Excluido del MVP:** eólica, mapa isométrico, campaña, móvil, audio, backend, score complejo, componentes ya seleccionados, compra de hardware y construcción en HYBRID-001.

## Criterios de éxito

- Una partida cooperativa completa dura 8–12 minutos y tiene seis rondas.
- Al menos luz, temperatura y controles físicos producen cambios causales observables.
- Entradas fuera de rango o desconectadas generan feedback seguro y reproducible.
- Los balances PV, hidro y batería/bus son trazables a ecuaciones, unidades, hipótesis y pruebas.
- El caudal ecológico condiciona físicamente la derivación; no es una etiqueta ni trivia.
- El montaje cumple baja tensión, carcasa y cableado fijo antes de probarse con público.

## Riesgos y decisiones pendientes

| Riesgo o decisión | Tratamiento / siguiente evidencia |
|---|---|
| Componentes no disponibles | inventario antes de elegir modelos exactos |
| Proxy confundido con irradiancia | rótulo obligatorio y protocolo de calibración |
| Lecturas ruidosas o desconexión | rangos, filtrado declarado, estados de error y prueba límite |
| Modelo científico provisional | permitir solo prototipos rotulados; ejecutar revisión independiente y gate final al completar el MVP, antes de aceptar o presentar resultados científicos |
| Electrónica decorativa | prueba causal entrada → modelo → tablero/resultado |
| Seguridad y acabado | revisión de carcasa, cableado y alimentación antes de feria |
| Presupuesto, roles, dimensiones y fechas | decisiones humanas pendientes; no inferirlas |

## Resumen de cuatro semanas

1. **Contrato y decisiones:** cerrar alcance híbrido, causalidad y criterios.
2. **Pruebas de riesgo:** calibración, protocolo, modelos y materiales mediante prototipos acotados.
3. **Integración:** unir tablero, electrónica, dominio y una partida completa.
4. **Cierre del MVP:** completar el producto; entonces ejecutar casos normal/límite/error, validación científica independiente, playtesting y aceptación integrada. Seguridad eléctrica sigue siendo previa a energizar/probar.

El desglose, responsables y gates pertenecen a **HYBRID-002**; este documento no los anticipa.

## Relación con ECO-101

El spike `spikes/runtime-smoke/` demuestra viabilidad técnica acotada de una consola local web: instalación, build, servicio local y canvas en el entorno probado. No es producto final, no ratifica el stack, no implementa tablero/electrónica/gameplay/ciencia y no desbloquea ECO-002. Puede descartarse o adaptarse después de decidir el host de la consola.
