export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import BlogClientPage from '@/src/views/BlogClientPage';

export const metadata: Metadata = {
  title: '博客 | 唯客知识库与 AI 洞察',
  description:
    '探索企业知识管理的未来，了解 RAG 检索增强生成、私有知识库、AI 落地案例与行业趋势。',
  keywords: ['企业知识管理', 'RAG', 'AI 落地', '知识库博客', 'Dify'],
  alternates: { canonical: 'https://kb.jotoai.com/blog' },
};

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt: string;
  published: boolean;
  imageSource?: string;
  imageAuthor?: string;
}

async function getArticles(): Promise<Article[]> {
  try {
    const backendUrl = 'http://localhost:3004';
    const res = await fetch(`${backendUrl}/api/kb/articles`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.articles || []);
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getArticles();
  return <BlogClientPage articles={articles} />;
}
