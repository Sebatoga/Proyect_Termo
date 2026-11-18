---
id: CALC-PV-001
revision: 1
supersedes_revision: null
evaluated_element_refs:
  - {id: SCI-EQ-PV-001, revision: 1}
  - {id: SCI-EQ-PV-003, revision: 1}
input_refs:
  - {id: SCI-PAR-PV-012, revision: 1}
  - {id: SCI-PAR-PV-013, revision: 1}
  - {id: SCI-PAR-PV-014, revision: 1}
  - {id: SCI-PAR-PV-015, revision: 1}
  - {id: SCI-PAR-PV-016, revision: 1}
  - {id: SCI-PAR-PV-017, revision: 1}
provenance_refs:
  - {id: PROV-014, revision: 1}
  - {id: PROV-015, revision: 1}
boundary_refs:
  - {id: BND-PV-001, revision: 1}
  - {id: BND-PV-005, revision: 1}
reproducer_reviewer_id: null
gap_refs:
  - {id: GAP-015, revision: 2}
  - {id: GAP-016, revision: 1}
---

# Independent PV thermal contrast — EDU-FIC-001

## Purpose and independence basis

Author: `project_user` scenario decision, documented by the ECO-002 apply executor on 2026-10-22. Reproducer: pending under task 5.5.

`independence_basis: independent_benchmark`. The candidate is a transient lumped energy balance integrated by Euler. This contrast instead uses the independently sourced Sandia empirical module/cell temperature relations; it does not rearrange the candidate differential equation, reuse its thermal capacity or convection coefficient, or claim physical validation.

## Nominal calculation

Fictional inputs: `E_POA=800 W/m²`, `WS=2 m/s`, `Ta=25 °C`, `a=-3.47`, `b=-0.0594 s/m`, `E0=1000 W/m²`, and `DeltaT=3 K`.

1. Exponent: `a+b*WS = -3.47 + (-0.0594 s/m)(2 m/s) = -3.5888`.
2. Module temperature: `Tm = (800 W/m²) exp(-3.5888) + 25 °C = 47.1052 °C`.
3. Cell correction: `(E_POA/E0)DeltaT = (800/1000)(3 K) = 2.4 K`.
4. Cell temperature: `Tc = 47.1052 °C + 2.4 K = 49.5052 °C`.

Expected result: `Tc=49.5052 °C`. Documentary arithmetic tolerance: `±0.01 °C`; this tolerance covers rounding only and is not a model-accuracy claim. SAND2004-3535's approximately `±5 °C` system-engineering characterization remains contextual and is not adopted as EcoGrid validation.

## Zero-irradiance boundary

At `E_POA=0 W/m²` with the same fictional ambient state:

- `Tm = 0*exp(a+b*WS)+Ta = 25 °C`.
- `Tc = Tm+(0/E0)DeltaT = 25 °C`.

Expected result: `Tc=Ta=25 °C` exactly under this empirical relation, and electrical power remains zero under `BND-PV-001`. The result does not prove Euler stability; `BND-PV-005` and the candidate transient model remain blocked pending calibrated thermal parameters and review.

## Reproduction and decision

Data are in `CALC-PV-001-r1-data.csv`. Difference against the transient candidate is `N/A` because the methods predict different model quantities and forcing; inventing a direct error metric would be circular or misleading. Reproducer absolute/relative differences remain pending. Rounding uses four decimals for temperatures and exact zero for the boundary.

Decision: `accepted` as a non-circular documentary contrast; excluded from any baseline and not experimental validation, equipment prediction, or selection of the production PV model.
