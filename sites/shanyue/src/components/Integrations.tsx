"use client";

import {
  Plug,
  MonitorSmartphone,
  Cloud,
  Server,
  FileSpreadsheet,
  Users,
  ArrowRight,
  CheckCircle2,
  Link2,
} from "lucide-react";

const INTEGRATIONS = [
  {
    icon: MonitorSmartphone,
    title: "智慧校园平台",
    desc: "无缝对接主流智慧校园系统，成绩自动同步至教务管理平台。",
    items: ["希沃", "科大讯飞", "天喻"],
  },
  {
    icon: Cloud,
    title: "云端/私有化部署",
    desc: "支持公有云 SaaS、私有云、本地离线三种部署模式，灵活适配。",
    items: ["阿里云", "腾讯云", "本地服务器"],
  },
  {
    icon: FileSpreadsheet,
    title: "数据导入/导出",
    desc: "支持 Excel、CSV、PDF 等多种格式的数据批量导入和结构化导出。",
    items: ["Excel", "CSV", "PDF"],
  },
  {
    icon: Server,
    title: "扫描仪兼容",
    desc: "兼容市面主流高速扫描仪，支持 TWAIN 协议，即插即用。",
    items: ["富士通", "松下", "佳能"],
  },
  {
    icon: Users,
    title: "统一身份认证",
    desc: "集成 LDAP、OAuth 2.0、CAS 等主流单点登录协议。",
    items: ["LDAP", "OAuth", "CAS"],
  },
  {
    icon: Link2,
    title: "开放 API",
    desc: "提供 RESTful API 和 Webhook 回调，方便二次开发和系统集成。",
    items: ["REST API", "Webhook", "SDK"],
  },
];

interface IntegrationsProps {
  onNavigate?: any;
}

export default function Integrations({ onNavigate }: IntegrationsProps) {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <Plug className="h-4 w-4" />
            生态集成
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            与校园 IT 生态无缝衔接
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            开放架构设计，轻松融入现有教务系统，无需推倒重来
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:border-purple-200"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50">
                  <Icon className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 mb-5">
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.items.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate?.("contact")}
            className="inline-flex items-center gap-2 rounded-full bg-[#7c3aed] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-xl"
          >
            获取集成方案
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
