'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gradient-to-r from-brand-dark via-blue-900 to-brand-dark text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t('开始保护你的 AI 应用', 'Start Protecting Your AI Applications')}
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          {t(
            '立即联系我们，体验零延迟感知的 AI 运行时安全防护',
            'Contact us now to experience zero-latency AI runtime security protection'
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
           <a
             href="/contact"
             className="px-10 py-4 bg-white text-brand-blue hover:bg-gray-100 rounded-lg font-bold text-lg shadow-lg transition-colors w-full sm:w-auto"
           >
             {t('联系我们', 'Contact Us')}
           </a>
        </div>

        <p className="text-sm text-blue-200/60">
          {t(
            '支持 POC 验证 · 提供专业部署支持 · JOTO.AI 团队全程服务',
            'POC validation supported · Professional deployment assistance · Full JOTO.AI team service'
          )}
        </p>
      </div>
    </section>
  );
};

export default CTA;
