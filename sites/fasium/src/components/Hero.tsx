'use client';
import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="pt-48 pb-32 px-6 relative overflow-hidden bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141414] border border-[#FF8A00]/30 shadow-[0_0_20px_rgba(255,138,0,0.05)] mb-12">
          <div className="w-2 h-2 rounded-full bg-[#FF8A00]"></div>
          <span className="text-[#FF8A00] text-sm font-medium tracking-wide">{t('AI 驱动的时尚设计平台', 'AI-Powered Fashion Design Platform')}</span>
        </div>
        
        <h1 className="text-5xl md:text-[64px] font-bold text-white tracking-tight leading-[1.25] mb-10">
          {t('灵感在屏幕上发生', 'Inspiration happens on screen.')}<br />
          {t('成衣在面料上落地', 'Garments land on fabric.')}
        </h1>
        
        <p className="text-xl md:text-[22px] text-[#888888] mb-12">
          Dream on screen. Land on fabric.
        </p>
        
        <p className="text-base md:text-lg text-[#888888] max-w-[800px] mx-auto mb-16 leading-[1.8]">
          {t(
            'FasiumAI 是专为服装品牌和设计团队打造的 AI 设计平台。将趋势洞察、灵感筛选、花型生成、版型预览、Tech Pack 输出整合在一个系统中，让设计师回归创造本身。',
            'FasiumAI is the AI design platform built for fashion brands and design teams. It unifies trend insights, inspiration curation, pattern generation, silhouette preview, and Tech Pack output in one system — so designers can focus on creating.'
          )}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/contact" className="w-full sm:w-[140px] py-3.5 bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-black font-semibold rounded-full transition-all text-base text-center">
            {t('预约演示', 'Book a Demo')}
          </Link>
          <Link href="/contact" className="w-full sm:w-[140px] py-3.5 bg-transparent border border-white/15 hover:bg-white/5 text-white font-semibold rounded-full transition-all text-base text-center">
            {t('申请试用', 'Request Trial')}
          </Link>
        </div>
      </div>
    </section>
  );
}
