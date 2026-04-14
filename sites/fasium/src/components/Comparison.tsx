'use client';
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Comparison() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">{t('方案对比', 'COMPARISON')}</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('传统流程 vs FasiumAI', 'Traditional Workflow vs FasiumAI')}</h2>
        </div>

        <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 bg-[#FF8A00]/5">
            <div className="font-bold text-[#FF8A00]">{t('环节', 'Stage')}</div>
            <div className="font-bold text-gray-400">{t('传统方式', 'Traditional')}</div>
            <div className="font-bold text-[#FF8A00]">FasiumAI</div>
          </div>
          
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">{t('趋势调研', 'Trend Research')}</div>
              <div className="text-gray-400">{t('手动翻阅报告，1-2 周', 'Manually browsing reports, 1-2 weeks')}</div>
              <div className="text-[#FF8A00] font-medium">{t('AI 实时趋势池，分钟级', 'AI real-time trend pool, minutes')}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">{t('灵感收集', 'Inspiration Collection')}</div>
              <div className="text-gray-400">{t('多平台来回切换', 'Switching between multiple platforms')}</div>
              <div className="text-[#FF8A00] font-medium">{t('一站式智能筛选', 'One-stop smart curation')}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">{t('花型设计', 'Pattern Design')}</div>
              <div className="text-gray-400">{t('PS/AI 手动绘制，数小时', 'Manual PS/AI drawing, hours')}</div>
              <div className="text-[#FF8A00] font-medium">{t('秒级提取 + 一键裂变', 'Seconds to extract + one-click split')}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">{t('成衣预览', 'Garment Preview')}</div>
              <div className="text-gray-400">{t('等打样，1-2 周', 'Wait for sampling, 1-2 weeks')}</div>
              <div className="text-[#FF8A00] font-medium">{t('虚拟模特即时渲染', 'Virtual model instant rendering')}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">Tech Pack</div>
              <div className="text-gray-400">{t('手工填写 Excel，数小时', 'Manual Excel entry, hours')}</div>
              <div className="text-[#FF8A00] font-medium">{t('自动生成，分钟级', 'Auto-generated, minutes')}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">{t('单季产出', 'Seasonal Output')}</div>
              <div className="text-gray-400">{t('~80 款', '~80 styles')}</div>
              <div className="text-[#FF8A00] font-medium">{t('400+ 款', '400+ styles')}</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">{t('选款命中率', 'Style Hit Rate')}</div>
              <div className="text-gray-400">{t('凭经验判断', 'Experience-based guessing')}</div>
              <div className="text-[#FF8A00] font-medium">{t('数据+AI 辅助决策', 'Data + AI-assisted decisions')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
