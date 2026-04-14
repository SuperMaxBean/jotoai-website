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
import { useLanguage } from '@/contexts/LanguageContext';

interface IntegrationsProps {
  onNavigate?: any;
}

export default function Integrations({ onNavigate }: IntegrationsProps) {
  const { t } = useLanguage();

  const INTEGRATIONS = [
    {
      icon: MonitorSmartphone,
      title: t("智慧校园平台", "Smart Campus Platform"),
      desc: t(
        "无缝对接主流智慧校园系统，成绩自动同步至教务管理平台。",
        "Seamlessly integrates with mainstream smart campus systems, auto-syncing scores to academic management platforms."
      ),
      items: [t("希沃", "Seewo"), t("科大讯飞", "iFLYTEK"), t("天喻", "Tianyu")],
    },
    {
      icon: Cloud,
      title: t("云端/私有化部署", "Cloud / Private Deployment"),
      desc: t(
        "支持公有云 SaaS、私有云、本地离线三种部署模式，灵活适配。",
        "Supports public cloud SaaS, private cloud, and local offline deployment modes for flexible adaptation."
      ),
      items: [t("阿里云", "Alibaba Cloud"), t("腾讯云", "Tencent Cloud"), t("本地服务器", "Local Server")],
    },
    {
      icon: FileSpreadsheet,
      title: t("数据导入/导出", "Data Import/Export"),
      desc: t(
        "支持 Excel、CSV、PDF 等多种格式的数据批量导入和结构化导出。",
        "Supports batch import and structured export in multiple formats including Excel, CSV, and PDF."
      ),
      items: ["Excel", "CSV", "PDF"],
    },
    {
      icon: Server,
      title: t("扫描仪兼容", "Scanner Compatibility"),
      desc: t(
        "兼容市面主流高速扫描仪，支持 TWAIN 协议，即插即用。",
        "Compatible with mainstream high-speed scanners, supporting TWAIN protocol, plug-and-play."
      ),
      items: [t("富士通", "Fujitsu"), t("松下", "Panasonic"), t("佳能", "Canon")],
    },
    {
      icon: Users,
      title: t("统一身份认证", "Unified Identity Authentication"),
      desc: t(
        "集成 LDAP、OAuth 2.0、CAS 等主流单点登录协议。",
        "Integrates mainstream SSO protocols including LDAP, OAuth 2.0, and CAS."
      ),
      items: ["LDAP", "OAuth", "CAS"],
    },
    {
      icon: Link2,
      title: t("开放 API", "Open API"),
      desc: t(
        "提供 RESTful API 和 Webhook 回调，方便二次开发和系统集成。",
        "Provides RESTful API and Webhook callbacks for easy secondary development and system integration."
      ),
      items: ["REST API", "Webhook", "SDK"],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <Plug className="h-4 w-4" />
            {t('生态集成', 'Ecosystem Integration')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('与校园 IT 生态无缝衔接', 'Seamless Integration with Campus IT Ecosystem')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t(
              '开放架构设计，轻松融入现有教务系统，无需推倒重来',
              'Open architecture design, easily integrating into existing academic systems without starting over'
            )}
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
            {t('获取集成方案', 'Get Integration Plan')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
