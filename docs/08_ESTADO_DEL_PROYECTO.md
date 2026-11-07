# ESTADO / RELEVO OBLIGATORIO ENTRE SESIONES

**Última actualización:** 2026-11-07 (HOST-003 promovió el parser canónico; ECO-101 sigue en curso).
**Fase actual:** F0, contrato híbrido y preparación del gate de inventario.
**Tarea vigente:** ECO-101 establece en paralelo el bootstrap técnico de la consola local secundaria. ECO-108 y G1 siguen abiertos; ECO-002 continúa BLOQUEADA y el bootstrap no consume sus modelos.
**Producto físico/hardware:** NO EXISTE AÚN. Hay un bootstrap técnico de consola, pero no tablero, componentes confirmados, firmware, calibración, protocolo integrado, carcasa ni pruebas HIL.
**Herramientas verificadas aquí:** Node `v26.9.0`, npm `11.19.1`, Git `2.55.0` y OpenCode `1.19.3` respondieron durante ECO-001. ADR-005 adopta Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`; Chrome headless `156.0.8078.47` verificó el canvas del spike histórico, no el bootstrap productivo.

## Lo que está decidido
- EcoGrid: Ciudad al Límite; Liga 4; juego cooperativo de mesa con electrónica y consola local secundaria.
- Integración de termodinámica + mecánica de fluidos + electrónica + ambiental.
- MVP de cuatro semanas: PV térmico, hidro de pasada, batería/bus y seis rondas en 8–12 minutos.
- Stack de consola secundaria: TypeScript, Phaser 3, Vite y Vitest en versiones exactas; Playwright fuera del primer corte.
- El 2026-10-27 se aprobó la BOM separada como objetivo de preparación para
  ECO-108, con presupuesto objetivo COP 83.000–90.000 más envío. No autoriza
  compra ni acredita posesión, recepción, calibración o prueba física.

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

El equipo debe registrar inventario real y decidir componentes, presupuesto, roles y fechas. ECO108-1 preparó una BOM candidata, ECO108-2 dejó [formularios vacíos](../evidencias/ECO-108/README.md), ECO108-3 separó [hechos visibles y pendientes](../evidencias/ECO-108/preparacion-referencias-2026-11-03.md) y ECO108-4 registró la elección humana de 1 m. El próximo paso real es revalidar esa variante, precio, stock y envío, y obtener autorización humana de compra; después se completan recepción y banco con evidencia observada. G1 no está cerrado. Luego dependen ECO-109 (firmware/calibración/USB serial) y ECO-110 (tablero/controles/LEDs/carcasa).

## Últimos cambios y pruebas
- El kit declaró documentación, agentes, skills, comandos y datos de referencia, pero `.opencode/` continúa ausente. No se han ejecutado tests del producto híbrido; las pruebas actuales del bootstrap cubren sólo metadata y configuración pura, además de las referencias aisladas existentes.

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
Solicitar evidencia humana de G1: inventario, componentes, presupuesto, roles y fechas. No promover ECO-002 ni presentar su expediente como baseline; su revisión independiente continúa en paralelo. No convertir el spike ECO-101 en producto por inferencia.

## Plantilla a actualizar tras cada tarea
Fecha/hora, tarea ECO-###, objetivo, archivos, decisiones, resultados de pruebas (comando, salida), capturas/evidencia, riesgos, git status/commit, próximos tres pasos y bloqueos.
