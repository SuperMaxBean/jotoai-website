import React from 'react';

export default function Problem() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">问题所在</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">服装设计，不该这么慢</h2>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            传统设计流程中，设计团队把 70% 的时间花在工具切换、素材整理和反复修改上。真正用于设计的时间，少得可怜。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-8 border border-[#FF8A00]/20">
              <svg className="w-6 h-6 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">设计主管的困境</h3>
            <p className="text-[#FF8A00] font-medium mb-8">靠经验，推未来</p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-2 shrink-0"></div>
                <span>趋势数据散落在十几个平台，缺少统一视角</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-2 shrink-0"></div>
                <span>从趋势分析到方向确认，动辄数周反复讨论</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-2 shrink-0"></div>
                <span>经验判断无法量化市场潜力，选款命中率低</span>
              </li>
            </ul>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-[#FF8A00] text-sm font-medium">
              最终结果：慢、累、不确定
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/10 flex items-center justify-center mb-8 border border-[#FF8A00]/20">
              <svg className="w-6 h-6 text-[#FF8A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">设计师的困境</h3>
            <p className="text-[#FF8A00] font-medium mb-8">被工具拖慢</p>
            
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-2 shrink-0"></div>
                <span>趋势调研、设计执行、版单输出分属不同工具，流程割裂</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-2 shrink-0"></div>
                <span>一个花型要手动做几十个变体，耗时且机械</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF8A00] mt-2 shrink-0"></div>
                <span>设计稿、面料信息、工艺要求散落在不同文件和群聊里</span>
              </li>
            </ul>
            
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#FF8A00]/10 border border-[#FF8A00]/20 text-[#FF8A00] text-sm font-medium">
              最终结果：时间不在设计上，在搬砖上
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
