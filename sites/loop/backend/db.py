"""SQLite database for user management and audit logging.

Uses aiosqlite for async access. Database file: data/browserskill.db
WAL mode for better concurrent read performance.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import aiosqlite

import config

_log = logging.getLogger("db")

DB_PATH = config.DATA_DIR / "browserskill.db"

_SCHEMA = """
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'user',
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    detail TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
"""

# Default admin account
_DEFAULT_ADMIN_USERNAME = "tomi@jototech.cn"
_DEFAULT_ADMIN_PASSWORD = "!QAZxsw2"


async def _get_db() -> aiosqlite.Connection:
    """Get a database connection with WAL mode."""
    db = await aiosqlite.connect(str(DB_PATH))
    await db.execute("PRAGMA journal_mode=WAL")
    db.row_factory = aiosqlite.Row
    return db


async def init_db() -> None:
    """Initialize database schema and seed admin account if needed."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    db = await _get_db()
    try:
        await db.executescript(_SCHEMA)
        await db.commit()

        # Seed admin if no users exist
        cursor = await db.execute("SELECT COUNT(*) as cnt FROM users")
        row = await cursor.fetchone()
        if row[0] == 0:
            from auth import hash_password
            now = datetime.now(timezone.utc).isoformat()
            await db.execute(
                "INSERT INTO users (id, username, password_hash, display_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (str(uuid.uuid4()), _DEFAULT_ADMIN_USERNAME, hash_password(_DEFAULT_ADMIN_PASSWORD), "Admin", "admin", now),
            )
            await db.commit()
            _log.warning(f"Created default admin account: {_DEFAULT_ADMIN_USERNAME}")
    finally:
        await db.close()


# ------------------------------------------------------------------
# User CRUD
# ------------------------------------------------------------------

async def get_user_by_username(username: str) -> Optional[dict]:
    db = await _get_db()
    try:
        cursor = await db.execute("SELECT * FROM users WHERE username = ?", (username,))
        row = await cursor.fetchone()
        return dict(row) if row else None
    finally:
        await db.close()


async def get_user_by_id(user_id: str) -> Optional[dict]:
    db = await _get_db()
    try:
        cursor = await db.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = await cursor.fetchone()
        return dict(row) if row else None
    finally:
        await db.close()


async def list_users() -> list[dict]:
    db = await _get_db()
    try:
        cursor = await db.execute("SELECT id, username, display_name, role, is_active, created_at, last_login_at FROM users ORDER BY created_at")
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        await db.close()


async def create_user(username: str, password_hash: str, display_name: str = "", role: str = "user") -> dict:
    db = await _get_db()
    try:
        user_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        await db.execute(
            "INSERT INTO users (id, username, password_hash, display_name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, username, password_hash, display_name, role, now),
        )
        await db.commit()
        return {"id": user_id, "username": username, "display_name": display_name, "role": role}
    finally:
        await db.close()


async def update_user(user_id: str, **fields) -> bool:
    db = await _get_db()
    try:
        sets = []
        vals = []
        for k, v in fields.items():
            if k in ("username", "password_hash", "display_name", "role", "is_active", "last_login_at"):
                sets.append(f"{k} = ?")
                vals.append(v)
        if not sets:
            return False
        vals.append(user_id)
        await db.execute(f"UPDATE users SET {', '.join(sets)} WHERE id = ?", vals)
        await db.commit()
        return True
    finally:
        await db.close()


async def delete_user(user_id: str) -> bool:
    db = await _get_db()
    try:
        cursor = await db.execute("DELETE FROM users WHERE id = ?", (user_id,))
        await db.commit()
        return cursor.rowcount > 0
    finally:
        await db.close()


async def update_last_login(user_id: str) -> None:
    now = datetime.now(timezone.utc).isoformat()
    await update_user(user_id, last_login_at=now)


async def has_any_users() -> bool:
    db = await _get_db()
    try:
        cursor = await db.execute("SELECT COUNT(*) FROM users")
        row = await cursor.fetchone()
        return row[0] > 0
    finally:
        await db.close()


# ------------------------------------------------------------------
# Audit log
# ------------------------------------------------------------------

async def audit(user_id: Optional[str], action: str, detail: str = "") -> None:
    """Record an audit log entry."""
    db = await _get_db()
    try:
        now = datetime.now(timezone.utc).isoformat()
        await db.execute(
            "INSERT INTO audit_log (user_id, action, detail, created_at) VALUES (?, ?, ?, ?)",
            (user_id, action, detail, now),
        )
        await db.commit()
    except Exception as e:
        _log.error(f"Audit log failed: {e}")
    finally:
        await db.close()


async def get_audit_logs(limit: int = 100, offset: int = 0, user_id: str = "", action: str = "") -> list[dict]:
    db = await _get_db()
    try:
        query = "SELECT a.*, u.username FROM audit_log a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1"
        params: list = []
        if user_id:
            query += " AND a.user_id = ?"
            params.append(user_id)
        if action:
            query += " AND a.action = ?"
            params.append(action)
        query += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?"
        params.extend([limit, offset])
        cursor = await db.execute(query, params)
        rows = await cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        await db.close()
