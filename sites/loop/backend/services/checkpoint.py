"""Checkpoint manager for Skill error recovery and idempotency.

Tracks which candidates (by boss_id) have been processed by each Skill,
so that interrupted Skills can resume from where they left off.
"""

from __future__ import annotations

import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path

import config


class CheckpointManager:
    """File-backed checkpoint for a single Skill run."""

    def __init__(self, skill_name: str) -> None:
        self._path = config.CHECKPOINT_DIR / f"{skill_name}.json"
        self._data = self._load()

    def _load(self) -> dict:
        if self._path.exists():
            try:
                return json.loads(self._path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                return {"processed": [], "last_updated": ""}
        return {"processed": [], "last_updated": ""}

    def _save(self) -> None:
        """Atomic write: write to temp file, then rename."""
        self._data["last_updated"] = datetime.now(timezone.utc).isoformat()
        fd, tmp = tempfile.mkstemp(dir=str(self._path.parent), suffix=".tmp")
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(self._data, f, ensure_ascii=False, indent=2)
            os.replace(tmp, str(self._path))
        except Exception:
            try:
                os.unlink(tmp)
            except OSError:
                pass
            raise

    def is_processed(self, boss_id: str) -> bool:
        return boss_id in self._data["processed"]

    def mark_processed(self, boss_id: str) -> None:
        if boss_id not in self._data["processed"]:
            self._data["processed"].append(boss_id)
            self._save()

    def reset(self) -> None:
        self._data = {"processed": [], "last_updated": ""}
        self._save()

    def count(self) -> int:
        return len(self._data["processed"])

    @property
    def processed_ids(self) -> list[str]:
        return list(self._data["processed"])
