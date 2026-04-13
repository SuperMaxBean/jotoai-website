"""Execute MD skill definitions using resilient browser operations.

Creates registry-compatible skill classes from MdSkillDef objects.
"""

from __future__ import annotations

import asyncio
import csv
import logging
import random
import re
from datetime import datetime
from pathlib import Path
from typing import Any

from playwright.async_api import Page

import config
from services.md_skill_parser import MdSkillDef, MdStepDef
from services.skill_registry import register_skill_class
from browser.resilient_ops import resilient_click, resilient_fill

_logger = logging.getLogger("md_skill_executor")


def _substitute_params(text: str, params: dict[str, Any]) -> str:
    """Replace {{param_name}} templates with actual values."""
    if not text:
        return text
    return re.sub(r"\{\{(\w+)\}\}", lambda m: str(params.get(m.group(1), m.group(0))), text)


def create_md_skill_class(skill_def: MdSkillDef) -> type:
    """Dynamically create a registry-compatible skill class from MdSkillDef."""

    # Build PARAMS_SCHEMA in the format the registry expects
    params_schema = {}
    for pname, pdef in skill_def.params.items():
        params_schema[pname] = {
            "type": pdef.get("type", "str"),
            "description": pdef.get("description", pname),
            "required": pdef.get("required", False),
        }

    class MdSkill:
        NAME = skill_def.name
        PLATFORM = skill_def.platform
        DESCRIPTION = skill_def.description
        PARAMS_SCHEMA = params_schema

        def __init__(self, page: Page, ws: Any) -> None:
            self._page = page
            self._ws = ws
            self._running = True
            self._extracted_data: list[dict] = []
            self._skill_def = skill_def

        def stop(self) -> None:
            self._running = False

        def pause(self) -> None:
            pass

        def resume(self) -> None:
            pass

        async def run(self, **params: Any) -> None:
            self._running = True
            self._extracted_data = []

            csv_dir = config.DATA_DIR / skill_def.name
            csv_dir.mkdir(parents=True, exist_ok=True)

            for i, step in enumerate(skill_def.steps):
                if not self._running:
                    break

                try:
                    await self._execute_step(step, params)
                except Exception as e:
                    await self._ws.send_status(f"执行出错：{str(e)[:100]}")
                    raise

                # Random delay between steps (human-like)
                if i < len(skill_def.steps) - 1:
                    await asyncio.sleep(random.uniform(1.5, 4.0))

            await self._ws.send_complete(f"{skill_def.description} 完成")

        async def _execute_step(self, step: MdStepDef, params: dict[str, Any]) -> None:
            action = step.action

            if action == "goto":
                url = _substitute_params(step.url or "", params)
                if url and not url.startswith(("http://", "https://")):
                    url = "https://" + url
                await self._page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await asyncio.sleep(2)
                await self._ws.send_status(f"已打开 {url}")

            elif action == "click":
                sel = step.selector or ""
                desc = step.description or sel
                await resilient_click(self._page, sel, desc, self._ws)
                await self._ws.send_status(f"已点击 {desc}")

            elif action == "fill":
                sel = step.selector or ""
                text = _substitute_params(step.text or "", params)
                desc = step.description or sel
                await resilient_fill(self._page, sel, text, desc, self._ws)
                await self._ws.send_status(f"已输入 {desc}: {text[:30]}")

            elif action == "press":
                sel = step.selector or ""
                key = step.key or "Enter"
                desc = step.description or sel
                try:
                    if sel:
                        await self._page.press(sel, key, timeout=5000)
                    else:
                        await self._page.keyboard.press(key)
                except Exception:
                    await self._page.keyboard.press(key)
                await self._ws.send_status(f"已按 {key}")

            elif action == "wait":
                seconds = step.seconds or 3.0
                await asyncio.sleep(seconds)

            elif action == "scroll":
                direction = step.direction or "down"
                amount = step.amount or 3
                delta = amount * 300 if direction == "down" else -amount * 300
                await self._page.evaluate(f"window.scrollBy(0, {delta})")
                await asyncio.sleep(1)

            elif action == "extract":
                js = step.js or ""
                if js:
                    data = await self._page.evaluate(js)
                    if isinstance(data, list):
                        limit = step.limit or 100
                        self._extracted_data = data[:limit]
                    elif isinstance(data, dict):
                        self._extracted_data = [data]
                    await self._ws.send_status(f"已提取 {len(self._extracted_data)} 条数据")

            elif action == "export_csv":
                filename = step.filename or f"{skill_def.name}_results.csv"
                csv_dir = config.DATA_DIR / skill_def.name
                csv_dir.mkdir(parents=True, exist_ok=True)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                csv_path = csv_dir / f"{filename.replace('.csv', '')}_{timestamp}.csv"

                if self._extracted_data:
                    keys = list(self._extracted_data[0].keys()) if self._extracted_data else []
                    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
                        writer = csv.DictWriter(f, fieldnames=keys)
                        writer.writeheader()
                        writer.writerows(self._extracted_data)

                file_url = f"/api/custom-csv/{skill_def.name}/{csv_path.name}"
                await self._ws.send_file(csv_path.name, file_url)
                await self._ws.send_status(f"已导出 {csv_path.name}")

    # Set a unique class name
    MdSkill.__name__ = f"MdSkill_{skill_def.name}"
    MdSkill.__qualname__ = f"MdSkill_{skill_def.name}"

    return MdSkill
