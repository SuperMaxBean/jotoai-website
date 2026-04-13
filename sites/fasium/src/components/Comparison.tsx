import React from 'react';

export default function Comparison() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">方案对比</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">传统流程 vs FasiumAI</h2>
        </div>

        <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 bg-[#FF8A00]/5">
            <div className="font-bold text-[#FF8A00]">环节</div>
            <div className="font-bold text-gray-400">传统方式</div>
            <div className="font-bold text-[#FF8A00]">FasiumAI</div>
          </div>
          
          <div className="divide-y divide-white/5">
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">趋势调研</div>
              <div className="text-gray-400">手动翻阅报告，1-2 周</div>
              <div className="text-[#FF8A00] font-medium">AI 实时趋势池，分钟级</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">灵感收集</div>
              <div className="text-gray-400">多平台来回切换</div>
              <div className="text-[#FF8A00] font-medium">一站式智能筛选</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">花型设计</div>
              <div className="text-gray-400">PS/AI 手动绘制，数小时</div>
              <div className="text-[#FF8A00] font-medium">秒级提取 + 一键裂变</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">成衣预览</div>
              <div className="text-gray-400">等打样，1-2 周</div>
              <div className="text-[#FF8A00] font-medium">虚拟模特即时渲染</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">Tech Pack</div>
              <div className="text-gray-400">手工填写 Excel，数小时</div>
              <div className="text-[#FF8A00] font-medium">自动生成，分钟级</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">单季产出</div>
              <div className="text-gray-400">~80 款</div>
              <div className="text-[#FF8A00] font-medium">400+ 款</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 p-6 hover:bg-white/[0.02] transition-colors">
              <div className="font-medium text-white">选款命中率</div>
              <div className="text-gray-400">凭经验判断</div>
              <div className="text-[#FF8A00] font-medium">数据+AI 辅助决策</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
