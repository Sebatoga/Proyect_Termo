# Plan de verificación durante desarrollo y validación al cierre del MVP

**Calendario (ADR-013):** la validación científica independiente y la aceptación
integrada se realizarán cuando el MVP esté completo y antes de la entrega
académica. Las matrices siguientes son planes, no resultados. Checks automatizados
pueden ejecutarse durante desarrollo como regresiones, sin llamarlos validación
científica. Seguridad, calibración de entrada y límites de runtime deben
satisfacerse antes de energizar hardware o introducir datos físicos.

## Secuencia del gate final
1. **Referencia independiente:** cálculo manual/hoja de cálculo o fuente fiable, con unidades y supuestos.
2. **Banco:** sensores y controles con calibración, ruido, rangos, extremos y desconexión.
3. **Firmware/protocolo:** tramas USB serial correctas, corruptas, incompletas y con timeout.
4. **Unitarias/integración:** PV térmico, hidro, batería/bus, seis rondas y conservación.
5. **HIL/E2E:** luz y temperatura reales, controles físicos, LEDs, tablero y consola durante una partida completa.
6. **Personas/feria:** 3–5 visitantes, seguridad, operación offline, contingencia y registro de defectos.

### Regresiones de software host

`npm run test:host-references` ejecuta los tests Node existentes de protocolo/
simulador, adaptador host, scorecard, validación del paquete ECO-004 y runner de
firmware host. Es una vía cómoda para repetir contratos de software sin buscar
comandos por carpeta; no ejecuta Vitest, navegador, smoke offline, firmware en
placa, ciencia, hardware ni revisión humana.

Los registros futuros de recepción, compatibilidad y banco usan las
[plantillas ECO-108](../evidencias/ECO-108/README.md). Sus estados permitidos son
`NOT_RUN`, `PASS`, `FAIL` y `BLOCKED`; comienzan en `NOT_RUN`, y una celda vacía
no acredita aprobación.

## Matriz de pruebas propuestas
| Caso | Entradas | Esperado | Etapa |
|---|---|---|---|
| T-SOL-01 | G1000,A100,η.20,T25,β.004 | P20kW | Cierre |
| T-SOL-02 | mismas pero T35 | P19.2kW | Cierre |
| T-SOL-03 | proxy de luz mínimo/temperatura extrema válida | salida acotada; no se etiqueta como irradiancia | Cierre |
| T-HYD-01 | Qriver4,Qeco1,Qreq2,Hgross20,K.1,η.8 | Qturb2,Qbypass2,Hnet19.6,P307.6416kW | Cierre |
| T-HYD-02 | Qriver0.5,Qeco1,Qreq2 | Qturb0,Qbypass0.5, sin penalización humana | Cierre |
| T-BAT-01 | P_in120,ηch.95,dt60s | delta E +1.9kWh | Cierre |
| T-BAT-02 | P_out120,ηdis.90,dt60s | delta E -2.22222...kWh | Cierre |
| T-BAT-03 | SOC0/SOCmax | no negativo/no sobrepasar límite | Cierre |
| T-BUS-01 | varios generadores/consumos | residual potencia dentro tolerancia | Cierre |
| T-DET-01 | igual seed y acciones | mismo historial/score | F1 |
| T-SEN-01 | luz/temperatura en puntos de calibración | error y rango esperado vs obtenido registrados | Cierre |
| T-SEN-02 | señal estable y luego ruidosa | dispersión/filtrado medidos, sin ocultar incertidumbre | Cierre |
| T-SEN-03 | fuera de rango y desconectado | inválido explícito; no reutiliza dato silenciosamente | Cierre |
| T-CTL-01 | slider y selector en extremos | mapeo acotado, sin consigna imposible | S1/S2 |
| T-SER-01 | mensaje USB serial válido | esquema, versión, unidades y estado aceptados | S2 |
| T-SER-02 | corrupto/incompleto/timeout | rechazo seguro, error visible y recuperación definida | S2 |
| T-HIL-01 | variar luz y temperatura en hardware | cambio causal en PV, tablero/consola y registro | Cierre |
| T-E2E-01 | seis rondas con controles físicos | partida reproducible completa en 8–12 minutos | Cierre |
| T-SAFE-01 | inspección energizada/desenergizada | baja tensión, carcasa, cableado y alivio conformes | Precondición de energización + cierre |
| T-OFF-01 | red desconectada | consola y partida operan con recursos locales | Cierre |
| T-SCO-01 | ledger completo, coberturas sobre umbrales y ambiente conforme verificable | `victory`; tres dimensiones visibles, sin score ponderado | F0 |
| T-SCO-02 | demanda positiva, servicio total cero y umbrales de cobertura `[0,0]` | `defeat` con `NO_SERVICE`, aun sin fallar comparaciones de umbral | F0 |
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

### Trazabilidad ECO-002 para futuras pruebas

Los casos de esta sección son especificaciones para ECO-003 y fases posteriores,
programadas para la validación final con el MVP completo.
No se ejecutaron dentro de ECO-002. Los datos `CALC-*` son escenarios
documentales; no sustituyen los vectores de `docs/02_MODELOS_FISICOS.md` ni
constituyen resultados de tests.

| Casos | Elementos y límites | Cálculo / tolerancia de referencia | Nota de uso |
|---|---|---|---|
| T-SOL-01/02 | `SCI-EQ-PV-002` r1; `BND-PV-002`–`BND-PV-004` r1 | Vector ilustrativo eléctrico en `docs/02_MODELOS_FISICOS.md`; no hay `CALC-*` que reproduzca el modelo eléctrico candidato | Mantener bloqueado hasta modelo, coeficientes y dominio PV seleccionados. |
| T-SOL-03 | `BND-PV-003` r1; para oscuridad, `BND-PV-001` r1 | `CALC-PV-001` r1 es contraste Sandia térmico, no el modelo eléctrico candidato; redondeo del cuaderno ±0.01 °C | No usar ese contraste como oráculo de potencia ni del balance Euler. |
| T-PV-STAB (propuesto) | `SCI-EQ-PV-003` r1; `BND-PV-005` r1; `DIM-NUM-001` r1 | Criterio aún pendiente: estudio con `dt`, `dt/2`, `dt/4`; `CALC-PV-001` no valida estabilidad del candidato | Definir rango/tolerancia tras selección y revisión del modelo. |
| T-HYD-01/02 | `SCI-EQ-HYD-001`–`SCI-EQ-HYD-004` r1; `BND-HYD-001`–`BND-HYD-004` r1; `BND-ENV-001` r1 | `CALC-HYD-001` r1; tolerancia de comparación benchmark declarada ±0.2% | Los inputs de T-HYD-01/02 no son idénticos a los del cuaderno; usar el cuaderno como benchmark separado, no copiar su expected. |
| T-BAT-01/02/03 y T-BUS-01 | `SCI-EQ-BAT-001`–`SCI-EQ-BAT-002`, `SCI-EQ-BUS-001`–`SCI-EQ-BUS-002` r1; `BND-BAT-001`–`BND-BAT-005`, `BND-BUS-001`–`BND-BUS-002` r1 | `CALC-BUS-001` r1; tolerancia ledger documentada `1e-9 kWh`, estado `1e-6 kWh` | Valores del test y los del cálculo no deben confundirse; tolerancias aún requieren revisión/aprobación. |
| T-WIND (fuera del MVP) | `SCI-EQ-WIND-001`–`SCI-EQ-WIND-002` r1; `BND-WIND-001`–`BND-WIND-005` r1 | `CALC-WIND-001` r1; aritmética declarada ±0.1 W | Solo conservar como referencia futura; no ampliar alcance ECO-003/MVP. |

**Uso condicionado:** `GAP-013` r5 (hidro/ambiental), `GAP-015` r3 (PV),
`GAP-002` r3 (valores dependientes del escenario/equipo), `GAP-004` r1
(contabilidad batería/bus), y `GAP-006` r2 / `GAP-016` r1 (reproducción y
revisión) siguen abiertos o limitantes. El gate `ECO-002-GATE-20261122-03` está
`blocked_with_traceability`. Durante desarrollo, cualquier uso del candidato en
un prototipo debe permanecer rotulado como provisional y no apto para
afirmaciones científicas. La aceptación para entrega requiere completar las
revisiones, una reevaluación `accepted_frozen` o la exclusión explícita de los
elementos afectados.

### Auditoría de enlaces locales ECO-302

`npm run test:docs-links` cubre el extractor y los destinos relativos/root,
codificados, externos, fragmentos, malformados y fuera del repositorio.
`npm run check:docs-links` audita los archivos Markdown existentes, omite
destinos externos y ejemplos en código, y falla ante destinos locales ausentes.
También valida fragmentos de Markdown contra headings ATX, sufijos de headings
duplicados sin colisionar con otro slug, y atributos HTML `id`/`name` entre
comillas, incluidos fragmentos Unicode codificados. Omite ejemplos de inline y
fenced code. La cobertura de slugs no pretende imitar todo renderer: Setext,
componentes/plugin anchors y fragmentos de archivos no-Markdown quedan fuera.
Ningún check evalúa la verdad o calidad del contenido enlazado.

ECO302-3 aporta una hoja `NOT_RUN` para que una persona registre identidad,
competencia, commit/árbol/archivos revisados, comandos observados, hallazgos y
decisión. La plantilla separa revisión documental de aceptación científica,
hardware, seguridad, UX y aprobación docente; crearla no completa la revisión.

### Bootstrap de consola ECO-101

Vitest cubre metadata determinista y la fábrica pura de `GameConfig` sin requerir DOM ni navegador. TypeScript valida la configuración productiva y Vite genera el bundle local. El smoke productivo inicia Vite en `127.0.0.1:4173` con `--strictPort` y observa por CDP shell/canvas. El smoke offline reconstruye, sirve sólo `dist/` en loopback, inventaría solicitudes, bloquea referencias externas, verifica errores y conserva shell/canvas durante 1.000 ms tras apagar el servidor. Regresiones separadas cubren traversal codificado y puerto impostor. No prueba `file://`, refresh sin servidor, PWA, otros navegadores, interacción, accesibilidad asistida ni rendimiento prolongado.

La suite canónica `tools/local-console-server.test.mjs` contiene 19 pruebas y cubre
preflight/identidad, activos ausentes o externos, symlinks, límites del snapshot,
tipos MIME, health, traversal codificado, puerto ocupado estricto y liberación al
cerrar. Separadamente, las dos regresiones específicas del smoke comprueban que el
harness usa ese servidor para rechazar traversal codificado y que su puerto fijo
ocupado produce salida no-cero, sin PASS/Chrome y con limpieza verificable.
ECO304-3 además exige que el objeto congelado devuelto por el preflight no exponga
símbolos ni una colección mutable de archivos; el mapa de bytes queda en un
`WeakMap` privado usado por el servidor. Esto protege el contrato in-process, no
es una auditoría de seguridad del sistema operativo.

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
HOST-004 conserva las regresiones fail-closed y añade Vitest para importar el
adaptador de infraestructura, observar el arranque desconectado, el borrado ante
JSON inválido y snapshots estructuralmente desacoplados.

ECO109-1 añade un núcleo C++17 compilable en host, sin Arduino ni GPIO. Sus tests
exigen bytes exactos para `hello` y `inputs/disconnected`, rechazo de identificador
de calibración inseguro y fallo cerrado por buffer insuficiente. El stream
resultante debe coincidir con `v1-device-disconnected.jsonl` y ser aceptado por el
parser Node. Esta prueba no acredita compilación para ESP32-C6, USB serial ni banco.
ECO109-2 expone la compilación/fixture/parser anterior como `npm run
test:firmware`. El runner crea y limpia su propio directorio temporal, falla si
falta `g++`, y valida el resultado contra el parser Node canónico. No ejecuta un
toolchain Arduino ni HIL.
ECO109-3 agrega límites C++ host para ambos serializadores: `uint32_t` máximo en
secuencia/uptime y capacidad del buffer con y sin espacio para el terminador NUL.
ECO109-4 usa bytes centinela adyacentes al buffer declarado para detectar
escrituras fuera de capacidad en los casos de rechazo por tamaño insuficiente.
ECO109-5 comprueba para ambos encoders longitud (`32` aceptado, `33` rechazado),
caracteres permitidos (`-_.`), rechazo de salto de línea y salida limpia; no
valida calibración metrológica.
ECO109-6 emite los mensajes C++ límite y exige que el parser Node canónico acepte
ambos con secuencia/uptime máximos y longitud de identificador 32; el fixture
nominal conserva su comparación byte a byte.
ECO109-7 ejecuta el runner en sandboxes con variables TMP aisladas y cubre éxito,
`g++` ausente (fallo de spawn) y un compilador stub con salida 23; el directorio
de build temporal debe quedar vacío en cada ruta.
ECO109-8 prueba argumentos nulos en ambos encoders y capacidad cero con destino
válido: el rechazo no debe modificar memoria cuando no existe capacidad.
ECO109-9 repite el harness host con `-fsanitize=address,undefined` cuando esos
runtimes están disponibles; el comando normal no depende de ellos y ambas rutas
siguen limitadas al host.
ECO109-10 pasa un argumento no soportado al ejecutable C++ y exige estado 2,
stdout vacío y mensaje de uso exacto, evitando que un typo parezca una prueba PASS.
ECO109-11 emite 16 pares de mensajes sobre límites decimales y `uint32_t`; cada
una de las 32 líneas debe parsear y preservar los valores esperados de secuencia y
uptime, con `hello` seguido por el snapshot desconectado.
ECO109-12 comprueba el límite exacto de enteros seguros de JavaScript para ambos
campos, rechaza valores posteriores sin eco de precisión perdida y acepta el
máximo seguro; el chequeo no redefine el máximo del protocolo para otros runtimes.

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
ECO104-10/BOOTSTRAP-008 cubre la composición promovida y su mapper al puerto de
consola: fuente ausente, entrada sin confirmar, entrada fresca lista, snapshot ya
consumido, reset y terminación de seis rondas; `main.ts` permanece fuera del flujo.
ECO104-11 usa el manifiesto provisional canónico en suites Node y Vitest, y
comprueba orden exacto, seis entradas y congelamiento de manifiesto, arreglo,
rondas, eventos y datos.
ECO104-12 verifica en la integración de aplicación que la ingesta no invoca el
resolutor, la confirmación explícita entrega semilla, versión, ronda, secuencia,
token, calibración y seis controles normalizados en un sobre profundamente
inmutable, y el replay por token o por secuencia consumida no duplica llamada ni
historial. No prueba efectos de evento, solvencia, balance, ciencia ni integración
de producto.
ECO104-13 confirma que el snapshot de sesión y su view model conservan sus schemas
cerrados después de resolver una ronda y no serializan token, versión de
calibración ni controles normalizados retenidos en el historial interno. Es una
regresión de mapeo, no una certificación de privacidad ni una auditoría de
seguridad.
ECO104-14 exige para todos los estados del snapshot el mismo conjunto cerrado de
seis campos primitivos y congelamiento; prueba además `Reflect.set` sin mutación
en `waiting-input`, `ready`, `reset-required` y `completed`, con tres razones
distintas para la espera. Esto no añade wiring ni semántica de producto.
ECO104-15 confirma que tras la última secuencia uint32 (`0xffffffff`) un mensaje
con secuencia `0` es rechazado como `SEQUENCE_INVALID`: se limpian valores
expuestos, la ronda e historia no avanzan y el resolver no se invoca por segunda
vez. El protocolo no define epoch ni wrap; no hay evidencia de reconexión física.
BOOTSTRAP-009 prueba carga y confirmación separadas, rechazo de acciones fuera de
estado, replay determinista y terminación en seis rondas. El smoke Chrome ejecuta
waiting→ready→ronda 2 y comprueba a 390 px controles/canvas visibles y ausencia de
overflow horizontal; no valida efectos de juego, ciencia, serial o hardware.
BOOTSTRAP-010 amplía ese smoke a las seis transiciones ready/avance y exige
`completed` con ambos controles deshabilitados, preservando los checks móvil y de
errores acotados. Sigue siendo evidencia técnica, no una validación de gameplay.
ECO105-1 añade aserciones sobre observación inicial vacía, valores normalizados
aceptados, inmutabilidad profunda, replay determinista y una sola traza por
confirmación. Chrome exige los seis valores visibles y seis filas ordenadas; no
valida calibración, unidades, efectos, accesibilidad asistida ni hardware.
ECO105-2 rechaza reset en estados inicial, listo y entre rondas sin alterar snapshot
u observación; tras completar exige estado fresco, salida vacía e inmutable y un
segundo replay idéntico. Chrome verifica además foco en carga, controles, geometría
desktop/móvil, un único canvas y cero errores JavaScript acotados.
ECO105-3 cubre diagnóstico malformado inicial y tras una confirmación, secuencia
no consumida, traza/ronda preservadas y no-op en listo/completado. Chrome abre el
`details`, observa `MALFORMED_JSON`, conteo anunciado real, recuperación antes de
confirmar y conserva ambos replays, geometría desktop/móvil y canvas único.
ECO105-4 cubre el copy provisional de las seis rondas, correspondencia estricta
entre índice e ID canónico, inmutabilidad y render mediante `textContent`.
Combinaciones desconocidas o desalineadas fallan cerradas. Chrome y el smoke
offline preservan los dos ciclos, móvil 390 px y cero errores JavaScript. Chrome
exige además los seis títulos y preguntas exactos en orden y su reproducción
después del reset. La revisión humana de claridad fue omitida por instrucción
del usuario, no aprobada.
ECO105-5 cubre render independiente del panel, clave de evento, contenido
literal, ocultamiento y limpieza sin ronda activa. Chrome exige geometría visible
y contenido exacto para las seis guías en ambos ciclos. No sustituye prueba con
tecnología asistiva ni evaluación humana de legibilidad.
ECO105-6 cubre clasificación cualitativa de avisos, texto redundante, nivel,
render literal y limpieza al desaparecer la condición. Chrome exige avisos
visibles para desconexión, mensaje malformado y nueva entrada, y panel oculto en
listo/completado. No valida comprensión ni alertas causales del gameplay.
ECO204-1 cubre la prioridad determinista de foco, ausencia de movimiento sin
acciones disponibles y el ciclo real cargar→confirmar→cargar/reiniciar. Chrome
comprueba además recuperación tras diagnóstico y reset. No sustituye navegación
humana, lector de pantalla, contraste medido ni pruebas a distancia.
ECO204-2 cubre `fieldset`, leyenda, ayuda asociada y preservación de botones
nativos no-submit. Chrome comprueba la estructura en ejecución junto con el ciclo
de foco. No sustituye inspección del árbol asistivo, lector de pantalla ni prueba
humana.
ECO204-3 añade `npm run test:contrast`: lee las declaraciones hex vigentes,
calcula luminancia relativa y exige 4.5:1 para seis combinaciones de texto y 3:1
para foco. No interpreta toda la cascada, transparencias, antialiasing, controles
deshabilitados ni condiciones reales de visualización.
ECO204-4 amplía Chrome de 390 a 320 px y exige ausencia de overflow horizontal,
geometría contenida para estado, acciones, diagnóstico, canvas, observación y
seis trazas, además de separación de interactivos. No simula zoom de texto,
teclado virtual, orientación ni dispositivo físico.

ECO105-7 prueba en navegador la entrada manual de JSON Lines v1 a través del
adaptador canónico: snapshot nominal, línea malformada, desconexión explícita,
limpieza de datos y estado de partida sin cambios. La emulación no implica
serial, placa, sensor, calibración ni variable física; la revisión humana y
asistiva permanece pendiente.

ECO105-8 añade a la aceptación del botón de reinicio que tanto el adaptador como
el textarea vuelven a estado vacío, evitando reprocesar accidentalmente el lote
descartado antes de pegar una sesión nueva.
ECO105-9 comprueba después del reset que el foco vuelve al textarea, coincide con
`:focus-visible` y muestra outline calculado distinto de `none`/`0px`.
ECO105-10 cubre `hello` válido sin `inputs`: el estado debe ser “entradas
pendientes”, sin motivo de error y con seis campos vacíos; la regla de contraste
para esa etiqueta permanece sobre 4.5:1.
ECO105-11 recorre hello(0) → inputs(1) → JSON malformado → inputs(2): el estado
intermedio debe limpiar valores; el mensaje de secuencia esperada puede recuperar
sin reset; y los valores aceptados no deben modificar rondas ni trazas de juego.

ECO109-13 comprueba que el límite JSON/protocolo acepta números finitos extremos
sin imponer rangos físicos y que la vista sigue etiquetando los seis campos como
valores de transporte, sin efecto en partida. Es una regresión de contrato de
software; no demuestra plausibilidad física, calibración ni comportamiento de
hardware.

ECO105-12 envía como `calibrationVersion` una cadena SVG con handler y confirma
en Chrome que el resumen la conserva literalmente, sin nodos SVG ni ejecución de
eventos. Comprueba el render seguro del panel de observación manual, no todo el
producto ni una auditoría de seguridad general.

ECO105-13 envía un mensaje `error` de protocolo válido cuyo `detail` contiene
markup SVG con handler. Chrome debe observar `DEVICE_FAULT` y el detalle exactos
en `#device-issue` como texto, sin SVG descendiente ni ejecución del handler.
Esto cubre ese sink de presentación concreto, no otros sinks ni una auditoría
general de seguridad.

ECO105-14 comprueba además la ruta separada `#device-announcement` (`role=status`,
`aria-live=polite`): debe contener el anuncio y motivo exactos como texto, sin
descendientes SVG ni ejecución del mismo handler. La aserción de DOM no verifica
cuándo o cómo lo anuncia una tecnología asistiva.

ECO109-14 comprueba que el adaptador rechaza `output` en sentido dispositivo→host,
limpia valores previamente aceptados y puede recuperarse con la siguiente
secuencia esperada; también verifica que un mensaje `error` expone su código y
detalle sin conservar valores anteriores. Es evidencia del contrato host, no de
transporte serial o firmware en placa.

ECO109-15 verifica que un único campo `disconnected` invalida el snapshot
completo, limpia valores anteriores y presenta estado desconectado; una entrada
completa con la secuencia contigua puede recuperar el estado de transporte. No
simula la desconexión eléctrica de un sensor o dispositivo.

ECO109-16 comprueba que un mensaje `inputs` con schema válido pero un único campo
`invalid` no publica parcialmente los otros cinco valores; limpia el snapshot y
permite recuperación con la secuencia contigua. Es control de protocolo, no
diagnóstico físico del sensor.

ECO109-17 comprueba que ambos serializadores C++ conservan el identificador de
calibración cuando el llamador lo almacena al inicio o un byte dentro del buffer
de salida, tanto para longitud ordinaria como máxima (32). El encoder captura
primero el texto validado en un buffer local acotado y luego formatea la línea,
evitando lectura/escritura solapada en `snprintf`. Verificado con compilación host
C++17 y ASan/UBSan; no es evidencia de ejecución en placa.
ECO109-18 prueba en ambos encoders los extremos de letras y dígitos ASCII y la
allowlist `-_.`; whitespace, slash, backslash, tab y colon se rechazan con el
buffer limpio. Además barre los bytes `0x01`–`0x7f` y compara cada resultado con
esa allowlist; NUL no puede representarse como contenido de un C-string. El
contrato es sintáctico y no valida el contenido de calibración.
ECO109-19 ejecuta el mismo fixture, parser y barrido numérico con
`npm run test:firmware:strict`, que agrega `-O2 -Wconversion -Wsign-conversion
-Wshadow -Wformat=2` al compile host C++17 con warnings-as-errors. Sigue siendo
GCC host; no compila el target Arduino/ESP32-C6.

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

La [hoja ECO110-2](../evidencias/ECO-110/observacion-flujo-papel-plantilla.md)
observa solo comprensión inicial y flujo de las seis rondas impresas. Se vincula
al hash del material y registra tiempos, preguntas e intervenciones; no sustituye
el paquete preregistrado ni el validador ECO-004 y permanece `NOT_RUN` hasta una
sesión real.

## Reglas de tolerancia para el cierre
- Resultados algebraicos: `max(1e-9, 1e-10 * abs(valor_esperado))` en unidades de la magnitud, salvo justificación; la necesidad de un criterio relativo/absoluto por variable se revisará.
- Integración temporal por Euler: en el gate final, estudiar convergencia variando dt y comportamiento físico; no exigir coincidencia exacta con ecuación analítica a dt finito.
- Balance de bus: propuesta `abs(residual_kW)<=max(1e-6,1e-8*max(1,demanda_kW))`.
- Balance de energía acumulada: usar dt en h y pérdidas declaradas, no comparar kW con kWh.

## Pruebas de aceptación final de modelo
- Capturar por cada fenómeno: ecuación, valores de entrada, salida prevista, salida del sistema, error absoluto y relativo, unidades y revisión.
- Para pruebas visuales no reemplazar captura real por ilustración generada.
- Cambios de fórmulas sin tests/regresión actualizados impiden cerrar tarea.
- Casos límite: PV sin luz útil y temperatura extrema válida; hidro con `Qriver<Qeco`, consigna cero/máxima y salto neto no positivo; batería en SOC mínimo/máximo y balance con pérdidas.
- Cada banco, HIL y E2E registra versión de firmware/calibración, montaje, entradas, **esperado/obtenido**, tolerancia, comando o procedimiento, evidencia, responsable, fecha/hora y estado. Una expectativa sin observación no es prueba.

## Prueba de jugabilidad
Para cada sesión: edad aproximada voluntaria si acepta, experiencia en juegos, objetivo entendido, tiempo primer input, fallos del UI, emociones/aburrimiento/confusión, comentarios textuales anónimos. No inferir evaluación de 3 usuarios de un solo ensayo.
