# 闪阅 AI 全科阅卷

闪阅是 JOTO 旗下的 AI 教学评估平台，支持全科试卷的智能批改、手写识别与学情分析。

**技术栈：** Next.js 15 + React 19 + Tailwind CSS 4 + TypeScript

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm start
```

## 部署到服务器

### 前提条件

- Node.js 22+
- 服务器需要有公网 IP 或内网访问

### 一键部署（SSH）

```bash
# 1. 克隆仓库到服务器
git clone https://github.com/xutomi3-art/shanyue.git /opt/shanyue
cd /opt/shanyue

# 2. 安装依赖 + 构建
npm install
npm run build

# 3. 用 PM2 启动（监听 80 端口）
npm install -g pm2
pm2 start npm --name shanyue -- start -- -p 80
pm2 save
pm2 startup
```

### 部署说明

- 项目开箱即用，`npm install && npm run build && npm start` 即可运行
- 所有外部资源已替换为国内可访问方案（无 Google Fonts、无境外图片服务）
- 字体通过 `fonts.loli.net`（国内 Google Fonts 镜像）加载
- 图片全部使用 CSS 渐变和内联 SVG，不依赖外部图片服务
- SEO 已配置：robots.txt、sitemap.xml、JSON-LD 结构化数据、OpenGraph

### 域名与 SEO

部署后需要修改以下文件中的域名（默认为 `shanyue.joto.ai`）：

- `src/app/layout.tsx` — metadataBase、canonical、OpenGraph url
- `src/app/sitemap.ts` — baseUrl
- `public/robots.txt` — Sitemap URL

### 目录结构

```
├── public/              # 静态资源（robots.txt、OG 图片）
├── src/
│   ├── app/             # Next.js App Router 页面
│   │   ├── layout.tsx   # 全局布局（SEO meta、字体、JSON-LD）
│   │   ├── page.tsx     # 首页
│   │   ├── sitemap.ts   # 自动生成 sitemap.xml
│   │   ├── architecture/
│   │   ├── articles/
│   │   ├── capabilities/
│   │   ├── contact/
│   │   ├── login/
│   │   └── privacy/
│   ├── components/      # React 组件（全部 "use client"）
│   └── constants.ts     # 全局常量数据
├── postcss.config.mjs   # Tailwind CSS 4 PostCSS 配置
├── next.config.mjs      # Next.js 配置
└── tsconfig.json
```
