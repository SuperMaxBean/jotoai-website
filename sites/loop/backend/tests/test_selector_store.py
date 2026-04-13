"""Tests for SelectorStore."""

import json
import pytest
from pathlib import Path
from services.selector_store import SelectorStore, DEFAULT_SELECTORS


@pytest.fixture
def store(tmp_path):
    path = tmp_path / "overrides.json"
    return SelectorStore(path=path)


class TestSelectorStore:
    def test_get_default(self, store):
        assert store.get("candidate") == ".geek-item"
        assert store.get("name") == ".geek-name"

    def test_get_unknown_key_returns_empty(self, store):
        assert store.get("nonexistent") == ""

    def test_set_override(self, store):
        store.set_override("candidate", ".new-geek-item")
        assert store.get("candidate") == ".new-geek-item"

    def test_override_persists(self, tmp_path):
        path = tmp_path / "overrides.json"
        store1 = SelectorStore(path=path)
        store1.set_override("candidate", ".v2-geek")

        store2 = SelectorStore(path=path)
        assert store2.get("candidate") == ".v2-geek"

    def test_remove_override(self, store):
        store.set_override("candidate", ".new")
        store.remove_override("candidate")
        assert store.get("candidate") == ".geek-item"

    def test_remove_nonexistent_override(self, store):
        store.remove_override("candidate")  # no error
        assert store.get("candidate") == ".geek-item"

    def test_list_all(self, store):
        store.set_override("name", ".new-name")
        all_selectors = store.list_all()
        assert all_selectors["name"]["current"] == ".new-name"
        assert all_selectors["name"]["default"] == ".geek-name"
        assert all_selectors["name"]["overridden"] is True
        assert all_selectors["candidate"]["overridden"] is False

    def test_list_overrides(self, store):
        assert store.list_overrides() == {}
        store.set_override("name", ".new")
        overrides = store.list_overrides()
        assert "name" in overrides
        assert overrides["name"]["selector"] == ".new"

    def test_corrupted_file_recovers(self, tmp_path):
        path = tmp_path / "bad.json"
        path.write_text("{invalid json", encoding="utf-8")
        store = SelectorStore(path=path)
        assert store.get("candidate") == ".geek-item"

    def test_override_stores_original(self, store):
        store.set_override("candidate", ".new")
        overrides = store.list_overrides()
        assert overrides["candidate"]["original"] == ".geek-item"

    def test_all_defaults_exist(self, store):
        for key in DEFAULT_SELECTORS:
            assert store.get(key) != "", f"Default missing for {key}"
