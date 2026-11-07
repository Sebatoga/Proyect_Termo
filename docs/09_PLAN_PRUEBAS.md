# Protocolo de validación científica, electrónica y jugabilidad híbrida

## Escalera de evidencia
1. **Referencia independiente:** cálculo manual/hoja de cálculo o fuente fiable, con unidades y supuestos.
2. **Banco:** sensores y controles con calibración, ruido, rangos, extremos y desconexión.
3. **Firmware/protocolo:** tramas USB serial correctas, corruptas, incompletas y con timeout.
4. **Unitarias/integración:** PV térmico, hidro, batería/bus, seis rondas y conservación.
5. **HIL/E2E:** luz y temperatura reales, controles físicos, LEDs, tablero y consola durante una partida completa.
6. **Personas/feria:** 3–5 visitantes, seguridad, operación offline, contingencia y registro de defectos.

Los registros futuros de recepción, compatibilidad y banco usan las
[plantillas ECO-108](../evidencias/ECO-108/README.md). Sus estados permitidos son
`NOT_RUN`, `PASS`, `FAIL` y `BLOCKED`; comienzan en `NOT_RUN`, y una celda vacía
no acredita aprobación.

## Matriz de pruebas propuestas
| Caso | Entradas | Esperado | Etapa |
|---|---|---|---|
| T-SOL-01 | G1000,A100,η.20,T25,β.004 | P20kW | F0/F1 |
| T-SOL-02 | mismas pero T35 | P19.2kW | F0/F1 |
| T-SOL-03 | proxy de luz mínimo/temperatura extrema válida | salida acotada; no se etiqueta como irradiancia | F1 |
| T-HYD-01 | Qriver4,Qeco1,Qreq2,Hgross20,K.1,η.8 | Qturb2,Qbypass2,Hnet19.6,P307.6416kW | F0/F1 |
| T-HYD-02 | Qriver0.5,Qeco1,Qreq2 | Qturb0,Qbypass0.5, sin penalización humana | F1 |
| T-BAT-01 | P_in120,ηch.95,dt60s | delta E +1.9kWh | F0/F1 |
| T-BAT-02 | P_out120,ηdis.90,dt60s | delta E -2.22222...kWh | F0/F1 |
| T-BAT-03 | SOC0/SOCmax | no negativo/no sobrepasar límite | F1 |
| T-BUS-01 | varios generadores/consumos | residual potencia dentro tolerancia | F1 |
| T-DET-01 | igual seed y acciones | mismo historial/score | F1 |
| T-SEN-01 | luz/temperatura en puntos de calibración | error y rango esperado vs obtenido registrados | S1/S2 |
| T-SEN-02 | señal estable y luego ruidosa | dispersión/filtrado medidos, sin ocultar incertidumbre | S1/S2 |
| T-SEN-03 | fuera de rango y desconectado | inválido explícito; no reutiliza dato silenciosamente | S2 |
| T-CTL-01 | slider y selector en extremos | mapeo acotado, sin consigna imposible | S1/S2 |
| T-SER-01 | mensaje USB serial válido | esquema, versión, unidades y estado aceptados | S2 |
| T-SER-02 | corrupto/incompleto/timeout | rechazo seguro, error visible y recuperación definida | S2 |
| T-HIL-01 | variar luz y temperatura en hardware | cambio causal en PV, tablero/consola y registro | S4 |
| T-E2E-01 | seis rondas con controles físicos | partida reproducible completa en 8–12 minutos | S4 |
| T-SAFE-01 | inspección energizada/desenergizada | baja tensión, carcasa, cableado y alivio conformes | S4 |
| T-OFF-01 | red desconectada | consola y partida operan con recursos locales | S4 |
| T-SCO-01 | ledger completo, coberturas sobre umbrales y ambiente conforme verificable | `victory`; tres dimensiones visibles, sin score ponderado | F0 |
| T-SCO-02 | demanda positiva, servicio total cero | `defeat`; falla cobertura crítica y total | F0 |
| T-SCO-03 | se sirven sólo cargas críticas | `defeat` si cobertura total queda bajo umbral | F0 |
| T-SCO-04 | incumplimiento ambiental atribuible y verificable | `defeat` aunque pasen ambas coberturas | F0 |
| T-SCO-05 | indisponibilidad natural verificable | no se atribuye al jugador; semántica provisional | F0 |
| T-SCO-06 | ambiente no verificable, ronda incompleta o conteo/ID inválido | `incomplete`; métricas `null` y reason code estable | F0 |
| T-SCO-07 | demanda total agregada cero | coberturas `1`, pero `defeat` con `NO_TOTAL_DEMAND` | F0 |
| T-SCO-08 | negativo/no finito, overflow agregado o relaciones demanda-servicio inválidas | `incomplete`, métricas `null`; overflow → `AGGREGATE_QUANTITY_INVALID` | F0 |
| T-SCO-09 | mismo input repetido y congelado | salida profundamente igual e inmutable; input intacto | F0 |
| T-RND-01 | manifiesto v1 cerrado de seis rondas + seis confirmaciones válidas | seis resoluciones únicas, historial inmutable y terminación explícita | F1 |
| T-RND-02 | snapshot inválido/desconectado/nulo/hostil, `confirm:false`, reentrada o secuencia no creciente | razón estable; misma ronda, sin resolución duplicada, historial ni reutilización silenciosa | F1 |
| T-RND-03 | mismo manifiesto, seed, resolutor sintético y secuencia | estados e historiales profundamente iguales | F1 |
| T-RND-04 | stream dispositivo→host, tokens y corte de sesión | sólo confirmación explícita resuelve; invalidez y reset no reutilizan valores/ciclo | F1 |

### Bootstrap de consola ECO-101

Vitest cubre metadata determinista y la fábrica pura de `GameConfig` sin requerir DOM ni navegador. TypeScript valida la configuración productiva y Vite genera el bundle local. El smoke productivo inicia Vite en `127.0.0.1:4173` con `--strictPort` y observa por CDP shell/canvas. El smoke offline reconstruye, sirve sólo `dist/` en loopback, inventaría solicitudes, bloquea referencias externas, verifica errores y conserva shell/canvas durante 1.000 ms tras apagar el servidor. Regresiones separadas cubren traversal codificado y puerto impostor. No prueba `file://`, refresh sin servidor, PWA, otros navegadores, interacción, accesibilidad asistida ni rendimiento prolongado.

BOOTSTRAP-004 agrega casos Vitest para los cinco estados de sesión, límites e invariantes inválidos, confirmación fail-closed, determinismo, inmutabilidad profunda, semántica textual y restricciones de importación. Los smokes existentes preservan shell y canvas; esta cobertura no ejecuta transiciones, protocolo, hardware, ciencia ni gameplay.
BOOTSTRAP-005 amplía esa matriz con getters no invocados, proxies cambiantes/throwing/revocados, campos heredados/ocultos/símbolo/extra, prototipos no admitidos, strings mayores a 64, `NaN`/infinito/enteros inseguros, todas las combinaciones estado-confirmación, ausencia de errores nativos, texto hostil literal e inmutabilidad determinista. El smoke de navegador exige además los marcadores iniciales de sesión no disponible y confirmación deshabilitada.
BOOTSTRAP-006 fija el conteo de producto en seis y cubre conteos 5, 7 y `Number.MAX_SAFE_INTEGER`, índices activos límite 0/5 y rechazos en −1/6, además de terminación exclusiva `6/6/null` y bootstrap explícito `0/0/null`.

### Harness local previo al hardware

HOST-001 separa las capturas deterministas del simulador: dispositivo → host usa
`emit-device nominal|disconnected` y los fixtures `v1-device-*.jsonl`; host →
dispositivo usa `emit-host nominal` y `v1-host-output-nominal.jsonl`. La suite
conjunta del simulador y HOST-002 cubre bytes, tipos por dirección, seis valores
válidos, `hello` sin entradas, desconexión, error de dispositivo, schema, versión,
secuencia y `DIRECTION_INVALID`. La CLI del adaptador produce snapshots idénticos
entre ejecuciones. Esto no ejecuta USB serial, firmware, timeout ni HIL.
HOST-003 conserva esas pruebas Node y añade Vitest para importar el parser `.mjs`
mediante su declaración estricta, validar un mensaje nominal y observar errores
de parseo y secuencia sin depender de escenarios del simulador.

La referencia ECO-004 en `tools/game-scorecard/` se ejecuta con `node:test` y
usa únicamente misiones y ledgers sintéticos versionados. Sus pruebas cubren
anti-trampa, validación, precedencia `incomplete`, denominador cero, determinismo
e inmutabilidad. No ejecutan modelos físicos, casos de ECO-002, UI ni producto y
no demuestran balance o validez científica.

El lifecycle canónico de ECO-104 en `src/application/round-session/` conserva
sus pruebas `node:test` y fixture en `tools/round-lifecycle/`. Usa un manifiesto
sintético y snapshots normalizados sin importar el adaptador. Prueba
validación cerrada, retry seguro, confirmación única, replay, terminación,
determinismo e inmutabilidad; no prueba gameplay, duración, solvencia, física,
hardware, balance ni integración de producto.
La corrección ECO104-4 agrega captura por descriptores sin ejecutar accessors,
límites iterativos de profundidad/nodos/entradas, guardia de reentrada y secuencia
estrictamente creciente; una nueva instancia representa una nueva sesión y no se
inventa protocolo de epochs.
ECO104-5 extiende la guardia a toda la transacción desde antes de reflejar el
snapshot, exige opciones de construcción cerradas capturadas sin getters y
comprueba el límite agregado de claves antes de solicitar descriptores individuales.
ECO104-6 compone ambas referencias en `tools/round-host-integration/`: ingreso
ordinario nunca avanza, los errores del adaptador bloquean valores obsoletos y
la desconexión devuelve `SESSION_RESET_REQUIRED` hasta crear otra instancia.
ECO104-7 prueba una guardia síncrona común para ingreso, confirmación y
desconexión: coerción hostil y callbacks/proxies del resolutor no pueden reentrar,
el reset bloquea antes del adaptador y la guardia se limpia en todas las salidas.
ECO104-8 fija seis claves semánticas provisionales en el orden documentado y
prueba orden exacto, unicidad, replay determinista y recepción secuencial por el
resolutor, conservando la semilla aportada por quien llama.
BOOTSTRAP-007/ECO104-9 añade una prueba Vitest de importación `.mjs` tipada,
construcción determinista y una confirmación; los scans de aplicación y red
incluyen ahora el módulo `.mjs` sin añadir wiring de producto.

Evidencia local final tras `727c36b` el 2026-11-03: scorecard y paquete ejecutaron
67/67 pruebas PASS y la suite conjunta con simulador/adaptador ejecutó 94/94
PASS, incluidos agregados no finitos y el paquete `NOT_RUN` fail-closed. Los tres
JSON devolvieron `PARSE_OK` y `git diff --check` pasó. La auditoría independiente
final no pudo ejecutarse por límite de uso del proveedor y no se declara PASS.
Es cobertura técnica, no playtesting ni revisión ambiental; por tanto no cierra
el criterio de balance de ECO-004.

### Preparación de playtest ECO-004

El [protocolo autoritativo](20_PROTOCOLO_PLAYTEST_ECO_004.md) y el
[paquete vacío](../evidencias/ECO-004/README.md) separan dos evidencias:
`synthetic-replay` valida la scorecard y sensibilidad sobre ledgers declarados;
`paper-facilitated`/`human-paper` observa comprensión y decisiones con un
resolutor provisional explícito. Ninguna acredita física, hardware, balance final
ni producto. La validación estructural no equivale a ejecutar una sesión.

El manifest preregistra seis rondas, cinco políticas, dos repeticiones y orden
registrado/reverso. Resolver y candidatos de threshold permanecen vacíos y
bloquean ejecución. Toda sesión futura debe registrar expected/obtained, versión,
evidencia e inclusión sin inventar personas ni completar retrospectivamente.
El schema v1 cerrado rechaza aliases/campos desconocidos con `UNKNOWN_FIELD`; el
fixture usa `rep-1`/`rep-2` y los tests no normalizan esos IDs.

## Reglas de tolerancia
- Resultados algebraicos: `max(1e-9, 1e-10 * abs(valor_esperado))` en unidades de la magnitud, salvo justificación; la necesidad de un criterio relativo/absoluto por variable se revisará.
- Integración temporal por Euler: validar convergencia variando dt y comportamiento físico; no exigir coincidencia exacta con ecuación analítica a dt finito.
- Balance de bus: propuesta `abs(residual_kW)<=max(1e-6,1e-8*max(1,demanda_kW))`.
- Balance de energía acumulada: usar dt en h y pérdidas declaradas, no comparar kW con kWh.

## Pruebas de aceptación de modelo
- Capturar por cada fenómeno: ecuación, valores de entrada, salida prevista, salida del sistema, error absoluto y relativo, unidades y revisión.
- Para pruebas visuales no reemplazar captura real por ilustración generada.
- Cambios de fórmulas sin tests/regresión actualizados impiden cerrar tarea.
- Casos límite: PV sin luz útil y temperatura extrema válida; hidro con `Qriver<Qeco`, consigna cero/máxima y salto neto no positivo; batería en SOC mínimo/máximo y balance con pérdidas.
- Cada banco, HIL y E2E registra versión de firmware/calibración, montaje, entradas, **esperado/obtenido**, tolerancia, comando o procedimiento, evidencia, responsable, fecha/hora y estado. Una expectativa sin observación no es prueba.

## Prueba de jugabilidad
Para cada sesión: edad aproximada voluntaria si acepta, experiencia en juegos, objetivo entendido, tiempo primer input, fallos del UI, emociones/aburrimiento/confusión, comentarios textuales anónimos. No inferir evaluación de 3 usuarios de un solo ensayo.
