# ESTADO / RELEVO OBLIGATORIO ENTRE SESIONES

**Última actualización:** 2026-11-21 (ECO109-6: interoperabilidad de límites).
**Fase actual:** F1, rebanada vertical local; integración física bloqueada por G1.
**Tarea vigente:** ECO109-6 comprueba que el parser Node acepta los mensajes C++
de frontera (`uint32_t` máximo e identificador de 32 caracteres). No conecta
hardware, USB o pines. ECO-109 físico y ECO-108/G1 continúan abiertos; ECO-105
sigue PENDIENTE y ECO-002 sigue BLOQUEADA.
**Producto físico/hardware:** el usuario reporta una placa `Nano ESP32-C6 V1.0`/`V1711` y el inventario listado en la BOM. No hay todavía inspección independiente, pinout autenticado, firmware cargado, calibración, protocolo USB integrado, tablero, carcasa ni pruebas HIL.
**Herramientas verificadas aquí:** Node `v26.9.0`, npm `11.19.1`, Git `2.55.0` y OpenCode `1.19.3` respondieron durante ECO-001. ADR-005 adopta Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`; Chrome headless `156.0.8078.47` verificó tanto el spike histórico como el bootstrap productivo local, con los límites registrados en ECO-101/ECO-105.

## Lo que está decidido
- EcoGrid: Ciudad al Límite; Liga 4; juego cooperativo de mesa con electrónica y consola local secundaria.
- Integración de termodinámica + mecánica de fluidos + electrónica + ambiental.
- MVP de cuatro semanas: PV térmico, hidro de pasada, batería/bus y seis rondas en 8–12 minutos.
- Stack de consola secundaria: TypeScript, Phaser 3, Vite y Vitest en versiones exactas; Playwright fuera del primer corte.
- El 2026-10-27 se aprobó la BOM separada como objetivo de preparación para
  ECO-108, con presupuesto objetivo COP 83.000–90.000 más envío. No autoriza
  compra ni acredita posesión, recepción, calibración o prueba física.
- El 2026-11-08 se sustituyó el candidato Uno por un ESP32 genérico de 30 pines.
  Es una decisión documental: identidad exacta, pinout, USB, costo y evidencia
  física siguen pendientes.
- El 2026-11-15 el usuario identificó la unidad disponible como `Nano ESP32-C6
  V1.0`, marca `V1711`, y reportó componentes físicos. La publicación comercial
  no expuso ficha sin login; pinout, revisión eléctrica y USB siguen pendientes.

## Lo que sigue pendiente
- Inventario real, datasheets aplicables, presupuesto final y componentes disponibles; existe una [BOM candidata](19_BOM_ECO_108.md), no una selección física.
- Responsables, fechas, acceso a fabricación y dimensiones/materiales del tablero.
- Integrar comportamiento de producto: la build estática ya fue verificada sin dependencia de Internet mientras la sirve un HTTP local, pero no acredita gameplay ni integración híbrida.
- Referencias bibliográficas de parámetros físicos específicos y calibración.
- Validar mediante playtesting reproducible y revisión ambiental los umbrales y
  la semántica de indisponibilidad natural de ECO-004; la estructura sin pesos
  ya fue adoptada, pero no acredita balance.
- Ejecutar banco, firmware/protocolo, calibración, montaje y seguridad; hoy son planes, no evidencia.

## Gate humano inmediato — G1

El usuario reportó inventario real, incluida la unidad `Nano ESP32-C6 V1.0`/`V1711` y una sonda DS18B20 de 2 m. ECO108-1 preparó una BOM candidata, ECO108-2 dejó [formularios vacíos](../evidencias/ECO-108/README.md), ECO108-3 separó [hechos visibles y pendientes](../evidencias/ECO-108/preparacion-referencias-2026-11-03.md), ECO108-4 registró la antigua elección de 1 m y ECO108-5 adoptó el ESP32 genérico previo. El próximo gate exacto es inspeccionar referencias/cantidades, autenticar documentación de placa y sonda, identificar funciones USB y pinout, y decidir host, responsables y fechas. Luego se completa esquema desenergizado, pinout versionado y banco incremental con evidencia observada. G1 no está cerrado. ECO-109 avanzó sólo en C++ host; ECO-110 sigue pendiente.

## Últimos cambios y pruebas
- El kit declaró documentación, agentes, skills, comandos y datos de referencia, pero `.opencode/` continúa ausente. No se han ejecutado tests del producto híbrido; las pruebas actuales del bootstrap cubren sólo metadata y configuración pura, además de las referencias aisladas existentes.

### ECO-006/ECO-301 — pitch comercial y rebaseline de 14 días

- `entregables/pitch/pitch-ecogrid.pdf` contiene siete páginas 16:9 centradas en
  vender la idea: problema, fantasía, flujo, decisiones, diferenciadores y
  promesa. No incluye ecuaciones, estado técnico ni cronograma.
- `entregables/pitch/guion-pitch.md` tiene 626 palabras y respuestas comerciales;
  falta ensayo y revisión humana, por lo que ambas tareas quedan **EN REVISIÓN**.
- La primera versión académica/técnica se conserva con sufijo `-tecnico` como
  respaldo, no como presentación recomendada.
- Chrome headless generó el PDF comercial de 2.407.416 bytes; `pdfinfo` observó siete
  páginas de 960 × 540 puntos, PDF 1.4, sin cifrado, formularios ni JavaScript.
  La inspección visual y `pdftotext -layout` no mostraron páginas extra ni
  contenido cortado.
- `docs/20_PLAN_MVP_14_DIAS.md` sustituye operativamente el plan de cuatro
  semanas y fija D0–D14, gates, alcance excluido y evidencia diaria.
- Este corte no desbloquea ECO-002 ni acredita firmware en placa, sensores,
  serial real, tablero, HIL, seguridad física o playtesting.

### ECO110-1 — prototipo imprimible de flujo

- `entregables/prototipo-mesa/prototipo-ecogrid.pdf` contiene ocho páginas A4
  horizontales: tablero provisional, seis cartas en el orden canónico y guía
  rápida de diez pasos.
- Las cartas usan las claves `base-demand`, `high-temperature`, `low-river`,
  `demand-peak`, `reduced-light` y `seeded-combination`, sin inventar efectos
  numéricos, umbrales o balance.
- Todas las páginas rotulan que son un prototipo sin balance definitivo; la guía
  permite ensayo en papel, no acredita modelos, hardware, calibración o HIL.
- Chrome headless generó un PDF de 220.280 bytes; `pdfinfo` observó ocho páginas
  A4 horizontales, PDF 1.4 y sin JavaScript. La inspección visual no mostró
  contenido cortado.
- `entregables/prototipo-mesa/fichas-ecogrid.pdf` añade 24 fichas visuales y
  diez marcadores de decisión para ensayos en papel, sin atribuirles kW, kWh,
  m³/s o porcentajes.
- ECO-110 permanece **PENDIENTE**: faltan prueba cronometrada y estructurada,
  dimensiones finales, montaje, controles reales, LEDs, carcasa, cableado fijo
  y seguridad observada.

### ECO110-PT-20261118-01 — primera prueba reportada en papel

- El usuario reportó dos participantes y finalización de las seis rondas con
  “buenos resultados”.
- No se registraron duración, dificultades, experiencia previa, pausas,
  comprensión en 90 segundos, resultado por ronda ni hash del material usado.
- La evidencia queda en
  `evidencias/ECO-110/playtest-papel-2026-11-18.md` como `REPORTED_PARTIAL`, no
  como PASS independiente.
- El reporte permite afirmar únicamente que dos personas recorrieron el flujo
  completo. No acredita balance, duración de 8–12 minutos, ciencia, hardware,
  HIL, seguridad o cierre de ECO-110.

### ECO109-1 — núcleo C++ del protocolo seguro

- `firmware/esp32-c6/` implementa serialización C++17 sin dependencias para
  `hello` y un snapshot `disconnected` que elimina los seis valores.
- Usa buffers del llamador, limita `calibrationVersion` y falla cerrado si el
  buffer o identificador no son válidos.
- Compilación host con `-Wall -Wextra -Werror -pedantic`: 4/4 PASS; el stream
  C++ coincide byte a byte con el fixture versionado y el parser/adaptador Node
  conserva 27/27 PASS.
- No configura Arduino, GPIO, USB, baud, ADC, OneWire, LEDs o SW761. ECO-109
  queda **EN CURSO** y requiere documentación de placa y banco antes del wiring.

### ECO109-2 — verificación host reproducible

- `npm run test:firmware` compila el núcleo con `g++ -std=c++17` y warnings como
  errores, ejecuta 4 checks C++, compara byte a byte el flujo con el fixture y
  valida ambas líneas con el parser Node canónico.
- Resultado observado: `ECO109_HOST_VERIFICATION=PASS compiler=g++17
  unit_tests=4 fixture=byte-identical parser=2/2`; compilador `g++ 13.3.0`.
- El binario temporal se crea en un directorio único del sistema y se limpia
  incluso cuando falla el comando. No instala paquetes npm.
- Esta verificación host no equivale a compilación Arduino, carga a placa, USB,
  sensores, calibración, banco o HIL. ECO-109 sigue **EN CURSO**, ECO-002
  **BLOQUEADA** y G1 sin cerrar.

### ECO109-3 — límites del serializador host

- Las pruebas C++ validan que ambos tipos de mensaje representen
  `uint32_t` máximo (`4294967295`) sin convertirlo en valor negativo.
- Capacidad igual al largo del texto falla de forma cerrada porque no cabe el
  terminador NUL; largo + 1 sí funciona, para `hello` e `inputs/disconnected`.
- `npm run test:firmware`: 5/5 pruebas C++, fixture byte-identical, parser 2/2;
  compilación C++17 con `-Wall -Wextra -Werror -pedantic`: PASS.
- Esto no verifica la placa, Arduino, USB/UART, GPIO, calibración o física.

### ECO109-4 — escritura acotada en capacidad insuficiente

- Ambos encoders se prueban con una estructura que contiene bytes centinela
  antes y después de un buffer de 16 bytes. Al pasar esa capacidad insuficiente,
  los centinelas permanecen intactos y el primer byte del buffer queda NUL.
- La prueba es una regresión host de límites de escritura; no reemplaza sanitizers,
  análisis del compilador de placa ni pruebas físicas.

### ECO109-5 — límite del identificador de calibración

- Ambos encoders aceptan 32 caracteres ASCII permitidos y rechazan 33, limpiando
  el primer byte del buffer al fallar. Se verifica también puntuación permitida
  (`-_.`) y rechazo de salto de línea para prevenir inyección de otra línea.
- Es solo un límite de seguridad del identificador; no define valores, unidades,
  método ni validez de calibración.

### ECO109-6 — interoperabilidad del parser en límites

- El ejecutable C++ emite `hello` e `inputs/disconnected` con secuencia/uptime
  `4294967295` y `calibrationVersion` de 32 caracteres.
- El runner valida esas dos líneas límite con `parseLine` además de las dos líneas
  nominales/fijadas por fixture; se comprueban tipo, campos límite y aceptación.
- Resultado local: ver evidencia ECO109-6. Esto no implica serial físico.

### ECO304-1 — operación local estricta

- Un servidor Node sin dependencias comparte preflight, identidad SHA-256, health y
  entrega loopback entre el comando operador y el smoke offline.
- Los commits `7e8dc7e` y `e0ff990` registran la implementación y su evidencia:
  suite focalizada 19/19 y suite Node combinada 195/195 PASS. El snapshot inmutable
  limita la build a 256 archivos, 64 MB totales y 32 MB por archivo.
- La build sigue siendo explícita y ECO-304 continúa **PENDIENTE**: falta el
  recorrido humano en el equipo objetivo y el ensayo de stand.

### ECO-104 — referencia parcial del ciclo de rondas

- **Resultado:** referencia Node ESM aislada en `tools/round-lifecycle/` para un
  manifiesto cerrado de seis rondas, snapshots normalizados, confirmación única,
  resolutor sintético inyectado, historial inmutable y terminación explícita.
- **Estado:** ECO-104 continúa **PENDIENTE**. La referencia no prueba solvencia,
  balance, duración, gameplay, física, hardware ni integración de producto.
- **Corrección ECO104-4:** un verificador independiente bloqueó `a0ac3ca` por
  accessors/TOCTOU, reentrada, profundidad no acotada, regresión de secuencia y
  schemas cerrados eludibles. La corrección usa captura acotada por descriptores,
  guardia de resolución y secuencias estrictamente crecientes.
- **Evidencia local corregida:** suite focalizada 41/41 PASS; suite conjunta
  135/135 PASS; probes adversariales cerraron los cinco hallazgos sin errores
  nativos; `git diff --check` PASS. ECO-104 no se promueve.
- **Segunda corrección ECO104-5:** la guardia ahora cubre captura, validación,
  resolución y captura de resultado con limpieza `finally`; las opciones del
  constructor se capturan como cuatro propiedades de datos propias, enumerables
  y exactas. Suite focalizada 52/52 PASS y conjunta 146/146 PASS; los probes
  acotados confirman cero llamadas anidadas al resolutor, máximo seis entradas,
  retry tras fallo de captura y límites antes de materializar descriptores.
- **Composición ECO104-6:** `tools/round-host-integration/` importa las dos APIs
  existentes; sólo `confirm(token)` entrega el snapshot normalizado al ciclo.
  Invalidez, valores obsoletos, replay y desconexión no avanzan; la desconexión
  exige una instancia nueva. Suite focalizada 14/14 y conjunta 160/160 PASS.
  Es evidencia local aislada, no gameplay, serial, HIL ni integración de producto.
- **Corrección ECO104-7:** una guardia síncrona común rechaza reentrada de
  `ingest`/`confirm`/`disconnect`, valida líneas no string antes del adaptador y
  bloquea toda mutación tras requerir reset. Suite focalizada 18/18 y conjunta
  164/164 PASS; probes acotados preservaron adaptador, ciclo y límite de seis.
  ECO-104 continúa pendiente y el harness sigue sin ser producto ni hardware.
- **ECO104-8:** el manifiesto usa seis claves semánticas provisionales en el orden
  documental. Las pruebas cubren orden, unicidad, replay y entrega secuencial al
  resolutor: ciclo 53/53, integración 18/18 y suite conjunta 165/165 PASS. No se
  implementaron efectos, valores, balance ni integración de producto.

### ECO108-4 — variante de sonda elegida

- **Decisión humana:** variante de 1 m para la sonda DS18B20 de tres
  conductores previamente seleccionada.
- **Límites:** la elección no atribuye precio, stock, envío, pinout, fabricante,
  posesión, compra, recepción, calibración, tiempo de respuesta, USB ni HIL.
- **Gate:** autorización de compra y G1 permanecen abiertos; primero se revalidan
  la variante de 1 m, el total y los datos comerciales aplicables.
- **Estado posterior:** el inventario del 2026-11-15 reporta una sonda disponible
  de 2 m; esta unidad sustituye la variante documental de 1 m para el banco futuro.

### ECO108-5 — candidato ESP32 provisional

- **Decisión humana:** ESP32 genérico de 30 pines para adquisición futura,
  reemplazando el Uno como candidato vigente.
- **Diseño permitido:** roles sin pines; señales y ADC dentro del rango candidato
  de 3,3 V; USB de entrada separado de lógica; pull-up DS18B20 al riel candidato.
- **Gate:** identificar placa/módulo/revisión y documentación aplicable, revisar
  esquema desenergizado, revalidar costos y autorizar compra. Sin firmware, banco,
  calibración o HIL; ECO-108/G1 abiertos y ECO-109 pendiente.
- **Estado posterior:** el usuario reportó `Nano ESP32-C6 V1.0`/`V1711`; todavía
  faltan autenticación documental, pinout, funciones USB e inspección eléctrica.

### ECO108-3 — referencias comerciales preparadas

- **Resultado documental:** una sonda DS18B20 y una LDR desnuda de 5 mm,
  10–20 kΩ a 10 lux, quedaron registradas como referencias de compra candidatas,
  una unidad de cada una. Las páginas son fuentes de vendedor, no datasheets.
- **Banco previsto:** DS18B20 alimentado con pull-up candidato de 4,7 kΩ; LDR
  sobre divisor candidato de 10 kΩ hacia retorno y nodo ADC intermedio. Valores,
  polaridad final, pinout, fabricante y calibración siguen pendientes de banco.
- **Fuente:** las páginas mostraron precios y stock generales, pero no se
  atribuyen a opciones comprables exactas. Además incluyeron contenido ajeno al
  catálogo; R17 exige autenticar toda fuente técnica antes de energizar.
- **Gates:** ECO-108/G1 permanecen abiertos; no hubo compra, recepción,
  inventario físico, firmware, USB, HIL ni prueba de hardware.

### ECO-004 — scorecard cooperativa en revisión

- **Resultado:** ADR-011 adopta cobertura crítica, cobertura total y
  cumplimiento ambiental como dimensiones separadas sin pesos. `6aa9af2` aporta
  la referencia y `11d325d` rechaza agregados no finitos (450 líneas, 2 paths).
- **Hallazgo y corrección:** el verificador independiente inicial bloqueó por
  overflow con dos rondas `Number.MAX_VALUE` (`Infinity`, coberturas `NaN` y
  victoria incorrecta). Tras el fix, devuelve `incomplete`, métricas `null` y
  `AGGREGATE_QUANTITY_INVALID`; la reverificación fue PASS sin bloqueantes.
- **Paquete de playtest:** ECO004-5 y ECO004-7 completadas; ECO004-6 parcial;
  ECO004-8/9/10 pendientes o bloqueadas. Los artefactos reales siguen `NOT_RUN`,
  sin resolver, thresholds, participantes, outcomes ni revisión inventada.
- **Correcciones del validador:** paquete `NOT_RUN` fail-closed, blockers exactos,
  resolver `null`, IDs/acciones canónicos, sin participantes/resultados/thresholds/
  ambiente, schema v1 cerrado con `UNKNOWN_FIELD` y `ready:false` incondicional.
- **Pruebas locales observadas:** scorecard+package 67/67 PASS; suite conjunta
  94/94 PASS; `git diff --check` PASS; tres JSON `PARSE_OK`. El fixture real usa
  `rep-1`/`rep-2` y los tests ya no normalizan esos IDs.
- **Revisión independiente:** dos verificadores previos bloquearon respectivamente
  por blockers/resultados/participantes/ambiente eludibles y por siete aliases o
  campos desconocidos. La auditoría independiente final no pudo ejecutarse por
  límite de uso del proveedor; **no** se declara PASS.
- **Entrega/revisión:** `stacked-to-main`, cuatro PR lógicos, sin ramas, push ni PR.
  PR 1 (450), PR 2 (414) y PR 3 (`727c36b`, 605 líneas, 2 paths) tienen
  `size:exception` autorizada; PR 4 contiene sólo documentación/evidencia actual.
  El assessment contra `cb89925` fue `risk: medium`, `executable_change`,
  `review_due: true`, `slice_budget_reached`.
- **Review nativo:** STATUS volvió a #4890:
  `intended_untracked_selection_required`; los submission tokens omitieron
  `base-ref`/`committed-only`. No se ejecutó la selección defectuosa y no existe
  aprobación ni recibo.
- **Límites:** no consume ECO-002 ni acredita umbrales oficiales, balance,
  ciencia, hardware o producto. La indisponibilidad natural sigue provisional.
  Por eso ECO-004 queda **EN REVISIÓN**, no HECHA.
- **Gates preservados:** ECO-002 sigue **BLOQUEADA**; ECO-108/G1 abiertos y
  ECO-109 **PENDIENTE**. `.codegraph/` y `.gitignore` siguen no rastreados y
  fuera de alcance; Engram no confirmó el registro de sesión.

### HOST-002 — adaptador host de referencia

- **Resultado:** referencia Node.js en `tools/host-adapter/`; consume JSON Lines
  dispositivo → host y elimina los seis valores ante invalidez, desconexión,
  error, secuencia incorrecta o dirección host → dispositivo.
- **Pruebas:** verificación independiente ordinaria PASS, sin hallazgos
  bloqueantes: `node --test tools/device-simulator/*.test.mjs
  tools/host-adapter/*.test.mjs` aprobó 27/27 y `git diff --check` pasó sin
  salida. El commit `c0a4380` agregó cobertura para tipo no soportado tras
  valores válidos, secuencias duplicada y reordenada, y determinismo de
  snapshots CLI de error.
- **Revisión nativa:** no disponible y sin aprobación ni recibo. Gentle AI 3.7.0
  perdió `base-ref`/`committed-only` al seleccionar archivos no rastreados y
  convirtió el rango de 20 paths en un candidato vacío; la ocurrencia quedó en
  [#4890](https://github.com/Gentleman-Programming/gentle-ai/issues/4890#issuecomment-6609495590).
  PR #5872 contiene el fix, pero fue fusionado después de v4.3.1 y todavía no
  existe una versión estable publicada que lo incluya.
- **Límites:** no es producto, firmware, serial real, calibración, timeout, retry,
  reconexión, electrónica ni HIL. ECO-109 continúa **PENDIENTE**.
- **Estado físico y local:** ECO-002 continúa **BLOQUEADA**; ECO-108/G1 siguen
  abiertos. `.codegraph/` y `.gitignore` permanecen no rastreados y fuera de
  alcance. Engram no confirmó el registro de sesión.
- **Rollback:** eliminar `tools/host-adapter/`, revertir la exportación inmutable
  de campos y retirar sus enlaces; ninguna ruta productiva depende del spike.

### BOOT-003 — simulador de protocolo sin hardware

- **Resultado:** parser JSON Lines v1 y CLI determinista en `tools/device-simulator/`, con escenarios nominal y desconectado, fixtures y pruebas Node.
- **Pruebas:** 8/8 pruebas `node:test`; escenarios generados idénticos a sus fixtures versionados; emisión nominal idéntica byte a byte; desconexión con seis valores `null`; stdin produjo `MALFORMED_JSON` y `UNSUPPORTED_VERSION`.
- **Límites:** no es firmware, serial real, calibración, electrónica ni dominio científico; los enums de batería/prioridad son provisionales de la herramienta.
- **Rollback:** eliminar `tools/device-simulator/` y sus enlaces documentales; ninguna ruta productiva o científica lo importa.

### ECO-101 — bootstrap productivo inicial en curso

- **Resultado actual:** aplicación raíz con shell DOM accesible, escena Phaser mínima, configuración tipada y fronteras puras testeables. ADR-005 adopta Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`, con lockfile npm.
- **Checks del bootstrap:** typecheck sin diagnósticos, 2/2 pruebas Vitest y build completado; Vite conserva la advertencia de chunk minificado de Phaser mayor a 500 kB.
- **Spike histórico:** typecheck, 1 test y build pasaron; su harness inició Vite exclusivamente en `127.0.0.1:5173`, comprobó HTTP 200 y el marcador propio, y Chrome headless `156.0.8078.47` reportó `canvas=true`, PNG de `9967` bytes y `console_runtime_errors=0`.
- **Regresión RUNTIME-003:** una prueba Node ocupó primero el puerto con una respuesta HTTP 200 engañosa; `--strictPort` hizo terminar no-cero al harness sin informar PASS ni iniciar Chrome, y el puerto pudo enlazarse de nuevo al finalizar. El DOM y PNG conservaron sus hashes, por lo que no se incorporaron cambios de bytes.
- **Evidencia visual:** `evidencias/ECO-101/runtime-smoke/browser-smoke.png` (800 × 450) muestra el fondo verde azulado oscuro del canvas y el texto blanco centrado del spike; el DOM preservado contiene `<canvas`.
- **Prueba productiva BOOTSTRAP-002:** dos ejecuciones de Chrome headless `156.0.8078.47` observaron título propio, shell, texto de consola secundaria y canvas 960 × 540 mostrado a 764 × 432 bajo `#game-container`; ambas generaron la PNG 800 × 450 de 33.505 bytes y cero errores JavaScript en los canales CDP acotados. La regresión con impostor HTTP 200 falló antes de Chrome/PASS y liberó el puerto.
- **Prueba offline BOOTSTRAP-003:** una build limpia servida exclusivamente desde `dist/` en `127.0.0.1:4174` produjo ocho solicitudes locales/data exitosas, canvas 960 × 540 y cero errores. Tras apagar el servidor, shell/canvas persistieron 1.000 ms; scans de 19 fuentes/configs y tres artefactos built no hallaron referencias externas ejecutables. Traversal y puerto ocupado fallaron de forma segura.
- **Estado visible BOOTSTRAP-004:** el puerto productivo tipado se mapea a un view model inmutable y texto español explícito. El arranque declara sesión no disponible por fuente validada pendiente y bloquea confirmación; estados y combinaciones inválidas fallan cerrados.
- **Corrección BOOTSTRAP-005:** la verificación independiente bloqueó `aa8354a` por lecturas hostiles repetidas/TOCTOU, schema abierto, strings sin cota, contradicción `ready` y evidencia offline obsoleta. La corrección captura seis descriptores una sola vez, limita strings a 64 unidades de código y números a enteros seguros coherentes, y hace fail-closed las invariantes. Vitest 36/36, referencias 165/165, smokes navegador/offline y negativas pasaron; el scan offline observado fue 23+3 con ocho solicitudes locales/data y cero errores.
- **Contrato BOOTSTRAP-006:** el puerto exporta el conteo esperado de seis rondas; estados activos admiten sólo índices 0–5, completado exige `6/6/null` y el bootstrap no disponible conserva `0/0/null`. Conteos 5, 7 y `MAX_SAFE_INTEGER` fallan cerrados. Vitest 50/50, typecheck, build, smokes, referencias 165/165 y scans de capas pasaron; no se añadió transición, protocolo ni ciencia.
- **Promoción BOOTSTRAP-007/ECO104-9:** el lifecycle browser-neutral canónico se movió byte-idéntico a `src/application/round-session/`, con declaración estricta adyacente; tests y host usan esa única implementación. Lifecycle 53/53, integración 18/18, referencias 165/165, Vitest 52/52, typecheck, build y smokes pasaron; offline escaneó 26+3. No existe wiring desde consola/main ni cambio semántico.
- **Promoción HOST-003:** el parser JSON Lines v1 y el validador de secuencia canónicos viven en `src/infrastructure/device-protocol/`, con declaración estricta. El simulador conserva escenarios/CLI mediante una fachada y el adaptador importa directamente infraestructura. Protocolo+adaptador 27/27, integración 18/18, referencias 165/165, Vitest 54/54, typecheck, build y smokes pasaron; offline escaneó 29+3. No existe serial, hardware ni wiring de producto.
- **Promoción HOST-004:** el adaptador fail-closed canónico vive en `src/infrastructure/host-adapter/`, con declaración estricta y snapshots desacoplados; `tools/host-adapter/` conserva CLI/pruebas mediante una fachada y la integración importa infraestructura. Adaptador+integración 33/33, referencias 165/165, Vitest 56/56, typecheck, build y smokes pasaron; offline escaneó 32+3. No existe serial, timeout, retry, hardware ni wiring en `main.ts`.
- **Integración ECO104-10/BOOTSTRAP-008:** la composición adapter+lifecycle canónica vive en aplicación y un mapper puro produce snapshots aceptados por la consola. Fuente ausente espera entrada; una entrada fresca confirmada queda lista; una secuencia consumida exige otra; desconexión exige reset y seis rondas completan. Integración 18/18, referencias 165/165, Vitest 59/59, typecheck, build y smokes pasaron; offline escaneó 36+3. `main.ts` sigue sin fuente real o manifiesto.
- **Manifiesto ECO104-11:** una única fuente profundamente inmutable en aplicación define las seis rondas y claves provisionales; reemplaza el fixture JSON y manifiestos locales de Vitest. Lifecycle+integración 71/71, referencias 165/165, Vitest 60/60, typecheck, build y smokes pasaron; offline escaneó 38+3. No define efectos, magnitudes, balance, solvencia ni wiring.
- **Loop BOOTSTRAP-009:** `main.ts` usa una fuente local explícitamente simulada, autorizada por el usuario. La interfaz etiqueta valores fijos no calibrados, separa carga/confirmación y avanza por el ciclo canónico con resolver de traza. Vitest 62/62, referencias 165/165, typecheck/build y smokes pasaron; Chrome verificó waiting→ready→ronda 2, móvil 390 px sin overflow y cero errores; offline escaneó 40+3. No acredita serial, hardware, física, energía, score, balance o gameplay.
- **Evidencia BOOTSTRAP-010:** Chrome `156.0.8078.47` ejecutó seis pares separados de carga/confirmación, observó cada transición ready/avance y terminó en `completed` con ambos controles deshabilitados. Se conservaron el check móvil de 390 px sin overflow y cero errores JavaScript acotados. Es evidencia del loop técnico simulado, no gameplay ni integración física.
- **ECO105-1:** la consola expone el último input simulado normalizado aceptado y
  seis filas de traza derivadas del estado canónico. Chrome observó valores y orden,
  terminación, 390 px sin overflow y cero errores acotados. ECO-101 sigue **EN
  CURSO**; ECO-104, ECO-105 y ECO-109 siguen **PENDIENTES**.
- **ECO105-2:** sólo una sesión simulada completada puede reiniciarse. Chrome
  observó estado fresco, foco seguro, un único canvas y un segundo ciclo idéntico
  de seis rondas; 64/64 Vitest, 165/165 referencias, typecheck, build y smokes
  pasaron. Es replay técnico local, no reconexión, gameplay, ciencia o hardware.
- **ECO105-3:** sólo `waiting-input` admite el diagnóstico fijo `{`. Chrome observó
  `MALFORMED_JSON`, cero valores aceptados, traza intacta, anuncio con conteo real,
  recuperación y confirmación separada; luego preservó dos ciclos idénticos y un
  canvas. Vitest 67/67, referencias 165/165, typecheck, build, smokes, negativas y
  scans pasaron. Es rechazo/recuperación simulada local, no sensores ni hardware.
- **ECO105-4:** la consola muestra título y pregunta guía de cada una de las seis
  rondas canónicas; snapshots con `roundIndex` e ID desalineados fallan cerrados.
  Pruebas focalizadas 56/56, Vitest 75/75, typecheck, build, navegador y offline
  pasaron; Chrome conservó dos ciclos de seis rondas, móvil 390 px y cero errores
  JavaScript. El smoke ahora exige además los seis títulos y preguntas exactos,
  ordenados, visibles y reproducidos después del reset. La revisión humana fue
  omitida por instrucción del usuario y sigue pendiente; no se añadieron efectos,
  ciencia, balance, serial o hardware.
- **ECO105-5:** título y pregunta pasan a un panel semántico independiente del
  estado operativo. El panel conserva la clave de evento, se oculta y limpia sin
  ronda activa y evita duplicar la guía en una línea técnica extensa. Pruebas
  focalizadas 58/58, Vitest 77/77, typecheck, build, Chrome, offline y regresión
  de puerto pasaron. Chrome observó las seis guías exactas, visibles, ordenadas y
  repetidas; la evaluación humana y asistiva sigue pendiente.
- **ECO105-6:** la consola muestra avisos con etiqueta, título y acción para
  snapshot inválido, reinicio, desconexión, nueva entrada y entrada rechazada.
  El texto no depende del color y se limpia en estados listo/completado. Pruebas
  focalizadas 66/66, Vitest 85/85, typecheck, build, Chrome, offline y puerto
  pasaron; Chrome observó avisos visibles y ausencia de instrucciones obsoletas.
  No son alertas de gameplay ni acreditan accesibilidad humana o asistiva.
- **ECO105-7 (2026-11-21):** la consola procesa líneas JSON Lines v1 pegadas
  manualmente mediante el adaptador host canónico. Muestra los seis valores y
  estados válido/inválido/desconectado; errores limpian los valores y la prueba
  de navegador confirma que la partida no cambia. No accede a USB/serial ni a
  hardware; `lightProxy` y los otros campos siguen sin interpretación física.
  Focalizadas 6/6, Vitest 102/102, contraste 10/10, typecheck, build, browser
  smoke 390/320, offline y regresión de puerto 1/1 pasaron. El build mantiene la
  advertencia histórica de chunk >500 kB. **ECO105-8** además limpia el búfer
  al reiniciar; Chrome verifica que no queda el texto viejo. **ECO105-9** devuelve
  foco a ese textarea y Chrome confirma `:focus-visible` con outline no nulo. El
  foco terminal del ciclo del juego se captura antes del recorrido de transporte,
  para no cruzar las dos aserciones. **ECO105-10** diferencia saludo `hello`
  aceptado y snapshot `inputs` pendiente de un mensaje inválido. Chrome y el test
  de contraste verifican estado y contraste 10.04:1. Vitest 103/103, contraste
  11/11, typecheck, build, Chrome, offline, puerto y diff-check pasaron. ECO-105
  sigue PENDIENTE de alertas causales y entrada física.
- **ECO105-11:** tras `hello(0)`, `inputs(1)`, línea JSON malformada y
  `inputs(2)`, el snapshot inválido primero limpia los seis valores y luego
  recupera el snapshot válido sin reset. La regresión del view-model y Chrome
  comprueban esta trayectoria y que la partida no cambia. Vitest 104/104,
  contraste 11/11, typecheck, build, browser 390/320, offline, puerto 1/1 y
  diff-check pasaron. La recuperación depende de que llegue la secuencia
  estrictamente esperada; saltos continúan rechazados. No valida transporte físico.
- **ECO204-1:** los controles simulados transfieren foco al siguiente paso:
  cargar→confirmar, confirmación intermedia→cargar, sexta confirmación→reiniciar,
  diagnóstico inválido→cargar y reinicio→cargar. Focalizadas 71/71, Vitest 90/90,
  typecheck, build, Chrome, offline y puerto pasaron; la captura termina con foco
  visible sobre reinicio. ECO-204 sigue pendiente de evaluación humana, lector de
  pantalla, otros navegadores y prueba de legibilidad a distancia.
- **ECO204-2:** cargar, confirmar y reiniciar permanecen como botones nativos
  dentro de un `fieldset` con leyenda visible y ayuda asociada. Focalizadas 75/75,
  Vitest 94/94, typecheck, build, Chrome, offline y puerto pasaron; Chrome
  confirmó estructura, relaciones y conservación del flujo de foco. ECO-204
  sigue pendiente de evaluación humana, árbol asistivo externo y otros navegadores.
- **ECO204-3:** un test Node sin dependencias lee el CSS y verifica seis
  combinaciones de texto contra 4.5:1 y el foco contra 3:1. Las relaciones
  observadas van de 10.04:1 a 16.71:1; contraste 7/7 y Vitest 94/94 pasaron,
  junto con typecheck, build, offline, puerto y browser aislado. El primer browser
  smoke colisionó con la regresión de puerto ejecutada en paralelo; repetido
  aisladamente pasó. No constituye conformidad WCAG ni evaluación visual humana.
- **ECO204-4:** el browser smoke evalúa después del recorrido completo anchos de
  390 y 320 px. En ambos observó estado, acciones/ayuda, controles, diagnóstico,
  canvas, observación y seis trazas contenidos, sin overflow horizontal ni
  solapamiento interactivo. Vitest 94/94, contraste 7/7, typecheck, build,
  browser, offline, puerto y diff-check pasaron. Es reflow por viewport, no zoom,
  dispositivo real, otros navegadores o aprobación WCAG.
- **Límites:** la evidencia offline prueba recursos productivos locales bajo HTTP loopback y persistencia sin refresh tras apagar el servidor; no comprueba `file://`, PWA, interacción, accesibilidad asistida, otros navegadores/equipos, rendimiento prolongado, gameplay o integración física. No consume ECO-002 ni implementa ciencia, control o score.
- **Rollback:** revertir el work unit productivo retira entrada raíz, dependencias, pruebas y vistas asociadas; el spike histórico permanece aislado y ninguna ruta científica lo importa.

### ECO-002 — gate científico bloqueado

- **Resultado:** `BLOQUEADA`; no existe baseline científica consumible por ECO-003.
- **Evidencia:** `evidencias/ECO-002/`, gate vigente `ECO-002-GATE-20261022-03`, cuatro cuadernos y diez casos documentales.
- **Completado:** inventario, análisis dimensional, fronteras, procedencia pública acotada, escenario ficticio educativo y cálculos documentales PV/HYD/WIND/BAT-BUS.
- **Bloqueos:** segunda revisión humana de citas/licencias; revisores identificados con competencia; reproducción y revisiones física, control, ambiental y calidad.
- **Integridad:** `structural`, whitespace, gate vigente y 22 slices pasan. El checksum histórico completo del gate `...-02` no reproduce porque incluyó el `registry.yaml` mutable; 18 de 19 rutas coinciden y la limitación está registrada en `validation/work-unit-4-reconciliation.md`.
- **Límites:** no hay implementación, tests del juego, validación experimental, baseline, snapshot, commit ni PR.

### ECO-001 — cierre de auditoría

- **Resultado:** `HECHA` por la rama final `blocked`; la auditoría está completa, pero `.opencode/` permanece ausente porque no se aportó ni autorizó una fuente original verificable.
- **Evidencia:** `evidencias/ECO-001/20261021T031528Z/` (`informe.md` e índice autoexcluyente `registro-evidencias.json`).
- **Git T0/T1:** `comandos/git-status-t0.txt` y `comandos/git-status-t1.txt`; se preservó `.gitignore` no rastreado y no se ejecutaron operaciones de commit, limpieza ni publicación.
- **Pruebas:** harness focalizado de auditoría, validación estructural del expediente, comprobación de hashes, referencias cruzadas y control de alcance. Los comandos y resultados exactos están en `comandos/verification-final.txt`.
- **Límites:** no existe aplicación, dependencias ni suite ejecutable del juego; no se probaron física, UI ni gameplay.
- **Riesgos abiertos registrados entonces:** recuperación de `.opencode/` dependía de una fuente original autorizada; ADR-005 seguía propuesta. El `G-ACA-01` que estaba pendiente en ECO-005 fue cerrado después por ADR-010 y corrección de alcance, no por permiso docente.

## Próxima instrucción para agente
1. Continuar pruebas automatizadas del límite de transporte y su UX, sin asignar
   rangos físicos ni consumir snapshots en reglas del juego.
2. Preparar entrada de transporte real solo después de la inspección del equipo y
   cierre G1: autenticar pinout/USB, identificar SW761, registrar host y
   responsables, revisar esquema desenergizado. No asignar GPIO ni energizar.
3. Mantener ECO-002 bloqueada hasta revisión humana competente; después registrar
   ensayo cronometrado del pitch y playtest con métricas observables.

## Plantilla a actualizar tras cada tarea
Fecha/hora, tarea ECO-###, objetivo, archivos, decisiones, resultados de pruebas (comando, salida), capturas/evidencia, riesgos, git status/commit, próximos tres pasos y bloqueos.
