"use client";

import { Handshake } from "lucide-react";

const PARTNERS = [
  { name: "瀚海云教育", initial: "瀚", bg: "bg-purple-600" },
  { name: "尊文智慧", initial: "尊", bg: "bg-blue-600" },
  { name: "星火英语", initial: "星", bg: "bg-pink-600" },
  { name: "未来教育集团", initial: "未", bg: "bg-emerald-600" },
  { name: "明德学院", initial: "明", bg: "bg-amber-600" },
  { name: "睿智教培", initial: "睿", bg: "bg-indigo-600" },
];

export default function Partnership() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-sm font-medium text-slate-500">
            <Handshake className="h-4 w-4" />
            合作伙伴信赖之选
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
