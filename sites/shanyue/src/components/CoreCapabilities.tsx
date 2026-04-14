"use client";

import {
  Sparkles,
  ScanText,
  BarChart3,
  Languages,
  PenTool,
  ImagePlus,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const ACCENT_MAP: Record<string, { iconBg: string; iconColor: string; border: string }> = {
  purple: { iconBg: "bg-purple-50", iconColor: "text-purple-600", border: "border-purple-200" },
  blue: { iconBg: "bg-blue-50", iconColor: "text-blue-600", border: "border-blue-200" },
  indigo: { iconBg: "bg-indigo-50", iconColor: "text-indigo-600", border: "border-indigo-200" },
  fuchsia: { iconBg: "bg-fuchsia-50", iconColor: "text-fuchsia-600", border: "border-fuchsia-200" },
  violet: { iconBg: "bg-violet-50", iconColor: "text-violet-600", border: "border-violet-200" },
};

export default function CoreCapabilities() {
  const { t } = useLanguage();

  const CAPABILITIES = [
    {
      icon: ScanText,
      title: t("智能 OCR 识别", "Smart OCR Recognition"),
      desc: t(
        "支持手写体、印刷体混合识别，识别准确率达 99.2%，覆盖语文、英语等主观题。",
        "Supports mixed handwriting and print recognition with 99.2% accuracy, covering subjective questions in Chinese, English, and more."
      ),
      accent: "purple",
    },
    {
      icon: PenTool,
      title: t("语义级评分", "Semantic-Level Scoring"),
      desc: t(
        "基于深度语义理解的评分引擎，不再依赖关键词匹配，真正读懂学生答案。",
        "Scoring engine based on deep semantic understanding, no longer relying on keyword matching, truly understanding student answers."
      ),
      accent: "blue",
    },
    {
      icon: Languages,
      title: t("全科目覆盖", "All-Subject Coverage"),
      desc: t(
        "语文作文、英语写作、数学解答题、理综实验题……一套系统，全科通用。",
        "Chinese essays, English writing, math problems, science experiments... one system for all subjects."
      ),
      accent: "indigo",
    },
    {
      icon: BarChart3,
      title: t("多维度分析报告", "Multi-Dimensional Analytics"),
      desc: t(
        "自动生成班级、年级、知识点维度的诊断报告，精准定位薄弱环节。",
        "Auto-generate diagnostic reports by class, grade, and knowledge dimensions, pinpointing weak areas precisely."
      ),
      accent: "fuchsia",
    },
    {
      icon: ImagePlus,
      title: t("图像题批改", "Image-Based Grading"),
      desc: t(
        "支持几何图形、化学方程式、物理电路图等图像类答题的智能识别与评阅。",
        "Supports intelligent recognition and grading of image-based answers including geometric figures, chemical equations, and physics circuit diagrams."
      ),
      accent: "violet",
    },
    {
      icon: Zap,
      title: t("秒级出分", "Instant Scoring"),
      desc: t(
        "千份试卷 5 分钟内完成批改，效率提升 50 倍以上，考后即可发布成绩。",
        "Grade 1,000 exams in under 5 minutes, 50x efficiency boost, publish results right after the exam."
      ),
      accent: "purple",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <Sparkles className="h-4 w-4" />
            {t('核心能力', 'Core Capabilities')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('AI 驱动的全链路阅卷能力', 'AI-Powered End-to-End Grading')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t('从试卷扫描到成绩发布，每一步都由 AI 精准赋能', 'From exam scanning to score publishing, every step is precisely empowered by AI')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, index) => {
            const Icon = cap.icon;
            const style = ACCENT_MAP[cap.accent] ?? ACCENT_MAP.purple;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:${style.border}`}
              >
                <div
                  className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${style.iconBg}`}
                >
                  <Icon className={`h-7 w-7 ${style.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-[#0A1A2F] mb-3">
                  {cap.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {cap.desc}
                </p>
                <ul className="mt-5 space-y-2">
                  <li className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    {t('企业级可靠性', 'Enterprise-grade reliability')}
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
