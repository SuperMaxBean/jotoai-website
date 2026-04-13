"""Persistent selector override storage.

When a CSS selector breaks and is healed by VL, the override is saved here
so it persists across restarts.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import config

# Default selectors for BOSS直聘
DEFAULT_SELECTORS: dict[str, str] = {
    "candidate": ".geek-item",
    "name": ".geek-name",
    "badge": ".badge-count",
    "filter_new": '.chat-label-item[title*="新招呼"]',
    "filter_resume": '.chat-label-item[title="已获取简历"]',
    "chat_input": ".boss-chat-editor-input",
    "send_btn": ".submit",
    "resume_btn_online": "a.resume-btn-online",
    "resume_btn_file": ".resume-btn-file",
    "source_job": ".source-job",
    "request_resume": "span.operate-btn",
    "msg_friend": ".item-friend .text",
}


class SelectorStore:
    """File-backed selector override storage."""

    def __init__(self, path: Path | None = None) -> None:
        self._path = path or config.SELECTOR_OVERRIDES_PATH
        self._overrides: dict[str, dict] = self._load()

    def _load(self) -> dict[str, dict]:
        if self._path.exists():
            try:
                return json.loads(self._path.read_text(encoding="utf-8"))
            except (json.JSONDecodeError, OSError):
                return {}
        return {}

    def _save(self) -> None:
        self._path.parent.mkdir(parents=True, exist_ok=True)
        self._path.write_text(
            json.dumps(self._overrides, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def get(self, key: str) -> str:
        """Return override selector if exists, else default."""
        if key in self._overrides:
            return self._overrides[key]["selector"]
        return DEFAULT_SELECTORS.get(key, "")

    def set_override(self, key: str, new_selector: str) -> None:
        self._overrides[key] = {
            "selector": new_selector,
            "original": DEFAULT_SELECTORS.get(key, ""),
            "healed_at": datetime.now(timezone.utc).isoformat(),
        }
        self._save()

    def remove_override(self, key: str) -> None:
        if key in self._overrides:
            del self._overrides[key]
            self._save()

    def list_all(self) -> dict[str, dict]:
        """Return all selectors with their current values and override status."""
        result = {}
        for key, default in DEFAULT_SELECTORS.items():
            override = self._overrides.get(key)
            result[key] = {
                "current": override["selector"] if override else default,
                "default": default,
                "overridden": key in self._overrides,
                "healed_at": override.get("healed_at") if override else None,
            }
        return result

    def list_overrides(self) -> dict[str, dict]:
        return dict(self._overrides)


# Global singleton
selector_store = SelectorStore()
