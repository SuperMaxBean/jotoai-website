import { Metadata } from "next";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import ProductIntro from "@/components/ProductIntro";
import TechHighlights from "@/components/TechHighlights";
import CoreCapabilities from "@/components/CoreCapabilities";
import CompetitorComparison from "@/components/CompetitorComparison";
import DifyIntegration from "@/components/DifyIntegration";
import UseCases from "@/components/UseCases";
import CTA from "@/components/CTA";
import { buildPageMetadata, SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "唯客 AI 护栏 | 企业级大模型安全防护",
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: ["唯客 AI 护栏", "大模型安全", "Dify", "LLM 安全防护", "企业级 AI"],
});

export default function Home() {
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${SITE_NAME} | 企业级大模型安全防护`,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "上海聚托信息科技有限公司",
    url: "https://jotoai.com",
    logo: `${SITE_URL}/favicon.svg`,
    description: "中国首家 Dify 官方服务商，唯客 AI 护栏为企业级大模型应用提供运行时安全防护。",
    contactPoint: {
      "@type": "ContactPoint",
      email: "jotoai@jototech.cn",
      contactType: "customer service",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Hero />
      <PainPoints />
      <ProductIntro />
      <TechHighlights />
      <CoreCapabilities />
      <CompetitorComparison />
      <DifyIntegration />
      <UseCases />
      <CTA />
    </>
  );
}
