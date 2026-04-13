const axios = require('axios');
const { OpenAI } = require('openai');
const { searchAndFetchArticles, selectBestArticle } = require('./article-search');
const { rewriteArticle } = require('./article-rewriter');
const { UnsplashFetcher } = require('./unsplash-fetcher-simple');

// SEO关键词列表


// 本地图片库
const LOCAL_IMAGES = [
  '/images/articles/ai-classroom-1.jpg',
  '/images/articles/ai-classroom-2.jpg',
  '/images/articles/ai-grading-1.jpg',
  '/images/articles/ai-education-1.jpg',
  '/images/articles/teacher-ai-1.jpg'
];

// 获取本地图片（随机选择）
function getLocalImage(keyword) {
  // 根据关键词选择最相关的图片
  const keywordLower = keyword.toLowerCase();
  
  if (keywordLower.includes('阅卷') || keywordLower.includes('批改') || keywordLower.includes('grading')) {
    return '/images/articles/ai-grading-1.jpg';
  } else if (keywordLower.includes('课堂') || keywordLower.includes('classroom')) {
    return Math.random() > 0.5 ? '/images/articles/ai-classroom-1.jpg' : '/images/articles/ai-classroom-2.jpg';
  } else if (keywordLower.includes('教师') || keywordLower.includes('teacher')) {
    return '/images/articles/teacher-ai-1.jpg';
  } else {
    // 随机选择一张图片
    return LOCAL_IMAGES[Math.floor(Math.random() * LOCAL_IMAGES.length)];
  }
}

// 获取Unsplash免费图片（保留作为备用）
async function getUnsplashImage(keyword) {
  try {
    const response = await axios.get(`https://source.unsplash.com/800x600/?${encodeURIComponent(keyword)},education,technology`, {
      maxRedirects: 0,
      validateStatus: (status) => status === 302
    });
    return response.headers.location || `https://source.unsplash.com/800x600/?education`;
  } catch (error) {
    return `https://source.unsplash.com/800x600/?education`;
  }
}

// 获取唯一图片（Unsplash → AI生成 → 本地图片）
async function getUniqueArticleImage(keyword, imageConfig = null) {
  console.log(`\n获取文章配图: ${keyword}`);
  console.log(`imageConfig:`, imageConfig);
  
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
        prompt: `A professional, modern illustration about ${keyword} in education technology. Clean, minimalist design with blue and purple colors. Show AI and education elements in a harmonious way. NO text, NO logos, NO brand names, NO watermarks.`,
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
  const localImage = getLocalImage(keyword);
  console.log(`✓ 使用本地图片: ${localImage}`);
  return {
    url: localImage,
    source: 'local'
  };
}

// 使用LLM生成文章
async function generateArticleWithLLM(llmConfig, keyword, wordCount = 1000) {
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
            content: '你是一个专业的AI安全领域内容创作者，擅长撰写关于大模型安全、AI护栏、LLM安全防护等主题的SEO优化文章。'
          },
          {
            role: 'user',
            content: `请写一篇关于"${keyword}"的专业博客文稿，要求：

**1. 整体结构 (JSON格式):**
   - 'meta' (object): 包含 'category' (字符串, 如 "AI安全策略"), 'publishDate' (字符串, YYYY-MM-DD), 'readingTime' (字符串, 如 "5分钟阅读")
   - 'title' (string): 粗体、两行以内、有吸引力
   - 'author' (object): 包含 'name' (字符串), 'avatarUrl' (字符串, 固定为 "/images/authors/default.png"), 'position' (字符串, 如 "AI安全研究员")
   - 'mainImageUrl' (string): 留空字符串
   - 'body' (string): Markdown格式的正文
   - 'authorBio' (object): 包含 'name' (字符串), 'avatarUrl' (字符串, 固定为 "/images/authors/default.png"), 'bioText' (字符串, 2-3句作者简介)

**2. 正文 (body) 格式要求:**
   - 必须由多个H2小节组成 (用 ## 标记)。
   - 每个H2小节包含1-3个段落。
   - 必须包含至少一个对比示例，格式如下:
     **推荐做法:** 具体示例 - [说明正确做法]
     **错误做法:** 具体示例 - [说明错误做法]

**3. 内容要求:**
   - 语言专业、流畅，适合企业AI安全从业者和技术决策者阅读。
   - 自然融入关键词 "${keyword}"。
   - 包含实际应用场景和企业案例。
   - 总字数约 ${wordCount} 字（误差±10%）。

**4. 返回格式:**
   - 严格以JSON格式返回，不要包含任何额外的解释或markdown代码块标记。`
          }
        ],
        temperature: 0.8,
      },
      {
        headers: {
          'Authorization': `Bearer ${llmConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );
    
    const content = response.data.choices[0].message.content;
    
    // 尝试解析JSON（处理 markdown 代码块包裹的情况）
    function tryParseJSON(str) {
      str = str.trim();
      // 移除 markdown 代码块标记
      const codeBlockMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (codeBlockMatch) {
        str = codeBlockMatch[1].trim();
      }
      try {
        return JSON.parse(str);
      } catch (e) {
        // 尝试修复 body 字段中的裸换行符（JSON 中不允许字符串内有裸换行）
        // 找到 "body": "..." 的范围，将其中的裸换行替换为 \n
        const fixed = str.replace(
          /"body"\s*:\s*"((?:[^"\\]|\\[\s\S])*)"/,
          (match, bodyContent) => {
            const escaped = bodyContent.replace(/\r?\n/g, '\\n');
            return `"body": "${escaped}"`;
          }
        );
        try {
          return JSON.parse(fixed);
        } catch (e2) {
          return null;
        }
      }
    }
    
    const parsed = tryParseJSON(content);
    if (parsed && parsed.title) {
      return parsed;
    }
    
    // 最后 fallback：提取标题和内容
    const lines = content.split('\n')
      .filter(line => line.trim())
      .filter(line => !line.startsWith('```'))
      .filter(line => !line.match(/^[{}]$|^\s*"(title|content)"\s*:/));
    const titleLine = lines[0] || '无标题';
    return {
      title: titleLine.replace(/^#+\s*/, '').replace(/^["']|["']$/g, '').trim(),
      content: lines.slice(1).join('\n\n')
    };
  } catch (error) {
    console.error('LLM API调用失败:', error.message);
    throw error;
  }
}

// 生成AI原创文章
async function generateArticle(llmConfig = null, imageConfig = null, seoConfig = null, dedupConfig = null, wordCount = 1000) {
  console.log('[generateArticle] 收到的imageConfig:', JSON.stringify(imageConfig));
  
  // 从seoConfig获取关键词（支持逗号和顿号分隔）
  let keywords = [];
  if (seoConfig && seoConfig.keywords) {
    if (Array.isArray(seoConfig.keywords)) {
      keywords = seoConfig.keywords;
    } else {
      // 支持逗号和顿号分隔
      keywords = seoConfig.keywords.split(/[,，、]/).map(k => k.trim()).filter(k => k.length > 0);
    }
  }
  if (keywords.length === 0) {
    keywords = ['AI安全', '大模型安全']; // 默认关键词
  }
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  let articleData;
  let imageUrl;
  
  // 生成文章内容
  console.log("[DEBUG] llmConfig:", JSON.stringify(llmConfig));
  if (llmConfig && llmConfig.apiKey && llmConfig.apiEndpoint) {
    try {
      articleData = await generateArticleWithLLM(llmConfig, keyword, wordCount);
    } catch (error) {
      console.error('使用配置的LLM失败，使用默认内容:', error.message);
      articleData = generateDefaultArticle(keyword);
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
            content: '你是一个专业的AI安全领域内容创作者，擅长撰写关于大模型安全、AI护栏、LLM安全防护等主题的SEO优化文章。'
          },
          {
            role: 'user',
            content: `请写一篇关于"${keyword}"的专业博客文稿，要求：

**1. 整体结构 (JSON格式):**
   - 'meta' (object): 包含 'category' (字符串, 如 "AI安全策略"), 'publishDate' (字符串, YYYY-MM-DD), 'readingTime' (字符串, 如 "5分钟阅读")
   - 'title' (string): 粗体、两行以内、有吸引力
   - 'author' (object): 包含 'name' (字符串), 'avatarUrl' (字符串, 固定为 "/images/authors/default.png"), 'position' (字符串, 如 "AI安全研究员")
   - 'mainImageUrl' (string): 留空字符串
   - 'body' (string): Markdown格式的正文
   - 'authorBio' (object): 包含 'name' (字符串), 'avatarUrl' (字符串, 固定为 "/images/authors/default.png"), 'bioText' (字符串, 2-3句作者简介)

**2. 正文 (body) 格式要求:**
   - 必须由多个H2小节组成 (用 ## 标记)。
   - 每个H2小节包含1-3个段落。
   - 必须包含至少一个对比示例，格式如下:
     **推荐做法:** 具体示例 - [说明正确做法]
     **错误做法:** 具体示例 - [说明错误做法]

**3. 内容要求:**
   - 语言专业、流畅，适合企业AI安全从业者和技术决策者阅读。
   - 自然融入关键词 "${keyword}"。
   - 包含实际应用场景和企业案例。
   - 总字数约 ${wordCount} 字（误差±10%）。

**4. 返回格式:**
   - 严格以JSON格式返回，不要包含任何额外的解释或markdown代码块标记。`        }
        ],
        temperature: 0.8,
      });
      
      const rawContent2 = articleResponse.choices[0].message.content;
      const parsed2 = tryParseArticleJSON(rawContent2);
      articleData = parsed2 || generateDefaultArticle(keyword);
    } catch (error) {
      console.error('使用默认OpenAI失败:', error.message);
      articleData = generateDefaultArticle(keyword);
    }
  }
  
  // 生成图片（优先Unsplash，备用AI生成，最后本地图片）
  const imageData = await getUniqueArticleImage(keyword, imageConfig);
  
  return {
    id: Date.now().toString(),
    title: articleData.title,
    content: articleData.body, // 使用 body 字段作为正文
    meta: articleData.meta,
    author: articleData.author,
    authorBio: articleData.authorBio,
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
async function generateRewrittenArticle(llmConfig = null, imageConfig = null, seoConfig = null, rewriteRounds = 3, dedupConfig = null) {
  // 从seoConfig获取关键词（支持逗号和顿号分隔）
  let keywords = [];
  if (seoConfig && seoConfig.keywords) {
    if (Array.isArray(seoConfig.keywords)) {
      keywords = seoConfig.keywords;
    } else {
      keywords = seoConfig.keywords.split(/[,，、]/).map(k => k.trim()).filter(k => k.length > 0);
    }
  }
  if (keywords.length === 0) {
    keywords = ['AI安全', '大模型安全']; // 默认关键词
  }
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  console.log(`\n========== 开始生成搜索改写文章 ==========`);
  console.log(`关键词: ${keyword}`);
  console.log(`改写轮数: ${rewriteRounds}`);
  
  try {
    // 1. 搜索相关文章
    console.log('\n步骤1: 搜索相关文章...');
    const articles = await searchAndFetchArticles(keyword);
    
    if (!articles || articles.length === 0) {
      console.log('未找到相关文章，回退到AI原创生成');
      return await generateArticle(llmConfig, imageConfig);
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
    const rewrittenData = await rewriteArticle(
      bestArticle.content,
      keyword,
      llmConfig,
      rewriteRounds
    );
    
    console.log(`\n改写完成！`);
    console.log(`新标题: ${rewrittenData.title}`);
    console.log(`新内容长度: ${rewrittenData.content.length} 字`);
    
    // 4. 生成图片（优先Unsplash，备用AI生成，最后本地图片）
    console.log(`\n步骤4: 生成配图...`);
    const imageData = await getUniqueArticleImage(keyword, imageConfig);
    
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
    return await generateArticle(llmConfig, imageConfig);
  }
}

// 批量生成文章（支持搜索改写）
async function generateArticles(config = {}) {
  const {
    llmConfig = null,
    imageConfig = null,
    seoConfig = null,
    enableSearchRewrite = false,
    rewriteRounds = 3,
    aiArticleCount = 1,
    rewriteArticleCount = 0,
    enableImageDeduplication = false,
    deduplicationWindow = 5
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
    const aiArticle = await generateArticle(llmConfig, imageConfig, seoConfig, dedupConfig);
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
      const rewrittenArticle = await generateRewrittenArticle(llmConfig, imageConfig, seoConfig, rewriteRounds, dedupConfig);
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

// 生成默认文章（当API失败时）
function generateDefaultArticle(keyword) {
  const titles = [
    `${keyword}：企业AI安全的核心挑战`,
    `如何通过${keyword}构建可信赖的AI系统`,
    `${keyword}的技术原理与实践指南`,
    `探索${keyword}在大模型安全中的价值`,
    `${keyword}：保障AI应用安全的关键防线`
  ];
  
  const title = titles[Math.floor(Math.random() * titles.length)];
  
  const content = `随着大语言模型（LLM）在企业中的广泛部署，${keyword}已成为保障AI系统安全可靠运行的核心议题。企业在享受生成式AI带来的效率提升的同时，也面临着来自提示词注入、数据泄露、有害内容输出等多维度的安全风险。

${keyword}的核心价值在于为AI系统建立多层次的安全防护机制。通过输入过滤、输出审核和行为约束等技术手段，企业可以有效降低AI系统被滥用或产生不当输出的风险，确保AI应用符合合规要求和企业安全策略。

在实际应用场景中，${keyword}展现出了多方面的防护能力。首先，它能够识别并拦截恶意的提示词注入攻击，防止攻击者通过精心构造的输入绕过AI系统的安全限制。其次，通过语义分析和内容分类技术，系统能够实时检测并过滤有害、违规或敏感内容的输出。

许多头部企业已经将${keyword}纳入其AI治理框架。安全团队普遍反映，部署完善的AI安全防护体系后，AI应用的安全事件发生率显著下降，同时也提升了业务合规性和用户信任度。对于金融、医疗、法律等高监管行业而言，${keyword}更是AI合规部署的必要条件。

技术的进步不断推动${keyword}能力的提升。现代AI安全解决方案不仅能够处理已知的攻击模式，还能通过持续学习和红队测试发现新型威胁向量。结合大模型自身的对齐训练与外部护栏机制，企业可以构建更加健壮的AI安全防线。

当然，${keyword}并不是万能的银弹，而是AI安全体系中的重要组成部分。有效的AI安全治理需要将技术防护与流程管理、人员培训相结合，建立从模型选型、部署配置到运行监控的全生命周期安全管理机制。

展望未来，随着AI Agent和多模态大模型的快速发展，${keyword}面临的挑战将更加复杂。企业需要持续关注AI安全领域的最新研究进展，及时更新安全策略，以应对不断演进的威胁态势，确保AI系统在安全、可控的环境中为业务创造价值。`;

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
