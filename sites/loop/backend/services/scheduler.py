"""Skill scheduler: run Skills automatically at configured intervals.

Persists schedule config to JSON. Runs in background asyncio tasks,
independent of frontend WebSocket connections.
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import tempfile
from datetime import datetime, timezone, timedelta
from typing import Any, Optional

import config

_logger = logging.getLogger("scheduler")

_schedules: dict[str, dict] = {}  # skill_name -> schedule config
_tasks: dict[str, asyncio.Task] = {}  # skill_name -> running asyncio task
_run_skill_fn = None  # Set by init() — async function(skill_name, params) -> result


def _load() -> dict[str, dict]:
    if config.SCHEDULER_FILE.exists():
        try:
            data = json.loads(config.SCHEDULER_FILE.read_text(encoding="utf-8"))
            return {s["skill"]: s for s in data}
        except (json.JSONDecodeError, OSError):
            return {}
    return {}


def _save() -> None:
    config.SCHEDULER_FILE.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=str(config.SCHEDULER_FILE.parent), suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(list(_schedules.values()), f, ensure_ascii=False, indent=2)
        os.replace(tmp, str(config.SCHEDULER_FILE))
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _default_schedule(skill: str) -> dict:
    return {
        "skill": skill,
        "params": {},
        "interval_hours": 24,
        "enabled": False,
        "last_run": None,
        "next_run": None,
        "last_result": None,
    }


def init(run_skill_fn) -> None:
    """Initialize scheduler with the skill execution function.

    run_skill_fn should be: async def(skill_name: str, params: dict) -> dict
    """
    global _run_skill_fn, _schedules
    _run_skill_fn = run_skill_fn
    _schedules = _load()

    # Start background tasks for enabled schedules
    for skill, sched in _schedules.items():
        if sched.get("enabled"):
            _start_task(skill)

    _logger.warning(f"Scheduler initialized: {len(_schedules)} schedules, {len(_tasks)} active")


def list_schedules() -> list[dict]:
    return list(_schedules.values())


def get_schedule(skill: str) -> Optional[dict]:
    return _schedules.get(skill)


def upsert_schedule(skill: str, params: dict = None, interval_hours: float = 24, enabled: bool = True) -> dict:
    """Create or update a schedule for a skill."""
    existing = _schedules.get(skill)
    if existing:
        sched = {**existing}
        if params is not None:
            sched["params"] = params
        sched["interval_hours"] = interval_hours
        sched["enabled"] = enabled
    else:
        sched = _default_schedule(skill)
        sched["params"] = params or {}
        sched["interval_hours"] = interval_hours
        sched["enabled"] = enabled

    # Calculate next_run
    if enabled:
        sched["next_run"] = (datetime.now(timezone.utc) + timedelta(hours=interval_hours)).isoformat()

    _schedules[skill] = sched
    _save()

    # Start or stop background task
    if enabled:
        _start_task(skill)
    else:
        _stop_task(skill)

    _logger.warning(f"Schedule updated: {skill}, interval={interval_hours}h, enabled={enabled}")
    return sched


def delete_schedule(skill: str) -> bool:
    if skill in _schedules:
        _stop_task(skill)
        del _schedules[skill]
        _save()
        return True
    return False


def _start_task(skill: str) -> None:
    """Start the background loop for a skill."""
    _stop_task(skill)  # Cancel existing if any
    _tasks[skill] = asyncio.create_task(_run_loop(skill))


def _stop_task(skill: str) -> None:
    task = _tasks.pop(skill, None)
    if task and not task.done():
        task.cancel()


async def _run_loop(skill: str) -> None:
    """Background loop: sleep until next_run, execute, repeat."""
    while True:
        sched = _schedules.get(skill)
        if not sched or not sched.get("enabled"):
            return

        interval = sched.get("interval_hours", 24)
        next_run = sched.get("next_run")

        # Calculate sleep time
        if next_run:
            try:
                next_dt = datetime.fromisoformat(next_run)
                now = datetime.now(timezone.utc)
                sleep_seconds = max(0, (next_dt - now).total_seconds())
            except (ValueError, TypeError):
                sleep_seconds = interval * 3600
        else:
            sleep_seconds = interval * 3600

        _logger.info(f"[{skill}] Next run in {sleep_seconds/3600:.1f}h")

        try:
            await asyncio.sleep(sleep_seconds)
        except asyncio.CancelledError:
            return

        # Execute
        if not _run_skill_fn:
            _logger.error(f"[{skill}] No run_skill_fn configured")
            return

        sched = _schedules.get(skill)
        if not sched or not sched.get("enabled"):
            return

        _logger.warning(f"[{skill}] Scheduled execution starting")
        sched["last_run"] = _now_iso()

        try:
            result = await _run_skill_fn(skill, sched.get("params", {}))
            summary = result.get("summary", "") if isinstance(result, dict) else str(result)
            sched["last_result"] = summary or "completed"
            _logger.warning(f"[{skill}] Completed: {summary[:80]}")
        except Exception as e:
            sched["last_result"] = f"error: {str(e)[:100]}"
            _logger.error(f"[{skill}] Failed: {str(e)[:100]}")

        # Schedule next run
        sched["next_run"] = (datetime.now(timezone.utc) + timedelta(hours=interval)).isoformat()
        _save()
