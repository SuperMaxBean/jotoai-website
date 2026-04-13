"""File download management for browser-initiated downloads."""

from __future__ import annotations

from pathlib import Path
from datetime import datetime

from playwright.async_api import Page, Download

import config
from api.websocket import ConnectionManager


class FileManager:
    """Handles browser file downloads and pushes them to the frontend.

    When the browser triggers a download (e.g. user clicks a resume
    download button on BOSS直聘), this manager:
    1. Saves the file to the downloads directory
    2. Sends a notification to the frontend via WebSocket
    3. The user can then download the file from the chat panel
    """

    def __init__(self, page: Page, ws_manager: ConnectionManager) -> None:
        self._page = page
        self._ws = ws_manager
        self._page.on("download", self._on_download)

    async def _on_download(self, download: Download) -> None:
        """Handle a download event from the browser."""
        try:
            filename = download.suggested_filename or "download"

            # Avoid overwriting: add timestamp if file exists
            save_path = config.DOWNLOAD_DIR / filename
            if save_path.exists():
                stem = save_path.stem
                suffix = save_path.suffix
                ts = datetime.now().strftime("%H%M%S")
                filename = f"{stem}_{ts}{suffix}"
                save_path = config.DOWNLOAD_DIR / filename

            await download.save_as(str(save_path))

            # Push file notification to frontend
            download_url = f"/downloads/{filename}"
            await self._ws.send_file(filename, download_url)
            await self._ws.send_status(f"文件已下载: {filename}")

        except Exception as e:
            await self._ws.send_error(f"下载失败: {str(e)[:100]}")
