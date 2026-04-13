"use client";

import { ARCHITECTURE } from "@/constants";
import { Server, Layers, ArrowRight } from "lucide-react";

export default function Architecture() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <Server className="h-4 w-4" />
            技术架构
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            企业级技术底座
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            安全、高效、自主可控的本地化 AI 推理引擎
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {ARCHITECTURE.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="absolute top-0 right-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-slate-50 opacity-50 transition-transform group-hover:scale-150" />

                <div className="relative flex items-start gap-5">
                  <div
                    className={`shrink-0 inline-flex h-14 w-14 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <Icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A1A2F] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture diagram placeholder */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-[#0A1A2F]">
              系统架构概览
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {[
              {
                layer: "接入层",
                items: ["Web 端", "扫描仪", "移动端", "API"],
                color: "bg-purple-50 border-purple-200 text-purple-700",
              },
              {
                layer: "服务层",
                items: ["OCR 引擎", "评分引擎", "分析引擎", "模板引擎"],
                color: "bg-blue-50 border-blue-200 text-blue-700",
              },
              {
                layer: "AI 层",
                items: ["ONNX Runtime", "语义模型", "NLP 管线", "视觉模型"],
                color: "bg-indigo-50 border-indigo-200 text-indigo-700",
              },
              {
                layer: "数据层",
                items: ["MySQL", "SQLite", "文件存储", "缓存"],
                color: "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700",
              },
            ].map((tier) => (
              <div
                key={tier.layer}
                className={`rounded-xl border p-5 ${tier.color}`}
              >
                <p className="text-sm font-semibold mb-3">{tier.layer}</p>
                <div className="space-y-1.5">
                  {tier.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-1.5 text-xs opacity-80"
                    >
                      <ArrowRight className="h-3 w-3" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
