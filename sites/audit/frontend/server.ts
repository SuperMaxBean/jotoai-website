import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { blogPosts } from "./src/data/blogData.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  const isProd = process.env.NODE_ENV === "production";

  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist", { index: false }));
  }

  const validRoutes = ['/', '/features', '/architecture', '/blog', '/contact'];

  app.get('*', async (req, res, next) => {
    // For an MPA, we could return 404 for invalid routes, but let's just serve the app and let React handle it for simplicity, or we can just serve it for valid routes.
    
    try {
      let templatePath = isProd ? path.resolve(__dirname, 'dist/index.html') : path.resolve(__dirname, 'index.html');
      let template = fs.readFileSync(templatePath, 'utf-8');

      if (!isProd && vite) {
        template = await vite.transformIndexHtml(req.originalUrl, template);
      }

      const pageMetadata: Record<string, { title: string, description: string, keywords: string, content: string }> = {
        '/': {
          title: '唯客智审 - 新一代 AI 合同审查平台 | JOTO AI 旗下产品',
          description: '唯客智审利用大语言模型（LLM）与 RAG 技术，为企业提供智能合同审查、风险预警及合规评估。将审查效率提升 90%，风险识别准确率达 95%。',
          keywords: 'AI合同审查, 智能法务, 合同风控, 法律大模型, 唯客智审, JOTO AI, 法律科技',
          content: '唯客智审是新一代 AI 合同审查平台。核心功能包括：企业专属规则库、智能风险分级、双栏对比高效审查、多智能体 RAG 召回架构。适用于地产建筑、先进制造、金融服务、科技互联网等全场景。'
        },
        '/features': {
          title: '核心功能 - 唯客智审 | 智能规则库与风险分级',
          description: '深入了解唯客智审的核心功能：自定义规则引擎、红黄绿三色风险预警、双栏联动修订模式，以及确保零幻觉的多智能体校验架构。',
          keywords: '合同审查功能, 规则引擎, 风险分级, 自动修订, 法律 AI 助手',
          content: '唯客智审核心功能：1. 企业专属规则库，支持自然语言转规则；2. 智能风险分级，提供法律依据与修改措辞；3. 双栏交互设计，审查修改无缝衔接；4. 多智能体 RAG 架构，攻克严肃法律场景。'
        },
        '/architecture': {
          title: '技术架构 - 唯客智审 | Legal-LLM 与安全加密',
          description: '唯客智审技术底层解析：基于千亿级 Token 预训练的 Legal-LLM 法律大模型，结合 RAG 检索增强技术，支持 SaaS 与私有化部署。',
          keywords: '法律大模型架构, RAG技术, 数据安全, 私有化部署, Legal-LLM',
          content: '技术架构：底层采用 Legal-LLM 垂直领域法律大模型；中层为 RAG 知识库检索增强；顶层支持 SaaS 云端与本地化私有部署。全链路 AES-256 加密，确保数据安全。'
        },
        '/blog': {
          title: '新闻博客 - 唯客智审 | 法律科技行业趋势与产品动态',
          description: '获取 AI 合同审查领域的最新动态。涵盖生成式 AI 重塑法律服务、产品发布更新、法律百科及行业选型白皮书。',
          keywords: '法律科技博客, AI 动态, 合同管理趋势, 法律百科, 唯客智审更新',
          content: '唯客智审博客：分享生成式 AI 如何重塑法律服务，发布产品更新动态，提供法律百科知识，帮助企业法务部门实现数字化转型。'
        },
        '/contact': {
          title: '联系我们 - 唯客智审 | 预约产品演示与商务合作',
          description: '期待与您交流。联系唯客智审团队，预约 1 对 1 产品演示，咨询企业法务数字化转型方案。',
          keywords: '联系唯客智审, 预约演示, 商务合作, 法务咨询',
          content: '联系方式：服务热线 +86 (021) 6566 1628，邮箱 jotoai@jototech.cn。欢迎预约产品演示。'
        },
        '/privacy': {
          title: '隐私政策 - 唯客智审 | 数据安全与隐私保护承诺',
          description: '唯客智审隐私政策：我们如何收集、使用并保护您的合同数据。承诺不经许可不使用原始数据训练通用模型。',
          keywords: '隐私政策, 数据安全, 隐私保护, 合同数据加密',
          content: '隐私政策要点：重视用户隐私，合同数据加密处理，严格访问控制。除非获得许可，否则不使用原始数据训练通用基础模型。'
        }
      };

      let currentMeta = pageMetadata[req.path] || pageMetadata['/'];

      if (req.path.startsWith('/blog/')) {
        const blogId = parseInt(req.path.split('/').pop() || '0');
        const post = blogPosts.find(p => p.id === blogId);
        if (post) {
          currentMeta = {
            title: `${post.title} - 唯客智审`,
            description: post.excerpt,
            keywords: `${post.category}, AI合同审查, 法律科技, ${post.author}`,
            content: post.content.replace(/<[^>]*>/g, '') // Remove HTML tags for SEO text
          };
        } else {
          currentMeta = {
            ...pageMetadata['/blog'],
            title: '文章详情 - 唯客智审',
            description: '阅读唯客智审深度好文，了解 AI 在法律领域的实战应用与技术解析。'
          };
        }
      }

      // 1. 替换标题
      template = template.replace('<title>My Google AI Studio App</title>', `<title>${currentMeta.title}</title>`);

      // 2. 注入 Meta 标签 (Description 和 Keywords)
      const metaTags = `
    <meta name="description" content="${currentMeta.description}" />
    <meta name="keywords" content="${currentMeta.keywords}" />
    <meta name="author" content="唯客智审" />
    <link rel="canonical" href="https://audit.jotoai.com${req.path}" />
      `;
      template = template.replace('</head>', `${metaTags}\n  </head>`);

      // 3. 注入隐藏的 SEO 文本内容 (让爬虫能直接抓取到正文)
      const seoContent = `
    <div id="seo-content" style="display:none;" aria-hidden="true">
      <h1>${currentMeta.title}</h1>
      <p>${currentMeta.description}</p>
      <div>${currentMeta.content}</div>
    </div>
      `;
      template = template.replace('<div id="root"></div>', `<div id="root"></div>\n    ${seoContent}`);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      if (vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
