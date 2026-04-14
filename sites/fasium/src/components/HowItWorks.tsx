'use client';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <section id="product" className="py-24 px-6 bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#f97316] text-sm font-bold tracking-widest uppercase mb-4">{t('工作流程', 'WORKFLOW')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('从观察到选择，只需几步', 'From observation to selection in just a few steps')}</h2>
          <p className="text-xl text-[#a3a3a3] max-w-3xl leading-relaxed">
            {t(
              'FasiumAI 将服装设计全流程浓缩为三步：观察趋势、筛选灵感、一键生成。从发现趋势到拿到可下单的设计方案，只要几分钟。',
              'FasiumAI condenses the entire fashion design workflow into three steps: observe trends, curate inspiration, generate with one click. From spotting a trend to getting a production-ready design — in minutes.'
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#1a1a1a] rounded-3xl p-10 border border-[#2a2a2a]">
            <div className="w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xl mb-8">
              01
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('趋势观察', 'Trend Observation')}</h3>
            <p className="text-[#f97316] font-medium mb-6">{t('实时趋势池', 'Real-time Trend Pool')}</p>
            <p className="text-[#9ca3af] leading-relaxed mb-10">
              {t(
                'FasiumAI 的趋势引擎持续抓取全球时尚信号——秀场、街拍、社交媒体、电商热销数据——自动归类并呈现为可交互的趋势看板。',
                "FasiumAI's trend engine continuously captures global fashion signals — runway shows, street style, social media, e-commerce bestsellers — auto-categorized into an interactive trend dashboard."
              )}
            </p>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/5">
              <img
                src="/step-1-trend.png"
                alt={t('趋势观察', 'Trend Observation')}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#1a1a1a] rounded-3xl p-10 border border-[#2a2a2a]">
            <div className="w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xl mb-8">
              02
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('灵感筛选', 'Inspiration Curation')}</h3>
            <p className="text-[#f97316] font-medium mb-6">{t('风格 · 品类 · 版型', 'Style · Category · Silhouette')}</p>
            <p className="text-[#9ca3af] leading-relaxed mb-10">
              {t(
                '通过智能标签和多维过滤，按风格、品类、版型、面料质感精准筛选，找到最匹配品牌调性的灵感方向。',
                'Smart tags and multi-dimensional filters let you precisely screen by style, category, silhouette, and fabric texture to find the inspiration that best matches your brand identity.'
              )}
            </p>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/5">
              <img
                src="/step-2-inspire.png"
                alt={t('灵感筛选', 'Inspiration Curation')}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#1a1a1a] rounded-3xl p-10 border border-[#2a2a2a]">
            <div className="w-12 h-12 rounded-full bg-[#f97316] text-white flex items-center justify-center font-bold text-xl mb-8">
              03
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('爆款生成', 'Hit Generation')}</h3>
            <p className="text-[#f97316] font-medium mb-6">{t('一键输出', 'One-click Output')}</p>
            <p className="text-[#9ca3af] leading-relaxed mb-10">
              {t(
                '选定方向后，AI 即刻生成完整设计方案。不是模糊的概念图，而是可以直接进入打样流程的高保真设计稿。',
                'Once you pick a direction, AI instantly generates a complete design package — not vague concept art, but high-fidelity designs ready for the sampling process.'
              )}
            </p>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/5">
              <img
                src="/step-3-generate.png"
                alt={t('爆款生成', 'Hit Generation')}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
