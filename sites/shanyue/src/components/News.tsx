"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const NEWS_GRADIENTS = [
  "from-purple-500 to-indigo-600",
  "from-blue-500 to-cyan-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-pink-600",
  "from-cyan-500 to-blue-600",
];

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt: string;
}

function getExcerpt(html: string, max = 100) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, max) + "...";
}

function resolveImageUrl(url?: string): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return "https://admin.jotoai.com" + url;
}

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang, t } = useLanguage();

  function formatDate(d: string) {
    try {
      return new Date(d).toLocaleDateString(
        lang === 'zh' ? 'zh-CN' : 'en-US',
        { year: "numeric", month: "long", day: "numeric" }
      );
    } catch {
      return d;
    }
  }

  useEffect(() => {
    fetch("/api/shanyue/articles")
      .then(r => r.json())
      .then(d => { setArticles(d.articles || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-24 bg-[#fcfcfc]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </section>
  );

  if (articles.length === 0) return null;

  return (
    <section className="py-24 bg-[#fcfcfc]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Newspaper size={16} /> {t('最新动态', 'Latest Updates')}
          </div>
          <h2 className="text-4xl font-extrabold text-[#0A1A2F] mb-4">{t('产品更新与行业洞察', 'Product Updates & Industry Insights')}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{t('深入了解闪阅 AI 在智能阅卷、教育数字化领域的最新进展。', 'Explore the latest developments of iMark in smart grading and digital education.')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => {
            const resolvedImg = resolveImageUrl(article.imageUrl);
            return (
            <Link key={article.id} href={"/articles/" + article.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-video relative overflow-hidden">
                {resolvedImg ? (
                  <img src={resolvedImg} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className={"w-full h-full bg-gradient-to-br " + NEWS_GRADIENTS[i % NEWS_GRADIENTS.length] + " flex items-center justify-center"}>
                    <span className="text-white/20 text-8xl font-extrabold">{article.keyword?.charAt(0) || t("智", "A")}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                {article.keyword && (
                  <span className="inline-block text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-3">{article.keyword}</span>
                )}
                <h3 className="text-lg font-bold text-[#0A1A2F] mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">{article.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{getExcerpt(article.content)}</p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(article.createdAt)}</span>
                  <span className="flex items-center gap-1 text-purple-600 font-semibold group-hover:gap-2 transition-all">{t('阅读全文', 'Read More')} <ArrowRight size={12} /></span>
                </div>
              </div>
            </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
