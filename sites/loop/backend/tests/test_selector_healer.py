"""Tests for selector_healer — extraction logic (no VL calls)."""

import pytest
from services.selector_healer import _extract_selector


class TestExtractSelector:
    def test_plain_class_selector(self):
        assert _extract_selector(".geek-item-v2") == ".geek-item-v2"

    def test_plain_id_selector(self):
        assert _extract_selector("#main-content") == "#main-content"

    def test_attribute_selector(self):
        assert _extract_selector('[data-id="123"]') == '[data-id="123"]'

    def test_backtick_wrapped(self):
        assert _extract_selector("新的选择器是 `.new-class`") == ".new-class"

    def test_quoted(self):
        assert _extract_selector('".new-class"') == ".new-class"

    def test_multiline_first_line(self):
        text = ".new-selector\n这是解释说明"
        assert _extract_selector(text) == ".new-selector"

    def test_complex_selector(self):
        assert _extract_selector(".chat-label-item[title*='新招呼']") == ".chat-label-item[title*='新招呼']"

    def test_garbage_returns_none(self):
        assert _extract_selector("我不确定该用什么选择器，这个页面看起来很复杂") is None

    def test_empty_returns_none(self):
        assert _extract_selector("") is None

    def test_tag_selector(self):
        assert _extract_selector("div.container") == "div.container"

    def test_backtick_in_sentence(self):
        text = "建议使用 `a.resume-btn-online` 作为选择器"
        assert _extract_selector(text) == "a.resume-btn-online"
