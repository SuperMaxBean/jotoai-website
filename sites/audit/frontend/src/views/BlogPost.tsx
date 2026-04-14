'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowLeft, Share2, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface Article {
  id: string | number;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt?: string;
  excerpt?: string;
}

function formatDate(dateStr?: string, lang?: string) {
  if (!dateStr) return '';
  if (lang === 'en') {
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]+>/g, '').length;
  return Math.max(3, Math.round(words / 300));
}

export default function BlogPost() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/audit/articles/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        setArticle(d.article);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });

    // Fetch related articles
    fetch('/api/audit/articles')
      .then(r => r.json())
      .then(d => setRelated((d.articles || []).filter((a: Article) => String(a.id) !== String(id)).slice(0, 3)));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm">{t('加载中...', 'Loading...')}</p>
      </div>
    </div>
  );

  if (notFound || !article) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('文章未找到', 'Article Not Found')}</h1>
        <p className="text-slate-500 mb-6">{t('抱歉，该文章可能已被移动或删除。', 'Sorry, this article may have been moved or deleted.')}</p>
        <Link href="/blog" className="inline-flex items-center text-blue-600 font-semibold hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />{t('返回博客列表', 'Back to Blog')}
        </Link>
      </div>
    </div>
  );

  const imgSrc = article.imageUrl?.startsWith('/')
    ? article.imageUrl
    : (article.imageUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop');
  const readTime = estimateReadTime(article.content);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative h-72 md:h-[420px] overflow-hidden bg-slate-900">
        <motion.img
          initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.2 }}
          src={imgSrc} alt={article.title}
          className="w-full h-full object-cover opacity-60"
          onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto">
            {article.keyword && (
              <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                {article.keyword}
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(article.createdAt, lang)}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{t(`约 ${readTime} 分钟阅读`, `${readTime} min read`)}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <Link href="/blog" className="inline-flex items-center text-slate-500 hover:text-blue-600 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1.5" />{t('返回博客列表', 'Back to Blog')}
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Article Body */}
          <motion.article
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex-1 min-w-0">
            <div
              className="
                article-content
                text-slate-700 leading-relaxed
              "
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags & Share */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-slate-400" />
                {article.keyword && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{article.keyword}</span>
                )}
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{t('AI 科技', 'AI Tech')}</span>
              </div>
              <button
                onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 border border-slate-200 px-4 py-2 rounded-xl transition-colors">
                <Share2 className="h-4 w-4" />{t('分享文章', 'Share Article')}
              </button>
            </div>
          </motion.article>

          {/* Sidebar */}
          <aside className="lg:w-60 shrink-0 hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {related.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4 text-sm">{t('相关文章', 'Related Articles')}</h4>
                  <div className="space-y-4">
                    {related.map(r => (
                      <Link key={r.id} href={`/blog/${r.id}`}
                        className="block group">
                        <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 line-clamp-2 transition-colors leading-snug">
                          {r.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(r.createdAt, lang)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-blue-600 rounded-2xl p-5 text-white text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-80" />
                <h4 className="font-bold mb-2 text-sm">{t('预约产品演示', 'Book Product Demo')}</h4>
                <p className="text-blue-100 text-xs mb-4 leading-relaxed">{t('了解唯客智审如何助力您的企业合规升级', 'Learn how Avaca AI Audit can help upgrade your enterprise compliance')}</p>
                <Link href="/contact"
                  className="block bg-white text-blue-600 text-sm font-bold py-2 rounded-xl hover:bg-blue-50 transition-colors">
                  {t('立即预约', 'Book Now')}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Articles Mobile */}
      {related.length > 0 && (
        <div className="lg:hidden border-t border-slate-100 py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-bold text-slate-900 mb-4">{t('相关文章', 'Related Articles')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/blog/${r.id}`}
                  className="bg-slate-50 rounded-xl p-4 hover:bg-blue-50 transition-colors">
                  <p className="font-medium text-slate-800 text-sm line-clamp-2">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(r.createdAt, lang)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
