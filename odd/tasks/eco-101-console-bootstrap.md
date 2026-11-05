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
