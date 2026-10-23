# ECO-002 Work Unit 2 provenance-revision validation

## Scope

Metadata-only provenance revision using source facts supplied as rechecked on 2026-10-22. No further web work, source copy, model implementation, package, baseline, commit, push, PR, or remote write occurred.

## Focused checks

### Gate checksums

- Command: `sha256sum -c evidencias/ECO-002/gate-evaluations/ECO-002-GATE-20261022-01/checksums.sha256`
- Exit: `0`.
- Result: PASS; all 11 listed files reported `La suma coincide`.

### Complete untracked text whitespace

- Command: `evidencias/ECO-002/validation/validate_work_unit_1.py whitespace`
- Exit: `0`; stderr empty.
- Stdout: `WHITESPACE files=46 path_set_sha256=a84d68b63dbe45e92a9c1beab0fa42cbeda458fa61f6e7b7ad82f2f2e3124f8f violations=0` and `WHITESPACE_VALIDATION=PASS`.

### Supplemental tracked-diff whitespace

- Command: `git diff --check -- evidencias/ECO-002 openspec/changes/eco-002`
- Exit: `0`; stdout/stderr empty.

### Forbidden output absence

- Command: `test ! -d evidencias/ECO-002/source-copies && test ! -d evidencias/ECO-002/baselines && test ! -d evidencias/ECO-002/gate-evaluations/ECO-002-GATE-20261022-01/snapshot`
- Exit: `0`; stdout/stderr empty.

### Review slices and task scope

- Command: repository-local `python3 -c` validation of JSON chain fields, unique `non_overlap_key`, budgets, and `tasks.md` checkboxes.
- Exit: `0`; stderr empty.
- Result: `SLICES ECO-002-WU2-S13=159 ECO-002-WU2-S14=80 ECO-002-WU2-S15=141 ECO-002-WU2-S16=369 ECO-002-WU2-S17=268 NON_OVERLAP=PASS`.
- Result: `TASKS completed=29 tasks_4_6_4_7=false phases_5_6=false PASS`.

## Runtime harness

N/A. This documentary revision has no application/runtime boundary. The real scenario recomputes immutable gate hashes and confirms the blocked gate, metadata-only retention, unchanged task boundary, and absence of source copies, baseline, and snapshot.

## Scientific limitations retained

- USBR/DOE do not close the exact hydro SI equation or net-head citation.
- Sandia/PVWatts do not provide one universal PV validity range or universal coefficients; historical PVPMC branches are not mixed.
- WINDExchange requires a turbine-specific power curve and site distribution; no universal equipment values are selected.
- Tasks 4.6–4.7 remain incomplete; phases 5–6 were not executed.

## Rollback boundary

Revert only `ACCESS-002`, `SRC-014`–`SRC-020`, `PROV-013`–`PROV-017`, the five new inventory records, latest gap revisions, `ECO-002-GATE-20261022-01`, the registry pointer, slices S13–S17, this receipt, and the merged apply-progress revision. Preserve all earlier gates, source revisions, validated slices, completed tasks 1.1–4.5, and unchecked tasks 4.6–6.11.

## Verification limit

General YAML parsing remains `NO VERIFICADO`; no package was installed. Checks validate exact bytes, whitespace, chain metadata, task scope, and forbidden-output absence without claiming scientific review, calculation, experimental validation, or baseline acceptance.
