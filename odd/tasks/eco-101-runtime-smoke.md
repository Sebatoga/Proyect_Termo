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

## Acceptance criteria

- `spikes/runtime-smoke/` configures a minimal Phaser scene with no scientific-domain behavior; visual rendering remains separately verifiable.
- A deterministic smoke test passes under Vitest.
- `npm run typecheck`, `npm run test`, and `npm run build` report observed successful results.
- A bounded local server check confirms that Vite serves the spike; any browser/canvas limitation is reported honestly.
- Documentation states that the spike is disposable, does not consume ECO-002, does not ratify ADR-005, and does not complete ECO-101.
- No unrelated worktree files are staged or committed.

## Progress and evidence

- Status: completed on 2026-10-22.
- Prerequisite evidence commit: `a6f6a04` (`docs(eco-002): record blocked scientific gate`); independent verification passed, while native review was unavailable because `lens_context_budget_exceeded`.
- Work-unit commit: `5a22727` (`chore(spike): verify proposed web runtime`).
- Verification: `npm run typecheck` passed; `npm run test` passed with 1 file and 1 test; `npm run build` passed with a non-blocking 1,196.09 kB chunk warning; the bounded Vite server returned HTTP 200 and was terminated; parent spot-check reran `npm run test` successfully; `git diff --check a6f6a04..5a22727` passed.
- Versions: Phaser `3.90.0`, Vite `8.3.5`, TypeScript `7.0.2`, and Vitest `5.0.5`.
- Runtime limit: visual canvas rendering remains **NOT VERIFIED** because no browser automation is configured.
- Native review: medium-risk reliability review approved and acknowledged for target `sha256:0c07b6cb7827c1cd10321638f8d4e2b44ce78b147f4e2ff5a6c4582c7bc6d6b4`; authority burned. Informational warning `R3-bootstrap-unproved` records that the automated test covers descriptor metadata rather than browser/Phaser bootstrap behavior.
- Rollback boundary: remove `spikes/runtime-smoke/`; no production or scientific path imports it.

## Next step

Decide whether to perform the manual browser/canvas check and ratify ADR-005 before converting the spike into the production ECO-101 bootstrap.
