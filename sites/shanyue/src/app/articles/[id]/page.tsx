export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import CTA from "@/components/CTA";

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
    const res = await fetch("http://localhost:3004/api/shanyue/articles/" + id, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.article || data;
  } catch { return null; }
}

async function getRelated(id: string): Promise<Article[]> {
  try {
    const res = await fetch("http://localhost:3004/api/shanyue/articles", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const all = Array.isArray(data) ? data : (data.articles || []);
    return all.filter((a: Article) => String(a.id) !== String(id)).slice(0, 3);
  } catch { return []; }
}

export async function generateStaticParams() { return []; }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: "文章不存在 - 闪阅 AI" };
  const excerpt = article.content.replace(/<[^>]+>/g, "").trim().slice(0, 160);
  return {
    title: article.title + " - 闪阅 AI",
    description: excerpt,
    keywords: article.keyword ? [article.keyword, "智能阅卷", "AI教育"] : ["智能阅卷", "AI教育"],
    alternates: { canonical: `https://shanyue.jotoai.com/articles/${article.id}` },
    openGraph: {
      title: article.title,
      description: excerpt,
      url: `https://shanyue.jotoai.com/articles/${article.id}`,
      type: "article",
      publishedTime: article.createdAt,
      images: article.imageUrl ? [{ url: article.imageUrl.startsWith("http") ? article.imageUrl : `https://shanyue.jotoai.com${article.imageUrl}` }] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article, related] = await Promise.all([getArticle(id), getRelated(id)]);
  if (!article) notFound();

  const readTime = Math.max(3, Math.round(article.content.replace(/<[^>]+>/g, "").length / 300));
  const imgSrc = (article.imageUrl && article.imageUrl.startsWith("http")) ? article.imageUrl : "";
  const fmt = (d: string) => { try { return new Date(d).toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }); } catch { return d; }};

  return (
    <div className="pt-24 pb-24 bg-[#fcfcfc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/articles" className="inline-flex items-center gap-2 text-slate-500 hover:text-[#7c3aed] font-semibold mb-8 transition-colors text-sm">
          <ArrowLeft size={16} /> 返回列表
        </Link>

        <article className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="aspect-video relative">
            {imgSrc ? (
              <img src={imgSrc} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white/20 text-8xl font-extrabold">{article.keyword?.charAt(0) || "智"}</span>
              </div>
            )}
            {article.keyword && (
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-[#7c3aed] uppercase tracking-widest shadow-md">
                {article.keyword}
              </div>
            )}
          </div>

          <div className="p-8 md:p-16">
            <div className="flex items-center gap-6 text-sm text-slate-400 mb-8 flex-wrap">
              <span className="flex items-center gap-2"><Calendar size={16} /> {fmt(article.createdAt)}</span>
              <span className="flex items-center gap-2"><Clock size={16} /> 约 {readTime} 分钟阅读</span>
              {article.keyword && <span className="flex items-center gap-2"><Tag size={16} /> {article.keyword}</span>}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A1A2F] mb-10 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {related.length > 0 && (
              <div className="mt-16 pt-10 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">相关文章</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map(r => (
                    <Link key={r.id} href={"/articles/" + r.id} className="bg-slate-50 rounded-xl p-4 hover:bg-purple-50 transition-colors">
                      <p className="font-medium text-slate-800 text-sm line-clamp-2">{r.title}</p>
                      <p className="text-xs text-slate-400 mt-1">{fmt(r.createdAt)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
      <CTA />
    </div>
  );
}
