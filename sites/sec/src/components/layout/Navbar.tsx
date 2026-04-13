'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '核心功能', href: '/features' },
    { name: '新闻博客', href: '/blog' },
    { name: '联络我们', href: '/contact' },
  ];

  return (
    <nav aria-label="主导航" className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-dark/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="唯客 AI 护栏 首页"
        >
          <div className="w-9 h-9 relative flex items-center justify-center" aria-hidden>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform group-hover:scale-110 transition-all duration-500">
              <defs>
                <linearGradient id="logo_gradient_nav" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2E7CF6"/>
                  <stop offset="100%" stopColor="#00E5A0"/>
                </linearGradient>
                <filter id="logo_glow_filter" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" fill="url(#logo_gradient_nav)" fillOpacity="0.3" filter="url(#logo_glow_filter)" />
              <path d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" stroke="url(#logo_gradient_nav)" strokeWidth="2.5" fill="url(#logo_gradient_nav)" fillOpacity="0.1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 20L18 24L26 16" stroke="url(#logo_gradient_nav)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#logo_glow_filter)" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-white font-bold text-xl tracking-tight leading-none">唯客 AI 护栏</span>
            <span className="text-[10px] text-gray-400 font-medium tracking-wide mt-0.5">JOTO.AI 旗下产品</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium transition-colors text-gray-300 hover:text-white">
              {link.name}
            </Link>
          ))}
          <Link href="/contact" className="px-5 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-md text-sm font-semibold transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center">
            联系我们
          </Link>
        </div>

        <button type="button" className="md:hidden text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`md:hidden absolute top-full left-0 w-full bg-brand-dark border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl transition-all duration-300 origin-top ${mobileMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible h-0 p-0 overflow-hidden'}`}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white py-3 text-left border-b border-white/5">
            {link.name}
          </Link>
        ))}
        <Link href="/contact" className="w-full py-3 bg-brand-blue text-white rounded-lg font-semibold mt-2 text-center">
          联系我们
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
