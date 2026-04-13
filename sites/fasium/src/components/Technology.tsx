import React from 'react';
import { Brain, Palette, Library, RefreshCw } from 'lucide-react';

export default function Technology() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">技术优势</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">真正的优势，是系统</h2>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            市面上的 AI 图片生成工具很多，但能真正落地到服装行业的，需要的不仅是图片能力，而是一套完整的系统。
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Tech 1 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <Brain className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Prompt 工程</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">设计语言内化</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              将服装设计的专业语言深度编码进 AI 系统。用设计师自己的语言就能驱动 AI。
            </p>
          </div>

          {/* Tech 2 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <Palette className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">私有微调</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">品牌风格一致性</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              通过品牌历史数据的私有化微调，AI 学会你的品牌 DNA。每个设计都带有品牌独有的风格烙印。
            </p>
          </div>

          {/* Tech 3 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <Library className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">动态知识库</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">趋势 · 版型 · 工艺</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              知识库持续更新全球趋势数据、版型规范、面料工艺标准，确保每次生成都基于最新的行业信息。
            </p>
          </div>

          {/* Tech 4 */}
          <div className="bg-[#141414] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-6 border border-[#FF8A00]/20">
              <RefreshCw className="w-6 h-6 text-[#FF8A00]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">闭环系统</h3>
            <p className="text-[#FF8A00] text-sm font-medium mb-4">一个平台搞定全部</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              从趋势洞察到版单输出，不需要在多个工具间切换。一个平台、一个流程、一套数据。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
