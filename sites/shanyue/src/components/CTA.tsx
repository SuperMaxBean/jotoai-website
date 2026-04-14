"use client";

import {
  Rocket,
  ArrowRight,
  Phone,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

interface CTAProps {
  onNavigate?: any;
}

export default function CTA({ onNavigate }: CTAProps) {
  const { t } = useLanguage();

  const BENEFITS = [
    t("免费试用 14 天", "14-Day Free Trial"),
    t("专属技术支持", "Dedicated Tech Support"),
    t("数据本地化部署", "Local Data Deployment"),
    t("不满意随时取消", "Cancel Anytime"),
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#7c3aed] via-purple-600 to-indigo-700 px-8 py-20 text-center shadow-2xl sm:px-16">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.03]" />
          </div>

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {t('开启智能阅卷新时代', 'Start the Smart Grading Era')}
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {t('让 AI 替您批卷', 'Let AI Grade for You')}
              <br />
              <span className="text-purple-200">{t('把时间还给教学', 'Give Time Back to Teaching')}</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-purple-100">
              {t(
                '立即体验闪阅 AI 全科阅卷系统，感受 50 倍效率提升带来的教学变革',
                'Experience the 闪阅 AI All-Subject Grading system now, and feel the teaching transformation from a 50x efficiency boost'
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {BENEFITS.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {benefit}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => onNavigate?.("contact")}
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-purple-700 shadow-xl transition-all hover:bg-purple-50 hover:shadow-2xl"
              >
                <Rocket className="h-5 w-5" />
                {t('免费试用', 'Free Trial')}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate?.("contact")}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Phone className="h-5 w-5" />
                {t('预约演示', 'Book Demo')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
