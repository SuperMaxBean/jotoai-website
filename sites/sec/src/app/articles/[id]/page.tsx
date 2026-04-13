export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt: string;
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await fetch("http://localhost:3004/api/sec/articles/" + id, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.article || data;
  } catch { return null; }
}

async function getRelated(id: string): Promise<Article[]> {
  try {
    const res = await fetch("http://localhost:3004/api/sec/articles", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const all = Array.isArray(data) ? data : (data.articles || []);
    return all.filter((a: Article) => String(a.id) !== String(id)).slice(0, 3);
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: "文章不存在 | 唯客 AI 护栏" };
  return { title: article.title + " | 唯客 AI 护栏", description: article.content.replace(/<[^>]+>/g, "").trim().slice(0, 160) };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, related] = await Promise.all([getArticle(id), getRelated(id)]);
  if (!article) notFound();
  const readTime = Math.max(3, Math.round(article.content.replace(/<[^>]+>/g, "").length / 300));
  const imgSrc = (article.imageUrl && article.imageUrl.startsWith("http")) ? article.imageUrl : "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop";
  const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; }};

  return (
    <div className="bg-brand-dark min-h-screen">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img src={imgSrc} alt={article.title} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {article.keyword && <span className="inline-block bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-4">{article.keyword}</span>}
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">{article.title}</h1>
            <div className="flex gap-4 text-slate-400 text-sm flex-wrap">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{fmt(article.createdAt)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />约 {readTime} 分钟阅读</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link href="/articles" className="inline-flex items-center text-slate-500 hover:text-brand-blue text-sm transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1.5" />返回文章列表
        </Link>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="flex-1 min-w-0">
            <div className="prose prose-invert prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            <div className="mt-12 pt-8 border-t border-white/10 flex gap-2 flex-wrap items-center">
              <Tag className="h-4 w-4 text-slate-500" />
              {article.keyword && <span className="text-xs text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 rounded-full">{article.keyword}</span>}
            </div>
          </article>
          {related.length > 0 && (
            <aside className="lg:w-60 shrink-0 hidden lg:block">
              <div className="sticky top-24 bg-white/5 rounded-2xl p-5 border border-white/10">
                <h4 className="font-bold text-white mb-4 text-sm">相关文章</h4>
                {related.map(r => (
                  <Link key={r.id} href={"/articles/" + r.id} className="block group mb-4">
                    <p className="text-sm text-slate-400 group-hover:text-brand-blue line-clamp-2 leading-snug">{r.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{fmt(r.createdAt)}</p>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
