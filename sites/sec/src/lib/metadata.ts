import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sec.jotoai.com";
export const SITE_NAME = "唯客 AI 护栏";
export const DEFAULT_DESCRIPTION =
  "唯客 AI 护栏是企业级大模型应用运行时安全防护系统。实时检测输入输出，本地私有化部署，与 Dify 无缝集成。";

export type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  imagePath?: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  imagePath = "/og-image.png",
}: PageMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} - ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    keywords: keywords.length ? keywords : undefined,
    robots: "index, follow",
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`, width: 1200, height: 630 }],
      locale: "zh_CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`],
    },
  };
}
