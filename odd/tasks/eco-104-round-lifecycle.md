# ECO-104 Round Lifecycle Reference

## Objective

Implement the first bounded ECO-104 work unit: a dependency-free Node ESM reference that coordinates six deterministic rounds from normalized input validation through one-shot synthetic resolution, immutable history append, and advancement.

## Problem and why

The project documents a six-round flow but has no executable lifecycle contract. Without a narrow coordinator, invalid or replayed input could reuse stale controls, resolve twice, or advance inconsistently before product and scientific decisions are ready.

## Authorized scope

- Add a pure local reference under `tools/round-lifecycle/` with an injected synthetic resolver.
- Define closed versioned manifest, round, event, snapshot, and result boundaries.
- Add behavior-first Node tests, minimal operator documentation, and only necessary project-view alignment.
- Keep ECO-104 `PENDIENTE`; this is a partial isolated reference, not product integration.

## Constraints

- No Phaser, DOM, serial library, scorecard, physical model, ECO-002 data, disposable runtime spike, package installation, network, hardware, or product bootstrap.
- No physical formulas, energy quantities, score thresholds, balance, or environmental semantics.
- No `Math.random()`, `Date.now()`, clocks, timers, global mutable state, or ambient entropy.
- Invalid, missing, disconnected, or null controls never resolve, append, advance, or reuse stale values.
- TDD mode: `disabled`, sourced from the existing project testing-capability record (`strict_tdd: false`); ordinary behavior-first tests remain mandatory.
- Delivery strategy: chained PRs; do not apply one `size:exception` to the whole
  candidate.
- Chain strategy: `feature-branch-chain`, with a 400 authored changed-line
  review budget per child slice and no code-golf or omitted tests/docs.

## Stable tasks

- [x] **ECO104-1 — Define and implement the lifecycle contract**
  - Route: `delegated`.
  - Trigger evidence: stateful executable + tests + fixtures + docs across 2+ non-trivial files.
  - Acceptance: a closed six-round manifest and normalized snapshots drive explicit, deterministic lifecycle transitions through an injected synthetic resolver.
- [x] **ECO104-2 — Prove retry, one-shot, terminal, and replay behavior**
  - Route: `delegated`.
  - Trigger evidence: stateful executable + tests + fixtures + docs across 2+ non-trivial files.
  - Acceptance: invalid and unconfirmed inputs remain retryable; duplicate tokens do not re-resolve; the seventh confirmation is terminal; replay histories and snapshots are deeply equal and immutable.
- [x] **ECO104-3 — Record bounded evidence and project alignment**
  - Route: `delegated`.
  - Trigger evidence: stateful executable + tests + fixtures + docs across 2+ non-trivial files.
  - Acceptance: exact commands, counts, authored lines, commit identity, rollback, limitations, and next step are recorded without promoting ECO-104.
- [x] **ECO104-4 — Harden hostile-data and reentrant boundaries**
  - Route: `delegated`.
  - Trigger evidence: independent verification blocked `a0ac3ca`; safe capture,
    lifecycle state, adversarial tests and contract documentation require a
    coordinated correction across non-trivial files.
  - Accepted findings: snapshot accessor TOCTOU; recursive resolver duplication;
    resolver-result accessor/depth failures; sequence regression; and closed
    schemas accepting hidden, symbol, accessor or array-extra properties.
  - Acceptance: one bounded descriptor-based plain-data capture rejects hostile
    structures with stable codes, snapshots/results are captured once,
    reentrancy cannot append, committed sequences strictly increase, traversal
    limits prevent native errors, and history cannot exceed six entries.
- [x] **ECO104-5 — Guard capture-time reentry and constructor options**
  - Route: `delegated`.
  - Trigger evidence: a second independent correction found that the resolution
    guard begins after snapshot capture and constructor parameter destructuring
    leaks native exceptions before lifecycle validation.
  - Accepted findings: snapshot Proxy traps can recursively fill all six rounds
    before the outer resolver call; the outer call can then invoke a seventh
    resolver with an undefined round; undefined/null/primitive or hostile options
    leak native exceptions; and aggregate capture limits are checked only after
    all descriptors are materialized.
  - Acceptance: the guard covers capture, validation, resolution and result
    capture with `finally` cleanup; state is rechecked after capture and directly
    before resolution; options are captured as an exact closed data record with
    stable lifecycle codes and no getter invocation; own-key bounds are decided
    before per-property descriptor retrieval where practical; adversarial
    regressions prove at most one resolver call/append and a six-entry ceiling.
- [x] **ECO104-6 — Compose adapter and lifecycle in an isolated harness**
  - Route: `delegated`.
  - Trigger evidence: the fail-closed host adapter and corrected lifecycle exist
    separately; their confirmation, stale-value and session-reset boundary needs
    executable integration evidence across source, tests and operator docs.
  - Authorized scope: add one dependency-free Node ESM harness under `tools/`
    that imports both existing APIs, focused integration tests, and only minimal
    tracker/architecture/test-plan/state/backlog/AI-log/README alignment.
  - Acceptance: ingestion only updates the adapter snapshot; an explicit unique
    token is required to forward the current snapshot; invalid, disconnected,
    replayed, reordered or unconfirmed input never resolves or advances; a
    disconnect makes the integration session reset-required; six confirmations
    complete immutable deterministic history and a seventh is terminal.
  - Exact checks: `node --test tools/round-host-integration/*.test.mjs`; the
    combined simulator/adapter/scorecard/lifecycle/integration suite; `git diff
    --check`; forbidden dependency/formula scan; final `git status` and `git
    show`.
  - Rollback: remove `tools/round-host-integration/` and only the ECO104-6
    documentation lines; existing adapter and lifecycle behavior remains intact.
  - Planned feature-chain slice: one cohesive local child after `8268971`, under
    approximately 400 authored additions plus deletions; stop before commit if
    honest tests and documentation exceed the budget.
- [x] **ECO104-7 — Make integration mutations transaction-safe**
  - Route: `delegated`.
  - Trigger evidence: independent verification blocked `8d8e439` because hostile
    ingestion and resolver callbacks can reenter public mutations, while reset-
    required ingestion can repopulate adapter state.
  - Accepted findings: non-string coercion can confirm during adapter parsing;
    resolver callbacks can ingest or disconnect during confirmation; and reset-
    required sessions mutate the adapter before returning the reset reason.
  - Acceptance: one integration-wide synchronous guard covers `ingest`, `confirm`
    and `disconnect` before caller-controlled work; reentry returns
    `INTEGRATION_BUSY` without mutation; non-string ingestion returns
    `INPUT_LINE_INVALID`; reset-required calls preserve the cleared disconnected
    adapter; `finally` cleanup permits safe retries after every result path.
  - Planned feature-chain slice: the next cohesive child after `8d8e439`, keeping
    implementation, adversarial tests and minimal contract/evidence updates
    together below 400 authored additions plus deletions. Stop before commit if
    the honest work unit exceeds that review budget.
- [x] **ECO104-8 — Bind provisional event identifiers to the fixed round order**
  - Route: `delegated`.
  - Trigger evidence: the existing manifest still uses generic event keys while
    project documents define one provisional fixed six-round order.
  - TDD mode: `disabled`; focused behavior tests remain required.
  - Acceptance: the closed manifest uses unique stable English semantic keys in
    the documented exact order; deterministic replay preserves the caller seed;
    and the injected resolver receives every expected key in sequence.
  - Delivery: one `feature-branch-chain` child after `d97e5d1`, keeping fixture,
    behavior tests and minimal documentation/evidence together below 400 authored
    additions plus deletions. No physical effects, values, formulas, randomness,
    scoring, balance, timing, UI copy or product integration enter this slice.
- [x] **ECO104-9 — Promote canonical lifecycle ownership**
  - Route: delegated to the current implementation agent; no child agent is launched.
  - Branch/start: `feat/eco-104-lifecycle-promotion` at parent `be6bd16`.
  - Acceptance: relocate the lifecycle byte-identically into the application layer, leave one implementation, declare its complete runtime surface without `any`, and redirect reference tests plus host composition without adding product wiring or changing semantics.
  - Checks: focused lifecycle/host/Vitest compatibility suites, full 165-test Node suite, typecheck, full Vitest, build, browser/offline smokes, widened layer/network and duplicate/import scans, declaration/runtime spot check, whitespace, authored-line guard, and final status/show.
  - Rollback: revert the single promotion commit to restore `tools/round-lifecycle/round-lifecycle.mjs` and prior imports while removing only the declaration and compatibility test.
  - Delivery boundary: one cohesive child below 400 authored additions plus deletions when the byte-identical relocation is treated as a rename; stop before commit on changed bytes or budget overflow.
- [x] **ECO104-10 — Promote host composition and product snapshot mapping**
  - Route: direct implementation on `feat/eco-round-session-integration` after `65cf481`.
  - Acceptance: application owns one typed adapter-lifecycle composition and maps its trusted state to the existing six-field product port for waiting, ready, reset and completed states; the tool path becomes a facade and `main.ts` remains unwired.
  - Checks: integration Node suite, complete 165-test references, focused/full Vitest, typecheck, build, browser/offline smokes, layer/import/duplicate scans, whitespace and authored-line guard.
  - Rollback: revert only ECO104-10 to restore composition ownership to `tools/`; promoted lifecycle, protocol and adapter remain intact.
- [x] **ECO104-11 — Promote the provisional six-round manifest**
  - Route: direct implementation on `feat/eco-provisional-round-manifest` after `8dd2625`.
  - Acceptance: application owns one deeply immutable provisional manifest and event-key order; Node and Vitest consumers use it directly, the duplicate JSON fixture is removed, and no event effects or runtime wiring are introduced.
  - Checks: lifecycle/integration/full Node suites, Vitest, typecheck, build, browser/offline smokes, duplicate/import scans, whitespace and authored-line guard.
  - Rollback: revert only ECO104-11 to restore the JSON fixture and local test manifests; promoted runtime modules remain intact.
- [x] **ECO104-12 — Lock down the application resolver handoff**
  - Route: direct, bounded regression in the application integration suite.
  - Acceptance: ordinary ingestion does not call the resolver; explicit confirmation forwards the seed, resolver version, canonical round, accepted sequence/token/calibration version, and all six normalized controls as a deeply immutable envelope; replay by either token or already-consumed sequence does not call the resolver again or append history.
  - Constraints: no resolver effects, physics, scoring, balance, randomness, product wiring, hardware, or acceptance claim.
  - Checks: focused Vitest integration test, full Vitest, typecheck, and `git diff --check`.
  - Result: focused integration `4/4`, full Vitest `113/113`, typecheck, and `git diff --check` PASS; token and sequence replays remained single-call/single-append.
  - Rollback: remove only the ECO104-12 test and its tracker/project-view entries.
- [x] **ECO104-13 — Keep internal controls behind the session port**
  - Route: direct application-boundary regression.
  - Acceptance: after a committed round, the internal lifecycle retains its audit input, while the session snapshot and console view model expose only their closed public fields and contain no token, calibration identifier, or normalized control data.
  - Constraints: do not change mapping or UI behavior; no privacy certification or security-audit claim.
  - Checks: focused integration test, full Vitest, typecheck, and `git diff --check`.
  - Result: focused integration `5/5`, full Vitest `114/114`, `npm run typecheck`, and `git diff --check` PASS.
  - Rollback: remove only the ECO104-13 test and its tracker/project-view entries.

- [x] **ECO104-14 — Keep session snapshots closed and immutable in every status**
  - Route: direct application-boundary regression.
  - Acceptance: `waiting-input` (disconnected, confirmation-required, and fresh
    input required), `ready`, `reset-required`, and `completed` snapshots expose
    the same six primitive fields, remain frozen, and reject mutation attempts.
  - Constraints: no production mapping changes, product wiring, physical models,
    hardware behavior, privacy-certification, or gameplay claims.
  - Checks: focused integration test, full Vitest, typecheck, and `git diff --check`.
  - Result: focused integration `6/6`, full Vitest `115/115`, typecheck,
    structural/whitespace validators, Markdown audit, and `git diff --check` PASS.
  - Rollback: remove only the ECO104-14 regression and its tracker/project-view entries.

- [x] **ECO104-15 — Reject uint32 sequence wrap without advancing**
  - Route: direct host-adapter/application integration boundary regression.
  - Acceptance: after accepting and confirming sequence `0xffffffff`, a wrapped
    sequence `0` returns `SEQUENCE_INVALID`, clears exposed values, preserves the
    accepted maximum sequence and round history, and never invokes the resolver
    again.
  - Constraints: no sequence epoch/wrap protocol, reconnect behavior, firmware,
    product wiring, or hardware claim is added.
  - Checks: focused integration test, full Vitest, typecheck, and `git diff --check`.
  - Result: focused integration `7/7`, full Vitest `116/116`, typecheck,
    docs-link tests `7/7`, Markdown audit, structural/whitespace validators, and
    `git diff --check` PASS.
  - Rollback: remove only the ECO104-15 regression and its tracker/project-view entries.

## Acceptance criteria

1. Accept only manifest version `round-lifecycle-manifest/v1` with exactly six ordered rounds and unique IDs.
2. Reject wrong versions/counts, duplicates, malformed rounds/events, unsupported event types, malformed data, and unknown fields with stable reason codes.
3. Preserve caller-provided seed and resolver version for traceability without generating entropy.
4. Consume adapter-compatible normalized snapshots without importing the adapter; invalid controls never cause side effects or stale reuse.
5. `confirm: false` does not resolve or advance.
6. One valid confirmation resolves exactly once; duplicate/replayed sequence-token input never duplicates resolver calls or history.
7. Six valid resolutions terminate; a seventh attempt returns an explicit deterministic reason.
8. Equal manifest, seed, resolver behavior, and input sequence produce deeply equal immutable histories and snapshots.
9. The injected synthetic resolver receives frozen inputs and returns a plain deterministic result.
10. No claims of solvability, balance, 8–12 minute duration, gameplay, product integration, or hardware behavior.

## Checks

- `node --test tools/round-lifecycle/*.test.mjs`
- `node --test tools/device-simulator/*.test.mjs tools/host-adapter/*.test.mjs tools/game-scorecard/*.test.mjs tools/round-lifecycle/*.test.mjs`
- Bounded adversarial probes reproduce and close all five accepted findings.
- Regression coverage includes accessor snapshots/results, recursive confirm,
  deep results, sequence 10→9, hidden/symbol/array-extra/accessor manifest data,
  guard cleanup after snapshot-capture failure, hostile constructor options,
  capture-time Proxy reentry, and the six-entry history ceiling.
- Deterministic replay and deep-immutability tests in the focused suite.
- Source scan for forbidden entropy, timer, and import tokens.
- `git diff --check`
- `git status --short --branch`
- `git show --stat --oneline --decorate -1`

## Rollback

Remove `tools/round-lifecycle/`, this tracker, and only the ECO-104 paragraphs added to project documents. No product, scientific, scorecard, adapter, or hardware path may depend on this reference.

Correction rollback: revert only the ECO104-4 correction commit to restore
`a0ac3ca`; that state is independently blocked and must not be treated as a safe
reference.

Second-correction rollback: revert only the ECO104-5 correction commit to restore
`cffd552`; that state remains vulnerable to capture-time reentry and uncoded
constructor exceptions and must not be treated as a safe reference.

## Progress and evidence

- Status: bounded reference work unit implemented and locally verified; parent
  ECO-104 remains `PENDIENTE`.
- Branch: `feat/eco-104-round-lifecycle`, created from `5e19fca`.
- Engram mirror: pending; the required write to topic
  `odd/eco-104-round-lifecycle/tasks` was attempted, but session registration
  could not be confirmed.
- Unrelated untracked `.codegraph/` and `.gitignore` remain outside scope.
- Changed files: lifecycle module, behavior tests, manifest fixture and README;
  this tracker; minimal architecture, backlog, AI log, status, test-plan and
  event-document alignment (11 paths total).
- Focused check: `node --test tools/round-lifecycle/*.test.mjs` — exit 0;
  20 tests, 20 pass, 0 fail, 0 skipped.
- Combined check: `node --test tools/device-simulator/*.test.mjs
  tools/host-adapter/*.test.mjs tools/game-scorecard/*.test.mjs
  tools/round-lifecycle/*.test.mjs` — exit 0; 114 tests, 114 pass, 0 fail,
  0 skipped.
- Deterministic replay and deep immutability are covered by the focused suite.
- Source scans found no entropy/timer tokens or forbidden imports; both returned
  explicit `PASS` markers. `git diff --check` exited 0 with no output.
- Final authored line count: 504 additions plus deletions across 11 paths
  (`503` additions, `1` deletion), measured from the staged diff.
- Delivery: one cohesive local work-unit commit; the bounded 400-line advisory
  is exceeded to retain tests, documentation, fixture and traceability without
  code-golf. No push or PR is authorized.
- Commit subject: `feat(game): add deterministic round lifecycle reference`.
  The resulting hash is reported by `git show`; a commit cannot contain its own
  stable hash without changing that hash.
- Correction status: reopened after an independent verifier blocked `a0ac3ca` on
  the five accepted hostile-input and reentrancy defects listed in ECO104-4.
- ECO104-4 focused check: `node --test tools/round-lifecycle/*.test.mjs` — exit
  0; 41 tests, 41 pass, 0 fail, 0 skipped.
- ECO104-4 combined check: the documented combined command — exit 0; 135 tests,
  135 pass, 0 fail, 0 skipped.
- Bounded adversarial probes returned `INPUT_DATA_INVALID` without getter or
  resolver calls, `RESOLUTION_IN_PROGRESS` with one history entry,
  `RESOLVER_RESULT_INVALID` without getter calls,
  `RESOLVER_RESULT_LIMIT_EXCEEDED`, `INPUT_SEQUENCE_NOT_INCREASING`, and
  `MANIFEST_DATA_INVALID`; no native error escaped.
- ECO104-4 `git diff --check` — exit 0 with no output. The correction contains
  361 authored changed lines (`318` additions, `43` deletions) across 7 paths;
  final status/show are recorded after commit.
- Correction commit subject: `fix(game): harden round lifecycle boundaries`.
- ECO104-5 reopened the task for three accepted residual findings: the guard did
  not cover snapshot reflection, constructor destructuring leaked native errors,
  and descriptor aggregation preceded the entry-limit decision.
- ECO104-5 focused check: `node --test tools/round-lifecycle/*.test.mjs` — exit
  0; 52 tests, 52 pass, 0 fail, 0 skipped. All prior 41 tests remain green.
- ECO104-5 combined check: the documented combined command — exit 0; 146 tests,
  146 pass, 0 fail, 0 skipped.
- The original bounded probe returned `INPUT_DATA_INVALID` with zero getter
  reads, `RESOLUTION_IN_PROGRESS` with one append,
  `RESOLVER_RESULT_INVALID`, `RESOLVER_RESULT_LIMIT_EXCEEDED`,
  `INPUT_SEQUENCE_NOT_INCREASING`, and `MANIFEST_DATA_INVALID`.
- The new bounded probe returned six nested `RESOLUTION_IN_PROGRESS` reasons,
  one outer append, valid retry after `INPUT_DATA_INVALID`, exactly six total
  resolver calls/entries, terminal `LIFECYCLE_COMPLETED`, stable
  `OPTIONS_DATA_INVALID`, and an aggregate limit rejection before any descriptor
  read. No seventh resolver invocation or native error occurred.
- Second correction commit subject: `fix(game): guard round confirmation capture`.
- ECO104-6 added `tools/round-host-integration/` without changing either
  composed API. Ordinary ingestion never calls the resolver; only
  `confirm(token)` forwards the adapter's current normalized snapshot.
- Focused check: `node --test tools/round-host-integration/*.test.mjs` — exit 0;
  14 tests, 14 pass, 0 fail, 0 skipped.
- Combined simulator, adapter, scorecard, lifecycle and integration check — exit
  0; 160 tests, 160 pass, 0 fail, 0 skipped.
- Forbidden source/dependency scans returned `FORBIDDEN_SOURCE_SCAN_PASS` and
  `DEPENDENCY_SCAN_PASS`; `git diff --check` exited 0 with no output.
- Delivery: one cohesive `feature-branch-chain` child after `8268971`, within
  the approximately 400-line budget; no remote branch or PR is authorized.
- Final authored count: 319 lines (`317` additions, `2` deletions) across 11 paths.
- Commit subject: `feat(game): compose host adapter with round lifecycle`; the
  stable hash is obtained from final `git show` because a commit cannot contain
  its own hash.
- Rollback: revert this one work-unit commit, removing only the integration
  harness and ECO104-6 documentation; adapter and lifecycle remain independent.
- Engram mirror: pending. The save was attempted, but session registration could
  not be confirmed by the Engram server.
- ECO104-7 reopened the integration after an independent verifier accepted three
  severe defects: hostile coercion reentry, resolver-driven integration mutation,
  and adapter repopulation after reset became mandatory.
- The integration now guards all three mutating methods before lower-level or
  caller-controlled work, rejects non-string lines before parsing, and checks
  reset before adapter ingestion or lifecycle confirmation. Busy and reset paths
  preserve adapter, lifecycle and reset state; `finally` cleanup permits retry.
- Focused check: `node --test tools/round-host-integration/*.test.mjs` — exit 0;
  18 tests, 18 pass, 0 fail, 0 skipped.
- Combined simulator, adapter, scorecard, lifecycle and integration check — exit
  0; 164 tests, 164 pass, 0 fail, 0 skipped.
- Bounded probes returned `ORIGINAL_COERCION_PROBE_PASS` and
  `NEW_TRANSACTION_RESET_PROBE_PASS`; coercion/resolver counts, adapter state,
  reset status and the six-call resolver ceiling remained bounded. Forbidden
  source/dependency scans and `git diff --check` passed without findings.
- Delivery: the next cohesive `feature-branch-chain` child after `8d8e439`, under
  the 400 authored-line budget: 208 lines (`191` additions, `17` deletions)
  across seven paths. No push or PR is authorized.
- Correction commit subject: `fix(game): guard integration mutations`; obtain its
  stable hash from final `git show` because a commit cannot contain its own hash.
- Rollback: revert only this correction child to restore `8d8e439`; that state is
  independently blocked and must not be treated as a safe integration reference.
- ECO104-8 replaced the six generic fixture keys with `base-demand`,
  `high-temperature`, `low-river`, `demand-peak`, `reduced-light`, and
  `seeded-combination`, preserving the closed `synthetic` event shape.
- Focused lifecycle check: `node --test tools/round-lifecycle/*.test.mjs` — exit
  0; 53 tests, 53 pass, 0 fail, 0 skipped. Focused integration check:
  `node --test tools/round-host-integration/*.test.mjs` — exit 0; 18 tests,
  18 pass, 0 fail, 0 skipped.
- Combined simulator, adapter, scorecard, lifecycle and integration check — exit
  0; 165 tests, 165 pass, 0 fail, 0 skipped. Forbidden entropy/timer/dependency
  scans returned no matches; `git diff --check` exited 0 with no output.
- Delivery: one cohesive `feature-branch-chain` child after `d97e5d1`, with 104
  authored changed lines (`92` additions, `12` deletions). Commit subject:
  `feat(game): bind provisional round
  event keys`; obtain its stable hash from final `git show`.
- Rollback: revert only the ECO104-8 child to restore generic fixture identifiers;
  lifecycle validation, integration behavior and all earlier hardening remain.
- ECO104-9 promoted the sole implementation byte-identically to the application layer; old/new SHA-256 both equal `9f30f4b171349581bfa1f0ac01587028cf2b7793f40d6a100da0272c28abac`. The tool suite and host harness import that canonical path; strict declarations and Vitest compatibility coverage add no runtime semantics.
- Observed checks: lifecycle 53/53, integration 18/18, complete reference suite 165/165, focused compatibility 2/2, full Vitest 52/52, widened layer/network 2/2 and offline 26+3, typecheck, build, browser/offline smokes, API spot check, duplicate/import scan and whitespace PASS.
- Delivery remains one local promotion child after `be6bd16`, with 259 authored lines (`237` additions and `22` deletions) across 17 paths and no push or PR; the lifecycle move is a zero-line rename. Rollback is the promotion commit only. ECO-104 remains **PENDIENTE** because no effects, balance, solvability, science, hardware or product wiring were added.
- ECO104-10 moved the sole host composition into application and added a pure
  product-port mapper. It requires a fresh sequence after every confirmation,
  maps disconnect to reset, and maps six committed rounds to completion.
- ECO104-10 evidence: integration 18/18, complete references 165/165, Vitest
  59/59, typecheck, build, browser/offline smokes and scan 36+3 PASS. `main.ts`,
  manifests, event effects, science and hardware remain unwired.
- ECO104-10 delivery: one child after `65cf481`, with 360 authored lines (`289`
  additions and `71` deletions) across 14 paths; no push, PR or merge is created.
- ECO104-11 replaced the JSON fixture and local Vitest manifests with one deeply
  immutable application manifest while preserving the six provisional keys.
- ECO104-11 evidence: lifecycle+integration 71/71, complete references 165/165,
  Vitest 60/60, typecheck, build, browser/offline smokes and scan 38+3 PASS.
  Event effects, scientific values, solvability and `main.ts` remain unchanged.
- ECO104-11 delivery: one child after `8dd2625`, with 135 authored lines (`92`
  additions and `43` deletions) across 15 paths; no push, PR or merge is created.
- ECO104-12 confirms the application composition's resolver contract and replay
  boundary without changing runtime behavior; the reference remains isolated and
  ECO-104 stays **PENDIENTE**.
- ECO104-13 verifies the session and console ports do not expose committed
  tokens, calibration identifiers, or control values; it does not certify privacy
  or security and does not alter runtime behavior.

## Delivery decision and review chain

- Decision date: 2026-11-04.
- Candidate snapshot: `5e19fca..f6117d3` contains 1,016 authored changed lines
  (`1,014` additions and `2` deletions) across 11 paths. This snapshot count is
  not the sum of per-commit review effort because both correction commits modify
  lines introduced earlier.
- Chosen delivery: chained PRs using `feature-branch-chain`; the full candidate
  does not receive a `size:exception`.
- Review budget: at most approximately 400 authored additions plus deletions and
  approximately 60 minutes per focused child review.
- Remote status: no branch was pushed and no PR number, remote branch, merge, or
  remote operation exists or is authorized.
- Local history is preserved exactly; no commit is rewritten by this decision:
  `5e19fca` → `a0ac3ca` → `cffd552` → `f6117d3` →
  `docs(odd): record ECO-104 chained delivery plan`. The final commit cannot
  record its own stable hash; inspect it with `git show`.

### Intended dependency diagram

The names below are review roles, not claims that remote branches or PRs exist.
Each child would target the immediately preceding review branch; the local
tracker/integration branch alone may eventually target `main`.

```text
main
 └── feat/eco-104-round-lifecycle (local tracker/integration; final target only)
      ↑ slice 1: executable reference (review-only / no-merge)
      └── slice 1 review branch
           ↑ slice 2: project traceability (review-only / no-merge)
           └── slice 2 review branch
                ↑ slice 3: boundary hardening (review-only / no-merge)
                └── slice 3 review branch
                     ↑ slice 4: capture guard (review-only / no-merge)
                     └── slice 4 review branch
```

The tracker/integration view remains draft/no-merge until every child is
reviewed and the final integrated verification passes. Intermediate children
must never target or merge into `main`: slices 1 and 2 retain the severe defects
closed by `cffd552`, and slice 3 retains the severe residual defects closed by
`f6117d3`. Slice 4 is also review-only so integration occurs only from the final
tracker branch.

### One-pass slicing analysis and review boundaries

| Slice | Local source | Authored lines | Start state | End state and boundary | Verification evidence | Merge status | Rollback |
|---|---|---:|---|---|---|---|---|
| 1 — executable lifecycle reference | Future review-only split of `a0ac3ca` | 366 (`366+0`) | `5e19fca`; no lifecycle executable | Keep `round-lifecycle.mjs`, its focused tests, manifest fixture, and operator README together as one runnable behavior unit | Existing original-snapshot evidence: focused 20/20 and combined 114/114 PASS, deterministic replay/deep immutability coverage, forbidden-token scans PASS, and `git diff --check` PASS | **Review-only / no-merge; unsafe snapshot** | Remove `tools/round-lifecycle/` only |
| 2 — traceability and project alignment | Future review-only split of `a0ac3ca` | 138 (`137+1`) | Slice 1 behavior exists but project records are unaligned | Align architecture, backlog, AI log, status, test plan, event documentation, and this tracker; no executable behavior | Inspect exact docs-only diff and cross-references; `git diff --check`; no runtime boundary beyond slice 1 | **Review-only / no-merge; unsafe snapshot** | Revert only the eight documentation paths to the slice 1 state |
| 3 — hostile-data and reentrancy hardening | `cffd552` | 361 (`318+43`) | Equivalent final state of slices 1–2, still blocked by five independently verified severe defects | Close TOCTOU/accessor, recursive resolution, result traversal, sequence regression, and closed-schema bypasses without mixing the later capture-guard fix | Focused 41/41 and combined 135/135 PASS; bounded adversarial probes close the five accepted findings; `git diff --check` PASS | **Review-only / no-merge; unsafe residual snapshot** | Revert `cffd552` only; restored state remains blocked |
| 4 — capture-time guard and option validation | `f6117d3` | 349 (`293+56`) | `cffd552`, still vulnerable to capture-time reentry, constructor native errors, and late aggregate-limit checks | Guard capture through result handling, validate exact constructor options, and reject aggregate limits before descriptor materialization | Focused 52/52 and combined 146/146 PASS; original and new bounded probes PASS with no seventh resolver call or native error; `git diff --check` PASS | **Review-only / no-merge** | Revert `f6117d3` only; restored state remains blocked |
| 5 — provisional event identifiers | ECO104-8 child after `d97e5d1` | 104 (`92+12`) | Transaction-safe lifecycle and host composition exist with generic event keys | Bind the documented fixed order to six unique semantic fixture keys; retain caller-seed traceability and no event effects | Focused lifecycle 53/53, integration 18/18 and combined 165/165 PASS; forbidden scans and `git diff --check` PASS | **Current local child / no remote operation** | Revert only the ECO104-8 child |

This is the single honest slicing pass. The original 504-line commit separates
cohesively into a 366-line executable unit and a 138-line traceability unit, so
neither requires `size:exception`. Tests, fixture, implementation, and operator
README stay together. The 361-line and 349-line corrections remain separate
focused child reviews. No slice exceeds the budget, so no later
`size:exception` is currently required; if reconstructed diffs change those
counts above 400, record the smallest honest count and obtain explicit approval
instead of shrinking code or evidence.

## Next step

Keep the current commits unchanged and local. If remote delivery is authorized
later, first reconstruct and independently verify the four review-only child
boundaries above, then request separate authorization before any push or PR
creation; only the final tracker/integration branch may target `main`. Product
work remains separate: use this reference only as lifecycle evidence until a
later bounded unit selects real event/rule semantics and integration boundaries
through authorized decisions. ECO-104 remains `PENDIENTE`.
