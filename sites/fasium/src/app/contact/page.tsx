import type { Metadata } from 'next';
import ContactPage from '../../views/ContactPage';

export const metadata: Metadata = {
  title: '联系我们 - FasiumAI',
  description: '联系 FasiumAI 团队，了解 AI 时尚设计平台合作与演示。',
};

export default function Page() { return <ContactPage />; }
