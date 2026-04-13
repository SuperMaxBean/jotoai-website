"""LLM integration for browser action planning.

Uses OpenAI-compatible API (works with DashScope/Qwen, OpenAI, etc.)
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from openai import OpenAI

import config
from agent.prompts import get_system_prompt, TASK_TEMPLATE, SCREENSHOT_ANALYZE_PROMPT, COMPACT_HISTORY_PROMPT
from agent.history import AgentHistoryList

_logger = logging.getLogger("planner")


class GLMPlanner:
    """Plans browser actions by sending page state to the VL model."""

    def __init__(self) -> None:
        self._client = OpenAI(
            api_key=config.LLM_API_KEY,
            base_url=config.LLM_BASE_URL,
        )
        self._model = config.LLM_MODEL

    def plan_actions(
        self,
        task: str,
        snapshot_text: str,
        history: AgentHistoryList,
    ) -> tuple[list[dict[str, Any]], str | None]:
        """Return (actions_list, memory_string) from the LLM.

        The LLM may return a single action dict or a list of 1-5 actions.
        Also extracts the 'memory' field if present.
        """
        history_text = self._format_history(history)

        # Build memory section
        memory_section = ""
        if history.compacted_summary:
            memory_section += f"## 历史摘要\n{history.compacted_summary}\n\n"
        last_memory = self._get_last_memory(history)
        if last_memory:
            memory_section += f"## 当前记忆\n{last_memory}\n\n"

        user_content = TASK_TEMPLATE.format(
            task=task,
            snapshot=snapshot_text,
            memory_section=memory_section,
            history=history_text if history_text else "(尚无操作历史)",
        )

        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": get_system_prompt()},
                {"role": "user", "content": user_content},
            ],
            temperature=0.1,
            max_tokens=2048,  # Increased for multi-action responses
        )

        raw = response.choices[0].message.content.strip()
        actions = self._parse_actions(raw)

        # Extract memory from the first action (or the response)
        memory = None
        for a in actions:
            if a.get("memory"):
                memory = a["memory"]
                break

        return actions, memory

    # Backward compatible alias
    def plan_action(
        self,
        task: str,
        snapshot_text: str,
        history: AgentHistoryList,
    ) -> dict[str, Any]:
        """Legacy single-action interface. Returns first action."""
        actions, _ = self.plan_actions(task, snapshot_text, history)
        return actions[0] if actions else {"action": "done", "summary": "no actions"}

    def compact_history(self, history: AgentHistoryList) -> str:
        """Summarize old history entries into a compact string."""
        # Format all steps except last 6 for summarization
        old_steps = history.steps[:-6] if len(history.steps) > 6 else history.steps
        lines = []
        for step in old_steps:
            for ar in step.action_results:
                ref_str = ar.action_params.get("ref", "")
                lines.append(f"{ar.action_type}({ref_str}) -> {ar.result}")

        history_text = "\n".join(lines)
        if history.compacted_summary:
            history_text = f"之前的摘要：{history.compacted_summary}\n\n新的操作：\n{history_text}"

        prompt = COMPACT_HISTORY_PROMPT.format(history=history_text[:4000])

        try:
            response = self._client.chat.completions.create(
                model=self._model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=500,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            _logger.error(f"History compaction failed: {str(e)[:100]}")
            return history.compacted_summary or ""

    def analyze_screenshot(
        self,
        task: str,
        screenshot_b64: str,
    ) -> str:
        """Send screenshot to VL model for visual analysis."""
        response = self._client.chat.completions.create(
            model=self._model,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{screenshot_b64}"},
                        },
                        {
                            "type": "text",
                            "text": SCREENSHOT_ANALYZE_PROMPT.format(task=task),
                        },
                    ],
                }
            ],
            temperature=0.2,
            max_tokens=1024,
        )

        return response.choices[0].message.content.strip()

    def judge_tab_relevance(self, task: str, tab_title: str, tab_url: str) -> bool:
        """Judge if a newly opened tab is relevant to the current task."""
        prompt = f"""判断这个新打开的标签页是否与当前任务相关。

当前任务：{task}

新标签页：
- 标题：{tab_title}
- URL：{tab_url}

如果这个页面是当前任务需要访问的页面（比如商品详情页、评论页等），回答 YES。
如果这个页面是广告、推广、不相关的网站、弹窗页面，回答 NO。

只回答 YES 或 NO，不要解释。"""

        try:
            response = self._client.chat.completions.create(
                model=self._model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1,
                max_tokens=10,
            )
            answer = response.choices[0].message.content.strip().upper()
            return "YES" in answer
        except Exception:
            return True  # Default to relevant if API fails

    def _get_last_memory(self, history: AgentHistoryList) -> str | None:
        """Get the memory from the most recent step."""
        for step in reversed(history.steps):
            if step.agent_output.memory:
                return step.agent_output.memory
        return None

    def _format_history(self, history: AgentHistoryList) -> str:
        if not history.steps:
            return ""
        lines = []
        recent = history.steps[-10:]
        for i, step in enumerate(recent, 1):
            for ar in step.action_results:
                ref_str = ar.action_params.get("ref", "")
                lines.append(f"{i}. {ar.action_type}({ref_str}) -> {ar.result}")
        return "\n".join(lines)

    def _parse_actions(self, raw: str) -> list[dict[str, Any]]:
        """Parse LLM response into a list of action dicts.

        Handles: JSON array, single JSON object, markdown code blocks, thinking tags.
        """
        # Strip thinking tags if present (Qwen3 uses <think>...</think>)
        raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL).strip()

        # Try to extract JSON from markdown code block
        match = re.search(r"```(?:json)?\s*(.*?)```", raw, re.DOTALL)
        if match:
            raw = match.group(1).strip()

        # Try direct JSON parse
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                return parsed[:5]  # Cap at 5 actions
            if isinstance(parsed, dict):
                return [parsed]
        except json.JSONDecodeError:
            pass

        # Try to find JSON array in the text
        match = re.search(r"\[.*\]", raw, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group())
                if isinstance(parsed, list):
                    return parsed[:5]
            except json.JSONDecodeError:
                pass

        # Try to find JSON object in the text
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group())
                if isinstance(parsed, dict):
                    return [parsed]
            except json.JSONDecodeError:
                pass

        # Fallback: return error action
        return [{
            "action": "done",
            "summary": f"LLM 返回无法解析: {raw[:200]}",
            "thinking": "parse error",
            "status_message": "AI 返回异常，已停止",
        }]

    # Legacy alias
    def _parse_action(self, raw: str) -> dict[str, Any]:
        actions = self._parse_actions(raw)
        return actions[0] if actions else {"action": "done", "summary": "parse error"}
