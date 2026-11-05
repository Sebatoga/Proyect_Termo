# ECO-101 Secondary Console Bootstrap

## Objective

Create the first bounded production bootstrap for EcoGrid's offline secondary local console using the stack ratified by the user.

## Problem and rationale

The disposable runtime spike proved local compatibility, but the repository still has no production application entry point. This work unit establishes a reversible root application without importing scientific models, gameplay rules, hardware behavior, or blocked ECO-002 artifacts.

## Authorized scope

- Create the root Vite, TypeScript, Phaser, and Vitest application and npm lockfile.
- Pin Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2`, and Vitest `5.0.5`.
- Add one minimal scene, typed game configuration, accessible DOM shell, responsive canvas boundary, and deterministic metadata/configuration tests.
- Update ADR-005 and the minimum architecture, backlog, state, test-plan, and AI-log views.
- Install exact npm dependencies and create one local Conventional Commit.
- Keep the physical board as the primary product and the console as secondary and offline.

## Constraints

- Branch: `feat/eco-101-console-bootstrap`, created from `0081907` without moving existing branches.
- Preserve `.codegraph/` untracked and outside the commit. Track the root `.gitignore`, preserving `.atl/` and adding only `/node_modules/` and `/dist/`.
- Do not add Playwright or any package beyond the ratified four.
- Do not implement formulas, thresholds, serial, hardware, event effects, gameplay rules, network services, analytics, or imports from blocked ECO-002.
- Keep the scientific domain isolated from Phaser, DOM, and Canvas.
- TDD mode: disabled, sourced from the existing project testing-capability record (`strict_tdd: false`); focused tests remain mandatory.
- Delivery strategy: `ask-on-risk`.
- Authored-line forecast: 330 additions/deletions, excluding generated `package-lock.json`; stop before commit if the honest authored scope exceeds 400.
- Engram mirror topic: `odd/eco-101-console-bootstrap/tasks` (pending until persistence is confirmed).

## Stable tasks

- [x] **BOOTSTRAP-001 — Establish the production console boundary**
  - Route delegated: direct implementation in the current agent; no child agent is launched.
  - Trigger evidence: the unit spans root tooling, HTML, TypeScript source, focused tests, and mandatory project records while remaining one cohesive bootstrap behavior.
  - Add exact dependency declarations and reproducible npm lockfile.
  - Add an explicit HTML mount, accessible secondary-console shell, typed Phaser configuration, and one minimal scene.
  - Keep configuration and scene metadata deterministic and testable without a browser.
  - Run all required checks and record exact results.
  - Close with exactly one Conventional Commit if the authored-line guard remains within budget.
- [x] **BOOTSTRAP-002 — Observe the production canvas in headless Chrome**
  - Route delegated: direct implementation in the current agent; no child agent is launched.
  - Trigger evidence: BOOTSTRAP-001 passed typecheck, unit tests, and build, but its root product canvas remains unobserved in a browser.
  - Acceptance: a dependency-free root-product harness owns a strict local port, waits for the product title marker, observes the shell text and non-zero Phaser canvas under `#game-container`, records bounded JavaScript error signals, and writes a verified non-empty 800 × 450 PNG.
  - Checks: typecheck, unit tests, build, two consecutive browser-smoke passes, occupied-port negative regression, whitespace check, and final Git status/show.
  - Rollback: revert only the product browser harness, generated ECO-101 product evidence, npm smoke script, and matching task/state/backlog/test-plan/AI-log entries; BOOTSTRAP-001 remains intact.
  - Delivery strategy: `ask-on-risk`, one cohesive local commit below 400 authored additions plus deletions. The approved 431-line exception applies only to BOOTSTRAP-001 commit `9956eb5` and is not reused.
- [x] **BOOTSTRAP-003 — Verify offline static production assets**
  - Route: delegated direct for the bounded harness, negative regressions, durable evidence, and minimal project views.
  - Trigger evidence: the offline boundary required a clean production build, dependency-free static server, Chrome request inventory, post-shutdown observation, static scans, and two negative regression paths.
  - Acceptance: a clean build served only from `dist/` renders the product shell and non-zero Phaser canvas in installed headless Chrome/Chromium; every attempted HTTP(S) request is inventoried and loopback-local, required local resources succeed, static scans find no forbidden network references/APIs, and the loaded shell/canvas remains present without JavaScript errors during a bounded interval after server shutdown.
  - Checks: typecheck, unit tests, build, existing product browser smoke, offline smoke twice, traversal and occupied-port negatives, `git diff --check`, authored-line count, final status/show.
  - Review slice: commit `9bd9195` is one cohesive work unit below 400 authored additions plus deletions, excluding generated evidence binaries.
  - Rollback: remove the offline harness/evidence and npm script, then revert only the BOOTSTRAP-003 tracker and project-view entries; the product bootstrap and BOOTSTRAP-002 smoke remain intact.
- [x] **BOOTSTRAP-004 — Present an honest round-session status**
  - Route delegated: direct implementation in the current agent; no child agent is launched.
  - Trigger evidence: the product shell has no typed application seam and its static status cannot represent unavailable, valid, reset-required, or completed round-session snapshots.
  - Acceptance: `src/application/` owns the immutable product snapshot port; `src/console/` maps safe snapshots to a deterministic, deeply immutable view model and renders neutral Spanish text with explicit round and confirmation availability; bootstrap starts unavailable without claiming hardware, gameplay, science, or integration.
  - Checks: focused Vitest behavior/layer tests, typecheck, full Vitest, build, browser smoke, offline smoke, the 165-test Node reference suite, forbidden import/behavior scans, `git diff --check`, authored-line count, and final Git status/show.
  - Rollback: revert only the round-session port, console mapper/presenter, DOM wiring, focused tests, and matching architecture/state/backlog/test-plan/AI/ODD entries; BOOTSTRAP-001–003 and their evidence remain intact.
  - Delivery boundary: one cohesive Conventional Commit after `f7a76f9`, with fewer than 400 authored additions plus deletions; stop before commit rather than compress or omit required tests/docs if the honest boundary exceeds the limit.

## Acceptance criteria

- Root `index.html` is the Vite entry and contains an explicit Phaser parent container.
- The visible Spanish shell identifies EcoGrid and states that this is a local console bootstrap, not the physical board or completed gameplay.
- Canvas sizing adapts to its parent while preserving a bounded aspect ratio.
- DOM status is text-based and does not rely on color alone.
- `Phaser.Types.Core.GameConfig`, `Phaser.AUTO`, a scene class, and `new Phaser.Game(config)` form the bootstrap path.
- Pure metadata/configuration boundaries are covered by Vitest without requiring a browser.
- Root scripts include `dev`, `typecheck`, `test`, `build`, and `preview`.
- No product-domain physics or blocked ECO-002 import exists.
- ADR-005 records adoption, date, reason, evidence, and the exclusion of Playwright from this unit.
- ECO-101 remains open unless its complete current criterion is genuinely met.
- `.codegraph/` remains untouched and uncommitted; the authorized root `.gitignore` is tracked with only the required generated-output rules added.

## Exact checks

```bash
npm install
npm run typecheck
npm run test -- --run
npm run build
```

A browser/canvas smoke is optional only if the existing local harness can be reused safely without importing the disposable spike into production or expanding this work unit. Otherwise it is explicitly deferred.

## Rollback

Revert the single work-unit commit. This removes the root application, exact dependency lock, focused tests, and matching documentation updates without modifying the disposable spike, scientific artifacts, physical-product plans, or existing branches.

## Progress and evidence

- Status: resumed on 2026-11-04 after explicit human authorization to track the root `.gitignore`.
- Starting point: `0081907` on `feat/eco-104-round-lifecycle`.
- CodeGraph fallback: two queries failed with `no such table: unresolved_refs`; targeted direct reads were used as permitted.
- Ignore-policy blocker: `git check-ignore --no-index -v node_modules/ dist/` produced no output. Without an effective tracked ignore rule, installation/build artifacts would be exposed as untracked content. Per the authorized stop condition, the user-owned untracked root `.gitignore` was not modified.
- Resolution: the user selected **Authorize and track**, requiring preservation of `.atl/`, addition of root `/node_modules/` and `/dist/`, and inclusion of `.gitignore` in this work unit. Ignore behavior must be verified before installation.
- Engram mirror: pending because `mem_save` could not confirm Engram session registration.
- Ignore verification: `.gitignore:5:/node_modules/` matched `node_modules/` and `.gitignore:6:/dist/` matched `dist/` before installation.
- Installation: `npm install` added 39 packages, audited 40 packages, and reported 0 vulnerabilities.
- Initial checks: build passed with the expected Phaser chunk warning; typecheck exposed the missing Vite CSS declaration; Vitest incorrectly discovered seven historical `node:test` files outside the product suite.
- Correction: added `vite/client` types and limited Vitest discovery to `tests/**/*.test.ts`; historical suites remain under their existing Node commands.
- Final focused checks: `npm run typecheck` passed without diagnostics; `npm run test` passed 1 file and 2 tests; `npm run build` passed with a 1,196.59 kB minified chunk (319.55 kB gzip) and the standard over-500 kB warning.
- Browser smoke: deferred because the existing reusable harness is hard-coded to `spikes/runtime-smoke/`; adapting it would expand this work unit. Product canvas rendering remains unverified.
- Authored lines excluding generated `package-lock.json`: 431 additions plus deletions across 19 authored paths.
- Delivery gate: the maintainer explicitly approved `size:exception` for the 431-line cohesive unit, preserving source, tests, documentation, and ODD evidence in the one requested work-unit commit.
- BOOTSTRAP-002 result: Chrome `156.0.8078.47` observed the root shell, expected secondary-console text, and a 960 × 540 canvas displayed at 764 × 432 under `#game-container`. Two consecutive runs produced the same non-empty 800 × 450, 33,505-byte PNG with zero bounded JavaScript console/runtime errors.
- Ownership regression: an HTTP 200 impostor with the exact title/canvas markers occupied port 4173; Vite `--strictPort` forced non-zero exit before Chrome or PASS output, and the test rebound the port after cleanup.
- Evidence: `evidencias/ECO-101/product-browser-smoke/`; product browser/canvas bootstrap boundary is closed, while ECO-101 remains open for offline operation and does not claim gameplay, hardware, physics, serial, or prolonged accessibility/performance.
- BOOTSTRAP-003 commit: `9bd9195` (`test(console): verify offline static build`).
- BOOTSTRAP-003 result: Chrome `156.0.8078.47` made eight successful local/data requests, with zero external HTTP(S) requests, zero required-resource failures, and zero JavaScript/console errors. The canvas was 960 × 540 and displayed at 749 × 423.5625.
- Post-shutdown observation: after the static server stopped, the shell and canvas remained present for 1,000 ms at 749 × 423.5625 without refresh, request failure, or JavaScript/console error.
- Static scans: 19 committed source/config files and three built HTML/CSS/JS files contained no forbidden external resource reference or authored network API.
- Negative regressions: encoded path traversal returned HTTP 400 without exposing `package.json`; an HTTP 200 impostor occupying port 4174 forced a non-zero harness exit without Chrome or PASS output, and the port was reusable after cleanup.
- Checks passed: typecheck, unit tests, clean build, existing product browser smoke, two offline smoke runs, traversal and occupied-port negatives, `git diff --check`, authored-line count, and final Git status/show.
- BOOTSTRAP-003 limitations: evidence covers a production build served over loopback HTTP and persistence without refresh for 1,000 ms after shutdown. It does not verify `file://`, PWA/service-worker caching, refresh after shutdown, other browsers or machines, serial/hardware, gameplay, physics, accessibility, or prolonged performance.
- Status: ECO-101 remains **EN CURSO**; BOOTSTRAP-003 closes only the bounded offline/static boundary and does not consume ECO-002.
- BOOTSTRAP-004 result: a typed `src/application/` snapshot port feeds a pure, fail-closed `src/console/` mapper and DOM presenter. The initial product snapshot is unavailable with `FUENTE_VALIDADA_PENDIENTE`; confirmation is explicitly unavailable and no reference under `tools/` is imported.
- BOOTSTRAP-004 checks: typecheck PASS; Vitest 2 files/19 tests PASS; build PASS with the existing Phaser chunk warning; browser and offline smoke PASS; Node reference suite 165/165 PASS; forbidden scans and `git diff --check` PASS.
- BOOTSTRAP-004 limits: no transition engine, protocol parsing, score, science, serial, hardware, network, persistence, or product integration was added. ECO-101 remains **EN CURSO**; ECO-104 and ECO-002 are unchanged.

## Next step

Implement one approved product behavior without consuming ECO-002.
