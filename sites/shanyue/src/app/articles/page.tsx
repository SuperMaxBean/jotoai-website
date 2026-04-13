
import type { Metadata } from "next";
import News from "@/components/News";
import CTA from "@/components/CTA";

export const metadata: Metadata = {
  title: "新闻动态 - 产品更新与技术分享",
  description: "获取闪阅 AI 的最新产品动态、行业洞察与技术分享。了解 AI 如何赋能教育数字化转型。",
};

export default function ArticlesPage() {
  return (
    <div className="pt-20">
      <News />
      <CTA />
    </div>
  );
}
