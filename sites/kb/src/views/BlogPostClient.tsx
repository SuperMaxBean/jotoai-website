'use client';

import React from 'react';
import { ArrowLeft, Calendar, User, Layers, Share2, MessageSquare, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';

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

// 文章 content 在后端已统一转为 HTML（marked 解析 + 文档级标签剥离），
// 前端只负责剥掉 LLM 偶尔遗漏的 <html>/<body> 壳后渲染。
const renderContent = (content: string) => {
  if (!content) return '';
  return content
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<\/?body[^>]*>/gi, '')
    .trim();
};

export default function BlogPostClient({ article }: { article: Article }) {
  const router = useRouter();
  const { lang, t } = useLanguage();

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <Link href="/blog" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tight">{t('返回博客列表', 'Back to Blog')}</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">{t('唯客企业知识中台', 'Enterprise Knowledge Hub')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => router.push('/#contact')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-sm"
            >
              {t('预约15分钟演示', 'Book a 15-min Demo')}
            </button>
          </div>
        </div>
      </nav>

      {/* Post Header */}
      <header className="py-20 bg-slate-50">
        <div className="px-6 mx-auto max-w-4xl text-center">
          {article.keyword && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-6">
              {article.keyword}
            </div>
          )}
          <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-bold text-slate-900">{t('唯客团队', 'JOTO Team')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Post Image */}
      <div className="px-6 mx-auto max-w-6xl -mt-10">
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-indigo-300" />
            </div>
          )}
        </div>
        {article.imageSource === 'unsplash' && article.imageAuthor && (
          <p className="text-center text-xs text-slate-400 mt-3">
            Photo by{' '}
            <a href={article.imageAuthorUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
              {article.imageAuthor}
            </a>{' '}
            on{' '}
            <a href={article.imageUnsplashUrl || 'https://unsplash.com'} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
              Unsplash
            </a>
          </p>
        )}
      </div>

      {/* Post Content — 全文在 HTML 中，爬虫完整可读 */}
      <article className="py-20 px-6 mx-auto max-w-3xl">
        <div
          className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderContent(article.content) }}
        />
        <div className="mt-20 pt-10 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900">{t('唯客团队', 'JOTO Team')}</div>
              <div className="text-xs text-slate-400">{t('唯客企业知识中台官方团队', 'Official Enterprise Knowledge Hub Team')}</div>
            </div>
          </div>
          <button
            onClick={() => router.push('/#contact')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            {t('联系我们', 'Contact Us')}
          </button>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-[#0a0f1c] text-slate-300 py-20 px-6 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{t('唯客企业知识中台', 'Enterprise Knowledge Hub')}</h3>
                <p className="text-sm text-slate-500">{t('唯客旗下产品', 'A JOTO Product')}</p>
              </div>
              <div className="space-y-3 text-sm pt-4">
                <p className="text-slate-400">{t('中国首家 Dify 官方服务商', "China's First Official Dify Service Provider")}</p>
                <p className="text-slate-400">jotoai@jototech.cn</p>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t('产品文档', 'Documentation')}</h4>
              <ul className="space-y-4 text-sm">
                <li><Link href="/#capabilities" className="hover:text-white transition-colors">{t('产品功能', 'Features')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t('产品目录', 'Products')}</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">{t('闪阅', 'ShanYue')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Dify</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('AI 安全', 'AI Security')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">{t('关于我们', 'About Us')}</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="https://jotoai.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t('关于唯客', 'About JOTO')}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/10 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>{t('上海聚托信息科技有限公司', 'Shanghai Jutuo Information Technology Co., Ltd.')} © 2026</p>
            <p>沪ICP备15056478号-5</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
