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
