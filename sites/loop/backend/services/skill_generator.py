"""AI Skill Generator: generate browser automation Skills from natural language.

Uses two models:
1. VL model — navigates to target site, takes screenshot, analyzes DOM structure
2. Code model — generates Python code based on real DOM selectors
"""

from __future__ import annotations

import logging
import re
from typing import Any, Optional

from openai import OpenAI
from playwright.async_api import Page

import config
from utils.screenshot import capture_screenshot

_logger = logging.getLogger("skill_generator")

SKILL_TEMPLATE = '''"""[描述]"""

from __future__ import annotations

import asyncio
import csv
import random
from datetime import datetime
from pathlib import Path
from typing import Optional

from playwright.async_api import Page

import config
from api.websocket import ConnectionManager
from services.skill_registry import register_skill
from browser.resilient_ops import resilient_click, resilient_fill

CSV_DIR = config.DATA_DIR / "[skill_name]"


@register_skill
class [ClassName]:
    """[描述]"""

    NAME = "[skill_name]"
    PLATFORM = "[平台名称，如：知乎、小红书、微博等]"
    DESCRIPTION = "[中文描述]"
    PARAMS_SCHEMA = {
        "param1": {"type": "str", "description": "参数说明", "required": True},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True

    def stop(self) -> None:
        self._running = False

    async def run(self, **params) -> None:
        self._running = True
        CSV_DIR.mkdir(parents=True, exist_ok=True)
        # ... 实现逻辑
        # 导出 CSV 示例:
        # csv_filename = f"result_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        # csv_path = CSV_DIR / csv_filename
        # await self._ws.send_file(csv_filename, f"/api/custom-csv/{csv_filename}")
        # await self._ws.send_complete("任务完成摘要")
'''

CODE_SYSTEM_PROMPT = """你是一个浏览器自动化 Skill 代码生成器。

## 任务
根据用户需求和目标网站的真实 DOM 结构，生成完整的 Python Skill 文件。

## 严格规则
1. 必须有 @register_skill 装饰器
2. NAME 用英文小写+下划线
3. 操作之间加 asyncio.sleep(random.uniform(2, 5))
4. 用 self._ws.send_status() 报告进度
5. 发送CSV下载链接必须用两个参数：`await self._ws.send_file("文件名.csv", "/api/custom-csv/文件名.csv")`，第一个是文件名，第二个是URL路径
6. 报告完成：`await self._ws.send_complete("完成摘要")`
7. CSV 用 utf-8-sig 编码
8. 抓取数据用 page.evaluate() 执行 JS
9. 只输出 Python 代码，不要解释文字
10. CSS 选择器必须基于提供的真实 DOM 结构
11. 【重要】点击元素必须用 `await resilient_click(self._page, "selector", "元素描述", self._ws)` 代替 `await self._page.click()`
12. 【重要】填写输入框必须用 `await resilient_fill(self._page, "selector", text, "元素描述", self._ws)` 代替 `await self._page.fill()`
13. 每个 resilient_click/resilient_fill 的第三个参数（description）必须是中文语义描述，例如 "写信按钮"、"收件人输入框"、"发送按钮"
14. 必须 import: `from browser.resilient_ops import resilient_click, resilient_fill`

## 代码模板
""" + SKILL_TEMPLATE

DOM_ANALYSIS_PROMPT = """分析这个网页截图和 DOM 结构。
我需要完成这个任务：{task}

请告诉我：
1. 页面上哪些元素是我需要操作的（搜索框、按钮、列表等）
2. 这些元素的 CSS 选择器是什么
3. 数据在哪些 DOM 元素里，选择器是什么
4. 是否需要翻页，翻页按钮的选择器
5. 是否需要滚动加载

用 JSON 格式返回，例如：
{
  "search_input": "#search-input",
  "search_button": ".btn-search",
  "data_items": ".item-card",
  "data_fields": {
    "title": ".item-title",
    "price": ".item-price"
  },
  "next_page": ".next-btn",
  "needs_scroll": false
}
"""


def _get_vl_client():
    return OpenAI(api_key=config.VL_API_KEY, base_url=config.VL_BASE_URL), config.VL_MODEL


def _get_code_client():
    return OpenAI(api_key=config.CODE_API_KEY, base_url=config.CODE_BASE_URL), config.CODE_MODEL


def _extract_code(text: str) -> str:
    match = re.search(r'```(?:python)?\s*\n(.*?)```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return text.strip()


def _extract_json(text: str) -> str:
    match = re.search(r'```(?:json)?\s*\n(.*?)```', text, re.DOTALL)
    if match:
        return match.group(1).strip()
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text


async def analyze_page(page: Page, task: str) -> dict:
    """Navigate to target site, screenshot, and analyze DOM with VL model."""
    # Take screenshot
    b64 = await capture_screenshot(page)

    # Get simplified DOM structure
    dom_summary = await page.evaluate("""() => {
        const walk = (el, depth) => {
            if (depth > 4 || !el || !el.tagName) return '';
            const tag = el.tagName.toLowerCase();
            const cls = (el.className || '').toString().trim().slice(0, 60);
            const id = el.id || '';
            const text = (el.textContent || '').trim().slice(0, 30);
            const vis = el.offsetWidth > 0;
            if (!vis) return '';
            const indent = '  '.repeat(depth);
            let line = `${indent}<${tag}`;
            if (id) line += ` id="${id}"`;
            if (cls) line += ` class="${cls}"`;
            if (text && el.children.length === 0) line += ` text="${text}"`;
            line += '>\\n';
            if (depth < 3) {
                for (const child of el.children) {
                    line += walk(child, depth + 1);
                }
            }
            return line;
        };
        return walk(document.body, 0).slice(0, 5000);
    }""")

    # Send to VL model
    client, model = _get_vl_client()
    prompt = DOM_ANALYSIS_PROMPT.format(task=task)

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": f"{prompt}\n\n## DOM 结构:\n```\n{dom_summary}\n```"},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                ],
            }],
            max_tokens=2000,
        )
        raw = response.choices[0].message.content or ""
        return {"dom_summary": dom_summary[:2000], "vl_analysis": raw, "screenshot": True}
    except Exception as e:
        _logger.error(f"VL analysis failed: {str(e)[:100]}")
        return {"dom_summary": dom_summary[:2000], "vl_analysis": "", "screenshot": False}


async def generate_skill(
    user_prompt: str,
    page: Optional[Page] = None,
    url: str = "",
    conversation: list[dict] | None = None,
    analyze_current_page: bool = False,
) -> str:
    """Generate a Skill from natural language.

    If page is provided, navigates to URL, screenshots, analyzes DOM first.
    If analyze_current_page is True, skips navigation but still analyzes the
    current page (useful after user has manually logged in).
    """
    dom_context = ""

    # Step 1: If page available, navigate and analyze
    should_analyze = (page and url) or (page and analyze_current_page)
    if should_analyze:
        try:
            if url and not analyze_current_page:
                await page.goto(url, wait_until="domcontentloaded", timeout=20000)
                import asyncio
                await asyncio.sleep(3)
            analysis = await analyze_page(page, user_prompt)
            dom_context = f"""
## 目标网站真实 DOM 结构
```
{analysis['dom_summary']}
```

## VL 模型分析结果
{analysis['vl_analysis']}
"""
        except Exception as e:
            _logger.warning(f"Page analysis failed: {str(e)[:80]}")

    # Step 2: Generate code with Code model
    client, model = _get_code_client()

    messages = [{"role": "system", "content": CODE_SYSTEM_PROMPT}]

    if conversation:
        for msg in conversation:
            messages.append(msg)

    full_prompt = f"""## 用户需求
{user_prompt}
{dom_context}

请生成完整的 Python Skill 文件代码。"""

    messages.append({"role": "user", "content": full_prompt})

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=4000,
            temperature=0.3,
        )
        raw = response.choices[0].message.content or ""
        code = _extract_code(raw)
        return code
    except Exception as e:
        _logger.error(f"Code generation failed: {str(e)[:100]}")
        raise
