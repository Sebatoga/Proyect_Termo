---
id: CALC-BUS-001
revision: 1
supersedes_revision: null
evaluated_element_refs:
  - {id: SCI-EQ-BAT-001, revision: 1}
  - {id: SCI-EQ-BAT-002, revision: 1}
  - {id: SCI-EQ-BUS-001, revision: 1}
  - {id: SCI-EQ-BUS-002, revision: 1}
input_refs:
  - {id: SCI-PAR-BAT-009, revision: 1}
  - {id: SCI-PAR-BAT-010, revision: 1}
  - {id: SCI-PAR-BAT-011, revision: 1}
  - {id: SCI-PAR-BAT-012, revision: 1}
  - {id: SCI-PAR-BAT-013, revision: 1}
  - {id: SCI-PAR-BAT-014, revision: 1}
  - {id: SCI-PAR-BUS-007, revision: 1}
  - {id: SCI-PAR-BUS-008, revision: 1}
  - {id: SCI-PAR-BUS-009, revision: 1}
  - {id: SCI-PAR-NUM-004, revision: 1}
provenance_refs:
  - {id: PROV-011, revision: 1}
  - {id: PROV-012, revision: 1}
boundary_refs:
  - {id: BND-BAT-001, revision: 1}
  - {id: BND-BAT-003, revision: 1}
  - {id: BND-BAT-005, revision: 1}
  - {id: BND-BUS-001, revision: 1}
  - {id: BND-BUS-002, revision: 1}
reproducer_reviewer_id: null
gap_refs:
  - {id: GAP-004, revision: 1}
  - {id: GAP-016, revision: 1}
---

# Independent battery/bus energy ledger — EDU-FIC-001

## Purpose and independence basis

Author: `project_user` scenario decision, documented on 2026-10-22. Reproducer: pending under task 5.5.

`independence_basis: distinct_first_principles`. This calculation builds a joule/kWh accounting ledger over one minute from energy entering and leaving explicit boundaries. It does not solve the candidate power-balance equation for an unknown or reuse inherited vectors as an oracle.

## Nominal charge ledger

Fictional inputs: `dt=60 s=1/60 h`, generation `70 kW`, load `50 kW`, network losses `2 kW`, initial stored energy `50 kWh`, charge limit `20 kW`, and `eta_ch=0.95`.

1. Bus energies: generation `70/60=1.1666667 kWh`; load `50/60=0.8333333 kWh`; network loss `2/60=0.0333333 kWh`.
2. Remaining bus energy is `0.3000000 kWh`, equivalent to `18 kW`, below the fictional charge limit.
3. Stored increment is `(0.3000000 kWh)(0.95)=0.2850000 kWh`.
4. Charge-conversion loss is `0.0150000 kWh`, counted once inside the battery boundary.
5. Bus residual before battery conversion: `1.1666667-0.8333333-0.0333333-0.3000000=0 kWh` within floating rounding (`5.6e-17 kWh` absolute difference); relative difference is `N/A` because the expected residual is zero.
6. New stored state: `50+0.285=50.285 kWh`, below `100 kWh`.

Expected bus residual tolerance: `1e-9 kWh`; stored-energy arithmetic tolerance: `1e-6 kWh`.

## Full-battery boundary

At `E=E_max=100 kWh`, the same `18 kW` surplus cannot charge. Charge input and stored increment are `0`; curtailment is `18 kW` or `0.3000000 kWh`. The bus ledger remains `1.1666667=0.8333333+0.0333333+0.3000000 kWh`.

## Empty-battery discharge boundary

At `E=0 kWh`, generation `30 kW`, load `50 kW`, and network losses `2 kW`, discharge is unavailable. Served load is `28 kW`, unserved demand is `22 kW`, stored energy remains zero, and no efficiency term creates energy.

## Reproduction and decision

Data are in `CALC-BUS-001-r1-data.csv`. Ledger differences are recorded above; independent reviewer reproduction differences remain pending. Rounding uses seven decimals for ledger values.

Decision: `accepted` as a non-circular documentary conservation ledger; excluded from any baseline. Sign convention, architecture, equipment limits, efficiencies, and review remain pending.
