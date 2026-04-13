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

// --- Components ---

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
            <span className="text-xl font-extrabold tracking-tighter text-slate-900 leading-none">唯客企业知识中台</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">JOTO 旗下产品</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={() => scrollToSection('capabilities')} className="hover:text-indigo-600 transition-colors">产品能力</button>
          <button onClick={() => scrollToSection('solutions')} className="hover:text-indigo-600 transition-colors">解决方案</button>
          <button onClick={() => scrollToSection('comparison')} className="hover:text-indigo-600 transition-colors">方案对比</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-indigo-600 transition-colors">FAQ</button>
          <Link href="/blog" className="hover:text-indigo-600 transition-colors">博客</Link>
          <button onClick={() => scrollToSection('contact')} className="hover:text-indigo-600 transition-colors">联系我们</button>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">登录</Link>
          <button onClick={() => scrollToSection('contact')} className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-sm">
            预约15分钟演示
          </button>
        </div>
        <div className="lg:hidden flex items-center">
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
              <button onClick={() => scrollToSection('capabilities')} className="text-left hover:text-indigo-600 transition-colors">产品能力</button>
              <button onClick={() => scrollToSection('solutions')} className="text-left hover:text-indigo-600 transition-colors">解决方案</button>
              <button onClick={() => scrollToSection('comparison')} className="text-left hover:text-indigo-600 transition-colors">方案对比</button>
              <button onClick={() => scrollToSection('faq')} className="text-left hover:text-indigo-600 transition-colors">FAQ</button>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left hover:text-indigo-600 transition-colors">博客</Link>
              <button onClick={() => scrollToSection('contact')} className="text-left hover:text-indigo-600 transition-colors">联系我们</button>
              <div className="h-px bg-slate-100 my-2"></div>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-left font-semibold text-slate-700 hover:text-indigo-600 transition-colors">登录</Link>
              <button onClick={() => scrollToSection('contact')} className="w-full py-3 text-center font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm">
                预约15分钟演示
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ArchitectureDiagram = () => (
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
        <span className="text-xs font-bold text-indigo-700">智能体 (Agents)</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
        <Layout className="w-4 h-4 text-slate-600" />
        <span className="text-xs font-bold text-slate-700">企业业务系统</span>
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
      <div className="text-center font-bold text-lg mb-4">企业知识中台</div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: FileText, text: "全格式智能解析" },
          { icon: Database, text: "企业级知识库" },
          { icon: Lock, text: "精细权限管控" },
          { icon: Share2, text: "开放生态集成" }
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
        { label: "结构化", desc: "ERP / CRM / DB" },
        { label: "非结构化", desc: "PDF / CAD / 文档" },
        { label: "外部数据", desc: "Web / API / 行业" }
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
      setSubmitMessage('请填写所有必填项');
      return;
    }
    if (!captchaInput) {
      setSubmitStatus('error');
      setSubmitMessage('请输入验证码');
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
        setSubmitMessage('提交成功！我们将尽快与您联系。');
        setFormData({ name: '', company: '', phone: '', email: '', message: '' });
        setCaptchaInput('');
        fetchCaptcha();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || '提交失败，请重试');
        fetchCaptcha();
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('网络错误，请稍后重试');
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
              <span>AI 驱动的企业知识进化</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
              <span className="text-indigo-600">企业知识中台</span>
            </h1>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-700 mb-6">
              让企业知识资产助力组织的决策与创新
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              支持全格式文档智能解析，构建企业级 RAG 知识库，打通 AI 与业务系统的最后一公里。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">
                预约15分钟演示
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
            已服务企业
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
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">企业知识管理，为什么这么难？</h2>
          <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "文档格式五花八门", desc: "PDF、Word、Excel、扫描件、CAD图纸……知识散落各处，员工找不到、用不上。", icon: FileText },
            { title: "大模型接入后质量低", desc: "表格变乱码、图片被忽略、跨页内容被截断，RAG效果大打折扣。", icon: Zap },
            { title: "安全与权限管控两难", desc: "要么数据上云不放心，要么私有化部署后功能缩水，部门间权限难以精细管控。", icon: Shield },
            { title: "被大厂生态绑定", desc: "一旦接入某平台，换个AI编排工具就要重新建库，数据资产无法复用。", icon: Share2 }
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
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">精准破局：四大核心能力破解知识管理四大难题</h2>
          <p className="text-slate-500 max-w-3xl mx-auto">告别格式混乱、质量低下、安全两难与生态绑定，让知识高效流转复用</p>
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
            <h3 className="text-3xl font-bold mb-8">全格式文档，精准解析</h3>
            <ul className="space-y-6">
              {[
                { t: "图片解析", d: "调用多模态模型生成内容描述" },
                { t: "图表解析", d: "流程图/架构图自动提取并生成详细描述文本" },
                { t: "跨页复杂排版", d: "表格跨页上下文完整绑定，不丢失关联" },
                { t: "科学公式解析", d: "公式转化为 LaTex 和 Markdown" },
                { t: "自动分段 + 多语言支持", d: "基于语义智能切分，补全上下文" },
                { t: "人工标注机制", d: "可将解析准确率提升至 95%" }
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
              <h3 className="text-3xl font-bold mb-8">企业级知识库，开箱即用</h3>
              <ul className="space-y-6">
                {[
                  { t: "文档格式自动识别", d: "Word/Excel/PPT/PDF/图片/扫描件，无需手动选择解析器" },
                  { t: "内容类型智能适配", d: "页眉页脚/文本/表格/图片分类处理，支持定制 CV 模型训练" },
                  { t: "多模态图像解析", d: "CV 模型结合多模态大模型，图像信息完整提取" },
                  { t: "灵活知识库配置", d: "支持 HTTP 与 MCP，兼容 Dify / HiAgent / 百炼等平台" },
                  { t: "严密数据安全管控", d: "SSO 单点登录，部门/成员四级权限精细管控" },
                  { t: "高可用 k8s 部署", d: "集群化部署，弹性扩容，支持高并发高负载" }
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
            <h3 className="text-3xl font-bold mb-8">知识不止于检索，直接转化为成果</h3>
            <ul className="space-y-6">
              {[
                { t: "内置技能", d: "文档摘要 / 脑图生成 / PPT 草稿输出 / 摘要报告" },
                { t: "自定义技能", d: "企业可配置专属业务技能" },
                { t: "技能与知识库联动", d: "解析结果直接驱动技能输出" },
                { t: "开放调用", d: "可通过 MCP 协议供外部 Agent 调用" }
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
              <h3 className="text-3xl font-bold mb-8">打通 AI 与业务系统的最后一公里</h3>
              <ul className="space-y-6">
                {[
                  { t: "REST API 转换", d: "一键转换 MCP 服务" },
                  { t: "业务系统全打通", d: "ERP / CRM / O365 / 钉钉 / 飞书" },
                  { t: "SDK 支持", d: "提供 Node.js / Python SDK" },
                  { t: "企业级安全保障", d: "调用轨迹留痕，权限统一管控" }
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">覆盖核心业务场景</h2>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full" />
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "金融行业", 
                desc: "助力投研分析与合规审查，将海量研报与法规转化为即时洞察。", 
                icon: Landmark,
                points: ["研报数据自动提取", "合规条款智能比对", "监管政策实时问答"]
              },
              { 
                title: "政务与公共服务", 
                desc: "构建政务知识大脑，提升政策咨询与政务审批的智能化水平。", 
                icon: Building2,
                points: ["政策文件精准问答", "办事流程智能导航", "跨部门知识协同"]
              },
              { 
                title: "医疗健康", 
                desc: "整合临床指南与医学文献，为医生提供精准的辅助诊疗知识支持。", 
                icon: GraduationCap,
                points: ["医学文献多维检索", "临床指南语义解析", "诊疗知识关联问答"]
              },
              { 
                title: "教育行业", 
                desc: "打造校园智能知识库，实现教学资源与学术成果的数字化管理。", 
                icon: Users,
                points: ["教学资料智能分类", "学术论文关联分析", "校园知识统一检索"]
              },
              { 
                title: "汽车与制造", 
                desc: "管理复杂的工程图纸与技术手册，加速研发创新与售后服务响应。", 
                icon: Factory,
                points: ["CAD图纸语义索引", "技术文档自动摘要", "售后知识精准匹配"]
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
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">核心价值</div>
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
              <h3 className="text-2xl font-bold mb-4">更多行业方案？</h3>
              <p className="text-indigo-100 mb-8">我们的知识中台支持高度定制，满足各行业的特定业务需求。</p>
              <button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
              >
                定制您的方案
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
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">核心优势对比</h2>
          <p className="text-slate-500">专为企业级复杂场景设计的知识中台</p>
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
                <th className="p-6 text-left text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">能力维度</th>
                <th className="p-6 text-left text-sm font-bold text-indigo-600 uppercase tracking-wider border-b border-slate-200 bg-indigo-50/50">唯客</th>
                <th className="p-6 text-left text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">大厂方案</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ["复杂文档解析（图表/公式）", "专精", "一般"],
                ["多模态图像理解", "强", "一般"],
                ["跨平台知识库集成", "全兼容", "生态锁定"],
                ["私有化部署", "支持", "支持"],
                ["MCP协议支持", "支持", "不支持"],
                ["Skill 支持", "支持", "不支持"],
                ["部门级权限管控", "精细", "一般"],
                ["国产模型兼容（千问/文心）", "支持", "支持"]
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
              常见问题解答
            </h2>
            
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-2 border-white shadow-lg">
                <img src="/blog-placeholder.svg" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">预约 15 分钟沟通</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                如果您有任何疑问，或者想了解企业知识中台如何帮助您的企业，欢迎在订阅前与我们进行 15 分钟的沟通。
              </p>
              <button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
              >
                免费预约沟通
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            {[
              { q: "是否支持本地 / 私有化部署？", a: "完整支持。企业知识中台支持基于 Kubernetes 的私有化部署，覆盖应用、服务、向量数据库等全部组件的集群化部署，数据完全留存在企业内网，不经过任何外部服务器。" },
              { q: "是否支持自定义模型 / 接入私有化大模型？", a: "完整支持。可接入任意兼容 OpenAI 协议的模型服务，包括本地部署的千问、文心、Llama 等，只需配置 Base URL 和 API Key，三步完成接入。" },
              { q: "是否支持部门级权限管控？", a: "支持，且粒度极细。可按部门或按成员分别配置四级权限：管理 / 编辑 / 查看 / 问答。同一份知识库可对不同部门设置不同权限。" },
              { q: "是否支持与其他 AI 中台对接（如 Dify、MSKP 等）？", a: "支持。企业知识中台可作为 Dify、MSKP 等平台的第三方知识库，同一知识库可同时适配多个工作空间，也兼容 HiAgent、阿里百炼等平台。" },
              { q: "是否支持基于语义的 Chunk 分段？", a: "支持。除固定长度分段外，企业知识中台支持基于语义的智能分段，自动识别标题层级与章节结构，跨页表格也能完整保留上下文关联。" },
              { q: "单文件大小和文件数量有限制吗？", a: "没有硬性限制。在实际生产环境中已处理过单文件超过 1GB 的工程图纸、以及单知识库上千份文档的场景，系统通过 k8s 弹性扩容保障稳定运行。" },
              { q: "支持哪些文件格式？", a: "支持 PDF、Word、Excel、PPT、图片（jpg/png/jpeg）、扫描件、CAD 图纸（.dwg/.dxf）、Markdown、CSV、TXT 等主流格式。" },
              { q: "解析结果可以直接生成脑图或 PPT 吗？", a: "可以。结合内置 Skills 能力，可直接输出结构化脑图、PPT 草稿、摘要报告等，帮助团队快速将文档知识转化为可用成果。" }
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
              让企业知识资产成为<br className="sm:hidden" />驱动决策的核心引擎
            </h2>
            <p className="text-lg text-slate-500">立即联系我们，获取专属演示与报价</p>
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
                <img src="/wechat-qr.png" alt="微信扫码咨询" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-8">微信扫码咨询</h3>
              
              <div className="w-full space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-left shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">咨询热线</div>
                  <div className="text-xl font-bold text-slate-900">+86 (021) 6566 1628</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-left shadow-sm">
                  <div className="text-sm text-slate-500 mb-1">商务邮箱</div>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">姓名 <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">企业 / 机构 <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.company} onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">手机号码 <span className="text-red-500">*</span></label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">电子邮箱 <span className="text-red-500">*</span></label>
                    <input type="email" value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">咨询需求</label>
                  <textarea rows={4} value={formData.message} onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))} className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none"></textarea>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">验证码 <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                      <input type="text" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="flex-1 px-4 py-3 bg-white rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all" required />
                      <div className="w-28 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden" onClick={fetchCaptcha} title="点击刷新验证码">
                        {captchaSvg ? (
                          <img src={captchaSvg} alt="验证码" className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-slate-400 text-sm">加载中...</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <button type="submit" disabled={submitStatus === 'loading'} className="w-full py-3.5 bg-[#8b5cf6] text-white font-bold rounded-xl hover:bg-[#7c3aed] transition-colors shadow-lg shadow-purple-200 disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitStatus === 'loading' ? '提交中...' : '提交申请'}
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
                <h3 className="text-xl font-bold text-white mb-1">企业知识中台</h3>
                <p className="text-sm text-slate-500">唯客旗下产品</p>
              </div>
              <div className="space-y-3 text-sm pt-4">
                <p className="text-slate-400">中国首家 Dify 官方服务商</p>
                <p className="text-slate-400">jotoai@jototech.cn</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="hidden"></div>

            {/* Column 3 */}
            <div>
              <h4 className="text-white font-bold mb-6">产品目录</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://shanyue.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">闪阅</a></li>
                <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dify</a></li>
                <li><a href="https://sec.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AI 安全</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-white font-bold mb-6">关于我们</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">关于唯客</a></li>
                <li><a href="https://www.jotoai.com/?page_id=9069" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">合作伙伴</a></li>
                <li><a href="https://www.jotoai.com/?page_id=9968" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">加入我们</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-white/10 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>上海聚托信息科技有限公司 © 2026</p>
            <p>沪ICP备15056478号-5</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
