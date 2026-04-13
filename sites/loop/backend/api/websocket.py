from __future__ import annotations

import json
import asyncio
from typing import Any
from fastapi import WebSocket, WebSocketDisconnect


class ConnectionManager:
    """Manages multiple WebSocket connections for the same user/sandbox."""

    def __init__(self) -> None:
        self._connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket, already_accepted: bool = False) -> None:
        if not already_accepted:
            await websocket.accept()
        self._connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._connections:
            self._connections.remove(websocket)

    @property
    def is_connected(self) -> bool:
        return len(self._connections) > 0

    async def send(self, msg_type: str, **kwargs: Any) -> None:
        if not self._connections:
            return
        payload = {"type": msg_type, **kwargs}
        dead: list[WebSocket] = []
        for ws in self._connections:
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            if ws in self._connections:
                self._connections.remove(ws)

    async def send_status(self, content: str) -> None:
        await self.send("status", content=content)

    async def send_screenshot(self, data_b64: str) -> None:
        await self.send("screenshot", data=data_b64)

    async def send_action_log(self, action: str, target: str, status: str) -> None:
        await self.send("action_log", action=action, target=target, status=status)

    async def send_thinking(self, content: str) -> None:
        await self.send("thinking", content=content)

    async def send_file(self, filename: str, url: str) -> None:
        await self.send("file", filename=filename, url=url)

    async def send_complete(self, summary: str) -> None:
        await self.send("complete", summary=summary)

    async def send_error(self, message: str) -> None:
        await self.send("error", message=message)

    async def send_login_required(self, message: str) -> None:
        await self.send("login_required", message=message)

    async def send_tabs(self, tabs: list[dict], active_index: int) -> None:
        await self.send("tabs", tabs=tabs, active_index=active_index)

    async def receive_json(self, websocket: WebSocket) -> dict:
        """Receive from a specific WebSocket connection."""
        try:
            return await websocket.receive_json()
        except RuntimeError:
            raise WebSocketDisconnect()


manager = ConnectionManager()
