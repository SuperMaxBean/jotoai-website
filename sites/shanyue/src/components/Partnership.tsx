"use client";

import { Handshake } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Partnership() {
  const { t } = useLanguage();

  const PARTNERS = [
    { name: t("瀚海云教育", "Hanhai Cloud Education"), initial: t("瀚", "H"), bg: "bg-purple-600" },
    { name: t("尊文智慧", "Zunwen Smart"), initial: t("尊", "Z"), bg: "bg-blue-600" },
    { name: t("星火英语", "Xinghuo English"), initial: t("星", "X"), bg: "bg-pink-600" },
    { name: t("未来教育集团", "Future Education Group"), initial: t("未", "F"), bg: "bg-emerald-600" },
    { name: t("明德学院", "Mingde Academy"), initial: t("明", "M"), bg: "bg-amber-600" },
    { name: t("睿智教培", "Ruizhi Training"), initial: t("睿", "R"), bg: "bg-indigo-600" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-500">
            <Handshake className="h-4 w-4" />
            {t('合作伙伴信赖之选', 'Trusted by Partners')}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {PARTNERS.map((partner, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-full ${partner.bg} flex items-center justify-center text-white font-bold text-sm`}>
                  {partner.initial}
                </div>
                <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
