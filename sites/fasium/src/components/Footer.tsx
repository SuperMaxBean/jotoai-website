'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] pt-24 pb-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A00] flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-black/20"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-none mb-1">FasiumAI</span>
                <span className="text-gray-500 text-[10px] font-medium tracking-wider">JOTO 旗下产品</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              AI 驱动的服装设计平台
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">产品目录</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/#features" className="hover:text-white transition-colors">核心功能</a></li>
              <li><a href="/#use-cases" className="hover:text-white transition-colors">应用场景</a></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">博客</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">关于我们</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="https://www.jotoai.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">关于 JOTO.AI</a></li>
              <li><a href="https://www.jotoai.com/?page_id=9069&lang=zh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">合作伙伴</a></li>
              <li><a href="https://www.jotoai.com/?page_id=9069&lang=zh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">加入我们</a></li>
              <li><a href="https://www.jotoai.com/?page_id=9069&lang=zh" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
            <span>上海聚托信息科技有限公司©2026</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors underline underline-offset-2"
            >
              沪ICP备15056478号-5
            </a>
          </p>
          <p>Dream the trend. Land the collection.</p>
        </div>
      </div>
    </footer>
  );
}
