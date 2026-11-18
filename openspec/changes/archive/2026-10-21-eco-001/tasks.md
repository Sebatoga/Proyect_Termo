# Tareas: ECO-001 — Auditoría del entorno y recuperación mínima del kit

## Review Workload Forecast

| Campo | Valor |
|---|---|
| Líneas modificadas de autoría estimadas | 300–390 en la rama bloqueada; 550–850 si se recuperan y versionan los 19 recursos exactos de `.opencode/` |
| Riesgo del presupuesto de 400 líneas | High |
| PRs encadenados recomendados | Yes, solo si la rama recuperada supera el presupuesto; la rama bloqueada debe permanecer en un único PR cohesivo |
| División sugerida | PR 1: auditoría y evidencia T0/G0–G5 → PR 2 condicional: recuperación verificada G6–G8 → PR 3: cierre documental G9 |
| Estrategia de entrega | auto-chain |
| Estrategia de cadena | `stacked-to-main`, seleccionada tras confirmar que el candidato completo supera 400 líneas |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: stacked-to-main
400-line budget risk: High

El recuento usa `HEAD` como base para archivos rastreados y una base vacía para cada archivo no rastreado dentro de `openspec/changes/eco-001/` y `evidencias/ECO-001/20261021T031528Z/`. Todo texto de evidencia, incluidas salidas crudas e índice generado, cuenta para el tamaño real de revisión. Solo se excluyen del umbral los archivos binarios y la administración `.git/**` generada por repositorios fixture; cada exclusión se enumera con motivo en la salida preservada. El resultado real exige la estrategia ya seleccionada `stacked-to-main`; esto define límites propuestos de revisión, no afirma que existan commits ni PRs.

### Unidades de trabajo sugeridas

| Unidad | Objetivo | PR probable | Comando de prueba focalizado | Harness de ejecución | Límite de rollback |
|---|---|---|---|---|---|
| 1 | Capturar G0–G5: línea base, pruebas RED, manifiesto, OpenCode, PDF y gate de fuente | PR 1 o PR único | Recalcular por muestreo bytes/SHA-256 y validar cobertura 1:1 de `manifiesto.csv` contra el manifiesto | Ejecutar la secuencia documentada G0–G5 desde la raíz autorizada, sin instalar ni escribir fuera del expediente | Retirar únicamente `evidencias/ECO-001/<run_id>/`; no tocar `.opencode/` ni documentación de cierre |
| 2 | Ejecutar G6–G8 solo con fuente autorizada e íntegra, o registrar la rama bloqueada | PR 2 condicional | Repetir los casos de colisión, interrupción, poshash y redescubrimiento en repositorios desechables; después comparar cada ruta candidata | Fuente local aportada/autorizada + checkout real, o `N/A` cuando G5 termina bloqueado porque no existe fuente autorizada | Solo identidades creadas y registradas como `completed` por el diario de ese `run_id`; ambigüedad implica `manual_intervention`, nunca borrado |
| 3 | Cerrar G9, cruzar evidencias y actualizar estado, backlog y riesgos | PR 3 o incluido en PR único | Validación estructural del expediente, `git diff --check` y clasificación del diff T0/T1 por ruta | Revisión del expediente completo con `final_state` resuelto y el mismo `run_id` citado en los tres documentos | Revertir solo las ediciones de cierre; conservar el expediente y cualquier recuperación ya verificada |

## Fase 1: Autoridad, expediente y línea base T0

- [x] 1.1 Validar G0 resolviendo la raíz con `git rev-parse --show-toplevel`, exigir igualdad exacta con la raíz autorizada y registrar comando, `cwd`, salida, error y código de salida en `evidencias/ECO-001/<run_id>/comandos/git-root.txt`; detener sin crear el expediente si la raíz no coincide.
- [x] 1.2 Crear la estructura mínima `evidencias/ECO-001/<run_id>/` con `informe.md`, `registro-evidencias.json`, `comandos/`, `manifiesto.csv`, `opencode.csv`, `obligaciones-pdf.csv`, `brechas.csv` y `recuperacion.json`, usando el esquema `ecogrid.eco-001.evidence/v1`, marcas ISO-8601 y un `run_id` único; no incluir secretos ni variables de entorno.
- [x] 1.3 Capturar en `evidencias/ECO-001/<run_id>/comandos/` las versiones de Node, npm, Git y OpenCode, preservando por herramienta el comando exacto, salida cruda, stderr y código de salida; registrar `unavailable` o `not_verifiable` cuando corresponda y no inferir compatibilidad.
- [x] 1.4 Capturar T0 en `evidencias/ECO-001/<run_id>/comandos/git-status-t0.txt`: HEAD u OID nulo, estado porcelain v2, cambios staged, unstaged y untracked por separado, sin ejecutar `add`, `commit`, `stash`, `clean`, `reset`, `checkout` ni `restore`.
- [x] 1.5 Inventariar en `evidencias/ECO-001/<run_id>/informe.md` la presencia o ausencia separada de `package.json` (read-only), lockfiles (read-only), `src/` (read-only), `tests/` (read-only), dependencias y scripts ejecutables; clasificar `datos/casos_referencia.json` (read-only) únicamente como datos de referencia y declarar que no existe aplicación ni suite ejecutable cuando corresponda.
- [x] 1.6 Registrar en `evidencias/ECO-001/<run_id>/brechas.csv` cualquier diferencia observada en `.gitignore` (read-only) y `.atl/` (read-only) como acción separada con estado, responsable, dependencia y siguiente acción, sin limpiar, sobrescribir ni borrar esas rutas.

## Fase 2: Pruebas RED de fronteras y fallos seguros

Todas las pruebas de esta fase deben ejecutarse antes de cualquier lógica reutilizable de escritura y únicamente en repositorios locales desechables bajo `evidencias/ECO-001/<run_id>/fixtures/`. Cada resultado, incluido el fallo esperado, debe quedar enlazado desde `registro-evidencias.json`.

- [x] 2.1 RED — Crear en `evidencias/ECO-001/<run_id>/fixtures/rutas-documentales/` casos `requirements.txt`, `CMakeLists.txt`, Markdown/MDX ejecutable y `README.sh`; demostrar para cada clase que su presencia solo se inventaría por ruta/tipo, nunca se ejecuta ni convierte el checkout en aplicación funcional, y que enlaces simbólicos o tipos especiales se clasifican como discrepancia.
- [x] 2.2 RED — Crear repositorios desechables en `evidencias/ECO-001/<run_id>/fixtures/raiz-git/` para raíz correcta, `cwd` hijo, `cwd` padre, ruta relativa ambigua, ruta absoluta de otro repositorio y `git -C` dirigido a otro repositorio; comprobar que solo raíz resuelta = raíz autorizada continúa y que todos los demás casos se detienen antes de escribir.
- [x] 2.3 RED — Crear fixtures en `evidencias/ECO-001/<run_id>/fixtures/estado-git/` con cambio staged, unstaged, ambos, untracked e índice vacío; comprobar que cada estado se registra por separado y que HEAD, índice y worktree permanecen idénticos tras la captura.
- [x] 2.4 RED — Crear casos en `evidencias/ECO-001/<run_id>/fixtures/manifiesto/` para JSON inválido, ruta absoluta, segmento `..`, escape de raíz, archivo ausente, bytes/hash incorrectos y enlace simbólico; comprobar rechazo o estado `no_verificable`/`discrepante` sin corregir archivos.
- [x] 2.5 RED — Crear casos en `evidencias/ECO-001/<run_id>/fixtures/fuente/` para procedencia no autorizada, faltantes, hash diferente, archivos adicionales y colisión de destino; comprobar que faltantes/discrepancias/colisiones bloquean el conjunto completo y que los extras solo se registran y excluyen.
- [x] 2.6 RED — Simular en `evidencias/ECO-001/<run_id>/fixtures/transaccion/` un fallo después de `intent`, un fallo a mitad de copia, un destino alterado antes del rollback y un `completed` cuya identidad cambió; comprobar reconciliación por identidad, rollback solo de creaciones propias y `manual_intervention` + `blocked` ante cualquier ambigüedad.
- [x] 2.7 RED — Simular en `evidencias/ECO-001/<run_id>/fixtures/opencode/` una versión sin mecanismo enumerable y un redescubrimiento fallido; comprobar que el primer caso termina `not_verifiable` y que el segundo activa rollback acotado y estado final `blocked`, sin sustituir observación por inventario esperado.
- [x] 2.8 RED — Crear en `evidencias/ECO-001/<run_id>/fixtures/pdf/` una matriz con una categoría obligatoria ausente; comprobar que el gate de cierre permanece abierto y la afirmación queda `no_verificada_en_fuente_primaria` en lugar de completarse desde documentación secundaria.

## Fase 3: Auditoría reproducible G2–G4

- [x] 3.1 Validar `MANIFIESTO_ARCHIVOS.json` (read-only) sin mutarlo y generar `evidencias/ECO-001/<run_id>/manifiesto.csv` con exactamente una fila por entrada: ruta, tipo, bytes y SHA-256 esperados; tipo, bytes y SHA-256 observados; estado; evidencia. Normalizar rutas relativas, rechazar escapes y no seguir enlaces simbólicos.
- [x] 3.2 Verificar cobertura 1:1 de `evidencias/ECO-001/<run_id>/manifiesto.csv` contra `MANIFIESTO_ARCHIVOS.json` (read-only), recalcular de forma independiente una muestra de archivos presentes y mantener visibles `.opencode/`, `.gitignore` y `.atl/` como ausentes, discrepantes o pendientes de decisión según la observación real.
- [x] 3.3 Capturar `opencode --version` y la ayuda local en `evidencias/ECO-001/<run_id>/comandos/`; seleccionar exclusivamente el mecanismo de enumeración documentado por esa versión y conservar comando/procedimiento, salida y error, sin inventar flags.
- [x] 3.4 Conciliar `opencode.json` (read-only), el disco y el descubrimiento observado en `evidencias/ECO-001/<run_id>/opencode.csv`: enumerar agentes, skills y comandos por separado, indicar origen global o de proyecto, registrar recursos esperados no descubiertos y mantener diferenciadas sintaxis válida, presencia física y descubrimiento real.
- [x] 3.5 Identificar `referencias/Proyecto Termodinamica y MF 2026-2.pdf` (read-only) por ruta y SHA-256 y completar `evidencias/ECO-001/<run_id>/obligaciones-pdf.csv` con categoría, página, sección, extracto fiel, interpretación y estado para termodinámica, fluidos, hipótesis/I-O/ecuaciones/unidades/límites/validación, incidencia en el juego, electrónica, tercera ingeniería, máximo tres integrantes, IA, pitch de siete minutos y sus cinco contenidos, evidencias finales, pruebas normales/límite, código, operación, seguridad, contribuciones, producto funcional y póster.
- [x] 3.6 Registrar en `evidencias/ECO-001/<run_id>/obligaciones-pdf.csv` que la exigencia específica de Liga 4 en página 4 prevalece sobre la opción general de página 1, que las fechas sugeridas no son confirmadas y que `G-ACA-01` continúa pendiente bajo ECO-005; cualquier posible respuesta docente se deriva a ECO-005 sin validarla ni cambiar el gate.
- [x] 3.7 Completar en `evidencias/ECO-001/<run_id>/brechas.csv` cada brecha de G0–G4 con estado, responsable, dependencia y siguiente acción, incluidas compatibilidad Node/stack `no verificada`, ADR-005 `propuesto, no ratificado` y trabajo posterior de ECO-002, ECO-003 y ECO-101, sin crear tareas de implementación de esas áreas.

## Fase 4: Gate de fuente y recuperación condicional G5–G8

- [x] 4.1 Registrar en `evidencias/ECO-001/<run_id>/recuperacion.json` la procedencia y referencia de autorización explícita de la fuente original; si no existe acceso local aportado o autorizado, resolver inmediatamente `preflight: blocked` y `final_state: blocked`, consignar causa, dependencia, responsable y siguiente acción, y mantener `.opencode/` sin cambios.
- [ ] 4.2 Si hay fuente autorizada, comparar fuera de las rutas objetivo todas las entradas esperadas de `.opencode/` de `MANIFIESTO_ARCHIVOS.json` (read-only) contra la fuente: exigir conjunto completo con ruta relativa, archivo regular, bytes y SHA-256 coincidentes; registrar y excluir extras. Cualquier faltante, discrepancia, tipo especial o escape resuelve `blocked` antes de escribir.
- [ ] 4.3 Revalidar HEAD, estado Git y ausencia de cada destino `.opencode/agents/*.md`, `.opencode/commands/*.md` y `.opencode/skills/*/SKILL.md`; bloquear el conjunto completo ante una colisión o cambio concurrente en HEAD/rutas objetivo, sin sobrescribir archivos preexistentes.
- [ ] 4.4 Confirmar en un repositorio desechable que el entorno ofrece preparación privada en el mismo sistema de archivos, sincronización durable y creación atómica `no-replace`; si no puede demostrarse, registrar el fallo en `evidencias/ECO-001/<run_id>/recuperacion.json` y resolver la rama `blocked` sin tocar `.opencode/`.
- [ ] 4.5 Solo con G5–G6 aprobados, recuperar exclusivamente `.opencode/agents/*.md`, `.opencode/commands/*.md` y `.opencode/skills/*/SKILL.md` verificados: para cada directorio/archivo persistir y sincronizar `intent` en `evidencias/ECO-001/<run_id>/recuperacion.json`, crear sin reemplazo, sincronizar el directorio objetivo y persistir `completed` con identidad, bytes y SHA-256 instalados.
- [ ] 4.6 Ante interrupción o fallo, reconciliar `evidencias/ECO-001/<run_id>/recuperacion.json`: completar solo una intención cuya identidad temporal/destino y hash sean inequívocos; retirar únicamente temporales o destinos cuya identidad propia esté demostrada; conservar destinos divergentes y resolver `manual_intervention` + `final_state: blocked`; retirar directorios propios solo si están vacíos.
- [ ] 4.7 Recalcular tipo, bytes y SHA-256 de todo archivo recuperado en `.opencode/` y abrir una sesión nueva de OpenCode con la misma raíz autorizada para repetir el inventario en `evidencias/ECO-001/<run_id>/opencode.csv`; declarar `recovered_verified` solo si todos los poshashes y los agentes, skills y comandos esperados pasan.
- [ ] 4.8 Si falla el poscheck o redescubrimiento, registrar la causa en `evidencias/ECO-001/<run_id>/recuperacion.json`, ejecutar rollback con la regla de identidad propia, capturar T1 y resolver siempre `final_state: blocked` después de `rolled_back` o `manual_intervention`; nunca borrar la carpeta completa ni afectar archivos preexistentes.

## Fase 5: Cierre documental G9

- [x] 5.1 Capturar T1 en `evidencias/ECO-001/<run_id>/comandos/git-status-t1.txt`, comparar T0/T1 por ruta y clasificar cada cambio como evidencia, recuperación condicional o cierre; fallar el gate si aparecen paquetes, app, física, UI, gameplay, Fase 1 u otros cambios fuera de alcance.
- [x] 5.2 Completar `evidencias/ECO-001/<run_id>/informe.md` separando hecho observado, interpretación, no verificable y decisión pendiente; incluir comandos, resultados, rama final exacta (`recovered_verified` o `blocked`), brechas, responsables, dependencias, siguientes acciones y enlaces internos al expediente.
- [x] 5.3 Finalizar `evidencias/ECO-001/<run_id>/registro-evidencias.json`: validar enums y referencias, indexar ruta relativa, bytes y SHA-256 de todos los archivos del expediente excepto el propio índice, declarar `self_hash_excluded: true`, fijar `finished_at` y rechazar referencias inexistentes o secretos.
- [x] 5.4 Actualizar `docs/08_ESTADO_DEL_PROYECTO.md` con fecha/hora, ECO-001, objetivo, archivos, rama final, comandos/resultados reales, evidencia por `run_id`, Git T0/T1, riesgos, relevo y próximos pasos; no declarar entorno listo, compatibilidad o pruebas del juego.
- [x] 5.5 Actualizar `docs/04_BACKLOG_Y_FASES.md` únicamente después del checklist completo: marcar ECO-001 `HECHA` tanto para recuperación verificada como para bloqueo trazable; mantenerla abierta si falta evidencia y no modificar estados de ECO-002, ECO-003, ECO-005, ECO-101 ni Fase 1.
- [x] 5.6 Actualizar `docs/00_DECISIONES_Y_RIESGOS.md` con hallazgos y riesgos observados, manteniendo ADR-005 no ratificado y `G-ACA-01` pendiente bajo ECO-005; no registrar autorización docente ni ratificación del stack.

## Fase 6: Verificación final y aceptación

- [x] 6.1 Validar estructuralmente `evidencias/ECO-001/<run_id>/registro-evidencias.json`, verificar que cada referencia existe, que `final_state` no es nulo y que cada archivo indexado coincide en bytes/SHA-256; conservar la salida de la verificación en `evidencias/ECO-001/<run_id>/comandos/`.
- [x] 6.2 Recontar `evidencias/ECO-001/<run_id>/manifiesto.csv` contra `MANIFIESTO_ARCHIVOS.json` (read-only), muestrear hashes de forma independiente y comprobar que discrepancias, `.gitignore`, `.atl/` y `.opencode/` no fueron omitidos ni corregidos implícitamente.
- [x] 6.3 Revisar `evidencias/ECO-001/<run_id>/opencode.csv` contra las transcripciones de versión/ayuda/sesión, verificando origen global/proyecto y que un resultado `not_verifiable` no haya sido reemplazado por el inventario del manifiesto.
- [x] 6.4 Revisar `evidencias/ECO-001/<run_id>/obligaciones-pdf.csv` contra `referencias/Proyecto Termodinamica y MF 2026-2.pdf` (read-only), exigiendo página y extracto para cada categoría; cualquier categoría faltante mantiene ECO-001 abierto.
- [x] 6.5 Cruzar el mismo `run_id` y rama final entre `evidencias/ECO-001/<run_id>/informe.md`, `docs/08_ESTADO_DEL_PROYECTO.md`, `docs/04_BACKLOG_Y_FASES.md` y `docs/00_DECISIONES_Y_RIESGOS.md`; verificar que toda brecha tenga responsable, dependencia y siguiente acción.
- [x] 6.6 Ejecutar `git diff --check`, inspeccionar el diff T0/T1 y confirmar ausencia de `package.json`, lockfiles, `src/`, `tests/`, dependencias, código del juego, cambios científicos/UI, operaciones remotas, commits y autorizaciones/ratificaciones fuera de alcance; registrar comando y salida en `evidencias/ECO-001/<run_id>/comandos/verification-final.txt`.
- [x] 6.7 Calcular contra `HEAD`/base vacía las adiciones más eliminaciones de todo el candidato ECO-001, conservar comando y salidas reproducibles, evaluar el umbral fijo de 400 y, al superarlo, documentar `stacked-to-main` y los límites propuestos de las unidades 1–3 sin afirmar que existen commits o PRs.
