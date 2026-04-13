"""Structured step tracking for the AI action loop.

Inspired by browser-use's AgentHistoryList, but adapted for our
Camoufox-based system with Skill generation support.
"""

from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass, field
from typing import Any, Optional


@dataclass
class BrowserState:
    """Snapshot of browser state at the start of a step."""
    url: str = ""
    title: str = ""
    tab_count: int = 1
    snapshot_text: str = ""  # Truncated for serialization


@dataclass
class AgentStepOutput:
    """What the LLM produced for one step."""
    thinking: str = ""
    memory: Optional[str] = None       # Phase 3: running memory note
    actions: list[dict] = field(default_factory=list)
    raw_response: str = ""


@dataclass
class ActionResult:
    """Outcome of executing one action."""
    action_type: str = ""
    action_params: dict = field(default_factory=dict)
    result: str = ""
    error: Optional[str] = None
    timestamp: float = field(default_factory=time.time)


@dataclass
class AgentStep:
    """One complete step in the action loop."""
    step_number: int = 0
    browser_state: BrowserState = field(default_factory=BrowserState)
    agent_output: AgentStepOutput = field(default_factory=AgentStepOutput)
    action_results: list[ActionResult] = field(default_factory=list)


class LoopDetector:
    """Detects repeated action patterns to prevent infinite loops.

    Reference: browser_use/agent/views.py:156-247 ActionLoopDetector
    """

    def __init__(self, window_size: int = 20) -> None:
        self._window_size = window_size
        self._recent_hashes: list[str] = []
        self._max_repetition: int = 0

    def record(self, action_type: str, params: dict) -> None:
        """Record an action and update repetition tracking."""
        # Normalize: only hash action type + ref (ignore thinking/status)
        key_parts = [action_type]
        if "ref" in params:
            key_parts.append(str(params["ref"]))
        if "url" in params:
            key_parts.append(params["url"][:50])
        if "text" in params:
            key_parts.append(params["text"][:20])

        h = hashlib.sha256("|".join(key_parts).encode()).hexdigest()[:12]
        self._recent_hashes.append(h)
        if len(self._recent_hashes) > self._window_size:
            self._recent_hashes = self._recent_hashes[-self._window_size:]

        # Count max repetitions of any single hash
        from collections import Counter
        counts = Counter(self._recent_hashes)
        self._max_repetition = max(counts.values()) if counts else 0

    def get_nudge(self) -> Optional[str]:
        """Return a nudge message if a loop is detected, else None."""
        if self._max_repetition >= 12:
            return (
                "⚠️ 严重循环：同一操作已重复 12+ 次。必须立即尝试完全不同的方法，"
                "或者调用 done 结束任务。不要再重复相同的操作。"
            )
        if self._max_repetition >= 8:
            return (
                "⚠️ 检测到操作循环：同一操作已重复 8+ 次。"
                "请改变策略，尝试不同的元素或方法。"
            )
        if self._max_repetition >= 5:
            return (
                "注意：有操作被重复了 5 次以上。"
                "如果没有效果，请考虑换一种方式。"
            )
        return None


@dataclass
class AgentHistoryList:
    """Complete history of an agent run.

    Reference: browser_use/agent/views.py AgentHistoryList
    """
    task: str = ""
    steps: list[AgentStep] = field(default_factory=list)
    compacted_summary: Optional[str] = None  # Phase 3: compressed old history
    loop_detector: LoopDetector = field(default_factory=LoopDetector)

    def urls(self) -> list[str]:
        """All URLs visited during the run."""
        return [s.browser_state.url for s in self.steps if s.browser_state.url]

    def action_names(self) -> list[str]:
        """All action types executed."""
        names: list[str] = []
        for step in self.steps:
            for ar in step.action_results:
                names.append(ar.action_type)
        return names

    def errors(self) -> list[str]:
        """All errors encountered."""
        errs: list[str] = []
        for step in self.steps:
            for ar in step.action_results:
                if ar.error:
                    errs.append(ar.error)
        return errs

    def is_done(self) -> bool:
        """Whether the last action was 'done'."""
        if not self.steps:
            return False
        last_step = self.steps[-1]
        return any(ar.action_type == "done" for ar in last_step.action_results)

    def last_action(self) -> Optional[ActionResult]:
        """The most recent action result."""
        for step in reversed(self.steps):
            if step.action_results:
                return step.action_results[-1]
        return None

    def to_recorded_steps(self) -> list[dict[str, Any]]:
        """Convert to legacy recorded_steps format for backward compatibility."""
        result: list[dict[str, Any]] = []
        for step in self.steps:
            for ar in step.action_results:
                record: dict[str, Any] = {
                    "action": ar.action_type,
                    "url": step.browser_state.url,
                }
                record.update(ar.action_params)
                if ar.result:
                    record["_result"] = ar.result
                result.append(record)
        return result

    def to_json(self) -> str:
        """Serialize to JSON for persistence."""
        data = {
            "task": self.task,
            "compacted_summary": self.compacted_summary,
            "steps": [
                {
                    "step_number": s.step_number,
                    "browser_state": {
                        "url": s.browser_state.url,
                        "title": s.browser_state.title,
                        "tab_count": s.browser_state.tab_count,
                    },
                    "agent_output": {
                        "thinking": s.agent_output.thinking,
                        "memory": s.agent_output.memory,
                    },
                    "action_results": [
                        {
                            "action_type": ar.action_type,
                            "action_params": ar.action_params,
                            "result": ar.result,
                            "error": ar.error,
                            "timestamp": ar.timestamp,
                        }
                        for ar in s.action_results
                    ],
                }
                for s in self.steps
            ],
        }
        return json.dumps(data, ensure_ascii=False, indent=2)

    @classmethod
    def from_json(cls, raw: str) -> AgentHistoryList:
        """Deserialize from JSON."""
        data = json.loads(raw)
        history = cls(
            task=data.get("task", ""),
            compacted_summary=data.get("compacted_summary"),
        )
        for s in data.get("steps", []):
            bs = s.get("browser_state", {})
            ao = s.get("agent_output", {})
            step = AgentStep(
                step_number=s.get("step_number", 0),
                browser_state=BrowserState(
                    url=bs.get("url", ""),
                    title=bs.get("title", ""),
                    tab_count=bs.get("tab_count", 1),
                ),
                agent_output=AgentStepOutput(
                    thinking=ao.get("thinking", ""),
                    memory=ao.get("memory"),
                ),
                action_results=[
                    ActionResult(
                        action_type=ar.get("action_type", ""),
                        action_params=ar.get("action_params", {}),
                        result=ar.get("result", ""),
                        error=ar.get("error"),
                        timestamp=ar.get("timestamp", 0),
                    )
                    for ar in s.get("action_results", [])
                ],
            )
            history.steps.append(step)
        return history
