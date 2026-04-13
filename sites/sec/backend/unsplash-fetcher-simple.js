const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * Unsplash图片获取器（简化版，只使用官方API）
 */
class UnsplashFetcher {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // 使用相对路径，适配任何部署目录
    this.dataDir = path.join(__dirname, 'data');
    this.imageDir = path.join(__dirname, 'public', 'images', 'articles', 'unsplash');
    this.usedImagesFile = path.join(this.dataDir, 'used-unsplash-images.json');
    
    // 确保目录存在
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.imageDir)) {
      fs.mkdirSync(this.imageDir, { recursive: true });
    }
    
    // 加载已使用的图片记录
    this.usedImages = this.loadUsedImages();
    
    console.log(`[Unsplash] 初始化完成，已使用图片数量: ${this.usedImages.size}`);
  }

  /**
   * 加载已使用的图片记录
   */
  loadUsedImages() {
    try {
      if (fs.existsSync(this.usedImagesFile)) {
        const data = JSON.parse(fs.readFileSync(this.usedImagesFile, 'utf8'));
        return new Set(data.usedImages || []);
      }
    } catch (error) {
      console.log(`[Unsplash] 加载记录失败: ${error.message}`);
    }
    return new Set();
  }

  /**
   * 保存已使用的图片记录
   */
  saveUsedImages(imageId) {
    try {
      let data = { usedImages: [], lastUpdated: null };
      if (fs.existsSync(this.usedImagesFile)) {
        const raw = JSON.parse(fs.readFileSync(this.usedImagesFile, 'utf8'));
        // 兼容旧格式（数组）和新格式（对象）
        if (Array.isArray(raw)) {
          data = { usedImages: raw, lastUpdated: null };
        } else if (raw && typeof raw === 'object') {
          data = raw;
          if (!Array.isArray(data.usedImages)) data.usedImages = [];
        }
      }
      
      if (!data.usedImages.includes(imageId)) {
        data.usedImages.push(imageId);
        data.lastUpdated = new Date().toISOString();
        fs.writeFileSync(this.usedImagesFile, JSON.stringify(data, null, 2));
        this.usedImages.add(imageId);
        console.log(`[Unsplash] 保存图片记录: ${imageId}`);
      }
    } catch (error) {
      console.error(`[Unsplash] 保存记录失败: ${error.message}`);
    }
  }

  /**
   * 翻译中文关键词为英文
   */
  translateKeyword(keyword) {
    const translations = {
      // AI安全相关
      'AI安全': 'AI security cybersecurity',
      '大模型安全': 'large language model security AI safety',
      'LLM安全': 'LLM security artificial intelligence',
      '人工智能安全': 'artificial intelligence security technology',
      '大语言模型安全': 'large language model safety guardrails',
      'AI输入安全': 'AI input security protection',
      'AI输出安全': 'AI output security filtering',
      '提示词注入': 'prompt injection attack security',
      'Prompt注入攻击': 'prompt injection cybersecurity hacking',
      'AI越狱': 'AI jailbreak security bypass',
      '大模型越狱': 'LLM jailbreak AI safety',
      'AI幻觉': 'AI hallucination artificial intelligence',
      '模型幻觉问题': 'AI hallucination model reliability',
      'AI数据泄露': 'AI data leakage security privacy',
      '大模型敏感信息泄露': 'AI sensitive data leak privacy',
      'AI对抗攻击': 'adversarial attack AI security',
      '对抗性输入': 'adversarial input machine learning security',
      '数据投毒攻击': 'data poisoning attack machine learning',
      'AI有害内容': 'AI harmful content moderation safety',
      'AI安全防护': 'AI security protection defense',
      '大模型护栏': 'AI guardrails safety alignment',
      'AI合规': 'AI compliance regulation governance',
      'AIGC安全': 'generative AI content security',
      'AI Agent安全': 'AI agent security autonomous systems',
      'RAG安全': 'retrieval augmented generation security',
      '向量数据库安全': 'vector database security AI',
      '企业AI安全': 'enterprise AI security business',
      'AI风险管理': 'AI risk management governance',
      '生成式AI安全': 'generative AI security safety',
      '大模型部署安全': 'AI deployment security infrastructure',
      'AI安全评测': 'AI security evaluation testing red team',
      '红队测试AI': 'AI red team testing security',
      'AI安全加固': 'AI security hardening protection',
      'LLM应用安全': 'LLM application security development'
    };
    
    return translations[keyword] || `${keyword} AI security technology`;
  }

  /**
   * 使用官方API搜索图片
   */
  async searchImages(keyword) {
    if (!this.apiKey) {
      throw new Error('未配置Unsplash API Key');
    }
    
    const englishKeyword = this.translateKeyword(keyword);
    console.log(`[Unsplash] 搜索图片: ${keyword} (${englishKeyword})`);
    
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: englishKeyword,
          per_page: 30,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${this.apiKey}`
        },
        timeout: 10000
      });
      
      if (response.data && response.data.results && response.data.results.length > 0) {
        console.log(`[Unsplash] 找到 ${response.data.results.length} 张图片`);
        return response.data.results;
      } else {
        throw new Error('未找到图片');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('API Key无效或已过期');
      }
      throw new Error(`API请求失败: ${error.message}`);
    }
  }

  /**
   * 下载图片到本地
   */
  async downloadImage(url, imageId) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });
      
      const filename = `${imageId}.jpg`;
      const localPath = path.join(this.imageDir, filename);
      
      fs.writeFileSync(localPath, response.data);
      console.log(`[Unsplash] 图片已下载: ${filename}`);
      
      return localPath;
    } catch (error) {
      throw new Error(`下载图片失败: ${error.message}`);
    }
  }

  /**
   * 获取唯一图片
   */
  async getUniqueImage(keyword) {
    console.log(`\n[Unsplash] ========== 获取唯一图片 ==========`);
    console.log(`[Unsplash] 关键词: ${keyword}`);
    console.log(`[Unsplash] 已使用图片数量: ${this.usedImages.size}`);
    
    // 搜索图片
    const images = await this.searchImages(keyword);
    
    // 过滤已使用的图片
    const availableImages = images.filter(img => !this.usedImages.has(img.id));
    
    if (availableImages.length === 0) {
      throw new Error('所有图片都已使用');
    }
    
    // 随机选择一张
    const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    console.log(`[Unsplash] 选择图片: ${selectedImage.id}`);
    console.log(`[Unsplash] 作者: ${selectedImage.user.name}`);
    
    // 下载图片
    const downloadUrl = selectedImage.urls.regular;
    const localPath = await this.downloadImage(downloadUrl, selectedImage.id);
    
    // 保存记录
    this.saveUsedImages(selectedImage.id);
    
    // 触发下载统计（Unsplash要求）
    if (selectedImage.links && selectedImage.links.download_location) {
      try {
        await axios.get(selectedImage.links.download_location, {
          headers: {
            'Authorization': `Client-ID ${this.apiKey}`
          }
        });
      } catch (error) {
        console.log(`[Unsplash] 下载统计失败（不影响使用）: ${error.message}`);
      }
    }
    
    const webPath = `/images/articles/unsplash/${selectedImage.id}.jpg`;
    
    console.log(`[Unsplash] ✓ 成功获取图片: ${webPath}`);
    
    // 添加UTM参数（Unsplash要求）
    const authorUrl = `${selectedImage.user.links.html}?utm_source=shanyue_ai&utm_medium=referral`;
    
    return {
      id: selectedImage.id,
      source: 'unsplash',
      url: downloadUrl,
      localPath: localPath,
      webPath: webPath,
      keyword: keyword,
      author: selectedImage.user.name,
      authorUrl: authorUrl,
      unsplashUrl: 'https://unsplash.com/?utm_source=shanyue_ai&utm_medium=referral'
    };
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalUsed: this.usedImages.size,
      source: 'unsplash'
    };
  }

  /**
   * 清空已使用的图片记录
   */
  clearUsedImages() {
    try {
      if (fs.existsSync(this.usedImagesFile)) {
        fs.unlinkSync(this.usedImagesFile);
        this.usedImages.clear();
        console.log('[Unsplash] ✓ 已清空图片使用记录');
        return true;
      }
    } catch (error) {
      console.error(`[Unsplash] 清空记录失败: ${error.message}`);
      return false;
    }
  }
}

module.exports = { UnsplashFetcher };
