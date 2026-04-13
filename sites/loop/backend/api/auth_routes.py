"""Authentication REST API routes."""

from __future__ import annotations

from fastapi import APIRouter, Request, Response, HTTPException

import auth
import db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/check")
async def check_auth():
    """Check if the system needs initial setup (no users yet)."""
    has_users = await db.has_any_users()
    return {"needs_setup": not has_users}


@router.post("/login")
async def login(body: dict, response: Response):
    """Authenticate user and create session."""
    username = body.get("username", "").strip()
    password = body.get("password", "")

    if not username or not password:
        raise HTTPException(status_code=400, detail="请输入用户名和密码")

    user = await db.get_user_by_username(username)
    if not user or not auth.verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    if not user["is_active"]:
        raise HTTPException(status_code=403, detail="账号已被禁用，请联系管理员")

    # Create session
    token = auth.create_session(user["id"], user["username"], user["role"])
    await db.update_last_login(user["id"])
    await db.audit(user["id"], "login", f"用户 {username} 登录")

    # Set cookie
    response.set_cookie(
        key=auth.COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 3600,  # 7 days
    )

    return {
        "user": {
            "id": user["id"],
            "username": user["username"],
            "display_name": user["display_name"],
            "role": user["role"],
        },
        "token": token,  # Also return in body for WS auth
    }


@router.post("/logout")
async def logout(request: Request, response: Response):
    """Destroy session and clear cookie."""
    token = request.cookies.get(auth.COOKIE_NAME)
    if token:
        session = auth.get_session(token)
        if session:
            await db.audit(session["user_id"], "logout", f"用户 {session['username']} 登出")
        auth.destroy_session(token)

    response.delete_cookie(key=auth.COOKIE_NAME)
    return {"status": "ok"}


@router.post("/register")
async def register(body: dict):
    """Self-registration for new users."""
    username = body.get("username", "").strip()
    password = body.get("password", "")
    display_name = body.get("display_name", "")

    if not username or not password:
        raise HTTPException(status_code=400, detail="请输入用户名和密码")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="密码至少6位")

    existing = await db.get_user_by_username(username)
    if existing:
        raise HTTPException(status_code=409, detail="用户名已存在")

    new_user = await db.create_user(
        username=username,
        password_hash=auth.hash_password(password),
        display_name=display_name or username.split("@")[0],
        role="user",
    )
    await db.audit(new_user["id"], "register", f"用户 {username} 自助注册")
    return {"status": "ok", "user": new_user}


@router.get("/me")
async def get_me(request: Request):
    """Get current user info."""
    user = await auth.get_current_user(request)
    return {
        "user_id": user["user_id"],
        "username": user["username"],
        "role": user["role"],
    }
