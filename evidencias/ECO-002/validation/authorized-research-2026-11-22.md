# ECO-002 authorized public-source research — 2026-11-22

## Scope and outcome

The user authorized public read-only research for ECO-002. This session consulted the U.S. Bureau of Reclamation's *Hydropower Resource Assessment at Existing Reclamation Facilities* (final report, March 2011), Chapter 2, §2.2. Only metadata, a stable public locator, and a short bounded excerpt were retained in `working/sources.yaml` as `SRC-021`; no source copy or content hash was retained.

The report's planning-level formula supports the dependence on flow, net head, and efficiency in customary units (cfs, feet, and kW). It narrows, but does not close, the gap for the proposed SI equation `P_hydro = eta*rho*g*Q_turb*H_net`: no direct SI citation, qualified review of the conversion/model boundary, equipment selection, or applicable environmental-flow scenario was established.

`ACCESS-003` records the authorization scope. `PROV-018` links the source only to the already bounded hydropower dependence claim. `GAP-013` revision 3 preserves the remaining blockers. The old immutable gate was not edited or reevaluated; it does not include this new evidence.

## Checks and limits

- Source access: public read-only web search and consultation; no login or credential access.
- Retention: metadata only; no download, retained source copy, or content hash.
- Licensing: not independently reviewed; task 4.7 still requires a distinct human reviewer to check citations and retention conditions.
- Formula/model approval: not performed. The required `modelo-fisico` skill and `@revisor-fisica` reviewer are unavailable in this runtime.
- Gate status: remains `blocked_with_traceability`; no baseline or snapshot exists.

## Additional authorized research — same authorization and date

The same `ACCESS-003` scope was used for two further public, read-only lookups:

- `SRC-022` — JICA, *Guideline and Manual for Hydropower Development, Vol. 2: Small Scale Hydropower* (March 2011; `https://openjicareport.jica.go.jp/pdf/12024899.pdf`). Search-result excerpts localize §3.1.2 to printed page 3-1: `P=ρ·9.8·Q·He·η`, with `P` in kW, water density 1000 kg/m³, approximate gravity 9.8 m/s², discharge in m³/s, effective head in m, and combined turbine-generator efficiency. §5.3.1(6), printed page 5-12, defines effective head as total head less intake, headrace, penstock, tailrace, and other losses. This is stronger source support for the general SI-form relation and effective-head concept, but it does not independently approve EcoGrid's `g=9.81`, simplified `K_loss·Q²`, turbine-flow boundary, or output-unit implementation. It also does not select a watershed or environmental-flow value.
- `SRC-023` — SAM Help 2025.4.16 (`https://sam.nlr.gov/images/web_page_files/sam-help-2025-4-16.pdf`, PVWatts section, “About PVWatts Versions” and “New features added in Version 8”; current help locator `https://samrepo.nlr.gov/help/pvwatts.html`). The documentation distinguishes PVWatts V5's Fuentes transient thermal model (also described in existing `SRC-019`) from V8's updated SAM Detailed PV thermal-model family and NOCT method. These are distinct model/version choices; neither validates the candidate EcoGrid lumped transient balance, and no model or coefficients were selected.

`PROV-019` and `PROV-020` record these bounded claims. `GAP-013` revision 4 retains the human physics review, environmental-scenario, and model-boundary blockers. It also calls out a documentary consistency issue for review: `docs/02_MODELOS_FISICOS.md` names the hydro output `P_hydro_W` while its reference vector states a kW result. No equation or model contract was edited. `GAP-015` revision 3 preserves the PV model/version selection and applicability gap.

No source PDFs were downloaded or retained; only metadata, stable locators, short excerpts, and provenance were recorded. These searches are documentary research, not a second-person citation review, scientific approval, or independent model validation.

## Final dossier checks for gate 02

- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py structural` — PASS; 242 definitions, 231 references, zero unresolved; 39 checked tasks and 15 externally blocked unchecked criteria; 14 manifest artifact hashes match; no baseline/snapshot.
- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py whitespace` — PASS; 11 untracked ECO-002 text files scanned, zero violations.
- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py slices` — PASS; 26 slices cover 73 paths, with all review budgets at or below 400 lines.
- `git diff --check` — PASS with no output.
- `sha256sum -c evidencias/ECO-002/gate-evaluations/ECO-002-GATE-20261122-02/checksums.sha256` — PASS after the manifest/report and current working-record hashes were finalized.
- `test ! -d` checks for `baselines/`, `source-copies/`, and gate-02 `snapshot/` — PASS; all absent.

These checks establish dossier structure and integrity only; they are not scientific tests, independent reproduction, or human review.

## Additional authorized research — penstock losses

Under the same public read-only `ACCESS-003` scope, the accepted manuscript by Leon and Zhu was streamed directly from its public repository URL into `pdftotext` for consultation; no PDF or extracted text file was retained. `SRC-024` records the DOI and stable locator. Printed pages 3–4, equations (1), (2), (4), and (6), express power in W and penstock head loss as `Q²` multiplied by terms containing friction, geometry, and local-loss factors. The derivation assumes constant overall efficiency. On printed page 6, the authors' near-constant friction-factor discussion is scoped to their stated fully developed turbulent-flow conditions.

`PROV-021` records only this bounded dependence. It does not validate an invariant or universal `K_loss`, the EcoGrid geometry or flow regime, or the candidate model. The source landing text identifies the item as an accepted manuscript and points to terms of use; licensing/retention conditions still require the distinct human review in task 4.7. No equation, parameter, baseline, or model selection was changed.

`GAP-013` revision 5 keeps the independent physics review, W/kW reconciliation, turbine-flow boundary, model-specific loss convention, and environmental-scenario blockers open. Because the source adds traceable evidence without resolving those blockers, the current gate is reevaluated as a new immutable `blocked_with_traceability` evaluation; prior gates remain untouched.

## Final dossier checks for gate 03

- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py structural` — PASS; 245 definitions, 233 references, zero unresolved; 40 checked tasks, 15 externally blocked unchecked criteria; 14 manifest artifact hashes match; no baseline/snapshot.
- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py whitespace` — PASS; 15 untracked ECO-002 text files scanned, zero violations.
- `python3 evidencias/ECO-002/validation/validate_work_unit_1.py slices` — PASS; 27 slices cover 77 paths, all review budgets at or below 400 lines.
- `git diff --check` — PASS with no output.
- `sha256sum -c evidencias/ECO-002/gate-evaluations/ECO-002-GATE-20261122-03/checksums.sha256` — PASS; 16 artifacts.
- `test ! -d` checks for `baselines/`, `source-copies/`, and gate-03 `snapshot/` — PASS; all absent.

These checks establish dossier structure and integrity only; they are not scientific tests, independent reproduction, or human review.
