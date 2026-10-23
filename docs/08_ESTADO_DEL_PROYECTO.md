# ESTADO / RELEVO OBLIGATORIO ENTRE SESIONES

**Última actualización:** 2026-10-22 (canvas del spike verificado en Chrome headless)
**Fase actual:** F0, planificación y contrato científico.
**Tarea en curso:** ECO-002 bloqueada con trazabilidad en `ECO-002-GATE-20261022-03`; spike auxiliar de ECO-101 ejecutado sin cambiar su estado.
**Juego ejecutable:** NO EXISTE AÚN. Solo existe un spike descartable de runtime; no es la aplicación ni contiene gameplay o dominio científico.
**Herramientas verificadas aquí:** Node `v26.9.0`, npm `11.19.1`, Git `2.55.0` y OpenCode `1.19.3` respondieron durante ECO-001. El spike verificó Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`; Chrome headless `156.0.8078.47` creó y renderizó el canvas en este entorno, sin ratificar el stack.

## Lo que está decidido
- EcoGrid: Ciudad al Límite; Liga 4, renovables; videojuego digital deseado.
- Integración de termodinámica + mecánica de fluidos + electrónica + ambiental.
- Priorizar una rebanada vertical y pruebas de cálculo.

## Lo que sigue pendiente
- Permiso del docente para sustituir reto híbrido por digital.
- Ratificar stack/plataforma por el equipo.
- Referencias bibliográficas de parámetros físicos específicos y calibración.
- Resolver diseño del score ecológico para evitar incentivo trivial.
- Crear app y código ejecutable F1.
- Asignar miembros, roles, fechas académicas definitivas.

## Últimos cambios y pruebas
- Generado kit: documentación, agentes, skills, comandos y datos de referencia. No se han implementado ni ejecutado tests del videojuego; el único test de código cubre metadata pura del spike.

### ECO-101 — spike de compatibilidad, tarea aún pendiente

- **Resultado:** instalación y scripts operativos dentro de `spikes/runtime-smoke/`; ECO-101 continúa `PENDIENTE` porque no se creó el bootstrap de producción.
- **Versiones finales:** Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2` y Vitest `5.0.5`; lockfile npm v3 rastreable.
- **Pruebas:** `npm run typecheck` sin diagnósticos; `npm run test` con 1 archivo y 1 test aprobados; `npm run build` completado con advertencia de chunk de `1,196.09 kB`; el smoke reproducible inició y detuvo Vite, y Chrome headless `156.0.8078.47` reportó `canvas=true`, captura PNG de `9967` bytes y `console_runtime_errors=0`.
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
- **Riesgos abiertos:** recuperación de `.opencode/` depende de una fuente original autorizada; compatibilidad Node/stack no verificada; ADR-005 sigue propuesta y no ratificada; `G-ACA-01` continúa pendiente en ECO-005.

## Próxima instrucción para agente
No promover ECO-002 ni iniciar ECO-003 con sus elementos bloqueados. Para destrabarla, registrar personas revisoras reales y su competencia, completar revisión independiente de citas/licencias y ejecutar las revisiones física, de control, ambiental y de calidad. Si el equipo decide avanzar por otra tarea F0 mientras consigue revisores, mantener visible este bloqueo.

## Plantilla a actualizar tras cada tarea
Fecha/hora, tarea ECO-###, objetivo, archivos, decisiones, resultados de pruebas (comando, salida), capturas/evidencia, riesgos, git status/commit, próximos tres pasos y bloqueos.
