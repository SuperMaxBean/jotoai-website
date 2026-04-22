import type { MetadataRoute } from 'next';

// 动态 sitemap —— 每小时 revalidate 一次，从 admin 后端拉当前站文章
export const revalidate = 3600;

interface Article {
  id: string | number;
  createdAt?: string;
  publishedAt?: string;
}

const SITE_ID = 'audit';
const BASE_URL = 'https://audit.jotoai.com';
const ARTICLE_PATH = '/blog'; // '/blog' 或 '/articles'
const STATIC_ROUTES: Array<{ path: string; priority: number; freq: 'weekly' | 'daily' | 'monthly' | 'yearly' }> = [{ path: '', priority: 1.0, freq: 'weekly' }, { path: '/blog', priority: 0.9, freq: 'daily' }, { path: '/contact', priority: 0.6, freq: 'monthly' }];

async function getArticles(): Promise<Article[]> {
  // 生产跑在 139.224.51.172，admin backend 在同机 :3004
  const backendBase = process.env.BACKEND_URL || 'http://localhost:3004';
  try {
    const res = await fetch(`${backendBase}/api/${SITE_ID}/articles`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: Article[] = Array.isArray(data) ? data : (data.articles || []);
    return list;
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const staticMap: MetadataRoute.Sitemap = STATIC_ROUTES.map(r => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.freq,
    priority: r.priority,
  }));
  const articleMap: MetadataRoute.Sitemap = articles.map(a => ({
    url: `${BASE_URL}${ARTICLE_PATH}/${a.id}`,
    lastModified: a.createdAt || a.publishedAt ? new Date(a.createdAt || a.publishedAt!) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...staticMap, ...articleMap];
}
