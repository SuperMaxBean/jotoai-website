'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050B14] text-gray-400 py-16 border-t border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
        <div className="flex flex-col">
          <div className="h-14 flex flex-col justify-start mb-4">
            <h3 className="text-white text-lg font-bold leading-none">唯客 AI 护栏</h3>
            <p className="text-xs text-gray-500 mt-2">{t('JOTO.AI 旗下产品', 'A JOTO.AI Product')}</p>
          </div>
          <div className="space-y-2">
            <p>{t('中国首家 Dify 官方服务商', "China's First Official Dify Service Provider")}</p>
            <p>jotoai@jototech.cn</p>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 h-14 flex items-start pt-0">{t('产品文档', 'Documentation')}</h4>
          <ul className="space-y-2">
            <li><Link href="/features" className="hover:text-brand-blue">{t('产品功能', 'Features')}</Link></li>
            <li><Link href="/changelog" className="hover:text-brand-blue">{t('更新日志', 'Changelog')}</Link></li>
            <li><Link href="/roadmap" className="hover:text-brand-blue">{t('技术路线图', 'Roadmap')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 h-14 flex items-start pt-0">{t('产品目录', 'Products')}</h4>
          <ul className="space-y-2">
            <li><a href="https://shanyue.jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">{t('闪阅', 'ShanYue')}</a></li>
            <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">Dify</a></li>
            <li><Link href="/" className="hover:text-brand-blue text-white font-medium">{t('AI 安全', 'AI Security')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 h-14 flex items-start pt-0">{t('关于我们', 'About Us')}</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-brand-blue">{t('关于 JOTO.AI', 'About JOTO.AI')}</Link></li>
            <li><a href="https://www.jotoai.com/?page_id=9069" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">{t('合作伙伴', 'Partners')}</a></li>
            <li><a href="https://www.jotoai.com/?page_id=9968" target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue">{t('加入我们', 'Careers')}</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
        {t('上海聚托信息科技有限公司©2026 沪ICP备15056478号-5', 'Shanghai Jutuo Information Technology Co., Ltd. ©2026 ICP License: 沪ICP备15056478号-5')}
      </div>
    </footer>
  );
};

export default Footer;
