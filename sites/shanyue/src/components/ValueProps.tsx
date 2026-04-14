"use client";

import { AlertTriangle, Clock, Scale, FileBarChart, Recycle } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function ValueProps() {
  const { t } = useLanguage();

  const VALUE_PROPS = [
    {
      icon: Clock,
      title: t('效率低下', 'Low Efficiency'),
      desc: t(
        '一次考试批卷耗时数十小时，大量时间消耗在重复性工作上',
        'A single exam takes dozens of hours to grade, with massive time spent on repetitive work'
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Scale,
      title: t('标准不一', 'Inconsistent Standards'),
      desc: t(
        '不同老师对同一道题的评分存在主观偏差，难以保证评判一致性',
        'Different teachers have subjective biases when scoring the same question, making consistency hard to guarantee'
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: FileBarChart,
      title: t('洞察缺失', 'Lacking Insights'),
      desc: t(
        '批卷结果仅保留分数，缺少对错误类型与知识薄弱点的结构化分析',
        'Grading results only retain scores, lacking structured analysis of error types and knowledge gaps'
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Recycle,
      title: t('无法复用', 'No Reusability'),
      desc: t(
        '每次考试从零配置，试卷模板与批改经验无法沉淀积累',
        'Configure from scratch for each exam; templates and grading experience cannot be accumulated'
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 mb-4">
            <AlertTriangle className="h-4 w-4" />
            {t('行业痛点', 'Industry Pain Points')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('传统阅卷，困难重重', 'Traditional Grading, Full of Challenges')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t(
              '教师每天面对大量试卷，耗时耗力，效率与质量难以兼顾',
              'Teachers face mountains of papers daily, spending time and energy, struggling to balance efficiency and quality'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-red-200"
              >
                <div className="absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-red-50 opacity-50 transition-transform group-hover:scale-150" />
                <div
                  className={`relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${prop.bgColor}`}
                >
                  <Icon className={`h-7 w-7 ${prop.color}`} />
                </div>
                <h3 className="relative text-xl font-semibold text-[#0A1A2F] mb-3">
                  {prop.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-slate-500">
                  {prop.desc}
                </p>
                <div className="mt-6 h-1 w-12 rounded-full bg-red-100 transition-all group-hover:w-full group-hover:bg-red-200" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
