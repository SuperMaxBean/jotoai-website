'use client';

import React from 'react';
import { Shield, FileCheck, FileWarning, Link2Off, Settings2, ArrowRightLeft, BarChart3, Server, Zap } from 'lucide-react';
import { useIntersectionObserver } from '@/utils/useIntersectionObserver';
import { useLanguage } from '@/contexts/LanguageContext';

const CoreCapabilities: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const { t } = useLanguage();

  const capabilities = [
    {
      title: t("提示词越狱检测", "Prompt Jailbreak Detection"),
      icon: <Shield className="text-brand-blue" size={28} />,
      desc: t(
        "精准识别角色扮演、指令劫持等越狱攻击，在恶意 Prompt 触达模型前实时拦截。",
        "Accurately identify role-playing, instruction hijacking, and other jailbreak attacks, intercepting malicious prompts before they reach the model."
      ),
      label: "ML CLASSIFIER"
    },
    {
      title: t("隐私数据 PII 保护", "PII Data Protection"),
      icon: <FileCheck className="text-brand-blue" size={28} />,
      desc: t(
        "自动识别并脱敏身份证、手机号等 10+ 类敏感信息，防止企业数据泄露至模型训练端。",
        "Automatically identify and mask 10+ types of sensitive data such as ID numbers and phone numbers, preventing enterprise data leakage to model training."
      ),
      label: "DATA MASKING"
    },
    {
      title: t("合规敏感词检测", "Compliance Sensitive Word Detection"),
      icon: <FileWarning className="text-brand-blue" size={28} />,
      desc: t(
        "针对涉政、涉黄等风险内容进行多维度审计，支持自定义行业敏感词库，确保输出合规。",
        "Multi-dimensional auditing for politically sensitive and inappropriate content, with customizable industry-specific keyword libraries to ensure compliance."
      ),
      label: "NLP AUDIT"
    },
    {
      title: t("恶意链接扫描", "Malicious URL Scanning"),
      icon: <Link2Off className="text-brand-blue" size={28} />,
      desc: t(
        "实时提取对话中的 URL 并进行安全云扫描，拦截钓鱼网站与恶意代码下载链接。",
        "Extract URLs from conversations in real-time for cloud security scanning, blocking phishing sites and malicious download links."
      ),
      label: "URL SANDBOX"
    },
    {
      title: t("自定义安全策略", "Custom Security Policies"),
      icon: <Settings2 className="text-brand-blue" size={28} />,
      desc: t(
        "通过规则引擎配置专属安全边界，支持正则表达式与逻辑嵌套，灵活适配业务需求。",
        "Configure custom security boundaries via a rule engine, supporting regex and nested logic to flexibly adapt to business requirements."
      ),
      label: "POLICY ENGINE"
    },
    {
      title: t("双向输入输出防护", "Bidirectional I/O Protection"),
      icon: <ArrowRightLeft className="text-brand-blue" size={28} />,
      desc: t(
        "同步覆盖 User Prompt 与 Model Response，确保端到端的全生命周期安全闭环。",
        "Simultaneously cover User Prompt and Model Response, ensuring end-to-end full lifecycle security."
      ),
      label: "FULL PIPELINE"
    },
    {
      title: t("全链路可观测性", "Full-chain Observability"),
      icon: <BarChart3 className="text-brand-blue" size={28} />,
      desc: t(
        "提供可视化的安全看板，记录拦截统计、风险趋势及详尽审计日志，支持实时告警。",
        "Visual security dashboard with interception stats, risk trends, and detailed audit logs with real-time alerts."
      ),
      label: "DASHBOARD"
    },
    {
      title: t("私有化部署支持", "Private Deployment Support"),
      icon: <Server className="text-brand-blue" size={28} />,
      desc: t(
        "支持完全本地化集群部署，数据不出内网，满足金融及政府级数据安全合规要求。",
        "Fully localized cluster deployment with data staying on-premise, meeting financial and government-grade data security compliance."
      ),
      label: "ON-PREMISE"
    },
    {
      title: t("极速流式检校", "Ultra-fast Streaming Inspection"),
      icon: <Zap className="text-brand-blue" size={28} />,
      desc: t(
        "基于流式架构设计，与模型生成同步进行安全检测，实现毫秒级延迟的透明防护。",
        "Stream-based architecture that performs security checks in sync with model generation, achieving transparent protection with millisecond-level latency."
      ),
      label: "<300MS LATENCY"
    }
  ];

  return (
    <section id="features" className="py-24 bg-white text-slate-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
            {t('九大核心能力，全方位守护 AI 应用', 'Nine Core Capabilities to Safeguard Your AI Applications')}
          </h2>
          <p className="text-lg text-slate-600">
            {t(
              '从输入到输出，从内容到链接，从隐私到合规，每一个环节都不留死角',
              'From input to output, from content to URLs, from privacy to compliance — no blind spots at any stage'
            )}
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
