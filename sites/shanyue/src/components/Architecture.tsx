"use client";

import { Server, Layers, ArrowRight, ShieldCheck, Cpu, Database, BrainCircuit } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Architecture() {
  const { t } = useLanguage();

  const ARCHITECTURE = [
    {
      icon: ShieldCheck,
      title: t('物理级安全', 'Physical-Level Security'),
      desc: t('支持完全本地离线部署，确保数字资产绝对不外泄。', 'Supports fully local offline deployment, ensuring digital assets never leak.'),
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50'
    },
    {
      icon: Cpu,
      title: t('高效推理引擎', 'High-Efficiency Inference Engine'),
      desc: t('基于 ONNX Runtime 的本地模型推理，低延迟，高吞吐。', 'Local model inference based on ONNX Runtime, low latency, high throughput.'),
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50'
    },
    {
      icon: Database,
      title: t('数据主权', 'Data Sovereignty'),
      desc: t('SeaORM 驱动的多数据库架构 (MySQL/SQLite)，存储自主可控。', 'SeaORM-driven multi-database architecture (MySQL/SQLite), self-controlled storage.'),
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    },
    {
      icon: BrainCircuit,
      title: t('多模式 AI', 'Multi-Mode AI'),
      desc: t('支持标准答案模式、半监督模式、全自动模式，适应不同考试场景。', 'Supports standard answer mode, semi-supervised mode, and fully automatic mode for different exam scenarios.'),
      iconColor: 'text-fuchsia-600',
      iconBg: 'bg-fuchsia-50'
    }
  ];

  const archLayers = [
    {
      layer: t("接入层", "Access Layer"),
      items: [t("Web 端", "Web"), t("扫描仪", "Scanner"), t("移动端", "Mobile"), "API"],
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
      layer: t("服务层", "Service Layer"),
      items: [t("OCR 引擎", "OCR Engine"), t("评分引擎", "Scoring Engine"), t("分析引擎", "Analytics Engine"), t("模板引擎", "Template Engine")],
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      layer: t("AI 层", "AI Layer"),
      items: ["ONNX Runtime", t("语义模型", "Semantic Model"), t("NLP 管线", "NLP Pipeline"), t("视觉模型", "Vision Model")],
      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
    {
      layer: t("数据层", "Data Layer"),
      items: ["MySQL", "SQLite", t("文件存储", "File Storage"), t("缓存", "Cache")],
      color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <Server className="h-4 w-4" />
            {t('技术架构', 'Architecture')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('企业级技术底座', 'Enterprise-Grade Technical Foundation')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t('安全、高效、自主可控的本地化 AI 推理引擎', 'Secure, efficient, and self-controlled local AI inference engine')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {ARCHITECTURE.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="absolute top-0 right-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-slate-50 opacity-50 transition-transform group-hover:scale-150" />

                <div className="relative flex items-start gap-5">
                  <div
                    className={`shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A1A2F] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture diagram placeholder */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-[#0A1A2F]">
              {t('系统架构概览', 'System Architecture Overview')}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {archLayers.map((tier) => (
              <div
                key={tier.layer}
                className={`rounded-xl border p-5 ${tier.color}`}
              >
                <p className="text-sm font-semibold mb-3">{tier.layer}</p>
                <div className="space-y-1.5">
                  {tier.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1.5 text-xs opacity-80"
                    >
                      <ArrowRight className="h-3 w-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
