"use client";

import { VALUE_PROPS } from "@/constants";
import { AlertTriangle } from "lucide-react";

export default function ValueProps() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 mb-4">
            <AlertTriangle className="h-4 w-4" />
            行业痛点
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            传统阅卷，困难重重
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            教师每天面对大量试卷，耗时耗力，效率与质量难以兼顾
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
