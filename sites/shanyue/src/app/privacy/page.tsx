
import type { Metadata } from "next";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "隐私政策 - 闪阅 AI",
  description: "了解闪阅 AI 如何保护您的教育数据隐私与安全。我们承诺全链路自主可控与合规处理。",
};

export default function PrivacyPage() {
  return (
    <>
      <PrivacyPolicy />
      <CTA />
    </>
  );
}
