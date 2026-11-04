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
- Delivery strategy: `ask-on-risk`; keep the cohesive work unit near the 400 authored-line advisory without code-golf or omitted tests/docs.
- Expected authored lines: approximately 400–500 across implementation, tests, README, tracker, and minimal project alignment.

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
  guard cleanup after failure, and the six-entry history ceiling.
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

## Next step

Use this reference only as evidence for the lifecycle contract. A later bounded
unit must select real event/rule semantics and integration boundaries through
authorized product decisions before ECO-104 can advance beyond `PENDIENTE`.
