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

- [ ] **HOST-001 — Make simulator direction explicit**
  - Route: delegated direct.
  - Trigger evidence: protocol library, CLI, fixtures, tests, README, and contract documentation require coordinated non-trivial edits.
  - Acceptance: device emission contains only `hello`/`inputs`/`error`; host output remains a separate fixture/command; legacy ambiguity is removed or rejected explicitly.

- [ ] **HOST-002 — Implement the fail-closed host adapter**
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

- Status: in progress.
- Branch: `feat/eco-host-adapter-reference` from `2c27318`.
- HOST-001 commit: pending.
- HOST-002 commit: pending.
- Engram mirror: pending because session registration is unavailable.

## Next step

Execute HOST-001 before implementing any consumer that could misinterpret message direction.
