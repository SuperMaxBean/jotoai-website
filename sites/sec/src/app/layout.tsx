import type { Metadata } from "next";
import { Noto_Sans_SC, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrafficSourceCapture from "@/components/TrafficSourceCapture";
import { buildPageMetadata, DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/metadata";

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} | 企业级大模型安全防护`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
  keywords: ["唯客 AI 护栏", "大模型安全", "Dify", "LLM 安全防护", "企业级 AI"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-brand-dark text-white selection:bg-brand-blue selection:text-white min-h-screen flex flex-col">
        <TrafficSourceCapture />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
