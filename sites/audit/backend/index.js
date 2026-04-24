const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cron = require('node-cron');
const { generateCaptchaText, generateCaptchaSVG } = require('./captcha');
const { renewCertificate, getCertificateInfo } = require('./cert-manager');
const { generateArticle: generateArticleNew, generateArticles, testLLMConfig } = require('./article-generator');
const { sendToFeishuBot, syncToFeishuTable, ensureTableFields } = require('./feishu-integration');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DATA_DIR = path.join(__dirname, 'data');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// 验证码存储（使用内存，实际生产环境应使用Redis）
const captchaStore = new Map();

// 中间件
app.use(cors());
// 默认 100kb 对 WeChat QR 太小（base64 PNG 常在 50-200KB），提升到 5MB
app.use(express.json({ limit: '5mb' }));

// 静态文件服务 - 托管前端管理界面
app.use('/admin', express.static(path.join(__dirname, 'frontend')));
// 静态文件服务 - 托管下载的图片
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
// 静态文件服务 - 托管品牌资源（WeChat QR 等，所有 jotoai 站点共用）
app.use('/brand', express.static(path.join(__dirname, 'public', 'brand'), {
  maxAge: '5m',  // 短缓存，后台上传新 QR 后 5 分钟内全网同步
  setHeaders: (res) => res.setHeader('Access-Control-Allow-Origin', '*'),
}));

// 确保数据目录存在
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // 初始化配置文件
    try {
      await fs.access(CONFIG_FILE);
    } catch {
      await fs.writeFile(CONFIG_FILE, JSON.stringify({
        brandName: '您的品牌名称',
        brandDescription: '您的产品描述',
        adminTitle: '管理后台',
        email: '',
        autoPostEnabled: false,
        postsPerDay: 5,
        autoPostTime: '09:00',
        autoPostCount: 1,
        autoPostInterval: 24,
        enableSearchRewrite: false,
        rewriteRounds: 3,
        seoKeywords: 'AI阅卷,智能阅卷,自动阅卷,在线阅卷系统,AI批改作业,智能批改,教育AI,智能教育,阅卷系统,考试阅卷,作业批改系统,教学评估,智能评分,OCR识别,手写识别,教育数字化',
        adminUsername: 'admin',
        adminPassword: 'admin123',
        // LLM配置
        llmApiKey: 'ca3264ed-7342-4b88-b966-a725b293c18e',
        llmApiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3',
        llmModel: 'doubao-seed-1-8-251228',
        // 图片配置
        imageUseAI: false,
        imageApiKey: '',
        unsplashApiKey: '',
        // 飞书配置
        feishuWebhook: '',
        feishuTableUrl: 'https://vcn27jg8tmuq.feishu.cn/base/FniubotRna9gyvs5oDMcbJgPnnb?table=tblQCOffzrWGhHnP&view=vewiicVZHC',
        feishuAppId: '',
        feishuAppSecret: ''
      }, null, 2));
    }
    
    // 初始化文章文件
    try {
      await fs.access(ARTICLES_FILE);
    } catch {
      await fs.writeFile(ARTICLES_FILE, JSON.stringify([], null, 2));
    }
    
    // 初始化联系人文件
    try {
      await fs.access(CONTACTS_FILE);
    } catch {
      await fs.writeFile(CONTACTS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Error ensuring data directory:', error);
  }
}

// 读取配置
async function getConfig() {
  const defaultConfig = {
    brandName: '您的品牌名称',
    brandDescription: '您的产品描述',
    adminTitle: '管理后台',
    email: '',
    autoPostEnabled: false,
    postsPerDay: 5,
    autoPostTime: '09:00',
    autoPostCount: 1,
    autoPostInterval: 24,
    enableSearchRewrite: false,
    rewriteRounds: 3,
    seoKeywords: 'AI阅卷,智能阅卷,自动阅卷,在线阅卷系统,AI批改作业,智能批改,教育AI,智能教育,阅卷系统,考试阅卷,作业批改系统,教学评估,智能评分,OCR识别,手写识别,教育数字化',
    adminUsername: 'admin',
    adminPassword: 'admin123',
    llmApiKey: 'ca3264ed-7342-4b88-b966-a725b293c18e',
    llmApiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    llmModel: 'doubao-seed-1-8-251228',
    imageUseAI: false,
    imageApiKey: '',
    unsplashApiKey: '',
    feishuWebhook: '',
    feishuTableUrl: 'https://vcn27jg8tmuq.feishu.cn/base/FniubotRna9gyvs5oDMcbJgPnnb?table=tblQCOffzrWGhHnP&view=vewiicVZHC',
    feishuAppId: '',
    feishuAppSecret: ''
  };
  
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    const savedConfig = JSON.parse(data);
    // 合并默认配置和已保存配置，确保所有字段都存在
    return { ...defaultConfig, ...savedConfig };
  } catch (error) {
    return defaultConfig;
  }
}

// 保存配置
async function saveConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// 读取文章
async function getArticles() {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// 保存文章
async function saveArticles(articles) {
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
}

// 读取联系人
async function getContacts() {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// 保存联系人
async function saveContacts(contacts) {
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

// 生成SEO文章（使用OpenAI// 生成文章函数（使用新模块）
async function generateArticle() {
  const config = await getConfig();
  
  const llmConfig = config.llmApiKey && config.llmApiEndpoint ? {
    apiKey: config.llmApiKey,
    apiEndpoint: config.llmApiEndpoint,
    model: config.llmModel
  } : null;
  
  const imageConfig = {
    useAI: config.imageConfig?.useAI ?? config.imageUseAI,
    apiKey: config.imageConfig?.aiApiKey ?? config.imageApiKey,
    unsplashApiKey: config.imageConfig?.unsplashApiKey ?? config.unsplashApiKey
  };
  
  const wordCount = config.seoConfig?.articleWordCount ?? config.articleWordCount ?? 1000;
  const seoKeywords = config.seoConfig?.keywords || config.seoKeywords || null;

  // 获取已有文章用于图片去重
  const fs = require('fs');
  const path = require('path');
  let existingArticles = [];
  try {
    const articlesFile = path.join(__dirname, 'data', 'articles.json');
    if (fs.existsSync(articlesFile)) {
      existingArticles = JSON.parse(fs.readFileSync(articlesFile, 'utf8'));
    }
  } catch (e) { /* ignore */ }
  const dedupConfig = {
    enableImageDeduplication: config.imageConfig?.enableDeduplication ?? config.enableDeduplication ?? false,
    deduplicationWindow: config.imageConfig?.deduplicationWindow ?? config.deduplicationWindow ?? 5
  };
  return await generateArticleNew(llmConfig, imageConfig, dedupConfig, wordCount, seoKeywords, existingArticles);
}



// 发送邮件（Resend）
/**
 * 新联系表单提交的通用通知：发邮件 + 飞书机器人 + 飞书表格。
 * 被 /api/contact 和 /api/:site/contact 共用，保证任一入口都会通知管理员。
 *
 * @param {object} opts
 * @param {object} opts.config - getConfig() 返回值
 * @param {object} opts.contact - 已归一化的提交数据（含 name/email/phone/company/message）
 * @param {string} opts.siteName - 站点展示名（"唯客智审"）
 * @param {string} opts.siteHost - 站点主机名（"audit.jotoai.com"）
 * @param {string} [opts.sourceInfo] - 访问来源描述
 * @param {string} [opts.deviceType] - 客户端类型
 */
async function notifyNewContact({ config, contact, siteName, siteHost, sourceInfo = '直接访问', deviceType = 'unknown' }) {
  const recipient = config.email || config.emailConfig?.adminEmail;
  if (recipient) {
    const emailHtml = `
      <h2>📩 新的联系表单 —— ${siteName}</h2>
      <p><strong>来源站点：</strong>${siteName}（${siteHost}）</p>
      <p><strong>姓名：</strong>${contact.name || '-'}</p>
      <p><strong>公司/机构：</strong>${contact.school || contact.company || '-'}</p>
      <p><strong>邮箱：</strong>${contact.email || '-'}</p>
      <p><strong>电话：</strong>${contact.phone || '-'}</p>
      <p><strong>留言：</strong>${contact.message || '无'}</p>
      <hr>
      <p><strong>访问来源：</strong>${sourceInfo}</p>
      <p><strong>客户端类型：</strong>${deviceType}</p>
      <p><strong>提交时间：</strong>${new Date().toLocaleString('zh-CN')}</p>
    `;
    try {
      await sendEmail(recipient, `[${siteName}] 新的联系表单`, emailHtml);
    } catch (e) {
      console.error('[notifyNewContact] 邮件发送失败:', e.message);
    }
  }

  if (config.feishuWebhook) {
    try {
      await sendToFeishuBot(config.feishuWebhook, {
        ...contact,
        school: contact.school || contact.company || '-',
        source: sourceInfo,
      });
    } catch (e) {
      console.error('[notifyNewContact] 飞书机器人失败:', e.message);
    }
  }

  if (config.feishuAppId && config.feishuAppSecret && config.feishuTableUrl) {
    try {
      await syncToFeishuTable(config, {
        ...contact,
        school: contact.school || contact.company || '-',
        source: sourceInfo,
        deviceType,
      });
    } catch (e) {
      console.error('[notifyNewContact] 飞书表格同步失败:', e.message);
    }
  }
}

async function sendEmail(to, subject, html) {
  try {
    const config = await getConfig();
    const resendApiKey = config.emailConfig?.resendApiKey || process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log('Resend API Key 未配置，跳过邮件发送');
      return false;
    }

    const resend = new Resend(resendApiKey);
    const fromAddress = config.emailConfig?.from || 'noreply@mail.jotoai.com';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message || 'Resend 发送失败');
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// API路由

// 生成验证码
app.get('/api/captcha', (req, res) => {
  const captchaId = Date.now().toString() + Math.random().toString(36).substring(7);
  const captchaText = generateCaptchaText();
  
  // 存储验证码，5分钟后过期
  captchaStore.set(captchaId, {
    text: captchaText.toLowerCase(),
    expires: Date.now() + 5 * 60 * 1000
  });
  
  // 清理过期验证码
  for (const [key, value] of captchaStore.entries()) {
    if (value.expires < Date.now()) {
      captchaStore.delete(key);
    }
  }
  
  const svg = generateCaptchaSVG(captchaText);
  
  res.json({
    captchaId,
    svg: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  });
});

// 验证验证码
app.post('/api/verify-captcha', (req, res) => {
  const { captchaId, captchaText } = req.body;
  
  const stored = captchaStore.get(captchaId);
  
  if (!stored) {
    return res.json({ valid: false, message: '验证码已过期' });
  }
  
  if (stored.expires < Date.now()) {
    captchaStore.delete(captchaId);
    return res.json({ valid: false, message: '验证码已过期' });
  }
  
  if (captchaText.toLowerCase() !== stored.text) {
    return res.json({ valid: false, message: '验证码错误' });
  }
  
  // 验证成功后删除
  captchaStore.delete(captchaId);
  
  res.json({ valid: true });
});

// 管理员登录
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const config = await getConfig();
  
  // 支持新的admins数组格式，兼容旧的adminUsername/adminPassword格式
  let admins = config.admins || [];
  if (admins.length === 0 && config.adminPassword) {
    // 兼容旧格式：用adminUsername或email字段匹配
    admins = [{ email: email, password: config.adminPassword, name: config.adminUsername || 'admin', role: 'admin' }];
  }
  const admin = admins.find(a => a.email === email);

  if (!admin) {
    return res.status(401).json({ success: false, message: '邮箱或密码错误' });
  }
  
  // 检查密码（支持明文和加密两种格式）
  let passwordMatch = false;
  if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$')) {
    // 已加密的密码
    passwordMatch = await bcrypt.compare(password, admin.password);
  } else {
    // 明文密码（兼容旧数据）
    passwordMatch = (admin.password === password);
  }
  
  if (passwordMatch) {
    // 生成JWT token
    const token = jwt.sign(
      { 
        email: admin.email, 
        name: admin.name,
        role: admin.role || 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      token: token,
      needsPasswordChange: admin.needsPasswordChange || false,
      email: admin.email,
      name: admin.name
    });
  } else {
    res.status(401).json({ success: false, message: '邮箱或密码错误' });
  }
});

// 验证token
app.get('/api/admin/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ valid: false });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      valid: true,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    });
  } catch (error) {
    res.json({ valid: false });
  }
});

// Token验证中间件
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未提供认证token' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token无效或已过期' });
  }
}

// 获取配置
app.get('/api/admin/config', verifyToken, async (req, res) => {
  const config = await getConfig();
  // 返回扁平化的配置结构，方便前端使用
  res.json({
    // 品牌配置
    brandName: config.brandConfig?.name || '',
    brandDescription: config.brandConfig?.description || '',
    adminTitle: config.brandConfig?.adminTitle || '管理后台',
    emailSubjectPrefix: config.brandConfig?.emailSubjectPrefix || '',
    websiteUrl: config.brandConfig?.websiteUrl || '',
    
    // 邮件配置（Resend）
    email: config.emailConfig?.adminEmail || '',
    resendApiKey: config.emailConfig?.resendApiKey || '',
    emailFrom: config.emailConfig?.from || 'noreply@mail.jotoai.com',
    
    // 飞书配置（兼容根级别和嵌套结构）
    feishuWebhook: config.feishuConfig?.webhookUrl || config.feishuWebhook || '',
    feishuAppId: config.feishuConfig?.appId || config.feishuAppId || '',
    feishuAppSecret: config.feishuConfig?.appSecret || config.feishuAppSecret || '',
    feishuTableUrl: config.feishuConfig?.tableUrl || config.feishuTableUrl || '',
    
    // LLM配置
    llmApiKey: config.llmConfig?.apiKey || '',
    llmApiEndpoint: config.llmConfig?.baseURL || '',
    llmModel: config.llmConfig?.model || '',
    
    // 图片配置
    unsplashApiKey: config.imageConfig?.unsplashApiKey || '',
    imageUseAI: config.imageConfig?.useAI || false,
    imageApiKey: config.imageConfig?.aiApiKey || '',
    enableImageDeduplication: config.imageConfig?.enableDeduplication || false,
    deduplicationWindow: config.imageConfig?.deduplicationWindow || 5,
    
    // SEO配置
    autoPostEnabled: config.seoConfig?.autoPublish || false,
    autoPostTime: config.seoConfig?.publishTime || '09:00',
    autoPostInterval: config.seoConfig?.publishInterval || 24,
    postsPerDay: config.seoConfig?.postsPerDay || 5,
    aiArticleCount: config.seoConfig?.aiArticleCount || 1,
    rewriteArticleCount: config.seoConfig?.rewriteArticleCount || 0,
    enableSearchRewrite: config.seoConfig?.enableSearchRewrite || false,
    rewriteRounds: config.seoConfig?.rewriteRounds || 3,
    articleWordCount: config.seoConfig?.articleWordCount || 1000,
    seoKeywords: config.seoConfig?.keywords || '',
    tavilyConfig: config.tavilyConfig || {},
    tavilyApiKey: config.tavilyConfig?.apiKey || '',
    tavilyMaxResults: config.tavilyConfig?.maxResults || 5,
    rewritePrompt: config.seoConfig?.rewritePrompt || '',
    globalPrompt: config.globalPrompt || '',
    // AI 拟人化配置
    humanizerConfig: {
      enabled: config.humanizerConfig?.enabled || false,
      prompt: config.humanizerConfig?.prompt || '',
    },
    // 健康巡检配置
    monitorConfig: {
      enabled: config.monitorConfig?.enabled !== false,
      intervalMinutes: config.monitorConfig?.intervalMinutes || 30,
      cooldownHours: config.monitorConfig?.cooldownHours || 6,
      dailyReport: config.monitorConfig?.dailyReport !== false,
      reportTime: config.monitorConfig?.reportTime || '08:00',
      recipients: config.monitorConfig?.recipients || config.emailConfig?.adminEmail || '',
      urls: config.monitorConfig?.urls || (config.sites || []).map(s => s.url).filter(Boolean),
    },
  });
});

// 保存配置
app.post('/api/admin/config', verifyToken, async (req, res) => {
  const config = await getConfig();
  const data = req.body;
  
  // 更新品牌配置
  if (data.brandName !== undefined || data.brandDescription !== undefined || data.adminTitle !== undefined || data.emailSubjectPrefix !== undefined || data.websiteUrl !== undefined) {
    config.brandConfig = config.brandConfig || {};
    if (data.brandName !== undefined) config.brandConfig.name = data.brandName;
    if (data.brandDescription !== undefined) config.brandConfig.description = data.brandDescription;
    if (data.adminTitle !== undefined) config.brandConfig.adminTitle = data.adminTitle;
    if (data.emailSubjectPrefix !== undefined) config.brandConfig.emailSubjectPrefix = data.emailSubjectPrefix;
    if (data.websiteUrl !== undefined) config.brandConfig.websiteUrl = data.websiteUrl;
  }
  
  // 更新邮件配置（Resend）
  if (data.email !== undefined || data.resendApiKey !== undefined || data.emailFrom !== undefined) {
    config.emailConfig = config.emailConfig || {};
    if (data.email !== undefined) {
      config.emailConfig.adminEmail = data.email;
      config.email = data.email;
    }
    if (data.resendApiKey !== undefined) config.emailConfig.resendApiKey = data.resendApiKey;
    if (data.emailFrom !== undefined) config.emailConfig.from = data.emailFrom;
  }
  
  // 更新飞书配置
  if (data.feishuWebhook !== undefined) config.feishuWebhook = data.feishuWebhook;
  if (data.feishuAppId !== undefined) config.feishuAppId = data.feishuAppId;
  if (data.feishuAppSecret !== undefined) config.feishuAppSecret = data.feishuAppSecret;
  if (data.feishuTableUrl !== undefined) config.feishuTableUrl = data.feishuTableUrl;
  
  // 更新LLM配置
  if (data.llmApiKey !== undefined || data.llmApiEndpoint !== undefined || data.llmModel !== undefined) {
    config.llmConfig = config.llmConfig || {};
    if (data.llmApiKey !== undefined) config.llmConfig.apiKey = data.llmApiKey;
    if (data.llmApiEndpoint !== undefined) config.llmConfig.baseURL = data.llmApiEndpoint;
    if (data.llmModel !== undefined) config.llmConfig.model = data.llmModel;
  }
  
  // 更新图片配置
  if (data.unsplashApiKey !== undefined || data.imageUseAI !== undefined || data.imageApiKey !== undefined || data.enableImageDeduplication !== undefined || data.deduplicationWindow !== undefined) {
    config.imageConfig = config.imageConfig || {};
    if (data.unsplashApiKey !== undefined) config.imageConfig.unsplashApiKey = data.unsplashApiKey;
    if (data.imageUseAI !== undefined) config.imageConfig.useAI = data.imageUseAI;
    if (data.imageApiKey !== undefined) config.imageConfig.aiApiKey = data.imageApiKey;
    if (data.enableImageDeduplication !== undefined) config.imageConfig.enableDeduplication = data.enableImageDeduplication;
    if (data.deduplicationWindow !== undefined) config.imageConfig.deduplicationWindow = data.deduplicationWindow;
  }
  
  // 更新SEO配置
  if (data.autoPostEnabled !== undefined || data.autoPostTime !== undefined || data.autoPostInterval !== undefined || data.postsPerDay !== undefined || data.aiArticleCount !== undefined || data.rewriteArticleCount !== undefined || data.enableSearchRewrite !== undefined || data.rewriteRounds !== undefined || data.seoKeywords !== undefined || data.articleWordCount !== undefined || data.tavilyApiKey !== undefined || data.tavilyMaxResults !== undefined || data.rewritePrompt !== undefined) {
    config.seoConfig = config.seoConfig || {};
    if (data.autoPostEnabled !== undefined) config.seoConfig.autoPublish = data.autoPostEnabled;
    if (data.autoPostTime !== undefined) config.seoConfig.publishTime = data.autoPostTime;
    if (data.autoPostInterval !== undefined) config.seoConfig.publishInterval = data.autoPostInterval;
    if (data.postsPerDay !== undefined) config.seoConfig.postsPerDay = data.postsPerDay;
    if (data.aiArticleCount !== undefined) config.seoConfig.aiArticleCount = data.aiArticleCount;
    if (data.rewriteArticleCount !== undefined) config.seoConfig.rewriteArticleCount = data.rewriteArticleCount;
    if (data.enableSearchRewrite !== undefined) config.seoConfig.enableSearchRewrite = data.enableSearchRewrite;
    if (data.rewriteRounds !== undefined) config.seoConfig.rewriteRounds = data.rewriteRounds;
    if (data.seoKeywords !== undefined) config.seoConfig.keywords = data.seoKeywords;
    if (data.articleWordCount !== undefined) config.seoConfig.articleWordCount = data.articleWordCount;
    if (data.rewritePrompt !== undefined) config.seoConfig.rewritePrompt = data.rewritePrompt;
    // Tavily 在线搜索配置
    if (data.tavilyApiKey !== undefined || data.tavilyMaxResults !== undefined) {
      config.tavilyConfig = config.tavilyConfig || {};
      if (data.tavilyApiKey !== undefined) config.tavilyConfig.apiKey = data.tavilyApiKey;
      if (data.tavilyMaxResults !== undefined) config.tavilyConfig.maxResults = data.tavilyMaxResults;
    }
  }
  
  // 更新全局提示词
  if (data.globalPrompt !== undefined) config.globalPrompt = data.globalPrompt;

  // 更新 AI 拟人化配置
  if (data.humanizerEnabled !== undefined || data.humanizerPrompt !== undefined) {
    config.humanizerConfig = config.humanizerConfig || {};
    if (data.humanizerEnabled !== undefined) config.humanizerConfig.enabled = data.humanizerEnabled;
    if (data.humanizerPrompt !== undefined) config.humanizerConfig.prompt = data.humanizerPrompt;
  }

  // 更新健康巡检配置
  if (data.monitorEnabled !== undefined || data.monitorInterval !== undefined || data.monitorCooldown !== undefined || data.monitorReportEnabled !== undefined || data.monitorReportTime !== undefined || data.monitorRecipients !== undefined) {
    config.monitorConfig = config.monitorConfig || {};
    if (data.monitorEnabled !== undefined) config.monitorConfig.enabled = data.monitorEnabled;
    if (data.monitorInterval !== undefined) config.monitorConfig.intervalMinutes = data.monitorInterval;
    if (data.monitorCooldown !== undefined) config.monitorConfig.cooldownHours = data.monitorCooldown;
    if (data.monitorReportEnabled !== undefined) config.monitorConfig.dailyReport = data.monitorReportEnabled;
    if (data.monitorReportTime !== undefined) config.monitorConfig.reportTime = data.monitorReportTime;
    if (data.monitorRecipients !== undefined) config.monitorConfig.recipients = data.monitorRecipients;
    if (data.monitorUrls !== undefined) config.monitorConfig.urls = data.monitorUrls;
  }

  await saveConfig(config);
  res.json({ success: true });
});

// 修改密码
app.post('/api/admin/change-password', verifyToken, async (req, res) => {
  // 兼容前端两种字段名: oldPassword 或 currentPassword
  const { email: bodyEmail, oldPassword, currentPassword, newPassword } = req.body;
  const actualOldPassword = oldPassword || currentPassword;
  // 如果前端没传 email，从 JWT token 中获取
  const email = bodyEmail || req.user?.email;
  const config = await getConfig();

  const admins = config.admins || [];
  const adminIndex = admins.findIndex(a => a.email === email);

  if (adminIndex === -1) {
    return res.status(404).json({ success: false, message: '管理员不存在' });
  }

  // 支持 bcrypt hash 和明文两种格式的旧密码验证
  const stored = admins[adminIndex].password;
  let passwordMatch = false;
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$')) {
    passwordMatch = await bcrypt.compare(actualOldPassword, stored);
  } else {
    passwordMatch = (stored === actualOldPassword);
  }

  if (!passwordMatch) {
    return res.status(401).json({ success: false, message: '旧密码错误' });
  }

  // 新密码用 bcrypt 加密存储
  admins[adminIndex].password = await bcrypt.hash(newPassword, 10);
  admins[adminIndex].needsPasswordChange = false;
  config.admins = admins;

  await saveConfig(config);
  res.json({ success: true, message: '密码修改成功' });
});

// 获取管理员列表
app.get('/api/admin/admins', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 返回管理员信息（隐藏密码）
    const sanitizedAdmins = admins.map(admin => ({
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
      needsPasswordChange: admin.needsPasswordChange
    }));
    
    res.json({ success: true, admins: sanitizedAdmins });
  } catch (error) {
    res.status(500).json({ success: false, message: '获取管理员列表失败' });
  }
});

// 邀请新管理员
app.post('/api/admin/invite', verifyToken, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ success: false, message: '邮箱和姓名不能为空' });
    }
    
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 检查是否已存在
    if (admins.find(a => a.email === email)) {
      return res.status(400).json({ success: false, message: '该邮箱已被注册为管理员' });
    }
    
    // 生成临时密码（8位随机字符）
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    
    // 添加新管理员
    admins.push({
      email,
      name,
      password: tempPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      needsPasswordChange: true
    });
    
    config.admins = admins;
    await saveConfig(config);
    
    // 发送邀请邮件（Resend）
    const brandConfig = config.brandConfig;

    if (!config.emailConfig?.resendApiKey) {
      return res.status(500).json({ success: false, message: 'Resend API Key 未配置，无法发送邀请邮件' });
    }

    const websiteUrl = brandConfig?.websiteUrl || '';
    const brandName = brandConfig?.name || '管理后台';
    const loginUrl = websiteUrl ? `${websiteUrl}/login.html` : '（请在后台品牌配置中设置 websiteUrl）';

    await sendEmail(
      email,
      `${brandConfig?.emailSubjectPrefix || ''}${brandName} - 管理员邀请`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">欢迎加入 ${brandName}</h2>
          <p>你好 ${name}，</p>
          <p>你已被邀请成为 <strong>${brandName}</strong> 的管理员。</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>登录信息：</strong></p>
            <p style="margin: 5px 0;">邮箱：<code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${email}</code></p>
            <p style="margin: 5px 0;">临时密码：<code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${tempPassword}</code></p>
          </div>
          <p>请点击下方按钮登录管理后台：</p>
          <a href="${loginUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">登录管理后台</a>
          <p style="color: #ef4444; font-size: 14px;">⚠️ <strong>重要：</strong>首次登录后请立即修改密码！</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">如果按钮无法点击，请复制以下链接到浏览器：<br>${loginUrl}</p>
        </div>
      `
    );
    
    res.json({ success: true, message: '邀请邮件已发送' });
  } catch (error) {
    console.error('邀请管理员失败:', error);
    res.status(500).json({ success: false, message: '邀请失败: ' + error.message });
  }
});

// 删除管理员
app.post('/api/admin/remove', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: '邮箱不能为空' });
    }
    
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 不允许删除第一个管理员（主管理员）
    if (admins.length > 0 && admins[0].email === email) {
      return res.status(403).json({ success: false, message: '不能删除主管理员' });
    }
    
    const newAdmins = admins.filter(a => a.email !== email);
    
    if (newAdmins.length === admins.length) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }
    
    config.admins = newAdmins;
    await saveConfig(config);
    
    res.json({ success: true, message: '管理员已删除' });
  } catch (error) {
    console.error('删除管理员失败:', error);
    res.status(500).json({ success: false, message: '删除失败: ' + error.message });
  }
});

// 站点管理 API
app.get('/api/admin/sites', verifyToken, async (req, res) => {
  const config = await getConfig();
  res.json({ sites: config.sites || [] });
});

app.post('/api/admin/sites/add', verifyToken, async (req, res) => {
  const config = await getConfig();
  const { id, name, url, desc, icon, accent } = req.body;
  if (!id || !name || !url) return res.status(400).json({ success: false, error: '缺少必填字段' });
  if (!config.sites) config.sites = [];
  if (config.sites.find(s => s.id === id)) return res.status(400).json({ success: false, error: '站点已存在' });
  config.sites.push({ id, name, url, desc: desc || '', icon: icon || '', accent: accent || '#64748b' });
  // Create site data directory
  const siteDir = path.join(DATA_DIR, 'sites', id);
  try { await fs.mkdir(siteDir, { recursive: true }); } catch {}
  try { await fs.writeFile(path.join(siteDir, 'config.json'), JSON.stringify({ brandName: name, email: '' }, null, 2)); } catch {}
  try { await fs.writeFile(path.join(siteDir, 'articles.json'), '[]'); } catch {}
  try { await fs.writeFile(path.join(siteDir, 'contacts.json'), '[]'); } catch {}
  await saveConfig(config);
  res.json({ success: true, sites: config.sites });
});

app.delete('/api/admin/sites/:id', verifyToken, async (req, res) => {
  const config = await getConfig();
  config.sites = (config.sites || []).filter(s => s.id !== req.params.id);
  await saveConfig(config);
  res.json({ success: true, sites: config.sites });
});

// 测试LLM API配置
app.post('/api/admin/test-llm', verifyToken, async (req, res) => {
  try {
    const { apiKey, apiEndpoint, model } = req.body || {};
    if (!apiKey || !apiEndpoint) {
      return res.json({ success: false, message: '请提供 API Key 和 API Endpoint' });
    }
    const result = await testLLMConfig({ apiKey, apiEndpoint, model });
    res.json(result);
  } catch (error) {
    res.json({ success: false, message: error.message || '测试失败' });
  }
});

// 获取文章列表
app.get('/api/admin/articles', verifyToken, async (req, res) => {
  const articles = await getArticles();
  res.json(articles);
});

// 获取留言列表
// 合并根目录 data/contacts.json（/api/contact 老路径）+ 各站 data/sites/<site>/contacts.json
// （/api/:site/contact 新路径）。两个路径现在都会落盘，但只读根目录会漏掉所有 per-site 提交；
// translator（2026-04-17 接入）第一次暴露这个问题 —— 邮件/飞书能收到但后台列表永远空。
app.get('/api/admin/contacts', verifyToken, async (req, res) => {
  try {
    const root = await getContacts();
    const perSite = [];
    for (const site of SITES) {
      const filePath = getSitePaths(site).contacts;
      const list = await readSiteFile(filePath, []);
      perSite.push(...list);
    }
    const merged = [...root, ...perSite].sort(
      (a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0)
    );
    res.json(merged);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 批量删除留言的共用工具：给一组 id，扫根 + 所有 per-site 文件，命中即删。
// 每个文件只读写一次（不是每个 id 一次），N=数十 时比逐个 DELETE 请求快 10x+。
// 返回 { deleted: [...ids], notFound: [...ids], touchedFiles: [...relPaths] }
async function deleteContactsByIds(rawIds) {
  const wantIds = new Set((rawIds || []).map(String));
  if (!wantIds.size) return { deleted: [], notFound: [], touchedFiles: [] };

  const candidates = [CONTACTS_FILE, ...SITES.map(s => getSitePaths(s).contacts)];
  const deleted = new Set();
  const touchedFiles = [];

  for (const filePath of candidates) {
    let list;
    try { list = JSON.parse(await fs.readFile(filePath, 'utf8')); } catch { continue; }
    if (!Array.isArray(list)) continue;

    const kept = [];
    let fileTouched = false;
    for (const c of list) {
      const idStr = String(c.id);
      if (wantIds.has(idStr) && !deleted.has(idStr)) {
        deleted.add(idStr);
        fileTouched = true;
        continue;
      }
      kept.push(c);
    }

    if (fileTouched) {
      await fs.writeFile(filePath, JSON.stringify(kept, null, 2));
      touchedFiles.push(path.relative(DATA_DIR, filePath));
    }
  }

  const notFound = [...wantIds].filter(id => !deleted.has(id));
  return { deleted: [...deleted], notFound, touchedFiles };
}

// 删除单条留言（上述工具的便捷包装，保持 URL 兼容）
app.delete('/api/admin/contacts/:id', verifyToken, async (req, res) => {
  try {
    const result = await deleteContactsByIds([req.params.id]);
    if (result.deleted.length === 0) {
      return res.status(404).json({ success: false, error: 'contact not found' });
    }
    res.json({
      success: true,
      removedFrom: result.touchedFiles[0],
      removed: { id: result.deleted[0] },
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 批量删除留言
// body: { ids: [id1, id2, ...] }
app.post('/api/admin/contacts/batch-delete', verifyToken, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : null;
    if (!ids || !ids.length) {
      return res.status(400).json({ success: false, error: 'ids array required' });
    }
    const result = await deleteContactsByIds(ids);
    res.json({
      success: true,
      deletedCount: result.deleted.length,
      deleted: result.deleted,
      notFoundCount: result.notFound.length,
      notFound: result.notFound,
      touchedFiles: result.touchedFiles,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 生成文章
app.post('/api/admin/generate-article', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    
    // 准备LLM配置
    const llmConfig = config.llmApiKey && config.llmApiEndpoint ? {
      apiKey: config.llmApiKey,
      apiEndpoint: config.llmApiEndpoint,
      model: config.llmModel
    } : null;
    
    // 准备图片配置（优先使用嵌套的imageConfig，兼容旧的扁平结构）
    const imageConfig = {
      useAI: config.imageConfig?.useAI ?? config.imageUseAI,
      apiKey: config.imageConfig?.aiApiKey ?? config.imageApiKey,
      unsplashApiKey: config.imageConfig?.unsplashApiKey ?? config.unsplashApiKey
    };
    
    // 准备字数配置
    const wordCount = config.seoConfig?.articleWordCount ?? config.articleWordCount ?? 1000;
    
    const seoKeywords = config.seoConfig?.keywords || config.seoKeywords || null;

    console.log('[DEBUG] config.unsplashApiKey:', config.unsplashApiKey);
    console.log('[DEBUG] imageConfig:', imageConfig);
    console.log('[DEBUG] wordCount:', wordCount);
    console.log('[DEBUG] seoKeywords:', seoKeywords);

    // 获取已有文章用于图片去重
    const existingArticles = await getArticles();
    const dedupConfig = {
      enableImageDeduplication: config.imageConfig?.enableDeduplication ?? config.enableDeduplication ?? false,
      deduplicationWindow: config.imageConfig?.deduplicationWindow ?? config.deduplicationWindow ?? 5
    };
    console.log('[DEBUG] dedupConfig:', dedupConfig);

    const promptOverrides = { globalPrompt: config.globalPrompt || '' };
    const humanizerConfig = config.humanizerConfig || {};
    const article = await generateArticleNew(llmConfig, imageConfig, dedupConfig, wordCount, seoKeywords, existingArticles, null, promptOverrides, humanizerConfig);
    existingArticles.unshift(article);
    await saveArticles(existingArticles);
    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 生成搜索改写文章（手动触发）
app.post('/api/admin/generate-rewrite-article', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    
    // 准备LLM配置（优先使用嵌套的llmConfig）
    const llmConfig = config.llmConfig?.apiKey ? {
      apiKey: config.llmConfig.apiKey,
      apiEndpoint: config.llmConfig.baseURL,
      model: config.llmConfig.model
    } : (config.llmApiKey && config.llmApiEndpoint ? {
      apiKey: config.llmApiKey,
      apiEndpoint: config.llmApiEndpoint,
      model: config.llmModel
    } : null);
    
    if (!llmConfig) {
      return res.status(400).json({ success: false, error: '请先配置 LLM API' });
    }
    
    // 准备图片配置
    const imageConfig = {
      useAI: config.imageConfig?.useAI ?? config.imageUseAI,
      apiKey: config.imageConfig?.aiApiKey ?? config.imageApiKey,
      unsplashApiKey: config.imageConfig?.unsplashApiKey ?? config.unsplashApiKey
    };
    
    // 准备 Tavily 配置
    const tavilyConfig = (config.tavilyConfig && config.tavilyConfig.apiKey)
      ? config.tavilyConfig : null;
    
    const rewriteRounds = config.seoConfig?.rewriteRounds || config.rewriteRounds || 3;
    const wordCount = config.seoConfig?.articleWordCount ?? config.articleWordCount ?? 1000;

    console.log('[改写文章] 开始生成，改写轮数:', rewriteRounds, '字数:', wordCount);
    if (tavilyConfig) console.log('[改写文章] 使用 Tavily API 搜索');

    // 当请求中带 site 时，优先用站点的 SEO keywords，否则用全局
    const requestedSiteForKeywords = req.body?.site || null;
    let seoKeywords = config.seoConfig?.keywords || config.seoKeywords || null;
    if (requestedSiteForKeywords && SITES.includes(requestedSiteForKeywords)) {
      const siteCfg = await readSiteFile(getSitePaths(requestedSiteForKeywords).config, {});
      if (siteCfg?.seoKeywords) seoKeywords = siteCfg.seoKeywords;
    }
    const rewritePrompt = config.seoConfig?.rewritePrompt || null;

    // 获取已有文章用于图片去重
    const existingArticles = await getArticles();
    const dedupConfig2 = {
      enableImageDeduplication: config.imageConfig?.enableDeduplication ?? config.enableDeduplication ?? false,
      deduplicationWindow: config.imageConfig?.deduplicationWindow ?? config.deduplicationWindow ?? 5,
      tavilyConfig,
      googleApiKey: config.googleApiKey,
      googleSearchEngineId: config.googleSearchEngineId
    };

    // 使用 generateRewrittenArticle（已包含搜索+改写+配图完整流程）
    const { generateRewrittenArticle } = require('./article-generator');
    const humanizerConfig = config.humanizerConfig || null;
    const requestedSite = req.body?.site || null;  // 可选：指定站点
    const article = await generateRewrittenArticle(
      llmConfig,
      imageConfig,
      rewriteRounds,
      dedupConfig2,
      seoKeywords,
      wordCount,
      rewritePrompt,
      requestedSite,
      humanizerConfig
    );

    // 如指定 site，保存到该站点的 articles.json；否则全局
    if (requestedSite && SITES.includes(requestedSite)) {
      const siteArticlesPath = getSitePaths(requestedSite).articles;
      const siteArticles = await readSiteFile(siteArticlesPath, []);
      // 加入站点元数据
      article.site = requestedSite;
      article.status = 'published';
      const { enrichLegacyArticle } = require('./article-enrichment');
      const enriched = article.schemaVersion ? article : enrichLegacyArticle(article);
      siteArticles.unshift(enriched);
      await fs.writeFile(siteArticlesPath, JSON.stringify(siteArticles, null, 2));
      console.log(`[改写文章] 已保存到站点 ${requestedSite} (${siteArticles.length} 篇)`);
    } else {
      existingArticles.unshift(article);
      await saveArticles(existingArticles);
    }

    res.json({ success: true, article });
  } catch (error) {
    console.error('[改写文章] 失败:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除文章
app.delete('/api/admin/articles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  let articles = await getArticles();
  articles = articles.filter(a => a.id !== id);
  await saveArticles(articles);
  res.json({ success: true });
});

// 获取公开文章列表（用于前端展示）
app.get('/api/articles', async (req, res) => {
  const articles = await getArticles();
  const published = articles.filter(a => a.published);
  res.json(published);
});

// 设备类型检测函数
function detectDevice(userAgent) {
  if (!userAgent) return '未知';
  
  const ua = userAgent.toLowerCase();
  
  // 检测移动设备
  if (/(android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini)/i.test(ua)) {
    if (/(ipad|tablet|playbook|silk)/i.test(ua)) {
      return '平板';
    }
    return '手机';
  }
  
  // 默认为电脑
  return '电脑';
}

// 提交联系表单
app.post('/api/contact', async (req, res) => {
  try {
    const { captchaId, captchaText, captcha, ...contactData } = req.body;

    // 兼容两种字段名：captchaText（新）和 captcha（旧）
    const userCaptcha = captchaText || captcha;

    // 校验公司/机构名称为必填
    if (!contactData.company || typeof contactData.company !== 'string' || !contactData.company.trim()) {
      return res.status(400).json({ success: false, error: '请填写公司或机构名称' });
    }

    // 验证验证码（强制要求）
    if (!captchaId || !userCaptcha) {
      return res.status(400).json({ success: false, error: '请输入验证码' });
    }

    const stored = captchaStore.get(captchaId);
    if (!stored || stored.expires < Date.now()) {
      return res.status(400).json({ success: false, error: '验证码错误或已过期' });
    }
    if (stored.text !== userCaptcha.toLowerCase()) {
      return res.status(400).json({ success: false, error: '验证码错误或已过期' });
    }
    // 验证成功后删除验证码
    captchaStore.delete(captchaId);
    
    const config = await getConfig();
    
    // 检测设备类型
    const userAgent = req.headers['user-agent'];
    const deviceType = detectDevice(userAgent);
    
    // 构造来源信息（支持UTM参数）
    let sourceInfo = '直接访问';
    let trafficType = 'direct'; // direct, organic, paid
    let utmData = {};
    
    if (contactData.trafficSource) {
      const ts = contactData.trafficSource;
      // 兼容两种字段命名：前端传 source/medium/campaign/keyword，或标准 utm_source/utm_medium 等
      utmData = {
        utm_source: ts.utm_source || ts.source || '',
        utm_medium: ts.utm_medium || ts.medium || '',
        utm_campaign: ts.utm_campaign || ts.campaign || '',
        utm_term: ts.utm_term || ts.keyword || '',
        utm_content: ts.utm_content || '',
        referrer: ts.referrer || ''
      };
      
      // 判断流量类型
      const source = (utmData.utm_source || '').toLowerCase();
      const medium = (utmData.utm_medium || '').toLowerCase();
      const referrer = (utmData.referrer || '').toLowerCase();
      
      // 搜索引擎列表
      const searchEngines = ['baidu', 'google', 'bing', 'sogou', 'so.com', 'sm.cn', 'yandex', 'duckduckgo', 'yahoo'];
      const isSearchEngine = searchEngines.some(se => source.includes(se));
      
      // referrer 中的搜索引擎识别（当 utm_source 为空时使用）
      const referrerEngineMap = {
        'baidu.com': 'Baidu', 'google.': 'Google', 'bing.com': 'Bing',
        'sogou.com': 'Sogou', 'so.com': '360搜索', 'sm.cn': '神马搜索',
        'yahoo.com': 'Yahoo', 'yandex.': 'Yandex', 'duckduckgo.com': 'DuckDuckGo'
      };
      
      // 付费广告判断（优先级最高）：medium 包含 cpc/ppc/paid/ad，或 source 是百度且 medium 不为空
      const isPaid = medium.includes('cpc') || medium.includes('ppc') ||
                     medium.includes('paid') || medium.includes('ad') ||
                     (source.includes('baidu') && medium && medium !== 'organic');
      
      if (isPaid) {
        trafficType = 'paid';
        const sourceName = utmData.utm_source || '未知';
        sourceInfo = `💰 ${sourceName} 广告`;
      } else if (source && isSearchEngine) {
        trafficType = 'organic';
        sourceInfo = `🔍 ${utmData.utm_source} 自然搜索`;
      } else if (source) {
        trafficType = 'referral';
        sourceInfo = `🔗 ${utmData.utm_source}`;
      } else if (referrer) {
        // utm_source 为空时，尝试从 referrer 识别搜索引擎
        let detectedEngine = null;
        for (const [domain, name] of Object.entries(referrerEngineMap)) {
          if (referrer.includes(domain)) {
            detectedEngine = name;
            break;
          }
        }
        if (detectedEngine) {
          trafficType = 'organic';
          sourceInfo = `🔍 ${detectedEngine} 自然搜索`;
          utmData.utm_source = detectedEngine.toLowerCase();
          utmData.utm_medium = 'organic';
        } else {
          trafficType = 'referral';
          try {
            sourceInfo = `🔗 ${new URL(utmData.referrer).hostname.replace('www.', '')}`;
          } catch {
            sourceInfo = `🔗 ${utmData.referrer}`;
          }
        }
      }
      
      // 添加详细信息
      if (utmData.utm_campaign) {
        sourceInfo += ` / ${utmData.utm_campaign}`;
      }
      if (utmData.utm_term) {
        sourceInfo += ` / ${utmData.utm_term}`;
      }
    }
    
    // 识别来源站点
    const SITE_MAP = {
      'audit.jotoai.com':        '唯客智审',
      'shanyue.jotoai.com':      '闪阅',
      'sec.jotoai.com':          '唯客 AI 护栏',
      'kb.jotoai.com':           '唯客知识中台',
      'fasium.jotoai.com':       'FasiumAI',
      'fasium-ai.jotoai.com':    'FasiumAI',
      'loop.jotoai.com':         'Loop',
      'note.jotoai.com':         'NoteFlow',
      'translator.jototech.cn':  'JOTO Translator',
    };
    // Host → siteId 反查（用于找到站级飞书表格 URL；/api/contact 老路径没带 :site）。
    const HOST_TO_SITE = {
      'audit.jotoai.com':        'audit',
      'shanyue.jotoai.com':      'shanyue',
      'sec.jotoai.com':          'sec',
      'kb.jotoai.com':           'kb',
      'fasium.jotoai.com':       'fasium',
      'fasium-ai.jotoai.com':    'fasium',
      'loop.jotoai.com':         'loop',
      'note.jotoai.com':         'noteflow',
      'translator.jototech.cn':  'translator',
    };
    const hostHeader = (req.headers['x-forwarded-host'] || req.headers.host || '').replace(/:\d+$/, '');
    const siteName = SITE_MAP[hostHeader] || hostHeader || '未知站点';
    const siteIdForFeishu = HOST_TO_SITE[hostHeader];

    // 保存到文件
    const contacts = await getContacts();
    contacts.unshift({
      ...contactData,
      site: siteName,
      siteHost: hostHeader,
      source: sourceInfo,
      trafficType: trafficType,
      utmData: utmData,
      deviceType: deviceType,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString()
    });
    await saveContacts(contacts);

    // 通知（邮件 + 飞书），与 /api/:site/contact 共用逻辑避免漏发。
    // 如果能从 host 反查到 site，就用 merged config（读站级 feishuTableUrl）；
    // 否则退回全局 config。
    const notifyConfig = siteIdForFeishu && SITES.includes(siteIdForFeishu)
      ? await getMergedSiteConfig(siteIdForFeishu)
      : config;
    await notifyNewContact({
      config: notifyConfig,
      contact: contactData,
      siteName,
      siteHost: hostHeader,
      sourceInfo,
      deviceType,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 来源统计
app.post('/api/analytics', async (req, res) => {
  // 这里可以保存统计数据到数据库或文件
  console.log('Analytics:', req.body);
  res.json({ success: true });
});

// 定时任务：每天自动生成文章
// 测试 Tavily API 连接
app.post('/api/admin/test-tavily', verifyToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ success: false, message: '请提供 Tavily API Key' });
    }
    const axios = require('axios');
    const response = await axios.post(
      'https://api.tavily.com/search',
      {
        api_key: apiKey,
        query: 'AI教育 智能阅卷',
        search_depth: 'basic',
        max_results: 3
      },
      { timeout: 10000 }
    );
    const results = response.data?.results || [];
    res.json({ success: true, resultCount: results.length, message: 'Tavily API 连接成功' });
  } catch (error) {
    const msg = error.response?.data?.message || error.message || '连接失败';
    res.status(500).json({ success: false, message: msg });
  }
});

// 7 个内容站 — translator 是合作方控制，不纳入自动发布
const CONTENT_SITES = ['audit', 'shanyue', 'sec', 'kb', 'fasium', 'loop', 'noteflow'];

async function scheduleArticleGeneration() {
  const config = await getConfig();

  // 读取 seoConfig 中的自动发布开关（管理界面保存在此处）
  var autoPublishEnabled = (config.seoConfig && config.seoConfig.autoPublish) ? true : (config.autoPostEnabled || false);
  if (!autoPublishEnabled) {
    console.log("[定时发布] 自动发布未启用，跳过");
    return;
  }

  console.log('\n========== 开始自动发布文章（按站点分发） ==========');

  // ---- 全局共用配置 ----
  const _llmKey = config.llmConfig?.apiKey || config.llmApiKey || "";
  const _llmUrl = config.llmConfig?.baseURL || config.llmApiEndpoint || "";
  const _llmModel = config.llmConfig?.model || config.llmModel || "";
  const llmConfig = (_llmKey && _llmUrl)
    ? { apiKey: _llmKey, apiEndpoint: _llmUrl, model: _llmModel }
    : null;

  const imageConfig = {
    useAI: config.imageConfig?.useAI ?? config.imageUseAI ?? false,
    apiKey: config.imageConfig?.aiApiKey ?? config.imageApiKey ?? "",
    unsplashApiKey: config.imageConfig?.unsplashApiKey ?? config.unsplashApiKey ?? ""
  };

  const _aiCount = config.seoConfig?.aiArticleCount ?? config.aiArticleCount ?? 1;
  const _rewriteCount = config.seoConfig?.rewriteArticleCount ?? config.rewriteArticleCount ?? 0;
  const _enableRewrite = config.seoConfig?.enableSearchRewrite ?? config.enableSearchRewrite ?? false;
  const _rewriteRounds = config.seoConfig?.rewriteRounds ?? config.rewriteRounds ?? 3;
  const _wordCount = config.seoConfig?.articleWordCount ?? config.articleWordCount ?? 1000;
  const _tavilyApiKey = config.tavilyConfig?.apiKey || "";
  const _tavilyMaxResults = config.tavilyConfig?.maxResults || 5;
  const _globalSeoKeywords = config.seoConfig?.keywords || config.seoKeywords || null;
  const _globalRewritePrompt = config.seoConfig?.rewritePrompt || null;

  console.log("[定时发布] LLM:", _llmKey ? `已配置(${_llmModel})` : "未配置");
  console.log("[定时发布] Tavily:", _tavilyApiKey ? "已配置" : "未配置（用 Bing 爬取）");
  console.log("[定时发布] 图片:", imageConfig.unsplashApiKey ? "Unsplash 已配置" : "未配置");
  console.log(`[定时发布] 每站点目标: AI 原创=${_aiCount} + 改写=${_rewriteCount} = ${_aiCount + _rewriteCount} 篇`);
  console.log(`[定时发布] 内容站数量: ${CONTENT_SITES.length}，预计总产出: ${CONTENT_SITES.length * (_aiCount + _rewriteCount)} 篇`);

  const { enrichLegacyArticle } = require('./article-enrichment');
  const summary = { total: 0, perSite: {}, errors: {} };

  // ---- 按站点循环生成 + 写入 per-site articles.json ----
  for (const site of CONTENT_SITES) {
    try {
      console.log(`\n[定时发布] ── ${site} (${SITE_NAMES[site] || site}) ──`);

      // 读站点独有的 prompt / keywords 覆盖（可选）
      const siteConfig = await readSiteFile(getSitePaths(site).config, {});
      const siteSeoKeywords = siteConfig.seoKeywords || _globalSeoKeywords;
      const siteRewritePrompt = siteConfig.rewritePrompt || _globalRewritePrompt;
      // 关键：把 siteId + systemPrompt/globalPrompt 传进去，否则 generateArticle 内部
      // 会 fallback 到 DEFAULT_SITE_CONTEXT，标题模板 fallback 到 'audit'（"合同风控"句式）
      // 导致所有站的文章主题都变成"合同审查/法务合规"。参考 commit（修 per-site 污染）。
      const sitePromptOverrides = {
        systemPrompt: siteConfig.systemPrompt || '',
        globalPrompt: config.globalPrompt || ''
      };

      const newArticles = await generateArticles({
        llmConfig,
        imageConfig,
        enableSearchRewrite: _enableRewrite,
        rewriteRounds: _rewriteRounds,
        aiArticleCount: _aiCount,
        rewriteArticleCount: _rewriteCount,
        wordCount: _wordCount,
        seoKeywords: siteSeoKeywords,
        rewritePrompt: siteRewritePrompt,
        tavilyConfig: _tavilyApiKey ? { apiKey: _tavilyApiKey, maxResults: _tavilyMaxResults } : null,
        siteId: site,
        promptOverrides: sitePromptOverrides,
        humanizerConfig: config.humanizerConfig || null
      });

      // 打 site/status 标签 + enrich + 写 per-site 文件
      const siteArticlesPath = getSitePaths(site).articles;
      const existing = await readSiteFile(siteArticlesPath, []);
      for (const article of newArticles) {
        article.site = site;
        article.status = article.status || 'published';
        if (!article.id) article.id = Date.now() + Math.floor(Math.random() * 1000);
        const enriched = article.schemaVersion ? article : enrichLegacyArticle(article);
        existing.unshift(enriched);
      }
      await fs.writeFile(siteArticlesPath, JSON.stringify(existing, null, 2));

      summary.perSite[site] = newArticles.length;
      summary.total += newArticles.length;
      console.log(`[定时发布] ✓ ${site}: +${newArticles.length} 篇（累计 ${existing.length} 篇）`);
    } catch (err) {
      summary.perSite[site] = 0;
      summary.errors[site] = err.message;
      console.error(`[定时发布] ✗ ${site}: ${err.message}`);
    }
  }

  // ---- 汇总 ----
  console.log(`\n========== 自动发布完成：共 ${summary.total} 篇 ==========`);
  for (const site of CONTENT_SITES) {
    const n = summary.perSite[site] || 0;
    const err = summary.errors[site];
    console.log(`  ${site.padEnd(10)}: ${n} 篇${err ? ` [错误: ${err}]` : ''}`);
  }
  console.log('');
}

// ========== 站点健康巡检 ==========
// 默认巡检清单从 config.sites（管理员后台维护）动态读取，不再硬编码。
// 2026-04-17 translator 接入后曾因没加入硬编码清单导致后台显示"未知/异常"。
// 以后通过"站点管理"加新站，cron/巡检/每日报表都自动覆盖。

/**
 * 判断返回的 HTML 是否是"真白屏/坏掉" —— 用多条启发式规则而不是单一字节阈值。
 * 返回 issue 字符串表示坏掉，返回 null 表示正常。
 *
 * 正常场景能通过：
 *   - SSR 页面，体积 > ~1KB（audit/kb 等 Next.js 站）
 *   - SPA 外壳有 JS bundle 链接（哪怕 shell 只有 400B —— 如 translator）
 *   - 有 <meta name="description"> 或 <title> 等真内容信号
 * 拦下来的是：
 *   - 完全空 HTML
 *   - <div id="root"></div> 但没任何 script 引用（SPA build 出错）
 *   - 含已知错误标记（ChunkLoadError / Application error 等）
 */
function assessHtmlHealth(body) {
  const size = body.length;

  // 已知错误标记最优先
  const marker = HEALTH_ERROR_MARKERS.find(m => body.includes(m));
  if (marker) return `错误: "${marker}"`;

  // 几乎空白：极低体积且无 HTML 结构
  if (size < 200) return `HTML 过小(${size}B)，疑似白屏`;

  // 有 JS bundle 脚本 → 是正常 SPA 外壳，无论多小
  const hasJsBundle = /<script[^>]+src=/i.test(body);
  if (hasJsBundle) return null;

  // 有实质内容（真正的 SSR/静态页）
  const hasRealContent = /<(?:h1|h2|p|article|main|section|header)[\s>]/i.test(body);
  if (hasRealContent && size >= 500) return null;

  // 有 meta description（SEO 页）
  const hasMeta = /<meta[^>]+name=["']description["']/i.test(body);
  if (hasMeta && size >= 400) return null;

  // 都不符合 → 可疑
  return `HTML 过小(${size}B)，疑似白屏`;
}

async function runHealthCheck(customUrls) {
  let urlList;
  if (customUrls && customUrls.length) {
    urlList = customUrls.map(url => { const u = new URL(url); return { site: u.hostname + (u.pathname !== '/' ? u.pathname.split('?')[0] : ''), url }; });
  } else {
    const config = await getConfig();
    urlList = (config.sites || []).map(s => ({ site: s.id, url: s.url })).filter(x => x.url);
  }
  const results = await Promise.all(
    urlList.map(async ({ site, url }) => {
      const start = Date.now();
      try {
        const c = new AbortController();
        const timer = setTimeout(() => c.abort(), 8000);
        const r = await fetch(url, { signal: c.signal, redirect: 'follow' });
        clearTimeout(timer);
        const latency = Date.now() - start;
        if (r.status >= 400) return { site, url, ok: false, status: r.status, latency, issue: `HTTP ${r.status}` };
        const body = await r.text();
        const issue = assessHtmlHealth(body);
        if (issue) return { site, url, ok: false, status: r.status, latency, issue };
        return { site, url, ok: true, status: r.status, size: body.length, latency };
      } catch (e) {
        return { site, url, ok: false, status: 0, latency: Date.now() - start, issue: e.name === 'AbortError' ? '超时(8s)' : e.message };
      }
    })
  );
  return results;
}

function buildReportHtml(results, title, { articleCount, contactCount, autoPublishStall } = {}) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const problems = results.filter(r => !r.ok);
  const httpOk = problems.length === 0;
  const allOk = httpOk && !autoPublishStall;
  const color = allOk ? '#22c55e' : '#ef4444';
  const icon = allOk ? '✅' : '⚠️';
  // Daily summary section (articles + contacts)
  let summaryHtml = '';
  if (articleCount !== undefined || contactCount !== undefined) {
    summaryHtml = `<div style="margin-bottom:16px;padding:12px 16px;background:#f0f9ff;border-radius:8px;border-left:4px solid #3b82f6">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1e40af">过去 24 小时数据</p>
      <p style="margin:0;font-size:13px;color:#334155">新增文章: <strong>${articleCount ?? 0}</strong> 篇 &nbsp;|&nbsp; 新增留言: <strong>${contactCount ?? 0}</strong> 条</p>
    </div>`;
  }
  // Auto-publish stall banner (enabled but 0 articles in 24h)
  let stallHtml = '';
  if (autoPublishStall) {
    stallHtml = `<div style="margin-bottom:16px;padding:12px 16px;background:#fef3c7;border-radius:8px;border-left:4px solid #f59e0b">
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#92400e">⚠️ 自动发布疑似未运行</p>
      <p style="margin:0;font-size:13px;color:#78350f">过去 24 小时产出 0 篇文章，但自动发布开关是 ON 状态。请检查：cron 是否到达触发时间、LLM/Tavily 额度、后端日志 [定时发布] 标签。</p>
    </div>`;
  }
  const rows = results.map(r => {
    const bg = r.ok ? '' : 'background:#fef2f2';
    const statusIcon = r.ok ? '✅' : '❌';
    const detail = r.ok ? `${r.size}B / ${r.latency}ms` : `<span style="color:red">${r.issue}</span>`;
    return `<tr style="${bg}"><td style="padding:8px;border:1px solid #e5e7eb">${statusIcon} ${r.site}</td><td style="padding:8px;border:1px solid #e5e7eb">${r.status||'-'}</td><td style="padding:8px;border:1px solid #e5e7eb">${r.latency}ms</td><td style="padding:8px;border:1px solid #e5e7eb">${detail}</td></tr>`;
  }).join('');
  const statusLine = allOk
    ? '所有站点正常'
    : (problems.length > 0
        ? `${problems.length} 个站点异常${autoPublishStall ? ' + 自动发布 0 篇' : ''}`
        : '自动发布疑似未运行');
  return `<div style="font-family:sans-serif;max-width:600px">
    <h2 style="color:${color}">${icon} ${title}</h2>
    <p style="color:#666">${now} — ${statusLine}</p>
    ${stallHtml}
    ${summaryHtml}
    <table style="border-collapse:collapse;width:100%;font-size:13px">
      <tr style="background:#f9fafb"><th style="padding:8px;border:1px solid #e5e7eb;text-align:left">站点</th><th style="padding:8px;border:1px solid #e5e7eb">HTTP</th><th style="padding:8px;border:1px solid #e5e7eb">延迟</th><th style="padding:8px;border:1px solid #e5e7eb">详情</th></tr>
      ${rows}
    </table></div>`;
}

// 24h 窗口，而不是当天。邮件早上 10 点发送时，"今日"(startsWith yyyy-mm-dd)
// 只覆盖 0-10 点，会漏掉昨晚 10:00-23:59 间生成的文章/留言。改为滚动 24h 窗口。
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
// 站点目录清单复用顶部的 SITES 常量；以前单独维护一份会漏掉新站（translator 曾因此 24h
// 报表不计数）。SITES 在文件下方声明，在这里作为闭包引用在运行时解析不会触发 TDZ。

function isWithinLast24h(isoStr) {
  if (!isoStr) return false;
  const t = new Date(isoStr).getTime();
  if (!Number.isFinite(t)) return false;
  return (Date.now() - t) <= TWENTY_FOUR_HOURS_MS;
}

// Count articles created in the last 24 hours.
// Historically articles are stored in the GLOBAL data/articles.json (single file, site=null).
// per-site data/sites/<site>/articles.json is read as a future-proofing fallback, but in
// production today all articles live in the global file. Previously this function only
// looked at per-site files and always returned 0 → daily health email showed
// "新增文章 0 篇" even when 4 articles/day were being published.
async function countLast24hArticles() {
  let count = 0;
  // Global articles file (legacy orphans from 4/16-4/22, site=null). Keep reading
  // this so historical articles still count toward the 24h window. After the
  // per-site rollout (commit 908a8dd), new runs write per-site only.
  try {
    const globalArticles = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'articles.json'), 'utf8'));
    const list = Array.isArray(globalArticles) ? globalArticles : (globalArticles.articles || []);
    count += list.filter(a => isWithinLast24h(a.createdAt || a.publishedAt)).length;
  } catch { /* file may not exist */ }
  // Per-site files (primary source going forward)
  for (const site of SITES) {
    try {
      const filePath = path.join(DATA_DIR, 'sites', site, 'articles.json');
      const articles = JSON.parse(await fs.readFile(filePath, 'utf8'));
      const list = Array.isArray(articles) ? articles : (articles.articles || []);
      count += list.filter(a => isWithinLast24h(a.createdAt || a.publishedAt)).length;
    } catch { /* file may not exist */ }
  }
  return count;
}

// Count contacts across global + per-site files submitted in the last 24 hours.
async function countLast24hContacts() {
  let count = 0;
  // Global contacts file
  try {
    const globalContacts = JSON.parse(await fs.readFile(path.join(DATA_DIR, 'contacts.json'), 'utf8'));
    count += globalContacts.filter(c => isWithinLast24h(c.submittedAt)).length;
  } catch { /* file may not exist */ }
  // Per-site contacts files
  for (const site of SITES) {
    try {
      const filePath = path.join(DATA_DIR, 'sites', site, 'contacts.json');
      const contacts = JSON.parse(await fs.readFile(filePath, 'utf8'));
      count += contacts.filter(c => isWithinLast24h(c.submittedAt)).length;
    } catch { /* file may not exist */ }
  }
  return count;
}

function getMonitorRecipients(config) {
  const r = config.monitorConfig?.recipients || config.emailConfig?.adminEmail || '';
  return r.split(',').map(s => s.trim()).filter(Boolean);
}

// 异常告警 cron（每分钟检查，按配置频率执行）
let lastAlertTime = 0;
let lastCheckMinute = -1;
cron.schedule('* * * * *', async function() {
  try {
    const config = await getConfig();
    const mc = config.monitorConfig || {};
    if (mc.enabled === false) return;
    const interval = mc.intervalMinutes || 30;
    const nowMin = Math.floor(Date.now() / 60000);
    if (nowMin - lastCheckMinute < interval) return;
    lastCheckMinute = nowMin;

    const results = await runHealthCheck(mc.urls);
    const problems = results.filter(r => !r.ok);
    const cooldown = (mc.cooldownHours || 6) * 60 * 60 * 1000;

    if (problems.length > 0 && Date.now() - lastAlertTime > cooldown) {
      lastAlertTime = Date.now();
      const recipients = getMonitorRecipients(config);
      if (recipients.length) {
        const html = buildReportHtml(results, 'JOTO.AI 站点异常告警');
        await sendEmail(recipients, '⚠️ JOTO.AI 站点异常告警', html);
        console.log(`[健康巡检] ${problems.length} 个异常，已告警 → ${recipients.join(', ')}`);
      }
    } else if (problems.length > 0) {
      console.log(`[健康巡检] ${problems.length} 个异常（冷却中）:`, problems.map(p => `${p.site}: ${p.issue}`).join(', '));
    }
  } catch (e) { console.error('[健康巡检] 出错:', e.message); }
});

// 每日报告 cron（每分钟检查是否到达配置时间）
let lastReportDate = '';
cron.schedule('* * * * *', async function() {
  try {
    const config = await getConfig();
    const mc = config.monitorConfig || {};
    if (mc.dailyReport === false) return;
    const reportTime = mc.reportTime || '08:00';
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
    const hhmm = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    const today = now.toISOString().slice(0, 10);
    if (hhmm !== reportTime || lastReportDate === today) return;
    lastReportDate = today;

    const results = await runHealthCheck(mc.urls);
    const recipients = getMonitorRecipients(config);
    if (recipients.length) {
      const articleCount = await countLast24hArticles();
      const contactCount = await countLast24hContacts();
      const autoPublishOn = (config.seoConfig?.autoPublish === true) || (config.autoPostEnabled === true);
      const autoPublishStall = autoPublishOn && articleCount === 0;
      const httpOk = results.every(r => r.ok);
      const allOk = httpOk && !autoPublishStall;
      const subject = allOk
        ? '✅ JOTO.AI 每日健康报告 — 全部正常'
        : (autoPublishStall && httpOk
            ? '⚠️ JOTO.AI 每日健康报告 — 自动发布疑似未运行'
            : '⚠️ JOTO.AI 每日健康报告 — 发现异常');
      const html = buildReportHtml(results, 'JOTO.AI 每日健康报告', { articleCount, contactCount, autoPublishStall });
      await sendEmail(recipients, subject, html);
      console.log(`[每日报告] 过去24h 文章:${articleCount} 留言:${contactCount} 已发送 → ${recipients.join(', ')}`);
    }
  } catch (e) { console.error('[每日报告] 出错:', e.message); }
});

// 测试报告 API
app.post('/api/admin/monitor-test', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    const recipients = getMonitorRecipients(config);
    if (!recipients.length) return res.json({ success: false, message: '未配置收件人' });
    const results = await runHealthCheck(config.monitorConfig?.urls);
    const articleCount = await countLast24hArticles();
    const contactCount = await countLast24hContacts();
    const autoPublishOn = (config.seoConfig?.autoPublish === true) || (config.autoPostEnabled === true);
    const autoPublishStall = autoPublishOn && articleCount === 0;
    const html = buildReportHtml(results, 'JOTO.AI 健康巡检 — 测试报告', { articleCount, contactCount, autoPublishStall });
    await sendEmail(recipients, '🧪 JOTO.AI 健康巡检 — 测试报告', html);
    res.json({ success: true });
  } catch (e) { res.json({ success: false, message: e.message }); }
});

// 动态定时任务：每分钟检查是否到达配置的发布时间
// 修复：增加 lastPublishDate 防重复机制 + 10分钟补发窗口（防止服务重启错过整点）
cron.schedule('* * * * *', async function() {
  try {
    var cfg = await getConfig();
    var enabled = (cfg.seoConfig && cfg.seoConfig.autoPublish) ? true : (cfg.autoPostEnabled || false);
    if (!enabled) return;
    
    var publishTime = (cfg.seoConfig && cfg.seoConfig.publishTime) ? cfg.seoConfig.publishTime : (cfg.autoPostTime || "09:00");
    var parts = publishTime.split(":");
    var targetHour = parseInt(parts[0], 10);
    var targetMinute = parseInt(parts[1], 10);
    
    var now = new Date();
    var todayStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    
    // 防重复：今天已经发布过则跳过
    var lastPublishDate = (cfg.seoConfig && cfg.seoConfig.lastPublishDate) ? cfg.seoConfig.lastPublishDate : null;
    if (lastPublishDate === todayStr) return;
    
    // 计算当前时间与目标时间的分钟差（支持10分钟补发窗口，防止服务重启错过整点）
    var nowMinutes = now.getHours() * 60 + now.getMinutes();
    var targetMinutes = targetHour * 60 + targetMinute;
    var diffMinutes = nowMinutes - targetMinutes;
    
    if (diffMinutes >= 0 && diffMinutes < 10) {
      console.log("[定时发布] 到达发布时间 " + publishTime + "（延迟" + diffMinutes + "分钟），开始生成文章...");
      // 先记录今天已发布，防止10分钟窗口内重复触发
      if (!cfg.seoConfig) cfg.seoConfig = {};
      cfg.seoConfig.lastPublishDate = todayStr;
      await saveConfig(cfg);
      await scheduleArticleGeneration();
    }
  } catch (err) {
    console.error("[定时发布] 时间检查出错:", err.message);
  }
});
console.log('[定时发布] 定时任务已启动，每分钟检查发布时间');

// SSL证书管理API
app.post('/api/admin/renew-certificate', verifyToken, async (req, res) => {
  try {
    const result = await renewCertificate();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/certificate-info', verifyToken, async (req, res) => {
  try {
    const result = await getCertificateInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== 品牌资源：WeChat QR（全站共用） ==========
// 设计：后台上传 PNG → 存到 public/brand/wechat-qr.png → 所有前端站点
//   <img src="https://admin.jotoai.com/brand/wechat-qr.png"> 引用。
//   后台上传完成即全网同步（5 分钟浏览器缓存，见 /brand 静态路由 maxAge）。
const BRAND_DIR = path.join(__dirname, 'public', 'brand');
const WECHAT_QR_FILE = path.join(BRAND_DIR, 'wechat-qr.png');

// 当前 QR 信息（公开，CORS 开放给所有站点可拉）
app.get('/api/brand/wechat-qr/info', async (req, res) => {
  try {
    const stat = await fs.stat(WECHAT_QR_FILE);
    res.json({
      exists: true,
      url: 'https://admin.jotoai.com/brand/wechat-qr.png',
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
      version: stat.mtimeMs,  // 前端可用作 ?v= cache-bust 参数
    });
  } catch {
    res.json({ exists: false, url: null });
  }
});

// 上传新的 QR（PNG/JPEG，管理员权限）
// body: { dataUrl: "data:image/png;base64,..." }
app.post('/api/admin/brand/wechat-qr', verifyToken, async (req, res) => {
  try {
    const { dataUrl } = req.body || {};
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'dataUrl required' });
    }
    const m = dataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/i);
    if (!m) return res.status(400).json({ success: false, error: '仅支持 PNG 或 JPEG' });
    const base64 = m[3];
    const buf = Buffer.from(base64, 'base64');
    if (buf.length > 3 * 1024 * 1024) {
      return res.status(400).json({ success: false, error: '图片过大（>3MB）' });
    }
    await fs.mkdir(BRAND_DIR, { recursive: true });
    await fs.writeFile(WECHAT_QR_FILE, buf);
    const stat = await fs.stat(WECHAT_QR_FILE);
    res.json({
      success: true,
      url: 'https://admin.jotoai.com/brand/wechat-qr.png',
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
      version: stat.mtimeMs,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 测试邮件发送API
app.post('/api/admin/test-email', verifyToken, async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({ success: false, message: '请输入测试邮箱地址' });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return res.status(400).json({ success: false, message: '邮箱格式不正确' });
    }
    
    const config = await getConfig();
    
    // 检查 Resend 是否配置
    if (!config.emailConfig?.resendApiKey) {
      return res.status(400).json({
        success: false,
        message: 'Resend API Key 未配置，请先在邮箱配置页面填写'
      });
    }
    
    // 发送测试邮件
    const testEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📧 SMTP测试邮件</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">✅ 邮件发送成功！</h2>
            
            <p style="color: #666; line-height: 1.6;">
              恭喜！您的SMTP配置正确，邮件系统运行正常。
            </p>
            
            <div style="background: #f0f7ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #555;">
                <strong>测试时间：</strong>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
              </p>
              <p style="margin: 10px 0 0 0; color: #555;">
                <strong>发送自：</strong>闪阅 AI 全科阅卷系统
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              现在您可以正常接收联系表单提交的通知邮件了。
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2026 闪阅 - AI全科阅卷系统 | 智能教育，从此开始
            </p>
          </div>
        </div>
      </div>
    `;
    
    const success = await sendEmail(
      testEmail,
      '【闪阅】SMTP测试邮件 - 配置成功',
      testEmailHtml
    );
    
    if (success) {
      res.json({ 
        success: true, 
        message: `测试邮件已发送到 ${testEmail}，请检查收件箱` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '邮件发送失败，请检查SMTP配置是否正确' 
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: `发送失败: ${error.message}` 
    });
  }
});

// 测试SMTP发送邮件
app.post('/api/admin/test-smtp', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    
    // 检查SMTP是否配置
    if (!config.emailConfig || !config.emailConfig.host || !config.emailConfig.user || !config.emailConfig.pass) {
      return res.status(400).json({ 
        success: false, 
        error: 'SMTP未配置，请先配置SMTP信息' 
      });
    }
    
    // 检查接收邮箱是否配置
    if (!config.emailConfig.adminEmail) {
      return res.status(400).json({ 
        success: false, 
        error: '接收邮箱未配置' 
      });
    }
    
    // 发送测试邮件
    const testEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📧 SMTP测试邮件</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            这是一封SMTP配置测试邮件。
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            如果您收到这封邮件，说明您的SMTP配置正确！
          </p>
          <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #666; font-size: 14px;"><strong>发送时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;"><strong>SMTP服务器:</strong> ${config.emailConfig.host}:${config.emailConfig.port}</p>
          </div>
        </div>
      </div>
    `;
    
    const emailSubject = `${config.emailConfig.emailSubjectPrefix || ''} SMTP测试邮件`.trim();
    const success = await sendEmail(config.emailConfig.adminEmail, emailSubject, testEmailHtml);
    
    if (success) {
      res.json({ success: true, message: '测试邮件发送成功' });
    } else {
      res.status(500).json({ success: false, error: '邮件发送失败，请检查SMTP配置' });
    }
  } catch (error) {
    console.error('测试SMTP失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SSL证书管理API
const { getSSLStatus, renewSSL, setAutoRenew } = require('./cert-manager');

// 获取SSL证书状态
app.get('/api/admin/ssl-status', verifyToken, async (req, res) => {
  try {
    const result = await getSSLStatus();
    res.json(result);
  } catch (error) {
    console.error('Get SSL status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 续订SSL证书
app.post('/api/admin/ssl-renew', verifyToken, async (req, res) => {
  try {
    const result = await renewSSL();
    res.json(result);
  } catch (error) {
    console.error('Renew SSL error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 设置自动续订
app.post('/api/admin/ssl-auto-renew', verifyToken, async (req, res) => {
  try {
    const { enabled } = req.body;
    const result = await setAutoRenew(enabled);
    res.json(result);
  } catch (error) {
    console.error('Set auto-renew error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 测试飞书机器人
app.post('/api/admin/test-feishu-bot', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    
    if (!config.feishuWebhook) {
      return res.status(400).json({ 
        success: false, 
        message: '飞书机器人Webhook未配置，请先配置Webhook地址' 
      });
    }
    
    // 发送测试消息
    const testMessage = {
      name: '测试用户',
      school: '闪阅管理后台',
      email: 'test@example.com',
      phone: '13800138000',
      message: '这是一条测试消息，用于验证飞书机器人配置是否正确。',
      source: '管理后台测试'
    };
    
    const success = await sendToFeishuBot(config.feishuWebhook, testMessage);
    
    if (success) {
      res.json({ 
        success: true, 
        message: '测试消息已发送到飞书群，请检查飞书群消息' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '发送失败，请检查Webhook地址是否正确' 
      });
    }
  } catch (error) {
    console.error('Test Feishu bot error:', error);
    res.status(500).json({ 
      success: false, 
      message: `发送失败: ${error.message}` 
    });
  }
});

// 测试飞书表格同步
app.post('/api/admin/test-feishu-table', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    
    if (!config.feishuAppId || !config.feishuAppSecret || !config.feishuTableUrl) {
      return res.status(400).json({ 
        success: false, 
        message: '飞书表格配置不完整，请配置App ID、App Secret和表格URL' 
      });
    }
    
    // 写入测试数据
    const testData = {
      name: '测试用户',
      school: '闪阅管理后台',
      email: 'test@example.com',
      phone: '13800138000',
      message: '这是一条测试数据，用于验证飞书表格同步是否正常。',
      source: '管理后台测试',
      timestamp: new Date().toISOString()
    };
    
    const success = await syncToFeishuTable(config, testData);
    
    if (success) {
      res.json({ 
        success: true, 
        message: '测试数据已写入飞书表格，请检查表格内容' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '写入失败，请检查App ID、App Secret和表格URL是否正确' 
      });
    }
  } catch (error) {
    console.error('Test Feishu table error:', error);
    res.status(500).json({ 
      success: false, 
      message: `写入失败: ${error.message}` 
    });
  }
});

// ==================== 各站点飞书表格配置 ====================
// 一个飞书 App（共享 appId/appSecret，存全局 config），每个站独立的 tableUrl，
// 让不同站的留言同步到不同的飞书多维表格。

// 列出所有站点的飞书表格配置（给 Dashboard"留言管理"页用）
app.get('/api/admin/sites-feishu', verifyToken, async (req, res) => {
  try {
    const globalCfg = await getConfig();
    const rows = await Promise.all(SITES.map(async site => {
      const siteCfg = await readSiteFile(getSitePaths(site).config, {});
      const merged = await getMergedSiteConfig(site);
      return {
        site,
        name: SITE_NAMES[site] || site,
        feishuTableUrl: siteCfg.feishuTableUrl || '',
        mergedTableUrl: merged.feishuTableUrl || '',
        usingGlobalFallback: !siteCfg.feishuTableUrl && !!globalCfg.feishuTableUrl,
      };
    }));
    res.json({
      success: true,
      hasAppCreds: !!(globalCfg.feishuAppId && globalCfg.feishuAppSecret),
      globalTableUrl: globalCfg.feishuTableUrl || '',
      sites: rows,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 保存某个站点的飞书表格 URL
app.put('/api/admin/sites/:site/feishu', verifyToken, async (req, res) => {
  try {
    const { site } = req.params;
    if (!SITES.includes(site)) return res.status(404).json({ success: false, error: 'Unknown site' });
    const { feishuTableUrl } = req.body || {};
    if (feishuTableUrl !== undefined && typeof feishuTableUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'feishuTableUrl 必须是字符串' });
    }
    // 简单校验：非空时必须是 feishu URL
    if (feishuTableUrl && !/^https?:\/\/[^\s]+\.feishu\.(cn|com)\//i.test(feishuTableUrl)) {
      return res.status(400).json({ success: false, error: '请输入完整的飞书多维表格 URL' });
    }
    const saved = await saveSiteConfigPartial(site, {
      feishuTableUrl: feishuTableUrl || '',
    });
    res.json({ success: true, feishuTableUrl: saved.feishuTableUrl || '' });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 测试某个站的飞书表格同步（写入一条测试数据）
app.post('/api/admin/sites/:site/feishu/test', verifyToken, async (req, res) => {
  try {
    const { site } = req.params;
    if (!SITES.includes(site)) return res.status(404).json({ success: false, error: 'Unknown site' });
    const merged = await getMergedSiteConfig(site);
    if (!merged.feishuAppId || !merged.feishuAppSecret) {
      return res.status(400).json({ success: false, message: '飞书 App ID / Secret 未配置（全局）' });
    }
    if (!merged.feishuTableUrl) {
      return res.status(400).json({ success: false, message: `站点 ${site} 未配置飞书表格 URL` });
    }
    const ok = await syncToFeishuTable(merged, {
      name: '测试用户',
      school: `${SITE_NAMES[site] || site} · 管理后台测试`,
      email: 'test@example.com',
      phone: '13800138000',
      message: `这是来自 ${site} 的飞书同步测试`,
      source: '管理后台测试',
      url: `https://${site}.jotoai.com/`,
      timestamp: new Date().toISOString(),
    });
    if (ok) res.json({ success: true, message: '测试数据已写入飞书表格' });
    else res.status(500).json({ success: false, message: '写入失败，请检查表格 URL 与 App 权限' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// 给某个站的飞书表格补齐标准字段（姓名/公司/手机/邮箱/留言 + 产品经理跟进列）
// 已有字段跳过，不改类型；返回每次新增/跳过的字段清单。
app.post('/api/admin/sites/:site/feishu/init-fields', verifyToken, async (req, res) => {
  try {
    const { site } = req.params;
    if (!SITES.includes(site)) return res.status(404).json({ success: false, error: 'Unknown site' });
    const merged = await getMergedSiteConfig(site);
    if (!merged.feishuAppId || !merged.feishuAppSecret) {
      return res.status(400).json({ success: false, message: '飞书 App ID / Secret 未配置（全局）' });
    }
    if (!merged.feishuTableUrl) {
      return res.status(400).json({ success: false, message: `站点 ${site} 未配置飞书表格 URL` });
    }
    const result = await ensureTableFields(merged);
    if (!result.ok) return res.status(500).json({ success: false, message: result.error });
    res.json({
      success: true,
      added: result.added,
      skipped: result.skipped,
      message: `新增 ${result.added.length} 列，已存在 ${result.skipped.length} 列`,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// URL去重管理API
const usedUrlsManager = require('./used-urls-manager');

// 获取已使用URL数量
app.get('/api/admin/used-urls/count', verifyToken, async (req, res) => {
  try {
    const count = await usedUrlsManager.getUsedUrlCount();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取所有已使用URL
app.get('/api/admin/used-urls', verifyToken, async (req, res) => {
  try {
    const urls = await usedUrlsManager.getUsedUrls();
    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 清空已使用URL
app.post('/api/admin/used-urls/clear', verifyToken, async (req, res) => {
  try {
    await usedUrlsManager.clearUsedUrls();
    res.json({ success: true, message: '已成功清空历史URL' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 测试Unsplash API
app.post('/api/admin/test-unsplash', verifyToken, async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ success: false, message: '请提供Unsplash Access Key' });
    }
    
    const { UnsplashFetcher } = require('./unsplash-fetcher-simple');
    const fetcher = new UnsplashFetcher(apiKey);
    
    // 测试搜索图片
    const axios = require('axios');
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: 'education',
        per_page: 10
      },
      headers: {
        'Authorization': `Client-ID ${apiKey}`
      },
      timeout: 10000
    });
    
    res.json({ 
      success: true, 
      message: 'Unsplash API连接成功',
      count: response.data.results.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.errors?.[0] || error.message 
    });
  }
});

// 获取Unsplash图片使用统计
app.get('/api/admin/unsplash-stats', async (req, res) => {
  try {
    const { UnsplashFetcher } = require('./unsplash-fetcher-simple');
    const count = await UnsplashFetcher.getUsedImageCount();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 清空 Unsplash 图片使用记录
app.post('/api/admin/clear-unsplash-images', async (req, res) => {
  try {
    const { UnsplashFetcher } = require('./unsplash-fetcher-simple');
    await UnsplashFetcher.clearUsedImages();
    res.json({ success: true, message: '已成功清空图片使用记录' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 启动服务器
async function start() {
  await ensureDataDir();
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

// 忘记密码 - 发送一次性密码
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const config = await getConfig();
    
    const admins = config.admins || [];
    const admin = admins.find(a => a.email === email);
    
    if (!admin) {
      // 为了安全，不透露邮箱是否存在
      return res.json({ success: true, message: '如果该邮箱存在，我们已发送一次性密码到您的邮箱' });
    }
    
    // 生成6位数字一次性密码
    const oneTimePassword = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 15 * 60 * 1000; // 15分钟后过期
    
    // 保存一次性密码
    if (!global.oneTimePasswords) {
      global.oneTimePasswords = new Map();
    }
    global.oneTimePasswords.set(email, { password: oneTimePassword, expires: expireTime });
    
    // 发送邮件
    if (config.emailConfig && config.emailConfig.user) {
      const emailSubject = `${config.brandConfig?.emailSubjectPrefix || '[系统] '}一次性登录密码`;
      const emailHtml = `
        <h2>一次性登录密码</h2>
        <p>您好，${admin.name || '管理员'}！</p>
        <p>您的一次性登录密码是：<strong style="font-size: 24px; color: #4F46E5;">${oneTimePassword}</strong></p>
        <p>此密码将在 <strong>15分钟</strong> 后过期。</p>
        <p>如果这不是您的操作，请忽略此邮件。</p>
        <hr>
        <p style="color: #666; font-size: 12px;">此邮件由系统自动发送，请勿回复。</p>
      `;
      
      await sendEmail(email, emailSubject, emailHtml);
    }
    
    res.json({ success: true, message: '如果该邮箱存在，我们已发送一次性密码到您的邮箱' });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ success: false, message: '发送失败，请稍后重试' });
  }
});

// 使用一次性密码登录
app.post('/api/admin/login-with-otp', async (req, res) => {
  try {
    const { email, oneTimePassword } = req.body;
    
    if (!global.oneTimePasswords || !global.oneTimePasswords.has(email)) {
      return res.status(401).json({ success: false, message: '一次性密码无效或已过期' });
    }
    
    const stored = global.oneTimePasswords.get(email);
    
    if (stored.expires < Date.now()) {
      global.oneTimePasswords.delete(email);
      return res.status(401).json({ success: false, message: '一次性密码已过期' });
    }
    
    if (stored.password !== oneTimePassword) {
      return res.status(401).json({ success: false, message: '一次性密码错误' });
    }
    
    // 验证成功，删除一次性密码
    global.oneTimePasswords.delete(email);
    
    const config = await getConfig();
    const admins = config.admins || [];
    const admin = admins.find(a => a.email === email);
    
    if (!admin) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }
    
    res.json({ 
      success: true, 
      token: Buffer.from(`${email}:${admin.password}`).toString('base64'),
      needsPasswordChange: true, // 使用一次性密码登录后必须修改密码
      email: admin.email,
      name: admin.name
    });
  } catch (error) {
    console.error('Error in login-with-otp:', error);
    res.status(500).json({ success: false, message: '登录失败，请稍后重试' });
  }
});


// 获取所有管理员列表
app.get('/api/admin/admins', verifyToken, async (req, res) => {
  try {
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 返回管理员列表，但不包含密码
    const adminList = admins.map(admin => ({
      email: admin.email,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
      needsPasswordChange: admin.needsPasswordChange
    }));
    
    res.json({ success: true, admins: adminList });
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ success: false, message: '获取管理员列表失败' });
  }
});

// 添加管理员
app.post('/api/admin/admins', verifyToken, async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ success: false, message: '邮箱、姓名和密码不能为空' });
    }
    
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 检查邮箱是否已存在
    if (admins.find(a => a.email === email)) {
      return res.status(400).json({ success: false, message: '该邮箱已被使用' });
    }
    
    // 添加新管理员
    admins.push({
      email,
      name,
      password,
      role: 'admin',
      createdAt: new Date().toISOString(),
      needsPasswordChange: false
    });
    
    config.admins = admins;
    await saveConfig(config);
    
    res.json({ success: true, message: '管理员添加成功' });
  } catch (error) {
    console.error('Error adding admin:', error);
    res.status(500).json({ success: false, message: '添加管理员失败' });
  }
});

// 更新管理员信息
app.put('/api/admin/admins/:email', verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    const { name, password } = req.body;
    
    const config = await getConfig();
    const admins = config.admins || [];
    const adminIndex = admins.findIndex(a => a.email === email);
    
    if (adminIndex === -1) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }
    
    // 更新管理员信息
    if (name) {
      admins[adminIndex].name = name;
    }
    if (password) {
      admins[adminIndex].password = password;
      admins[adminIndex].needsPasswordChange = false;
    }
    
    config.admins = admins;
    await saveConfig(config);
    
    res.json({ success: true, message: '管理员信息更新成功' });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ success: false, message: '更新管理员信息失败' });
  }
});

// 删除管理员
app.delete('/api/admin/admins/:email', verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 不能删除最后一个管理员
    if (admins.length <= 1) {
      return res.status(400).json({ success: false, message: '不能删除最后一个管理员' });
    }
    
    const adminIndex = admins.findIndex(a => a.email === email);
    
    if (adminIndex === -1) {
      return res.status(404).json({ success: false, message: '管理员不存在' });
    }
    
    // 删除管理员
    admins.splice(adminIndex, 1);
    config.admins = admins;
    await saveConfig(config);
    
    res.json({ success: true, message: '管理员删除成功' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ success: false, message: '删除管理员失败' });
  }
});


// 存储邀请token（生产环境应使用Redis）
const invitationTokens = new Map();

// 发送管理员邀请
app.post('/api/admin/invite', verifyToken, async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ success: false, message: '邮箱和姓名不能为空' });
    }
    
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 检查邮箱是否已存在
    if (admins.find(a => a.email === email)) {
      return res.status(400).json({ success: false, message: '该邮箱已被使用' });
    }
    
    // 生成邀请token（24小时有效）
    const inviteToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24小时
    
    // 存储邀请信息
    invitationTokens.set(inviteToken, {
      email,
      name,
      expiresAt,
      invitedBy: req.user?.email || 'admin'
    });
    
    // 生成邀请链接
    const inviteLink = `${req.protocol}://${req.get('host')}/admin/accept-invite.html?token=${inviteToken}`;
    
    // 发送邀请邮件
    const brandName = config.brandConfig?.name || '管理后台';
    const emailSubjectPrefix = config.emailConfig?.emailSubjectPrefix || '';
    
    const mailOptions = {
      from: config.emailConfig.from || config.emailConfig.user,
      to: email,
      subject: `${emailSubjectPrefix} 管理员邀请`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 管理员邀请</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              您好，<strong>${name}</strong>！
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              您已被邀请成为 <strong>${brandName}</strong> 的管理员。
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">
              请点击下方按钮接受邀请并设置您的密码：
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                接受邀请
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              如果按钮无法点击，请复制以下链接到浏览器：<br>
              <a href="${inviteLink}" style="color: #667eea; word-break: break-all;">${inviteLink}</a>
            </p>
            
            <p style="font-size: 14px; color: #ef4444; margin-top: 20px;">
              ⚠️ 此邀请链接将在 24 小时后失效
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              如果您没有请求此邀请，请忽略此邮件。
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.json({ 
      success: true, 
      message: '邀请邮件已发送',
      inviteLink: inviteLink // 仅用于测试，生产环境应删除
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ success: false, message: '发送邀请失败' });
  }
});

// 验证邀请token
app.get('/api/admin/verify-invite/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const invitation = invitationTokens.get(token);
    
    if (!invitation) {
      return res.status(404).json({ success: false, message: '邀请链接无效' });
    }
    
    if (Date.now() > invitation.expiresAt) {
      invitationTokens.delete(token);
      return res.status(400).json({ success: false, message: '邀请链接已过期' });
    }
    
    res.json({ 
      success: true, 
      email: invitation.email,
      name: invitation.name
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    res.status(500).json({ success: false, message: '验证失败' });
  }
});

// 接受邀请并设置密码
app.post('/api/admin/accept-invite', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token和密码不能为空' });
    }
    
    const invitation = invitationTokens.get(token);
    
    if (!invitation) {
      return res.status(404).json({ success: false, message: '邀请链接无效' });
    }
    
    if (Date.now() > invitation.expiresAt) {
      invitationTokens.delete(token);
      return res.status(400).json({ success: false, message: '邀请链接已过期' });
    }
    
    // 验证密码强度
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: '密码至少8位' });
    }
    
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, message: '密码必须包含字母和数字' });
    }
    
    const config = await getConfig();
    const admins = config.admins || [];
    
    // 检查邮箱是否已存在（防止重复接受）
    if (admins.find(a => a.email === invitation.email)) {
      invitationTokens.delete(token);
      return res.status(400).json({ success: false, message: '该邮箱已被使用' });
    }
    
    // 添加新管理员
    admins.push({
      email: invitation.email,
      name: invitation.name,
      password: password,
      role: 'admin',
      createdAt: new Date().toISOString(),
      needsPasswordChange: false,
      invitedBy: invitation.invitedBy
    });
    
    config.admins = admins;
    await saveConfig(config);
    
    // 删除已使用的邀请token
    invitationTokens.delete(token);
    
    // 生成登录token
    const loginToken = Buffer.from(`${invitation.email}:${password}`).toString('base64');
    
    res.json({ 
      success: true, 
      message: '账号创建成功',
      token: loginToken,
      email: invitation.email,
      name: invitation.name
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ success: false, message: '接受邀请失败' });
  }
});


// ==================== 配置管理API ====================

// Removed duplicate GET/POST config endpoints - using the ones defined earlier


// ==================== 多站点支持 ====================
const SITES = ['audit', 'shanyue', 'sec', 'kb', 'fasium', 'loop', 'noteflow', 'translator'];
const SITE_NAMES = { audit: '唯客智审', shanyue: '闪阅', sec: '唯客AI护栏', kb: '唯客企业知识中台', fasium: 'FasiumAI', loop: 'Loop', noteflow: 'NoteFlow', translator: 'JOTO Translator' };

function getSitePaths(site) {
  const siteDir = path.join(DATA_DIR, 'sites', site);
  return {
    dir: siteDir,
    articles: path.join(siteDir, 'articles.json'),
    contacts: path.join(siteDir, 'contacts.json'),
    config: path.join(siteDir, 'config.json'),
  };
}

async function readSiteFile(filePath, defaultVal = []) {
  try { return JSON.parse(await fs.readFile(filePath, 'utf8')); }
  catch { return defaultVal; }
}

/**
 * 读取站点级 config 并与全局 config 合并。飞书 App ID/Secret 全局共享（一个飞书
 * 应用就够），而 feishuTableUrl / feishuWebhook 由站点自己维护——允许每个站把留言
 * 同步到不同的飞书多维表格。
 *
 * 优先级：站点字段 > 全局字段。站点字段若为空字符串则视为未设置、回退到全局。
 */
async function getMergedSiteConfig(site) {
  const globalCfg = await getConfig();
  const siteCfg = await readSiteFile(getSitePaths(site).config, {});
  const pick = (siteVal, globalVal) => {
    if (siteVal !== undefined && siteVal !== null && siteVal !== '') return siteVal;
    return globalVal || '';
  };
  return {
    ...globalCfg,
    ...siteCfg,
    feishuAppId:      pick(siteCfg.feishuAppId,      globalCfg.feishuAppId),
    feishuAppSecret:  pick(siteCfg.feishuAppSecret,  globalCfg.feishuAppSecret),
    feishuTableUrl:   pick(siteCfg.feishuTableUrl,   globalCfg.feishuTableUrl),
    feishuWebhook:    pick(siteCfg.feishuWebhook,    globalCfg.feishuWebhook),
  };
}

async function saveSiteConfigPartial(site, patch) {
  const p = getSitePaths(site).config;
  const current = await readSiteFile(p, {});
  const next = { ...current, ...patch };
  await fs.mkdir(getSitePaths(site).dir, { recursive: true });
  await fs.writeFile(p, JSON.stringify(next, null, 2));
  return next;
}

// 公开：获取各站点文章
app.get('/api/:site/articles', async (req, res) => {
  const { enrichLegacyArticle } = require('./article-enrichment');
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const articles = await readSiteFile(getSitePaths(site).articles, []);
  const published = articles.filter(a => a.status === 'published' || !a.status);
  const enriched = published.map(a => a.schemaVersion ? a : enrichLegacyArticle(a));
  res.json({ articles: enriched });
});

// 公开：获取单篇文章
app.get('/api/:site/articles/:id', async (req, res) => {
  const { enrichLegacyArticle } = require('./article-enrichment');
  const { site, id } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const articles = await readSiteFile(getSitePaths(site).articles, []);
  const article = articles.find(a => String(a.id) === id || a.slug === id);
  if (!article) return res.status(404).json({ error: 'Article not found' });
  const enriched = article.schemaVersion ? article : enrichLegacyArticle(article);
  res.json({ article: enriched });
});

// 公开：提交表单（各站点）
app.post('/api/:site/contact', async (req, res) => {
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  try {
    const { captchaId, captchaText, captcha, ...contactData } = req.body;
    const userCaptcha = captchaText || captcha;
    // 校验公司/机构名称为必填
    if (!contactData.company || typeof contactData.company !== 'string' || !contactData.company.trim()) {
      return res.status(400).json({ success: false, error: '请填写公司或机构名称' });
    }
    if (!captchaId || !userCaptcha) return res.status(400).json({ success: false, error: '请输入验证码' });
    const stored = captchaStore.get(captchaId);
    if (!stored || stored.expires < Date.now()) return res.status(400).json({ success: false, error: '验证码已过期' });
    if (stored.text !== userCaptcha.toLowerCase()) return res.status(400).json({ success: false, error: '验证码错误' });
    captchaStore.delete(captchaId);

    // site 字段统一存"展示名"（与 /api/contact 根路径一致）。此前存 id ('translator')，
    // 导致 admin 后台留言徽章显示成 id 而不是"JOTO Translator"，且徽章配色查不到。
    // siteId 保留原始 id 供前端精确筛选用。
    const contact = {
      id: Date.now(),
      siteId: site,
      site: SITE_NAMES[site] || site,
      ...contactData,
      submittedAt: new Date().toISOString(),
    };
    const p = getSitePaths(site);
    const contacts = await readSiteFile(p.contacts, []);
    contacts.unshift(contact);
    await fs.writeFile(p.contacts, JSON.stringify(contacts, null, 2));

    // 通知（邮件 + 飞书）。保存成功后异步通知，失败不影响响应。
    // 用 merged config：全局飞书 App 凭证 + 站级 feishuTableUrl，允许每个站
    // 把留言同步到不同的飞书多维表格。
    const config = await getMergedSiteConfig(site);
    const siteHost = (req.headers['x-forwarded-host'] || req.headers.host || `${site}.jotoai.com`).replace(/:\d+$/, '');
    const deviceType = detectDevice(req.headers['user-agent']);
    notifyNewContact({
      config,
      contact: contactData,
      siteName: SITE_NAMES[site] || site,
      siteHost,
      sourceInfo: contactData.source || '直接访问',
      deviceType,
    }).catch(e => console.error(`[/api/${site}/contact] 通知失败:`, e.message));

    res.json({ success: true, message: '提交成功，我们会尽快与您联系' });
  } catch (e) { res.status(500).json({ success: false, error: '提交失败' }); }
});

// 管理员：获取各站点统计
app.get('/api/admin/dashboard', verifyToken, async (req, res) => {
  try {
    // 读取根目录 contacts（/api/contact 提交的数据存在这里）
    const allContacts = await getContacts();
    const stats = await Promise.all(SITES.map(async site => {
      const p = getSitePaths(site);
      const articles = await readSiteFile(p.articles, []);
      const siteContacts = await readSiteFile(p.contacts, []);
      // 合并：子目录 contacts + 根目录中属于该站点的 contacts
      const HOST_MAP = { audit:'audit.jotoai.com', shanyue:'shanyue.jotoai.com', sec:'sec.jotoai.com', kb:'kb.jotoai.com', fasium:'fasium.jotoai.com', loop:'loop.jotoai.com' };
      const rootContacts = allContacts.filter(c => c.siteHost === HOST_MAP[site]);
      const totalContacts = siteContacts.length + rootContacts.length;
      return { site, name: SITE_NAMES[site], articleCount: articles.length, contactCount: totalContacts };
    }));
    res.json({ success: true, sites: stats });
  } catch (e) { res.status(500).json({ error: e.message }); }
});


// 管理员：站点状态检测（含 HTML 内容验证，防止"进程活着但页面白屏"误报绿色）
// 巡检清单从 config.sites（管理员后台维护）动态读取，新增站点自动纳入。
// 硬编码 SITE_URLS 的旧实现会让后台把不在清单里的站（如 translator）渲染成"未知/异常"。
const HEALTH_ERROR_MARKERS = ['Application error', '__next_error__', 'Internal Server Error', 'a client-side exception has occurred', 'ChunkLoadError'];
app.get('/api/admin/site-status', verifyToken, async (req, res) => {
  const config = await getConfig();
  const sitesToCheck = (config.sites || [])
    .filter(s => s.id && s.url)
    .map(s => ({ site: s.id, url: s.url }));
  const results = await Promise.all(
    sitesToCheck.map(async ({ site, url }) => {
      const start = Date.now();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 8000);
        const r = await fetch(url, { signal: controller.signal, redirect: 'follow' });
        clearTimeout(timer);
        const latency = Date.now() - start;
        const httpOk = r.status >= 200 && r.status < 400;

        // Read body and run the same heuristic as daily health check
        const body = await r.text();
        const healthIssue = assessHtmlHealth(body);
        const contentOk = !healthIssue;

        const ok = httpOk && contentOk;
        const issues = [];
        if (!httpOk) issues.push(`HTTP ${r.status}`);
        if (healthIssue) issues.push(healthIssue);

        return { site, url, status: r.status, ok, latency, ...(issues.length ? { issues } : {}) };
      } catch (e) {
        return { site, url, status: 0, ok: false, latency: Date.now() - start, issues: [e.name === 'AbortError' ? '超时(8s)' : e.message] };
      }
    })
  );
  res.json({ success: true, results, checkedAt: new Date().toISOString() });
});

// 管理员：获取站点留言
app.get('/api/admin/:site/contacts', verifyToken, async (req, res) => {
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const contacts = await readSiteFile(getSitePaths(site).contacts, []);
  res.json({ success: true, contacts });
});

// 管理员：获取站点文章
app.get('/api/admin/:site/articles', verifyToken, async (req, res) => {
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const articles = await readSiteFile(getSitePaths(site).articles, []);
  res.json({ success: true, articles });
});

// 管理员：删除文章
app.delete('/api/admin/:site/articles/:id', verifyToken, async (req, res) => {
  const { site, id } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const p = getSitePaths(site);
  let articles = await readSiteFile(p.articles, []);
  articles = articles.filter(a => String(a.id) !== id);
  await fs.writeFile(p.articles, JSON.stringify(articles, null, 2));
  res.json({ success: true });
});

// 管理员：生成文章
app.post('/api/admin/:site/generate-article', verifyToken, async (req, res) => {
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  try {
    const siteConfig = await readSiteFile(getSitePaths(site).config, {});
    const config = { ...(await getConfig()), ...siteConfig };

    // Build structured sub-configs (same pattern as the global generateArticle helper)
    const llmConfig = config.llmApiKey && config.llmApiEndpoint ? {
      apiKey: config.llmApiKey,
      apiEndpoint: config.llmApiEndpoint,
      model: config.llmModel
    } : null;
    const imageConfig = {
      useAI: config.imageConfig?.useAI ?? config.imageUseAI,
      apiKey: config.imageConfig?.aiApiKey ?? config.imageApiKey,
      unsplashApiKey: config.imageConfig?.unsplashApiKey ?? config.unsplashApiKey
    };
    const wordCount = config.seoConfig?.articleWordCount ?? config.articleWordCount ?? 1200;
    const seoKeywords = config.seoConfig?.keywords || config.seoKeywords || null;
    const p = getSitePaths(site);
    const existingArticles = await readSiteFile(p.articles, []);
    const dedupConfig = {
      enableImageDeduplication: config.imageConfig?.enableDeduplication ?? false,
      deduplicationWindow: config.imageConfig?.deduplicationWindow ?? 5
    };

    // Prompt overrides: site-level systemPrompt > global prompt > hardcoded
    const globalConfig = await getConfig();
    const promptOverrides = { systemPrompt: siteConfig.systemPrompt || '', globalPrompt: globalConfig.globalPrompt || '' };
    const humanizerConfig = globalConfig.humanizerConfig || {};

    const article = await generateArticleNew(llmConfig, imageConfig, dedupConfig, wordCount, seoKeywords, existingArticles, site, promptOverrides, humanizerConfig);
    if (!article) return res.status(500).json({ success: false, error: '生成失败' });
    const newArticle = { id: Date.now(), site, status: 'published', createdAt: new Date().toISOString(), ...article };
    existingArticles.unshift(newArticle);
    await fs.writeFile(p.articles, JSON.stringify(existingArticles, null, 2));
    res.json({ success: true, article: newArticle });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// 管理员：站点配置
app.get('/api/admin/:site/config', verifyToken, async (req, res) => {
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const config = await readSiteFile(getSitePaths(site).config, {});
  const safe = { ...config };
  delete safe.adminPassword; delete safe.jwtSecret; delete safe.llmApiKey;
  res.json({ success: true, config: safe });
});

app.post('/api/admin/:site/config', verifyToken, async (req, res) => {
  const { site } = req.params;
  if (!SITES.includes(site)) return res.status(404).json({ error: 'Unknown site' });
  const p = getSitePaths(site);
  const existing = await readSiteFile(p.config, {});
  const updated = { ...existing, ...req.body };
  await fs.writeFile(p.config, JSON.stringify(updated, null, 2));
  res.json({ success: true, message: '配置已保存' });
});
