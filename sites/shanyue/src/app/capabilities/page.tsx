
import type { Metadata } from "next";
import CoreCapabilities from "@/components/CoreCapabilities";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "核心能力 - AI 阅卷技术详解",
  description: "闪阅 AI 全科阅卷系统的核心技术能力，包括全场景 OCR 识别、智能分步阅卷、灵活模板配置与多维学情分析。",
};

export default function CapabilitiesPage() {
  return (
    <div className="pt-20">
      <CoreCapabilities />
      <Features />
      <CTA />
    </div>
  );
}
