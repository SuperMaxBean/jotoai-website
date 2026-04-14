import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../contexts/LanguageContext';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
  },
  title: 'FasiumAI - AI-Powered Fashion Design Platform | AI 驱动的时尚设计平台',
  description: 'FasiumAI is the leading AI fashion design platform offering real-time trend observation, inspiration curation, and one-click high-fidelity design generation, helping brands cut design cycles by 70%.',
  keywords: 'AI fashion design, garment design software, trend prediction, digital fashion, FasiumAI',
  openGraph: {
    title: 'FasiumAI - AI-Powered Fashion Design Platform',
    description: 'From observation to selection in just a few steps. FasiumAI condenses the entire garment design workflow into three steps: observe trends, curate inspiration, generate with one click.',
    url: 'https://fasium.jotoai.com',
    siteName: 'FasiumAI',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: 'https://fasium.jotoai.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FasiumAI - AI-Powered Fashion Design Platform',
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
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
