# ECO-001 — Informe final G0–G9

**Run:** `20261021T031528Z`  
**Resultado:** ECO-001 cerró por la rama permitida `blocked`. G0–G4 y G9 fueron observados; G5 bloqueó la recuperación porque no existe una fuente original aportada o autorizada. `.opencode/` permanece ausente y sin cambios.

## Observed facts

- G0 matched the authorized Git root exactly.
- Node `v26.9.0`, npm `11.19.1`, Git `2.55.0`, and OpenCode `1.19.3` responded; this does not prove stack compatibility.
- T0 HEAD is `a69703444311cde5348565126a9f55b540f21fdc`; `.gitignore` and `openspec/` were pre-existing untracked work and were preserved.
- `package.json`, lockfiles, `src/`, `tests/`, `node_modules/`, and executable package scripts are absent. There is no executable game application or game test suite.
- `datos/casos_referencia.json` is reference data only, not an executed test or experimental validation.
- Manifest reconciliation contains one row for every declared entry. `.gitignore` is a pending decision and differs; all 19 `.opencode/` resources are absent; observed regular files otherwise match.
- OpenCode inventory used only mechanisms documented by local help. It discovered global resources, not the absent EcoGrid project resources.
- The official PDF hash is `acb4bc8131633b20fb5cd86ddbf1cba0607e160eac2c9da2491a2062c1ee4da4`; obligations and page evidence are in `obligaciones-pdf.csv`.

## Interpretation and pending decisions

- ADR-005 remains proposed and unratified; Node/stack compatibility is not verified.
- Page 4's Liga 4 hybrid requirement is specific and is not displaced by page 1's general format options.
- `G-ACA-01` remains pending under ECO-005; no fully digital authorization is claimed.
- `.gitignore` and `.atl/` hygiene are separate decisions. Neither was overwritten, deleted, or cleaned.

## Rama final y tareas no aplicables

La causa, dependencia, responsable y siguiente acción están en `recuperacion.json` y `brechas.csv`. Las tareas condicionales 4.2–4.8 no se ejecutaron: requieren que G5 apruebe una fuente original autorizada, condición que no ocurrió. No se presentan como completadas ni se infiere recuperación.

## Cierre G9 observado

- T1 quedó capturado en `comandos/git-status-t1.txt` y clasifica los cambios por alcance.
- Los tres documentos de cierre citan este mismo `run_id` y mantienen sin avance ECO-002, ECO-003, ECO-005, ECO-101 y Fase 1.
- ADR-005 permanece propuesta y no ratificada; `G-ACA-01` permanece pendiente bajo ECO-005.
- El índice `registro-evidencias.json` excluye su propio hash y la administración local no versionable `fixtures/**/.git/**`; enumera los demás archivos regulares y enlaces simbólicos del expediente con bytes y SHA-256, y registra la política y las rutas excluidas.
- `comandos/verification-final.txt` conserva los comandos de aceptación, salidas observadas, control de alcance y la corrección reproducible del recuento completo del candidato.

## Recuento de revisión — tarea 6.7

- Base: los documentos de cierre rastreados se comparan contra la revisión anterior a ECO-001; cada archivo presente bajo las raíces exactas del candidato se compara contra una base vacía. Rutas archivadas o ajenas, ECO-002 y `.gitignore` quedan fuera del candidato.
- Política: cuentan adiciones más eliminaciones de los archivos de texto del candidato, incluidas salidas crudas y scripts. Se excluye el índice autoexcluyente porque se regenera después del recuento; la administración local no versionable `fixtures/**/.git/**` se ignora por política y el harness usa repositorios temporales.
- Comando exacto: `python3 evidencias/ECO-001/20261021T031528Z/comandos/candidate-line-count.py`. Su stdout, stderr y código de salida se conservan en archivos homónimos bajo `comandos/`.
- Totales finales: documentos de cierre rastreados 35; núcleo del expediente 189; comandos y salidas crudas 15,664; fixtures de texto 28; total general 15,916 líneas cambiadas en 69 archivos. El índice generado queda excluido y ninguna administración local `.git/**` forma parte del candidato; no se excluyó evidencia cruda de texto.
- Evaluación: el candidato completo supera el umbral fijo de 400 líneas. Se conserva `auto-chain` con `stacked-to-main` ya seleccionado.
- Límites propuestos, sin afirmar commits ni PRs existentes: slice 1 = G0–G5 y evidencia base; slice 2 = G6–G8 únicamente si una fuente original autorizada habilita la recuperación; slice 3 = G9 y cierre documental. La corrección actual pertenece a la evidencia de aceptación de slice 3.

## Referencias del expediente

| Evidencia | Propósito |
|---|---|
| `manifiesto.csv` | Conciliación 1:1 de las 45 entradas esperadas. |
| `opencode.csv` | Recursos declarados, presentes y descubiertos por origen. |
| `obligaciones-pdf.csv` | Obligaciones académicas con página y extracto. |
| `brechas.csv` | Estado, responsable, dependencia y siguiente acción. |
| `recuperacion.json` | Gate G5 y estado final `blocked`, sin escrituras objetivo. |
| `registro-evidencias.json` | Índice autoexcluyente de integridad. |

## Work Unit Evidence acumulada

| Evidence | Result |
|---|---|
| Focused validation | `python3 evidencias/ECO-001/20261021T031528Z/comandos/focused-validation.py`; exit 0; raw stdout/stderr and exact command are preserved under `comandos/focused-validation.*`; 11 evidence checks passed and 5 fixture contracts matched without claiming runtime behavior. |
| Runtime harness | G0–G5 audit sequence executed from the authorized root without installs or writes outside this dossier/planning artifacts. Exact OpenCode commands, exit codes, raw stdout and raw stderr are preserved as `comandos/opencode-*.{command,stdout,stderr}.txt`. No product runtime exists. |
| Rollback boundary | Remove only `evidencias/ECO-001/20261021T031528Z/` and the Work Unit 1 task/apply-progress checkbox edits; `.opencode/` and closure documentation are untouched. |
| Work Unit 3 focused validation | Los comandos exactos y resultados finales están en `comandos/verification-final.txt`; incluyen validación focalizada, estructura, hashes, referencias cruzadas y alcance. |
| Work Unit 3 runtime harness | Revisión integral G9 del expediente con `final_state: blocked` y `run_id` cruzado. No existe frontera de runtime del producto porque no hay aplicación ejecutable. |
| Work Unit 3 rollback boundary | Revertir únicamente las ediciones de cierre en los tres documentos aprobados, `tasks.md`, `apply-progress.md` y los archivos G9 del expediente; conservar la evidencia válida de Work Unit 1. |
| Task 6.7 focused validation | `python3 evidencias/ECO-001/20261021T031528Z/comandos/candidate-line-count.py --assert-recorded`; exit 0; 69 archivos cubiertos, 15,916 líneas cambiadas y umbral 400 superado. |
| Task 6.7 runtime harness | Recuento real del candidato desde la raíz Git autorizada; no existe frontera de runtime del producto. |
| Task 6.7 rollback boundary | Revertir solo el script y sus cuatro recibos, esta sección, la evidencia 6.7 en `tasks.md`, `apply-progress.md`, `verification-final.txt` y el índice regenerado. |
