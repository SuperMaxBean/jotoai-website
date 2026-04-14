"use client";

import { Star, Quote } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const AVATAR_COLORS = ["bg-purple-600", "bg-blue-600", "bg-pink-600"];

export default function Testimonials() {
  const { t } = useLanguage();

  const CASE_STUDIES = [
    {
      company: t('瀚海云教育', 'Hanhai Cloud Education'),
      desc: t(
        '全科批卷系统应用，实现了从作业到考试的全流程自动化。现在老师们有更多时间专注于教研，而不是被埋在试卷堆里。',
        'Applied the all-subject grading system, achieving full-process automation from homework to exams. Now teachers have more time to focus on teaching research instead of being buried in piles of papers.'
      ),
    },
    {
      company: t('尊文智慧教育', 'Zunwen Smart Education'),
      desc: t(
        '应用范围：全科 + 作文批改。大幅提升了阅卷效率与数据分析能力。特别是英语作文批改，准确率令人惊讶，真的是解放了人力。',
        'Scope: all subjects + essay grading. Significantly improved grading efficiency and data analysis capability. The English essay grading accuracy is surprisingly high, truly freeing up manpower.'
      ),
    },
    {
      company: t('星火英语教培', 'Xinghuo English Training'),
      desc: t(
        '利用专有语言陪练模块，解决了"一对一"口语教学的人力瓶颈。学生们的口语练习频率提高了300%，家长满意度显著上升。',
        'Using the proprietary language practice module, solved the manpower bottleneck in one-on-one oral teaching. Student practice frequency increased by 300%, and parent satisfaction rose significantly.'
      ),
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 mb-4">
            <Star className="h-4 w-4" />
            {t('客户反馈', 'Testimonials')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('他们正在使用闪阅', 'They Are Using 闪阅')}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CASE_STUDIES.map((study, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-100" />
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-12 h-12 rounded-full ${AVATAR_COLORS[index % 3]} flex items-center justify-center text-white font-bold text-lg`}>
                  {study.company.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1A2F]">{study.company}</h3>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-500">
                &ldquo;{study.desc}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="rounded-2xl bg-purple-50 p-8">
            <div className="text-4xl font-extrabold text-[#7c3aed]">98%</div>
            <div className="mt-2 text-sm text-slate-600">{t('手写识别准确率', 'Handwriting Recognition Accuracy')}</div>
          </div>
          <div className="rounded-2xl bg-blue-50 p-8">
            <div className="text-4xl font-extrabold text-blue-600">10x</div>
            <div className="mt-2 text-sm text-slate-600">{t('阅卷效率提升', 'Grading Efficiency Boost')}</div>
          </div>
          <div className="rounded-2xl bg-green-50 p-8">
            <div className="text-4xl font-extrabold text-green-600">100+</div>
            <div className="mt-2 text-sm text-slate-600">{t('合作学校与机构', 'Partner Schools & Institutions')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
