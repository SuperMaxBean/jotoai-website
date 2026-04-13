import React from 'react';

export default function KnowledgeEngine() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">知识引擎</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">让 AI 真正懂服装</h2>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            通用 AI 能画好看的图，但不懂版型、工艺和行业规范。FasiumAI 不同——我们让 AI 真正理解服装。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Point 1 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
            <div className="text-5xl font-bold text-[#FF8A00]/40 mb-8">01</div>
            <h3 className="text-2xl font-bold text-white mb-4">统一解析</h3>
            <p className="text-gray-400 leading-relaxed">
              无论输入的是秀场图、面料照片、手绘草稿还是文字描述，FasiumAI 都能统一理解其中的设计意图。不同格式的资料，一种理解方式。
            </p>
          </div>

          {/* Point 2 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
            <div className="text-5xl font-bold text-[#FF8A00]/40 mb-8">02</div>
            <h3 className="text-2xl font-bold text-white mb-4">精准调用</h3>
            <p className="text-gray-400 leading-relaxed">
              AI 不会胡乱生成，而是基于知识库中的版型规范、工艺约束、品牌偏好做出合理的设计决策——不乱用，不误用。
            </p>
          </div>

          {/* Point 3 */}
          <div className="bg-[#141414] rounded-3xl p-10 border border-white/5">
            <div className="text-5xl font-bold text-[#FF8A00]/40 mb-8">03</div>
            <h3 className="text-2xl font-bold text-white mb-4">知识驱动</h3>
            <p className="text-gray-400 leading-relaxed">
              每一条趋势数据、每一个版型规范、每一段工艺说明，都直接用于驱动设计生成和版单输出，真正做到知识即生产力。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
