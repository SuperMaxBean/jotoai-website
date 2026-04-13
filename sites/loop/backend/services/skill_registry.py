"""Skill registry: discover, list, and instantiate Skills."""

from __future__ import annotations

from typing import Any, Type


class SkillMeta:
    """Metadata for a registered skill."""

    def __init__(self, name: str, description: str, params_schema: dict[str, dict],
                 platform: str, cls: Type) -> None:
        self.name = name
        self.description = description
        self.params_schema = params_schema
        self.platform = platform
        self.cls = cls


_registry: dict[str, SkillMeta] = {}


def register_skill(cls: Type) -> Type:
    """Decorator: register a Skill class by its NAME attribute."""
    meta = SkillMeta(
        name=cls.NAME,
        description=cls.DESCRIPTION,
        params_schema=cls.PARAMS_SCHEMA,
        platform=getattr(cls, "PLATFORM", "其他"),
        cls=cls,
    )
    _registry[cls.NAME] = meta
    return cls


def list_skills() -> list[dict[str, Any]]:
    """Return metadata for all registered skills."""
    return [
        {
            "name": m.name,
            "description": m.description,
            "params_schema": m.params_schema,
            "platform": m.platform,
        }
        for m in _registry.values()
    ]


def register_skill_class(cls: Type) -> None:
    """Register a skill class programmatically (for MD skills)."""
    register_skill(cls)


def get_skill_class(name: str) -> Type | None:
    """Get a skill class by name."""
    meta = _registry.get(name)
    return meta.cls if meta else None


def get_skill_meta(name: str) -> SkillMeta | None:
    return _registry.get(name)
