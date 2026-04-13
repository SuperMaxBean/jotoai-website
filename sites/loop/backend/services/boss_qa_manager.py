"""Q&A records storage for candidate interviews."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import config

QA_FILE = config.RESUME_DIR / "qa_records.json"


def _load() -> list[dict]:
    if QA_FILE.exists():
        return json.loads(QA_FILE.read_text(encoding="utf-8"))
    return []


def _save(records: list[dict]) -> None:
    QA_FILE.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")


def save_qa(
    candidate: str,
    position: str,
    boss_id: str,
    questions: list[str],
    answers: list[str],
) -> dict:
    """Save a Q&A record for a candidate."""
    qa_pairs = []
    for i, q in enumerate(questions):
        qa_pairs.append({
            "question": q,
            "answer": answers[i] if i < len(answers) else "",
        })

    entry = {
        "candidate": candidate,
        "position": position,
        "boss_id": boss_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "time": datetime.now(timezone.utc).isoformat(),
        "qa": qa_pairs,
    }

    records = _load()
    records.append(entry)
    _save(records)
    return entry


def list_qa(
    date: Optional[str] = None,
    candidate: Optional[str] = None,
) -> list[dict]:
    """List Q&A records, optionally filtered."""
    records = _load()
    if date:
        records = [r for r in records if r.get("date") == date]
    if candidate:
        records = [r for r in records if candidate in r.get("candidate", "")]
    return records
