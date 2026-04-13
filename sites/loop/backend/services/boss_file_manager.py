"""Resume file management with date/position directory structure."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import config


def _index_path() -> Path:
    return config.RESUME_DIR / "index.json"


def _load_index() -> list[dict]:
    path = _index_path()
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return []


def _save_index(entries: list[dict]) -> None:
    path = _index_path()
    path.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")


def save_resume(
    src_path: Path,
    candidate: str,
    position: str,
    experience: str = "",
    boss_id: str = "",
) -> dict:
    """Move a downloaded resume into the organized directory structure.

    Returns the metadata entry for this resume.
    """
    today = datetime.now().strftime("%Y-%m-%d")
    safe_position = position.replace("/", "_").replace("\\", "_").strip() or "未知职位"
    target_dir = config.RESUME_DIR / today / safe_position
    target_dir.mkdir(parents=True, exist_ok=True)

    # Build filename: 候选人_职位_经验.ext
    ext = src_path.suffix or ".pdf"
    parts = [candidate]
    if position:
        parts.append(safe_position)
    if experience:
        parts.append(experience)
    filename = "_".join(parts) + ext

    target_path = target_dir / filename
    # Avoid overwrite
    if target_path.exists():
        ts = datetime.now().strftime("%H%M%S")
        filename = "_".join(parts) + f"_{ts}" + ext
        target_path = target_dir / filename

    src_path.rename(target_path)

    entry = {
        "filename": filename,
        "candidate": candidate,
        "position": safe_position,
        "experience": experience,
        "date": today,
        "download_time": datetime.now(timezone.utc).isoformat(),
        "path": f"{today}/{safe_position}/{filename}",
        "boss_id": boss_id,
    }

    # Append to index (legacy)
    index = _load_index()
    index.append(entry)
    _save_index(index)

    # Also write to unified candidate store
    from services import candidate_store
    candidate_store.upsert(
        boss_id=boss_id,
        name=candidate,
        position=safe_position,
        resume={"filename": filename, "path": entry["path"], "downloaded_at": entry["download_time"]},
    )

    return entry


def list_resumes(
    date: Optional[str] = None,
    position: Optional[str] = None,
) -> list[dict]:
    """List resumes, optionally filtered by date and/or position."""
    index = _load_index()
    results = index
    if date:
        results = [r for r in results if r.get("date") == date]
    if position:
        results = [r for r in results if position in r.get("position", "")]
    return results


def get_stats() -> dict:
    """Get resume statistics grouped by date and position."""
    index = _load_index()
    by_date: dict[str, int] = {}
    by_position: dict[str, int] = {}
    for entry in index:
        d = entry.get("date", "unknown")
        p = entry.get("position", "unknown")
        by_date[d] = by_date.get(d, 0) + 1
        by_position[p] = by_position.get(p, 0) + 1
    return {
        "total": len(index),
        "by_date": by_date,
        "by_position": by_position,
    }


def is_downloaded(boss_id: str) -> bool:
    """Check if a candidate's resume has already been downloaded."""
    index = _load_index()
    return any(e.get("boss_id") == boss_id for e in index)
