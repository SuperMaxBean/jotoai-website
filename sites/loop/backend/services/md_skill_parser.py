"""Parse Markdown skill files and convert recorded steps to MD format.

MD skill format:
---
name: skill_name
platform: 平台
description: 描述
params:
  keyword: { type: str, description: 搜索关键词, required: true }
---

## Steps

1. goto: https://example.com
2. fill: { selector: "#search", text: "{{keyword}}", description: 搜索框 }
3. click: { selector: "#btn", description: 搜索按钮 }
4. wait: 3
5. extract: { js: "...", limit: 5 }
6. export_csv: results.csv
"""

from __future__ import annotations

import re
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import yaml

_logger = logging.getLogger("md_skill_parser")


@dataclass
class MdStepDef:
    action: str  # goto, click, fill, wait, scroll, extract, export_csv, press
    selector: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    text: Optional[str] = None
    seconds: Optional[float] = None
    direction: Optional[str] = None
    amount: Optional[int] = None
    key: Optional[str] = None
    js: Optional[str] = None
    fields: Optional[list[str]] = None
    limit: Optional[int] = None
    filename: Optional[str] = None


@dataclass
class MdSkillDef:
    name: str
    platform: str
    description: str
    params: dict  # param_name -> {type, description, required}
    steps: list[MdStepDef]
    source_path: Optional[Path] = None


def parse_md_file(path: Path) -> MdSkillDef:
    """Parse a .md skill file into MdSkillDef."""
    content = path.read_text(encoding="utf-8")
    return parse_md_content(content, source_path=path)


def parse_md_content(content: str, source_path: Optional[Path] = None) -> MdSkillDef:
    """Parse MD content string into MdSkillDef."""
    # Split frontmatter and body
    parts = content.split("---", 2)
    if len(parts) < 3:
        raise ValueError("Invalid MD skill: missing YAML frontmatter (---)")

    frontmatter = yaml.safe_load(parts[1])
    body = parts[2]

    name = frontmatter.get("name", "")
    platform = frontmatter.get("platform", "其他")
    description = frontmatter.get("description", "")
    params = frontmatter.get("params", {})

    # Normalize params format
    normalized_params = {}
    for k, v in params.items():
        if isinstance(v, dict):
            normalized_params[k] = v
        else:
            normalized_params[k] = {"type": "str", "description": str(v), "required": False}

    steps = _parse_steps(body)

    return MdSkillDef(
        name=name,
        platform=platform,
        description=description,
        params=normalized_params,
        steps=steps,
        source_path=source_path,
    )


def _parse_steps(body: str) -> list[MdStepDef]:
    """Parse the Steps section from MD body."""
    steps = []

    # Find lines that start with a number followed by a dot
    lines = body.strip().split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        match = re.match(r"^\d+\.\s+(\w+):\s*(.*)", line)
        if not match:
            i += 1
            continue

        action = match.group(1)
        value = match.group(2).strip()

        # Check for multi-line YAML block (indented continuation lines)
        block_lines = [value] if value else []
        j = i + 1
        while j < len(lines):
            next_line = lines[j]
            # Stop if it's a new numbered step or empty after content
            if re.match(r"^\d+\.\s+", next_line.strip()):
                break
            if next_line.strip() or block_lines:
                block_lines.append(next_line.rstrip())
            j += 1

        if len(block_lines) > 1:
            # Multi-line: join and parse as YAML
            full_value = "\n".join(block_lines)
        else:
            full_value = value

        step = _parse_single_step(action, full_value)
        if step:
            steps.append(step)

        i = j if j > i + 1 else i + 1

    return steps


def _parse_single_step(action: str, value: str) -> Optional[MdStepDef]:
    """Parse a single step from action name and value string."""
    action = action.lower()

    if action == "goto":
        return MdStepDef(action="goto", url=value.strip())

    elif action == "wait":
        try:
            return MdStepDef(action="wait", seconds=float(value.strip()))
        except ValueError:
            return MdStepDef(action="wait", seconds=3.0)

    elif action == "export_csv":
        return MdStepDef(action="export_csv", filename=value.strip())

    elif action in ("click", "fill", "press", "scroll", "extract"):
        # Try parsing as YAML dict
        parsed = _try_parse_yaml_value(value)
        if isinstance(parsed, dict):
            return MdStepDef(
                action=action,
                selector=parsed.get("selector"),
                description=parsed.get("description"),
                text=parsed.get("text"),
                url=parsed.get("url"),
                seconds=parsed.get("seconds"),
                direction=parsed.get("direction"),
                amount=parsed.get("amount"),
                key=parsed.get("key"),
                js=parsed.get("js"),
                fields=parsed.get("fields"),
                limit=parsed.get("limit"),
                filename=parsed.get("filename"),
            )
        else:
            # Simple string value — treat as selector for click, text for fill
            if action == "click":
                return MdStepDef(action="click", selector=value.strip())
            elif action == "fill":
                return MdStepDef(action="fill", text=value.strip())
            elif action == "scroll":
                return MdStepDef(action="scroll", direction=value.strip() or "down", amount=3)

    return MdStepDef(action=action)


def _try_parse_yaml_value(value: str) -> dict | str:
    """Try to parse a value as YAML dict, falling back to string."""
    value = value.strip()
    if not value:
        return {}
    try:
        result = yaml.safe_load(value)
        if isinstance(result, dict):
            return result
    except yaml.YAMLError:
        pass
    return value


# --- Learning flow: convert recorded steps to MD ---

def recorded_steps_to_md(
    skill_name: str,
    skill_desc: str,
    platform: str,
    params: dict[str, dict],
    steps: list[dict],
) -> str:
    """Convert executor-recorded steps directly to MD skill format.

    No LLM needed — just serialization.
    """
    # Build frontmatter
    frontmatter = {
        "name": skill_name,
        "platform": platform or "其他",
        "description": skill_desc,
    }
    if params:
        frontmatter["params"] = params

    yaml_str = yaml.dump(frontmatter, allow_unicode=True, default_flow_style=False, sort_keys=False)

    # Build steps
    step_lines = []
    param_values = {}  # track which texts became params
    step_num = 0

    for step in steps:
        action = step.get("action", "")
        if action == "done":
            continue

        step_num += 1

        if action == "goto":
            url = step.get("target_url") or step.get("url", "")
            step_lines.append(f"{step_num}. goto: {url}")

        elif action == "click":
            sel = step.get("selector") or ""
            desc = step.get("name") or step.get("role", "")
            if sel and desc:
                step_lines.append(f'{step_num}. click: {{ selector: "{sel}", description: {desc} }}')
            elif sel:
                step_lines.append(f'{step_num}. click: {sel}')
            else:
                step_lines.append(f'{step_num}. click: {{ description: {desc} }}')

        elif action == "type":
            sel = step.get("selector") or ""
            text = step.get("text", "")
            desc = step.get("name") or ""

            # Make text a template param if it looks like user input
            param_name = _infer_param_name(desc, text, params)
            if param_name:
                display_text = "{{" + param_name + "}}"
            else:
                display_text = text

            if sel and desc:
                step_lines.append(f'{step_num}. fill: {{ selector: "{sel}", text: "{display_text}", description: {desc} }}')
            elif sel:
                step_lines.append(f'{step_num}. fill: {{ selector: "{sel}", text: "{display_text}" }}')

        elif action == "press":
            sel = step.get("selector") or ""
            key = step.get("key", "")
            desc = step.get("name") or ""
            step_lines.append(f'{step_num}. press: {{ selector: "{sel}", key: {key}, description: {desc} }}')

        elif action == "scroll":
            direction = step.get("direction", "down")
            amount = step.get("amount", 3)
            step_lines.append(f'{step_num}. scroll: {{ direction: {direction}, amount: {amount} }}')

        elif action == "wait":
            seconds = step.get("seconds", 3)
            step_lines.append(f'{step_num}. wait: {seconds}')

    # Compose final MD
    md = f"---\n{yaml_str}---\n\n## Steps\n\n"
    md += "\n".join(step_lines)
    md += "\n"

    return md


def _infer_param_name(description: str, text: str, existing_params: dict) -> Optional[str]:
    """Infer a parameter name from the element description.
    Returns the param name if text should be parameterized, None if it should be hardcoded."""
    if not text or not description:
        return None

    # If there are existing params, check if any match
    for pname in existing_params:
        if pname.lower() in description.lower():
            return pname

    # Common patterns: 搜索框 -> keyword, 收件人 -> to, 主题 -> subject, 正文 -> body
    patterns = {
        "搜索": "keyword",
        "关键": "keyword",
        "收件": "to",
        "邮箱": "email",
        "主题": "subject",
        "标题": "title",
        "正文": "body",
        "内容": "content",
        "用户名": "username",
        "密码": "password",
        "地址": "url",
    }
    for pattern, param in patterns.items():
        if pattern in description:
            return param

    return None
