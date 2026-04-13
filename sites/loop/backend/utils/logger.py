"""Structured JSON logging for actions and events."""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

import config


def _log_path() -> Path:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return config.LOG_DIR / f"session_{today}.jsonl"


def log_event(event_type: str, **data: Any) -> None:
    """Append a structured log entry to today's session log."""
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "event": event_type,
        **data,
    }
    path = _log_path()
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def log_action(action: str, params: dict, result: str, screenshot_path: Optional[str] = None) -> None:
    log_event(
        "action",
        action=action,
        params=params,
        result=result,
        screenshot_path=screenshot_path,
    )


def log_plan(user_instruction: str, plan: dict) -> None:
    log_event("plan", instruction=user_instruction, plan=plan)


def log_error(message: str, context: Optional[dict] = None) -> None:
    log_event("error", message=message, context=context or {})
