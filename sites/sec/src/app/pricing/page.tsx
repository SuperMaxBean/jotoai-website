import { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "价格方案",
  description: "选择适合您企业的唯客 AI 护栏版本，从初创团队到大型企业，均有完善的大模型安全防护方案。",
  path: "/pricing",
  keywords: ["唯客 AI 护栏", "价格方案", "企业版", "专业版", "Dify 插件", "POC 验证"],
});

const plans = [
  {
    name: "基础版",
    price: "免费",
    desc: "适合个人开发者或小型团队进行 POC 验证。",
    features: ["基础提示词越狱检测", "标准 PII 识别 (5类)", "社区支持", "Dify 插件集成"],
  },
  {
    name: "专业版",
    price: "联系我们",
    desc: "适合中型企业，提供更全面的安全防护与审计能力。",
    features: ["全量提示词越狱检测", "深度 PII 识别 (20+类)", "自定义安全策略", "安全看板与审计日志", "SLA 保障"],
    highlight: true,
  },
  {
    name: "企业版",
    price: "定制",
    desc: "适合大型机构，满足极高的数据安全与合规要求。",
    features: ["私有化集群部署", "多租户管理", "专家级安全咨询", "24/7 专属支持", "定制化算法训练"],
  },
];

export default function PricingPage() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "价格方案" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "价格方案", item: `${SITE_URL}/pricing` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="pt-8 pb-24 bg-brand-dark min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">价格方案</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              透明的价格体系，助力企业安全、合规地拥抱大模型技术。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl border ${plan.highlight ? "border-brand-blue bg-brand-blue/5 shadow-[0_0_30px_rgba(46,124,246,0.2)]" : "border-white/10 bg-white/5"} flex flex-col`}
              >
                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                <div className="text-3xl font-bold text-brand-blue mb-4">{plan.price}</div>
                <p className="text-gray-400 text-sm mb-8">{plan.desc}</p>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <Check size={18} className="text-brand-green shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`w-full py-3 rounded-lg font-bold text-center transition-colors min-h-[44px] flex items-center justify-center ${plan.highlight ? "bg-brand-blue text-white hover:bg-blue-600" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  立即咨询
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
