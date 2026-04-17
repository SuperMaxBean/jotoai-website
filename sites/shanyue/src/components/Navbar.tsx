"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Hexagon, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, toggleLanguage, t } = useLanguage();

  const NAV_LINKS = [
    { name: t('核心能力', 'Capabilities'), href: '/capabilities' },
    { name: t('技术架构', 'Architecture'), href: '/architecture' },
    { name: t('新闻博客', 'Blog'), href: '/articles' },
    { name: t('联络我们', 'Contact'), href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 py-3' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 group cursor-pointer">
            <div className="relative flex items-center justify-center">
                <Hexagon className="w-9 h-9 text-[#7c3aed] fill-[#7c3aed] group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white fill-white transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-lg font-extrabold text-[#0A1A2F] tracking-tight leading-none group-hover:text-[#7c3aed] transition-colors">
                  {t('闪阅', 'iMark')}
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase leading-none mt-1 group-hover:text-purple-400 transition-colors">
                  {t('JOTO 旗下产品', 'A JOTO Product')}
                </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-10 bg-white/50 backdrop-blur-sm px-8 py-2.5 rounded-full border border-white/50 shadow-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-all cursor-pointer relative ${
                    pathname === link.href ? 'text-[#7c3aed]' : 'text-slate-500 hover:text-[#7c3aed]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="text-sm font-bold text-slate-500 hover:text-[#7c3aed] px-3 py-1.5 rounded-full border border-slate-200 hover:border-purple-200 transition-all"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#0A1A2F] px-4">
              {t('登录', 'Login')}
            </Link>
            <Link
              href="/contact"
              className="bg-[#0A1A2F] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/10 cursor-pointer"
            >
              {t('预约演示', 'Book Demo')}
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="text-sm font-bold text-slate-500 hover:text-[#7c3aed] px-3 py-1.5 rounded-full border border-slate-200 hover:border-purple-200 transition-all"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-[#0A1A2F] p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-2xl h-screen">
          <div className="px-6 pt-6 pb-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-lg font-bold text-slate-800 hover:text-[#7c3aed] bg-slate-50 rounded-xl"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-8 border-t border-slate-100 flex flex-col space-y-4">
              <Link href="/login" onClick={closeMobileMenu} className="block px-4 py-3 text-lg font-bold text-slate-600 text-center">
                {t('登录', 'Login')}
              </Link>
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="block w-full px-4 py-4 bg-[#7c3aed] text-white rounded-xl text-lg font-bold text-center shadow-lg shadow-purple-200"
              >
                {t('预约演示', 'Book Demo')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
