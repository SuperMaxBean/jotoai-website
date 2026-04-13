import React from 'react';
import { Shield, FileCheck, FileWarning, Link2Off, Settings2, ArrowRightLeft, BarChart3, Server, Zap } from 'lucide-react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

const capabilities = [
  {
    title: "提示词越狱检测",
    icon: <Shield className="text-brand-blue" size={28} />,
    desc: "精准识别角色扮演、指令劫持等越狱攻击，在恶意 Prompt 触达模型前实时拦截。",
    label: "ML CLASSIFIER"
  },
  {
    title: "隐私数据 PII 保护",
    icon: <FileCheck className="text-brand-blue" size={28} />,
    desc: "自动识别并脱敏身份证、手机号等 20+ 类敏感信息，防止企业数据泄露至模型训练端。",
    label: "DATA MASKING"
  },
  {
    title: "合规敏感词检测",
    icon: <FileWarning className="text-brand-blue" size={28} />,
    desc: "针对涉政、涉黄等风险内容进行多维度审计，支持自定义行业敏感词库，确保输出合规。",
    label: "NLP AUDIT"
  },
  {
    title: "恶意链接扫描",
    icon: <Link2Off className="text-brand-blue" size={28} />,
    desc: "实时提取对话中的 URL 并进行安全云扫描，拦截钓鱼网站与恶意代码下载链接。",
    label: "URL SANDBOX"
  },
  {
    title: "自定义安全策略",
    icon: <Settings2 className="text-brand-blue" size={28} />,
    desc: "通过规则引擎配置专属安全边界，支持正则表达式与逻辑嵌套，灵活适配业务需求。",
    label: "POLICY ENGINE"
  },
  {
    title: "双向输入输出防护",
    icon: <ArrowRightLeft className="text-brand-blue" size={28} />,
    desc: "同步覆盖 User Prompt 与 Model Response，确保端到端的全生命周期安全闭环。",
    label: "FULL PIPELINE"
  },
  {
    title: "全链路可观测性",
    icon: <BarChart3 className="text-brand-blue" size={28} />,
    desc: "提供可视化的安全看板，记录拦截统计、风险趋势及详尽审计日志，支持实时告警。",
    label: "DASHBOARD"
  },
  {
    title: "私有化部署支持",
    icon: <Server className="text-brand-blue" size={28} />,
    desc: "支持完全本地化集群部署，数据不出内网，满足金融及政府级数据安全合规要求。",
    label: "ON-PREMISE"
  },
  {
    title: "极速流式检校",
    icon: <Zap className="text-brand-blue" size={28} />,
    desc: "基于流式架构设计，与模型生成同步进行安全检测，实现毫秒级延迟的透明防护。",
    label: "<50MS LATENCY"
  }
];

const CoreCapabilities: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section id="features" className="py-24 bg-white text-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
            九大核心能力，全方位守护 AI 应用
          </h2>
          <p className="text-lg text-slate-600">
            从输入到输出，从内容到链接，从隐私到合规，每一个环节都不留死角
          </p>
        </div>

        {/* 3x3 Grid */}
        <div 
          ref={ref} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((cap, i) => (
            <div 
              key={i}
              className={`
                group p-8 rounded-2xl border border-slate-200 bg-white hover:border-brand-blue/30 hover:shadow-xl transition-all duration-300 flex flex-col items-start
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* Icon Container */}
              <div className="mb-6 w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {cap.icon}
              </div>
              
              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-4 text-slate-900">{cap.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {cap.desc}
                </p>
              </div>

              {/* Bottom Label */}
              <div className="mt-auto">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider rounded uppercase">
                  {cap.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreCapabilities;