# ECO-004 Cooperative Scorecard

## Objective

Define and implement a hardware-independent cooperative scorecard that prevents trivial load shedding while keeping blocked scientific models and unvalidated gameplay balance outside the scoring boundary.

## Problem and rationale

Critical-load coverage alone can reward serving only one category while abandoning the rest of the city. A weighted total can also hide environmental failure behind good energy service. ECO-004 therefore uses three visible dimensions—critical coverage, total coverage, and environmental compliance—and produces an explainable `victory`, `defeat`, or `incomplete` result.

## Authorized scope

- Reconcile the GDD, player manual, acceptance criteria, architecture, and test plan around a multidimensional scorecard.
- Define a versioned, synthetic round ledger and mission thresholds.
- Implement a dependency-free pure reference under `tools/` with deterministic Node tests.
- Report structured reasons suitable for later UI explanation.
- Keep thresholds injectable and explicitly provisional until reproducible playtesting.

## Excluded scope

- ECO-002 formulas, reference cases, or scientific baseline.
- PV, hydro, battery, bus, emissions, water footprint, or ecological-flow calculations.
- Hardware, firmware, calibration, serial transport, UI, product bootstrap, or final mission balance.
- Weighted aggregate scores, tie-breakers, and claims that the game is balanced or solvable.

## Constraints

- Victory requires critical coverage, total coverage, complete rounds, and verifiable environmental compliance.
- Positive external demand with zero service can never win.
- Serving only critical loads can satisfy critical coverage but must still fail total coverage when its threshold is unmet.
- Natural unavailability must not be classified as player-caused environmental noncompliance.
- Invalid or incomplete ledgers produce `incomplete`, not a scored defeat.
- TDD mode: disabled by existing project setting; behavior-first Node tests and observed verification remain mandatory.
- Delivery strategy: `ask-on-risk`; forecast approximately 300–400 authored changed lines.

## Tasks

- [x] **ECO004-1 — Specify the scorecard contract**
  - Route: delegated direct.
  - Trigger evidence: reconciling gameplay, acceptance, architecture, and test documents requires coordinated edits across multiple non-trivial files.
  - Acceptance: one authoritative contract defines dimensions, result precedence, reason codes, invalid-ledger behavior, and provisional thresholds without importing blocked science.

- [x] **ECO004-2 — Implement the pure scoring reference**
  - Route: delegated direct.
  - Trigger evidence: implementation, public API, validation semantics, and operator documentation span multiple non-trivial files.
  - Acceptance: a dependency-free function consumes a versioned mission and resolved synthetic ledger and returns immutable metrics, outcome, and structured reasons.

- [x] **ECO004-3 — Prove anti-trivial and boundary behavior**
  - Route: delegated direct.
  - Trigger evidence: scenario fixtures and behavior tests must stay coupled to the implementation contract.
  - Acceptance: tests cover shutdown-all, critical-only, compliant victory, environmental failure, natural unavailability, zero demand, inconsistent data, incomplete rounds, duplicate rounds, and determinism.

- [x] **ECO004-4 — Reconcile evidence and project state**
  - Route: delegated direct.
  - Trigger evidence: ODD evidence, project status, backlog, test plan, and AI trace require coordinated closure updates.
  - Acceptance: every observed command/result, limitation, commit, rollback boundary, and remaining playtesting dependency is recorded without claiming scientific or gameplay validation.

## Verification

- Focused Node tests for the scorecard reference.
- Existing simulator and host-adapter Node tests remain green.
- Repeated scoring of the same frozen input is deeply equal.
- `git diff --check` passes for every work unit.
- Structural readback confirms no scoring module imports physics, UI, serial, or hardware code.

## Progress and evidence

- Status: technical/documentary slice completed; parent ECO-004 remains in
  review because reproducible playtesting and environmental review are pending.
- Branch: `feat/eco-004-scorecard`, based on `feat/eco-host-adapter-reference` at `4d7f45c`.
- Product decision: user confirmed the multidimensional scorecard on 2026-11-03.
- Engram mirror: pending because session registration is unavailable.
- First work unit: contract, pure reference, anti-trivial tests, and minimal
  alignment across GDD, architecture, acceptance, test plan, and player manual.
- Public API: `evaluateScorecard(mission, ledger)` under
  `tools/game-scorecard/`; synthetic versioned inputs only, with no ECO-002
  formulas, cases, hardware, transport, UI, or product imports.
- Rollback boundary: remove `tools/game-scorecard/` and revert only the ECO-004
  scorecard paragraphs in the five aligned documents and this task record.
- Observed verification (2026-11-03):
  - Initial independent verifier: **BLOCKED** because two rounds with
    `Number.MAX_VALUE` overflowed aggregate sums to `Infinity`, produced `NaN`
    coverage and incorrectly returned `victory`.
  - Fix `11d325d` (`fix(game): reject non-finite score aggregates`): 71 authored
    lines in implementation and tests. It returns `incomplete`, null metrics and
    `AGGREGATE_QUANTITY_INVALID`; tests also cover sum-based aggregation,
    `incomplete` precedence and immutability/non-mutation of incomplete results.
  - Post-fix independent verifier: **PASS**, with no blockers.
  - `node --test tools/game-scorecard/*.test.mjs` — exit 0; 24 tests, 24 pass,
    0 fail, 0 skipped.
  - `node --test tools/device-simulator/*.test.mjs tools/host-adapter/*.test.mjs
    tools/game-scorecard/*.test.mjs` — exit 0; 51 tests, 51 pass, 0 fail,
    0 skipped.
  - `git diff --check` — exit 0, no output.

### Work unit and native assessment

- Executable work-unit commit: `6aa9af2` (`feat(game): add cooperative scorecard
  reference`) plus fix `11d325d`: 450 authored lines across `scorecard.mjs` and
  `scorecard.test.mjs` (2 paths). The user explicitly authorized
  `size:exception` for this cohesive PR 1 boundary.
- Native assessment: `risk: medium`, reason `executable_change`;
  `review_due: false`, reason `under_budget`.
- The output is pure, deterministic and deeply immutable. It validates
  versioned mission/ledger inputs and returns `victory`, `defeat` or `incomplete`
  with stable reason codes.
- It does not consume ECO-002 or validate balance, science, hardware or product.
  Thresholds and natural-unavailability semantics remain provisional.

### Delivery chain — `stacked-to-main`

The user selected `ask-on-risk`, then two PRs stacked to `main`. No PR is created
or published by this task.

```text
main @ 4d7f45c
  └── PR 1: 6aa9af2 + 11d325d — reference, tests and overflow fix (450 lines; size:exception) → main
        └── PR 2: 59087aa + current adjustment 📍 — docs/README/traceability (414 lines) → main after PR 1 merges
```

- PR 1 boundary: only `scorecard.mjs` and `scorecard.test.mjs`; destination
  `main` when published.
- PR 2 boundary: current documentation, README and ODD traceability; depends on
  PR 1 and will target `main` only after PR 1 is integrated.
- Local history is `6aa9af2` → `59087aa` → `11d325d`; the documentation commit
  therefore sits between the two logical PR 1 commits. No branch, push or PR was
  created, and this ordering must not be hidden when the stacks are prepared.
- PR 2 starts with 339 authored changed lines in `59087aa`; this adjustment adds
  75, for 414 logical lines. The user explicitly authorized `size:exception`
  after the honest split; the evidence was not compressed.
- Cumulative native review remains unavailable due to #4890; there is no native
  approval or receipt. Do not mix chain strategies or compress documentation.
- Rollback for PR 2: revert only its documentation/README/tracker paths; PR 1
  remains independently removable through the earlier rollback boundary.

## Next step

Run reproducible playtesting and environmental review before proposing final
thresholds or marking ECO-004 done. ECO-002 remains blocked, ECO-108/G1 remain
open and ECO-109 remains pending.
