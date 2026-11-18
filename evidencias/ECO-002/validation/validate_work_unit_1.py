#!/usr/bin/env python3
"""Validate the documentary structure and review slices for ECO-002 Work Unit 1."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
EVIDENCE = ROOT / "evidencias/ECO-002"
CHANGE = ROOT / "openspec/changes/eco-002"
DEFINITION_RE = re.compile(r"^\s*(?:-\s*)?id:\s*([A-Z][A-Z0-9-]+)\s*$")
REVISION_RE = re.compile(r"^\s*revision:\s*([1-9][0-9]*)\s*$")
REFERENCE_RE = re.compile(r"\{id:\s*([A-Z][A-Z0-9-]+),\s*revision:\s*([1-9][0-9]*)\}")
INLINE_DEFINITION_RE = re.compile(r"^\s*-\s*\{id:\s*([A-Z][A-Z0-9-]+),\s*revision:\s*([1-9][0-9]*),")
HASH_RE = re.compile(r"\{path:\s*([^,]+),\s*sha256:\s*([0-9a-f]{64})\}")


def fail(message: str) -> None:
    print(f"ERROR {message}", file=sys.stderr)
    raise SystemExit(1)


def text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def current_gate() -> tuple[str, Path]:
    match = re.search(r"^current_gate_evaluation_id:\s*(\S+)\s*$", text(EVIDENCE / "registry.yaml"), re.M)
    if not match:
        fail("registry has no current gate evaluation")
    gate_id = match.group(1)
    return gate_id, EVIDENCE / "gate-evaluations" / gate_id


def structural() -> None:
    gate_id, gate_dir = current_gate()
    calculation_notebooks = sorted((EVIDENCE / "working/calculations").glob("*.md"))
    canonical = [EVIDENCE / "registry.yaml", *sorted((EVIDENCE / "working").glob("*.yaml")), *calculation_notebooks]
    definitions: set[tuple[str, int]] = set()
    duplicate_definitions: set[tuple[str, int]] = set()
    for path in canonical:
        lines = text(path).splitlines()
        for index, line in enumerate(lines):
            inline = INLINE_DEFINITION_RE.match(line)
            if inline:
                key = (inline.group(1), int(inline.group(2)))
                duplicate_definitions.add(key) if key in definitions else definitions.add(key)
                continue
            found = DEFINITION_RE.match(line)
            if not found:
                continue
            revision = next((int(m.group(1)) for candidate in lines[index + 1:index + 5] if (m := REVISION_RE.match(candidate))), None)
            if revision is None:
                continue
            key = (found.group(1), revision)
            duplicate_definitions.add(key) if key in definitions else definitions.add(key)
    manifest_text = text(gate_dir / "manifest.yaml")
    references = {(item, int(revision)) for path in canonical for item, revision in REFERENCE_RE.findall(text(path))}
    references.update((item, int(revision)) for item, revision in REFERENCE_RE.findall(manifest_text))
    unresolved = references - definitions
    if duplicate_definitions or unresolved:
        fail(f"duplicate_definitions={len(duplicate_definitions)} unresolved={len(unresolved)}")
    checked = {f"{phase}.{task}" for phase, task in re.findall(r"^- \[x\] ([1-6])\.(\d+)", text(CHANGE / "tasks.md"), re.M)}
    required_checked = {
        *(f"1.{task}" for task in range(1, 10)),
        *(f"2.{task}" for task in range(1, 11)),
        *(f"3.{task}" for task in range(1, 6)),
        *(f"4.{task}" for task in range(1, 7)),
        *(f"5.{task}" for task in range(1, 5)),
        "6.1",
        "6.2",
        "6.11",
    }
    blocked_unchecked = {"4.7", *(f"5.{task}" for task in range(5, 11)), *(f"6.{task}" for task in range(3, 11))}
    if not required_checked <= checked or blocked_unchecked & checked:
        fail(f"checked={len(checked)} missing={sorted(required_checked - checked)} blocked_checked={sorted(blocked_unchecked & checked)}")
    registry = text(EVIDENCE / "registry.yaml")
    if "current_gate_result: blocked_with_traceability" not in registry:
        fail("registry does not preserve blocked_with_traceability")
    if (EVIDENCE / "baselines").exists() or list(EVIDENCE.rglob("snapshot")):
        fail("blocked gate has a baseline or snapshot")
    hash_entries = HASH_RE.findall(manifest_text)
    mismatches = []
    for raw_path, expected in hash_entries:
        path = ROOT / raw_path.strip()
        actual = hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else "missing"
        if actual != expected:
            mismatches.append(raw_path.strip())
    if mismatches:
        fail(f"gate_hash_mismatches={','.join(mismatches)}")
    print(f"STRUCTURE gate={gate_id} definitions={len(definitions)} references={len(references)} unresolved=0")
    print(f"TASKS completed={len(checked)} blocked_unchecked={len(blocked_unchecked)} scope=PASS")
    print(f"GATE hashes={len(hash_entries)} baseline=false snapshot=false result=blocked_with_traceability")
    print("STRUCTURAL_VALIDATION=PASS")


def untracked_text_paths() -> list[Path]:
    command = ["git", "ls-files", "--others", "--exclude-standard", "--", "evidencias/ECO-002/**", "openspec/changes/eco-002/**"]
    result = subprocess.run(command, cwd=ROOT, check=True, text=True, capture_output=True)
    paths = [ROOT / line for line in result.stdout.splitlines() if line]
    return [path for path in paths if b"\0" not in path.read_bytes()]


def whitespace() -> None:
    paths = untracked_text_paths()
    violations = []
    for path in paths:
        data = path.read_bytes()
        if not data.endswith(b"\n") or any(line.rstrip(b"\r\n").endswith((b" ", b"\t")) for line in data.splitlines(keepends=True)):
            violations.append(path.relative_to(ROOT).as_posix())
    digest = hashlib.sha256(b"\0".join(path.relative_to(ROOT).as_posix().encode() for path in paths)).hexdigest()
    if violations:
        fail(f"whitespace_violations={','.join(violations)}")
    print(f"WHITESPACE files={len(paths)} path_set_sha256={digest} violations=0")
    print("WHITESPACE_VALIDATION=PASS")


def slices() -> None:
    manifests = sorted(
        (EVIDENCE / "review-slices").glob("slice-*.json"),
        key=lambda path: int(path.name.split("-")[1]),
    )
    if not manifests:
        fail("slice_manifest_count=0")
    seen: set[str] = set()
    previous_id: str | None = None
    for order, manifest in enumerate(manifests, start=1):
        payload = json.loads(text(manifest))
        if payload["order"] != order or not payload["id"].endswith(f"S{order:02d}"):
            fail(f"slice_sequence={manifest.name}")
        if payload.get("chain_strategy") != "stacked-to-main":
            fail(f"slice_chain_strategy={payload['id']}")
        if payload.get("base") != "main" or payload.get("target") != "main":
            fail(f"slice_main_semantics={payload['id']}")
        if payload.get("depends_on") != previous_id:
            fail(f"slice_dependency={payload['id']}:expected={previous_id}")
        entries = payload.get("files", payload.get("review_units", []))
        if not entries:
            fail(f"slice_entries={payload['id']}")
        total = 0
        for entry in entries:
            path = entry["path"]
            if not (ROOT / path).is_file():
                fail(f"missing_slice_path={path}")
            seen.add(path)
            if not isinstance(entry.get("review_lines"), int) or entry["review_lines"] <= 0:
                fail(f"invalid_review_lines={payload['id']}:{path}")
            total += entry["review_lines"]
        if total != payload["total_review_lines"] or total > 400:
            fail(f"slice_budget={payload['id']}:declared={payload['total_review_lines']}:summed={total}")
        dependency = payload["depends_on"] or "none"
        print(f"SLICE {payload['id']} base=main target=main depends_on={dependency} units={len(entries)} review_lines={total} budget=400")
        previous_id = payload["id"]
    expected = {path.relative_to(ROOT).as_posix() for path in EVIDENCE.rglob("*") if path.is_file()}
    expected.update({"openspec/changes/eco-002/tasks.md", "openspec/changes/eco-002/apply-progress.md"})
    if seen != expected:
        fail(f"slice_coverage_missing={sorted(expected - seen)} extra={sorted(seen - expected)}")
    print(f"DECLARED_REVIEW_LINES manifests={len(manifests)} covered_paths={len(seen)}")
    print("STACKED_TO_MAIN_SEMANTICS=PASS")
    print(f"SLICE_COVERAGE files={len(seen)} missing_paths=0")
    print("SLICE_BUDGET_VALIDATION=PASS")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("check", choices=["structural", "whitespace", "slices"])
    arguments = parser.parse_args()
    {"structural": structural, "whitespace": whitespace, "slices": slices}[arguments.check]()
