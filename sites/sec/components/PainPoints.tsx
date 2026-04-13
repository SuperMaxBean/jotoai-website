import React from 'react';
import { Unlock, EyeOff, AlertTriangle, Link2 } from 'lucide-react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

const points = [
  {
    icon: <Unlock size={32} className="text-red-500" />,
    title: "提示词越狱攻击",
    desc: "精心构造的 Prompt 可以绕过系统指令，让大模型输出企业绝不希望用户看到的内容。"
  },
  {
    icon: <EyeOff size={32} className="text-orange-500" />,
    title: "隐私数据泄露",
    desc: "用户在对话中无意或有意输入身份证号、手机号、银行卡等个人信息，大模型可能记录或泄露这些数据。"
  },
  {
    icon: <AlertTriangle size={32} className="text-yellow-500" />,
    title: "违规内容生成",
    desc: "大模型可能生成涉政、涉黄、涉暴等违规内容，一旦传播将面临监管处罚和品牌危机。"
  },
  {
    icon: <Link2 size={32} className="text-blue-500" />,
    title: "恶意链接注入",
    desc: "攻击者通过对话注入钓鱼链接或恶意 URL，利用 AI 应用作为攻击载体危害终端用户。"
  }
];

const PainPoints: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section className="py-24 bg-slate-50 text-slate-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            你的 AI 应用，真的安全吗？
          </h2>
          <p className="text-lg text-slate-600">
            大模型正在改变企业运作方式，但随之而来的安全风险不容忽视
          </p>
        </div>

        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {points.map((p, i) => (
            <div 
              key={i} 
              className={`bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-500 border border-slate-100 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-6 bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{p.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PainPoints;