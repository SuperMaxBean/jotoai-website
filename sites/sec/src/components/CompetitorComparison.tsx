'use client';

import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { useIntersectionObserver } from '@/utils/useIntersectionObserver';
import { useLanguage } from '@/contexts/LanguageContext';

const ComparisonItem = ({ feature, weike, weikeLabel, others, othersLabel, isLast }: { feature: string, weike: string, weikeLabel: string, others: string, othersLabel: string, isLast?: boolean }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-6 ${!isLast ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors group`}>
    <div className="font-bold text-white flex items-center md:text-lg text-base">{feature}</div>

    <div className="flex items-center gap-3">
        <span className="md:hidden text-xs text-brand-green font-bold uppercase tracking-wider w-20 shrink-0">{weikeLabel}</span>
        <div className="text-brand-green font-medium flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 border border-brand-green/30">
            <Check size={14} strokeWidth={3} />
        </div>
        <span className="text-white group-hover:text-brand-green transition-colors">{weike}</span>
        </div>
    </div>

    <div className="flex items-center gap-3">
        <span className="md:hidden text-xs text-gray-500 font-bold uppercase tracking-wider w-20 shrink-0">{othersLabel}</span>
        <div className="text-gray-400 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/10">
            {others.includes("不支持") || others.includes("风险") || others.includes("高") || others.includes("需") || others.includes("阻断") || others.includes("结束") || others.includes("No") || others.includes("risk") || others.includes("block") || others.includes("require") ? <X size={14} className="text-red-400"/> : <Minus size={14} className="text-gray-500"/>}
        </div>
        <span>{others}</span>
        </div>
    </div>
  </div>
);

const CompetitorComparison: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  const { t } = useLanguage();

  const weikeLabel = t('唯客', 'JOTO');
  const othersLabel = t('其他方案', 'Others');

  return (
    <section className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('为什么选择唯客 AI 护栏？', 'Why Choose JOTO AI Guardrails?')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t(
              '相比通用开源方案或传统网关，唯客 AI 护栏专为 LLM 场景设计，提供极致的性能与合规性。',
              'Compared to generic open-source solutions or traditional gateways, JOTO AI Guardrails is purpose-built for LLM scenarios, delivering ultimate performance and compliance.'
            )}
          </p>
        </div>

        <div
          ref={ref}
          className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {/* Header (Desktop only) */}
          <div className="hidden md:grid grid-cols-3 gap-4 p-6 bg-white/5 border-b border-white/10 text-sm uppercase tracking-wider font-semibold">
            <div className="text-gray-500">{t('核心能力', 'Core Capability')}</div>
            <div className="text-brand-blue flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
                唯客 AI 护栏
            </div>
            <div className="text-gray-500">
                {t('通用开源 / 传统方案', 'Generic Open-source / Traditional Solutions')}
            </div>
          </div>

          {/* Rows */}
          <ComparisonItem
            feature={t("检测延迟", "Detection Latency")}
            weike={t("< 300ms (流式并行检测)", "< 300ms (streaming parallel detection)")}
            weikeLabel={weikeLabel}
            others={t("> 500ms (串行/批处理)", "> 500ms (serial/batch processing)")}
            othersLabel={othersLabel}
          />
          <ComparisonItem
            feature={t("数据隐私", "Data Privacy")}
            weike={t("本地私有化部署，数据不出域", "On-premise private deployment, data stays in-domain")}
            weikeLabel={weikeLabel}
            others={t("SaaS API，存在数据出境风险", "SaaS API, data egress risk")}
            othersLabel={othersLabel}
          />
           <ComparisonItem
            feature={t("PII 识别能力", "PII Detection")}
            weike={t("10+ 中国特化类型 (身份证/銀行卡)", "10+ China-specific types (ID card/bank card)")}
            weikeLabel={weikeLabel}
            others={t("仅支持基础正则或英文实体", "Basic regex or English entities only")}
            othersLabel={othersLabel}
          />
          <ComparisonItem
            feature={t("敏感内容处理", "Sensitive Content Handling")}
            weike={t("智能脱敏 (***)，对话不中断", "Smart masking (***), conversation continues")}
            weikeLabel={weikeLabel}
            others={t("整段阻断，强制结束会话", "Full block, forcibly ends session")}
            othersLabel={othersLabel}
          />
           <ComparisonItem
            feature={t("企业级服务", "Enterprise Service")}
            weike={t("SLA 保障 + 专家支持", "SLA guarantee + expert support")}
            weikeLabel={weikeLabel}
            others={t("无保障 / 社区支持", "No guarantee / community support")}
            othersLabel={othersLabel}
          />
          <ComparisonItem
            feature={t("Dify 集成", "Dify Integration")}
            weike={t("一键嵌入", "One-click integration")}
            weikeLabel={weikeLabel}
            others={t("需二次开发对接", "Requires custom development")}
            othersLabel={othersLabel}
            isLast
          />
        </div>
      </div>
    </section>
  );
};

export default CompetitorComparison;
