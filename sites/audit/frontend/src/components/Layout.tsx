'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname;
  const { lang, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('首页', 'Home'), path: '/' },
    { name: t('核心功能', 'Features'), path: '/features' },
    { name: t('技术架构', 'Architecture'), path: '/architecture' },
    { name: t('新闻博客', 'Blog'), path: '/blog' },
    { name: t('联系我们', 'Contact'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <img src="/logo.svg" alt="唯客智审" className="h-9 w-9 transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
              <div className="flex flex-col justify-center">
                <span className="text-base font-bold tracking-tight leading-none text-white">唯客智审</span>
                <span className="text-[9px] text-slate-400 font-bold tracking-wider mt-1 leading-none uppercase">{t('JOTO 旗下产品', 'A JOTO Product')}</span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    currentPath === link.path ? 'text-blue-500' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="px-3 py-1 rounded border border-white/20 text-sm text-slate-300 hover:text-white hover:border-white/40 transition-colors"
              >
                {lang === 'zh' ? 'EN' : '中文'}
              </button>
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                {t('预约演示', 'Book Demo')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-slate-400 pt-20 pb-0 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <div className="flex items-center space-x-4 mb-8">
              <img src="/logo.svg" alt="唯客智审" className="h-12 w-12" referrerPolicy="no-referrer" />
              <div className="flex flex-col justify-center">
                <span className="text-2xl font-bold text-white leading-none">唯客智审</span>
                <span className="text-[11px] tracking-[0.2em] text-slate-500 font-bold mt-2 uppercase">{t('JOTO 旗下产品', 'A JOTO Product')}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              {t(
                '面向企业法务部门的 AI 原生合同审查与合规评估系统。\n构建法律数据的长期价值。',
                'AI-native contract review and compliance assessment system for corporate legal departments.\nBuilding long-term value from legal data.'
              ).split('\n').map((line, i) => (
                <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
              ))}
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-lg mb-8">{t('产品', 'Products')}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">唯客智审</Link></li>
              <li><a href="https://www.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dify</a></li>
              <li><a href="https://sec.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('AI 安全', 'AI Security')}</a></li>
              <li><a href="https://kb.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('AI 自研产品库', 'AI Product Hub')}</a></li>
              <li><a href="https://shanyue.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('闪阅', 'ShanYue')}</a></li>
              <li><a href="https://loop.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('Loop 浏览器自动化', 'Loop Browser Automation')}</a></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="text-white font-bold text-lg mb-8">{t('关于 JOTO', 'About JOTO')}</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="https://www.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('集团介绍', 'About Us')}</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('联系我们', 'Contact Us')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('隐私政策', 'Privacy Policy')}</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('加入我们', 'Join Us')}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-500 text-sm">
            {t('上海聚托信息科技有限公司', 'Shanghai Joto InfoTech Co., Ltd.')}©2026 <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">{t('沪ICP备15056478号-5', 'ICP License: 沪ICP备15056478号-5')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
