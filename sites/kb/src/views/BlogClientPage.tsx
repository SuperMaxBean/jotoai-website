'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Search, BookOpen, Calendar, User, Layers } from 'lucide-react';
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
}

interface Props {
  articles: Article[];
}

const getExcerpt = (content: string, maxLen = 120) => {
  const text = content.replace(/<[^>]+>/g, '').replace(/[#*_\n]/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
};

export default function BlogClientPage({ articles }: Props) {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const filteredArticles = searchTerm
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (a.keyword && a.keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : articles;

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Blog Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">{t('唯客企业知识中台', 'Enterprise Knowledge Hub')}</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('搜索文章...', 'Search articles...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
              {t('登录', 'Login')}
            </Link>
            <button
              onClick={() => router.push('/#contact')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-sm"
            >
              {t('预约15分钟演示', 'Book a 15-min Demo')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 bg-slate-50">
        <div className="px-6 mx-auto max-w-7xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6"
          >
            {t('唯客知识库与 AI 洞察', 'Knowledge Base & AI Insights')}
          </motion.h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {t('探索企业知识管理的未来，了解我们如何通过 AI 驱动组织的决策与创新。', 'Explore the future of enterprise knowledge management and how we drive organizational decisions and innovation through AI.')}
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 px-6 mx-auto max-w-7xl">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">{searchTerm ? t('没有找到匹配的文章', 'No matching articles found') : t('暂无文章', 'No articles yet')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${article.id}`}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] mb-6 border border-slate-100 shadow-sm transition-all group-hover:shadow-xl group-hover:shadow-indigo-50">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-indigo-300" />
                      </div>
                    )}
                    {article.keyword && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20">
                          {article.keyword}
                        </span>
                      </div>
                    )}
                  </div>
                  {article.imageSource === 'unsplash' && article.imageAuthor && (
                    <p className="text-[10px] text-slate-400 -mt-4 mb-4 pl-1">
                      Photo by <span className="underline">{article.imageAuthor}</span> on Unsplash
                    </p>
                  )}
                  <h2 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {getExcerpt(article.content)}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">{formatDate(article.createdAt)}</div>
                      </div>
                    </div>
                    <div className="text-indigo-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {t('阅读更多', 'Read More')} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="px-6 mx-auto max-w-4xl text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-bold mb-6">{t('订阅我们的知识简报', 'Subscribe to Our Newsletter')}</h2>
          <p className="text-indigo-100 mb-10">
            {t('每周获取最新的企业 AI 落地案例、技术深度解析和行业趋势。', 'Get weekly enterprise AI case studies, technical deep dives, and industry trends.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('您的企业邮箱', 'Your business email')}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            />
            <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all active:scale-95">
              {t('立即订阅', 'Subscribe Now')}
            </button>
          </div>
        </div>
      </section>

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
                <li><a href="#" className="hover:text-white transition-colors">{t('更新日志', 'Changelog')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('技术路线图', 'Roadmap')}</a></li>
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
                <li><a href="#" className="hover:text-white transition-colors">{t('合作伙伴', 'Partners')}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t('加入我们', 'Join Us')}</a></li>
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
