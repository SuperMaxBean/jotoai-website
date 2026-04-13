# 唯客 AI 护栏 | 企业级大模型安全防护

Next.js 15 App Router 企业站，符合《网站前端开发规范 v3.0》技术架构与 SEO 要求。

## 技术栈

- **Next.js 15** App Router、服务端渲染（SSR）
- **TypeScript**、**Tailwind CSS**
- **next/font**（Noto Sans SC、Outfit，`display: swap`）
- **next/image** 图片优化

## 运行说明

1. **安装依赖**
   ```bash
   npm install
   ```

2. **环境变量（可选）**
   - 复制 `.env.example` 为 `.env.local`
   - `NEXT_PUBLIC_SITE_URL`：正式域名，用于 sitemap、robots、metadata
   - `NEXT_PUBLIC_API_BASE_URL`：联系表单等 API 基础地址

3. **本地开发**
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

4. **生产构建与启动**
   ```bash
   npm run build
   npm start
   ```

## 目录结构（概要）

```
src/
├── app/
│   ├── layout.tsx          # 根布局，next/font、全局 meta 基础
│   ├── page.tsx            # 首页
│   ├── features/           # 核心功能
│   ├── blog/               # 新闻博客
│   ├── contact/            # 联络我们
│   ├── changelog/          # 更新日志
│   ├── roadmap/            # 技术路线图
│   ├── about/              # 关于我们
│   ├── pricing/            # 价格方案
│   ├── articles/           # 文章列表
│   ├── articles/[id]/      # 文章详情
│   ├── sitemap.ts          # sitemap.xml
│   └── robots.ts           # robots.txt
├── components/
│   ├── layout/             # Header、Footer、Breadcrumb
│   └── ...                 # 各页面/区块组件
└── lib/
    └── metadata.ts         # 全局 metadata 工厂
```

## 规范符合说明

- 每个页面独立 `metadata`（title、description、keywords、robots、alternates、openGraph、twitter）
- 非首页提供面包屑与 `BreadcrumbList` JSON-LD
- 站点级 `sitemap.xml`、`robots.txt`
- 图片使用 `next/image`，字体使用 `next/font`，无 CDN 引入
- 仅含浏览器交互的组件使用 `'use client'`
