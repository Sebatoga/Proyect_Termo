---
id: CALC-WIND-001
revision: 1
supersedes_revision: null
evaluated_element_refs:
  - {id: SCI-EQ-WIND-001, revision: 1}
  - {id: SCI-EQ-WIND-002, revision: 1}
input_refs:
  - {id: SCI-PAR-WIND-011, revision: 1}
  - {id: SCI-PAR-WIND-012, revision: 1}
  - {id: SCI-PAR-WIND-013, revision: 1}
  - {id: SCI-PAR-WIND-014, revision: 1}
  - {id: SCI-PAR-WIND-015, revision: 1}
  - {id: SCI-PAR-WIND-016, revision: 1}
  - {id: SCI-PAR-WIND-017, revision: 1}
provenance_refs:
  - {id: PROV-017, revision: 1}
boundary_refs:
  - {id: BND-WIND-001, revision: 1}
  - {id: BND-WIND-003, revision: 1}
  - {id: BND-WIND-005, revision: 1}
reproducer_reviewer_id: null
gap_refs:
  - {id: GAP-002, revision: 3}
  - {id: GAP-016, revision: 1}
---

# Independent wind first-principles calculation — EDU-FIC-001

## Purpose and independence basis

Author: `project_user` scenario decision, documented on 2026-10-22. Reproducer: pending under task 5.5.

`independence_basis: distinct_first_principles`. Instead of inserting values directly into the candidate cubic equation, the calculation starts from air mass crossing the rotor per second and kinetic energy per kilogram. These premises independently produce the available kinetic-energy flux; `Cp` is then applied once. This is not a mere rearrangement of the candidate arithmetic sequence.

## Nominal calculation

Fictional inputs: `rho=1.15 kg/m³`, `A=50 m²`, `v=8 m/s`, and `Cp=0.35`.

1. Volume crossing per second: `A*v=(50 m²)(8 m/s)=400 m³/s`.
2. Mass flow: `rho*A*v=(1.15 kg/m³)(400 m³/s)=460 kg/s`.
3. Kinetic energy per mass: `v²/2=(8 m/s)²/2=32 J/kg`.
4. Available kinetic power: `(460 kg/s)(32 J/kg)=14720 W`.
5. Extracted aerodynamic power: `(0.35)(14720 W)=5152 W`.

Expected result: `5152 W`, arithmetic tolerance `±0.1 W`. Direct candidate substitution also yields `5152 W`, so absolute and relative arithmetic differences are `0 W` and `0%`; agreement does not convert the distinct first-principles derivation into equipment validation. `Cp=0.35 < 16/27=0.5925926`; this checks only the theoretical limit, not actual turbine output.

## Boundaries

- Below cut-in: at fictional `v=2 m/s < 3 m/s`, the equipment-rule output is `0 W`; this threshold remains pending calibration.
- Betz violation: a trial `Cp=0.60 > 16/27` is rejected, not evaluated as accepted generation.
- Cut-out: `25 m/s` is recorded as pending calibration; no output exactly at that point is accepted without a turbine-specific curve.

## Reproduction and decision

Data are in `CALC-WIND-001-r1-data.csv`. Candidate-comparison differences are recorded above; independent reviewer reproduction differences remain pending. Rounding uses one decimal watt and seven decimals for the Betz ratio.

Decision: `accepted` as a non-circular first-principles documentary calculation; excluded from any baseline and not a turbine power-curve prediction.
