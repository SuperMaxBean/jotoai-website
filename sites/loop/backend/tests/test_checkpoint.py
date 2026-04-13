"""Tests for CheckpointManager."""

import json
import pytest
from pathlib import Path
from services.checkpoint import CheckpointManager


@pytest.fixture
def tmp_checkpoint_dir(tmp_path, monkeypatch):
    """Override CHECKPOINT_DIR to a temp directory."""
    import config
    monkeypatch.setattr(config, "CHECKPOINT_DIR", tmp_path)
    return tmp_path


class TestCheckpointManager:
    def test_new_checkpoint_is_empty(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        assert ckpt.count() == 0
        assert ckpt.processed_ids == []

    def test_mark_processed(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        ckpt.mark_processed("id_1")
        assert ckpt.is_processed("id_1")
        assert not ckpt.is_processed("id_2")
        assert ckpt.count() == 1

    def test_mark_processed_is_idempotent(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        ckpt.mark_processed("id_1")
        ckpt.mark_processed("id_1")
        assert ckpt.count() == 1

    def test_persists_across_instances(self, tmp_checkpoint_dir):
        ckpt1 = CheckpointManager("test_skill")
        ckpt1.mark_processed("id_1")
        ckpt1.mark_processed("id_2")

        # New instance reads from disk
        ckpt2 = CheckpointManager("test_skill")
        assert ckpt2.is_processed("id_1")
        assert ckpt2.is_processed("id_2")
        assert ckpt2.count() == 2

    def test_reset_clears_all(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        ckpt.mark_processed("id_1")
        ckpt.mark_processed("id_2")
        ckpt.reset()
        assert ckpt.count() == 0
        assert not ckpt.is_processed("id_1")

    def test_reset_persists(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        ckpt.mark_processed("id_1")
        ckpt.reset()

        ckpt2 = CheckpointManager("test_skill")
        assert ckpt2.count() == 0

    def test_separate_skills_have_separate_checkpoints(self, tmp_checkpoint_dir):
        ckpt_a = CheckpointManager("skill_a")
        ckpt_b = CheckpointManager("skill_b")
        ckpt_a.mark_processed("id_1")
        assert ckpt_a.is_processed("id_1")
        assert not ckpt_b.is_processed("id_1")

    def test_corrupted_file_recovers(self, tmp_checkpoint_dir):
        path = tmp_checkpoint_dir / "broken_skill.json"
        path.write_text("not valid json{{{", encoding="utf-8")
        ckpt = CheckpointManager("broken_skill")
        assert ckpt.count() == 0
        # Can still work normally after corruption
        ckpt.mark_processed("id_1")
        assert ckpt.is_processed("id_1")

    def test_file_has_last_updated(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        ckpt.mark_processed("id_1")
        data = json.loads((tmp_checkpoint_dir / "test_skill.json").read_text())
        assert "last_updated" in data
        assert data["last_updated"] != ""

    def test_multiple_ids(self, tmp_checkpoint_dir):
        ckpt = CheckpointManager("test_skill")
        ids = [f"id_{i}" for i in range(50)]
        for boss_id in ids:
            ckpt.mark_processed(boss_id)
        assert ckpt.count() == 50
        for boss_id in ids:
            assert ckpt.is_processed(boss_id)
