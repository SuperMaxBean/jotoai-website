import { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "联系我们",
  description: "立即联系唯客 AI 护栏团队，获取企业级大模型安全防护方案与 POC 验证。支持专业部署与全程服务。",
  path: "/contact",
  keywords: ["唯客 AI 护栏", "联系我们", "企业 AI 安全", "POC 验证", "Dify 服务商"],
});

export default function Page() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "联系我们" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "联系我们", item: `${SITE_URL}/contact` },
    ],
  };

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "联系我们 - 唯客 AI 护栏",
    url: `${SITE_URL}/contact`,
    description: "联系唯客 AI 护栏团队，获取企业级大模型安全防护方案。",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <ContactPage />
    </>
  );
}
