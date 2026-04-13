"""MCP Server for BrowserAgent resume data and skill execution."""

from __future__ import annotations

import asyncio
import base64
import json
from pathlib import Path
from typing import Any

import httpx
from mcp.server import Server
from mcp.server.stdio import run_stdio
from mcp.types import Tool, TextContent

# Config — same paths as backend/config.py
BASE_DIR = Path(__file__).parent
PROJECT_DIR = BASE_DIR.parent
RESUME_DIR = PROJECT_DIR / "resumes"
QA_FILE = RESUME_DIR / "qa_records.json"
INDEX_FILE = RESUME_DIR / "index.json"
BACKEND_URL = "http://127.0.0.1:8000"

server = Server("browser-agent-resumes")


def _load_index() -> list[dict]:
    if INDEX_FILE.exists():
        return json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    return []


def _load_qa() -> list[dict]:
    if QA_FILE.exists():
        return json.loads(QA_FILE.read_text(encoding="utf-8"))
    return []


@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="list_positions",
            description="获取所有招聘岗位清单",
            inputSchema={"type": "object", "properties": {}, "required": []},
        ),
        Tool(
            name="list_resumes",
            description="查询已下载的简历列表，可按日期和岗位筛选",
            inputSchema={
                "type": "object",
                "properties": {
                    "date": {"type": "string", "description": "按日期筛选，格式 YYYY-MM-DD"},
                    "position": {"type": "string", "description": "按岗位筛选（模糊匹配）"},
                },
                "required": [],
            },
        ),
        Tool(
            name="get_resume_stats",
            description="获取简历下载统计信息（按日期和岗位分组）",
            inputSchema={"type": "object", "properties": {}, "required": []},
        ),
        Tool(
            name="download_resume",
            description="下载指定简历文件，返回 base64 编码内容",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "简历路径（从 list_resumes 返回的 path 字段）",
                    },
                },
                "required": ["path"],
            },
        ),
        Tool(
            name="list_qa",
            description="查询候选人问答记录，可按日期和候选人筛选",
            inputSchema={
                "type": "object",
                "properties": {
                    "date": {"type": "string", "description": "按日期筛选，格式 YYYY-MM-DD"},
                    "candidate": {"type": "string", "description": "按候选人名字筛选（模糊匹配）"},
                },
                "required": [],
            },
        ),
        Tool(
            name="list_skills",
            description="列出所有可用的自动化技能及其参数说明",
            inputSchema={"type": "object", "properties": {}, "required": []},
        ),
        Tool(
            name="run_skill",
            description="执行一个自动化技能并等待完成，返回执行报告（含处理数量、下载文件、错误等）",
            inputSchema={
                "type": "object",
                "properties": {
                    "skill": {
                        "type": "string",
                        "description": "技能名称（从 list_skills 获取）",
                    },
                    "params": {
                        "type": "object",
                        "description": "技能参数（从 list_skills 获取参数说明）",
                        "default": {},
                    },
                },
                "required": ["skill"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    if name == "list_positions":
        return _handle_list_positions()
    elif name == "list_resumes":
        return _handle_list_resumes(arguments)
    elif name == "get_resume_stats":
        return _handle_get_resume_stats()
    elif name == "download_resume":
        return _handle_download_resume(arguments)
    elif name == "list_qa":
        return _handle_list_qa(arguments)
    elif name == "list_skills":
        return await _handle_list_skills()
    elif name == "run_skill":
        return await _handle_run_skill(arguments)
    else:
        return [TextContent(type="text", text=f"Unknown tool: {name}")]


def _handle_list_positions() -> list[TextContent]:
    index = _load_index()
    positions = sorted(set(e.get("position", "") for e in index if e.get("position")))
    return [TextContent(
        type="text",
        text=json.dumps({"positions": positions, "total": len(positions)}, ensure_ascii=False, indent=2),
    )]


def _handle_list_resumes(args: dict) -> list[TextContent]:
    index = _load_index()
    date = args.get("date")
    position = args.get("position")
    if date:
        index = [r for r in index if r.get("date") == date]
    if position:
        index = [r for r in index if position in r.get("position", "")]
    return [TextContent(
        type="text",
        text=json.dumps({"resumes": index, "total": len(index)}, ensure_ascii=False, indent=2),
    )]


def _handle_get_resume_stats() -> list[TextContent]:
    index = _load_index()
    by_date: dict[str, int] = {}
    by_position: dict[str, int] = {}
    for e in index:
        d = e.get("date", "unknown")
        p = e.get("position", "unknown")
        by_date[d] = by_date.get(d, 0) + 1
        by_position[p] = by_position.get(p, 0) + 1
    result = {"total": len(index), "by_date": by_date, "by_position": by_position}
    return [TextContent(
        type="text",
        text=json.dumps(result, ensure_ascii=False, indent=2),
    )]


def _handle_download_resume(args: dict) -> list[TextContent]:
    path = args.get("path", "")
    if not path:
        return [TextContent(type="text", text='{"error": "missing path parameter"}')]

    file_path = RESUME_DIR / path
    if not file_path.exists():
        return [TextContent(type="text", text=f'{{"error": "file not found: {path}"}}')]

    # Security: ensure path doesn't escape RESUME_DIR
    try:
        file_path.resolve().relative_to(RESUME_DIR.resolve())
    except ValueError:
        return [TextContent(type="text", text='{"error": "invalid path"}')]

    data = base64.b64encode(file_path.read_bytes()).decode()
    return [TextContent(
        type="text",
        text=json.dumps({
            "filename": file_path.name,
            "path": path,
            "size_bytes": file_path.stat().st_size,
            "content_base64": data,
        }, ensure_ascii=False),
    )]


def _handle_list_qa(args: dict) -> list[TextContent]:
    records = _load_qa()
    date = args.get("date")
    candidate = args.get("candidate")
    if date:
        records = [r for r in records if r.get("date") == date]
    if candidate:
        records = [r for r in records if candidate in r.get("candidate", "")]
    return [TextContent(
        type="text",
        text=json.dumps({"records": records, "total": len(records)}, ensure_ascii=False, indent=2),
    )]


async def _handle_list_skills() -> list[TextContent]:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{BACKEND_URL}/api/skills")
        return [TextContent(type="text", text=resp.text)]


async def _handle_run_skill(args: dict) -> list[TextContent]:
    skill = args.get("skill", "")
    params = args.get("params", {})
    if not skill:
        return [TextContent(type="text", text='{"error": "missing skill parameter"}')]

    async with httpx.AsyncClient(timeout=30) as client:
        # Step 1: Trigger skill (returns immediately with task_id)
        resp = await client.post(
            f"{BACKEND_URL}/api/skills/run",
            json={"skill": skill, "params": params},
        )
        trigger_data = resp.json()
        task_id = trigger_data.get("task_id")
        if not task_id:
            return [TextContent(type="text", text=resp.text)]

    # Step 2: Poll for result (skill may take minutes)
    for _ in range(360):  # Max 30 minutes (360 * 5s)
        await asyncio.sleep(5)
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{BACKEND_URL}/api/skills/tasks/{task_id}")
            data = resp.json()
            status = data.get("status", "")
            if status in ("completed", "error"):
                return [TextContent(type="text", text=json.dumps(data, ensure_ascii=False, indent=2))]

    return [TextContent(type="text", text=json.dumps({
        "task_id": task_id, "status": "timeout",
        "error": "Skill execution exceeded 30 minutes",
    }, ensure_ascii=False))]


def main() -> None:
    asyncio.run(run_stdio(server))


if __name__ == "__main__":
    main()
