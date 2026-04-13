import { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "关于我们",
  description: "唯客 AI 护栏由 JOTO.AI 团队打造，中国首家 Dify 官方服务商，致力于成为企业大模型应用的安全基石。",
  path: "/about",
  keywords: ["唯客 AI 护栏", "关于我们", "JOTO.AI", "Dify 服务商", "AI 安全团队"],
});

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "关于我们" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "关于我们", item: `${SITE_URL}/about` },
    ],
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "上海聚托信息科技有限公司",
    url: "https://jotoai.com",
    description: "中国首家 Dify 官方服务商，唯客 AI 护栏为企业级大模型应用提供运行时安全防护。",
    contactPoint: { "@type": "ContactPoint", email: "jotoai@jototech.cn", contactType: "customer service" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <div className="pt-8 pb-24 bg-brand-dark min-h-screen">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">关于我们</h1>

            <div className="prose prose-invert prose-blue">
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                唯客 AI 护栏是 JOTO.AI (上海聚托信息科技有限公司) 旗下的核心安全产品。
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">我们的愿景</h2>
              <p className="text-gray-400 mb-8">
                在生成式 AI 浪潮中，安全与合规是企业落地的第一道门槛。我们的愿景是构建一套透明、极速、可靠的 AI 安全基础设施，让每一家企业都能毫无顾虑地释放大模型的生产力。
              </p>

              <h2 className="text-2xl font-bold text-white mt-12 mb-6">专业团队</h2>
              <p className="text-gray-400 mb-8">
                JOTO.AI 作为中国首家 Dify 官方服务商，深耕大模型应用开发与部署领域。我们的团队由资深安全专家、算法工程师和全栈开发者组成，在 LLM 安全攻防、隐私计算和高性能网关领域拥有深厚积累。
              </p>

              <div className="p-8 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl mt-16">
                <h3 className="text-xl font-bold text-white mb-4">联系我们</h3>
                <p className="text-gray-300 mb-6">如果您对我们的产品感兴趣，或者有任何关于 AI 安全的疑问，欢迎随时联系。</p>
                <div className="space-y-2 text-brand-blue font-medium">
                  <p>邮箱：jotoai@jototech.cn</p>
                  <p>地址：上海市杨浦区</p>
                </div>
                <p className="mt-4">
                  <Link href="/contact" className="text-brand-blue hover:underline">前往联络我们页面提交需求</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
