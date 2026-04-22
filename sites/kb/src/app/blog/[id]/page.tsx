export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from '@/src/views/BlogPostClient';

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
  imageAuthorUrl?: string;
  imageUnsplashUrl?: string;
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

// 生成静态路径（有助于 SEO 和性能）
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((a) => ({ id: a.id }));
}

// 为每篇文章生成独立 meta 标签（爬虫读到每篇文章的标题和摘要）
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) return { title: '文章不存在' };

  const excerpt = article.content
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_\n]/g, ' ')
    .trim()
    .slice(0, 160);

  return {
    title: article.title,
    description: excerpt,
    keywords: article.keyword ? [article.keyword] : undefined,
    openGraph: {
      title: article.title,
      description: excerpt,
      url: `https://kb.jotoai.com/blog/${article.id}`,
      type: 'article',
      publishedTime: article.createdAt,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
    },
    alternates: { canonical: `https://kb.jotoai.com/blog/${article.id}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) notFound();

  // Article Schema.org JSON-LD —— server-rendered，百度/Google 爬虫能直接读到
  const excerpt = article.content.replace(/<[^>]+>/g, '').replace(/[#*_\n]/g, ' ').trim().slice(0, 200);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: excerpt,
    image: article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : `https://kb.jotoai.com${article.imageUrl}`) : undefined,
    datePublished: article.createdAt,
    dateModified: article.createdAt,
    author: { '@type': 'Organization', name: 'JOTO AI', url: 'https://jotoai.com' },
    publisher: {
      '@type': 'Organization',
      name: '唯客企业知识中台',
      logo: { '@type': 'ImageObject', url: 'https://kb.jotoai.com/favicon.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://kb.jotoai.com/blog/${article.id}` },
    keywords: article.keyword,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostClient article={article} />
    </>
  );
}
