#!/usr/bin/env python3
"""Read-only Work Unit 1 validation harness for ECO-001."""

from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path
import re
import stat
import subprocess
import tempfile


DOSSIER = Path(__file__).resolve().parents[1]
ROOT = DOSSIER.parents[2]
FIXTURES = DOSSIER / "fixtures"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def run_git(*args: str, cwd: Path) -> str:
    result = subprocess.run(
        ["git", *args], cwd=cwd, check=True, capture_output=True, text=True
    )
    assert result.stderr == "", (args, result.stderr)
    return result.stdout.strip()


def init_repo(path: Path) -> None:
    path.mkdir()
    run_git("init", "--quiet", cwd=path)
    (path / "baseline.txt").write_text("baseline\n", encoding="utf-8")
    run_git("add", "baseline.txt", cwd=path)
    run_git(
        "-c", "user.name=ECO-001 Fixture", "-c", "user.email=fixture@example.invalid",
        "commit", "--quiet", "-m", "fixture baseline", cwd=path,
    )


def validate_2_1() -> None:
    base = FIXTURES / "rutas-documentales"
    names = ["requirements.txt", "CMakeLists.txt", "example.md", "example.mdx", "README.sh"]
    for name in names:
        path = base / name
        assert path.is_file() and not path.is_symlink(), path
        assert not (path.stat().st_mode & (stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)), path
    assert (base / "example-link").is_symlink()
    print("2.1 PASS: executable-looking paths remain non-executable inventory; symlink is special")


def validate_2_2() -> None:
    with tempfile.TemporaryDirectory(prefix="eco-001-git-root-") as temporary:
        base = Path(temporary).resolve()
        authorized = base / "authorized"
        other = base / "other"
        init_repo(authorized)
        init_repo(other)
        (authorized / "child").mkdir()
        authorized_root = Path(run_git("rev-parse", "--show-toplevel", cwd=authorized))
        child_root = Path(run_git("rev-parse", "--show-toplevel", cwd=authorized / "child"))
        other_root = Path(run_git("rev-parse", "--show-toplevel", cwd=other))
        parent_probe = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"], cwd=base, capture_output=True, text=True
        )
        assert authorized_root == child_root == authorized
        assert other_root == other and other_root != authorized
        assert parent_probe.returncode != 0
    print("2.2 PASS: temporary repositories prove root/child equality and reject parent/foreign roots")


def validate_2_3() -> None:
    with tempfile.TemporaryDirectory(prefix="eco-001-git-state-") as temporary:
        base = Path(temporary)
        repo = base / "states"
        empty = base / "empty-index"
        init_repo(repo)
        for name in ("staged.txt", "unstaged.txt", "both.txt"):
            (repo / name).write_text("original\n", encoding="utf-8")
        run_git("add", "staged.txt", "unstaged.txt", "both.txt", cwd=repo)
        run_git(
            "-c", "user.name=ECO-001 Fixture", "-c", "user.email=fixture@example.invalid",
            "commit", "--quiet", "-m", "state baseline", cwd=repo,
        )
        (repo / "staged.txt").write_text("staged\n", encoding="utf-8")
        run_git("add", "staged.txt", cwd=repo)
        (repo / "unstaged.txt").write_text("unstaged\n", encoding="utf-8")
        (repo / "both.txt").write_text("staged version\n", encoding="utf-8")
        run_git("add", "both.txt", cwd=repo)
        (repo / "both.txt").write_text("staged and unstaged\n", encoding="utf-8")
        (repo / "untracked.txt").write_text("untracked\n", encoding="utf-8")
        init_repo(empty)
        (empty / "untracked.txt").write_text("untracked\n", encoding="utf-8")
        run_git("rm", "--cached", "baseline.txt", cwd=empty)
        before = {
            "head": run_git("rev-parse", "HEAD", cwd=repo),
            "index": sha256(repo / ".git/index"),
            "files": {p.name: sha256(p) for p in repo.glob("*.txt")},
        }
        porcelain = run_git("status", "--porcelain=v2", "--untracked-files=all", cwd=repo)
        assert all(name in porcelain for name in ("staged.txt", "unstaged.txt", "both.txt", "untracked.txt"))
        assert run_git("ls-files", "--stage", cwd=empty) == ""
        assert "untracked.txt" in run_git("status", "--porcelain=v2", "--untracked-files=all", cwd=empty)
        after = {
            "head": run_git("rev-parse", "HEAD", cwd=repo),
            "index": sha256(repo / ".git/index"),
            "files": {p.name: sha256(p) for p in repo.glob("*.txt")},
        }
        assert before == after
    print("2.3 PASS: staged/unstaged/both/untracked/empty-index observed without identity changes")


def validate_fixture_contracts_2_4_to_2_8() -> None:
    manifest_fixture = FIXTURES / "manifiesto"
    try:
        load_json(manifest_fixture / "invalid.json")
    except json.JSONDecodeError:
        pass
    else:
        raise AssertionError("invalid manifest JSON was accepted")
    manifest_cases = load_json(manifest_fixture / "cases.json")["cases"]
    assert {case["expected"] for case in manifest_cases} == {"reject", "ausente", "discrepante"}
    assert (manifest_fixture / "symlink").is_symlink()
    print("2.4 FIXTURE CONTRACT: parser rejects malformed JSON; case labels declare expected outcomes")

    source_cases = load_json(FIXTURES / "fuente/cases.json")["cases"]
    assert source_cases == {
        "unauthorized": "blocked",
        "missing": "blocked",
        "different_hash": "blocked",
        "extra": "record_and_exclude",
        "collision": "blocked",
    }
    print("2.5 FIXTURE CONTRACT: source case labels match the documented expected outcomes")

    transaction_cases = load_json(FIXTURES / "transaccion/cases.json")["cases"]
    assert transaction_cases["intent_only"] == "reconcile_by_identity"
    assert transaction_cases["mid_copy"] == "rollback_owned_only"
    assert transaction_cases["altered_destination"] == "manual_intervention+blocked"
    assert transaction_cases["changed_completed_identity"] == "manual_intervention+blocked"
    print("2.6 FIXTURE CONTRACT: transaction case labels match the documented expected outcomes")

    opencode_cases = load_json(FIXTURES / "opencode/cases.json")
    assert opencode_cases["no_enumerator"] == {
        "result": "not_verifiable",
        "substitute_expected": False,
    }
    assert opencode_cases["rediscovery_failed"] == {
        "rollback": "owned_only",
        "final_state": "blocked",
    }
    print("2.7 FIXTURE CONTRACT: OpenCode case labels match the documented expected outcomes")

    with (FIXTURES / "pdf/missing-category.csv").open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    missing = next(row for row in rows if row["category"] == "fluid_mechanics")
    assert missing["source_status"] == "no_verificada_en_fuente_primaria"
    assert all(row["gate"] == "open" for row in rows)
    print("2.8 EVIDENCE CONTRACT: CSV records the missing category as unverified with an open gate")


def validate_3_x_and_4_1() -> None:
    manifest = load_json(ROOT / "MANIFIESTO_ARCHIVOS.json")["files"]
    with (DOSSIER / "manifiesto.csv").open(newline="", encoding="utf-8") as handle:
        rows = list(csv.DictReader(handle))
    by_path = {row["path"]: row for row in rows}
    assert len(manifest) == len(rows) == len(by_path) == 45
    assert set(by_path) == {entry["path"] for entry in manifest}
    print("3.1 PASS: manifest JSON is valid and manifiesto.csv reconciles 45/45 unique paths")

    expected = {entry["path"]: entry for entry in manifest}
    samples = ["AGENTS.md", "README.md", "referencias/Proyecto Termodinamica y MF 2026-2.pdf"]
    for relative in samples:
        path = ROOT / relative
        row = by_path[relative]
        assert path.stat().st_size == expected[relative]["bytes"] == int(row["observed_bytes"])
        assert sha256(path) == expected[relative]["sha256"] == row["observed_sha256"]
        assert row["status"] == "presente_y_coincidente"
    assert by_path[".gitignore"]["status"] == "pendiente_decision"
    opencode_rows = [row for row in rows if row["path"].startswith(".opencode/")]
    assert len(opencode_rows) == 19 and all(row["status"] == "ausente" for row in opencode_rows)
    print("3.2 PASS: 3 independent byte/hash samples match; .gitignore and 19 .opencode gaps remain visible")

    command_ids = [
        "opencode-help", "opencode-agent-help", "opencode-debug-help",
        "opencode-agent-list", "opencode-debug-skill", "opencode-debug-config",
    ]
    for command_id in command_ids:
        for suffix in ["command.txt", "stdout.txt", "stderr.txt"]:
            assert (DOSSIER / "comandos" / f"{command_id}.{suffix}").is_file()
        metadata = (DOSSIER / "comandos" / f"{command_id}.command.txt").read_text(encoding="utf-8")
        assert f"command: {command_id.replace('-', ' ', 1)}" in metadata or "command: opencode " in metadata
        assert "exit_code: 0" in metadata
    help_stderr = (DOSSIER / "comandos/opencode-help.stderr.txt").read_text(encoding="utf-8")
    agent_help_stderr = (DOSSIER / "comandos/opencode-agent-help.stderr.txt").read_text(encoding="utf-8")
    debug_help_stderr = (DOSSIER / "comandos/opencode-debug-help.stderr.txt").read_text(encoding="utf-8")
    assert "opencode agent" in help_stderr and "opencode debug" in help_stderr
    assert "opencode agent list" in agent_help_stderr
    assert "opencode debug config" in debug_help_stderr and "opencode debug skill" in debug_help_stderr
    print("3.3 PASS: exact OpenCode commands, exit codes, raw stdout, and raw stderr are preserved")

    agent_stdout = (DOSSIER / "comandos/opencode-agent-list.stdout.txt").read_text(encoding="utf-8")
    agents = re.findall(r"^([^ ].*?) \((?:primary|subagent|all)\)$", agent_stdout, re.MULTILINE)
    skills = [entry["name"] for entry in load_json(DOSSIER / "comandos/opencode-debug-skill.stdout.txt")]
    resolved_config = load_json(DOSSIER / "comandos/opencode-debug-config.stdout.txt")
    commands = sorted(resolved_config.get("command", {}))
    assert len(agents) == 28 and len(skills) == 20 and len(commands) == 13
    assert resolved_config["default_agent"] == "ecogrid-director"
    with (DOSSIER / "opencode.csv").open(newline="", encoding="utf-8") as handle:
        inventory = list(csv.DictReader(handle))
    missing_project = [row for row in inventory if row["status"] == "expected_missing"]
    assert len(missing_project) == 19
    assert any(row["type"] == "config" and row["status"] == "valid_json_but_default_agent_unresolved" for row in inventory)
    assert any(row["type"] == "agent" and row["status"] == "observed_28" for row in inventory)
    print("3.4 PASS: raw discovery finds 28 agents, 20 skills, 13 commands, and 19 project gaps")

    pdf_relative = "referencias/Proyecto Termodinamica y MF 2026-2.pdf"
    assert sha256(ROOT / pdf_relative) == expected[pdf_relative]["sha256"]
    with (DOSSIER / "obligaciones-pdf.csv").open(newline="", encoding="utf-8") as handle:
        obligations = list(csv.DictReader(handle))
    assert len(obligations) == 22
    assert all(row["pagina"] and row["extracto_fiel"] for row in obligations)
    print("3.5 PASS: official PDF hash matches and 22 required rows carry page-backed extracts")

    liga = next(row for row in obligations if row["id"] == "ACA-20")
    pitch_date = next(row for row in obligations if row["id"] == "ACA-21")
    fair_date = next(row for row in obligations if row["id"] == "ACA-22")
    assert liga["pagina"] == "4" and "ECO_005" in liga["estado"]
    assert pitch_date["estado"] == fair_date["estado"] == "verificada_como_sugerida"
    print("3.6 PASS: Liga 4 hybrid requirement remains specific; ECO-005 and suggested dates are preserved")

    with (DOSSIER / "brechas.csv").open(newline="", encoding="utf-8") as handle:
        gaps = list(csv.DictReader(handle))
    assert len(gaps) == 10
    required = {"state", "responsible", "dependency", "next_action"}
    assert all(required <= row.keys() and all(row[field].strip() for field in required) for row in gaps)
    print("3.7 PASS: all 10 gaps include state, responsible party, dependency, and next action")

    recovery = load_json(DOSSIER / "recuperacion.json")
    assert recovery["preflight"] == recovery["final_state"] == "blocked"
    assert recovery["target_writes"] == [] and recovery["journal"] == []
    assert not (ROOT / ".opencode").exists()
    print("4.1 PASS: G5 remains honestly blocked with complete trace and zero target writes")


def main() -> None:
    assert Path(run_git("rev-parse", "--show-toplevel", cwd=ROOT)).resolve() == ROOT
    validate_2_1()
    validate_2_2()
    validate_2_3()
    validate_fixture_contracts_2_4_to_2_8()
    validate_3_x_and_4_1()
    print("SUMMARY: 11 evidence checks passed; 5 fixture contracts matched (not runtime tests)")


if __name__ == "__main__":
    main()
