# ECO-108 Low-Cost BOM and Bench Baseline

## Objective

Turn the user-approved separate-component option into an auditable procurement candidate and a reproducible receipt/bench procedure without claiming purchase, possession, calibration, or physical validation.

## Authorized scope

- Record the approved target classes, observed supplier snapshot, estimated budget, compatibility gates, alternatives, and expiry/revalidation rules.
- Create reusable inventory, receipt, datasheet, electrical inspection, and single-component bench evidence forms.
- Update only the minimum project status, backlog, hardware-manual, evidence-index, and AI-log views needed for traceability.
- Preserve ECO-002 as blocked and keep scientific models, firmware, serial integration, final pinout, purchases, remote actions, and physical-test claims out of scope.

## Constraints

- Human choice: separate-component BOM approved on 2026-10-27 as the ECO-108 target.
- Price/stock evidence is a dated web snapshot, not guaranteed availability or authorization to buy.
- Estimated target budget: COP 83,000–90,000 plus shipping; any overrun returns to human approval.
- LDR is a gameplay light proxy, never an irradiance meter without traceable calibration.
- USB low voltage only; no water, pumps, dangerous heat, or power batteries.
- TDD mode: disabled by project setting; documentation/link/claim checks remain mandatory.
- Delivery strategy: `ask-on-risk`; expected work remains below 400 authored lines per task.

## Tasks

- [x] **ECO108-1 — Document the approved procurement candidate**
  - Route: delegated direct.
  - Trigger evidence: supplier citations, dated prices/stock, compatibility analysis, budget arithmetic, substitutions, and purchase gates span multiple non-trivial documentation views.
  - Acceptance: one auditable BOM distinguishes observed facts, estimates, pending checks, and explicit non-authorization to purchase.

- [x] **ECO108-2 — Create receipt and bench evidence forms**
  - Route: delegated direct.
  - Trigger evidence: inventory, datasheet, identity, USB enumeration, raw input, output-current, fault, expected/obtained, and rollback records require reusable structured artifacts.
  - Acceptance: blank forms permit the team to collect real evidence without pre-filling results or silently advancing ECO-108.

## Verification

- Markdown structure and repository-relative links resolve.
- Budget arithmetic and quantities are reproducible.
- Dated source links are present and volatile stock/prices are clearly labeled.
- Prohibited claims scan finds no purchased, received, calibrated, tested, approved-hardware, or scientific-baseline assertion.
- `git diff --check` passes for each work unit.

## Progress and evidence

- Feature status: completed as documentary preparation; ECO-108 and G1 remain open pending real purchase, receipt, and bench evidence.
- Tracker branch: `feat/eco-108-bom-baseline` from `baab08a`.
- ECO108-1 evidence: `docs/19_BOM_ECO_108.md`, linked from the hardware manual,
  with project status/backlog updated; verification commands recorded in the
  work-unit delivery. Commit: `5074792` (`docs(hardware): record approved ECO-108 BOM candidate`).
- ECO108-2 evidence: `evidencias/ECO-108/README.md` and the three blank forms
  under `evidencias/ECO-108/plantillas/`, linked from the BOM and test plan.
  Commit message: `docs(hardware): add ECO-108 receipt and bench forms`.
- Espejo en Engram: `PENDIENTE`; el guardado no pudo confirmar una sesión
  registrada durante la entrega.

## Next step

A person must revalidate price, stock, shipping, references, and total, then
explicitly authorize purchase. Only afterward may the team complete receipt and
bench forms with observed evidence. Do not claim that G1 has passed.
