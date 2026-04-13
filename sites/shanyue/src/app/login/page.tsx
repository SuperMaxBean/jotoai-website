
import type { Metadata } from "next";
import Login from "@/components/Login";

export const metadata: Metadata = {
  title: "登录 - 闪阅 AI",
  description: "登录闪阅 AI 工作台，管理您的阅卷任务与学情分析报告。",
};

export default function LoginPage() {
  return <Login />;
}
