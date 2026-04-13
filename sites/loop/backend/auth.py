"""Authentication module: password hashing + session token management.

Simple session-token approach (no JWT):
- Login creates a random token, stored in server-side dict
- Token sent as HttpOnly cookie + accepted via Authorization header
- FastAPI dependency `get_current_user` validates token
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import Request, HTTPException, WebSocket

_log = logging.getLogger("auth")

import bcrypt as _bcrypt

# In-memory session store: token -> {user_id, username, role, created_at}
_sessions: dict[str, dict] = {}

COOKIE_NAME = "session_token"


# ------------------------------------------------------------------
# Password hashing
# ------------------------------------------------------------------

def hash_password(plain: str) -> str:
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return _bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


# ------------------------------------------------------------------
# Session token management
# ------------------------------------------------------------------

def create_session(user_id: str, username: str, role: str) -> str:
    """Create a new session and return the token."""
    token = uuid.uuid4().hex
    _sessions[token] = {
        "user_id": user_id,
        "username": username,
        "role": role,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _log.info(f"Session created for {username} (token: {token[:8]}...)")
    return token


def get_session(token: str) -> Optional[dict]:
    """Look up a session by token."""
    return _sessions.get(token)


def destroy_session(token: str) -> bool:
    """Remove a session. Returns True if found."""
    return _sessions.pop(token, None) is not None


def destroy_user_sessions(user_id: str) -> int:
    """Remove all sessions for a user. Returns count removed."""
    to_remove = [t for t, s in _sessions.items() if s["user_id"] == user_id]
    for t in to_remove:
        _sessions.pop(t, None)
    return len(to_remove)


def list_sessions() -> list[dict]:
    """List all active sessions (for admin)."""
    return [{"token": t[:8] + "...", **s} for t, s in _sessions.items()]


# ------------------------------------------------------------------
# FastAPI dependencies
# ------------------------------------------------------------------

def _extract_token(request: Request) -> Optional[str]:
    """Extract session token from cookie or Authorization header."""
    # Cookie first
    token = request.cookies.get(COOKIE_NAME)
    if token:
        return token
    # Authorization header
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:]
    return None


async def get_current_user(request: Request) -> dict:
    """FastAPI dependency: require authenticated user.

    Returns dict with user_id, username, role.
    Raises 401 if not authenticated.
    """
    token = _extract_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="未登录")
    session = get_session(token)
    if not session:
        raise HTTPException(status_code=401, detail="登录已过期，请重新登录")
    return session


async def get_optional_user(request: Request) -> Optional[dict]:
    """FastAPI dependency: return user if authenticated, None otherwise.

    Used during transition period when auth is optional.
    """
    token = _extract_token(request)
    if not token:
        return None
    return get_session(token)


async def require_admin(request: Request) -> dict:
    """FastAPI dependency: require admin role."""
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="需要管理员权限")
    return user


def get_ws_user(websocket: WebSocket) -> Optional[dict]:
    """Extract and validate user from WebSocket cookies.

    Called during WS handshake. Returns None if not authenticated.
    """
    token = websocket.cookies.get(COOKIE_NAME)
    if not token:
        # Try query param
        token = websocket.query_params.get("token")
    if not token:
        return None
    return get_session(token)
