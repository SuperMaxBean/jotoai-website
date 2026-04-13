import { Metadata } from "next";
import ChangelogPage from "@/components/ChangelogPage";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "更新日志",
  description: "唯客 AI 护栏产品迭代记录与版本更新，持续为您提供更强大的大模型安全防护能力。",
  path: "/changelog",
  keywords: ["唯客 AI 护栏", "更新日志", "版本记录", "Dify 插件", "产品迭代"],
});

export default function Page() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "更新日志" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "更新日志", item: `${SITE_URL}/changelog` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <ChangelogPage />
    </>
  );
}
