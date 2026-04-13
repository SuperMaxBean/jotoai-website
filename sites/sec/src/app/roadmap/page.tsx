import { Metadata } from "next";
import RoadmapPage from "@/components/RoadmapPage";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { buildPageMetadata } from "@/lib/metadata";
import { SITE_URL, SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "技术路线图",
  description: "唯客 AI 护栏未来发展规划与产品路线图，致力于构建最全面的企业级 AI 安全防护体系。",
  path: "/roadmap",
  keywords: ["唯客 AI 护栏", "技术路线图", "产品规划", "AI 安全", "大模型防护"],
});

export default function Page() {
  const breadcrumbItems = [
    { label: "首页", href: "/" },
    { label: "技术路线图" },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "技术路线图", item: `${SITE_URL}/roadmap` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Breadcrumb items={breadcrumbItems} />
      <RoadmapPage />
    </>
  );
}
