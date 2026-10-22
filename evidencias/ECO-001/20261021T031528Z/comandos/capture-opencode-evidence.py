#!/usr/bin/env python3
"""Capture exact local OpenCode discovery commands without interpretation."""

from __future__ import annotations

from pathlib import Path
import shlex
import subprocess


OUTPUT = Path(__file__).resolve().parent
COMMANDS = {
    "opencode-help": ["opencode", "--help"],
    "opencode-agent-help": ["opencode", "agent", "--help"],
    "opencode-debug-help": ["opencode", "debug", "--help"],
    "opencode-agent-list": ["opencode", "agent", "list"],
    "opencode-debug-skill": ["opencode", "debug", "skill"],
    "opencode-debug-config": ["opencode", "debug", "config"],
}


def main() -> None:
    for command_id, argv in COMMANDS.items():
        stdout_path = OUTPUT / f"{command_id}.stdout.txt"
        stderr_path = OUTPUT / f"{command_id}.stderr.txt"
        with stdout_path.open("wb") as stdout, stderr_path.open("wb") as stderr:
            result = subprocess.run(
                argv, cwd=OUTPUT.parents[3], stdout=stdout, stderr=stderr
            )
        command = shlex.join(argv)
        metadata = (
            f"command: {command}\n"
            f"cwd: {OUTPUT.parents[3]}\n"
            f"exit_code: {result.returncode}\n"
            f"stdout_ref: comandos/{command_id}.stdout.txt\n"
            f"stderr_ref: comandos/{command_id}.stderr.txt\n"
        )
        (OUTPUT / f"{command_id}.command.txt").write_text(metadata, encoding="utf-8")
        print(
            f"{command_id}: exit {result.returncode}; "
            f"stdout={stdout_path.stat().st_size} bytes; "
            f"stderr={stderr_path.stat().st_size} bytes"
        )
        if result.returncode != 0:
            raise SystemExit(result.returncode)


if __name__ == "__main__":
    main()
