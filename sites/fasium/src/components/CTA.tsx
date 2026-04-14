'use client';
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-32 px-6 bg-[#0a0a0a] text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">
          {t('准备好让设计提速 500% 了吗？', 'Ready to accelerate design by 500%?')}
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('加入已经在用 FasiumAI 的品牌和设计团队。从今天开始，把时间还给创造。', 'Join the brands and design teams already using FasiumAI. Start today — give time back to creativity.')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/contact" className="w-full sm:w-auto px-10 py-4 bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-black font-semibold rounded-full transition-all text-lg text-center">
            {t('预约演示', 'Book a Demo')}
          </Link>
          <Link href="/contact" className="w-full sm:w-auto px-10 py-4 bg-[#141414] border border-white/10 hover:bg-white/5 text-white font-semibold rounded-full transition-all text-lg text-center">
            {t('申请试用', 'Request Trial')}
          </Link>
        </div>
        
        <Link href="/contact" className="text-gray-500 hover:text-white transition-colors underline underline-offset-4">
          {t('联系我们', 'Contact Us')}
        </Link>
        
        <p className="mt-16 text-sm text-gray-600 font-medium tracking-widest uppercase">
          Dream the trend. Land the collection.
        </p>
      </div>
    </section>
  );
}
