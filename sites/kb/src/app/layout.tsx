import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '唯客企业知识中台 | JOTO 旗下 AI 企业知识管理平台',
    template: '%s | 唯客企业知识中台',
  },
  description:
    '唯客企业知识中台是 JOTO 旗下 AI 企业知识管理平台，支持 RAG 检索增强生成、私有知识库、智能问答，帮助企业沉淀与利用组织知识。中国首家 Dify 官方服务商。',
  keywords: [
    'RAG', '检索增强生成', '企业知识库', '企业知识中台', '知识管理平台',
    '智能知识库', '私有知识库', '企业知识管理', 'AI 知识库', '知识中台',
    'Dify', '企业内部知识库', '员工培训知识库', '客服智能知识库',
  ],
  authors: [{ name: 'JOTO AI', url: 'https://jotoai.com' }],
  openGraph: {
    title: '唯客企业知识中台',
    description: 'JOTO 旗下 AI 企业知识管理平台，中国首家 Dify 官方服务商。',
    url: 'https://kb.jotoai.com',
    siteName: '唯客企业知识中台',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://kb.jotoai.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
