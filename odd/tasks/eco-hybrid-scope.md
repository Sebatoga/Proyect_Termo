# EcoGrid Hybrid Product Scope

## Objective

Correct EcoGrid's product contract to the official Liga 4 requirement: a physical board game with integrated electronics where measured real-world variables and physical player controls change gameplay outcomes. Rebaseline the project as a four-week hybrid MVP without rewriting historical evidence.

## Problem and rationale

The current documentation still treats a fully digital videogame as the target and the hybrid format as a fallback. The official category-specific requirement is stricter than the general format allowance, and the user has explicitly adopted the hybrid interpretation. Continuing with the old contract would create a polished but non-compliant product.

## Authorized scope

- Supersede the pure-digital target with a hybrid tabletop product contract.
- Preserve ADR-004, ECO-002, ECO-101 spike evidence, and AI logs as historical records.
- Define a minimal physical board, electronics boundary, real light and temperature inputs, physical controls, local digital console, scientific models, safety, validation, and four-week delivery plan.
- Update project documentation only; do not purchase hardware, choose unavailable components, implement firmware/application code, create remote PRs, or claim that hardware exists.
- Keep ECO-002 scientifically blocked until its separate evidence requirements are resolved.

## Constraints

- Parent branch: `feat/eco-101-runtime-smoke` at `f61dea5`.
- Chain strategy: `feature-branch-chain`, selected by the user.
- Delivery strategy: `ask-on-risk`; planned as two cohesive documentation work units below the 400 authored-line review budget where possible.
- Technical artifacts remain professionally written in the repository's Spanish documentation language.
- The board and electronics must affect decisions and outcomes; decorative hardware does not satisfy the contract.
- TDD mode is not applicable to documentation, but structural links, terminology, scope consistency, whitespace, and Git boundaries must be verified.

## Chain

```text
feat/eco-hybrid-scope                         tracker
  └── docs/eco-hybrid-product-contract       HYBRID-001
       └── docs/eco-hybrid-delivery-plan      HYBRID-002
```

No PR, push, merge, or publication is authorized by this tracker.

## Tasks

- [x] **HYBRID-001 — Adopt the hybrid product contract**
  - Route: delegated direct.
  - Trigger evidence: coordinated corrections span repository policy, decisions, GDD, scientific framing, architecture, acceptance criteria, and requirements traceability.
  - Supersede the pure-digital direction without deleting historical decisions.
  - Define the hybrid gameplay loop, physical board, electronics, real variables, controls, hardware/software boundaries, safety constraints, and active scientific models.
  - Commit the coherent contract with tests/checks and rollback evidence.

- [ ] **HYBRID-002 — Rebaseline the four-week delivery plan**
  - Route: delegated direct.
  - Trigger evidence: backlog, project status, testing, deliverables, research, process, visual direction, missions, and AI logs must align with the new contract.
  - Define four weekly gates, revised ECO tasks, evidence, validation, procurement decisions, and excluded scope.
  - Commit the coherent delivery plan with checks and rollback evidence.

## Acceptance criteria

- Official Liga 4 hybrid wording is represented consistently and traceably.
- The product is a board game with functional electronics and real measured variables, not a videogame with decorative accessories.
- The four-week MVP includes PV thermal behavior, run-of-river hydro/fluid behavior, battery/bus control, and ecological-flow consequences while deferring wind and complex digital presentation.
- The physical board, controls, sensors, firmware, serial protocol, pure TypeScript domain, local console, feedback, and failure modes have explicit boundaries.
- No exact component model, budget, team member, procurement status, or hardware completion is invented.
- Historical digital spike evidence remains intact and is reclassified as console feasibility evidence.
- Every changed document agrees on scope, statuses, terminology, and next gate.
- Each work unit has a Conventional Commit and records observed verification.

## Progress and evidence

- Status: HYBRID-001 verificada; HYBRID-002 permanece pendiente.
- Decision: hybrid board game plus electronics adopted by the user on 2026-10-23.
- Human decisions still required: available components, budget, team roles, fabrication access, board dimensions/materials, and confirmed academic dates.
- HYBRID-001 commit: `4d3a896` (`docs(scope): adopt Liga 4 hybrid game requirements`).
- HYBRID-002 commit: pending.
- HYBRID-001 verification: `git diff --check`, Markdown path/link validation, active-scope search, required-terminology search, and authored-line inspection passed; 332 authored changed lines. Native assessment classified the candidate as medium risk with `review_due_reason: under_budget`, so no review transaction was due.

## Next step

Create `docs/eco-hybrid-delivery-plan` from this branch and execute HYBRID-002 without rewriting HYBRID-001 history.
