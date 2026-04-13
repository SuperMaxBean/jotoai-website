"""Admin REST API routes — user management, session monitoring, audit logs."""

from __future__ import annotations

import os
import psutil
from fastapi import APIRouter, Request, HTTPException, Depends

import auth
import db

router = APIRouter(prefix="/api/admin", tags=["admin"])


async def _require_admin(request: Request):
    """Dependency: require admin role."""
    return await auth.require_admin(request)


# ------------------------------------------------------------------
# User management
# ------------------------------------------------------------------

@router.get("/users")
async def list_users(user=Depends(_require_admin)):
    users = await db.list_users()
    return {"users": users}


@router.post("/users")
async def create_user(body: dict, user=Depends(_require_admin)):
    username = body.get("username", "").strip()
    password = body.get("password", "")
    display_name = body.get("display_name", "")
    role = body.get("role", "user")

    if not username or not password:
        raise HTTPException(400, "用户名和密码不能为空")
    if role not in ("admin", "user"):
        raise HTTPException(400, "角色必须是 admin 或 user")
    if len(password) < 6:
        raise HTTPException(400, "密码至少6位")

    existing = await db.get_user_by_username(username)
    if existing:
        raise HTTPException(409, "用户名已存在")

    new_user = await db.create_user(
        username=username,
        password_hash=auth.hash_password(password),
        display_name=display_name or username.split("@")[0],
        role=role,
    )
    await db.audit(user["user_id"], "admin.create_user", f"创建用户 {username} (role={role})")
    return new_user


@router.put("/users/{user_id}")
async def update_user(user_id: str, body: dict, user=Depends(_require_admin)):
    target = await db.get_user_by_id(user_id)
    if not target:
        raise HTTPException(404, "用户不存在")

    updates = {}
    if "display_name" in body:
        updates["display_name"] = body["display_name"]
    if "role" in body and body["role"] in ("admin", "user"):
        updates["role"] = body["role"]
    if "is_active" in body:
        updates["is_active"] = 1 if body["is_active"] else 0
    if "password" in body and body["password"]:
        if len(body["password"]) < 6:
            raise HTTPException(400, "密码至少6位")
        updates["password_hash"] = auth.hash_password(body["password"])

    if updates:
        await db.update_user(user_id, **updates)
        detail = ", ".join(f"{k}={v}" for k, v in updates.items() if k != "password_hash")
        if "password_hash" in updates:
            detail += ", password=***"
            # Invalidate all sessions for this user
            auth.destroy_user_sessions(user_id)
        await db.audit(user["user_id"], "admin.update_user", f"更新用户 {target['username']}: {detail}")

    return {"status": "ok"}


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, user=Depends(_require_admin)):
    if user_id == user["user_id"]:
        raise HTTPException(400, "不能删除自己")

    target = await db.get_user_by_id(user_id)
    if not target:
        raise HTTPException(404, "用户不存在")

    # Kill session if active
    from services.session_manager import session_manager
    await session_manager.destroy(user_id)
    auth.destroy_user_sessions(user_id)
    await db.delete_user(user_id)
    await db.audit(user["user_id"], "admin.delete_user", f"删除用户 {target['username']}")
    return {"status": "ok"}


# ------------------------------------------------------------------
# Session monitoring
# ------------------------------------------------------------------

@router.get("/sessions")
async def list_sessions(user=Depends(_require_admin)):
    from services.session_manager import session_manager
    sessions = session_manager.list_active()
    # Enrich with username
    for s in sessions:
        u = await db.get_user_by_id(s["user_id"])
        s["username"] = u["username"] if u else "unknown"
    return {"sessions": sessions}


@router.post("/sessions/{user_id}/kill")
async def kill_session(user_id: str, user=Depends(_require_admin)):
    from services.session_manager import session_manager
    target = await db.get_user_by_id(user_id)
    await session_manager.destroy(user_id)
    await db.audit(user["user_id"], "admin.kill_session",
                   f"终止 {target['username'] if target else user_id} 的会话")
    return {"status": "ok"}


# ------------------------------------------------------------------
# Audit log
# ------------------------------------------------------------------

@router.get("/audit")
async def get_audit(limit: int = 100, offset: int = 0, user_id: str = "",
                    action: str = "", admin=Depends(_require_admin)):
    logs = await db.get_audit_logs(limit=limit, offset=offset, user_id=user_id, action=action)
    return {"logs": logs}


# ------------------------------------------------------------------
# System info
# ------------------------------------------------------------------

@router.get("/system")
async def get_system_info(user=Depends(_require_admin)):
    from services.session_manager import session_manager
    from services.display_manager import display_manager

    mem = psutil.virtual_memory()
    return {
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "memory": {
            "total_gb": round(mem.total / 1e9, 1),
            "used_gb": round(mem.used / 1e9, 1),
            "percent": mem.percent,
        },
        "sessions": {
            "active": len(session_manager.list_active()),
            "max": display_manager._max,
        },
        "uptime_hours": round((psutil.time.time() - psutil.boot_time()) / 3600, 1),
    }
