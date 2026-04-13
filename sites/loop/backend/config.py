import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent
PROJECT_DIR = BASE_DIR.parent

# LLM Configuration
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen3-vl-plus")

BROWSER_PROFILE_DIR = Path(os.getenv("BROWSER_PROFILE_DIR", str(BASE_DIR / "browser_profiles")))
BROWSER_PROFILE_DIR.mkdir(parents=True, exist_ok=True)

SCREENSHOT_QUALITY = int(os.getenv("SCREENSHOT_QUALITY", "60"))
SCREENSHOT_WIDTH = int(os.getenv("SCREENSHOT_WIDTH", "1280"))

MIN_ACTION_DELAY = int(os.getenv("MIN_ACTION_DELAY", "800"))
MAX_ACTION_DELAY = int(os.getenv("MAX_ACTION_DELAY", "2500"))

LOG_DIR = Path(os.getenv("LOG_DIR", str(PROJECT_DIR / "logs")))
LOG_DIR.mkdir(parents=True, exist_ok=True)

DOWNLOAD_DIR = Path(os.getenv("DOWNLOAD_DIR", str(PROJECT_DIR / "downloads")))
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)

RESUME_DIR = Path(os.getenv("RESUME_DIR", str(PROJECT_DIR / "resumes")))
RESUME_DIR.mkdir(parents=True, exist_ok=True)

CHECKPOINT_DIR = Path(os.getenv("CHECKPOINT_DIR", str(PROJECT_DIR / "checkpoints")))
CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)

SELECTOR_OVERRIDES_PATH = Path(os.getenv("SELECTOR_OVERRIDES_PATH", str(PROJECT_DIR / "data" / "selector_overrides.json")))
SELECTOR_OVERRIDES_PATH.parent.mkdir(parents=True, exist_ok=True)

CAPSOLVER_API_KEY = os.getenv("CAPSOLVER_API_KEY", "")
TWOCAPTCHA_API_KEY = os.getenv("TWOCAPTCHA_API_KEY", "")
CAPTCHA_ENABLED = os.getenv("CAPTCHA_ENABLED", "false").lower() == "true"

# Feishu (Lark) Bitable integration — runtime-mutable, persisted to JSON
FEISHU_FILE = Path(os.getenv("DATA_DIR", str(Path(__file__).parent.parent / "data"))) / "feishu.json"

def _load_feishu() -> dict:
    if FEISHU_FILE.exists():
        try:
            with open(FEISHU_FILE) as f:
                return _json.load(f)
        except Exception:
            pass
    return {"app_id": os.getenv("FEISHU_APP_ID", ""), "app_secret": os.getenv("FEISHU_APP_SECRET", "")}

def _save_feishu(data: dict) -> None:
    FEISHU_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(FEISHU_FILE, "w") as f:
        _json.dump(data, f, indent=2)

feishu: dict = _load_feishu()

# Model configuration (can be updated at runtime via API)
VL_MODEL = os.getenv("VL_MODEL", LLM_MODEL)  # Vision-Language model
VL_API_KEY = os.getenv("VL_API_KEY", LLM_API_KEY)
VL_BASE_URL = os.getenv("VL_BASE_URL", LLM_BASE_URL)

CODE_MODEL = os.getenv("CODE_MODEL", LLM_MODEL)  # Code generation model
CODE_API_KEY = os.getenv("CODE_API_KEY", LLM_API_KEY)
CODE_BASE_URL = os.getenv("CODE_BASE_URL", LLM_BASE_URL)

DATA_DIR = Path(os.getenv("DATA_DIR", str(PROJECT_DIR / "data")))
DATA_DIR.mkdir(parents=True, exist_ok=True)
SCHEDULER_FILE = DATA_DIR / "schedules.json"

DEFAULT_REPLY = os.getenv("DEFAULT_REPLY", "你好，感谢关注我们的职位！")

# ---------------------------------------------------------------------------
# Anti-fraud / humanization config (runtime-mutable, persisted to JSON)
# ---------------------------------------------------------------------------
import json as _json

ANTIFRAUD_FILE = DATA_DIR / "antifraud.json"

_ANTIFRAUD_DEFAULTS: dict = {
    "min_delay": 15,          # seconds — min wait between skill actions
    "max_delay": 180,         # seconds — max wait between skill actions
    "pause_prob": 10,         # percent — chance of a long extra pause
    "stealth_enabled": True,  # inject stealth.min.js
    "mouse_trace": True,      # human-like mouse trajectory simulation
}


def _load_antifraud() -> dict:
    if ANTIFRAUD_FILE.exists():
        try:
            with open(ANTIFRAUD_FILE) as f:
                stored = _json.load(f)
            # Merge with defaults so new keys are always present
            return {**_ANTIFRAUD_DEFAULTS, **stored}
        except Exception:
            pass
    return dict(_ANTIFRAUD_DEFAULTS)


def _save_antifraud(data: dict) -> None:
    with open(ANTIFRAUD_FILE, "w") as f:
        _json.dump(data, f, indent=2)


# Runtime-mutable dict; all humanize.py functions read from this.
antifraud: dict = _load_antifraud()
