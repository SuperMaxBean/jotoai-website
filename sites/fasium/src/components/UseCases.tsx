'use client';

import React from 'react';
import { Zap, Palette, Factory, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function UseCases() {
  const { lang, t } = useLanguage();

  return (
    <section id="use-cases" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">{t('应用场景', 'USE CASES')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('谁在用 FasiumAI?', 'Who uses FasiumAI?')}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Case 1 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-8 border border-[#FF8A00]/20">
              <Zap className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('快时尚品牌', 'Fast Fashion Brands')}</h3>
            <p className="text-[#FF8A00] font-medium mb-6">{t('快速响应市场', 'Rapid market response')}</p>
            <p className="text-gray-400 leading-relaxed">
              {t('每周上新的节奏下，FasiumAI 帮助快时尚品牌在几小时内完成从趋势捕捉到设计出稿的全流程，抢在竞品之前上架。', 'In a weekly launch cadence, FasiumAI helps fast fashion brands complete the entire workflow from trend capture to design output in hours — beating competitors to the shelf.')}
            </p>
          </div>

          {/* Case 2 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-8 border border-[#FF8A00]/20">
              <Palette className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('独立设计师品牌', 'Independent Designer Brands')}</h3>
            <p className="text-[#FF8A00] font-medium mb-6">{t('小团队大产出', 'Small team, big output')}</p>
            <p className="text-gray-400 leading-relaxed">
              {t('一个设计师 + FasiumAI，就能完成过去需要 5 人团队才能实现的产出。AI 处理重复性工作，设计师专注于创意方向把控。', 'One designer + FasiumAI can match the output of a 5-person team. AI handles repetitive work while designers focus on creative direction.')}
            </p>
          </div>

          {/* Case 3 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-8 border border-[#FF8A00]/20">
              <Factory className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('代工厂 / ODM', 'OEM / ODM Manufacturers')}</h3>
            <p className="text-[#FF8A00] font-medium mb-6">{t('提升提案能力', 'Enhanced proposal capability')}</p>
            <p className="text-gray-400 leading-relaxed">
              {t('面对客户的模糊需求描述，FasiumAI 可以快速生成多套设计方案供客户选择，附带完整 Tech Pack，大幅提升提案效率和成单率。', 'When facing vague client briefs, FasiumAI rapidly generates multiple design proposals for client selection, complete with Tech Packs — dramatically improving proposal efficiency and close rates.')}
            </p>
          </div>

          {/* Case 4 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-8 border border-[#FF8A00]/20">
              <ShoppingCart className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('电商服装卖家', 'E-commerce Fashion Sellers')}</h3>
            <p className="text-[#FF8A00] font-medium mb-6">{t('数据驱动选款', 'Data-driven style selection')}</p>
            <p className="text-gray-400 leading-relaxed">
              {t('结合电商平台热销数据和社交媒体趋势，FasiumAI 帮助电商卖家做出更有据可依的选款决策，降低库存风险，提高爆款命中率。', 'Combining e-commerce bestseller data with social media trends, FasiumAI helps online sellers make more data-backed style selection decisions — reducing inventory risk and increasing hit rates.')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
