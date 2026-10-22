# Apply progress: ECO-001

## Current boundary

- Delivery: `auto-chain`, `stacked-to-main`
- Completed slices: Work Unit 1 (G0–G5) and Work Unit 3 (G9 closure)
- Skipped boundary: Work Unit 2, G6–G8, remains blocked/not applicable until an authorized original source exists
- Mode: Standard; no executable application or test runner
- Run: `evidencias/ECO-001/20261021T031528Z/`

## Completed

- Tasks 1.1–1.6: root, dossier, versions, Git T0, executable-baseline classification, and hygiene gaps.
- Tasks 2.1–2.8: local RED safety fixtures and observed assertions.
- Tasks 3.1–3.7: 45-row manifest reconciliation, documented OpenCode inventory, page-backed PDF obligations, and complete gap ownership.
- Task 4.1: G5 resolved `blocked` with cause, dependency, responsible party, next action, and zero target writes.

## Pending and blocked

- Tasks 4.2–4.8 remain unchecked and blocked/not applicable by the absence of a team-provided or explicitly authorized original source; they were not executed or inferred complete.
- `.opencode/` remains absent and unchanged.
- `G-ACA-01` remains pending under ECO-005; no digital-format authorization is claimed.
- ADR-005 remains proposed and unratified; Node/stack compatibility is not verified.

## Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test | `python3 evidencias/ECO-001/20261021T031528Z/comandos/focused-validation.py`; exit 0; 16/16 checks passed. Exact command, executable harness, raw stdout and empty raw stderr are preserved under `comandos/focused-validation.*`; `comandos/fixture-validations.txt` is interpretation only. |
| Runtime harness | G0–G5 audit sequence from the exact authorized root; versions, Git, OpenCode, manifest, and PDF were observed without package installation or product runtime. OpenCode help/discovery evidence preserves each exact command, exit code, raw stdout and raw stderr in `comandos/opencode-*.{command,stdout,stderr}.txt`; interpretation remains separate in `opencode-help.txt` and `opencode-inventory.txt`. |
| Rollback boundary | Remove only `evidencias/ECO-001/20261021T031528Z/` and revert Work Unit 1 checkboxes/apply-progress. No `.opencode/` or closure-document edits exist. |

## Checks observed

- Manifest coverage: 45/45 rows, with three independent matching samples.
- OpenCode: 28 global agents, 20 global skills, and 13 global commands observed through locally documented mechanisms; 19 expected project resources absent.
- PDF: SHA-256 matched the manifest; 22 obligation rows carry page evidence.
- Recovery: `preflight: blocked`, `final_state: blocked`, zero target writes.
- G9: T1 captured; final report and self-excluding evidence index completed; the same `run_id` is cited by all three closure documents.
- Acceptance: `git diff --check` passed; focused validation passed 16/16; index hashes and references passed; scope-drift check passed.
- Review count correction: tracked files use `HEAD`; every in-scope untracked OpenSpec/evidence text file uses an empty baseline. Raw text evidence is included. Generated nested-fixture `.git/**` administration is the only observed policy exclusion and all 85 files are listed individually in preserved stdout. Totals: tracked closure 35; OpenSpec 931; evidence core 1,168; commands/raw outputs 15,615; text fixtures 28; grand total 17,777 changed lines across 76 included files.
- Threshold result: the complete candidate exceeds 400 lines; `auto-chain` with `stacked-to-main` is selected. Proposed boundaries are Work Unit 1 (G0–G5), conditional Work Unit 2 (G6–G8 only after an authorized source), and Work Unit 3 (G9 closure plus this 6.7 correction). No commit or PR is claimed to exist.

## Work Unit 3 Evidence

| Evidence | Value |
|---|---|
| Focused test | `python3 evidencias/ECO-001/20261021T031528Z/comandos/focused-validation.py`; exit 0; 16/16 checks passed. Structural index verification now reports 149 regular files verified; two symlink fixtures remain separately indexed as special entries. Exact commands and outputs are in `comandos/verification-final.txt`. |
| Runtime harness | G9 dossier review with `final_state: blocked`, T1, cross-document `run_id`, and no-scope-drift validation. Product runtime: N/A because no executable application or test runner exists. |
| Rollback boundary | Revert only Work Unit 3 edits in `informe.md`, `registro-evidencias.json`, `comandos/git-status-t1.txt`, `comandos/verification-final.txt`, the three approved closure documents, `tasks.md`, and this cumulative progress file. Preserve Work Unit 1 evidence and `.gitignore`. |

## Task 6.7 Correction Evidence

| Evidence | Value |
|---|---|
| Focused test | `python3 evidencias/ECO-001/20261021T031528Z/comandos/candidate-line-count.py --assert-recorded`; exit 0; 76 files covered, 17,777 changed lines, threshold 400 exceeded, and `stacked-to-main` selected. |
| Runtime harness | `python3 evidencias/ECO-001/20261021T031528Z/comandos/candidate-line-count.py` from the authorized repository root; exact command and raw stdout/stderr/exit code are preserved under `comandos/candidate-line-count.*`. This is the real Git review boundary; product runtime is N/A because no application exists. |
| Rollback boundary | Revert only `candidate-line-count.py` and its four receipts, the task 6.7 evidence changes in `tasks.md`, `informe.md`, `verification-final.txt`, this merged progress file, and the regenerated self-excluding index. Preserve all prior valid ECO-001 evidence and closure history. |

## Deviations

None from the authorized design. Work Unit 2 was correctly skipped after G5 resolved `blocked`; Work Unit 3 closed ECO-001 through the specification's allowed blocked branch.
