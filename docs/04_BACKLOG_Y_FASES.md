# Backlog ejecutable — EcoGrid

**Estados permitidos:** PENDIENTE · EN CURSO · BLOQUEADA · EN REVISIÓN · HECHA (con evidencia). No marcar HECHA sin prueba y verificación de aceptación.

## F0 — Definición, acuerdo y contrato científico
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-001 | Auditar entorno/repo/OpenCode, fuente académica | informe entorno, versiones y pendientes | HECHA — rama `blocked`, evidencia `20261021T031528Z` |
| ECO-002 | Revisar hipótesis, unidades y bibliografía de modelos | fórmulas con referencia, ejemplos y límites aprobables | BLOQUEADA — gate `ECO-002-GATE-20261022-03`; faltan revisiones humanas identificadas |
| ECO-003 | Prototipo en TS puro de tick y pruebas de conservación | harness mínimo TS+Vitest y vectores independientes (si precisa, iniciar ECO-101 antes) | PENDIENTE |
| ECO-004 | Definir medidas ambientales y score anti-trampa | métrica no trivial, balanceada, testeable | EN REVISIÓN — referencia y contrato testeados; “balanceada” requiere playtesting reproducible y revisión ambiental |
| ECO-005 | Corregir el alcance a sistema híbrido Liga 4 | ADR-010 y contrato trazables, sin atribuir permiso docente | HECHA — corrección documental 2026-10-23 |
| ECO-006 | Cerrar requisitos para pitch de hasta 7 min | storyboard, principios, diagrama y reporte IA | EN REVISIÓN — PDF y guion generados; falta ensayo y revisión humana |

## F1 — Rebanada vertical jugable
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-101 | Evaluar consola local web y establecer bootstrap productivo | stack ratificado, app raíz tipada y checks reproducibles; operación offline local verificada | EN CURSO — loop local simulado y explícito visible; sin gameplay, ciencia, serial ni integración física |
| ECO-102 | Modelos mínimos PV térmico + hidro de pasada en SI | tests de fórmulas, calor, caudal ecológico y límites | PENDIENTE |
| ECO-103 | Bus eléctrico, batería y control prioridades | balance por tick y SOC límites, pruebas | PENDIENTE |
| ECO-104 | Secuencia sembrada de seis rondas con eventos mínimos | reproducible y sin eventos imposibles de superar | PENDIENTE — lifecycle, composición y manifiesto provisional canónicos; sin efectos, solvencia, balance o wiring de producto |
| ECO-105 | Consola local secundaria: variables, alertas y causalidad | loop legible sin mapa ni arte final | PENDIENTE |
| ECO-106 | Puntuación, derrota, victoria y resultados explicables | 5 escenarios prueba con resultados comprensibles | PENDIENTE |
| ECO-107 | Prueba E2E/HIL y jugabilidad híbrida | seis rondas sin pérdida silenciosa de entradas | PENDIENTE |
| ECO-108 | Inventario/BOM y spike de banco | componentes, costos, datasheets y sensor/control→USB registrados | EN CURSO — inventario físico reportado, incluida `Nano ESP32-C6 V1.0`/`V1711` y sonda DS18B20 de 2 m; inspección, documentación aplicable, pinout, USB y banco pendientes |
| ECO-109 | Firmware, calibración y protocolo USB serial | mensajes versionados; rangos, error y timeout reproducibles | EN CURSO — núcleo C++17 host-testable emite `hello` y estado seguro `disconnected`; sin Arduino, GPIO, USB, sensores ni calibración |
| ECO-110 | Tablero, controles, LEDs y carcasa | montaje protegido y causal, con cableado fijo y seguridad | PENDIENTE — prototipo A4 recorrió 6 rondas con 2 participantes según reporte; sin tiempo, balance, hardware o seguridad física |

ECO105-1 añade observabilidad técnica del input simulado aceptado y seis trazas
canónicas sin efectos. ECO105-2 permite reiniciar sólo esa prueba después de seis
rondas y reproducirla sin recargar ni recrear Phaser. ECO105-3 permite comprobar
rechazo `MALFORMED_JSON` y recuperación sólo con un mensaje simulado local fijo.
ECO105-4 muestra título y pregunta guía para cada ronda canónica y falla cerrado
si índice e identificador no coinciden; la revisión humana fue omitida por
instrucción del usuario y permanece pendiente. El smoke de navegador exige las
seis guías exactas, ordenadas y reproducidas después del reset.
ECO105-5 separa título y pregunta en un panel semántico propio, conserva el
estado operativo en su región viva y oculta la guía cuando no hay ronda activa.
ECO105-6 añade avisos textuales redundantes para desconexión, entrada rechazada,
nueva entrada y reinicio, ocultándolos en estados listo/completado.
ECO-105 continúa
**PENDIENTE**: faltan alertas causales de gameplay e integración física.

## F2 — Calidad de experiencia e integración
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-201 | Señalización del tablero y feedback accesible | texto/icono/LED, no solo color | PENDIENTE |
| ECO-202 | Tutorial no técnico y modo información avanzada | jugador nuevo aprende en ≤90 s en prueba | PENDIENTE |
| ECO-203 | Afinar demanda, dificultad y clima | curvas jugables, documentado y comprobable | PENDIENTE |
| ECO-204 | Accesibilidad y legibilidad de tablero/consola | pruebas a distancia y con teclado donde aplique | PENDIENTE — foco, grupo semántico, 7 contrastes y reflow 390/320 px verificados; faltan pruebas humanas, asistivas y a distancia |
| ECO-205 | Sensibilidad de parámetros y validación independiente | tablas/gráficas de error y límites | PENDIENTE |

## F3 — Pitch, feria y cierre
| ID | Tarea | Criterio de salida | Estado |
|---|---|---|---|
| ECO-301 | Pitch de máximo siete minutos | 5 elementos documento profesor evidenciados | EN REVISIÓN — 7 diapositivas y guion 6:30–6:50; falta ensayo humano |
| ECO-302 | Manual, pruebas límite, repositorio y trazabilidad IA | auditable por jurados | PENDIENTE |
| ECO-303 | Póster científico/técnico y guion de demostración | unidades, hipótesis, fórmulas, resultados y validación | PENDIENTE |
| ECO-304 | Ensayo offline de stand y contingencia híbrida | equipo objetivo, repuestos y modo seguro documentados | PENDIENTE |
| ECO-305 | Auditoría final contra matriz de requisitos y gate docente | todas las obligaciones evidenciadas o brechas declaradas | PENDIENTE |

ECO304-1 aporta el servidor loopback estricto compartido y su preflight; ECO304-2
reutiliza esa ruta en la evidencia offline y documenta la operación. ECO-304
permanece **PENDIENTE** hasta ejecutar el recorrido humano en el equipo objetivo.

## Reglas de secuenciación
1. Resolver F0 científico antes de balancear gameplay, pero se permite crear prototipos aislados para explorar.
2. F1 solo se da por terminada cuando hay partida jugable de principio a fin.
3. F2 no puede degradar conservación, accesibilidad o trazabilidad científica.
4. F3 requiere evidencia real; no «screenshots imaginarios» ni pruebas declaradas sin ejecutar.
5. Antes de cada hito: revisión de alcance, evaluación de riesgos, respaldo/commit, test suite y relevo.

## Rebaseline ejecutable de cuatro semanas

> **Sustituido operativamente el 2026-11-18:** el usuario fijó una ventana de dos
> semanas. El plan vigente es
> [`docs/20_PLAN_MVP_14_DIAS.md`](20_PLAN_MVP_14_DIAS.md). La tabla histórica de
> cuatro semanas se conserva como referencia de procedencia.

| Semana | Trabajo principal | Gate observable y evidencia mínima |
|---|---|---|
| 1 | contrato; ECO-108 inventario/BOM y banco; alcance PV+hidro+batería | **G1:** disponibilidad/costo/datasheets y registro sensor o control→USB; decisión humana de componentes, presupuesto, roles y fechas |
| 2 | consola productiva mínima; ECO-109 firmware/protocolo; modelos mínimos | **G2:** USB serial correcto/corrupto/incompleto/timeout, calibración versionada y pruebas con esperado/obtenido; ECO-002 sigue bloqueada |
| 3 | ECO-110 tablero protegido y loop de seis rondas | **G3:** entrada física cambia modelo, LEDs, fichas y consola; partida reproducible de 8–12 minutos sin campaña |
| 4 | HIL/E2E, seguridad, playtesting y entrega | **G4:** HIL luz/temperatura, partida completa, carcasa/cableado, prueba con usuarios y paquete académico trazable |

Cada gate requiere responsable, fecha, esperado/obtenido y evidencia real. HYBRID-002 ordena el trabajo; no demuestra componentes, montaje, firmware, calibración, HIL ni producto.

## Evidencia de cierre ECO-001

La ejecución `evidencias/ECO-001/20261021T031528Z/` cerró la auditoría mediante la rama permitida `blocked`: no hubo fuente original autorizada para recuperar `.opencode/`. En ese momento no cambió ECO-002, ECO-003, ECO-005, ECO-101 ni F1. Posteriormente ADR-010 cerró ECO-005 por corrección de alcance híbrido, no por permiso docente.

## Estado bloqueado ECO-002

El gate `ECO-002-GATE-20261022-03` conserva el resultado `blocked_with_traceability`: existen inventario, dimensiones, fronteras, fuentes públicas acotadas y cuatro cuadernos documentales, pero no revisores humanos identificados, evidencia de competencia, reproducciones independientes ni revisiones física, de control, ambiental y de calidad. No existe línea base congelada para ECO-003.

## Evidencia parcial ECO-004

El commit `6aa9af2` implementó la referencia pura y sus pruebas. La scorecard
multidimensional sin pesos está documentada y testeada, pero ECO-004 permanece
**EN REVISIÓN**: sus umbrales y la indisponibilidad natural son provisionales, y
el criterio “balanceada” todavía exige playtesting reproducible y revisión
ambiental. Esta evidencia no consume ECO-002 ni modifica ECO-108/G1 o ECO-109.
ECO004-5 y ECO004-7 están completadas; ECO004-6 es parcial por resolutor y
candidatos aún vacíos; ECO004-8/9/10 siguen pendientes o bloqueadas por ejecución
humana y revisión ambiental. El paquete real continúa `NOT_RUN` y fail-closed.

## Evidencia exploratoria para ECO-101

El spike descartable verificó compatibilidad y permitió adoptar ADR-005 el 2026-11-04. El bootstrap productivo raíz añade shell accesible, escena mínima, configuración tipada y un estado de sesión visible mediante puerto, mapper fail-closed y presentador, sin consumir ECO-002. Chrome headless observó el shell/canvas desde una build limpia servida sólo desde `dist/`: no intentó HTTP(S) externo y permaneció visible durante un intervalo acotado tras apagar el servidor. ECO-101 queda **EN CURSO** porque aún falta comportamiento de producto e integración híbrida; ECO-002 sigue **BLOQUEADA** y ECO-003 **PENDIENTE**.

## Límites temporales del documento original
- Pitch: fecha **sugerida** segunda semana de noviembre, **no confirmada** por profesor.
- Feria final: fecha **sugerida** primera semana de diciembre, **no confirmada**.
- Mantener calendario concreto pendiente hasta confirmar en clase.
