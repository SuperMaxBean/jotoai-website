"""Dynamic Skill loader: load/unload .py skill files at runtime."""

from __future__ import annotations

import importlib
import importlib.util
import logging
import sys
from pathlib import Path
from typing import Optional

import config
from services.skill_registry import _registry, list_skills

_logger = logging.getLogger("skill_loader")

CUSTOM_SKILLS_DIR = config.DATA_DIR / "custom_skills"
CUSTOM_SKILLS_DIR.mkdir(parents=True, exist_ok=True)

# Track which skills were dynamically loaded
_loaded_modules: dict[str, str] = {}  # skill_name -> module_name


def load_skill_file(path: Path) -> Optional[str]:
    """Dynamically load a .py skill file. Returns skill name if successful."""
    module_name = f"custom_skill_{path.stem}"

    try:
        spec = importlib.util.spec_from_file_location(module_name, str(path))
        if spec is None or spec.loader is None:
            _logger.error(f"Cannot create module spec for {path}")
            return None

        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        spec.loader.exec_module(module)

        skill_name = getattr(module, "_SKILL_NAME", None)
        if not skill_name:
            for attr_name in dir(module):
                obj = getattr(module, attr_name)
                if isinstance(obj, type) and hasattr(obj, "NAME") and hasattr(obj, "run"):
                    skill_name = obj.NAME
                    break

        if skill_name:
            _loaded_modules[skill_name] = module_name
            _logger.warning(f"Loaded custom skill: {skill_name} from {path.name}")
            return skill_name
        else:
            _logger.warning(f"No skill class found in {path.name}")
            del sys.modules[module_name]
            return None

    except Exception as e:
        _logger.error(f"Failed to load {path.name}: {str(e)[:100]}")
        if module_name in sys.modules:
            del sys.modules[module_name]
        return None


def unload_skill(skill_name: str) -> bool:
    """Unload a dynamically loaded skill."""
    module_name = _loaded_modules.pop(skill_name, None)
    if module_name and module_name in sys.modules:
        del sys.modules[module_name]
    if skill_name in _registry:
        del _registry[skill_name]
        _logger.warning(f"Unloaded skill: {skill_name}")
        return True
    return False


def load_all_custom_skills() -> int:
    """Load all .py files from custom_skills directory. Called at startup."""
    count = 0
    for py_file in sorted(CUSTOM_SKILLS_DIR.glob("*.py")):
        if py_file.name.startswith("_"):
            continue
        result = load_skill_file(py_file)
        if result:
            count += 1

    _logger.warning(f"Loaded {count} custom skills from {CUSTOM_SKILLS_DIR}")
    return count


def save_skill_code(skill_name: str, code: str) -> Path:
    """Save generated skill code to a .py file."""
    safe_name = skill_name.replace(" ", "_").replace("/", "_").replace("\\", "_")
    path = CUSTOM_SKILLS_DIR / f"{safe_name}.py"
    path.write_text(code, encoding="utf-8")
    return path


def get_skill_source(skill_name: str) -> Optional[str]:
    """Get the source of a skill (for download/export)."""
    # Check custom .py skills
    for py_file in CUSTOM_SKILLS_DIR.glob("*.py"):
        try:
            code = py_file.read_text(encoding="utf-8")
            if f'NAME = "{skill_name}"' in code or f"NAME = '{skill_name}'" in code:
                return code
        except Exception:
            continue

    # Check built-in skills
    services_dir = Path(__file__).parent
    for py_file in services_dir.glob("*.py"):
        try:
            code = py_file.read_text(encoding="utf-8")
            if f'NAME = "{skill_name}"' in code or f"NAME = '{skill_name}'" in code:
                return code
        except Exception:
            continue

    return None


def list_custom_skills() -> list[str]:
    """List names of custom skill files."""
    return [f.stem for f in CUSTOM_SKILLS_DIR.glob("*.py") if not f.name.startswith("_")]
