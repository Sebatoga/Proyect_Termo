# ESTADO / RELEVO OBLIGATORIO ENTRE SESIONES

**Última actualización:** 2026-11-03 (cierre técnico del spike HOST-002 sin hardware).
**Fase actual:** F0, contrato híbrido y preparación del gate de inventario.
**Tarea vigente:** ECO108-1 y ECO108-2 completaron la preparación documental; ECO-108 y G1 siguen abiertos. Compra, recepción y banco permanecen pendientes. ECO-002 sigue BLOQUEADA.
**Producto/hardware:** NO EXISTEN AÚN. No hay tablero, componentes confirmados, firmware, calibración, protocolo integrado, carcasa ni pruebas HIL.
**Herramientas verificadas aquí:** Node `v26.9.0`, npm `11.19.1`, Git `2.55.0` y OpenCode `1.19.3` respondieron durante ECO-001. El spike verificó Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`; Chrome headless `156.0.8078.47` creó y renderizó el canvas en este entorno, sin ratificar el stack.

## Lo que está decidido
- EcoGrid: Ciudad al Límite; Liga 4; juego cooperativo de mesa con electrónica y consola local secundaria.
- Integración de termodinámica + mecánica de fluidos + electrónica + ambiental.
- MVP de cuatro semanas: PV térmico, hidro de pasada, batería/bus y seis rondas en 8–12 minutos.
- El 2026-10-27 se aprobó la BOM separada como objetivo de preparación para
  ECO-108, con presupuesto objetivo COP 83.000–90.000 más envío. No autoriza
  compra ni acredita posesión, recepción, calibración o prueba física.

## Lo que sigue pendiente
- Inventario real, datasheets aplicables, presupuesto final y componentes disponibles; existe una [BOM candidata](19_BOM_ECO_108.md), no una selección física.
- Responsables, fechas, acceso a fabricación y dimensiones/materiales del tablero.
- Ratificar host de consola y stack productivo después del inventario.
- Referencias bibliográficas de parámetros físicos específicos y calibración.
- Resolver diseño del score ecológico para evitar incentivo trivial.
- Ejecutar banco, firmware/protocolo, calibración, montaje y seguridad; hoy son planes, no evidencia.

## Gate humano inmediato — G1

El equipo debe registrar inventario real y decidir componentes, presupuesto, roles y fechas. ECO108-1 preparó una BOM candidata y ECO108-2 dejó [formularios vacíos](../evidencias/ECO-108/README.md). El próximo paso real es que una persona revalide precio/stock/envío y autorice la compra; después se completan recepción y banco con evidencia observada. G1 no está cerrado. Luego dependen ECO-109 (firmware/calibración/USB serial) y ECO-110 (tablero/controles/LEDs/carcasa).

## Últimos cambios y pruebas
- El kit declaró documentación, agentes, skills, comandos y datos de referencia, pero `.opencode/` continúa ausente. No se han ejecutado tests del producto híbrido; las pruebas de código actuales cubren metadata del spike y el transporte simulado BOOT-003.

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

### ECO-101 — spike de compatibilidad, tarea aún pendiente

- **Resultado:** instalación y scripts operativos dentro de `spikes/runtime-smoke/`; ECO-101 continúa `PENDIENTE` porque no se creó el bootstrap de producción.
- **Versiones finales:** Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`; lockfile npm v3 rastreable.
- **Pruebas:** `npm run typecheck` sin diagnósticos; `npm run test` con 1 archivo y 1 test aprobados; `npm run build` completado con advertencia de chunk de `1,196.09 kB`; el smoke reproducible inició Vite exclusivamente en `127.0.0.1:5173`, comprobó su señal de readiness, HTTP 200 y el marcador propio mientras el hijo seguía vivo, y Chrome headless `156.0.8078.47` reportó `canvas=true`, captura PNG de `9967` bytes y `console_runtime_errors=0`.
- **Regresión RUNTIME-003:** una prueba Node ocupó primero el puerto con una respuesta HTTP 200 engañosa; `--strictPort` hizo terminar no-cero al harness sin informar PASS ni iniciar Chrome, y el puerto pudo enlazarse de nuevo al finalizar. El DOM y PNG conservaron sus hashes, por lo que no se incorporaron cambios de bytes.
- **Evidencia visual:** `evidencias/ECO-101/runtime-smoke/browser-smoke.png` (800 × 450) muestra el fondo verde azulado oscuro del canvas y el texto blanco centrado del spike; el DOM preservado contiene `<canvas`.
- **Límites:** canvas y el cuadro estático quedaron verificados solo en Chrome headless y en este entorno; no se comprobó Firefox, interacción, compatibilidad general, rendimiento prolongado, accesibilidad ni gameplay. El spike no consume ECO-002, no crea baseline, no ratifica ADR-005 y no implementa ciencia, control, score ni gameplay.
- **Rollback:** eliminar `spikes/runtime-smoke/`; ninguna ruta de producción o científica lo importa.

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
