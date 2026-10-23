# ECO-002 gate evaluation — 2026-10-21 / 01

**Gate evaluation ID:** `ECO-002-GATE-20261021-01`
**Result:** `blocked_with_traceability`
**Immutable:** yes; corrections require a new gate-evaluation ID.

## Decision

The local dossier cannot produce an accepted scientific baseline for ECO-003. It records zero verified technical sources, zero independent calculations, and zero real reviews by identified qualified people. This is a blocked evaluation, not an approval, provisional approval, frozen baseline, implementation authorization, or experimental validation.

No `BASELINE-ID`, `baselines/`, or `snapshot/` is created.

## Blocking reasons

1. `GAP-001` and `GAP-012`: all technical sources remain `candidate_unconsulted`. The prior research worker had no web-retrieval capability and verified zero sources.
2. `GAP-002` and `GAP-003`: equipment, site, weather range, operating scenario, and applicable ecological-flow authority remain unselected.
3. `GAP-004` and `GAP-005`: battery/bus accounting boundaries and PV numerical stability remain unresolved.
4. `GAP-006`: no independent nominal or boundary calculation exists; inherited vectors are not an independent oracle.
5. `GAP-007`, `GAP-008`, `GAP-009`, and `GAP-010`: physics, control, environmental, and quality reviewers are not identified and no real reviews occurred.
6. `GAP-011`: accountable team owners remain unassigned.

These gaps propagate only to their exact affected revisions. Because required ECO-003 elements occur in every affected set, the global outcome is `blocked_with_traceability`.

## Responsible parties pending

- Project team: authorize or provide lawful source access, select equipment/scenarios, and assign accountable owners.
- Future identified physics reviewer: review PV/HYD/WIND equations, dimensions, assumptions, and limits.
- Future identified control reviewer: review BAT/BUS signs, saturation, efficiency, losses, and conservation.
- Future identified environmental reviewer: review `Qeco` applicability and scope without designing ECO-004 score.
- Future identified quality reviewer: audit traceability, independence, retention, exact references, and integrity hashes.

No role label or absent agent is treated as a person, competence record, review, or approval.

## Authorized dependencies and next actions

1. Complete Phase 4 only after the team provides or explicitly authorizes access to exact sources. Access does not imply retention permission.
2. Select identifiable equipment and scenarios before promoting equipment-dependent parameters.
3. Complete independent, non-circular calculations and obtain the four real reviews in Phase 5.
4. Create a new immutable gate evaluation in Phase 6. Only a future `accepted_frozen` evaluation may create a baseline and snapshot.

## Integrity scope

The companion manifest fixes exact `{id, revision}` references and SHA-256 hashes for all evaluated local artifacts. `calculation_refs` and `review_refs` are intentionally empty because no calculations or reviews exist. A hash mismatch invalidates this evaluation rather than silently updating it.
