"use client";

import {
  GitCompareArrows,
  X,
  Check,
  Clock,
  Users,
  BarChart3,
  ShieldCheck,
  Repeat,
  Brain,
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Comparison() {
  const { t } = useLanguage();

  const ROWS = [
    {
      icon: Clock,
      label: t("批卷速度", "Grading Speed"),
      traditional: t("数十小时 / 次考试", "Dozens of hours per exam"),
      ai: t("千份试卷 5 分钟完成", "1,000 exams in 5 minutes"),
    },
    {
      icon: Users,
      label: t("评分一致性", "Scoring Consistency"),
      traditional: t("因人而异，主观偏差大", "Varies by person, high subjective bias"),
      ai: t("标准统一，一致性 99%+", "Unified standards, 99%+ consistency"),
    },
    {
      icon: BarChart3,
      label: t("数据分析", "Data Analytics"),
      traditional: t("仅有分数，无结构化分析", "Scores only, no structured analysis"),
      ai: t("多维度自动诊断报告", "Multi-dimensional auto-diagnostic reports"),
    },
    {
      icon: Repeat,
      label: t("经验复用", "Experience Reuse"),
      traditional: t("每次从零配置", "Configure from scratch each time"),
      ai: t("模板沉淀，一键复用", "Template accumulation, one-click reuse"),
    },
    {
      icon: ShieldCheck,
      label: t("数据安全", "Data Security"),
      traditional: t("纸质传递，风险不可控", "Paper transfer, uncontrollable risk"),
      ai: t("本地部署，物理级隔离", "Local deployment, physical-level isolation"),
    },
    {
      icon: Brain,
      label: t("智能程度", "Intelligence Level"),
      traditional: t("完全人工", "Fully manual"),
      ai: t("AI 辅助 + 人工复核", "AI-assisted + human review"),
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <GitCompareArrows className="h-4 w-4" />
            {t('对比分析', 'Comparison')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('传统阅卷 vs 闪阅 AI 阅卷', 'Traditional Grading vs iMark')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t('全方位对比，让数据说话', 'A comprehensive comparison -- let the data speak')}
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-slate-100">
            <div className="p-6">
              <span className="text-sm font-medium text-slate-400">
                {t('对比维度', 'Dimension')}
              </span>
            </div>
            <div className="border-l border-slate-100 bg-slate-50 p-6 text-center">
              <span className="text-sm font-semibold text-slate-600">
                {t('传统人工阅卷', 'Traditional Manual Grading')}
              </span>
            </div>
            <div className="border-l border-slate-100 bg-purple-50 p-6 text-center">
              <span className="text-sm font-semibold text-purple-700">
                {t('闪阅 AI 阅卷', 'iMark')}
              </span>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, index) => {
            const Icon = row.icon;
            return (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index < ROWS.length - 1 ? "border-b border-slate-100" : ""
                }`}
              >
                <div className="flex items-center gap-3 p-6">
                  <Icon className="h-5 w-5 text-slate-400" />
                  <span className="text-sm font-medium text-[#0A1A2F]">
                    {row.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 bg-slate-50/50 p-6">
                  <X className="h-4 w-4 shrink-0 text-red-400" />
                  <span className="text-sm text-slate-500">
                    {row.traditional}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-slate-100 bg-purple-50/30 p-6">
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {row.ai}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
