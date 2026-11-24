# ECO-302 Documentation Audit Helpers

## Objective

Make a narrow part of repository/documentation audit repeatable without implying
that academic content, scientific claims, or human acceptance have been reviewed.

## Constraints

- Use Node.js standard library only; do not install packages or access the network.
- Automated checks and review templates must not claim documentary, scientific,
  hardware, safety, UX, or human acceptance without recorded evidence.
- Keep the link auditor bounded to its documented Markdown syntax; do not imply
  full renderer or semantic validation.

## Stable tasks

- [x] **ECO302-1 — Add a repeatable local Markdown link audit**
  - Route: direct bounded tooling task.
  - Acceptance: `npm run check:docs-links` scans Markdown files, reports missing
    local targets with source path/line, ignores external links and code examples,
    and rejects path traversal outside the workspace.
  - Regression coverage: extraction, inline/reference destinations, encoded
    spaces, repository-root paths, fragments, external URLs, malformed encoding,
    missing files, lexical traversal, and symlinks resolving outside the root.
  - Commands: `npm run test:docs-links`; `npm run check:docs-links`;
    `git diff --check`.
  - Limitation: file existence only; no anchors, HTML links, semantic consistency,
    accessible rendering, or human/scientific review.

- [x] **ECO302-2 — Validate local Markdown heading fragments**
  - Route: direct bounded tooling extension.
  - Acceptance: local links to Markdown/MDX files validate same-file or
    cross-file fragments against supported ATX heading slugs (including repeated
    headings), quoted HTML `id`/`name` anchors, percent-encoded Unicode, and
    report a missing fragment with source file/line.
  - Regression coverage: duplicate heading suffix and slug collisions, punctuation/
    inline formatting, ignoring code examples, explicit HTML anchors, Unicode,
    same-file fragments, missing anchors, and external/non-Markdown target
    boundaries.
  - Commands: `npm run test:docs-links`; `npm run check:docs-links`;
    `git diff --check`.
  - Limitation: bounded slug rules for ATX headings and quoted HTML IDs/names;
    renderer/plugin-specific anchors, Setext headings, and non-Markdown anchors
    are not checked. Current repository contains no local fragment links, so the
    whole-repository run reports `anchors=0`.

- [x] **ECO302-3 — Prepare a human documentation-review packet**
  - Route: direct evidence-template task for the still-open parent review.
  - Acceptance: a `NOT_RUN` template fixes reviewer identity/competence, exact
    checkout and reviewed-file scope, document-review criteria, reproducible
    commands, findings, decision statuses and explicit exclusions.
  - Boundary: leave every human field unfilled; do not convert the template or
    existing automated checks into a review result.
  - Artifact: `evidencias/ECO-302/revision-documental-plantilla.md`.
  - Checks: Markdown link/anchor audit, structural/whitespace validators and
    `git diff --check`.

- [x] **ECO302-4 — Add one command for bounded host reference regressions**
  - Route: package-script convenience over existing independent Node test files.
  - Acceptance: one explicit-path command covers firmware-runner CLI tests,
    device-protocol/simulator fixtures, host-adapter snapshots, scorecard and
    playtest-package validation without adding dependencies.
  - Boundary: not a replacement for Vitest, browser/offline checks, physical
    firmware, hardware, scientific validation, or human review.
  - Artifact: `npm run test:host-references`.
  - Checks: run the new command; docs-link, structural/whitespace validators and
    `git diff --check`.
  - Result: PASS; 100 host reference tests, 0 failures.

## Observed verification — 2026-11-23

- `npm run test:docs-links`: 7/7 PASS after ECO302-2.
- `npm run check:docs-links`: `files=125 links=36 anchors=0 broken=0` after
  ECO302-3.
- The ECO302-3 artifact remains `NOT_RUN`; no human review or approval occurred.
- ECO302-4 consolidates only pre-existing host tests; they remain software
  regressions, not physical or scientific evidence.
- `git diff --check`: PASS.
- The check does not close ECO-302 or replace final manual/academic review.

## Rollback

Remove `tools/markdown-links.mjs`, `tools/markdown-links.test.mjs`, the two docs
scripts and `test:host-references`, this tracker,
`evidencias/ECO-302/revision-documental-plantilla.md`, and only ECO302-1–4
documentation entries.
