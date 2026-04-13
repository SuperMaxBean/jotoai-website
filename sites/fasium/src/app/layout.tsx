import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FasiumAI - AI 驱动的时尚设计平台 | 趋势预测与一键生成',
  description: 'FasiumAI 是领先的 AI 时尚设计平台，提供实时趋势观察、灵感筛选及高保真设计稿一键生成，助力品牌缩短 70% 设计周期。',
  keywords: 'AI时尚设计, 服装设计软件, 趋势预测, 数字化时尚, FasiumAI',
  openGraph: {
    title: 'FasiumAI - AI 驱动的时尚设计平台',
    description: '从观察到选择，只需几步。FasiumAI 将服装设计全流程浓缩为三步：观察趋势、筛选灵感、一键生成。',
    url: 'https://fasium.jotoai.com',
    siteName: 'FasiumAI',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: 'https://fasium.jotoai.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FasiumAI - AI 驱动的时尚设计平台',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://fasium.jotoai.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
