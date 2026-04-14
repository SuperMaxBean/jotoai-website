'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { lang, toggleLanguage, t } = useLanguage();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-black/20"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-none mb-1">FasiumAI</span>
            <span className="text-gray-500 text-[10px] font-medium tracking-wider">{t('JOTO 旗下产品', 'A JOTO Product')}</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a
            href={isHomePage ? "#product" : "/#product"}
            onClick={(e) => scrollToSection(e, 'product')}
            className="hover:text-white transition-colors"
          >
            {t('产品介绍', 'Product')}
          </a>
          <a
            href={isHomePage ? "#features" : "/#features"}
            onClick={(e) => scrollToSection(e, 'features')}
            className="hover:text-white transition-colors"
          >
            {t('核心功能', 'Features')}
          </a>
          <a
            href={isHomePage ? "#use-cases" : "/#use-cases"}
            onClick={(e) => scrollToSection(e, 'use-cases')}
            className="hover:text-white transition-colors"
          >
            {t('应用场景', 'Use Cases')}
          </a>
          <Link href="/blog" className="hover:text-white transition-colors">{t('博客', 'Blog')}</Link>
          <Link href="/contact" className="hover:text-white transition-colors">{t('联系我们', 'Contact')}</Link>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded border border-white/20 text-sm text-gray-300 hover:text-white hover:border-white/40 transition-colors"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          <a href="/admin/login.html" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">{t('登录', 'Login')}</a>
          <Link href="/contact" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-black text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
            {t('联系我们', 'Contact')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
