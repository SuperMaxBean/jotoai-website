import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '../components/Layout';
import { LanguageProvider } from '../contexts/LanguageContext';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  title: '唯客智审 - AI 赋能新一代合同审查平台',
  description: '唯客智审将合同审查时间从数小时缩短至几分钟，以95%准确率为企业规避风险，重塑法务工作流。',
  keywords: [
    'AI合同审查', '智能合同审查系统', '合同风险识别', '法务AI工具',
    '企业合规审查平台', '合同审查效率提升', 'AI法律科技',
    '合同管理自动化', '法务数字化转型', '合同条款风险检测',
  ],
  metadataBase: new URL('https://audit.jotoai.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '唯客智审 - AI 赋能新一代合同审查平台',
    description: '唯客智审将合同审查时间从数小时缩短至几分钟，以95%准确率为企业规避风险，重塑法务工作流。',
    url: 'https://audit.jotoai.com',
    type: 'website',
    locale: 'zh_CN',
    siteName: '唯客智审',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: '唯客智审 - AI 合同审查平台',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '唯客智审 - AI 赋能新一代合同审查平台',
    description: '95% 准确率合同审查，数小时缩短至几分钟。',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
