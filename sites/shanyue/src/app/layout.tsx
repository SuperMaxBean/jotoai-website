import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL("https://shanyue.jotoai.com"),
  title: {
    default: "闪阅 - AI 全科阅卷 | 面向未来的教学评估平台",
    template: "%s | 闪阅 AI",
  },
  description:
    "闪阅专注于教育场景 OCR 与智能评估技术，为学校与教育机构定制 AI 阅卷解决方案。手写识别率 98%，支持全科批改与私有化部署。",
  keywords: [
    "AI阅卷",
    "智能批改",
    "教育OCR",
    "教学评估",
    "闪阅",
    "JOTO",
    "手写识别",
    "自动批改",
    "智能阅卷系统",
    "AI教育",
    "教育数字化",
    "OCR试卷识别",
    "私有化部署",
  ],
  authors: [{ name: "JOTO AI" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shanyue.jotoai.com",
  },
  openGraph: {
    title: "闪阅 - AI 全科阅卷",
    description:
      "面向未来的教学评估与资产沉淀平台。手写识别率 98%，支持全科题型，私有化部署保障数据安全。",
    url: "https://shanyue.jotoai.com",
    siteName: "闪阅 AI",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "闪阅 AI 全科阅卷系统",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "闪阅 - AI 全科阅卷",
    description: "面向未来的教学评估与资产沉淀平台。",
    images: ["/og-image.png"],
  },
  verification: {
    // 百度站长平台验证码（替换为实际值）
    // other: { "baidu-site-verification": "your-code-here" },
  },
};

// 网站结构化数据 (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "闪阅 AI 全科阅卷",
  description:
    "闪阅专注于教育场景 OCR 与智能评估技术，为学校与教育机构定制 AI 阅卷解决方案。",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://shanyue.jotoai.com",
  author: {
    "@type": "Organization",
    name: "JOTO AI",
    url: "https://joto.ai",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
    description: "提供免费试用，按需定制报价",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "100",
    bestRating: "5",
    worstRating: "1",
  },
};

// 组织结构化数据
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JOTO AI",
  url: "https://joto.ai",
  logo: "https://shanyue.jotoai.com/logo.png",
  description: "JOTO AI 专注于教育领域的人工智能技术研发",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: ["Chinese", "English"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* preconnect 给字体 CDN 提前握手，LCP 降 200-400ms */}
        <link rel="preconnect" href="https://fonts.loli.net" crossOrigin="" />
        <link rel="preconnect" href="https://gstatic.loli.net" crossOrigin="" />
        {/* 只加载实际用到的 3 种字重，省 29KiB CSS/字体 —— LH 建议 */}
        <link
          href="https://fonts.loli.net/css2?family=Inter:wght@400;600;700&family=Noto+Sans+SC:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body
        className="font-sans antialiased"
        style={{
          fontFamily:
            "'Inter', 'Noto Sans SC', ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
