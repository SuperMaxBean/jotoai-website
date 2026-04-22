import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostPage from '../../../views/BlogPostPage';

// revalidate 每小时 —— 新文章发布后最多 1 小时爬虫看到
export const revalidate = 3600;

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt: string;
  excerpt?: string;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const backendUrl = 'http://localhost:3004';
    const res = await fetch(`${backendUrl}/api/fasium/articles/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.article ?? data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: '文章不存在' };

  const excerpt = article.excerpt || article.content
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_\n]/g, ' ')
    .trim()
    .slice(0, 160);

  return {
    title: `${article.title} | FasiumAI`,
    description: excerpt,
    keywords: article.keyword ? [article.keyword] : undefined,
    openGraph: {
      title: article.title,
      description: excerpt,
      url: `https://fasium.jotoai.com/blog/${article.id}`,
      type: 'article',
      publishedTime: article.createdAt,
      images: article.imageUrl ? [{ url: article.imageUrl.startsWith('http') ? article.imageUrl : `https://fasium.jotoai.com${article.imageUrl}` }] : undefined,
    },
    alternates: { canonical: `https://fasium.jotoai.com/blog/${article.id}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  // Article Schema.org JSON-LD —— 服务端渲染，保证 Baidu/Google 都能读到
  const excerpt = article.content.replace(/<[^>]+>/g, '').replace(/[#*_\n]/g, ' ').trim().slice(0, 200);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: excerpt,
    image: article.imageUrl ? (article.imageUrl.startsWith('http') ? article.imageUrl : `https://fasium.jotoai.com${article.imageUrl}`) : undefined,
    datePublished: article.createdAt,
    dateModified: article.createdAt,
    author: { '@type': 'Organization', name: 'FasiumAI', url: 'https://fasium.jotoai.com' },
    publisher: {
      '@type': 'Organization',
      name: 'FasiumAI',
      logo: { '@type': 'ImageObject', url: 'https://fasium.jotoai.com/favicon.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://fasium.jotoai.com/blog/${article.id}` },
    keywords: article.keyword,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostPage article={article} />
    </>
  );
}
