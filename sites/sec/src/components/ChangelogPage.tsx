'use client';

import React from 'react';
import { GitCommit, Tag } from 'lucide-react';
import { useSEO } from '../utils/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';

const ChangelogPage: React.FC = () => {
  const { t } = useLanguage();

  useSEO({
    title: t('更新日志 | 唯客 AI 护栏', 'Changelog | JOTO AI Guardrails'),
    description: t(
      '唯客 AI 护栏产品迭代记录，持续优化提示词越狱检测、PII 保护、Dify 集成等核心能力，为您提供更强大的 AI 安全防护能力。',
      'JOTO AI Guardrails product iteration log. Continuously optimizing jailbreak detection, PII protection, Dify integration, and more.'
    ),
    keywords: t(
      '唯客AI护栏更新,AI安全新功能,大模型安全迭代,版本更新日志',
      'AI guardrails updates,AI security features,LLM security iteration,changelog'
    ),
    canonical: '/changelog',
  });

  const logs = [
    {
        version: "v2.1.0",
        date: "2025-05-10",
        features: [
            t(
              "新增：Dify 插件支持自定义敏感词库热更新，无需重启服务。",
              "New: Dify plugin supports hot-reload of custom sensitive word libraries without service restart."
            ),
            t(
              "优化：PII 识别模型升级，支持更多种类的中国证件号识别（护照、港澳通行证）。",
              "Improved: PII detection model upgraded, supporting more Chinese document types (passport, HK/Macau travel permit)."
            ),
            t(
              "修复：极少数情况下流式响应截断导致的乱码问题。",
              "Fixed: Garbled text caused by streaming response truncation in rare cases."
            )
        ]
    },
    {
        version: "v2.0.0",
        date: "2025-04-15",
        features: [
            t(
              "重构：核心检测引擎从 Python 迁移至 Rust，平均延迟降低至 45ms。",
              "Refactored: Core detection engine migrated from Python to Rust, average latency reduced to 45ms."
            ),
            t(
              "新增：RAG 幻觉检测功能（Beta），支持基于召回文档的事实性校验。",
              "New: RAG hallucination detection (Beta), supporting fact-checking based on retrieved documents."
            ),
            t(
              "新增：金融行业专属合规策略包。",
              "New: Finance industry-specific compliance policy package."
            ),
            t(
              "优化：管理控制台 UI 全面升级，支持深色模式。",
              "Improved: Admin console UI fully upgraded with dark mode support."
            )
        ]
    },
    {
        version: "v1.5.2",
        date: "2025-03-20",
        features: [
            t(
              "新增：支持流式日志审计，可实时查看拦截详情。",
              "New: Streaming log audit with real-time interception details."
            ),
            t(
              "优化：恶意 URL 检测算法，降低误报率。",
              "Improved: Malicious URL detection algorithm with reduced false positive rate."
            ),
            t(
              "修复：Docker 部署环境下部分环境变量不生效的问题。",
              "Fixed: Some environment variables not taking effect in Docker deployment."
            )
        ]
    },
    {
        version: "v1.0.0",
        date: "2025-01-01",
        features: [
            t(
              "发布：唯客 AI 护栏正式版发布。",
              "Released: JOTO AI Guardrails official version launched."
            ),
            t(
              "功能：包含提示词注入检测、PII 脱敏、违规内容过滤等基础功能。",
              "Features: Includes prompt injection detection, PII masking, and content compliance filtering."
            ),
            t(
              "集成：首发支持 Dify 原生集成。",
              "Integration: Native Dify integration supported from day one."
            )
        ]
    }
  ];

  return (
    <div className="bg-brand-dark min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">{t('产品更新日志', 'Product Changelog')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t(
              '持续迭代，为您提供更强大、更稳固的 AI 安全防护能力。',
              'Continuous iteration to provide you with more powerful and robust AI security protection.'
            )}
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
             {/* Timeline Line */}
             <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-white/10 lg:-translate-x-1/2"></div>

             <div className="space-y-12">
                {logs.map((log, index) => (
                    <div key={index} className={`flex flex-col lg:flex-row gap-8 lg:gap-0 relative group ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>

                        {/* Center Dot */}
                        <div className="absolute left-8 lg:left-1/2 w-4 h-4 bg-brand-dark border-2 border-brand-blue rounded-full z-10 -translate-x-1.5 lg:-translate-x-1.5 mt-6 group-hover:bg-brand-blue transition-colors shadow-[0_0_10px_rgba(46,124,246,0.5)]"></div>

                        {/* Date */}
                        <div className={`lg:w-1/2 pl-16 lg:pl-0 flex flex-col justify-center lg:items-end ${index % 2 === 0 ? 'lg:text-left lg:items-start lg:pl-12' : 'lg:text-right lg:pr-12'}`}>
                            <div className="text-brand-blue font-mono font-bold text-lg mb-1">{log.version}</div>
                            <div className="text-gray-500 text-sm">{log.date}</div>
                        </div>

                        {/* Content Card */}
                        <div className={`lg:w-1/2 pl-16 lg:pl-0 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                            <div className="bg-[#0F172A] border border-white/10 rounded-xl p-6 hover:border-brand-blue/30 transition-all hover:shadow-lg relative">
                                {/* Triangle pointer for desktop */}
                                <div className={`hidden lg:block absolute top-7 w-3 h-3 bg-[#0F172A] border-t border-l border-white/10 rotate-45 ${index % 2 === 0 ? '-right-1.5 border-l-0 border-b border-white/10' : '-left-1.5 border-t-0 border-r border-white/10'}`}></div>

                                <ul className="space-y-3">
                                    {log.features.map((feature, idx) => (
                                        <li key={idx} className="text-gray-300 text-sm leading-relaxed flex items-start gap-2">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0 opacity-70"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;
