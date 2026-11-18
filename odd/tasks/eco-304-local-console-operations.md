# ECO-304 Strict Local Console Operations

## Objective

Provide one strict, reproducible operator path to preflight and serve the built
secondary console over loopback without depending on hardware or Internet.

## Authorized scope

- Add a dependency-free server that serves only `dist/` on a fixed documented
  loopback address/port and exposes a bounded local health response.
- Fail before readiness when the build is missing, stale/incomplete, references
  external runtime assets or the requested port is occupied.
- Document build, launch, health, shutdown and collision recovery.

## Constraints

- The user authorized autonomous progress independent of hardware specifications.
- Do not add packages, public-network binding, dynamic port fallback, PWA,
  service worker, `file://`, remote access or Internet claims.
- Do not claim target-computer verification, stand rehearsal, ECO-304 completion,
  gameplay, hardware, serial, science or accessibility approval.
- Preserve traversal rejection, content types, strict port ownership, process
  cleanup and existing offline/browser evidence.
- TDD mode: disabled by current project setting; focused behavior tests remain
  mandatory.
- Delivery strategy: `ask-on-risk`; one cohesive work unit forecast at 300–390
  authored lines with hard stop before commit above 400.

## Stable tasks

- [x] **ECO304-1 — Provide a strict offline console launch and health workflow**
  - Route: `delegated`; trigger evidence: server lifecycle, security boundary,
    focused tests, package script and task evidence span multiple files.
  - Acceptance: explicit build → preflight → fixed loopback launch → health →
    shutdown succeeds; root and referenced local assets resolve; shutdown releases
    the port.
  - Failures: missing/incomplete/external-reference build and occupied port exit
    non-zero without a ready/healthy marker or silent alternate port.
  - Security: serve only canonical files under `dist/`; reject traversal and use
    explicit content types. No directory listing or arbitrary filesystem access.
  - Verification: focused server tests, build, browser smoke, typecheck, Vitest,
    Node references, whitespace and line budget.
  - Runtime boundary: local loopback operation on this development machine only.
  - Rollback: remove the server/tests/script and ECO304-1 task evidence.

- [x] **ECO304-2 — Reuse the operator server in offline evidence**
  - Route: `delegated`; starts only after ECO304-1 is committed and verified.
  - Acceptance: offline smoke and its negative regressions exercise the exact
    exported server/preflight path used by operators while preserving request
    inventory, traversal/port failures and post-shutdown observation.
  - Traceability: add the README operator walkthrough, update minimum project
    views and keep ECO-304 pending until a human target-computer rehearsal.
  - Delivery: separate work unit below 400 authored lines with independent rollback
    to the prior private smoke implementation.

## Progress and evidence

- Branch: `feat/eco-304-local-console-operations` from `65a4184`.
- Engram mirror topic: `odd/eco-304-local-console-operations/tasks`.
- Work-unit commit: `7e8dc7e feat(ops): add strict local console server`.
- ECO304-2 work-unit commit: `d73406a test(ops): reuse local server in offline smoke`.
- Human operator walkthrough remains pending and is required before claiming stand
  readiness or ECO-304 completion.
- Implementation: `tools/local-console-server.mjs` is used by `serve:offline`.
  It snapshots bounded regular files, validates direct and nested local runtime
  dependencies, rejects symlinks/external references, and exposes path-free
  `ecogrid-health/v1` JSON. ECO304-2 integration is recorded below separately.
- Runtime limits: `127.0.0.1:4174` by default; explicit `::1`/alternate port only;
  1,000,000-byte index, 128 direct runtime references, 256 snapshotted files,
  32,000,000 bytes per file and 64,000,000 bytes total; fixed MIME allowlist; no
  fallback port, listing, public bind or arbitrary file access.

### Observed verification — 2026-11-14

- `node --test tools/local-console-server.test.mjs`: 19/19 PASS in 274.977 ms.
- CLI launch/health/SIGTERM: READY after listen; build
  `e1de6050e66c0fe2e229eed88ca4de10f073b68678f64bd72fbd184d1e041cc9`;
  health identity observed; `PORT_RELEASED=4174`.
- `npm run build`: PASS, 20 modules in 399 ms; known >500 kB chunk warning.
- `npm run test:browser-smoke`: PASS, Chrome `156.0.8078.47`, screenshot 62,611
  bytes and 0 bounded JavaScript errors.
- `npm run typecheck`: PASS with no diagnostics; `npm test`: 67/67 PASS.
- Combined established/focused Node regression command: 195/195 PASS in 599.397 ms.
- `git diff --check`: PASS; offline production smoke: PASS with 8 local requests,
  0 JavaScript errors and post-shutdown observation.
- Implementation work unit: 372 authored lines; task traceability is committed
  separately so each commit remains under the 400-line hard stop.
- Scope limit: development machine only; no target-machine/stand rehearsal,
  refresh-after-shutdown, TLS, auth, PWA, hardware, gameplay, science or accessibility claim.
- Rollback: remove both server files, `serve:offline` and ECO304-1 task evidence;
  README/operator integration remains owned by ECO304-2.

### ECO304-2 observed verification — 2026-11-14

- `node --test evidencias/ECO-101/offline-static-smoke/offline-smoke-negative.test.mjs`:
  2/2 PASS in 752.322387 ms; traversal used the shared server, and the fixed-port
  collision exited non-zero without PASS/Chrome, exposed `EADDRINUSE`, and rebound.
- `npm run test:offline-smoke`: PASS with Chrome `156.0.8078.47`, 8 local
  requests, canvas 960 × 540, 0 JavaScript errors, 1,000 ms post-shutdown
  observation and static scan 41+3.
- `git diff --check`: PASS with no output.
- Authored worktree diff: `217` additions + deletions against `HEAD`
  (`e0ff990`), excluding `.codegraph/`; this excludes committed ECO304-1.
- Implementation commit: `d73406a test(ops): reuse local server in offline smoke`.
- Review guard: the 400-authored-line hard stop remains in force.
- RDD assessment for `e0ff990..b497638`: medium, `under_budget`; no new review
  started, so `e0ff990` remains the last reviewed boundary for the pending slice.
- Rollback: restore the private smoke server/tests and remove only the ECO304-2
  operator/documentation integration; the committed ECO304-1 server remains.

## Next step

Run the human target-computer walkthrough and stand rehearsal. ECO-304 stays
pending until that evidence exists.
