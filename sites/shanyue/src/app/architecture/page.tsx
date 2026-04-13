
import type { Metadata } from "next";
import Architecture from "@/components/Architecture";
import Integrations from "@/components/Integrations";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "技术架构 - 闪阅 AI",
  description: "闪阅 AI 的全链路自主可控技术架构体系。支持物理级安全部署、高效推理引擎与数据主权保护。",
};

export default function ArchitecturePage() {
  return (
    <div className="pt-20">
      <Architecture />
      <Integrations />
      <CTA />
    </div>
  );
}
