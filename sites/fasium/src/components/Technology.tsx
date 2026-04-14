'use client';

import React from 'react';
import { Brain, Palette, Library, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Technology() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">{t('技术优势', 'TECHNOLOGY')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('真正的优势，是系统', 'The real advantage is the system')}</h2>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            {t('市面上的 AI 图片生成工具很多，但能真正落地到服装行业的，需要的不仅是图片能力，而是一套完整的系统。', 'There are plenty of AI image generation tools out there, but truly landing in the fashion industry requires more than image capability — it requires a complete system.')}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Tech 1 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <Brain className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('Prompt 工程', 'Prompt Engineering')}</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">{t('设计语言内化', 'Design language internalization')}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('将服装设计的专业语言深度编码进 AI 系统。用设计师自己的语言就能驱动 AI。', "Fashion design terminology deeply encoded into the AI system. Drive AI with the designer's own language.")}
            </p>
          </div>

          {/* Tech 2 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <Palette className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('私有微调', 'Private Fine-tuning')}</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">{t('品牌风格一致性', 'Brand style consistency')}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('通过品牌历史数据的私有化微调，AI 学会你的品牌 DNA。每个设计都带有品牌独有的风格烙印。', "Through private fine-tuning on brand historical data, AI learns your brand DNA. Every design carries your brand's unique style signature.")}
            </p>
          </div>

          {/* Tech 3 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <Library className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('动态知识库', 'Dynamic Knowledge Base')}</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">{t('趋势 · 版型 · 工艺', 'Trends · Silhouettes · Craftsmanship')}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('知识库持续更新全球趋势数据、版型规范、面料工艺标准，确保每次生成都基于最新的行业信息。', 'The knowledge base continuously updates global trend data, silhouette standards, and fabric craft specifications — ensuring every generation is based on the latest industry information.')}
            </p>
          </div>

          {/* Tech 4 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <RefreshCw className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t('闭环系统', 'Closed-loop System')}</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">{t('一个平台搞定全部', 'One platform for everything')}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('从趋势洞察到版单输出，不需要在多个工具间切换。一个平台、一个流程、一套数据。', 'From trend insights to tech pack output, no need to switch between multiple tools. One platform, one workflow, one dataset.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
