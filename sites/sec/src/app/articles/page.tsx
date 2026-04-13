import { Metadata } from "next";
import BlogPage from "@/components/BlogPage";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "文章列表",
  description: "唯客 AI 护栏与 Dify、大模型安全、PII 脱敏相关的最新文章与教程。",
  path: "/articles",
  keywords: ["唯客 AI 护栏", "文章", "Dify", "大模型安全", "教程"],
});

export default function Page() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "文章列表" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "文章列表", item: `${SITE_URL}/articles` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <BlogPage />
    </>
  );
}
