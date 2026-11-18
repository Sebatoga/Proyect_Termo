# ECO-002 gate evaluation — 2026-10-22 / 02

**Gate evaluation ID:** `ECO-002-GATE-20261022-02`
**Result:** `blocked_with_traceability`
**Immutable:** yes; this evaluation supersedes `ECO-002-GATE-20261022-01` without modifying any prior evaluation.

## Decision

The user selected fictional educational scenario `EDU-FIC-001`. Task 4.6 now has explicit scenario values classified only as `gameplay_estimate` or `pending_calibration`. Four revision-1 documentary notebooks and CSV datasets cover ten nominal/boundary cases for PV, HYD, WIND, and BAT/BUS.

The calculations use two independent published benchmarks and two distinct first-principles ledgers. The focused arithmetic harness passes all ten cases. These results supersede the prior absence of calculations, but they do not constitute equipment selection, experimental validation, implementation tests, identified-person reproduction, or scientific approval.

The gate remains blocked. Task 4.7 has no distinct identified human citation/retention review. Tasks 5.5–5.10 have no reviewer identities, competence evidence, reproductions, or physics/control/environmental/quality reviews. Exact hydro SI/net-head support and a production PV model/applicability range remain open.

No `BASELINE-ID`, `baselines/`, `snapshot/`, source copy, code, package, commit, push, or PR exists or is authorized by this evaluation.

## Calculation outcome

1. `CALC-PV-001-r1`: Sandia empirical temperature benchmark contrasts with the candidate transient model; nominal `Tc=49.5052 °C`, zero-irradiance `Tc=Ta=25 °C`.
2. `CALC-HYD-001-r1`: USBR benchmark gives `307891.4 W` versus provisional SI arithmetic `307641.6 W`, a `0.08121%` difference within the documentary `0.2%` tolerance; ecological-flow boundary gives zero.
3. `CALC-WIND-001-r1`: mass-flow/kinetic-energy derivation gives `5152 W`; below-cut-in is zero and `Cp=0.60` is rejected above `16/27`.
4. `CALC-BUS-001-r1`: one-minute energy ledger closes nominal charge, full-battery curtailment, and empty-battery deficit within `1e-9 kWh`.

## Blocking reasons

- `GAP-002` revision 3: fictional equipment/site values remain pending calibration.
- `GAP-014` revision 2: task 4.7 remains pending distinct-human localization and retention review.
- `GAP-015` revision 2: PV model/version selection and validity remain open.
- `GAP-016` revision 1 and `GAP-007`–`GAP-010`: calculations and model domains lack identified qualified reproduction and required reviews.
- `GAP-013` revision 2: exact hydro SI/net-head support remains open.

## Scope and preservation

- Tasks 1.1–4.6 and 5.1–5.4 are complete.
- Task 4.7, tasks 5.5–5.10, and all phase-6 tasks remain unchecked and unexecuted.
- Every prior gate, source/provenance revision, calculation-independent record, and validated review slice remains unchanged.
- No web work, baseline, source copy, code, package, commit, push, or PR occurred.

## Reproducible checks

Exact commands and results are retained in `evidencias/ECO-002/validation/work-unit-3-calculations.md` and cumulative apply progress.
