const axios = require('axios');
const { OpenAI } = require('openai');
const { markdownToHtml, cleanHtml } = require('./article-rewriter');
const { searchAndFetchArticles, selectBestArticle } = require('./article-search');
const { rewriteArticle } = require('./article-rewriter');
const { UnsplashFetcher } = require('./unsplash-fetcher-simple');

// ========== 站点专属上下文配置 ==========
const SITE_CONTEXTS = {
  audit: {
    systemPrompt: '你是一名专注于AI合同审查、企业法务和法律科技领域的专业内容创作者，擅长撰写合同风控、智能合同审查、企业法务管理、法律合规等主题的专业SEO文章。内容面向企业法务总监、合同管理专员和法务人员，语言专业严谨，注重实际业务价值。',
    imageQuery: 'legal contract AI technology business professional',
    topic: 'AI合同审查法律合规',
  },
  shanyue: {
    systemPrompt: '你是一名专注于AI教育技术、智能阅卷和自动评分领域的专业内容创作者，擅长撰写智能阅卷系统、AI批改作业、OCR手写识别、教育AI应用等主题的专业SEO文章。内容面向学校老师、教育机构管理者和EdTech从业者，语言通俗专业，注重教学效率提升。',
    imageQuery: 'education AI exam grading technology school',
    topic: '智能阅卷AI教育评测',
  },
  sec: {
    systemPrompt: '你是一名专注于AI安全、大模型安全防护和企业AI治理领域的专业内容创作者，擅长撰写LLM安全、提示词注入防护、大模型合规、企业AI风险管理等主题的专业SEO文章。内容面向CTO、安全工程师和AI治理负责人，语言技术专业，注重安全实践和合规要求。',
    imageQuery: 'AI security cybersecurity enterprise protection technology',
    topic: 'AI安全大模型安全防护',
  },
  kb: {
    systemPrompt: '你是一名专注于企业知识管理、AI知识库和RAG技术领域的专业内容创作者，擅长撰写企业知识中台、智能问答系统、私有化知识库、知识图谱等主题的专业SEO文章。内容面向企业CIO、知识管理负责人和技术团队，语言专业务实，注重知识沉淀和业务赋能。',
    imageQuery: 'enterprise knowledge management AI database information',
    topic: 'AI知识库企业知识管理',
  },
  fasium: {
    systemPrompt: '你是一名专注于AI时尚设计、智能服装创意和数字化时尚领域的专业内容创作者，擅长撰写AI服装设计、虚拟试衣、AI穿搭推荐、时尚AI工具等主题的专业SEO文章。内容面向服装设计师、时尚品牌运营和AI创意工作者，语言时尚生动，注重创意表达和设计效率。',
    imageQuery: 'fashion design AI clothing style creative technology',
    topic: 'AI服装时尚设计',
  },
};

const DEFAULT_SITE_CONTEXT = {
  systemPrompt: '你是一名专业的SEO内容创作者，擅长撰写高质量的科技类文章。',
  imageQuery: 'technology AI business professional',
  topic: 'AI科技',
};

function getSiteContext(siteId) {
  return SITE_CONTEXTS[siteId] || DEFAULT_SITE_CONTEXT;
}
// ========================================


// 默认SEO关键词列表（仅在未配置时使用）
const DEFAULT_KEYWORDS = [
  'RAG',
  '检索增强生成',
  '企业知识库',
  '企业知识中台',
  '知识管理平台',
  '智能知识库',
  'AI知识管理',
  '企业AI应用',
  '智能客服系统',
  '知识图谱'
];

// 解析关键词字符串为数组
function parseKeywords(keywordsInput) {
  if (Array.isArray(keywordsInput) && keywordsInput.length > 0) {
    return keywordsInput;
  }
  if (typeof keywordsInput === 'string' && keywordsInput.trim()) {
    return keywordsInput.split(/[,，、\n]+/).map(k => k.trim()).filter(k => k);
  }
  return DEFAULT_KEYWORDS;
}

// 从关键词列表中随机选择一个
function pickRandomKeyword(keywords) {
  const list = parseKeywords(keywords);
  return list[Math.floor(Math.random() * list.length)];
}

// 备用图片库（按站点分类，使用可靠的Unsplash CDN URL）
const FALLBACK_IMAGES = {
  audit: [
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop",
  ],
  shanyue: [
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&auto=format&fit=crop",
  ],
  sec: [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
  ],
  kb: [
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop",
  ],
  fasium: [
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop",
  ],
};

// 获取备用图片（使用真实Unsplash CDN URL，按站点分类）
function getLocalImage(keyword, siteId) {
  const images = FALLBACK_IMAGES[siteId] || FALLBACK_IMAGES.audit;
  return images[Math.floor(Math.random() * images.length)];
}

// 获取Unsplash免费图片（保留作为备用）
async function getUnsplashImage(keyword) {
  try {
    const response = await axios.get(`https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)},legal,business,contract`, {
      maxRedirects: 0,
      validateStatus: (status) => status === 302
    });
    return response.headers.location || `https://source.unsplash.com/800x600/?legal,business,professional`;
  } catch (error) {
    return `https://source.unsplash.com/800x600/?legal,business,professional`;
  }
}

// 获取唯一图片（Unsplash → AI生成 → 本地图片）
// recentImageUrls: 最近N篇文章已使用的图片URL列表，用于去重
async function getUniqueArticleImage(keyword, imageConfig = null, recentImageUrls = [], siteId = null) {
  console.log(`\n获取文章配图: ${keyword}`);
  console.log(`imageConfig:`, imageConfig);
  console.log(`去重: 排除最近 ${recentImageUrls.length} 张已用图片`);

  // 方案1: 优先使用Unsplash（每张图片都不重复）
  if (imageConfig && imageConfig.unsplashApiKey) {
    console.log(`尝试使用Unsplash API: ${imageConfig.unsplashApiKey.substring(0, 10)}...`);
    try {
      const unsplashFetcher = new UnsplashFetcher(imageConfig.unsplashApiKey);
      const image = await unsplashFetcher.getUniqueImage(keyword);
      console.log(`✓ 使用Unsplash图片: ${image.webPath}`);
      return {
        url: image.webPath,
        source: 'unsplash',
        author: image.author,
        authorUrl: image.authorUrl,
        unsplashUrl: image.unsplashUrl
      };
    } catch (error) {
      console.log(`Unsplash图片获取失败: ${error.message}，尝试备用方案`);
    }
  }

  // 方案2: 备用 - AI生成图片
  if (imageConfig && imageConfig.useAI && imageConfig.apiKey) {
    try {
      const { OpenAI } = require('openai');
      const openai = new OpenAI({ apiKey: imageConfig.apiKey });

      const imageResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `A professional, modern illustration about ${keyword} related to legal contract review and AI legal technology. Clean, minimalist design with blue and navy colors. Show professional business documents, legal contracts, and AI elements in a harmonious way. NO text, NO logos, NO brand names, NO watermarks.`,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      console.log(`✓ 使用AI生成图片`);
      return {
        url: imageResponse.data[0].url,
        source: 'ai'
      };
    } catch (error) {
      console.log(`AI图片生成失败: ${error.message}，使用本地图片`);
    }
  }

  // 方案3: 最后备用 - 本地图片（带去重）
  const usedSet = new Set(recentImageUrls);
  // 先尝试按关键词匹配的图片
  const images = FALLBACK_IMAGES[siteId] || FALLBACK_IMAGES.audit;
  const available = images.filter(img => !usedSet.has(img));
  const pool = available.length > 0 ? available : images;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  console.log(`✓ 使用备用图片: ${picked}`);
  return { url: picked, source: 'fallback' };
}

// 使用LLM生成文章
async function generateArticleWithLLM(llmConfig, keyword, wordCount = 1000, siteId = null) {
  try {
    let endpoint = llmConfig.apiEndpoint;
    if (!endpoint.includes('/chat/completions')) {
      endpoint = endpoint.replace(/\/$/, '') + '/chat/completions';
    }
    
    const response = await axios.post(
      endpoint,
      {
        model: llmConfig.model || 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: (() => { const ctx = getSiteContext(siteId); return ctx.systemPrompt + '请严格按照要求的字数生成文章，不得少于要求字数的90%，内容要充实详细。'; })()
          },
          {
            role: 'user',
            content: (() => {
            const ctx = getSiteContext(siteId);
            return `请写一篇关于"${keyword}"的专业SEO文章，要求：
1. 字数必须达到${wordCount}字以上（不少于${Math.floor(wordCount * 0.9)}字），内容充实，多举实际案例
2. 标题吸引人，体现专业性和实用价值
3. 内容专业、深度，面向${ctx.topic}领域的专业读者
4. 自然融入关键词"${keyword}"（标题和正文中各出现2-3次）
5. 包含真实应用场景、数据引用和具体案例
6. 文章结构：引言（点出痛点）→ 4-5个主章节（每章节含2-3个子章节）→ 实践建议 → 总结
7. 直接输出规范 HTML 格式，使用以下标签：
   - <h2> 主章节标题（含编号，如：一、）
   - <h3> 子章节标题
   - <p> 段落正文（每段150字以上）
   - <strong> 关键术语加粗（每段1-2处）
   - <ul><li> 无序列表（功能特点、步骤等）
   - <ol><li> 有序列表（流程、步骤）
   - <blockquote> 引用数据或专家观点
8. 禁止使用 Markdown 语法（###、**、- 等），禁止输出 <html>/<head>/<body> 标签
9. 用 JSON 格式返回，包含 title 和 content 字段，content 为 HTML 字符串`;
          })()
          }
        ],
        temperature: 0.8,
        max_tokens: Math.max(4000, wordCount * 2),
      },
      {
        headers: {
          'Authorization': `Bearer ${llmConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 180000
      }
    );
    
    const content = response.data.choices[0].message.content;
    
    // 尝试解析JSON，并后处理 content 为规范 HTML
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // 如果不是JSON格式，尝试提取标题和内容
      const contentLines = content.split('\n').filter(line => line.trim());
      parsed = {
        title: contentLines[0].replace(/^#+\s*/, '').replace(/^["']|["']$/g, ''),
        content: contentLines.slice(1).join('\n\n')
      };
    }
    // 后处理：把 Markdown 或混合内容转为规范 HTML
    if (parsed && parsed.content) {
      parsed.content = cleanHtml(markdownToHtml(parsed.content));
    }
    return parsed;
  } catch (error) {
    console.error('LLM API调用失败:', error.message);
    throw error;
  }
}

// 生成AI原创文章
// existingArticles: 现有文章数组，用于图片去重
async function generateArticle(llmConfig = null, imageConfig = null, dedupConfig = null, wordCount = 1000, seoKeywords = null, existingArticles = [], siteId = null) {
  console.log('[generateArticle] 收到的imageConfig:', JSON.stringify(imageConfig));
  console.log('[generateArticle] dedupConfig:', JSON.stringify(dedupConfig));
  const keyword = pickRandomKeyword(seoKeywords);

  let articleData;

  // 生成文章内容
  if (llmConfig && llmConfig.apiKey && llmConfig.apiEndpoint) {
    try {
      articleData = await generateArticleWithLLM(llmConfig, keyword, wordCount, siteId);
    } catch (error) {
      console.error('使用配置的LLM失败，使用默认内容:', error.message);
      articleData = generateDefaultArticle(keyword, siteId);
    }
  } else {
    // 使用环境变量中的OpenAI配置
    try {
      const { OpenAI } = require('openai');
      const openai = new OpenAI();

      const articleResponse = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: '你是一名专注于AI合同审查和法律科技领域的专业内容创作者，请勿撰写与教育相关的内容。'
          },
          {
            role: 'user',
            content: `请写一篇关于"${keyword}"的SEO文章，要求：
1. 字数约${wordCount}字（误差±10%）
2. 包含吸引人的标题
3. 内容专业、实用，适合目标读者阅读
4. 自然融入关键词"${keyword}"
5. 包含实际应用场景和案例
6. **重要**：文章必须分段，每段3-5句话，段落之间用空行分隔
7. **重要**：使用\n\n来分隔段落，确保文章有清晰的段落结构
8. 以JSON格式返回，包含title和content字段，content中使用\n\n分隔段落`
          }
        ],
        temperature: 0.8,
      });

      articleData = JSON.parse(articleResponse.choices[0].message.content);
    } catch (error) {
      console.error('使用默认OpenAI失败:', error.message);
      articleData = generateDefaultArticle(keyword, siteId);
    }
  }

  // 构建最近已用图片列表（用于去重）
  const window = dedupConfig?.deduplicationWindow || 5;
  const enabled = dedupConfig?.enableImageDeduplication !== false;
  const recentImageUrls = enabled
    ? existingArticles.slice(0, window).map(a => a.imageUrl).filter(Boolean)
    : [];

  // 生成图片（优先Unsplash，备用AI生成，最后本地图片）
  const siteCtx = getSiteContext(siteId); const imageSearchQuery = siteCtx.imageQuery + " " + keyword; const imageData = await getUniqueArticleImage(imageSearchQuery, imageConfig, recentImageUrls, siteId);
  
  return {
    id: Date.now().toString(),
    title: articleData.title,
    content: articleData.content,
    imageUrl: imageData.url || imageData,  // 兼容旧格式
    imageSource: imageData.source,
    imageAuthor: imageData.author,
    imageAuthorUrl: imageData.authorUrl,
    imageUnsplashUrl: imageData.unsplashUrl,
    keyword: keyword,
    createdAt: new Date().toISOString(),
    published: true,
    type: 'ai_generated'  // 标记文章类型
  };
}

// 生成搜索改写文章
async function generateRewrittenArticle(llmConfig = null, imageConfig = null, rewriteRounds = 3, dedupConfig = null, seoKeywords = null, wordCount = 1000, rewritePrompt = null) {
  const keyword = pickRandomKeyword(seoKeywords);
  
  console.log(`\n========== 开始生成搜索改写文章 ==========`);
  console.log(`关键词: ${keyword}`);
  console.log(`改写轮数: ${rewriteRounds}`);
  
  try {
    // 1. 搜索相关文章
    console.log('\n步骤1: 搜索相关文章...');
    const articles = await searchAndFetchArticles(keyword, dedupConfig || {});
    
    if (!articles || articles.length === 0) {
      console.log('未找到相关文章，回退到AI原创生成');
      return await generateArticle(llmConfig, imageConfig, null, wordCount, seoKeywords);
    }
    
    // 2. 选择最佳文章
    console.log(`\n步骤2: 从 ${articles.length} 篇文章中选择最佳文章...`);
    const bestArticle = selectBestArticle(articles, keyword);
    console.log(`选中文章: ${bestArticle.title}`);
    console.log(`文章长度: ${bestArticle.length} 字`);
    console.log(`来源URL: ${bestArticle.url}`);
    
    // 记录已使用的URL
    const usedUrlsManager = require('./used-urls-manager');
    await usedUrlsManager.addUsedUrl(bestArticle.url, keyword);
    
    // 3. 深度改写文章
    console.log(`\n步骤3: 开始深度改写（${rewriteRounds}轮）...`);
    if (rewritePrompt) console.log('[改写] 使用自定义改写提示词');
    const rewrittenData = await rewriteArticle(
      bestArticle.content,
      keyword,
      llmConfig,
      rewriteRounds,
      wordCount,
      rewritePrompt
    );
    
    console.log(`\n改写完成！`);
    console.log(`新标题: ${rewrittenData.title}`);
    console.log(`新内容长度: ${rewrittenData.content.length} 字`);
    
    // 4. 生成图片（优先Unsplash，备用AI生成，最后本地图片）
    console.log(`\n步骤4: 生成配图...`);
    const imageData = await getUniqueArticleImage(keyword, imageConfig, [], siteId || null);
    
    console.log(`========== 搜索改写文章生成完成 ==========\n`);
    
    return {
      id: Date.now().toString() + '_rewritten',
      title: rewrittenData.title,
      content: rewrittenData.content,
      imageUrl: imageData.url || imageData,  // 兼容旧格式
      imageSource: imageData.source,
      imageAuthor: imageData.author,
      imageAuthorUrl: imageData.authorUrl,
      imageUnsplashUrl: imageData.unsplashUrl,
      keyword: keyword,
      createdAt: new Date().toISOString(),
      published: true,
      type: 'search_rewritten',  // 标记文章类型
      sourceUrl: bestArticle.url,  // 保存原文URL
      rewriteRounds: rewriteRounds  // 保存改写轮数
    };
  } catch (error) {
    console.error('搜索改写失败:', error.message);
    console.log('回退到AI原创生成');
    return await generateArticle(llmConfig, imageConfig, null, 1000, seoKeywords);
  }
}

// 批量生成文章（支持搜索改写）
async function generateArticles(config = {}) {
  const {
    llmConfig = null,
    imageConfig = null,
    enableSearchRewrite = false,
    rewriteRounds = 3,
    aiArticleCount = 1,
    rewriteArticleCount = 0,
    enableImageDeduplication = false,
    deduplicationWindow = 5,
    wordCount = 1000,
    seoKeywords = null,
    rewritePrompt = null
  } = config;
  
  // 构建去重配置对象
  const dedupConfig = {
    enableImageDeduplication,
    deduplicationWindow
  };
  
  const articles = [];
  const totalCount = aiArticleCount + rewriteArticleCount;
  
  console.log(`\n========== 开始批量生成文章 ==========`);
  console.log(`AI原创: ${aiArticleCount} 篇`);
  console.log(`搜索改写: ${rewriteArticleCount} 篇`);
  console.log(`总数量: ${totalCount} 篇`);
  
  let currentIndex = 0;
  
  // 生成AI原创文章
  for (let i = 0; i < aiArticleCount; i++) {
    currentIndex++;
    console.log(`\n[${currentIndex}/${totalCount}] 生成AI原创文章...`);
    const aiArticle = await generateArticle(llmConfig, imageConfig, dedupConfig, wordCount, seoKeywords);
    articles.push(aiArticle);
    console.log(`✓ AI原创文章生成完成: ${aiArticle.title}`);
    
    // 等待1秒，避免ID冲突
    if (currentIndex < totalCount) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // 生成搜索改写文章
  if (enableSearchRewrite && rewriteArticleCount > 0) {
    for (let i = 0; i < rewriteArticleCount; i++) {
      currentIndex++;
      console.log(`\n[${currentIndex}/${totalCount}] 生成搜索改写文章...`);
      const rewrittenArticle = await generateRewrittenArticle(llmConfig, imageConfig, rewriteRounds, dedupConfig, seoKeywords, wordCount, rewritePrompt);
      articles.push(rewrittenArticle);
      console.log(`✓ 搜索改写文章生成完成: ${rewrittenArticle.title}`);
      
      // 等待1秒，避免ID冲突
      if (currentIndex < totalCount) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } else if (rewriteArticleCount > 0) {
    console.log(`\n警告: 未启用搜索改写功能，但配置了改写文章数量，将被忽略`);
  }
  
  console.log(`\n========== 批量生成完成，共 ${articles.length} 篇 ==========\n`);
  
  return articles;
}

// 生成默认文章（当API失败时，合同审查主题）
function generateDefaultArticle(keyword, siteId = null) {
  const ctx = getSiteContext(siteId);

  const titleTemplates = {
    audit:   [`${keyword}：企业法务合规的智能化新路径`, `${keyword}在合同审查中的创新应用`, `如何用${keyword}提升企业合同风控效率`],
    shanyue: [`${keyword}：教育评测效率提升的新引擎`, `${keyword}在智能阅卷中的实践探索`, `${keyword}：让考试批改更快更准`],
    sec:     [`${keyword}：守护企业AI应用的安全防线`, `${keyword}在大模型治理中的关键作用`, `如何用${keyword}应对AI安全新挑战`],
    kb:      [`${keyword}：企业知识沉淀与传承的智能方案`, `${keyword}助力企业构建高效知识中台`, `${keyword}：让组织知识活起来`],
    fasium:  [`${keyword}：重塑时尚设计创作流程`, `${keyword}在服装设计领域的创意革命`, `${keyword}：AI赋能时尚新美学`],
  };
  const siteKey = SITE_CONTEXTS[siteId] ? siteId : 'audit';
  const titles = titleTemplates[siteKey] || titleTemplates.audit;
  const title = titles[Math.floor(Math.random() * titles.length)];

  // Build site-specific default content
  const domain = ctx.topic;
  const content = `<p>随着AI技术的深度渗透，<strong>${keyword}</strong>正在${domain}领域带来深刻变革。本文将从行业背景、核心价值、实践路径等维度，全面解析${keyword}的应用现状与未来趋势。</p>

<h2>一、${keyword}的行业背景与发展现状</h2>
<p>${domain}行业长期面临效率瓶颈、人力成本高企和专业人才短缺等挑战。<strong>${keyword}</strong>的兴起，为行业数字化转型提供了全新思路。根据行业数据，借助AI工具的企业在处理效率上平均提升40%以上，错误率显著降低。</p>
<p>当前，${keyword}已从概念验证走向规模化落地，头部企业纷纷将其纳入核心数字化战略。市场规模预计在未来三年内实现翻倍增长。</p>

<h2>二、${keyword}的核心价值</h2>
<h3>2.1 效率革命</h3>
<p><strong>${keyword}</strong>通过自动化处理大量重复性工作，将专业人员从繁琐任务中解放出来，聚焦高价值决策。实践表明，部署${keyword}后，团队整体产能提升30%-60%。</p>
<h3>2.2 质量提升</h3>
<p>AI系统不受情绪和疲劳影响，<strong>${keyword}</strong>能够保持高度一致的输出质量，减少人为失误，并通过持续学习不断优化判断标准。</p>
<h3>2.3 成本优化</h3>
<p>规模化部署${keyword}后，单位成本显著下降。企业可将节省的资源投入核心业务创新，形成良性循环。</p>

<h2>三、${keyword}的典型应用场景</h2>
<ul>
<li><strong>批量自动化处理</strong>：处理大量标准化任务，速度是人工的数十倍</li>
<li><strong>智能风险识别</strong>：通过机器学习模型发现潜在问题，提前预警</li>
<li><strong>辅助决策支持</strong>：提供数据驱动的建议，帮助专业人员做出更准确判断</li>
<li><strong>知识沉淀积累</strong>：自动归纳整理经验，形成可复用的知识资产</li>
</ul>

<h2>四、实施${keyword}的最佳实践</h2>
<h3>4.1 分阶段推进</h3>
<p>建议企业从试点项目入手，选择高频、标准化的场景优先落地<strong>${keyword}</strong>，积累经验后再逐步扩大覆盖范围。</p>
<h3>4.2 人机协同</h3>
<p>${keyword}不是替代人，而是放大人的能力。建立合理的人机分工机制，将AI擅长的处理交给系统，将需要判断和创造力的工作留给专业人员。</p>
<h3>4.3 持续迭代</h3>
<p>收集使用反馈，定期优化<strong>${keyword}</strong>模型和流程，确保系统持续适应业务需求变化。</p>

<h2>五、总结与展望</h2>
<p><strong>${keyword}</strong>正在成为${domain}领域不可或缺的基础设施。随着大模型技术的持续突破，其能力边界将不断扩展，为行业带来更深远的价值。</p>
<p>现在是企业拥抱${keyword}的最佳时机——早布局，早受益。选择合适的技术合作伙伴，制定清晰的实施路径，你的团队将在AI时代赢得显著竞争优势。</p>`;

  return { title, content };
}

// 测试LLM API配置
async function testLLMConfig(config) {
  try {
    // 如果endpoint不包含/chat/completions，自动补全
    let endpoint = config.apiEndpoint;
    if (!endpoint.includes('/chat/completions')) {
      endpoint = endpoint.replace(/\/$/, '') + '/chat/completions';
    }
    
    const response = await axios.post(
      endpoint,
      {
        model: config.model || 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: '请回复"测试成功"'
          }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );
    
    return {
      success: true,
      message: '连接成功',
      response: response.data.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error?.message || error.message
    };
  }
}

module.exports = {
  generateArticle,
  generateRewrittenArticle,
  generateArticles,
  testLLMConfig,
  getUnsplashImage
};
