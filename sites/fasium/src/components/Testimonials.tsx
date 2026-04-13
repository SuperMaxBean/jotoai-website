import React from 'react';

const testimonials = [
  {
    name: "Sophia Lin",
    role: "设计总监",
    company: "某头部快时尚集团旗下女装品牌",
    content: "以前出一套完整的系列设计稿，从趋势调研到三视图完成，至少要两周。现在用 FasiumAI，三天搞定，三视图和版单同步出，设计师终于可以把精力放在真正的创意上了。",
    initial: "S"
  },
  {
    name: "Marcus Chen",
    role: "印花设计主管",
    company: "某港资时尚集团面料研发部",
    content: "纹理裂变这个功能彻底改变了我们的工作方式。一个印花素材，AI 能在两分钟内给出 30 种配色和排列变体，以前这是一个设计师做一整天的活。我们现在每季可以多推 3 个花型系列。",
    initial: "M"
  },
  {
    name: "Kevin Huang",
    role: "商务总监",
    company: "某中型高端服装代工厂",
    content: "我们是做 ODM 的，最头疼的是客户描述模糊、反复改稿。现在用 FasiumAI，客户说个大概方向，我们现场就能出几套高保真方案连 Tech Pack 一起给，成单率提升了快一倍。",
    initial: "K"
  },
  {
    name: "Chloe Su",
    role: "品牌市场负责人",
    company: "某新锐设计师女装品牌",
    content: "广告图生成太实用了。一张产品图输入进去，选好风格，60 秒出 6 张不同场景的广告大片，我们直接拿去投小红书和抖音，省掉了一整个外拍流程。",
    initial: "C"
  },
  {
    name: "Amélie Zhang",
    role: "独立设计师",
    company: "个人轻奢女装品牌主理人",
    content: "用 FasiumAI 之后，我一个人的产出真的顶过去半个团队。画板功能让我第一次觉得灵感和执行之间没有断层，想到什么，AI 帮我立刻呈现出来。",
    initial: "A"
  },
  {
    name: "Fiona Wang",
    role: "产品总监",
    company: "某上市女装集团产品中心",
    content: "虚拟试穿功能帮我们砍掉了将近 40% 的首轮打样成本。设计师在电脑上就能看到成衣效果，不满意直接改，再也不用为一个版型来回打三次样了。",
    initial: "F"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">用户反馈</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">他们在说什么</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div 
              key={index} 
              className="bg-[#141414] rounded-3xl p-10 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col h-full"
            >
              <div className="text-4xl text-[#FF8A00] mb-6 font-serif">"</div>
              <p className="text-lg text-gray-300 leading-relaxed mb-10 flex-grow">
                {item.content}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00] font-bold shrink-0">
                  {item.initial}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{item.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {item.role} <span className="mx-1">·</span> {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
