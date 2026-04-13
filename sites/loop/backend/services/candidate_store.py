"""Unified candidate data store.

Single JSON file tracks each candidate's full lifecycle:
new → engaged → replied → analyzed
"""

from __future__ import annotations

import json
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import config

STORE_PATH = config.RESUME_DIR / "candidates.json"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _default_candidate(boss_id: str) -> dict:
    now = _now_iso()
    return {
        "boss_id": boss_id,
        "name": "",
        "position": "",
        "status": "new",
        "engaged_at": None,
        "resume": None,
        "questions": [],
        "replies": [],
        "replied_at": None,
        "created_at": now,
        "updated_at": now,
    }


def _load() -> list[dict]:
    if STORE_PATH.exists():
        try:
            return json.loads(STORE_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []
    return []


def _save(candidates: list[dict]) -> None:
    STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(STORE_PATH.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(candidates, f, ensure_ascii=False, indent=2)
        os.replace(tmp, str(STORE_PATH))
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def get(boss_id: str) -> Optional[dict]:
    for c in _load():
        if c.get("boss_id") == boss_id:
            return c
    return None


def upsert(boss_id: str, **fields: Any) -> dict:
    """Create or update a candidate. Returns the updated record."""
    candidates = _load()
    existing = None
    idx = -1
    for i, c in enumerate(candidates):
        if c.get("boss_id") == boss_id:
            existing = c
            idx = i
            break

    if existing is None:
        record = _default_candidate(boss_id)
        record.update({k: v for k, v in fields.items() if v is not None})
        record["updated_at"] = _now_iso()
        candidates.append(record)
    else:
        record = {**existing, **{k: v for k, v in fields.items() if v is not None}}
        record["updated_at"] = _now_iso()
        candidates[idx] = record

    _save(candidates)
    return record


def list_all(
    status: Optional[str] = None,
    date: Optional[str] = None,
    position: Optional[str] = None,
    updated_date: Optional[str] = None,
) -> list[dict]:
    """List candidates with optional filters.

    Args:
        status: Filter by status (exact match)
        date: Filter by created_at date (YYYY-MM-DD prefix match)
        position: Filter by position (substring match)
        updated_date: Filter by updated_at date (YYYY-MM-DD prefix match)
    """
    candidates = _load()
    if status:
        candidates = [c for c in candidates if c.get("status") == status]
    if date:
        candidates = [c for c in candidates if c.get("created_at", "").startswith(date)]
    if updated_date:
        candidates = [c for c in candidates if c.get("updated_at", "").startswith(updated_date)]
    if position:
        candidates = [c for c in candidates if position in c.get("position", "")]
    return candidates


def list_by_status(status: str) -> list[dict]:
    return list_all(status=status)


def get_stats() -> dict:
    candidates = _load()
    by_status: dict[str, int] = {}
    by_position: dict[str, int] = {}
    for c in candidates:
        s = c.get("status", "unknown")
        p = c.get("position", "unknown")
        by_status[s] = by_status.get(s, 0) + 1
        by_position[p] = by_position.get(p, 0) + 1
    return {
        "total": len(candidates),
        "by_status": by_status,
        "by_position": by_position,
    }


def migrate_legacy() -> int:
    """One-time migration from index.json + qa_records.json to candidates.json."""
    candidates = _load()
    existing_ids = {c.get("boss_id") for c in candidates}
    migrated = 0

    # Migrate resumes from index.json
    index_path = config.RESUME_DIR / "index.json"
    if index_path.exists():
        try:
            index = json.loads(index_path.read_text(encoding="utf-8"))
            for entry in index:
                bid = entry.get("boss_id", "")
                if not bid or bid in existing_ids:
                    continue
                record = _default_candidate(bid)
                record["name"] = entry.get("candidate", "")
                record["position"] = entry.get("position", "")
                record["status"] = "new"
                record["resume"] = {
                    "filename": entry.get("filename", ""),
                    "path": entry.get("path", ""),
                    "downloaded_at": entry.get("download_time", ""),
                }
                record["created_at"] = entry.get("download_time", _now_iso())
                candidates.append(record)
                existing_ids.add(bid)
                migrated += 1
        except (json.JSONDecodeError, OSError):
            pass

    # Merge QA records
    qa_path = config.RESUME_DIR / "qa_records.json"
    if qa_path.exists():
        try:
            qa_records = json.loads(qa_path.read_text(encoding="utf-8"))
            for entry in qa_records:
                bid = entry.get("boss_id", "")
                if not bid:
                    continue
                questions = [p.get("question", "") for p in entry.get("qa", [])]
                answers = [p.get("answer", "") for p in entry.get("qa", [])]

                # Find existing candidate or create new
                found = False
                for c in candidates:
                    if c.get("boss_id") == bid:
                        c["questions"] = questions
                        c["replies"] = answers
                        if any(a for a in answers):
                            c["status"] = "replied"
                        found = True
                        break
                if not found:
                    record = _default_candidate(bid)
                    record["name"] = entry.get("candidate", "")
                    record["position"] = entry.get("position", "")
                    record["questions"] = questions
                    record["replies"] = answers
                    record["status"] = "replied" if any(a for a in answers) else "engaged"
                    candidates.append(record)
                    migrated += 1
        except (json.JSONDecodeError, OSError):
            pass

    if migrated > 0:
        _save(candidates)

    return migrated
