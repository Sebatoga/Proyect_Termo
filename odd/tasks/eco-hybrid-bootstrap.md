# EcoGrid Hybrid Bootstrap

## Objective

Create the first operational artifacts for the reformed hybrid project: a public how-to-play manual, a hardware planning/assembly manual, and a dependency-free device-protocol simulator that can drive future host integration before physical components are selected.

## Authorized scope

- Document provisional gameplay without inventing final scientific values, thresholds, component availability, or completed hardware.
- Document hardware by function, compatibility gates, assembly stages, calibration, safety, and test evidence; exact models remain pending G1 inventory.
- Implement a local protocol simulator with Node.js standard-library tools only; no package installation or external network access.
- Preserve ECO-002 as blocked, ECO-101 as console feasibility evidence, and the board game as the primary product.
- Do not purchase components, freeze pin numbers, claim calibration, implement scientific models, merge, push, open PRs, or publish artifacts.

## Constraints

- Parent chain branch: `docs/eco-hybrid-delivery-plan` at `ba9d689`.
- Chain strategy: `feature-branch-chain`, inherited from the user-selected hybrid-project strategy.
- TDD mode: disabled by project setting; ordinary behavior-first Node tests remain mandatory for executable simulator work.
- Documentation language: professional Spanish. Code identifiers and protocol fields: English.
- Each work unit targets no more than 400 authored changed lines without code-golf or omitted evidence.

## Chain

```text
feat/eco-hybrid-bootstrap                     tracker
  └── docs/eco-manual-como-jugar             BOOT-001
       └── docs/eco-manual-hardware           BOOT-002
            └── feat/eco-device-simulator     BOOT-003
```

## Tasks

- [x] **BOOT-001 — Create the provisional how-to-play manual**
  - Route: delegated direct.
  - Trigger evidence: the manual consolidates rules, six-round flow, physical decisions, sensor behavior, failure handling, victory, anti-trivial scoring, example, and quick reference.
  - Create `docs/17_COMO_JUGAR.md` and align only the minimum affected index/reference views.
  - Keep unresolved thresholds and scientific values visibly provisional.
  - Completion evidence: public manual, source-plan link, focused Markdown/link
    checks, required-term scan, prohibited-claim scan, and authored-line budget;
    work-unit commit `docs(game): add provisional how-to-play manual`.

- [x] **BOOT-002 — Create the hardware manual**
  - Route: delegated direct.
  - Trigger evidence: BOM classes, compatibility gates, conceptual pinout, serial protocol, calibration, staged assembly, safety, diagnostics, purchase checklist, and HIL evidence form a separate review unit.
  - Create `docs/18_MANUAL_HARDWARE.md` without selecting unavailable models or claiming tests.
  - Completion evidence: provisional manual, plan/manual links, focused Markdown/link checks, required-term scan, prohibited-claim scan, and authored-line budget; work-unit commit `docs(hardware): add provisional hardware manual`.

- [x] **BOOT-003 — Start the hardware-independent protocol simulator**
  - Route: delegated direct.
  - Trigger evidence: executable protocol framing, fixtures, simulator behavior, failure paths, tests, and operator documentation span multiple non-trivial files.
  - Implement newline-delimited JSON protocol fixtures and a deterministic Node.js simulator using only the standard library.
  - Cover valid input, malformed JSON, unsupported version, invalid status/enum, sequence progression, and explicit disconnection/error behavior.

## Acceptance criteria

- A non-technical group can set up and follow a provisional six-round game without reading equations.
- The hardware manual tells the team what functions and compatibility evidence are needed before purchasing, while keeping exact components pending.
- The simulator emits deterministic versioned messages and rejects malformed or unsupported input with tested stable errors.
- No manual presents provisional values as accepted science or planned hardware as existing evidence.
- Every work unit has a Conventional Commit, observed verification, rollback boundary, and recoverable tracker entry.

## Progress and evidence

- Status: completed.
- BOOT-001 commit: `d3f78fd` (`docs(game): add provisional how-to-play manual`).
- BOOT-001 verification: Markdown paths/links, required sections/terms, prohibited-claim scan, and `git diff --check` passed; 349 authored changed lines. Native assessment classified the candidate as passive with `review_due_reason: passive`.
- BOOT-002 commit: `74f596c` (`docs(hardware): add provisional hardware manual`).
- BOOT-002 verification: Markdown paths/links, required coverage, prohibited-claim scan, and `git diff --check` passed; 339 authored changed lines. Native assessment classified the candidate as passive with `review_due_reason: passive`; no physical or npm tests were claimed.
- BOOT-003 work-unit commit: `f189e43` (`feat(protocol): add deterministic device simulator`).
- BOOT-003 verification: 8/8 Node tests passed; generated scenarios matched their versioned fixtures; nominal output matched byte-for-byte across two executions; disconnected inputs were explicit `null`; stdin returned stable malformed/version codes; `git diff --check` passed.
- BOOT-003 rollback: remove `tools/device-simulator/` and its links from the three authorized overview/manual documents; no product or scientific path imports it.
- Human G1 inputs remain pending: inventory, exact models, budget, roles, dates, fabrication access, and board dimensions/materials.

## Next step

Obtain the human G1 evidence listed above before selecting hardware or starting ECO-108 bank work. ECO-002 remains blocked in parallel.
