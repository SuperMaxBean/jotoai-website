"use client";

import React from 'react';
import Link from 'next/link';
import { Hexagon, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0A1A2F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="relative flex items-center justify-center">
                <Hexagon className="w-8 h-8 text-[#7c3aed] fill-[#7c3aed]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight">闪阅</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t(
                '面向未来的教学评估与资产沉淀平台，让老师从"批卷机器"回归"教学设计者"。',
                'A future-oriented teaching assessment and asset platform, freeing teachers from "grading machines" back to "instructional designers".'
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">{t('产品', 'Product')}</h4>
            <ul className="space-y-3">
              <li><Link href="/capabilities" className="text-sm text-slate-400 hover:text-white transition-colors">{t('核心能力', 'Capabilities')}</Link></li>
              <li><Link href="/architecture" className="text-sm text-slate-400 hover:text-white transition-colors">{t('技术架构', 'Architecture')}</Link></li>
              <li><Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">{t('登录', 'Login')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">{t('资源', 'Resources')}</h4>
            <ul className="space-y-3">
              <li><Link href="/articles" className="text-sm text-slate-400 hover:text-white transition-colors">{t('新闻博客', 'Blog')}</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">{t('隐私政策', 'Privacy Policy')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4">{t('联系', 'Contact')}</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">{t('联络我们', 'Contact Us')}</Link></li>
              <li><span className="text-sm text-slate-400">jotoai@jototech.cn</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} {t('上海聚托信息科技有限公司', 'Shanghai Juto Information Technology Co., Ltd.')} <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">{t('沪ICP备15056478号-5', 'ICP License: 沪ICP备15056478号-5')}</a></p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{t('隐私政策', 'Privacy Policy')}</Link>
            <span className="text-xs text-slate-500">{t('服务条款', 'Terms of Service')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
