# ECO-002 gate evaluation — 2026-11-22 / 02

**Gate evaluation ID:** `ECO-002-GATE-20261122-02`
**Result:** `blocked_with_traceability`
**Immutable:** yes; this evaluation supersedes `ECO-002-GATE-20261122-01` without modifying it or any earlier evaluation.

## Decision

This reevaluation incorporates `SRC-022`/`SRC-023`, `PROV-019`/`PROV-020`, `GAP-013` revision 4, and `GAP-015` revision 3. JICA localizes a small-hydropower relation using SI input units and defines effective head by subtracting specified losses. This narrows the documentary gap but does not approve the EcoGrid implementation: `g=9.81`, the simplified `K_loss·Q²` loss, turbine-flow boundary, and W-to-kW reporting require qualified physics review. The model contract currently labels output `P_hydro_W` while its vector states a kW result.

The PV evidence distinguishes the Fuentes transient thermal model documented for PVWatts V5 from the updated SAM/NOCT model family documented for V8. Neither is selected or treated as validation of EcoGrid's candidate lumped transient balance.

The gate remains `blocked_with_traceability`. Task 4.7 still requires a distinct human citation/retention review. Tasks 5.5–5.10 still require identified qualified people, competency evidence, independent calculation reproduction, and scoped physics, control, environmental, and quality reviews. PV model applicability, equipment calibration, and a suitable environmental-flow scenario remain unresolved. No calculation is accepted into a baseline.

No `BASELINE-ID`, `baselines/`, `snapshot/`, source copy, code, package, score, modality authorization, commit, push, PR, or ECO-003/ECO-004/ECO-005/ECO-101 artifact was created or claimed.

## Blocking reasons

- `GAP-014` revision 2: distinct human citation and retention review for task 4.7 remains absent.
- `GAP-007`–`GAP-010` and `GAP-016`: named reviewers, competence evidence, reproductions, and required scoped reviews remain absent.
- `GAP-013` revision 4: despite direct JICA source support, unit conversion, simplified head-loss model, turbine boundary, independent physics review, and environmental scenario remain open.
- `GAP-002` revision 3 and `GAP-015` revision 3: equipment values and PV model applicability remain unresolved.
- Tasks 6.3–6.9 remain conditional on accepted evidence; no baseline or snapshot is permitted for this result.
- Task 6.10 clean-checkout verification remains unchecked; no commit was authorized.

## Scope and preservation

- Prior gate evaluations remain byte-for-byte unchanged.
- This is a blocked reevaluation, not a frozen baseline or scientific approval.
- New sources are metadata-only; no copy or license conclusion is claimed.
- No model equation or physical contract was edited. The required `modelo-fisico` skill and human specialist reviews were not available/performed in this runtime.

## Reproducible checks

- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py structural` — PASS; 242 definitions, 231 references, zero unresolved; 39 checked tasks; 14 manifest artifact hashes match; no baseline/snapshot.
- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py whitespace` — PASS; 11 untracked ECO-002 text files, zero violations.
- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py slices` — PASS; 26 slices, 73 covered paths, all budgets ≤400 lines.
- `git diff --check` — PASS with no output.
- `sha256sum -c evidencias/ECO-002/gate-evaluations/ECO-002-GATE-20261122-02/checksums.sha256` — PASS; 16 artifacts.
- Baseline/source-copy/snapshot absence checks — PASS.

These are dossier-integrity checks, not scientific validation, independent reproduction, human review, or runtime tests. Full command results are also retained in `evidencias/ECO-002/validation/authorized-research-2026-11-22.md`.
