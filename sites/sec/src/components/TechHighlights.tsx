import React from 'react';

const stats = [
  { value: "< 300ms", label: "检测延迟", sub: "流式并行检测，用户无感" },
  { value: "100%", label: "双向覆盖", sub: "输入输出双向检测，零遗漏" },
  { value: "10+", label: "PII 类型", sub: "覆盖中国常见隐私信息类型" },
  { value: "本地", label: "部署模式", sub: "数据零出境，完全私有化" },
];

const TechHighlights: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-brand-dark to-brand-surface border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            为极致体验而生的安全引擎
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            唯客 AI 护栏采用流式输出架构，在大模型逐 Token 生成内容的同时同步执行安全检测。
            无需等待完整响应，即检即防，用户端体验零中断。
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-green mb-2 font-mono">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechHighlights;