# ECO-101 Runtime Compatibility Smoke Spike

## Objective

Create and verify a disposable runtime spike for the proposed TypeScript, Vite, Vitest, and Phaser stack without consuming ECO-002 scientific models or claiming that ADR-005 is ratified.

## Problem and rationale

The repository has no executable application, package manifest, runtime, or test scripts. ECO-002 remains scientifically blocked, but a reversible stack smoke test can establish whether the proposed tooling works in this environment before production bootstrap.

## Authorized scope

- Create only `spikes/runtime-smoke/` and the minimum project-status documentation required by repository policy.
- Download packages from `registry.npmjs.org` without credentials, as explicitly authorized by the user.
- Keep ECO-002 `BLOQUEADA`, ECO-003 `PENDIENTE`, and ECO-101 `PENDIENTE`.
- Do not implement physics, control, storage, environmental scoring, gameplay, or production architecture.
- Do not push, open a pull request, merge, or publish artifacts.

## Constraints

- Branch: `feat/eco-101-runtime-smoke`.
- TDD mode: disabled; source is the existing project testing-capability record (`strict_tdd: false`). Ordinary functional checks remain mandatory.
- Delivery strategy: `ask-on-risk`; forecast is below 400 authored changed lines.
- ECO-002 has no accepted baseline or snapshot and must not be represented as approved.
- Runtime smoke output is compatibility evidence only; it does not ratify ADR-005 or complete ECO-101.

## Tasks

- [x] **RUNTIME-001 — Build and verify the isolated stack smoke spike**
  - Route: delegated direct.
  - Trigger evidence: implementation requires multiple non-trivial configuration, source, test, and documentation files.
  - Create the minimum isolated Vite/TypeScript/Phaser runtime and Vitest smoke test.
  - Install dependencies only from the explicitly authorized public npm registry.
  - Run typecheck, tests, build, and a bounded development-server smoke check.
  - Update project state, backlog, risks/decisions, and AI process log without changing scientific gate status.
  - Close with one Conventional Commit containing implementation, tests, evidence, and documentation.
- [x] **RUNTIME-002 — Verify browser canvas behavior**
  - Route: delegated direct for reproducible evidence capture and multi-file documentation; parent verification remained inline.
  - Trigger evidence: the browser harness, preserved screenshot/DOM/report, project status, AI log, and tracker span multiple non-trivial files.
  - Start the local Vite server, load the page in an installed headless browser, and confirm canvas creation without console/runtime errors.
  - Preserve exact observed evidence, update the runtime limitation honestly, and close with a Conventional Commit.
- [x] **RUNTIME-003 — Enforce browser-smoke port ownership**
  - Route: delegated direct.
  - Trigger evidence: the correction spans executable harness behavior, an occupied-port regression check, evidence documentation, project state, and the recovery tracker.
  - Configure Vite to fail when port 5173 is occupied and make the harness reject any response not owned by its spawned server.
  - Verify both the normal PASS path and the occupied-port failure path without leaving background processes.
  - Resolve informational review finding `R3-port-ownership` in a new work-unit commit.

## Acceptance criteria

- `spikes/runtime-smoke/` configures a minimal Phaser scene with no scientific-domain behavior; visual rendering remains separately verifiable.
- A deterministic smoke test passes under Vitest.
- `npm run typecheck`, `npm run test`, and `npm run build` report observed successful results.
- A bounded local server check confirms that Vite serves the spike; any browser/canvas limitation is reported honestly.
- Documentation states that the spike is disposable, does not consume ECO-002, does not ratify ADR-005, and does not complete ECO-101.
- No unrelated worktree files are staged or committed.

## Progress and evidence

- Status: RUNTIME-001 and RUNTIME-002 completed on 2026-10-22; RUNTIME-003 completed on 2026-10-23; ECO-101 remains pending.
- Prerequisite evidence commit: `a6f6a04` (`docs(eco-002): record blocked scientific gate`); independent verification passed, while native review was unavailable because `lens_context_budget_exceeded`.
- Work-unit commit: `5a22727` (`chore(spike): verify proposed web runtime`).
- Browser verification commit: `1b23407` (`test(spike): verify browser canvas`).
- Verification: `npm run typecheck` passed; `npm run test` passed with 1 file and 1 test; `npm run build` passed with a non-blocking 1,196.09 kB chunk warning; the bounded Vite server returned HTTP 200 and was terminated; parent spot-check reran `npm run test` successfully; `git diff --check a6f6a04..5a22727` passed.
- Versions: Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2`, and Vitest `5.0.5`.
- RUNTIME-002 command: `node evidencias/ECO-101/runtime-smoke/browser-smoke.mjs` from the repository root; the harness starts `npm run dev -- --host 127.0.0.1`, waits for Vite, monitors JavaScript console/runtime errors through CDP, runs Chrome headless with an 800 × 450 window and `--virtual-time-budget=5000`, dumps the DOM, captures the PNG, and always terminates the server.
- RUNTIME-002 result: `VITE_READY=true`; `CHROME_VERSION=Google Chrome 156.0.8078.47`; `BROWSER_SMOKE=PASS canvas=true screenshot_bytes=9967 console_runtime_errors=0`.
- RUNTIME-002 evidence: `evidencias/ECO-101/runtime-smoke/browser-smoke.png`, preserved DOM, reproducible harness, and `report.md`. Visual inspection observed a dark teal canvas with centered white `Phaser + Vite + TypeScript compatibility spike` text.
- Verification rerun: `npm run typecheck` passed without diagnostics; `npm run test` passed with 1 file and 1 test; `npm run build` passed in 443 ms with the existing non-blocking 1,196.09 kB chunk warning.
- Runtime limit: canvas creation and one rendered frame are verified only in Chrome headless in this environment. Firefox, interaction, compatibility across environments, performance, accessibility, and gameplay remain unverified. The missing `favicon.ico` produced a network 404 but no JavaScript console/runtime error.
- Native review: medium-risk reliability review approved and acknowledged for target `sha256:0c07b6cb7827c1cd10321638f8d4e2b44ce78b147f4e2ff5a6c4582c7bc6d6b4`; authority burned. Informational warning `R3-bootstrap-unproved` records that the automated test covers descriptor metadata rather than browser/Phaser bootstrap behavior.
- RUNTIME-002 native review: approved and acknowledged for target `sha256:e090c64bbebc38b3b14d6e0ede76572e92402e5d350e4eba61527fdc5d71994c`; authority burned. Informational warning `R3-port-ownership` notes that the harness does not use Vite strict-port mode, so a pre-existing service on port 5173 could cause a false pass; resolve this before promoting the harness beyond spike evidence.
- RUNTIME-003 normal evidence: `node evidencias/ECO-101/runtime-smoke/browser-smoke.mjs` reported `VITE_READY=true` and `BROWSER_SMOKE=PASS canvas=true screenshot_bytes=9967 console_runtime_errors=0`; Vite ran with explicit host, port and `--strictPort`, and ownership required child readiness, HTTP 200 and the spike marker while the child remained alive.
- RUNTIME-003 occupied-port evidence: `node --test evidencias/ECO-101/runtime-smoke/browser-smoke-port-occupied.test.mjs` passed 1 test; its deceptive HTTP 200 blocker forced the harness to end non-zero without `BROWSER_SMOKE=PASS` or Chrome startup, then confirmed port reuse. DOM and PNG hashes remained unchanged.
- `R3-port-ownership`: resolved by RUNTIME-003. No commit hash is recorded inside the same work-unit commit.
- Rollback boundary: revert only the RUNTIME-003 harness and documentation edits and remove `browser-smoke-port-occupied.test.mjs`; the spike code, dependencies, RUNTIME-001 and RUNTIME-002 remain intact.

## Next step

Decide whether to ratify ADR-005 before converting the spike into the production ECO-101 bootstrap. ADR-005 remains proposed and unratified; ECO-002 remains **BLOQUEADA**, while ECO-003 and ECO-101 remain **PENDIENTE**.
