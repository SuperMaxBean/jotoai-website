'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, ArrowRight, Mail, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string | number;
  title: string;
  content: string;
  imageUrl?: string;
  keyword?: string;
  createdAt?: string;
  category?: string;
  excerpt?: string;
}

const POSTS_PER_PAGE = 6;

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch('/api/audit/articles')
      .then(r => r.json())
      .then(d => {
        setArticles(d.articles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    articles.filter(p =>
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.keyword || '').toLowerCase().includes(searchQuery.toLowerCase())
    ), [articles, searchQuery]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const current = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-white py-16 border-b border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">BLOG</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">最新行业动态</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">深入了解 AI 合同审查技术趋势、行业案例与法律风控深度洞察。</p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-3">搜索文章</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="关键词搜索..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {articles.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-base font-bold text-slate-900 mb-3">热门关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(articles.map(a => a.keyword).filter(Boolean))].slice(0, 12).map(kw => (
                    <button key={kw} onClick={() => { setSearchQuery(kw!); setCurrentPage(1); }}
                      className="text-xs px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-full transition-colors">
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
              <div className="bg-white/10 p-2.5 rounded-xl w-fit mb-4"><Mail className="h-5 w-5" /></div>
              <h3 className="font-bold text-lg mb-1">订阅行业动态</h3>
              <p className="text-blue-100 text-xs mb-4 leading-relaxed">每周获取最新的法律科技资讯，不错过行业风向。</p>
              <Link href="/contact"
                className="block w-full bg-white text-blue-600 text-sm font-bold py-2 rounded-xl text-center hover:bg-blue-50 transition-colors">
                立即订阅 →
              </Link>
            </div>
          </aside>

          {/* Articles */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-48 bg-slate-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-100 rounded w-full"></div>
                      <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : current.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>{searchQuery ? '未找到相关文章' : '暂无文章'}</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={currentPage + searchQuery}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {current.map((post, i) => {
                    const excerpt = stripHtml(post.content).slice(0, 120) + '…';
                    const imgSrc = post.imageUrl || `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop`;
                    return (
                      <motion.article key={post.id}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          <img src={imgSrc} alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop`; }}
                          />
                          {post.keyword && (
                            <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                              {post.keyword}
                            </span>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center text-slate-400 text-xs mb-3">
                            <Calendar className="h-3 w-3 mr-1.5" />{formatDate(post.createdAt)}
                          </div>
                          <h2 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                            <Link href={`/blog/${post.id}`}>{post.title}</Link>
                          </h2>
                          <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed">{excerpt}</p>
                          <Link href={`/blog/${post.id}`}
                            className="inline-flex items-center text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                            阅读全文 <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Link>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-30">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
