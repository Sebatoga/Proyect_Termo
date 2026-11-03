# EcoGrid Host Adapter Reference Spike

## Objective

Create a dependency-free, hardware-independent reference for the device-to-host boundary: first make protocol direction explicit, then consume device JSON Lines with fail-closed state transitions and no silent reuse of stale values.

## Authorized scope

- Refine only the simulator/fixture direction contract already documented by JSON Lines v1.
- Implement a local Node.js reference adapter under `tools/`, separate from future product code.
- Add deterministic tests and operator documentation.
- Update only the minimum architecture, hardware-manual, test-plan, status, and AI-trace views required by the spike.
- Preserve ECO-002 as blocked, ECO-108/G1 as physically open, and ECO-109 as pending.

## Constraints

- No hardware, serial port, Web Serial, firmware, product bootstrap, package installation, network access, scientific model, gameplay rule, UI, or final timeout/baud/pinout.
- Device-to-host accepts `hello`, `inputs`, and `error`; `output` remains host-to-device.
- Invalid, disconnected, malformed, unsupported, out-of-sequence, or wrong-direction input must never expose the last valid values as current.
- Fixed deterministic fixtures; no `Math.random()` or wall-clock-dependent expected output.
- TDD mode: disabled by project setting; behavior-first Node tests remain mandatory.
- Delivery strategy: `ask-on-risk`; target no more than 400 authored changed lines per work unit.

## Tasks

- [x] **HOST-001 — Make simulator direction explicit**
  - Route: delegated direct.
  - Trigger evidence: protocol library, CLI, fixtures, tests, README, and contract documentation require coordinated non-trivial edits.
  - Acceptance: device emission contains only `hello`/`inputs`/`error`; host output remains a separate fixture/command; legacy ambiguity is removed or rejected explicitly.

- [x] **HOST-002 — Implement the fail-closed host adapter**
  - Route: delegated direct.
  - Trigger evidence: state machine, CLI, integration fixtures/tests, failure semantics, and documentation span multiple files.
  - Acceptance: valid inputs normalize deterministically; every invalid/disconnected path clears current values and reports an explicit issue without claiming serial hardware.

## Verification

- Focused Node tests pass for protocol and adapter.
- Device and host directions are structurally distinct.
- Valid, invalid, disconnected, malformed, unsupported-version, sequence-gap, and wrong-direction cases are covered.
- Repeated executions are byte-identical.
- `git diff --check` passes per work unit.

## Progress and evidence

- Status: technically completed; ordinary independent verification PASS with no
  blocking findings. Native review is unavailable and produced no approval or
  receipt.
- Branch: `feat/eco-host-adapter-reference`; HOST-001 started after `37cd209`.
- HOST-001 commit: `aee15fb` (`fix(protocol): separate device and host message streams`).
- HOST-001 evidence: 12/12 Node tests pass; all three CLI streams match their
  directional fixtures byte for byte; type scan, legacy-command failure,
  repeated-execution comparison and `git diff --check` pass.
- HOST-002 commit: `2a4deab` (`feat(protocol): add fail-closed host adapter reference`).
- HOST-002 evidence: 23/23 joint Node tests pass; nominal pipe ends with six
  valid values; disconnect/error expose no stale values; malformed, version,
  sequence and wrong-direction cases report stable codes; repeated CLI output
  is byte-identical; `git diff --check` passes.
- Additional coverage commit: `c0a4380` (`test(protocol): cover remaining
  fail-closed paths`), covering an unsupported type after valid values,
  duplicate and reordered sequences, and deterministic CLI error snapshots.
- Ordinary independent verification: `node --test
  tools/device-simulator/*.test.mjs tools/host-adapter/*.test.mjs` → 27/27 PASS;
  `git diff --check` → PASS with no output.
- Native review: Gentle AI 3.7.0 dropped `base-ref`/`committed-only` during
  untracked selection and turned the 20-path range into an empty candidate; no
  approval or receipt was created. The occurrence is recorded in
  [issue #4890](https://github.com/Gentleman-Programming/gentle-ai/issues/4890#issuecomment-6609495590).
  PR #5872 contains the fix, but it merged after the latest published stable
  release, v4.3.1; no stable fix is published yet.
- Engram mirror: pending; session registration was not confirmed.
- Local `.codegraph/` and `.gitignore` remain untracked and outside this task.

## Next step

Technical closure retains the ordinary independent PASS and explicitly lacks a
native review receipt. Keep ECO-109 pending until G1 permits firmware,
calibration and real USB serial work; do not infer physical connectivity from
this reference.
