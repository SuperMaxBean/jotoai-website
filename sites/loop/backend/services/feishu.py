"""Feishu (Lark) Bitable API integration.

Provides batch record writing to Feishu Bitable tables via the Open API.
Requires FEISHU_APP_ID and FEISHU_APP_SECRET environment variables.
"""

import logging
import re
import time
from urllib.parse import urlparse, parse_qs

import httpx

import config

logger = logging.getLogger(__name__)

_FEISHU_TOKEN_URL = "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal"
_FEISHU_BITABLE_RECORDS_URL = (
    "https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/records/batch_create"
)
_TOKEN_TTL_SECONDS = 7200  # 2 hours
_MAX_BATCH_SIZE = 500  # Feishu API limit per request


class FeishuBitable:
    """Client for reading/writing Feishu Bitable records."""

    def __init__(self) -> None:
        self._cached_token: str = ""
        self._token_expires_at: float = 0.0

    @property
    def _app_id(self) -> str:
        return config.feishu.get("app_id", "")

    @property
    def _app_secret(self) -> str:
        return config.feishu.get("app_secret", "")

    # ------------------------------------------------------------------
    # Token management
    # ------------------------------------------------------------------

    async def get_token(self) -> str:
        """Return a tenant_access_token, refreshing if expired or missing.

        Raises RuntimeError with a user-facing message on failure.
        """
        now = time.time()
        if self._cached_token and now < self._token_expires_at:
            return self._cached_token

        if not self._app_id or not self._app_secret:
            raise RuntimeError("飞书 App ID 或 App Secret 未配置，请在设置页填写")

        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.post(
                    _FEISHU_TOKEN_URL,
                    json={
                        "app_id": self._app_id,
                        "app_secret": self._app_secret,
                    },
                )
                data = resp.json()

            if data.get("code") != 0:
                msg = data.get("msg", str(data))
                logger.error("Failed to get Feishu token: %s", msg)
                raise RuntimeError(f"飞书认证失败: {msg}")

            self._cached_token = data["tenant_access_token"]
            # Refresh slightly before actual expiry to avoid edge-case failures
            self._token_expires_at = now + _TOKEN_TTL_SECONDS - 60
            logger.info("Feishu tenant_access_token refreshed")
            return self._cached_token

        except RuntimeError:
            raise
        except Exception as e:
            logger.exception("Error requesting Feishu tenant_access_token")
            raise RuntimeError(f"飞书认证请求失败: {e}") from e

    # ------------------------------------------------------------------
    # URL parsing
    # ------------------------------------------------------------------

    @staticmethod
    def parse_url(url: str) -> tuple[str, str]:
        """Extract (app_token, table_id) from a Feishu Bitable URL.

        Expected format:
            https://xxx.feishu.cn/base/<app_token>?table=tblXXX
            https://xxx.feishu.cn/base/<app_token>/<extra>?table=tblXXX

        Raises RuntimeError with a user-facing message on failure.
        """
        if not url or not url.strip():
            raise RuntimeError("飞书表格 URL 为空")
        try:
            parsed = urlparse(url)
            # app_token is the first path segment after /base/
            match = re.search(r"/base/([A-Za-z0-9]+)", parsed.path)
            if not match:
                raise RuntimeError(
                    f"无法从 URL 中提取 app_token，请确认链接格式正确（需包含 /base/xxx）: {url}"
                )
            app_token = match.group(1)

            qs = parse_qs(parsed.query)
            table_ids = qs.get("table", [])
            if not table_ids:
                raise RuntimeError(
                    f"URL 中缺少 table 参数，请确认链接包含 ?table=tblXXX: {url}"
                )
            table_id = table_ids[0]

            return (app_token, table_id)
        except RuntimeError:
            raise
        except Exception as e:
            raise RuntimeError(f"飞书 URL 解析失败: {e}") from e

    # ------------------------------------------------------------------
    # Table / field management
    # ------------------------------------------------------------------

    async def ensure_fields(self, app_token: str, table_id: str, field_names: list[str]) -> None:
        """Ensure the target table has the required text fields. Creates missing ones.

        Raises RuntimeError on failure.
        """
        token = await self.get_token()

        headers = {"Authorization": f"Bearer {token}"}
        list_url = f"https://open.feishu.cn/open-apis/bitable/v1/apps/{app_token}/tables/{table_id}/fields"

        try:
            async with httpx.AsyncClient(timeout=15) as client:
                # Get existing fields
                resp = await client.get(list_url, headers=headers)
                data = resp.json()
                if data.get("code") != 0:
                    msg = data.get("msg", str(data))
                    raise RuntimeError(
                        f"获取表格字段失败: {msg}（请检查应用是否有多维表格权限，表格是否已授权给应用）"
                    )

                existing = {f["field_name"] for f in data.get("data", {}).get("items", [])}

                # Create missing fields
                for name in field_names:
                    if name in existing:
                        continue
                    create_resp = await client.post(list_url, headers=headers, json={
                        "field_name": name,
                        "type": 1,  # 1 = text
                    })
                    create_data = create_resp.json()
                    if create_data.get("code") == 0:
                        logger.info("Created field '%s' in table %s", name, table_id)
                    else:
                        logger.warning("Failed to create field '%s': %s", name, create_data.get("msg", ""))

        except RuntimeError:
            raise
        except Exception as e:
            raise RuntimeError(f"检查表格字段时出错: {e}") from e

    # ------------------------------------------------------------------
    # Record writing
    # ------------------------------------------------------------------

    async def add_records(
        self, app_token: str, table_id: str, records: list[dict]
    ) -> int:
        """Batch-create records in a Bitable table.

        Args:
            app_token: Bitable app token.
            table_id: Target table ID (e.g. "tblXXX").
            records: List of field-value dicts, one per row.

        Returns:
            Number of records successfully written.

        Raises:
            RuntimeError on failure.
        """
        if not records:
            return 0

        token = await self.get_token()

        url = _FEISHU_BITABLE_RECORDS_URL.format(
            app_token=app_token, table_id=table_id
        )
        headers = {"Authorization": f"Bearer {token}"}

        total_written = 0

        try:
            async with httpx.AsyncClient(timeout=30) as client:
                # Split into batches to respect API limit
                for i in range(0, len(records), _MAX_BATCH_SIZE):
                    batch = records[i : i + _MAX_BATCH_SIZE]
                    payload = {
                        "records": [{"fields": r} for r in batch],
                    }
                    resp = await client.post(url, json=payload, headers=headers)
                    data = resp.json()

                    if data.get("code") != 0:
                        msg = data.get("msg", str(data))
                        logger.error(
                            "Feishu batch_create failed (batch %d): %s",
                            i // _MAX_BATCH_SIZE,
                            msg,
                        )
                        raise RuntimeError(f"飞书写入记录失败: {msg}")

                    written = len(data.get("data", {}).get("records", []))
                    total_written += written
                    logger.info(
                        "Feishu batch_create: wrote %d/%d records (batch %d)",
                        written,
                        len(batch),
                        i // _MAX_BATCH_SIZE,
                    )

        except RuntimeError:
            raise
        except Exception as e:
            raise RuntimeError(f"飞书写入请求失败: {e}") from e

        return total_written

    # ------------------------------------------------------------------
    # Convenience: write review data
    # ------------------------------------------------------------------

    async def write_reviews(self, feishu_url: str, reviews: list[dict]) -> int:
        """Parse a Bitable URL and write review records.

        Each review dict is expected to contain keys that map to the Bitable
        fields: 商品, 用户名, 评论时间, 评论内容.

        Args:
            feishu_url: Full Feishu Bitable URL.
            reviews: List of review dicts.

        Returns:
            Number of records written.

        Raises:
            RuntimeError with user-facing message on failure.
        """
        app_token, table_id = self.parse_url(feishu_url)

        # Auto-create table fields if missing
        await self.ensure_fields(app_token, table_id, ["商品", "用户名", "评论时间", "评论内容"])

        # Normalize review dicts to Bitable field names
        # taobao_skill uses: product, name, date, content
        normalized: list[dict] = []
        for r in reviews:
            normalized.append(
                {
                    "商品": str(r.get("product", r.get("商品", ""))),
                    "用户名": str(r.get("name", r.get("用户名", ""))),
                    "评论时间": str(r.get("date", r.get("评论时间", ""))),
                    "评论内容": str(r.get("content", r.get("评论内容", ""))),
                }
            )

        if not normalized:
            return 0

        count = await self.add_records(app_token, table_id, normalized)
        logger.info(
            "write_reviews: %d/%d reviews written to %s",
            count,
            len(normalized),
            feishu_url,
        )
        return count
