"use client";

import { SCENARIOS } from "@/constants";
import { LayoutTemplate, ArrowRight } from "lucide-react";

export default function Templates() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <LayoutTemplate className="h-4 w-4" />
            应用场景
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            覆盖全教育场景的智能阅卷方案
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            从中小学到高校，从教培机构到教育局，一套系统满足所有需求
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
                    了解详情
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
