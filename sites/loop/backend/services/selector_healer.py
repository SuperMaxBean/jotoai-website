"""VL-powered selector self-healing.

When a CSS selector fails (returns 0 elements), this module:
1. Takes a screenshot of the current page
2. Sends it to the VL model with context about what we're looking for
3. VL suggests a new CSS selector
4. We validate it and save to SelectorStore if it works
"""

from __future__ import annotations

import logging
import re

from openai import OpenAI
from playwright.async_api import Page

import config
from utils.screenshot import capture_screenshot
from services.selector_store import selector_store

logger = logging.getLogger(__name__)

HEAL_PROMPT = """你是一个网页自动化专家。页面上的 CSS 选择器 `{original}` 不再有效（找不到元素）。

这个选择器用于: {description}

请分析截图，找到对应的页面元素，给出一个新的 CSS 选择器。

要求：
1. 只返回一个 CSS 选择器字符串，不要其他内容
2. 选择器要尽可能稳定（优先用 class、data-* 属性，避免用序号）
3. 确保选择器能匹配到目标元素

直接返回选择器，例如: .new-class-name"""

# Description for each selector key
SELECTOR_DESCRIPTIONS: dict[str, str] = {
    "candidate": "候选人列表中的每一项(候选人卡片)",
    "name": "候选人的姓名",
    "badge": "未读消息数量徽标",
    "filter_new": "筛选[新招呼]的标签按钮",
    "filter_resume": "筛选[已获取简历]的标签按钮",
    "chat_input": "聊天输入框(contenteditable)",
    "send_btn": "发送消息按钮",
    "resume_btn_online": "在线简历按钮(查看在线简历)",
    "resume_btn_file": "附件简历按钮(查看/下载附件简历)",
    "source_job": "候选人来源的职位名称",
    "request_resume": "求简历操作按钮",
    "msg_friend": "对方发送的聊天消息文本",
}


def _get_vl_client() -> tuple[OpenAI, str]:
    return OpenAI(api_key=config.LLM_API_KEY, base_url=config.LLM_BASE_URL), config.LLM_MODEL


def _extract_selector(text: str) -> str | None:
    """Extract a CSS selector from VL response text."""
    text = text.strip()
    if not text:
        return None

    # Try to find selector in backticks first (most reliable)
    match = re.search(r'`([^`]+)`', text)
    if match:
        return match.group(1).strip()

    # CSS selector pattern: starts with . # [ or tag name (a-z)
    _sel_re = r'^[.#\[a-zA-Z][^\s]*(\s*[>~+]\s*[^\s]+)*$'

    # If the whole text looks like a single selector
    if re.match(_sel_re, text) and len(text) < 200:
        return text.strip('`" \n')

    # Try first line if it looks like a selector
    first_line = text.split('\n')[0].strip('`" ')
    if re.match(_sel_re, first_line) and len(first_line) < 200:
        return first_line

    return None


async def heal_selector(
    page: Page,
    selector_key: str,
    original_selector: str,
    max_retries: int = 2,
) -> str | None:
    """Try to heal a broken selector using VL model.

    Returns the new selector if successful, None if healing failed.
    """
    description = SELECTOR_DESCRIPTIONS.get(selector_key, selector_key)

    for attempt in range(max_retries):
        try:
            b64 = await capture_screenshot(page)

            client, model = _get_vl_client()
            prompt = HEAL_PROMPT.format(original=original_selector, description=description)

            response = client.chat.completions.create(
                model=model,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                    ],
                }],
                max_tokens=200,
            )

            raw = response.choices[0].message.content or ""
            new_selector = _extract_selector(raw)

            if not new_selector:
                logger.warning(f"Heal attempt {attempt+1}: could not extract selector from: {raw[:100]}")
                continue

            # Validate: does the new selector find elements?
            count = await page.locator(new_selector).count()
            if count > 0:
                selector_store.set_override(selector_key, new_selector)
                logger.info(f"Healed selector '{selector_key}': '{original_selector}' -> '{new_selector}' ({count} elements)")
                return new_selector
            else:
                logger.warning(f"Heal attempt {attempt+1}: selector '{new_selector}' found 0 elements")

        except Exception as e:
            logger.error(f"Heal attempt {attempt+1} failed: {str(e)[:100]}")

    logger.error(f"Failed to heal selector '{selector_key}' after {max_retries} attempts")
    return None
