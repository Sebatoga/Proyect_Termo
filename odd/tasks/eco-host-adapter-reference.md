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

- [x] **HOST-003 — Promote the canonical protocol parser**
  - Route: direct implementation on `feat/eco-protocol-promotion` after `9ac1500`.
  - Acceptance: `src/infrastructure/device-protocol/` owns one typed parser and sequence validator; simulator scenarios remain in `tools/`, while the simulator facade and host adapter consume the same implementation without behavioral change.
  - Checks: protocol/adapter/integration Node suites, full 165-test reference suite, typecheck, Vitest, build, browser/offline smokes, source-layer and duplicate scans, whitespace, authored-line guard and final status/show.
  - Rollback: revert only HOST-003 to restore parser ownership to the simulator; lifecycle promotion and prior adapter behavior remain intact.
  - Delivery boundary: one child commit below 400 authored additions plus deletions; no serial, hardware, product wiring, gameplay or protocol-version change.

- [x] **HOST-004 — Promote the fail-closed host adapter**
  - Route: direct implementation on `feat/eco-host-adapter-promotion` after `0e0b1e5`.
  - Acceptance: `src/infrastructure/host-adapter/` owns one typed adapter implementation; the tool API remains a thin compatibility facade and round integration imports infrastructure directly, with unchanged fail-closed behavior.
  - Checks: adapter and integration suites, full 165-test references, typecheck, Vitest, build, browser/offline smokes, layer/duplicate/import scans, whitespace, authored-line guard and final status/show.
  - Rollback: revert only HOST-004 to restore adapter ownership to `tools/`; HOST-003 parser ownership remains intact.
  - Delivery boundary: one child commit below 400 authored additions plus deletions; no serial, hardware, timeout, retry, product wiring, gameplay or protocol change.

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
- HOST-003 extracted the parser and sequence validator into
  `src/infrastructure/device-protocol/`, added strict declarations, retained the
  simulator scenarios behind a compatibility facade, and redirected the host
  adapter to the canonical infrastructure path.
- HOST-003 evidence: protocol plus adapter 27/27 PASS; host integration 18/18
  PASS; complete Node references 165/165 PASS; Vitest 54/54 PASS; typecheck,
  build, browser smoke and offline smoke PASS; the staged offline scan covered
  29 source/config files plus three built assets. No serial or hardware path was
  added.
- HOST-003 delivery: one child after `9ac1500`, with 320 authored lines (`232`
  additions and `88` deletions) across 14 paths; no push, PR or merge is created.
- HOST-004 moved the sole fail-closed adapter implementation to
  `src/infrastructure/host-adapter/`, added strict declarations and direct
  Vitest compatibility coverage, retained a one-line tool facade, and redirected
  round integration to infrastructure.
- HOST-004 evidence: adapter plus integration 33/33 PASS; complete Node
  references 165/165 PASS; Vitest 56/56 PASS; typecheck, build, browser smoke
  and offline smoke PASS; the staged offline scan covered 32 source/config files
  plus three built assets. No serial transport or hardware behavior was added.
- HOST-004 delivery: commit `59cd057` after `0e0b1e5`, with 298 authored lines
  (`195` additions and `103` deletions) across 14 paths; no push, PR or merge.

## Next step

Promote the isolated adapter-lifecycle composition only after defining its typed
application snapshot mapping; do not wire `main.ts` yet. Keep ECO-109 pending
until G1 permits firmware, calibration and real USB serial work; do not infer
physical connectivity from this infrastructure.
