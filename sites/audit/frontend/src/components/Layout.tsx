'use client';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname;

  const navLinks = [
    { name: '首页', path: '/' },
    { name: '核心功能', path: '/features' },
    { name: '技术架构', path: '/architecture' },
    { name: '新闻博客', path: '/blog' },
    { name: '联系我们', path: '/contact' },
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
                <span className="text-[9px] text-slate-400 font-bold tracking-wider mt-1 leading-none uppercase">JOTO 旗下产品</span>
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
              <a href="/admin/login.html" className="text-sm font-medium text-slate-300 hover:text-white">登录</a>
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                预约演示
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
                <span className="text-[11px] tracking-[0.2em] text-slate-500 font-bold mt-2 uppercase">JOTO 旗下产品</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              面向企业法务部门的 AI 原生合同审查与合规评估系统。<br />
              构建法律数据的长期价值。
            </p>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-lg mb-8">产品</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">唯客智审</Link></li>
              <li><a href="https://www.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Dify</a></li>
              <li><a href="https://sec.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AI 安全</a></li>
              <li><a href="https://kb.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">AI 自研产品库</a></li>
              <li><a href="https://shanyue.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">闪阅</a></li>
              <li><a href="https://loop.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Loop 浏览器自动化</a></li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="text-white font-bold text-lg mb-8">关于 JOTO</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="https://www.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">集团介绍</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">加入我们</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-500 text-sm">
            上海聚托信息科技有限公司©2026 <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">沪ICP备15056478号-5</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
