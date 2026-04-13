"""Tests for CAPTCHA detection and handler logic."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from services.captcha_detector import detect_captcha, _classify_captcha_type, CaptchaInfo


@pytest.fixture
def mock_page():
    """Create a mock Playwright page."""
    page = AsyncMock()
    page.frames = []
    return page


def _make_locator(count: int, visible: bool = True):
    """Create a mock locator that returns given count and visibility."""
    locator = AsyncMock()
    locator.count = AsyncMock(return_value=count)
    locator.first = AsyncMock()
    locator.first.is_visible = AsyncMock(return_value=visible)
    return locator


class TestDetectCaptcha:
    @pytest.mark.asyncio
    async def test_no_captcha(self, mock_page):
        mock_page.locator = MagicMock(return_value=_make_locator(0))
        result = await detect_captcha(mock_page)
        assert result is None

    @pytest.mark.asyncio
    async def test_geetest_detected(self, mock_page):
        def locator_side_effect(sel):
            if sel == ".geetest_holder":
                return _make_locator(1, visible=True)
            return _make_locator(0)

        mock_page.locator = MagicMock(side_effect=locator_side_effect)
        result = await detect_captcha(mock_page)
        assert result is not None
        assert result.selector == ".geetest_holder"

    @pytest.mark.asyncio
    async def test_invisible_captcha_ignored(self, mock_page):
        mock_page.locator = MagicMock(return_value=_make_locator(1, visible=False))
        result = await detect_captcha(mock_page)
        assert result is None

    @pytest.mark.asyncio
    async def test_iframe_captcha(self, mock_page):
        mock_page.locator = MagicMock(return_value=_make_locator(0))
        frame = MagicMock()
        frame.url = "https://verify.example.com/captcha?token=abc"
        mock_page.frames = [frame]
        result = await detect_captcha(mock_page)
        assert result is not None
        assert result.captcha_type == "unknown"
        assert "captcha" in result.iframe_src


class TestClassifyCaptchaType:
    @pytest.mark.asyncio
    async def test_slider_type(self, mock_page):
        def locator_side_effect(sel):
            if sel == ".geetest_slider":
                return _make_locator(1)
            return _make_locator(0)

        mock_page.locator = MagicMock(side_effect=locator_side_effect)
        result = await _classify_captcha_type(mock_page)
        assert result == "slider"

    @pytest.mark.asyncio
    async def test_unknown_type(self, mock_page):
        mock_page.locator = MagicMock(return_value=_make_locator(0))
        result = await _classify_captcha_type(mock_page)
        assert result == "unknown"


class TestCaptchaInfo:
    def test_dataclass(self):
        info = CaptchaInfo(captcha_type="slider", selector=".geetest_holder")
        assert info.captcha_type == "slider"
        assert info.iframe_src is None

    def test_with_iframe(self):
        info = CaptchaInfo(captcha_type="unknown", selector="iframe", iframe_src="https://example.com")
        assert info.iframe_src == "https://example.com"
