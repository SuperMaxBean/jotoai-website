'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Calendar, ArrowRight, Mail, Loader2, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = '/api';

interface Article {
  id: number | string;
  slug: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  image: string;
}

// 将后端文章格式标准化
function normalizeArticle(raw: any): Article {
  return {
    id: raw.id ?? raw._id ?? '',
    slug: raw.slug ?? String(raw.id ?? raw._id ?? ''),
    category: raw.category ?? raw.tags?.[0] ?? '行业趋势',
    date: raw.date ?? raw.publishedAt ?? raw.createdAt
      ? new Date(raw.date ?? raw.publishedAt ?? raw.createdAt).toLocaleDateString('zh-CN').replace(/\//g, '/')
      : '',
    title: raw.title ?? '',
    summary: raw.summary ?? raw.excerpt ?? raw.description ?? '',
    image: raw.image ?? raw.imageUrl ?? raw.coverImage ?? raw.thumbnail ?? `/blog/${raw.id}.jpg`,
  };
}

const PAGE_SIZE = 6;

export default function BlogPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');

  const CATEGORY_NAMES = [
    t('行业趋势', 'Industry Trends'),
    t('AI 技术', 'AI Technology'),
    t('设计灵感', 'Design Inspiration'),
    t('品牌案例', 'Brand Cases'),
    t('产品动态', 'Product Updates'),
  ];

  const FALLBACK_POSTS: Article[] = [
    {
      id: 1,
      slug: '1',
      category: t('行业趋势', 'Industry Trends'),
      date: '2026/03/08',
      title: t('2026 春夏时尚趋势报告：AI 如何预测下一个爆款？', '2026 Spring/Summer Fashion Trend Report: How AI Predicts the Next Hit'),
      summary: t('通过分析全球社交媒体数据与电商销售趋势，FasiumAI 的趋势引擎为品牌揭示了未来一季的核心色彩与廓形方向。', 'By analyzing global social media data and e-commerce sales trends, FasiumAI\'s trend engine reveals next season\'s key colors and silhouette directions for brands.'),
      image: '/blog/1.jpg',
    },
    {
      id: 2,
      slug: '2',
      category: t('AI 技术', 'AI Technology'),
      date: '2026/03/05',
      title: t('从草图到 3D 建模：FasiumAI 核心生成算法深度解析', 'From Sketch to 3D Modeling: A Deep Dive into FasiumAI\'s Core Generation Algorithm'),
      summary: t('深入了解我们如何利用扩散模型与几何约束，将设计师的简单草图转化为具备生产可行性的高保真三视图。', 'Learn how we use diffusion models and geometric constraints to transform simple designer sketches into production-ready high-fidelity three-view drawings.'),
      image: '/blog/2.jpg',
    },
    {
      id: 3,
      slug: '3',
      category: t('品牌案例', 'Brand Cases'),
      date: '2026/03/01',
      title: t('某知名快时尚品牌如何利用 AI 将设计周期缩短 70%', 'How a Leading Fast Fashion Brand Used AI to Cut Design Cycles by 70%'),
      summary: t('在该品牌的数字化转型过程中，FasiumAI 帮助其设计团队实现了从灵感搜集到版单输出的全流程自动化。', 'During the brand\'s digital transformation, FasiumAI helped its design team achieve full-process automation from inspiration collection to spec sheet output.'),
      image: '/blog/3.jpg',
    },
    {
      id: 4,
      slug: '4',
      category: t('设计灵感', 'Design Inspiration'),
      date: '2026/02/25',
      title: t('打破创意瓶颈：5 个利用 AI 激发服装设计灵感的小技巧', 'Breaking Creative Blocks: 5 Tips for Using AI to Spark Fashion Design Inspiration'),
      summary: t('当设计师面临创作枯竭时，AI 不仅仅是工具，更是能够提供无限可能性的创意伙伴。本文将分享实用的提示词技巧。', 'When designers face creative exhaustion, AI is not just a tool but a creative partner offering unlimited possibilities. This article shares practical prompt techniques.'),
      image: '/blog/4.jpg',
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`${API_BASE}/articles`);
        if (!res.ok) throw new Error('API 请求失败');
        const data = await res.json();
        const list: Article[] = Array.isArray(data)
          ? data.map(normalizeArticle)
          : Array.isArray(data.articles)
          ? data.articles.map(normalizeArticle)
          : FALLBACK_POSTS;
        setPosts(list.length > 0 ? list : FALLBACK_POSTS);
      } catch {
        setIsError(true);
        setPosts(FALLBACK_POSTS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // 计算每个分类的文章数量（基于实际文章）
  const categoryCounts = CATEGORY_NAMES.reduce<Record<string, number>>((acc, name) => {
    acc[name] = posts.filter(p => p.category === name).length;
    return acc;
  }, {});

  // 过滤：先按分类，再按搜索词
  const filteredPosts = posts.filter(p => {
    const matchCategory = selectedCategory ? p.category === selectedCategory : true;
    const matchSearch = searchQuery.trim()
      ? p.title.includes(searchQuery) || p.summary.includes(searchQuery)
      : true;
    return matchCategory && matchSearch;
  });

  // 分页
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const pagedPosts = filteredPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(prev => prev === name ? null : name);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center border-b border-[#2a2a2a]">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1 rounded-full border border-gray-600 text-white text-xs font-medium uppercase tracking-widest mb-6">
              BLOG
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('探索 AI 时尚设计的最新动态', 'Explore the Latest in AI Fashion Design')}
            </h1>
            <p className="text-xl text-[#9ca3af] max-w-2xl mx-auto">
              {t('深入了解 AI 时尚趋势、行业案例与设计创新深度洞察。', 'In-depth insights into AI fashion trends, industry cases, and design innovation.')}
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

            {/* Sidebar */}
            <aside className="w-full lg:w-[260px] space-y-8 shrink-0">
              {/* Search Module */}
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
                <h3 className="text-white font-bold mb-4">{t('搜索动态', 'Search')}</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder={t('输入关键词搜索...', 'Search articles...')}
                    className="w-full bg-[#111111] border border-[#333] rounded-lg pl-10 pr-4 py-2 text-sm focus:border-[#f97316] outline-none transition-all placeholder-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Categories Module */}
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
                <h3 className="text-white font-bold mb-4">{t('文章分类', 'Categories')}</h3>
                <ul className="space-y-2">
                  {CATEGORY_NAMES.map((name) => {
                    const count = categoryCounts[name] ?? 0;
                    const isActive = selectedCategory === name;
                    return (
                      <li
                        key={name}
                        onClick={() => handleCategoryClick(name)}
                        className={`group cursor-pointer flex items-center justify-between text-sm rounded-lg px-3 py-2 transition-all ${
                          isActive
                            ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30'
                            : 'text-[#9ca3af] hover:text-[#f97316] hover:bg-[#f97316]/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-[#f97316] transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`} />
                          <span className="font-medium">{name}</span>
                        </div>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-[#f97316]/20 text-[#f97316]' : 'text-gray-600'}`}>
                          {count}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {selectedCategory && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-[#f97316] transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t('清除筛选', 'Clear filter')}
                  </button>
                )}
              </div>

              {/* Newsletter Module */}
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
                <h3 className="text-white font-bold mb-2">{t('订阅我们', 'Subscribe')}</h3>
                <p className="text-xs text-[#9ca3af] mb-4">{t('获取最新 AI 时尚资讯', 'Get the latest AI fashion insights')}</p>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t('您的邮箱地址', 'Enter your email')}
                    className="w-full bg-[#111111] border border-[#333] rounded-lg px-4 py-2 text-sm focus:border-[#f97316] outline-none transition-all placeholder-gray-600 text-white"
                  />
                  <button className="w-full bg-[#f97316] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#f97316]/90 transition-all flex items-center justify-center gap-2">
                    {t('立即订阅', 'Subscribe')}
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Article List Area */}
            <div className="flex-1">
              {/* Active filter indicator */}
              {(selectedCategory || searchQuery) && !isLoading && (
                <div className="mb-6 flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-400">{t('筛选：', 'Filters:')}</span>
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 bg-[#f97316]/15 border border-[#f97316]/30 text-[#f97316] text-xs font-bold px-3 py-1.5 rounded-full">
                      {selectedCategory}
                      <button onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1.5 bg-[#2a2a2a] border border-[#333] text-gray-300 text-xs px-3 py-1.5 rounded-full">
                      "{searchQuery}"
                      <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <span className="text-xs text-gray-500">{t(`共 ${filteredPosts.length} 篇`, `${filteredPosts.length} articles`)}</span>
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 text-[#f97316] animate-spin" />
                </div>
              )}

              {/* Error (using fallback data) */}
              {isError && !isLoading && (
                <div className="flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 mb-6">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{t('暂时无法连接服务器，显示示例内容', 'Unable to connect to server, showing sample content')}</span>
                </div>
              )}

              {/* No results */}
              {!isLoading && pagedPosts.length === 0 && (
                <div className="text-center py-20 text-[#9ca3af]">
                  <p className="text-lg">{t('未找到相关文章', 'No matching articles found')}</p>
                  <button onClick={clearFilters} className="mt-4 text-[#f97316] text-sm hover:underline">
                    {t('清除所有筛选', 'Clear all filters')}
                  </button>
                </div>
              )}

              {/* Article Grid */}
              {!isLoading && pagedPosts.length > 0 && (
                <div className="grid md:grid-cols-2 gap-8">
                  {pagedPosts.map((post) => (
                    <article key={post.id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden group hover:border-[#f97316]/30 transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          onClick={(e) => { e.preventDefault(); handleCategoryClick(post.category); }}
                          className="absolute top-4 left-4 bg-[#f97316] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider cursor-pointer hover:bg-[#f97316]/80 transition-colors"
                        >
                          {post.category}
                        </span>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-[#f97316] transition-colors">
                            {post.title}
                          </h2>
                        </Link>
                        <p className="text-sm text-[#9ca3af] leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                        <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#f97316] hover:underline">
                          {t('阅读全文', 'Read more')}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-[#9ca3af] hover:text-white hover:border-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('上一页', 'Previous')}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                        currentPage === page
                          ? 'bg-[#f97316] text-white'
                          : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-sm text-[#9ca3af] hover:text-white hover:border-gray-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('下一页', 'Next')}
                  </button>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
