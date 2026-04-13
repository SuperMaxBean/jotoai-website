export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import LoginPage from '@/src/views/LoginPage';

export const metadata: Metadata = {
  title: '登录',
  description: '登录您的唯客企业知识中台账户',
  robots: { index: false, follow: false },
};

export default function Login() {
  return <LoginPage />;
}
