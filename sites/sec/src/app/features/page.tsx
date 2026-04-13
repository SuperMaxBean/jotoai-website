import { Metadata } from "next";
import FeaturesPage from "@/components/FeaturesPage";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "核心功能",
  description: "了解唯客 AI 护栏的九大核心能力：提示词越狱检测、PII 保护、合规审计、恶意链接扫描、双向防护、可观测性、私有化部署与极速流式检校。",
  path: "/features",
  keywords: ["唯客 AI 护栏", "核心功能", "越狱检测", "PII 保护", "合规审计", "Dify 集成"],
});

export default function Page() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "核心功能" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "核心功能", item: `${SITE_URL}/features` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "核心功能 - 唯客 AI 护栏",
    description: "九大核心能力：提示词越狱检测、PII 保护、合规审计、恶意链接扫描等。",
    url: `${SITE_URL}/features`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <FeaturesPage />
    </>
  );
}
