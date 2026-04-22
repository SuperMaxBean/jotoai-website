# 合作方站点 SEO 修复清单

这份文档是发给**合作方开发者**的 SEO 整改清单。适用于下列由合作方维护的 JOTO 生态站：

| 站点 | 所在域 | 当前状态（2026-04-22 审计）|
|---|---|---|
| **translator** | `translator.jototech.cn` | 只有 `<title>唯客智译</title>`，其他 meta 全空，`<html lang="en">`，sitemap 只有 1 条 |
| **posterize** | `posterize.jototech.cn` | 只有 `<title>AI POSTER</title>`，其他 meta 全空，`<html lang="en">`，sitemap 空 |
| **command** | `command.jotoai.com` (Pharaoh Command) | 只有 `<title>Pharaoh Command — AI-Powered NetOps Platform</title>`，其他 meta 全空，sitemap 空 |
| **noteflow-frontend** | `note.jotoai.com/dashboard` (不是 landing，landing 已修) | nginx 把 `/sitemap.xml` 错误地路由到 frontend SPA 导致返回 HTML 而非 XML |

完成下面的清单后把改动 push 到你们的仓库并重新部署，然后告诉我（tomi@jototech.cn）一声，我们会复查。

---

## 1. 给根 HTML 加完整的 SEO meta（必须）

在 `index.html` 或 Next.js `app/layout.tsx` / Vue `main.tsx` 的根布局中，`<head>` 必须包含以下 **10 项**。示例用 translator 站做模板，其他站同理替换品牌字段即可：

```html
<!doctype html>
<html lang="zh-CN">   <!-- 目标受众是中文用户就用 zh-CN，英文版用 en，国际化用 hreflang -->
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- 1. title —— 控制在 30-60 字符，含核心关键词 + 品牌 -->
    <title>唯客智译 - AI 文档翻译与多语言本地化平台 | JOTO.AI</title>

    <!-- 2. description —— 150-160 字符，描述价值主张 -->
    <meta name="description" content="唯客智译是 JOTO.AI 旗下 AI 文档翻译与多语言本地化平台，支持术语库管理、翻译质量评估、批量文档翻译。为外贸企业、出海品牌、翻译服务机构提供高质量翻译工作流。" />

    <!-- 3. keywords —— 8-15 个，逗号分隔 -->
    <meta name="keywords" content="AI文档翻译,多语言本地化,翻译工具,术语库管理,出海翻译,跨境业务翻译,批量翻译,AI翻译质量评估,JOTO.AI,唯客智译" />

    <!-- 4. robots —— 告诉爬虫允许索引 -->
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />

    <!-- 5. canonical —— 防止重复内容惩罚 -->
    <link rel="canonical" href="https://translator.jototech.cn/" />

    <!-- 6-10. Open Graph + Twitter Card —— 社交分享预览 -->
    <meta property="og:title" content="唯客智译 - AI 文档翻译平台" />
    <meta property="og:description" content="AI 驱动的多语言文档翻译与本地化工作流。" />
    <meta property="og:url" content="https://translator.jototech.cn/" />
    <meta property="og:site_name" content="唯客智译" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:image" content="https://translator.jototech.cn/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="唯客智译 - AI 文档翻译平台" />
    <meta name="twitter:description" content="AI 驱动的多语言文档翻译与本地化工作流。" />
    <meta name="twitter:image" content="https://translator.jototech.cn/og-image.png" />
  </head>
```

### 每站的具体填写

#### translator (`translator.jototech.cn`)
- **title**: `唯客智译 - AI 文档翻译与多语言本地化平台 | JOTO.AI`
- **description**: `唯客智译是 JOTO.AI 旗下 AI 文档翻译与多语言本地化平台，支持术语库管理、翻译质量评估、批量文档翻译。为外贸企业、出海品牌、翻译服务机构提供高质量翻译工作流。`
- **keywords**: `AI文档翻译,多语言本地化,翻译工具,术语库管理,出海翻译,跨境业务翻译,批量翻译,AI翻译质量评估,JOTO.AI,唯客智译`

#### posterize (`posterize.jototech.cn`)
- **title**: `AI Poster - AI 海报生成器 | 一键生成品牌营销海报`
- **description**: `AI Poster 由 JOTO.AI 推出，基于大模型的海报设计工具。输入关键词或上传产品图，AI 自动生成高质量海报、社交媒体图、活动宣传图。适用于电商、品牌运营、市场推广团队。`
- **keywords**: `AI海报生成,AI设计工具,海报模板,营销物料生成,电商海报,社交媒体图片,品牌设计,Poster AI,JOTO.AI`

#### command (`command.jotoai.com`)
- **title**: `Pharaoh Command - AI 驱动的 NetOps 网络运维平台 | JOTO.AI`
- **description**: `Pharaoh Command 是 JOTO.AI 旗下 AI 驱动的 NetOps 平台，通过自然语言对话完成网络设备配置、故障诊断、拓扑分析与运维自动化。面向企业 IT、网络工程师与 SRE 团队。`
- **keywords**: `AI网络运维,NetOps平台,网络自动化,AI运维,网络故障诊断,自然语言运维,IT运维工具,网络管理平台,Pharaoh Command,JOTO.AI`

#### noteflow-frontend (`note.jotoai.com/dashboard` —— 前端 SPA)
landing 页的 SEO 已经修过了（见 `/opt/noteflow/landing/index.html`）。**遗留问题是 nginx 把 `/sitemap.xml` 和 `/robots.txt` 路由错了**。

修复 `/opt/noteflow/docker-compose.yml` 或 nginx 配置，确保：
```nginx
# noteflow-nginx 配置里加
location = /sitemap.xml {
    root /usr/share/nginx/landing-html;  # 指向 landing 镜像里的 dist
    try_files /sitemap.xml =404;
}
location = /robots.txt {
    root /usr/share/nginx/landing-html;
    try_files /robots.txt =404;
}
```
或者更简单：让 noteflow-nginx 把这两个具体路径 proxy 到 `landing` 容器而不是 `frontend` 容器。

---

## 2. robots.txt（必须）

站根目录下必须有 `/robots.txt`，内容示例：

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /login

Sitemap: https://translator.jototech.cn/sitemap.xml
```

**Sitemap 那一行是关键** —— Google/百度会通过 robots.txt 发现 sitemap。

---

## 3. sitemap.xml（必须）

站根目录下必须有 `/sitemap.xml`。**最好动态生成**（每次有新页面或新文章自动更新）。

### 静态站点最简模板

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://translator.jototech.cn/</loc>
    <lastmod>2026-04-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://translator.jototech.cn/pricing</loc>
    <lastmod>2026-04-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- 每一个可索引的页面都加一条 -->
</urlset>
```

### Next.js 动态生成（推荐，适用于有大量博客/产品页的站）

创建 `src/app/sitemap.ts`：

```ts
import type { MetadataRoute } from 'next';

export const revalidate = 3600;  // 每小时重生成

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://translator.jototech.cn';

  // 如果有博客/文章，从数据库或 API 拿
  // const articles = await fetchArticles();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    // ...展开到所有公开页面
    // ...articles.map(a => ({
    //   url: `${baseUrl}/blog/${a.id}`,
    //   lastModified: new Date(a.updatedAt),
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.7,
    // })),
  ];
}
```

### Vue/Vite 站点

- 如果内容是静态的：在 `public/sitemap.xml` 放一份手写的
- 如果内容是动态的：在 build 脚本里加一个预 build 步骤读数据库生成 sitemap，或者在后端（FastAPI / Express）加一个 `/sitemap.xml` endpoint 动态输出

---

## 4. Open Graph 预览图（推荐）

社交媒体（微信、Twitter、LinkedIn、Slack 等）分享时会抓 `og:image` 显示预览图。每站**至少准备一张** `1200 × 630` 的图：
- 放在 `public/og-image.png`
- 内容建议：品牌 Logo + 一句话 slogan + 简洁背景
- 文件大小 < 300 KB
- 必须能直接公网访问（不要放私有 bucket）

---

## 5. JSON-LD 结构化数据（进阶，推荐）

在首页 head 里加 `<script type="application/ld+json">` 告诉搜索引擎这是什么组织/产品。

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "唯客智译",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "CNY"
  },
  "description": "AI 文档翻译与多语言本地化平台",
  "publisher": {
    "@type": "Organization",
    "name": "JOTO.AI",
    "url": "https://jotoai.com"
  }
}
</script>
```

Google 会把这份数据用于知识面板、富媒体结果。

---

## 6. 速度与可爬性（基础）

- **页面加载 < 3s**（Lighthouse Performance ≥ 70）—— Google 排名的重要因子
- **响应式**：移动端必须能用（viewport meta 已在上面模板里）
- **HTTPS**：所有页面必须强制 HTTPS，不能 mixed content
- **无 robot 陷阱**：不要在首页用 JavaScript 渲染关键内容（Vue/React SPA 要么 SSR，要么至少 `ssr: false` 的页面必须有 fallback HTML 给爬虫）

---

## 7. 验证工具（部署后自己跑一遍）

- Google Search Console：注册域名后提交 sitemap
- Rich Results Test：`https://search.google.com/test/rich-results`
- Lighthouse（Chrome DevTools）：跑一次 SEO 评分应 ≥ 90
- 百度站长工具：提交 sitemap

---

## 8. JOTO 提供的帮助

如果你们需要 OG 图素材、品牌色值、文案校对，告诉我们（tomi@jototech.cn），我们可以一起同步。

修复完成后回复一声，我们会用 `curl` + Lighthouse 抽检，没问题就标绿。
