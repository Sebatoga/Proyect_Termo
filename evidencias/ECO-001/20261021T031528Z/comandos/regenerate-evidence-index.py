#!/usr/bin/env python3
"""Regenerate the self-excluding ECO-001 evidence index from current bytes."""

from __future__ import annotations

from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path


DOSSIER = Path(__file__).resolve().parents[1]
INDEX = DOSSIER / "registro-evidencias.json"


def identity(path: Path) -> tuple[str, int, str]:
    if path.is_symlink():
        payload = os.readlink(path).encode()
        return "symlink", len(payload), hashlib.sha256(payload).hexdigest()
    payload = path.read_bytes()
    return "regular_file", len(payload), hashlib.sha256(payload).hexdigest()


def main() -> None:
    index = json.loads(INDEX.read_text(encoding="utf-8"))
    index["finished_at"] = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    index["repository"]["git_status_after_ref"] = "comandos/git-status-t1.txt"
    index["steps"] = [
        {
            "id": "WU1-FOCUSED-VALIDATION",
            "command": "python3 evidencias/ECO-001/20261021T031528Z/comandos/focused-validation.py",
            "cwd": str(DOSSIER.parents[2]),
            "exit_code": 0,
            "stdout_ref": "comandos/focused-validation.stdout.txt",
            "stderr_ref": "comandos/focused-validation.stderr.txt",
            "status": "observed",
        },
        {
            "id": "G3-OPENCODE-DISCOVERY",
            "command": "See comandos/opencode-*.command.txt for six exact commands",
            "cwd": str(DOSSIER.parents[2]),
            "exit_code": 0,
            "stdout_ref": "comandos/opencode-inventory.txt",
            "stderr_ref": None,
            "status": "observed",
        },
        {
            "id": "G9-T1",
            "command": "git rev-parse HEAD && git status --porcelain=v2 --branch --untracked-files=all && git diff --cached --name-status && git diff --name-status && git ls-files --others --exclude-standard",
            "cwd": str(DOSSIER.parents[2]),
            "exit_code": 0,
            "stdout_ref": "comandos/git-status-t1.txt",
            "stderr_ref": None,
            "status": "observed",
        },
        {
            "id": "G9-FINAL-ACCEPTANCE",
            "command": "See comandos/verification-final.txt for exact commands and observed outputs",
            "cwd": str(DOSSIER.parents[2]),
            "exit_code": 0,
            "stdout_ref": "comandos/verification-final.txt",
            "stderr_ref": None,
            "status": "observed",
        },
    ]
    files = []
    special_entries = []
    for path in sorted(DOSSIER.rglob("*")):
        if path == INDEX or (not path.is_file() and not path.is_symlink()):
            continue
        kind, size, digest = identity(path)
        entry = {
            "path": path.relative_to(DOSSIER).as_posix(),
            "type": kind,
            "bytes": size,
            "sha256": digest,
        }
        if kind == "symlink":
            special_entries.append(entry)
        else:
            files.append(entry)
    index["files"] = files
    index["special_entries"] = special_entries
    INDEX.write_text(json.dumps(index, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"indexed_files: {len(files)}")
    print(f"indexed_special_entries: {len(special_entries)}")
    print("self_hash_excluded: true")


if __name__ == "__main__":
    main()
