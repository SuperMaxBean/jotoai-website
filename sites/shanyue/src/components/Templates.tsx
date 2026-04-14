"use client";

import { LayoutTemplate, ArrowRight, School, GraduationCap, Building2, Landmark } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Templates() {
  const { t } = useLanguage();

  const SCENARIOS = [
    {
      title: t('中小学', 'K-12'),
      desc: t('作业批改 / 单元测试 / 期中期末', 'Homework / Unit Tests / Midterm & Final'),
      icon: School,
      bgClass: 'gradient-card-purple',
      pillClass: 'bg-purple-100 text-purple-800'
    },
    {
      title: t('高校', 'Universities'),
      desc: t('公共课阅卷 / 专业课考试 / 选拔赛', 'General Courses / Major Exams / Competitions'),
      icon: GraduationCap,
      bgClass: 'gradient-card-blue',
      pillClass: 'bg-blue-100 text-blue-800'
    },
    {
      title: t('教培机构', 'Training Centers'),
      desc: t('入学分班 / 阶段模拟 / 专项训练', 'Placement / Mock Exams / Specialized Training'),
      icon: Building2,
      bgClass: 'gradient-card-purple',
      pillClass: 'bg-purple-100 text-purple-800'
    },
    {
      title: t('教育局', 'Education Bureau'),
      desc: t('区域联考 / 质量监测 / 数据驾驶舱', 'Regional Exams / Quality Monitoring / Data Dashboard'),
      icon: Landmark,
      bgClass: 'gradient-card-blue',
      pillClass: 'bg-blue-100 text-blue-800'
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <LayoutTemplate className="h-4 w-4" />
            {t('应用场景', 'Use Cases')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('覆盖全教育场景的智能阅卷方案', 'Smart Grading Solutions for Every Education Scenario')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t(
              '从中小学到高校，从教培机构到教育局，一套系统满足所有需求',
              'From K-12 to universities, from training centers to education bureaus, one system meets all needs'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SCENARIOS.map((scenario, index) => {
            const Icon = scenario.icon;
            const isPurple = scenario.bgClass.includes("purple");
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-xl"
              >
                <div
                  className={`h-2 w-full ${
                    isPurple
                      ? "bg-gradient-to-r from-purple-500 to-purple-700"
                      : "bg-gradient-to-r from-blue-500 to-blue-700"
                  }`}
                />
                <div className="p-8">
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${
                      isPurple ? "bg-purple-50" : "bg-blue-50"
                    }`}
                  >
                    <Icon
                      className={`h-7 w-7 ${
                        isPurple ? "text-purple-600" : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="mb-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${scenario.pillClass}`}
                    >
                      {scenario.title}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-500 mb-6">
                    {scenario.desc}
                  </p>
                  <button className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 transition-colors hover:text-purple-800">
                    {t('了解详情', 'Learn More')}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
