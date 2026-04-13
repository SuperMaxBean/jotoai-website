
import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "联络我们 - 预约演示与方案咨询",
  description: "联系闪阅 AI 团队，预约产品演示或咨询定制化 AI 阅卷解决方案。我们随时为您提供支持。",
};

export default function ContactPage() {
  return <Contact />;
}
