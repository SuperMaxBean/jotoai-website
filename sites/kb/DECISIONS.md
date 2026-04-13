# Decision Log

> Claude 在自主开发过程中遇到需要选择的决策点时，记录在此文件。
> 只记录架构级或可能引起疑问的决策，不记录显而易见的实现选择。

## 格式

```
### [序号] [简要标题]
- **日期**: YYYY-MM-DD
- **决策**: 选择了什么
- **备选方案**: 还有什么其他选择
- **理由**: 为什么选这个
- **影响**: 这个决定影响了哪些模块/文件
```

---

## Decisions

### 001 保持后端单文件架构
- **日期**: 2026-02-28
- **决策**: 不拆分 `backend/index.js`（1938 行），保持现有单文件结构
- **备选方案**: 按功能拆分为 routes/、controllers/、services/ 多文件
- **理由**: 已有代码量大且功能稳定，拆分风险高、收益低；优先完成前后端拼接
- **影响**: backend/index.js

### 002 前端通过 Vite proxy 连接后端
- **日期**: 2026-02-28
- **决策**: 在 `vite.config.ts` 中配置 `/api` 代理到 `http://localhost:3001`，前端代码中使用相对路径 `/api/xxx`
- **备选方案**: (A) 前端硬编码后端地址 (B) 通过环境变量 `VITE_API_BASE` 配置
- **理由**: Vite proxy 开发体验最好，无跨域问题；生产环境通过 Nginx 反向代理实现同样效果
- **影响**: frontend/vite.config.ts, 所有前端 API 调用

### 003 JSON 文件存储 — 不引入数据库
- **日期**: 2026-02-28
- **决策**: 继续使用 `data/*.json` 作为数据存储，不引入 SQLite / PostgreSQL
- **备选方案**: better-sqlite3（前端 package.json 中已有依赖）、PostgreSQL
- **理由**: 后端已围绕 JSON 文件构建完整读写逻辑，数据量可控（文章 < 1000 篇），迁移成本不值得
- **影响**: backend/data/, backend/index.js 所有数据读写函数

### 004 管理后台保持原生 HTML
- **日期**: 2026-02-28
- **决策**: 管理后台（`backend/frontend/`）继续使用原生 HTML + vanilla JS，不用 React 重写
- **备选方案**: 用 React 重写管理后台，与前端统一技术栈
- **理由**: 管理后台 `admin.html` 已有 87KB 完整功能，重写周期长且无用户价值提升
- **影响**: backend/frontend/*.html

### 005 puppeteer 设为可选依赖
- **日期**: 2026-02-28
- **决策**: 安装时使用 `PUPPETEER_SKIP_DOWNLOAD=true` 跳过浏览器下载
- **备选方案**: 完整安装 puppeteer（含 Chromium ~300MB）
- **理由**: puppeteer 仅用于网页截图功能，开发/测试阶段不需要；CI/CD 环境可按需启用
- **影响**: backend/package.json, 安装脚本
