import React from 'react';
import { Building2, Landmark, Stethoscope, GraduationCap, Car, Check, Plus, ArrowRight } from 'lucide-react';

const cases = [
  {
    title: "金融行业",
    icon: <Landmark className="text-white" size={24} />,
    desc: "应用于智能客服、AI 投顾、信贷审批助手。",
    points: ["防止客户身份信息泄露", "拦截诱导性金融建议"]
  },
  {
    title: "政务与公共服务",
    icon: <Building2 className="text-white" size={24} />,
    desc: "应用于政务问答机器人、智能审批、公共服务 AI 助手。",
    points: ["敏感内容零容忍过滤", "公民个人信息严格保护"]
  },
  {
    title: "医疗健康",
    icon: <Stethoscope className="text-white" size={24} />,
    desc: "应用于智能问诊、医疗知识问答、病历分析助手。",
    points: ["患者隐私 (PHI) 遮掩", "不当医疗建议阻断"]
  },
  {
    title: "教育行业",
    icon: <GraduationCap className="text-white" size={24} />,
    desc: "应用于 AI 助教、智能批改、知识问答平台。",
    points: ["未成年人内容过滤", "学生信息隐私防护"]
  },
  {
    title: "汽车与制造",
    icon: <Car className="text-white" size={24} />,
    desc: "应用于智能座舱、售后知识库、供应链分析。",
    points: ["企业机密信息防泄露", "产品参数合规输出"]
  }
];

const UseCases: React.FC = () => {
  return (
    <section id="cases" className="py-24 bg-[#0A1628]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            守护每一个行业的 AI 应用
          </h2>
          <p className="text-gray-400">
            无论你在哪个行业使用大模型，唯客 AI 护栏都能提供针对性的安全防护，确保合规与信任。
          </p>
        </div>
        
        {/* 3-Column Grid Layout with equal row heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
          {cases.map((c, i) => (
            <div 
              key={i} 
              className="bg-[#111827] border border-white/10 p-8 rounded-xl flex flex-col items-start hover:border-brand-blue/30 transition-colors h-full"
            >
              {/* Icon Box */}
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-6">
                {c.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{c.title}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {c.desc}
              </p>
              
              {/* Divider */}
              <div className="w-full h-px bg-white/10 mb-6 mt-auto"></div>

              {/* Protection Focus List */}
              <div className="w-full">
                <p className="text-gray-500 text-xs mb-4">防护重点</p>
                <div className="space-y-3">
                    {c.points.map((p, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                            <Check size={16} className="text-brand-green mt-0.5 shrink-0" strokeWidth={3} />
                            <span className="text-gray-300 text-sm">{p}</span>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          ))}

          {/* 6th Card: CTA / Custom Solution */}
          <div className="bg-brand-blue rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
             {/* Background decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
             
             <div className="relative z-10 flex flex-col items-center h-full justify-center">
                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Plus className="text-white" size={32} />
                 </div>
                 
                 <h3 className="text-2xl font-bold text-white mb-4">更多行业方案？</h3>
                 <p className="text-blue-100 text-sm mb-8 leading-relaxed max-w-[200px]">
                    我们的安全策略支持高度定制，满足各行业的特定安全需求。
                 </p>

                 <button className="bg-white text-brand-blue px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-lg">
                    定制您的方案 <ArrowRight size={16}/>
                 </button>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default UseCases;