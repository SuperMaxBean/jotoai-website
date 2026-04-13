"""Convert AgentHistoryList to Python Skill code.

Two conversion modes:
1. Direct: Map action history to Playwright calls (fast, no LLM)
2. LLM-enhanced: Use Code Model to generate smarter parameterized code
"""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from agent.history import AgentHistoryList

_logger = logging.getLogger("history_to_skill")


def _infer_param_name(name: str, text: str, existing: dict) -> str:
    """Infer a parameter name from element name and input text."""
    # Common patterns
    if any(kw in name for kw in ["搜索", "search", "关键"]):
        base = "keyword"
    elif any(kw in name for kw in ["用户名", "username", "账号"]):
        base = "username"
    elif any(kw in name for kw in ["密码", "password"]):
        base = "password"
    elif any(kw in name for kw in ["邮箱", "email"]):
        base = "email"
    elif name:
        # Use first few chars of element name as base
        base = re.sub(r'[^\w]', '_', name[:20]).strip('_').lower() or "input"
    else:
        base = "input"

    # Deduplicate
    if base not in existing:
        return base
    for i in range(2, 20):
        candidate = f"{base}_{i}"
        if candidate not in existing:
            return candidate
    return base


def history_to_playwright_lines(history: AgentHistoryList) -> list[dict[str, Any]]:
    """Extract successful actions from history as structured action records.

    Returns list of dicts with: action_type, selector, name, text, url, etc.
    Filters out failed actions and non-essential steps.
    """
    records = []
    for step in history.steps:
        for ar in step.action_results:
            if ar.error:
                continue  # Skip failed actions
            if ar.action_type in ("plan_timeout", "tab_switch", "screenshot_analysis"):
                continue  # Skip non-action steps

            record = {
                "action_type": ar.action_type,
                "url": step.browser_state.url,
                **ar.action_params,
            }
            if ar.action_type == "done":
                record["summary"] = ar.action_params.get("summary", "")
            records.append(record)
    return records


def history_to_skill_prompt(
    history: AgentHistoryList,
    skill_name: str,
    skill_desc: str,
) -> str:
    """Build a prompt for the Code Model to generate a Skill from action history.

    Includes the LLM's memory/thinking from each step for better context.
    """
    # Extract successful action sequence
    actions = history_to_playwright_lines(history)
    actions_text = json.dumps(actions, ensure_ascii=False, indent=2)

    # Collect memories for context
    memories = []
    for step in history.steps:
        if step.agent_output.memory:
            memories.append(step.agent_output.memory)

    # Infer params from type actions
    inferred_params = {}
    for a in actions:
        if a.get("action_type") == "type" and a.get("text"):
            pname = _infer_param_name(
                a.get("name", ""), a["text"], inferred_params
            )
            if pname not in inferred_params:
                inferred_params[pname] = {
                    "type": "str",
                    "description": a.get("name", pname),
                    "required": True,
                    "default_value": a["text"],
                }

    params_text = ""
    if inferred_params:
        params_text = "\n## 推断的参数\n"
        for pname, pinfo in inferred_params.items():
            params_text += f"- {pname}: {pinfo['description']} (默认值: {pinfo['default_value']})\n"

    memory_text = ""
    if memories:
        memory_text = "\n## AI 的运行记忆\n" + "\n".join(f"- {m}" for m in memories) + "\n"

    return f"""将以下浏览器操作录制转换为一个可复用的 Python Skill。

## Skill 信息
- 名称: {skill_name}
- 描述: {skill_desc}

## 用户的原始任务
{history.task}
{memory_text}{params_text}
## 录制的操作步骤（已过滤失败步骤）
```json
{actions_text[:4000]}
```

每一步记录了：action_type（操作类型）、url（当前页面URL）、selector（CSS选择器）、name（元素名称）、text（输入的文字）等。

请基于这些真实的操作步骤和选择器，生成一个完整的 Python Skill 文件。
- 参数化可变部分（如搜索关键词、输入内容等），用推断的参数名
- 保留固定的操作流程和CSS选择器
- 如果有循环/重复操作，用 for 循环处理
- 使用 resilient_click / resilient_fill 而不是直接 page.click / page.fill
- send_file 必须两个参数：await self._ws.send_file("文件名.csv", "/api/custom-csv/文件名.csv")
- send_complete 必须传摘要：await self._ws.send_complete("完成摘要")"""
