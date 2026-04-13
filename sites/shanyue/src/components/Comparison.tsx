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

const ROWS = [
  {
    icon: Clock,
    label: "批卷速度",
    traditional: "数十小时 / 次考试",
    ai: "千份试卷 5 分钟完成",
  },
  {
    icon: Users,
    label: "评分一致性",
    traditional: "因人而异，主观偏差大",
    ai: "标准统一，一致性 99%+",
  },
  {
    icon: BarChart3,
    label: "数据分析",
    traditional: "仅有分数，无结构化分析",
    ai: "多维度自动诊断报告",
  },
  {
    icon: Repeat,
    label: "经验复用",
    traditional: "每次从零配置",
    ai: "模板沉淀，一键复用",
  },
  {
    icon: ShieldCheck,
    label: "数据安全",
    traditional: "纸质传递，风险不可控",
    ai: "本地部署，物理级隔离",
  },
  {
    icon: Brain,
    label: "智能程度",
    traditional: "完全人工",
    ai: "AI 辅助 + 人工复核",
  },
];

export default function Comparison() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <GitCompareArrows className="h-4 w-4" />
            对比分析
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            传统阅卷 vs 闪阅 AI 阅卷
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            全方位对比，让数据说话
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-slate-100">
            <div className="p-6">
              <span className="text-sm font-medium text-slate-400">
                对比维度
              </span>
            </div>
            <div className="border-l border-slate-100 bg-slate-50 p-6 text-center">
              <span className="text-sm font-semibold text-slate-600">
                传统人工阅卷
              </span>
            </div>
            <div className="border-l border-slate-100 bg-purple-50 p-6 text-center">
              <span className="text-sm font-semibold text-purple-700">
                闪阅 AI 阅卷
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
