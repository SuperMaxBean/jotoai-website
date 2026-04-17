'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, CheckCircle2, Sparkles, Zap, Shield, Globe, 
  FileText, Database, Share2, Lock, Cpu, Layout, 
  MessageSquare, Search, BookOpen, BarChart3, 
  ChevronDown, Plus, Minus, ExternalLink, Layers,
  Users, Building2, GraduationCap, Landmark, Factory, Menu, X
} from 'lucide-react';

import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { VisualParsing, VisualKnowledgeBase, VisualSkills, VisualMCP } from '../components/CapabilityVisuals';
import { useLanguage } from '../contexts/LanguageContext';

// --- Components ---

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { lang, toggleLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goHome = () => {
    if (pathname !== '/') {
      router.push('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={goHome}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tighter text-slate-900 leading-none">{t('唯客企业知识中台', 'Enterprise Knowledge Hub')}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('JOTO 旗下产品', 'A JOTO Product')}</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => scrollToSection('capabilities')} className="hover:text-indigo-600 transition-colors">{t('产品能力', 'Capabilities')}</button>
          <button onClick={() => scrollToSection('solutions')} className="hover:text-indigo-600 transition-colors">{t('解决方案', 'Solutions')}</button>
          <button onClick={() => scrollToSection('comparison')} className="hover:text-indigo-600 transition-colors">{t('方案对比', 'Comparison')}</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-indigo-600 transition-colors">FAQ</button>
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">{t('博客', 'Blog')}</Link>
          <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-600 transition-colors">{t('联系我们', 'Contact')}</button>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">{t('登录', 'Login')}</Link>
          <button onClick={() => scrollToSection('contact')} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-sm">
            {t('预约15分钟演示', 'Book a 15-min Demo')}
          </button>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-slate-600">
              <button onClick={() => scrollToSection('capabilities')} className="text-left hover:text-indigo-600 transition-colors">{t('产品能力', 'Capabilities')}</button>
              <button onClick={() => scrollToSection('solutions')} className="text-left hover:text-indigo-600 transition-colors">{t('解决方案', 'Solutions')}</button>
              <button onClick={() => scrollToSection('comparison')} className="text-left hover:text-indigo-600 transition-colors">{t('方案对比', 'Comparison')}</button>
              <button onClick={() => scrollToSection('faq')} className="text-left hover:text-indigo-600 transition-colors">FAQ</button>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left hover:text-indigo-600 transition-colors">{t('博客', 'Blog')}</Link>
              <button onClick={() => scrollToSection('contact')} className="text-left hover:text-indigo-600 transition-colors">{t('联系我们', 'Contact')}</button>
              <div className="h-px bg-slate-100 my-2"></div>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-semibold text-slate-700 hover:text-indigo-600 transition-colors">{t('登录', 'Login')}</Link>
              <button onClick={() => scrollToSection('contact')} className="w-full py-3 text-center font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
                {t('预约15分钟演示', 'Book a 15-min Demo')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ArchitectureDiagram = () => {
  const { t } = useLanguage();
  return (
  <div className="relative w-full aspect-square max-w-lg mx-auto p-8 flex flex-col items-center justify-center gap-6">
    {/* Top Layer: Agents/Systems */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full bg-white rounded-2xl border-2 border-indigo-100 p-4 shadow-xl shadow-indigo-50 flex items-center justify-center gap-4 relative z-10"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
        <Cpu className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-700">{t('智能体 (Agents)', 'Agents')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
        <Layout className="w-4 h-4 text-slate-600" />
        <span className="text-xs font-bold text-slate-700">{t('企业业务系统', 'Business Systems')}</span>
      </div>
    </motion.div>

    {/* Connector: Middle to Top */}
    <div className="relative w-4 h-12 flex justify-center">
      <div className="w-0.5 h-full bg-slate-200 absolute left-1/2 -translate-x-1/2" />
      <div className="absolute inset-0 overflow-hidden">
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            initial={{ top: "100%", opacity: 0 }}
            animate={{ top: "-20%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay, ease: "linear" }}
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-3 bg-indigo-500 rounded-full blur-[1px] shadow-[0_0_8px_rgba(79,70,229,0.6)]"
          />
        ))}
      </div>
    </div>

    {/* Middle Layer: JOTO Platform */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="w-full bg-indigo-600 rounded-3xl p-6 shadow-2xl shadow-indigo-200 text-white relative overflow-hidden z-10"
    >
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-0 right-0 p-4"
      >
        <Layers className="w-24 h-24" />
      </motion.div>
      <div className="text-center font-bold text-lg mb-4">{t('企业知识中台', 'Enterprise Knowledge Hub')}</div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: FileText, text: t("全格式智能解析", "Smart Document Parsing") },
          { icon: Database, text: t("企业级知识库", "Enterprise Knowledge Base") },
          { icon: Lock, text: t("精细权限管控", "Fine-grained Access Control") },
          { icon: Share2, text: t("开放生态集成", "Open Ecosystem Integration") }
        ].map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-[10px] font-medium flex flex-col items-center gap-2 transition-colors"
          >
            <item.icon className="w-4 h-4" />
            {item.text}
          </motion.div>
        ))}
      </div>
    </motion.div>

    {/* Connector: Bottom to Middle */}
    <div className="relative w-4 h-12 flex justify-center">
      <div className="w-0.5 h-full bg-slate-200 absolute left-1/2 -translate-x-1/2" />
      <div className="absolute inset-0 overflow-hidden">
        {[0, 0.5, 1].map((delay) => (
          <motion.div
            key={delay}
            initial={{ top: "100%", opacity: 0 }}
            animate={{ top: "-20%", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay, ease: "linear" }}
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-3 bg-indigo-400 rounded-full blur-[1px] shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          />
        ))}
      </div>
    </div>

    {/* Bottom Layer: Data Sources */}
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="w-full grid grid-cols-3 gap-3 relative z-10"
    >
      {[
        { label: t("结构化", "Structured"), desc: "ERP / CRM / DB" },
        { label: t("非结构化", "Unstructured"), desc: t("PDF / CAD / 文档", "PDF / CAD / Docs") },
        { label: t("外部数据", "External Data"), desc: t("Web / API / 行业", "Web / API / Industry") }
      ].map((source, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -2, borderColor: "rgba(79,70,229,0.3)" }}
          className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm transition-all"
        >
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{source.label}</div>
          <div className="text-[10px] font-medium text-slate-600 leading-tight">{source.desc}</div>
        </motion.div>
      ))}
    </motion.div>

    {/* Background Glow */}
    <div className="absolute inset-0 -z-10 bg-indigo-50/30 rounded-full blur-3xl" />
  </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string, key?: React.Key }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl mb-4 shadow-sm border border-slate-100 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{question}</span>
        <div className="text-slate-900 transition-transform duration-200">
          {isOpen ? <span className="text-2xl leading-none">&times;</span> : <Plus className="w-5 h-5" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-slate-500 leading-relaxed text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---

const LandingPage = () => {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  // 处理从其他页面跳转过来时的锚点滚动（如 /?scrollTo=contact）
  useEffect(() => {
    const scrollTarget = searchParams.get('scrollTo');
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'auto' });
        window.history.replaceState({}, '', '/');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Contact form state
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', message: '' });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchCaptcha = useCallback(async () => {
    try {
      const res = await fetch('/api/captcha');
      const data = await res.json();
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.svg);
      setCaptchaInput('');
    } catch (err) {
      console.error('Failed to fetch captcha:', err);
    }
  }, []);

  useEffect(() => { fetchCaptcha(); }, [fetchCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.phone || !formData.email) {
      setSubmitStatus('error');
      setSubmitMessage(t('请填写所有必填项', 'Please fill in all required fields'));
      return;
    }
    if (!captchaInput) {
      setSubmitStatus('error');
      setSubmitMessage(t('请输入验证码', 'Please enter the captcha'));
      return;
    }
    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captchaId,
          captchaText: captchaInput,
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(t('提交成功！我们将尽快与您联系。', 'Submitted successfully! We will contact you soon.'));
        setFormData({ name: '', company: '', phone: '', email: '', message: '' });
        setCaptchaInput('');
        fetchCaptcha();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || t('提交失败，请重试', 'Submission failed, please try again'));
        fetchCaptcha();
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage(t('网络错误，请稍后重试', 'Network error, please try again later'));
      fetchCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth overflow-x-hidden pt-16">
      <Navbar />

      {/* Section 1: Hero */}
      <section className="relative px-6 pt-8 pb-16 mx-auto max-w-7xl overflow-hidden">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:pt-12 items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" />
              <span>{t('AI 驱动的企业知识进化', 'AI-Powered Enterprise Knowledge Evolution')}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
              <span className="text-indigo-600">{t('企业知识中台', 'Enterprise Knowledge Hub')}</span>
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-700 mb-6">
              {t('让企业知识资产助力组织的决策与创新', 'Empower organizational decisions and innovation with enterprise knowledge assets')}
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              {t('支持全格式文档智能解析，构建企业级 RAG 知识库，打通 AI 与业务系统的最后一公里。', 'Smart parsing for all document formats, building enterprise-grade RAG knowledge bases, bridging the last mile between AI and business systems.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                {t('预约15分钟演示', 'Book a 15-min Demo')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-16 lg:mt-0"
          >
            <ArchitectureDiagram />
          </motion.div>
        </div>

        {/* Integrated Logo Wall - Infinite Scroll */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-8 border-t border-slate-100 overflow-hidden"
        >
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            {t('已服务企业', 'Trusted By')}
          </p>
          <div className="relative flex overflow-hidden">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex whitespace-nowrap gap-x-16 items-center px-8"
            >
              {[
                { name: '上海家化', logo: '/logos/01_jahwa.png' },
                { name: 'MEVION', logo: '/logos/02_mevion.png' },
                { name: 'Cartier', logo: '/logos/03_cartier.png' },
                { name: 'Mercedes-Benz', logo: '/logos/04_mercedes.png' },
                { name: '华润数科', logo: '/logos/05_crdigital.png' },
                { name: '信达生物', logo: '/logos/06_innovent.png' },
                { name: '汤臣倍健', logo: '/logos/07_byhealth.png' },
                { name: '科沃斯', logo: '/logos/08_ecovacs.png' },
                { name: '上海家化', logo: '/logos/01_jahwa.png' },
                { name: 'MEVION', logo: '/logos/02_mevion.png' },
                { name: 'Cartier', logo: '/logos/03_cartier.png' },
                { name: 'Mercedes-Benz', logo: '/logos/04_mercedes.png' },
                { name: '华润数科', logo: '/logos/05_crdigital.png' },
                { name: '信达生物', logo: '/logos/06_innovent.png' },
                { name: '汤臣倍健', logo: '/logos/07_byhealth.png' },
                { name: '科沃斯', logo: '/logos/08_ecovacs.png' },
              ].map((item, i) => (
                <div key={i} className="h-12 flex items-center justify-center min-w-[140px]">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-full w-auto object-contain hover:opacity-80 transition-all duration-500 max-w-[160px]"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Section 3: Pain Points */}
      <section className="py-24 px-6 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t('企业知识管理，为什么这么难？', 'Why Is Enterprise Knowledge Management So Hard?')}</h2>
          <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: t("文档格式五花八门", "Diverse Document Formats"), desc: t("PDF、Word、Excel、扫描件、CAD图纸……知识散落各处，员工找不到、用不上。", "PDF, Word, Excel, scans, CAD drawings... knowledge scattered everywhere, employees can't find or use it."), icon: FileText },
            { title: t("大模型接入后质量低", "Low Quality After LLM Integration"), desc: t("表格变乱码、图片被忽略、跨页内容被截断，RAG效果大打折扣。", "Tables turn to gibberish, images are ignored, cross-page content gets truncated -- RAG effectiveness drops significantly."), icon: Zap },
            { title: t("安全与权限管控两难", "Security vs. Access Control Dilemma"), desc: t("要么数据上云不放心，要么私有化部署后功能缩水，部门间权限难以精细管控。", "Either worry about cloud data security, or deal with reduced features after private deployment, with limited cross-department access control."), icon: Shield },
            { title: t("被大厂生态绑定", "Vendor Lock-in"), desc: t("一旦接入某平台，换个AI编排工具就要重新建库，数据资产无法复用。", "Once you integrate with a platform, switching AI orchestration tools means rebuilding everything -- data assets can't be reused."), icon: Share2 }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 5: Core Capabilities */}
      <section id="capabilities" className="py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center px-6 mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">{t('精准破局：四大核心能力破解知识管理四大难题', 'Precision Solutions: Four Core Capabilities Solving Four Key Challenges')}</h2>
          <p className="text-slate-500 max-w-3xl mx-auto">{t('告别格式混乱、质量低下、安全两难与生态绑定，让知识高效流转复用', 'Say goodbye to format chaos, low quality, security dilemmas, and vendor lock-in -- enabling efficient knowledge flow and reuse')}</p>
        </motion.div>

        {/* Capability 1 */}
        <div className="px-6 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-12 items-center py-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-indigo-50 rounded-[2rem] -z-10 transform -rotate-1" />
            <VisualParsing />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 lg:mt-0"
          >
            <h3 className="text-3xl font-bold mb-8">{t('全格式文档，精准解析', 'All Formats, Precision Parsing')}</h3>
            <ul className="space-y-6">
              {[
                { t: t("图片解析", "Image Parsing"), d: t("调用多模态模型生成内容描述", "Multimodal models generate content descriptions") },
                { t: t("图表解析", "Chart & Diagram Parsing"), d: t("流程图/架构图自动提取并生成详细描述文本", "Flowcharts/architecture diagrams auto-extracted with detailed text descriptions") },
                { t: t("跨页复杂排版", "Cross-page Complex Layouts"), d: t("表格跨页上下文完整绑定，不丢失关联", "Cross-page table context fully preserved, no lost associations") },
                { t: t("科学公式解析", "Scientific Formula Parsing"), d: t("公式转化为 LaTex 和 Markdown", "Formulas converted to LaTeX and Markdown") },
                { t: t("自动分段 + 多语言支持", "Auto Segmentation + Multilingual"), d: t("基于语义智能切分，补全上下文", "Semantic-based intelligent splitting with context completion") },
                { t: t("人工标注机制", "Manual Annotation"), d: t("可将解析准确率提升至 95%", "Can boost parsing accuracy to 95%") }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{item.t}：</span>
                    <span className="text-slate-500">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Capability 2 */}
        <div className="bg-slate-50 py-16">
          <div className="px-6 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-1"
            >
              <h3 className="text-3xl font-bold mb-8">{t('企业级知识库，开箱即用', 'Enterprise Knowledge Base, Ready Out of the Box')}</h3>
              <ul className="space-y-6">
                {[
                  { t: t("文档格式自动识别", "Auto Format Detection"), d: t("Word/Excel/PPT/PDF/图片/扫描件，无需手动选择解析器", "Word/Excel/PPT/PDF/images/scans -- no manual parser selection needed") },
                  { t: t("内容类型智能适配", "Smart Content Type Adaptation"), d: t("页眉页脚/文本/表格/图片分类处理，支持定制 CV 模型训练", "Headers/footers/text/tables/images classified, with custom CV model training support") },
                  { t: t("多模态图像解析", "Multimodal Image Parsing"), d: t("CV 模型结合多模态大模型，图像信息完整提取", "CV models combined with multimodal LLMs for complete image information extraction") },
                  { t: t("灵活知识库配置", "Flexible Knowledge Base Config"), d: t("支持 HTTP 与 MCP，兼容 Dify / HiAgent / 百炼等平台", "Supports HTTP and MCP, compatible with Dify / HiAgent / Bailian and more") },
                  { t: t("严密数据安全管控", "Rigorous Data Security"), d: t("SSO 单点登录，部门/成员四级权限精细管控", "SSO login, four-level department/member access control") },
                  { t: t("高可用 k8s 部署", "High-Availability k8s Deployment"), d: t("集群化部署，弹性扩容，支持高并发高负载", "Clustered deployment, elastic scaling, high concurrency and load support") }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{item.t}：</span>
                      <span className="text-slate-500">{item.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-2 relative"
            >
              <div className="absolute -inset-4 bg-indigo-600/5 rounded-[2rem] -z-10 transform rotate-1" />
              <VisualKnowledgeBase />
            </motion.div>
          </div>
        </div>

        {/* Capability 3 */}
        <div className="px-6 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-12 items-center py-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-indigo-50 rounded-[2rem] -z-10 transform -rotate-1" />
            <VisualSkills />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-12 lg:mt-0"
          >
            <h3 className="text-3xl font-bold mb-8">{t('知识不止于检索，直接转化为成果', 'Beyond Search -- Transform Knowledge into Results')}</h3>
            <ul className="space-y-6">
              {[
                { t: t("内置技能", "Built-in Skills"), d: t("文档摘要 / 脑图生成 / PPT 草稿输出 / 摘要报告", "Document summaries / mind maps / PPT drafts / summary reports") },
                { t: t("自定义技能", "Custom Skills"), d: t("企业可配置专属业务技能", "Enterprises can configure custom business skills") },
                { t: t("技能与知识库联动", "Skills + Knowledge Base Integration"), d: t("解析结果直接驱动技能输出", "Parsing results directly drive skill outputs") },
                { t: t("开放调用", "Open Invocation"), d: t("可通过 MCP 协议供外部 Agent 调用", "Accessible via MCP protocol for external Agents") }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{item.t}：</span>
                    <span className="text-slate-500">{item.d}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Capability 4 */}
        <div className="bg-slate-50 py-16">
          <div className="px-6 mx-auto max-w-7xl lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-2 lg:order-1"
            >
              <h3 className="text-3xl font-bold mb-8">{t('打通 AI 与业务系统的最后一公里', 'Bridging the Last Mile Between AI and Business Systems')}</h3>
              <ul className="space-y-6">
                {[
                  { t: t("REST API 转换", "REST API Conversion"), d: t("一键转换 MCP 服务", "One-click conversion to MCP services") },
                  { t: t("业务系统全打通", "Full Business System Integration"), d: t("ERP / CRM / O365 / 钉钉 / 飞书", "ERP / CRM / O365 / DingTalk / Feishu") },
                  { t: "SDK", d: t("提供 Node.js / Python SDK", "Node.js / Python SDK available") },
                  { t: t("企业级安全保障", "Enterprise-grade Security"), d: t("调用轨迹留痕，权限统一管控", "Full audit trail, unified access control") }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">{item.t}：</span>
                      <span className="text-slate-500">{item.d}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="order-1 lg:order-2 relative"
            >
              <div className="absolute -inset-4 bg-indigo-600/5 rounded-[2rem] -z-10 transform rotate-1" />
              <VisualMCP />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 6: Industry Solutions (Knowledge Hub Focused) */}
      <section id="solutions" className="py-24 bg-slate-950 text-white">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('覆盖核心业务场景', 'Covering Core Business Scenarios')}</h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t("金融行业", "Finance"),
                desc: t("助力投研分析与合规审查，将海量研报与法规转化为即时洞察。", "Empowering investment research and compliance review, transforming massive reports and regulations into instant insights."),
                icon: Landmark,
                points: [t("研报数据自动提取", "Auto-extraction of research data"), t("合规条款智能比对", "Smart compliance clause comparison"), t("监管政策实时问答", "Real-time regulatory policy Q&A")]
              },
              {
                title: t("政务与公共服务", "Government & Public Services"),
                desc: t("构建政务知识大脑，提升政策咨询与政务审批的智能化水平。", "Building a government knowledge brain, enhancing smart policy consultation and administrative approvals."),
                icon: Building2,
                points: [t("政策文件精准问答", "Precise policy document Q&A"), t("办事流程智能导航", "Smart process navigation"), t("跨部门知识协同", "Cross-department knowledge collaboration")]
              },
              {
                title: t("医疗健康", "Healthcare"),
                desc: t("整合临床指南与医学文献，为医生提供精准的辅助诊疗知识支持。", "Integrating clinical guidelines and medical literature, providing precise diagnostic knowledge support for doctors."),
                icon: GraduationCap,
                points: [t("医学文献多维检索", "Multi-dimensional medical literature search"), t("临床指南语义解析", "Semantic parsing of clinical guidelines"), t("诊疗知识关联问答", "Diagnostic knowledge Q&A")]
              },
              {
                title: t("教育行业", "Education"),
                desc: t("打造校园智能知识库，实现教学资源与学术成果的数字化管理。", "Building smart campus knowledge bases for digital management of teaching resources and academic achievements."),
                icon: Users,
                points: [t("教学资料智能分类", "Smart teaching material classification"), t("学术论文关联分析", "Academic paper association analysis"), t("校园知识统一检索", "Unified campus knowledge search")]
              },
              {
                title: t("汽车与制造", "Automotive & Manufacturing"),
                desc: t("管理复杂的工程图纸与技术手册，加速研发创新与售后服务响应。", "Managing complex engineering drawings and technical manuals, accelerating R&D innovation and after-sales service."),
                icon: Factory,
                points: [t("CAD图纸语义索引", "Semantic indexing of CAD drawings"), t("技术文档自动摘要", "Auto-summary of technical documents"), t("售后知识精准匹配", "Precise after-sales knowledge matching")]
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col h-full hover:bg-white/[0.08] transition-all"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">{item.desc}</p>
                
                <div className="mt-auto pt-8 border-t border-white/5">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t('核心价值', 'Core Value')}</div>
                  <ul className="space-y-3">
                    {item.points.map((p, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}

            {/* More Industry Solutions Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="p-10 bg-indigo-600 rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-indigo-700 transition-all"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('更多行业方案？', 'More Industry Solutions?')}</h3>
              <p className="text-indigo-100 mb-8">{t('我们的知识中台支持高度定制，满足各行业的特定业务需求。', 'Our Knowledge Hub supports extensive customization to meet industry-specific business needs.')}</p>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
              >
                {t('定制您的方案', 'Customize Your Solution')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 7: Comparison */}
      <section id="comparison" className="py-24 px-6 mx-auto max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('核心优势对比', 'Core Advantages Comparison')}</h2>
          <p className="text-slate-500">{t('专为企业级复杂场景设计的知识中台', 'A knowledge hub designed for complex enterprise scenarios')}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-6 text-left text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">{t('能力维度', 'Capability')}</th>
                <th className="p-6 text-left text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-slate-200 bg-indigo-50/50">{t('唯客', 'JOTO')}</th>
                <th className="p-6 text-left text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">{t('大厂方案', 'Big Tech Solutions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                [t("复杂文档解析（图表/公式）", "Complex Doc Parsing (Charts/Formulas)"), t("专精", "Specialized"), t("一般", "Average")],
                [t("多模态图像理解", "Multimodal Image Understanding"), t("强", "Strong"), t("一般", "Average")],
                [t("跨平台知识库集成", "Cross-platform KB Integration"), t("全兼容", "Fully Compatible"), t("生态锁定", "Vendor Lock-in")],
                [t("私有化部署", "Private Deployment"), t("支持", "Supported"), t("支持", "Supported")],
                [t("MCP协议支持", "MCP Protocol Support"), t("支持", "Supported"), t("不支持", "Not Supported")],
                [t("Skill 支持", "Skill Support"), t("支持", "Supported"), t("不支持", "Not Supported")],
                [t("部门级权限管控", "Department-level Access Control"), t("精细", "Fine-grained"), t("一般", "Average")],
                [t("国产模型兼容（千问/文心）", "Domestic LLM Support (Qwen/ERNIE)"), t("支持", "Supported"), t("支持", "Supported")]
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 text-sm font-medium text-slate-700">{row[0]}</td>
                  <td className="p-6 text-sm font-bold text-indigo-600 bg-indigo-50/30">{row[1]}</td>
                  <td className="p-6 text-sm text-slate-500">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Section 9: FAQ */}
      <section id="faq" className="py-24 px-6 mx-auto max-w-7xl bg-[#fbfbfd]">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-sm font-semibold uppercase tracking-wider">FAQs</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              {t('常见问题解答', 'Frequently Asked Questions')}
            </h2>
            
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-white shadow-lg">
                <img src="/blog-placeholder.svg" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('预约 15 分钟沟通', 'Book a 15-min Consultation')}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {t('如果您有任何疑问，或者想了解企业知识中台如何帮助您的企业，欢迎在订阅前与我们进行 15 分钟的沟通。', 'Have questions or want to learn how our Enterprise Knowledge Hub can help your business? Schedule a free 15-minute consultation with us.')}
              </p>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
              >
                {t('免费预约沟通', 'Book Free Consultation')}
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            {[
              { q: t("是否支持本地 / 私有化部署？", "Do you support on-premises / private deployment?"), a: t("完整支持。企业知识中台支持基于 Kubernetes 的私有化部署，覆盖应用、服务、向量数据库等全部组件的集群化部署，数据完全留存在企业内网，不经过任何外部服务器。", "Fully supported. Our Enterprise Knowledge Hub supports Kubernetes-based private deployment, covering clustered deployment of all components including applications, services, and vector databases. Data stays entirely within the enterprise intranet.") },
              { q: t("是否支持自定义模型 / 接入私有化大模型？", "Do you support custom models / private LLM integration?"), a: t("完整支持。可接入任意兼容 OpenAI 协议的模型服务，包括本地部署的千问、文心、Llama 等，只需配置 Base URL 和 API Key，三步完成接入。", "Fully supported. Connect any OpenAI-compatible model service, including locally deployed Qwen, ERNIE, Llama, etc. Just configure Base URL and API Key -- three steps to connect.") },
              { q: t("是否支持部门级权限管控？", "Do you support department-level access control?"), a: t("支持，且粒度极细。可按部门或按成员分别配置四级权限：管理 / 编辑 / 查看 / 问答。同一份知识库可对不同部门设置不同权限。", "Yes, with extremely fine granularity. Four permission levels can be configured by department or member: Admin / Edit / View / Q&A. The same knowledge base can have different permissions for different departments.") },
              { q: t("是否支持与其他 AI 中台对接（如 Dify、MSKP 等）？", "Do you support integration with other AI platforms (e.g., Dify, MSKP)?"), a: t("支持。企业知识中台可作为 Dify、MSKP 等平台的第三方知识库，同一知识库可同时适配多个工作空间，也兼容 HiAgent、阿里百炼等平台。", "Yes. The Enterprise Knowledge Hub can serve as a third-party knowledge base for platforms like Dify and MSKP. The same knowledge base can adapt to multiple workspaces simultaneously, and is also compatible with HiAgent, Alibaba Bailian, and more.") },
              { q: t("是否支持基于语义的 Chunk 分段？", "Do you support semantic-based chunk segmentation?"), a: t("支持。除固定长度分段外，企业知识中台支持基于语义的智能分段，自动识别标题层级与章节结构，跨页表格也能完整保留上下文关联。", "Yes. Beyond fixed-length segmentation, our platform supports semantic-based intelligent segmentation, automatically recognizing heading hierarchies and chapter structures. Cross-page tables fully retain contextual associations.") },
              { q: t("单文件大小和文件数量有限制吗？", "Are there limits on file size or number of files?"), a: t("没有硬性限制。在实际生产环境中已处理过单文件超过 1GB 的工程图纸、以及单知识库上千份文档的场景，系统通过 k8s 弹性扩容保障稳定运行。", "No hard limits. In production environments, we have processed single files over 1GB (engineering drawings) and knowledge bases with thousands of documents. The system ensures stable operation through k8s elastic scaling.") },
              { q: t("支持哪些文件格式？", "What file formats are supported?"), a: t("支持 PDF、Word、Excel、PPT、图片（jpg/png/jpeg）、扫描件、CAD 图纸（.dwg/.dxf）、Markdown、CSV、TXT 等主流格式。", "PDF, Word, Excel, PPT, images (jpg/png/jpeg), scanned documents, CAD drawings (.dwg/.dxf), Markdown, CSV, TXT, and more mainstream formats.") },
              { q: t("解析结果可以直接生成脑图或 PPT 吗？", "Can parsing results generate mind maps or PPTs directly?"), a: t("可以。结合内置 Skills 能力，可直接输出结构化脑图、PPT 草稿、摘要报告等，帮助团队快速将文档知识转化为可用成果。", "Yes. Combined with built-in Skills capabilities, you can directly output structured mind maps, PPT drafts, summary reports, and more -- helping teams quickly transform document knowledge into actionable results.") }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Contact Form */}
      <section id="contact" className="py-24 bg-white relative overflow-hidden">
        <div className="px-6 mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-12 shadow-lg shadow-indigo-200">
              <Zap className="w-8 h-8 text-white transform rotate-12" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t('让企业知识资产成为', 'Make Enterprise Knowledge')}<br className="sm:hidden" />{t('驱动决策的核心引擎', 'the Core Engine for Decisions')}
            </h2>
            <p className="text-lg text-slate-500">{t('立即联系我们，获取专属演示与报价', 'Contact us now for a personalized demo and quote')}</p>
          </motion.div>
          
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column: Contact Info & QR */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 w-48 h-48 flex items-center justify-center">
                <img src="https://admin.jotoai.com/brand/wechat-qr.png" alt={t('微信扫码咨询', 'Scan WeChat QR Code')} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-8">{t('微信扫码咨询', 'Scan WeChat QR Code')}</h3>

              <div className="w-full space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-left shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">{t('咨询热线', 'Hotline')}</div>
                  <div className="text-xl font-bold text-slate-900">+86 (021) 6566 1628</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-left shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">{t('商务邮箱', 'Business Email')}</div>
                  <div className="text-lg font-bold text-slate-900">jotoai@jototech.cn</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-8 bg-slate-50 p-6 lg:p-10 rounded-[2rem] border border-slate-100"
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('姓名', 'Name')} <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('企业 / 机构', 'Company / Organization')} <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.company} onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('手机号码', 'Phone Number')} <span className="text-red-500">*</span></label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('电子邮箱', 'Email')} <span className="text-red-500">*</span></label>
                    <input type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('咨询需求', 'Your Requirements')} <span className="text-red-500">*</span></label>
                  <textarea rows={4} value={formData.message} onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))} required className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {submitMessage}
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                    {submitMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-end gap-6 pt-2">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">{t('验证码', 'Captcha')} <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                      <input type="text" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="flex-1 px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                      <div className="w-28 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden" onClick={fetchCaptcha} title={t('点击刷新验证码', 'Click to refresh captcha')}>
                        {captchaSvg ? (
                          <img src={captchaSvg} alt={t('验证码', 'Captcha')} className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-slate-400 text-sm">{t('加载中...', 'Loading...')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <button type="submit" disabled={submitStatus === 'loading'} className="w-full py-3.5 bg-[#8b5cf6] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-colors shadow-lg shadow-purple-200 disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitStatus === 'loading' ? t('提交中...', 'Submitting...') : t('提交申请', 'Submit')}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0f1c] text-slate-300 py-20 px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{t('企业知识中台', 'Enterprise Knowledge Hub')}</h3>
                <p className="text-sm text-slate-500">{t('唯客旗下产品', 'A JOTO Product')}</p>
              </div>
              <div className="space-y-3 text-sm pt-4">
                <p className="text-slate-400">{t('中国首家 Dify 官方服务商', "China's First Official Dify Service Provider")}</p>
                <p className="text-slate-400">jotoai@jototech.cn</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="hidden"></div>

            {/* Column 3 */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('产品目录', 'Products')}</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://shanyue.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('闪阅', 'ShanYue')}</a></li>
                <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dify</a></li>
                <li><a href="https://sec.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('AI 安全', 'AI Security')}</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-white font-bold mb-6">{t('关于我们', 'About Us')}</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('关于唯客', 'About JOTO')}</a></li>
                <li><a href="https://www.jotoai.com/?page_id=9069" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('合作伙伴', 'Partners')}</a></li>
                <li><a href="https://www.jotoai.com/?page_id=9968" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('加入我们', 'Join Us')}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-white/10 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>{t('上海聚托信息科技有限公司', 'Shanghai Jutuo Information Technology Co., Ltd.')} © 2026</p>
            <p>沪ICP备15056478号-5</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
