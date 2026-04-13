'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, User, ArrowRight, Zap } from 'lucide-react';
import { apiService } from '@/services/api';
import type { Article } from '@/types/api';

const BlogPage: React.FC = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await apiService.getArticles();
        setArticles(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : '获取文章失败';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getExcerpt = (content: string, maxLen = 120) => {
    if (!content) return '';
    const lines = content.split('\n');
    const bodyLines = lines.filter(line => !line.trim().startsWith('#'));
    const bodyText = bodyLines.join(' ');
    const plain = bodyText
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^>\s+/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    return plain.length > maxLen ? plain.slice(0, maxLen) + '...' : plain;
  };

  const cleanTitle = (title: string) => {
    if (!title) return '';
    return title
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/^#+\s+/, '')
      .trim();
  };

  const getImageUrl = (article: Article) => {
    if (article.imageUrl) {
      return article.imageUrl;
    }
    return '/blog-placeholder.svg';
  };

  return (
    <div className="bg-brand-dark min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold mb-4">
            <Zap size={14} className="animate-pulse" />
            <span>AI 实时生成中...</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">新闻与博客</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            我们的 AI 正在实时为您整理最新的 LLM 安全技术动态。
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-20">
            <div className="inline-block w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>正在加载文章...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 py-20">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            <p>暂无文章</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {articles.map((article, i) => (
              <article
                key={article.id || i}
                className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden hover:border-brand-blue/50 transition-all hover:shadow-[0_0_30px_rgba(46,124,246,0.1)] group cursor-pointer flex flex-col h-full"
                onClick={() => article.id && router.push(`/articles/${article.id}`)}
              >
                {/* Image Section */}
                <div className="h-56 overflow-hidden relative">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/blog-placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-brand-dark/90 backdrop-blur-md rounded-full text-brand-green text-xs font-medium border border-white/10">
                      {article.keyword || article.type || 'AI 安全'}
                    </span>
                  </div>
                </div>
                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(article.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      唯客安全实验室
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-4 group-hover:text-brand-blue transition-colors leading-snug line-clamp-2 min-h-[3.5rem]">
                    {cleanTitle(article.title)}
                  </h2>

                  <div className="text-gray-400 mb-6 leading-relaxed text-sm flex-grow min-h-[4.5rem] line-clamp-3">
                    {getExcerpt(article.content, 120)}
                  </div>

                  <div className="flex items-center text-brand-blue font-semibold group-hover:translate-x-2 transition-transform mt-auto pt-4 border-t border-white/5">
                    阅读全文 <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
