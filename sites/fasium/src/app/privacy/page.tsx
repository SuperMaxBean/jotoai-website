import type { Metadata } from 'next';
import PrivacyPage from '../../views/PrivacyPage';

export const metadata: Metadata = {
  title: '隐私政策 - FasiumAI',
};

export default function Page() { return <PrivacyPage />; }
