import { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import BlogPage from "@/components/BlogPage";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "新闻博客",
  description: "唯客 AI 护栏与 Dify、大模型安全、PII 脱敏、企业级 AI 防护相关的最新文章与教程。",
  path: "/blog",
  keywords: ["唯客 AI 护栏", "Dify", "大模型安全", "PII 脱敏", "AI 防护", "企业 AI"],
});

export default function Page() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "新闻博客" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "新闻博客 - 唯客 AI 护栏",
    description: "唯客 AI 护栏与 Dify、大模型安全相关的最新文章与教程。",
    url: `${SITE_URL}/blog`,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <BlogPage />
    </>
  );
}
