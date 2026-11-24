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

- [x] **ECO105-2 — Restart a completed simulated technical session**
  - Route: `delegated`; trigger evidence: session behavior, UI focus/state, tests,
    Chrome replay evidence and traceability span more than four non-trivial files.
  - Acceptance: reset is rejected without mutation before completion; completion
    enables reset; reset creates a fresh simulated integration at round 1, clears
    accepted values/trace, restores load-only availability and focuses load.
  - Replay: a second six-round execution must reproduce the first snapshots,
    accepted fields, event order and sequences without reloading the page or
    creating another Phaser instance.
  - Boundaries: reset belongs only to `SimulatedRoundSession`; do not modify the
    generic port, canonical protocol/adapter/integration/lifecycle or manifest.
  - Claims excluded: no hardware reconnection, serial recovery, resynchronization,
    gameplay replay, scientific reproducibility or accessibility approval.
  - Verification: focused/full Vitest, typecheck, build, 165 Node references,
    browser reset/replay, port regression, offline smoke, scans and whitespace.
  - Delivery: `ask-on-risk`; one cohesive work unit forecast at 230–320 authored
    lines, with a hard stop before commit above 400.
  - Rollback: revert ECO105-2 to remove reset/replay while preserving ECO105-1,
    the existing six-round loop and all canonical modules.

- [x] **ECO105-3 — Diagnose and recover from malformed simulated input**
  - Route: `delegated`; trigger evidence: simulated-session behavior, accessible
    diagnostic UI, tests, browser recovery evidence and records span multiple files.
  - Scenario: one fixed local malformed JSON line (`{`) exercises canonical
    `MALFORMED_JSON`; no arbitrary editor or new parser semantics are allowed.
  - Acceptance: only `waiting-input` accepts the diagnostic; it clears exposed
    accepted values, preserves round/trace, disables confirmation and does not
    consume sequence or advance lifecycle. The next normal load succeeds with the
    expected sequence and confirmation remains a separate action.
  - UX: place the action inside collapsed native `<details>` with explicit copy
    that it proves only local simulated rejection/recovery, not sensors, connection
    or hardware. Announcements must report the actual confirmed-round count.
  - Boundaries: no protocol/adapter/integration/lifecycle/manifest changes; no
    serial, timeout, reconnect, retry scheduling, firmware, units or gameplay.
  - Verification: focused/full Vitest, typecheck, build, Node references, Chrome
    diagnostic/recovery plus both replays, port/offline regressions, scans and diff.
  - Delivery: `ask-on-risk`; one cohesive work unit forecast at 240–330 authored
    lines, with hard stop before commit above 400.
  - Rollback: revert ECO105-3 while preserving ECO105-1/2 and canonical modules.

- [x] **ECO105-12 — Verify untrusted transport labels render as literal text**
  - Route: browser regression in the existing manual JSON Lines smoke.
  - Acceptance: an SVG/event-handler string supplied as `calibrationVersion` is
    displayed literally in the simulated observation summary; it creates no SVG
    element and executes no handler.
  - Boundaries: no parser, protocol, adapter, physics, gameplay, or device changes;
    this protects text rendering only and is not a general security audit.
  - Verification: `npm run test:browser-smoke` with Chrome 156; retain existing
    desktop/mobile, game-state, and zero-JavaScript-error assertions.
  - Result: PASS; `calibration_markup=rendered-as-text-no-elements-or-event-execution`,
    390/320 px reflow PASS, JavaScript errors 0.

- [x] **ECO105-13 — Verify untrusted device error details render as literal text**
  - Route: browser regression in the existing manual JSON Lines smoke.
  - Acceptance: a valid protocol `error` message carries SVG/event-handler markup
    in `detail`; Chrome observes the exact `DEVICE_FAULT` reason as text, no SVG
    descendant in the issue target, and no handler execution.
  - Boundaries: no parser, protocol, adapter, physics, gameplay, or device changes;
    this is a narrow rendering regression, not a general security audit.
  - Verification: `npm run test:browser-smoke` with installed Chrome; preserve
    existing desktop/mobile, game-state, and bounded JavaScript-error assertions.
  - Result: PASS; Chrome 156 observed
    `error_detail_markup=rendered-as-text-no-elements-or-event-execution`,
    zero bounded JavaScript errors, and 390/320 px reflow; Vitest 116/116,
    typecheck, docs-link tests 7/7, audit `125/36/0/0`, structural/whitespace
    validators, and `git diff --check` PASS.

- [x] **ECO105-14 — Verify untrusted error detail in the live announcement**
  - Route: extend the existing browser regression for both visible issue text and
    the separate device `role="status"` / `aria-live` announcement.
  - Acceptance: the `error.detail` appears literally in `#device-announcement`,
    creates no child elements, and does not execute the same SVG load handler.
  - Boundaries: no production or accessibility semantics changes; this verifies
    literal rendering only, not announcement timing, screen-reader behavior, or
    accessibility conformance.
  - Verification: `npm run test:browser-smoke`, full Vitest, typecheck, document
    checks, structural/whitespace validators, and `git diff --check`.
  - Result: PASS; Chrome 156 observed the exact literal announcement with no
    child elements or SVG handler execution; zero bounded JavaScript errors and
    390/320 px reflow PASS. Vitest 116/116, typecheck, docs-link tests 7/7,
    audit `125/36/0/0`, structural/whitespace validators, and `git diff --check`
    PASS. No screen-reader behavior was tested.

## Progress and evidence

- Branch: `feat/eco-105-simulated-observability` from `4ddbecf`.
- ECO105-2 branch: `feat/eco-105-simulated-restart` from `9bed727`.
- ECO105-3 branch: `feat/eco-105-malformed-diagnostic` from `78dfeb8`.
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
- ECO105-2 result: `SimulatedRoundSession.reset()` accepts only `completed`, then
  creates the same deterministic integration anew and resets sequence/token
  derivation. The native reset control is disabled otherwise and returns focus to
  load after rendering the fresh waiting state.
- Observed replay: Chrome 156 completed two six-round runs without reload; visible
  snapshots, nine accepted fields, six event rows and sequences were deeply equal.
  Reset exposed round 1/6, `DEVICE_DISCONNECTED`, zero accepted `dd`/trace rows,
  load enabled, confirm/reset disabled, load focus and the same sole Phaser canvas.
- Verification: focused Vitest 4/4, full Vitest 64/64, typecheck, build, Node
  references 165/165, browser and offline smokes, smoke negatives 2/2, port
  impostor 1/1, layer/network/entropy/boundary scans and whitespace PASS. Offline
  observed eight local/data requests and static scan `41+3`; bounded browser
  JavaScript errors were zero at desktop and 390 px had no horizontal overflow.
- ECO105-2 changed paths: simulated session/test, root markup/wiring, browser
  harness/PNG/report, generated offline report, architecture, backlog, state, test
  plan, AI log and this task. Authored size: `288` additions+deletions, excluding
  generated PNG. Planned identity: `feat(console): restart completed simulated session`.
- Fallback review: la primera versión quedó bloqueada por texto comprimido y
  aserciones geométricas/trazas insuficientes. Se equilibró el layout y el smoke
  ahora exige trazas exactas, dimensiones, contención y ausencia de solapamientos.
  El pase final no encontró hallazgos; no sustituye aprobación de `@revisor-ux`.
- Runtime limits: local Chrome simulated technical replay only; no hardware
  reconnection, serial recovery/resynchronization, gameplay replay, scientific
  reproducibility, assistive-technology/accessibility approval or physical proof.
- Rollback: remove `reset()` and its tests, the reset button/wiring, replay smoke
  assertions/evidence and these ECO105-2 entries; ECO105-1 and canonical modules
  remain intact. Human and `@revisor-ux` review remain pending.
- ECO105-3 result: `runMalformedInputDiagnostic()` ingests only `{` and only from
  `waiting-input`; it preserves sequence, round and trace while canonical state
  reports `MALFORMED_JSON` with no accepted values or confirmation. Valid load and
  confirmation remain subsequent separate actions.
- Observed checks: focused Vitest 7/7, full Vitest 67/67, typecheck, build, Node
  references 165/165, Chrome smoke, port impostor 1/1, offline smoke and negatives
  2/2, layer/network/entropy/boundary scans and whitespace passed. Chrome 156
  observed the collapsed diagnostic opening, rejection, zero accepted rows,
  unchanged trace, live counts 0/1, ready recovery, two identical six-round runs,
  one canvas, desktop/mobile containment and zero bounded JavaScript errors.
- Runtime limits: only local malformed simulated-message rejection/recovery was
  exercised. It does not test sensors, connection, hardware, serial, timeout,
  firmware, accessibility with assistive technology, gameplay or science.
- Authored size: 252 lines (`228` additions and `24` deletions) across 15 text
  paths, excluding the generated PNG; below the 400-line hard stop. Planned
  identity: `feat(console): add simulated malformed-input diagnostic`.
- Fallback review found no code or UX defects after the strengthened count-0/1,
  exact-trace and geometry evidence; its only blocker was the stale authored-size
  record corrected above. This does not replace unavailable `@revisor-ux` approval.
- ECO105-3 rollback: remove the session method/test cases, native diagnostic UI and
  wiring, browser assertions/evidence and these records; ECO105-1/2 and all
  canonical modules remain. Human and `@revisor-ux` review remain pending.

## Next step

Obtain the pending human/UX review before treating the presentation as accepted.
Keep ECO-105 pending because alerts, causal gameplay and physical integration
remain absent. ECO105-12 covers safe literal rendering only; it does not replace
that review.
