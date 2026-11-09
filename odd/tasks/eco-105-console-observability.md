# ECO-105 Simulated Console Observability

## Objective

Expose accepted simulated protocol values and the canonical six-round technical
trace without presenting them as hardware readings, calibrated quantities,
scientific effects or completed gameplay.

## Authorized scope

- Extend the existing explicit simulated session with an immutable observation
  of accepted adapter values and lifecycle history already held canonically.
- Render source, sequence, calibration label, six accepted fields and one trace
  entry per confirmed round using safe text rendering.
- Preserve deterministic replay, mobile layout and the current offline boundary.
- Update focused tests, Chrome evidence and minimum project views.

## Constraints

- The user authorized progress that does not depend on known hardware.
- Accepted values are normalized simulated protocol inputs, not raw sensor data.
- Values have no physical units or interpretation; the LDR remains only a future
  `proxy de luz calibrado para gameplay` after real calibration.
- Event keys are provisional trace labels with no gameplay or scientific effect.
- Do not add transport, serial, firmware, GPIO, baud, timeout, calibration,
  physics, energy, score, alerts or event effects.
- ECO-002 remains blocked; ECO-104 and ECO-105 remain pending; ECO-109 remains
  dependent on ECO-108.
- TDD mode: disabled by existing project capability; focused behavior tests are
  still mandatory.
- Delivery strategy: `ask-on-risk`; one cohesive work unit forecast at 330–390
  authored lines, with a hard stop before commit if the honest scope exceeds 400.

## Stable tasks

- [x] **ECO105-1 — Expose accepted simulated inputs and technical round trace**
  - Route: `delegated`; trigger evidence: application API, presentation, tests,
    browser evidence and traceability span more than four non-trivial files.
  - Acceptance: initial observation is empty; load exposes one accepted simulated
    input; confirmation appends exactly one canonical trace entry; six rounds end
    with six ordered entries and disabled controls.
  - Safety: observations are immutable and deterministic; unavailable/repeated
    actions do not duplicate history; rendering uses text nodes or `textContent`.
  - UX: visible copy states simulated, uncalibrated, no units and no effects; the
    390 px smoke retains no horizontal overflow and zero bounded JavaScript errors.
  - Verification: focused/full Vitest, typecheck, build, 165 Node references,
    browser smoke, offline smoke, layer/network scans, whitespace and line budget.
  - Runtime boundary: installed Chrome observes the full technical loop only.
  - Rollback: revert this work unit to remove observability while preserving the
    canonical protocol, adapter, lifecycle, manifest and simulated session loop.

## Progress and evidence

- Branch: `feat/eco-105-simulated-observability` from `4ddbecf`.
- Required UX review: project-specific `@revisor-ux` is not available in the
  current agent registry; use a read-only UX/readability review and record that
  this is not equivalent to the missing specialist review.
- Engram mirror topic: `odd/eco-105-console-observability/tasks`.
- Engram mirror attempt failed because session registration could not be confirmed; non-blocking.
- Result: the session derives an immutable observation from the canonical adapter
  snapshot and lifecycle history; it does not keep a second mutable log.
- Visible Chrome result: accepted source/mode, sequence `5`, calibration label and
  six normalized fields; six ordered `round-1`…`round-6` trace rows; both controls
  disabled at completion; 390 px without horizontal overflow; zero bounded
  JavaScript errors. This is technical observability only.
- Verification: focused Vitest 2/2, full Vitest 62/62, typecheck, build, Node
  references 165/165, browser smoke and offline smoke PASS. Offline observed eight
  local/data requests and scan `40+3`; focused layer/network/entropy scans found no
  prohibited matches; `git diff --check` PASS.
- Changed paths: simulated session, observation renderer, root wiring/markup/styles,
  focused test, Chrome harness/report, architecture, backlog, test plan, state, AI
  log and this task. No protocol, adapter, lifecycle or manifest semantics changed.
- Authored size: 369 lines (`358` additions and `11` deletions), excluding the
  unchanged/generated PNG and ignored build output.
- Rollback: remove the observation API/renderer/panel and its tests/assertions, then
  remove these ECO105-1 evidence entries; the canonical six-round loop remains.
- Review need: human review remains pending; `@revisor-ux` was unavailable, so this
  has only a bounded fallback review, not specialist approval. That review found
  missing live announcements and insufficient geometry/exact-value smoke checks;
  both were corrected before final verification. The final fallback pass found no
  remaining code findings and considered the implementation safe to commit.

## Next step

Obtain the pending human/UX review before treating the presentation as accepted.
Keep ECO-105 pending because alerts, causal gameplay and physical integration
remain absent.
