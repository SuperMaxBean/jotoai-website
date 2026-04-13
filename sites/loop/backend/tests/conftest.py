"""Shared test fixtures and mocks for missing dependencies."""

import sys
from unittest.mock import MagicMock

# Mock heavy dependencies that aren't installed locally
for mod in [
    "openai",
    "patchright", "patchright.async_api",
    "humanization_playwright",
    "zhipuai",
    "PIL", "PIL.Image",
]:
    sys.modules.setdefault(mod, MagicMock())
