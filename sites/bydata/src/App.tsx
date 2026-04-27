import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import heroBg from './assets/images/bydata_hero_bg_1777019425610.png';
import ContactForm from './ContactForm';

type Language = 'cn' | 'en';

const translations = {
  cn: {
    htmlLang: 'zh-CN',
    nav: {
      home: '首页',
      about: '关于比笛塔',
      services: '核心能力',
      industry: '行业方案',
      stories: '成功案例',
      contact: '联系我们',
    },
    hero: {
      tag: '您的专业 AIGC 落地伙伴',
      titlePre: '生成式AI',
      titleAccent: '落地引领者',
      subtitle: '助力企业构建AIGC业务场景，驱动创新与增长',
      btn1: 'AIGC 咨询服务',
      btn2: 'AIGC 业务场景落地服务',
    },
    about: {
      title: '关于比笛塔 (Bydata)',
      lead: '比笛塔（Bydata）是聚焦生成式 AI 企业级落地的咨询与交付团队。自成立以来，我们深耕行业洞察与前沿人工智能技术，累计在零售、金融、医药、教育、日化、珠宝等多个领域完成 50+ 项 AIGC 场景实施，覆盖从概念验证（POC）到生产环境长期运维的完整链路。',
      lead2: '与通用云服务商或纯模型供应商不同，我们以"业务场景 × 模型微调 × 工程交付"三位一体的方式介入：不止于"试用大模型"，而是把 AIGC 能力真正嵌入企业核心业务流程，沉淀为可治理、可复用的智能资产。',
      pillarsTitle: '我们的差异化',
      pillars: [
        {
          title: '专注 AIGC 落地',
          desc: '把"生产可用"作为唯一标准 —— 私有化部署、敏感数据隔离、场景化微调，是我们每个技术决策的三条主线。',
        },
        {
          title: '工程化交付方法',
          desc: '需求拆解 → POC 原型 → 灰度上线，按双周迭代 + 指标对齐推进，单场景从立项到上线平均 6–10 周可量化收益。',
        },
        {
          title: '行业知识沉淀',
          desc: '在零售商品标签、医药合规规则、教育评估体系等场景持续积累专属语料库与 Prompt 模板库，加速新客户冷启动。',
        },
      ],
      commitmentsTitle: '能力速览',
      commitments: [
        { label: '服务行业', value: '零售 · 金融 · 医药 · 教育 · 日化 · 珠宝' },
        { label: '主流模型', value: 'Qwen · DeepSeek · GLM · Llama · 私有大模型' },
        { label: '部署方式', value: '私有化 · 混合云 · 算力一体机' },
        { label: '交付节奏', value: '单场景 6–10 周 POC 至上线' },
      ],
    },
    services: {
      title: '核心能力',
      items: [
        {
          title: 'AIGC 场景构建与共创',
          desc: '深入业务流程，识别高价值AI应用场景，提供从概念验证到实际落地的全流程咨询与实施。',
        },
        {
          title: '私有化大模型部署',
          desc: '为企业提供安全、可控的大模型私有化部署方案，确保核心数据资产安全。',
        },
        {
          title: '模型微调与 RAG 优化',
          desc: '针对特定行业知识进行模型微调，结合向量数据库与 RAG 技术提升回答精准度。',
        },
        {
          title: '算力一体机解决方案',
          desc: '提供集成了 NPU/GPU 算力的训练推演一体机，降低中小企业 AI 应用门槛。',
        },
      ],
    },
    industries: {
      title: '行业聚焦',
      list: [
        {
          name: '零售',
          desc: '构建智慧化零售生态，通过 AIGC 实现个性化导购、智能营销文案生成及库存预测优化，提升消费者体验与运营效率。',
        },
        {
          name: '金融',
          desc: '深耕金融合规场景，利用大模型技术优化风险评估、智能投顾及自动化单据审核，驱动金融服务向智能化转型。',
        },
        {
          name: '教育',
          desc: '打造个性化教学助手，实现课程内容的智能生成、作业自动化批改及学生学习路径的精准推荐，赋能未来教育。',
        },
      ],
    },
    stories: {
      title: '成功案例',
      items: [
        {
          title: '全球咖啡连锁',
          desc: '我们为此咖啡连锁开发了个性化营销实验平台，通过核心指标实验体系，持续优化核心指标，精细化实验流程，实现了营销自动化。这一合作显著提升了此咖啡连锁的客户参与度和销售转化率，助力其在激烈的市场竞争中脱颖而出。',
        },
        {
          title: '世界500强药企',
          desc: '我们为此医药外企推出了健康管理与智能医链小程序，涵盖精准分析用户血压、配备丰富的知识库界面、生成个性化的健康评估等多种服务，显著提升了用户的健康管理能力，并有效优化此医药外企在提供精准医疗服务方面的整体体验。',
        },
        {
          title: '全球顶尖国际学校',
          desc: '我们为此国际学校提供了先进的AI平台智能体搭建服务，该平台通过智能体技术支持学校的教育管理、学生互动和个性化学习。此方案不仅提升了学校的教学效率和学生的学习体验，还推动了教育领域的智能化进程。',
        },
        {
          title: '零售行业领军品牌',
          desc: '我们为此零售品牌开发了商务通小程序，有效解决了品鉴会的商家统一管理和费用统一管理问题。通过集成全面的管理功能，使其能够高效地组织、协调和追踪品鉴会活动。这一方案优化了活动的组织效率，增强了该品牌的运营能力。',
        },
        {
          title: '国内领先日化名企',
          desc: '我们为此日化企业创建了 DatAI 智能体搭建服务，该平台通过数据清洗、闪电式可视化和数据库接入，进行深入的数据洞察。此方案不仅优化了数据处理流程，还提升了数据分析的精准度，为该品牌提供了强有力的决策支持。',
        },
        {
          title: '百年珠宝品牌',
          desc: '我们为此珠宝品牌开设了 RAG 智能客服系统，显著提升了客户服务体验。系统通过智能化客户互动和高效的问题解决，实现了快速且精准的服务响应。RAG 智能客服不仅优化了客户支持流程，也为其塑造了卓越的品牌市场地位。',
        },
      ],
    },
    chat: '立即展开交谈！',
    cta: { start: '立即开始' },
    stats: [
      { label: '行业深耕', value: '10+' },
      { label: '成功案例', value: '50+' },
      { label: '精度提升', value: '98%' },
      { label: '效率优化', value: '300%' },
    ],
    workflow: {
      title: '我们的落地流程',
      steps: [
        { title: '业务咨询', desc: '深入沟通业务痛点，识别高价值 AI 场景。' },
        { title: '方案设计', desc: '制定量身定制的 AIGC 技术路线与实施规划。' },
        { title: 'POC 验证', desc: '快速构建原型并进行概念验证，确保方案可行。' },
        { title: '全面部署', desc: '生产环境正式上线，并持续进行模型优化与迭代。' },
      ],
    },
    contact: {
      title: '开启您的 AI 旅程',
      subtitle: '联系比笛塔专家，定制您的企业级 AIGC 方案',
      phoneLabel: '联系电话',
      emailLabel: '商务邮箱',
      addressLabel: '公司地址',
      email: 'sales@bydata.net',
      phone: '17625213200',
      address: '中国上海市黄浦区淮海中路138号',
    },
    contactForm: {
      title: '在线留言',
      subtitle: '我们会在 24 小时内回复您的咨询。',
      name: '姓名',
      namePlaceholder: '您的姓名',
      company: '公司/机构',
      companyPlaceholder: '所在公司',
      email: '邮箱',
      emailPlaceholder: 'name@company.com',
      phone: '电话',
      phonePlaceholder: '+86 ...',
      message: '需求说明',
      messagePlaceholder: '请简要描述您的业务场景与需求',
      captcha: '验证码',
      captchaPlaceholder: '输入图中字符',
      refresh: '刷新验证码',
      submit: '提交咨询',
      submitting: '提交中…',
      success: '已收到，我们将尽快与您联系',
      errorGeneric: '提交失败，请稍后重试',
      errorCaptcha: '验证码加载失败，请刷新重试',
      errorNetwork: '网络错误，请稍后重试',
    },
    footer: {
      icp: '沪 ICP 备 2024096280 号 - 1',
      copy: '© 2026 Bydata. 保留所有权利。',
    },
  },
  en: {
    htmlLang: 'en',
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      industry: 'Industries',
      stories: 'Success Stories',
      contact: 'Contact',
    },
    hero: {
      tag: 'Your Professional AIGC Implementation Partner',
      titlePre: 'Generative AI',
      titleAccent: 'Implementation Leader',
      subtitle:
        'Help enterprises build AIGC business scenarios and drive innovation and growth',
      btn1: 'AIGC Consulting Services',
      btn2: 'AIGC Implementation Services',
    },
    about: {
      title: 'About Bydata',
      lead: 'Bydata is an enterprise-grade GenAI consulting and delivery team. Since inception we have implemented 50+ AIGC scenarios across retail, finance, pharma, education, FMCG and jewelry, covering the full lifecycle from POC validation to long-running production operations.',
      lead2: 'Unlike pure cloud vendors or model providers, we operate along the business-scenario × model-fine-tuning × engineering-delivery axis — moving enterprises beyond "trying the model" to embedding AIGC deeply into core workflows as governable, reusable intelligence assets.',
      pillarsTitle: 'What Sets Us Apart',
      pillars: [
        {
          title: 'Focused on GenAI Implementation',
          desc: 'Production usability is our only bar — on-premise deployment, sensitive-data isolation, and scenario fine-tuning anchor every architectural decision.',
        },
        {
          title: 'Engineering-First Delivery',
          desc: 'Requirements → POC → gated production rollout, on bi-weekly sprints aligned with measurable KPIs — a typical scenario goes from kickoff to live in 6–10 weeks.',
        },
        {
          title: 'Domain Knowledge IP',
          desc: 'Per-industry corpora and prompt template libraries — retail SKU taxonomies, pharma compliance rules, education assessment rubrics — accelerate every new engagement.',
        },
      ],
      commitmentsTitle: 'Capabilities at a Glance',
      commitments: [
        { label: 'Industries', value: 'Retail · Finance · Pharma · Education · FMCG · Jewelry' },
        { label: 'Models Supported', value: 'Qwen · DeepSeek · GLM · Llama · Private LLMs' },
        { label: 'Deployment', value: 'On-premise · Hybrid · Compute Appliance' },
        { label: 'Delivery Cadence', value: '6–10 weeks scenario POC to production' },
      ],
    },
    services: {
      title: 'Our Services',
      items: [
        {
          title: 'AIGC Scenario Construction & Co-creation',
          desc: 'Diving deep into business workflows to identify high-value AI scenarios, providing end-to-end consulting from POC to implementation.',
        },
        {
          title: 'Private Large Model Deployment',
          desc: 'Providing secure and controllable private deployment solutions for large models to ensure data asset security.',
        },
        {
          title: 'Fine-tuning & RAG Optimization',
          desc: 'Fine-tuning models for industry-specific knowledge and optimizing RAG with vector databases for precision.',
        },
        {
          title: 'NPU & GPU All-in-One Machine',
          desc: 'Providing converged NPU/GPU training and inference all-in-one machines to lower the entry barrier for AI.',
        },
      ],
    },
    industries: {
      title: 'Industries',
      list: [
        {
          name: 'Retail',
          desc: 'Building smart retail ecosystems with AI-driven personalized shopping assistants, marketing content generation, and demand forecasting.',
        },
        {
          name: 'Financial Industry',
          desc: 'Optimizing risk assessments, intelligent investment advisors, and automated document auditing with LLM technology.',
        },
        {
          name: 'Education',
          desc: 'Creating personalized learning assistants, automated content generation, and tailored learning paths for the future of education.',
        },
      ],
    },
    stories: {
      title: 'Success Stories',
      items: [
        {
          title: 'Global Coffee Chain',
          desc: 'Developed a personalized marketing experimental platform, continuously optimizing core indicators through an experiment system, achieving marketing automation and significantly increasing customer engagement and sales conversion.',
        },
        {
          title: 'Fortune 500 Pharma',
          desc: 'Launched a health management & smart medical chain mini-program, covering precise blood pressure analysis, rich knowledge base, and personalized health assessments.',
        },
        {
          title: 'Top Global School',
          desc: 'Provided advanced AI agent building services, supporting educational management, student interaction, and personalized learning via agent technology.',
        },
        {
          title: 'Retail Industry Leader',
          desc: 'Developed a business mini-program that solved management problems for tasting events, optimizing organizational efficiency and brand operational capabilities.',
        },
        {
          title: 'Domestic Cosmetic Firm',
          desc: 'Created DatAI agent services, providing deep data insights through data cleaning, lightning visualization, and database integration.',
        },
        {
          title: 'Century Jewelry Brand',
          desc: 'Implemented a RAG smart customer service system, enhancing service experience through intelligent interaction and efficient problem-solving.',
        },
      ],
    },
    chat: 'Start Chat Now!',
    cta: { start: 'Get Started' },
    stats: [
      { label: 'Industries', value: '10+' },
      { label: 'Case Studies', value: '50+' },
      { label: 'Accuracy', value: '98%' },
      { label: 'Efficiency Boost', value: '300%' },
    ],
    workflow: {
      title: 'Our Process',
      steps: [
        { title: 'Consultation', desc: 'Deep dive into pain points to identify high-value scenarios.' },
        { title: 'Strategy', desc: 'Tailor-made AIGC roadmap and implementation planning.' },
        { title: 'POC', desc: 'Rapid prototyping and proof-of-concept validation.' },
        { title: 'Full Scale', desc: 'Production deployment with continuous model optimization.' },
      ],
    },
    contact: {
      title: 'Start Your AI Journey',
      subtitle: 'Contact Bydata experts to customize your enterprise-grade AIGC solution.',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      addressLabel: 'Address',
      email: 'sales@bydata.net',
      phone: '17625213200',
      address: 'No. 138 Huaihai Middle Road, Huangpu District, Shanghai, China',
    },
    contactForm: {
      title: 'Send Us a Message',
      subtitle: 'We will reply to your enquiry within 24 hours.',
      name: 'Name',
      namePlaceholder: 'Your name',
      company: 'Company',
      companyPlaceholder: 'Your organisation',
      email: 'Email',
      emailPlaceholder: 'name@company.com',
      phone: 'Phone',
      phonePlaceholder: '+86 ...',
      message: 'Message',
      messagePlaceholder: 'Briefly describe your scenario and needs',
      captcha: 'Captcha',
      captchaPlaceholder: 'Type the characters',
      refresh: 'Refresh captcha',
      submit: 'Submit Enquiry',
      submitting: 'Submitting…',
      success: 'Received. We will contact you shortly.',
      errorGeneric: 'Submission failed. Please try again later.',
      errorCaptcha: 'Failed to load captcha. Please refresh.',
      errorNetwork: 'Network error. Please try again later.',
    },
    footer: {
      icp: '沪 ICP 备 2024096280 号 - 1',
      copy: '© 2026 Bydata. All rights reserved.',
    },
  },
} as const;

const STORAGE_KEY = 'bydata-lang';

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'cn';
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'cn') return fromUrl;
  const fromStorage = window.localStorage.getItem(STORAGE_KEY);
  if (fromStorage === 'en' || fromStorage === 'cn') return fromStorage;
  return 'cn';
}

export default function App() {
  const [lang, setLang] = useState<Language>(getInitialLang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    window.localStorage.setItem(STORAGE_KEY, lang);
    const url = new URL(window.location.href);
    if (lang === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    window.history.replaceState({}, '', url.toString());
  }, [lang, t.htmlLang]);

  // Lock body scroll when mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLanguageToggle = () => setLang(lang === 'cn' ? 'en' : 'cn');

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navItems: Array<{ id: string; label: string }> = [
    { id: 'top', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'services', label: t.nav.services },
    { id: 'industry', label: t.nav.industry },
    { id: 'stories', label: t.nav.stories },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <div id="top" className="min-h-screen bg-white font-sans selection:bg-blue-100">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center relative">
          <button
            onClick={() => scrollToSection('top')}
            className="flex items-center gap-4 cursor-pointer flex-shrink-0"
            aria-label="Bydata home"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                <div className="w-2.5 h-2.5 bg-blue-500/60 rounded-sm" />
                <div className="w-2.5 h-2.5 bg-blue-500/60 rounded-sm" />
              </div>
              <div className="ml-4 flex flex-col items-start h-8 justify-between relative">
                <div className="w-6 h-3 bg-blue-600 rounded-t-sm rounded-br-sm ml-1" />
                <div className="w-3 h-2 bg-blue-600" />
                <div className="w-5 h-3 bg-blue-600 rounded-b-sm rounded-tr-sm ml-1" />
                <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-sm rotate-45" />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-3xl font-black tracking-tight text-blue-600 leading-none">BYDATA</span>
              <span className="text-[10px] font-bold tracking-[0.1em] text-blue-600 mt-0.5">THE POWER OF AI</span>
            </div>
          </button>

          {/* Centered desktop nav links (absolute, viewport-centered) */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ul className="flex gap-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
              {navItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={
                      i === 0
                        ? 'text-blue-600 border-b-2 border-blue-600 py-1'
                        : 'hover:text-blue-600 transition-colors'
                    }
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right group: lang + CTA (desktop only) */}
          <div className="hidden md:flex items-center gap-4 ml-auto flex-shrink-0">
            <button
              onClick={handleLanguageToggle}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-all"
            >
              {lang === 'cn' ? '中文 / EN' : 'EN / 中文'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-blue-600 text-white px-6 py-2 text-sm font-semibold rounded-sm hover:bg-blue-700 transition-all uppercase tracking-wide"
            >
              {t.cta.start}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden ml-auto p-2 text-slate-600"
            aria-label={lang === 'cn' ? '打开菜单' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={{ x: mobileMenuOpen ? '0%' : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col"
        style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex justify-between items-center h-20 px-6 border-b border-slate-100">
          <span className="text-xl font-black text-blue-600">BYDATA</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-600"
            aria-label={lang === 'cn' ? '关闭菜单' : 'Close menu'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 flex flex-col px-6 py-8 gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              className="py-4 text-lg font-bold text-slate-800 border-b border-slate-100 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="mt-8 flex flex-col gap-4">
            <button
              onClick={handleLanguageToggle}
              className="py-3 text-sm font-bold text-slate-500 border border-slate-200 rounded-sm hover:bg-slate-50 transition-all"
            >
              {lang === 'cn' ? '切换到 English' : '切换到中文'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="py-3 bg-blue-600 text-white font-semibold rounded-sm hover:bg-blue-700 transition-all"
            >
              {t.cta.start}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[85vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 bg-white overflow-hidden"
      >
        {/* Designer hero background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        {/* Modern Mesh Background overlay */}
        <div className="absolute inset-x-0 top-0 h-[1000px] z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-50/60 rounded-full blur-[140px]" />
          <div className="absolute top-[10%] right-[-5%] w-[40%] h-[50%] bg-indigo-50/50 rounded-full blur-[140px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_100%,transparent_110%)]" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="inline-block px-5 py-2 mb-8 text-xs font-bold tracking-[0.25em] text-blue-600 bg-blue-50/80 backdrop-blur-sm rounded-full uppercase border border-blue-100/50">
              {t.hero.tag}
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.05]">
              <span>{t.hero.titlePre}</span>
              <span className="hidden md:inline">{' '}</span>
              <span className="block md:inline text-blue-600">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => scrollToSection('contact')}
                className="group relative px-10 py-5 bg-blue-600 text-white font-bold rounded-full overflow-hidden transition-all hover:pr-14 active:scale-95 shadow-2xl shadow-blue-200"
              >
                <span className="relative z-10">{t.hero.btn1}</span>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all font-bold text-xl">→</span>
              </button>
              <button
                onClick={() => scrollToSection('stories')}
                className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-bold rounded-full hover:bg-slate-50 transition-all hover:border-slate-300 hover:shadow-lg"
              >
                {t.hero.btn2}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Trust Stats */}
        <div className="max-w-6xl w-full mx-auto px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100"
          >
            {t.stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white p-12 text-center flex flex-col gap-2 group hover:bg-slate-50 transition-colors"
              >
                <span className="text-5xl font-black text-blue-600 tracking-tighter group-hover:scale-110 transition-transform duration-500">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-10">{t.about.title}</h2>
            <p className="text-xl text-slate-700 leading-[1.9] font-medium mb-6">{t.about.lead}</p>
            <p className="text-lg text-slate-500 leading-[1.9]">{t.about.lead2}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-3">
                {t.about.pillarsTitle}
              </span>
              <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {t.about.pillars.map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black mb-6">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-[1.8]">{pillar.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-[0.25em] mb-3">
                {t.about.commitmentsTitle}
              </span>
              <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {t.about.commitments.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition-colors"
                >
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                    {item.label}
                  </div>
                  <div className="text-base font-bold text-slate-900 leading-snug">{item.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 -translate-y-1/2 hidden lg:block" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              {t.workflow.title}
            </h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-4 gap-12 relative">
            {t.workflow.steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative flex flex-col items-center group"
              >
                <div className="relative mb-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center text-3xl font-black text-blue-600 shadow-xl group-hover:shadow-blue-200/50 group-hover:-translate-y-2 transition-all duration-500 z-10 relative">
                    {i + 1}
                  </div>
                  <div className="absolute -inset-2 bg-blue-50/50 rounded-[2.2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">
                    {step.desc}
                  </p>
                </div>
                {i < t.workflow.steps.length - 1 && (
                  <div className="mt-8 lg:hidden text-slate-200">
                    <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.services.title}</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.services.items.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl mb-6 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Section */}
      <section id="industry" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-6">{t.industries.title}</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-12">
            {t.industries.list.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 rounded-3xl hover:shadow-2xl transition-all border border-slate-100 group"
              >
                <div className="text-4xl font-black text-slate-100 mb-8 group-hover:text-blue-100 transition-colors">
                  0{i + 1}
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900">{ind.name}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="stories" className="py-32 bg-indigo-50/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.stories.title}</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.stories.items.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-6 p-10 bg-white border border-slate-100 hover:shadow-2xl transition-all rounded-3xl group"
              >
                <h3 className="text-2xl font-bold text-blue-700 leading-tight group-hover:text-blue-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">{story.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <button
        onClick={() => scrollToSection('contact')}
        className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
        aria-label={t.chat}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <span className="font-bold whitespace-nowrap">{t.chat}</span>
      </button>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 bg-blue-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          {/* Centered header: logo + title + subtitle */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <div className="w-2 h-2 bg-white/60 rounded-sm" />
                  <div className="w-2 h-2 bg-white/60 rounded-sm" />
                </div>
                <div className="ml-3 flex flex-col items-start h-7 justify-between relative">
                  <div className="w-5 h-2.5 bg-white rounded-t-sm rounded-br-sm ml-1" />
                  <div className="w-2.5 h-1.5 bg-white" />
                  <div className="w-4 h-2.5 bg-white rounded-b-sm rounded-tr-sm ml-1" />
                  <div className="absolute top-1/2 right-[-5px] -translate-y-1/2 w-3 h-3 bg-white rounded-sm rotate-45" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black tracking-tight text-white leading-none">BYDATA</span>
                <span className="text-[9px] font-bold tracking-[0.1em] text-white/80 mt-0.5 uppercase">
                  The Power of AI
                </span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.contact.title}</h2>
            <p className="text-base md:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          {/* 2-column: 3 contact cards stacked + ContactForm */}
          <div className="grid lg:grid-cols-5 gap-6 md:gap-8 items-start">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <a
                href={`tel:${t.contact.phone}`}
                className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">
                {t.contact.phoneLabel}
              </span>
              <span className="text-base font-medium">{t.contact.phone}</span>
            </a>

            <a
              href={`mailto:${t.contact.email}`}
              className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">
                {t.contact.emailLabel}
              </span>
              <span className="text-base font-medium break-all">{t.contact.email}</span>
            </a>

            <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-200">
                {t.contact.addressLabel}
              </span>
              <span className="text-sm font-medium leading-snug">{t.contact.address}</span>
            </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm site="bydata" labels={t.contactForm} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="bg-blue-600 py-12 px-6 md:px-12 text-xs text-blue-100 font-medium border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-4 text-center">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {t.footer.icp}
          </a>
          <span>{t.footer.copy}</span>
        </div>
      </footer>
    </div>
  );
}
