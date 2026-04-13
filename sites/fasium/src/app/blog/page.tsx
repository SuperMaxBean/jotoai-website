import type { Metadata } from 'next';
import BlogPage from '../../views/BlogPage';

export const metadata: Metadata = {
  title: '博客 - FasiumAI',
  description: 'FasiumAI 博客：AI 时尚设计最新资讯、行业趋势与产品动态。',
};

export default function Page() { return <BlogPage />; }
