const axios = require('axios');
const cheerio = require('cheerio');
const usedUrlsManager = require('./used-urls-manager');

/**
 * 文章搜索模块
 * 负责从网上搜索相关文章并提取内容
 */


// 使用百度搜索（中文内容效果最好）
async function searchArticlesWithBaidu(keyword) {
  try {
    const query = `AI安全 ${keyword}`;
    const searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}&rn=10`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://www.baidu.com/'
      },
      timeout: 15000
    });
    const $ = cheerio.load(response.data);
    const baiduLinks = [];

    // 百度搜索结果链接（包括百度跳转链接 baidu.com/link?url=...）
    $('h3.t a, .result h3 a, .c-title a').each((i, elem) => {
      if (baiduLinks.length >= 8) return;
      const href = $(elem).attr('href');
      if (href && href.startsWith('http')) {
        baiduLinks.push(href);
      }
    });

    // 跟随百度跳转链接，获取真实 URL
    const realUrls = [];
    for (const link of baiduLinks) {
      if (realUrls.length >= 6) break;
      try {
        if (link.includes('baidu.com/link') || link.includes('baidu.com/baidu.php')) {
          // 跟随重定向获取真实 URL
          const redirectResp = await axios.get(link, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 8000,
            maxRedirects: 5,
            validateStatus: status => status < 400
          });
          const finalUrl = redirectResp.request.res ? redirectResp.request.res.responseUrl : redirectResp.config.url;
          if (finalUrl && !finalUrl.includes('baidu.com')) {
            realUrls.push(finalUrl);
          }
        } else {
          realUrls.push(link);
        }
      } catch (e) {
        // 跳过无法访问的链接
      }
    }

    console.log(`百度搜索 "${keyword}" 找到 ${realUrls.length} 个有效链接`);
    return realUrls;
  } catch (error) {
    console.error('百度搜索失败:', error.message);
    return [];
  }
}


// 使用 DuckDuckGo HTML 搜索（无需 API key，免费）
async function searchArticlesWithDuckDuckGo(keyword) {
  try {
    const query = `AI安全 ${keyword}`;
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 15000
    });
    const $ = cheerio.load(response.data);
    const urls = [];
    $('a.result__a').each((i, elem) => {
      if (i < 8) {
        const url = $(elem).attr('href');
        if (url && url.startsWith('http') && !url.includes('duckduckgo.com')) {
          urls.push(url);
        }
      }
    });
    if (urls.length === 0) {
      $('h2.result__title a').each((i, elem) => {
        if (i < 8) {
          const url = $(elem).attr('href');
          if (url && url.startsWith('http')) urls.push(url);
        }
      });
    }
    console.log(`DuckDuckGo 搜索 "${keyword}" 找到 ${urls.length} 个链接`);
    return urls;
  } catch (error) {
    console.error('DuckDuckGo搜索失败:', error.message);
    return [];
  }
}

// 使用Bing搜索API（备用）（免费额度更高）
async function searchArticlesWithBing(keyword) {
  try {
    const query = `AI安全 ${keyword}`;
    const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`;

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 12000
    });

    const $ = cheerio.load(response.data);
    const urls = [];

    // 只过滤纯社交媒体（知乎内容丰富，保留）
    const blockedDomains = ['weibo.com', 'tieba.baidu.com', 'bilibili.com', 'twitter.com', 'facebook.com'];

    $('.b_algo h2 a').each((i, elem) => {
      if (urls.length >= 8) return;
      let url = $(elem).attr('href');
      if (!url) return;

      // 解析 Bing 重定向链接，提取真实 URL（Bing 的 u 参数是 base64 编码）
      if (url.includes('bing.com/ck/') || url.includes('bing.com/aclick')) {
        try {
          const urlObj = new URL(url);
          const uParam = urlObj.searchParams.get('u');
          if (uParam) {
            const decoded = Buffer.from(uParam.replace(/^a1/, ''), 'base64').toString('utf-8');
            if (decoded && decoded.startsWith('http')) {
              url = decoded;
            }
          }
        } catch (e) {
          return; // 解码失败，跳过
        }
      }

      if (!url.startsWith('http')) return;

      // 过滤纯社交媒体
      const isBlocked = blockedDomains.some(domain => url.includes(domain));
      if (!isBlocked) {
        urls.push(url);
      }
    });

    console.log(`Bing 搜索 "${keyword}" 找到 ${urls.length} 个有效链接`);
    return urls;
  } catch (error) {
    console.error('Bing搜索失败:', error.message);
    return [];
  }
}

// 使用Google自定义搜索（需要API key）
async function searchArticlesWithGoogle(keyword, apiKey, searchEngineId) {
  try {
    const query = `AI安全 ${keyword}`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=5`;
    
    const response = await axios.get(url, { timeout: 10000 });
    
    if (response.data && response.data.items) {
      return response.data.items.map(item => item.link);
    }
    
    return [];
  } catch (error) {
    console.error('Google搜索失败:', error.message);
    return [];
  }
}

// 抓取文章内容
async function fetchArticleContent(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 15000,
      maxContentLength: 1024 * 1024 * 5  // 限制5MB
    });
    
    const $ = cheerio.load(response.data);
    
    // 移除脚本、样式等无关内容
    $('script, style, nav, header, footer, aside, .ad, .advertisement').remove();
    
    // 尝试多种常见的文章容器选择器
    let content = '';
    const selectors = [
      // 知乎专用
      '.RichText',
      '.Post-RichTextContainer',
      '.AnswerItem .RichText',
      '.ContentItem-answerText',
      // CSDN 专用
      '#article_content',
      '.article_content',
      '.htmledit_views',
      // 微信公众号/腾讯
      '#js_content',
      '.rich_media_content',
      // 博客园
      '#cnblogs_post_body',
      // 51CTO
      '.article-detail',
      '.detail-content',
      // InfoQ
      '.article-preview',
      // 通用
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.article-body',
      '.news-content',
      '.blog-content',
      '.rich-text',
      '.text-content',
      '[class*="article"]',
      '[class*="content"]',
      'main',
      '#content',
      '#main-content'
    ];
    
    for (const selector of selectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text();
        break;
      }
    }
    
    // 如果没有找到特定容器，提取body中的段落
    if (!content || content.length < 200) {
      content = $('body p').map((i, el) => $(el).text()).get().join('\n\n');
    }
    
    // 清理内容
    content = content
      .replace(/\s+/g, ' ')  // 合并多余空格
      .replace(/\n{3,}/g, '\n\n')  // 合并多余换行
      .trim();
    
    // 提取标题
    let title = $('h1').first().text() || $('title').text() || '';
    title = title.trim();
    
    return {
      url,
      title,
      content,
      length: content.length
    };
  } catch (error) {
    console.error(`抓取文章失败 ${url}:`, error.message);
    return null;
  }
}

// 搜索并获取文章内容（主函数）
async function searchAndFetchArticles(keyword, config = {}) {
  try {
    console.log(`开始搜索关键词: ${keyword}`);
    
    let urls = [];
    
    // 优先使用Google搜索（如果配置了API key）
    if (config.googleApiKey && config.googleSearchEngineId) {
      urls = await searchArticlesWithGoogle(keyword, config.googleApiKey, config.googleSearchEngineId);
    }
    
    // 优先使用百度（中文内容最全）
    if (urls.length === 0) {
      urls = await searchArticlesWithBaidu(keyword);
      console.log(`百度搜索结果: ${urls.length} 个`);
    }

    // 备用 DuckDuckGo
    if (urls.length === 0) {
      urls = await searchArticlesWithDuckDuckGo(keyword);
      console.log(`DuckDuckGo 搜索结果: ${urls.length} 个`);
    }

    // 备用 Bing 爬取
    if (urls.length === 0) {
      urls = await searchArticlesWithBing(keyword);
      console.log(`Bing 搜索结果: ${urls.length} 个`);
    }
    
    if (urls.length === 0) {
      console.log('未找到相关文章');
      return [];
    }
    
    // 过滤已使用的URL
    const unusedUrls = await usedUrlsManager.filterUnusedUrls(urls);
    
    if (unusedUrls.length === 0) {
      console.log('所有搜索结果都已使用过，将重新使用已有 URL');
      unusedUrls.push(...urls.slice(0, 3));
    }
    
    console.log(`找到 ${unusedUrls.length} 篇未使用的文章，开始抓取内容...`);
    
    // 并发抓取文章内容
    const articles = await Promise.all(
      unusedUrls.map(url => fetchArticleContent(url))
    );
    
    // 过滤掉抓取失败或内容太短的文章
    const validArticles = articles.filter(article => 
      article && article.content && article.content.length > 150
    );
    
    console.log(`成功抓取 ${validArticles.length} 篇有效文章`);
    
    return validArticles;
  } catch (error) {
    console.error('搜索文章失败:', error.message);
    return [];
  }
}

// 选择最佳文章（内容最长且相关度最高）
function selectBestArticle(articles, keyword) {
  if (!articles || articles.length === 0) {
    return null;
  }
  
  // 计算相关度分数
  const scoredArticles = articles.map(article => {
    let score = 0;
    
    // 内容长度分数（500-2000字最佳）
    if (article.length >= 500 && article.length <= 2000) {
      score += 50;
    } else if (article.length > 2000 && article.length <= 3000) {
      score += 30;
    } else if (article.length > 3000) {
      score += 10;
    }
    
    // 关键词出现次数分数
    const keywordCount = (article.content.match(new RegExp(keyword, 'gi')) || []).length;
    score += Math.min(keywordCount * 5, 30);
    
    // 标题包含关键词加分
    if (article.title && article.title.includes(keyword)) {
      score += 20;
    }
    
    return {
      ...article,
      score
    };
  });
  
  // 按分数排序，返回最高分的文章
  scoredArticles.sort((a, b) => b.score - a.score);
  
  return scoredArticles[0];
}

module.exports = {
  searchAndFetchArticles,
  selectBestArticle,
  fetchArticleContent
};
