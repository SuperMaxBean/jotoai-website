"use client";

import { CASE_STUDIES } from "@/constants";
import { Star, Quote } from "lucide-react";

const AVATAR_COLORS = ["bg-purple-600", "bg-blue-600", "bg-pink-600"];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 mb-4">
            <Star className="h-4 w-4" />
            客户反馈
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            他们正在使用闪阅
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
            <div className="mt-2 text-sm text-slate-600">手写识别准确率</div>
          </div>
          <div className="rounded-2xl bg-blue-50 p-8">
            <div className="text-4xl font-extrabold text-blue-600">10x</div>
            <div className="mt-2 text-sm text-slate-600">阅卷效率提升</div>
          </div>
          <div className="rounded-2xl bg-green-50 p-8">
            <div className="text-4xl font-extrabold text-green-600">100+</div>
            <div className="mt-2 text-sm text-slate-600">合作学校与机构</div>
          </div>
        </div>
      </div>
    </section>
  );
}
