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
