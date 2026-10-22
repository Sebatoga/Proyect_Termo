#!/usr/bin/env python3
"""Count the complete ECO-001 review candidate against Git baselines."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
RUN = Path("evidencias/ECO-001/20261021T031528Z")
SCOPE_ROOTS = (Path("openspec/changes/eco-001"), RUN)
TRACKED_CLOSURE = (
    Path("docs/00_DECISIONES_Y_RIESGOS.md"),
    Path("docs/04_BACKLOG_Y_FASES.md"),
    Path("docs/08_ESTADO_DEL_PROYECTO.md"),
)
RECORDED_STDOUT = RUN / "comandos/candidate-line-count.stdout.txt"
THRESHOLD = 400


def git(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=check,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )


def area_for(path: Path) -> str:
    value = path.as_posix()
    if value.startswith("docs/"):
        return "tracked_closure_docs"
    if value.startswith("openspec/"):
        return "openspec_change"
    if "/comandos/" in value:
        return "evidence_commands_and_raw_outputs"
    if "/fixtures/" in value:
        return "evidence_fixtures"
    return "evidence_core"


def line_count(data: bytes) -> int:
    return len(data.splitlines())


def candidate_baseline() -> str:
    introductions = git(
        "log", "--reverse", "--diff-filter=A", "--format=%H", "--", RUN.as_posix()
    ).stdout.splitlines()
    if not introductions:
        return "HEAD"
    parent = git("rev-parse", f"{introductions[0]}^", check=False)
    return parent.stdout.strip() if parent.returncode == 0 else "4b825dc642cb6eb9a060e54bf8d69288fbee4904"


def tracked_numstat(path: Path, baseline: str) -> tuple[int, int]:
    result = git("diff", "--numstat", baseline, "--", path.as_posix())
    rows = [row for row in result.stdout.splitlines() if row]
    if not rows:
        return (0, 0)
    if len(rows) != 1:
        raise AssertionError(f"unexpected numstat rows for {path}: {rows}")
    additions, deletions, reported = rows[0].split("\t", 2)
    if additions == "-" or deletions == "-":
        raise AssertionError(f"tracked binary is not permitted in closure scope: {path}")
    if reported != path.as_posix():
        raise AssertionError(f"unexpected numstat path for {path}: {reported}")
    return int(additions), int(deletions)


def collect() -> dict[str, object]:
    baseline = candidate_baseline()

    areas: dict[str, dict[str, int]] = defaultdict(
        lambda: {"files": 0, "additions": 0, "deletions": 0, "changed_lines": 0}
    )
    included: list[dict[str, object]] = []
    exclusions: list[dict[str, str]] = []

    for path in TRACKED_CLOSURE:
        additions, deletions = tracked_numstat(path, baseline)
        changed_lines = additions + deletions
        if not changed_lines:
            continue
        area = area_for(path)
        areas[area]["files"] += 1
        areas[area]["additions"] += additions
        areas[area]["deletions"] += deletions
        areas[area]["changed_lines"] += changed_lines
        included.append(
            {
                "path": path.as_posix(),
                "baseline": baseline,
                "additions": additions,
                "deletions": deletions,
                "changed_lines": changed_lines,
            }
        )

    for scope_root in SCOPE_ROOTS:
        absolute_scope = ROOT / scope_root
        if not absolute_scope.is_dir():
            continue
        for absolute_path in sorted(absolute_scope.rglob("*")):
            relative = absolute_path.relative_to(ROOT)
            scope_relative = absolute_path.relative_to(absolute_scope)
            if ".git" in scope_relative.parts:
                if absolute_path.is_file() or absolute_path.is_symlink():
                    exclusions.append(
                        {
                            "path": relative.as_posix(),
                            "reason": "generated nested-Git fixture administration; excluded by the documented generated-file policy",
                        }
                    )
                continue
            if absolute_path.is_dir() and not absolute_path.is_symlink():
                continue
            if absolute_path.is_symlink():
                data = os.readlink(absolute_path).encode("utf-8")
            elif absolute_path.is_file():
                data = absolute_path.read_bytes()
                if b"\0" in data:
                    exclusions.append(
                        {
                            "path": relative.as_posix(),
                            "reason": "binary file detected by NUL byte; excluded by the documented binary-file policy",
                        }
                    )
                    continue
            else:
                exclusions.append(
                    {
                        "path": relative.as_posix(),
                        "reason": "special non-file entry; no text-line baseline",
                    }
                )
                continue
            additions = line_count(data)
            area = area_for(relative)
            areas[area]["files"] += 1
            areas[area]["additions"] += additions
            areas[area]["changed_lines"] += additions
            included.append(
                {
                    "path": relative.as_posix(),
                    "baseline": "empty",
                    "additions": additions,
                    "deletions": 0,
                    "changed_lines": additions,
                }
            )

    task_path = ROOT / "openspec/changes/eco-001/tasks.md"
    if task_path.is_file():
        task_text = task_path.read_text(encoding="utf-8")
        if "Chain strategy: stacked-to-main" not in task_text:
            raise AssertionError("tasks.md does not record Chain strategy: stacked-to-main")

    sorted_areas = dict(sorted(areas.items()))
    grand_total = sum(values["changed_lines"] for values in sorted_areas.values())
    threshold_exceeded = grand_total > THRESHOLD
    if not threshold_exceeded:
        raise AssertionError(
            f"expected the complete candidate to exceed {THRESHOLD} lines, observed {grand_total}"
        )

    return {
        "schema": "ecogrid.eco-001.candidate-line-count/v1",
        "baseline": {
            "tracked_closure": baseline,
            "candidate_roots": "empty",
            "head": git("rev-parse", "HEAD").stdout.strip(),
        },
        "scope": {
            "tracked_closure": [path.as_posix() for path in TRACKED_CLOSURE],
            "untracked_roots": [path.as_posix() for path in SCOPE_ROOTS],
            "preserved_out_of_scope": [".gitignore"],
        },
        "areas": sorted_areas,
        "candidate_files": len(included),
        "excluded_files": len(exclusions),
        "exclusions": exclusions,
        "grand_total_additions_plus_deletions": grand_total,
        "threshold": THRESHOLD,
        "threshold_exceeded": threshold_exceeded,
        "delivery_strategy": "auto-chain",
        "chain_strategy": "stacked-to-main",
        "assertions": {
            "complete_candidate_coverage": True,
            "tracked_closure_against_pre_eco_001": True,
            "candidate_roots_against_empty": True,
            "raw_text_evidence_included": True,
            "threshold_evaluated": True,
        },
    }


def main() -> int:
    observed = collect()
    serialized = json.dumps(observed, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    if sys.argv[1:] == ["--record"]:
        (ROOT / RECORDED_STDOUT).write_text(f"{serialized}\n", encoding="utf-8")
        (ROOT / RUN / "comandos/candidate-line-count.stderr.txt").write_text("", encoding="utf-8")
        (ROOT / RUN / "comandos/candidate-line-count.exit-code.txt").write_text("0\n", encoding="utf-8")
        print(serialized)
        return 0
    if sys.argv[1:] == ["--assert-recorded"]:
        recorded = json.loads((ROOT / RECORDED_STDOUT).read_text(encoding="utf-8"))
        if observed != recorded:
            raise AssertionError("recorded candidate-line-count stdout does not match current candidate")
        print(
            "task 6.7 assertions passed: "
            f"{observed['candidate_files']} files covered; "
            f"{observed['grand_total_additions_plus_deletions']} changed lines; "
            f"threshold {observed['threshold']} exceeded; stacked-to-main selected"
        )
        return 0
    if sys.argv[1:]:
        raise SystemExit("usage: candidate-line-count.py [--record|--assert-recorded]")
    print(serialized)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
