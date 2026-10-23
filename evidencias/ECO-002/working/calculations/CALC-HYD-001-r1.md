---
id: CALC-HYD-001
revision: 1
supersedes_revision: null
evaluated_element_refs:
  - {id: SCI-EQ-HYD-001, revision: 1}
  - {id: SCI-EQ-HYD-003, revision: 1}
  - {id: SCI-EQ-HYD-004, revision: 1}
input_refs:
  - {id: SCI-PAR-HYD-013, revision: 1}
  - {id: SCI-PAR-HYD-014, revision: 1}
  - {id: SCI-PAR-HYD-015, revision: 1}
  - {id: SCI-PAR-HYD-016, revision: 1}
  - {id: SCI-PAR-HYD-017, revision: 1}
  - {id: SCI-PAR-ENV-002, revision: 1}
provenance_refs:
  - {id: PROV-013, revision: 1}
boundary_refs:
  - {id: BND-HYD-001, revision: 1}
  - {id: BND-HYD-002, revision: 1}
  - {id: BND-HYD-003, revision: 1}
  - {id: BND-HYD-004, revision: 1}
reproducer_reviewer_id: null
gap_refs:
  - {id: GAP-002, revision: 3}
  - {id: GAP-013, revision: 2}
  - {id: GAP-016, revision: 1}
---

# Independent hydropower benchmark — EDU-FIC-001

## Purpose and independence basis

Author: `project_user` scenario decision, documented on 2026-10-22. Reproducer: pending under task 5.5.

`independence_basis: independent_benchmark`. The comparison uses USBR's published customary-unit `THP=(Q*H)/8.8` relation and independent unit conversions, rather than treating the candidate SI expression as its own oracle. DOE supplies only contextual flow/head dependence. This benchmark does not close the missing exact SI/net-head citation.

## Nominal availability and head

Fictional inputs: `Q_river=3 m³/s`, `Q_eco=1 m³/s`, `Q_turb_max=2 m³/s`, `H_gross=20 m`, `K_loss=0.1 s²/m⁵`, and `eta=0.80`.

1. Available flow: `3-1=2 m³/s`; capacity also equals `2 m³/s`, so `Q_turb=2 m³/s`.
2. Head loss: `(0.1 s²/m⁵)(2 m³/s)²=0.4 m`.
3. Net head: `20-0.4=19.6 m`, which is positive and below gross head.
4. Independent conversion: `Q=70.6293 ft³/s`; `H=64.3045 ft`.
5. USBR theoretical power: `THP=(70.6293*64.3045)/8.8=516.1115 hp`.
6. Fictional mechanical/electrical factor: `0.80*516.1115=412.8892 hp`.
7. Convert with `745.699872 W/hp`: `P_benchmark=307891.4 W`.

Candidate SI arithmetic gives `0.80*1000*9.81*2*19.6=307641.6 W`. Absolute difference is `249.8 W`; relative difference is `0.08121%`, within the declared documentary comparison tolerance of `0.2%`. The comparison uses inherited provisional `rho=1000 kg/m³` and `g=9.81 m/s²`; the difference reflects rounded customary relation/conversions, not validation accuracy or promotion of those values.

## Ecological-flow boundary

At `Q_river=Q_eco=1 m³/s`, divertible flow is exactly zero. Therefore `Q_turb=0`, `THP=0 hp`, and `P=0 W`; no head or efficiency term may create power without flow.

## Reproduction and decision

Data are in `CALC-HYD-001-r1-data.csv`. Benchmark-versus-candidate differences are recorded above; independent reviewer reproduction differences remain pending. Rounding uses four decimals for converted values and one decimal watt output.

Decision: `accepted` as a non-circular documentary benchmark; excluded from any baseline. `K_loss`, efficiency, capacity, fictional `Qeco`, the exact SI citation, and the net-head definition remain pending calibration/review.
