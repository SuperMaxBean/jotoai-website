'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, Tag, ChevronLeft, Share2, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = typeof window !== 'undefined' ? '/api' : 'http://localhost:3004/api';

interface Article {
  id: number | string;
  slug: string;
  category: string;
  date: string;
  author: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  tags?: string[];
}

function normalizeArticle(raw: any): Article {
  return {
    id: raw.id ?? raw._id ?? '',
    slug: raw.slug ?? String(raw.id ?? raw._id ?? ''),
    category: raw.category ?? raw.tags?.[0] ?? '行业趋势',
    date: raw.date ?? (raw.publishedAt ?? raw.createdAt)
      ? new Date(raw.date ?? raw.publishedAt ?? raw.createdAt).toLocaleDateString('zh-CN')
      : '',
    author: raw.author ?? raw.authorName ?? 'FasiumAI 研究员',
    title: raw.title ?? '',
    summary: raw.summary ?? raw.excerpt ?? raw.description ?? '',
    content: raw.content ?? raw.body ?? raw.htmlContent ?? '',
    image: raw.image ?? raw.imageUrl ?? raw.coverImage ?? raw.thumbnail ?? `/blog/${raw.id}.jpg`,
    tags: raw.tags ?? ['时尚科技', 'AI设计', '趋势预测'],
  };
}

/**
 * 后端 /api/{site}/articles 已用 marked 把 content 转成 HTML。
 * 前端只剥掉偶尔残留的 <html>/<body>/<head> 壳，然后直接渲染。
 */
function renderArticleHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<\/?body[^>]*>/gi, '')
    .trim();
}

const FALLBACK_POST: Article = {
  id: '1', slug: '1', category: '行业趋势', date: '2026/03/08',
  author: 'FasiumAI 研究员',
  title: '2026 春夏时尚趋势报告：AI 如何预测下一个爆款？',
  summary: '通过分析全球社交媒体数据与电商销售趋势，FasiumAI 的趋势引擎为品牌揭示了未来一季的核心色彩与廓形方向。',
  image: '/blog/1.jpg',
  content: `<p>在瞬息万变的时尚行业，预测趋势一直是一门结合了艺术与科学的复杂学科。传统上，趋势预测依赖于资深买手和分析师的直觉，以及对秀场和街拍的长期观察。然而，随着大数据和人工智能技术的成熟，这一过程正在经历一场革命。</p><h2>数据驱动的洞察</h2><p>FasiumAI 的趋势引擎不仅仅是抓取图片，它在深度学习的基础上，能够识别颜色比例、面料纹理、廓形变化以及细节元素。通过分析全球数百万条社交媒体动态、主流电商平台的实时销量以及各大时装周的数字信号，AI 可以比人类更早地发现正在萌芽的微趋势。</p><h2>从预测到设计</h2><p>预测只是第一步。FasiumAI 的核心优势在于将这些洞察直接转化为可编辑的设计资产。设计师不再需要花费数周时间整理参考图，AI 已经提前完成了这项工作。</p><h2>结论</h2><p>AI 并不是要取代设计师的审美，而是为创意提供一个坚实的数据底座。在 2026 年春夏，我们预计可持续面料与未来主义廓形的结合将成为主流。</p>`,
  tags: ['时尚科技', 'AI设计', '趋势预测'],
};

const FALLBACK_RELATED: Article[] = [
  {
    id: '3', slug: '3', category: '品牌案例', date: '2026/03/01', author: 'FasiumAI',
    title: '某知名快时尚品牌如何利用 AI 将设计周期缩短 70%',
    summary: '', content: '', image: '/blog/3.jpg',
  },
  {
    id: '4', slug: '4', category: '设计灵感', date: '2026/02/25', author: 'FasiumAI',
    title: '打破创意瓶颈：5 个利用 AI 激发服装设计灵感的小技巧',
    summary: '', content: '', image: '/blog/4.jpg',
  },
];

export default function BlogPostPage() {
  const { t } = useLanguage();
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/blog/')[1] || '' : '';
  const [post, setPost] = useState<Article | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(`${API_BASE}/fasium/articles/${id}`);
        if (!res.ok) throw new Error('文章不存在');
        const data = await res.json();
        const article = normalizeArticle(data.article ?? data);
        setPost(article);

        try {
          const allRes = await fetch(`${API_BASE}/fasium/articles`);
          if (allRes.ok) {
            const allData = await allRes.json();
            const allList: Article[] = (Array.isArray(allData) ? allData : allData.articles ?? [])
              .map(normalizeArticle)
              .filter((a: Article) => String(a.slug) !== String(id));
            setRelatedPosts(allList.slice(0, 2));
          } else {
            setRelatedPosts(FALLBACK_RELATED.filter(r => String(r.slug) !== String(id)));
          }
        } catch {
          setRelatedPosts(FALLBACK_RELATED.filter(r => String(r.slug) !== String(id)));
        }
      } catch {
        setIsError(true);
        setPost(FALLBACK_POST);
        setRelatedPosts(FALLBACK_RELATED);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('链接已复制到剪贴板', 'Link copied to clipboard'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#f97316] animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const htmlContent = renderArticleHtml(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.image],
    datePublished: post.date.replace(/\//g, '-'),
    author: [{ '@type': 'Person', name: post.author, url: 'https://fasium.jotoai.com' }],
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">      <Navbar />

      <main className="pt-20">
        {isError && (
          <div className="max-w-4xl mx-auto px-6 pt-6">
            <div className="flex items-center gap-2 text-sm text-yellow-500/80 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t('暂时无法连接服务器，显示示例内容', 'Unable to connect to server, showing sample content')}</span>
            </div>
          </div>
        )}

        {/* Article Header Hero */}
        <section className="relative h-[50vh] min-h-[400px] flex items-end">
          <div className="absolute inset-0 z-0">
            <img src={post.image} alt={post.title}
              className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12 w-full">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#f97316] mb-6 hover:underline group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('返回博客列表', 'Back to Blog')}
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-[#f97316] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" /><span>{post.date}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-white/10">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{post.author}</p>
                <p className="text-xs text-gray-500">{t('FasiumAI 研究员', 'FasiumAI Researcher')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">

            {/* Article Body —— 用 prose-invert 适配深色底 #0f0f0f，orange-500 作为链接/标题的强调色 */}
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white
                prose-h2:border-l-4 prose-h2:border-[#f97316] prose-h2:pl-4 prose-h2:mt-12 prose-h2:text-2xl
                prose-h3:text-[#f97316] prose-h3:mt-8 prose-h3:text-xl
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-strong:text-white
                prose-a:text-[#f97316] prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-[#f97316] prose-blockquote:text-gray-400 prose-blockquote:italic
                prose-ul:text-gray-300 prose-ol:text-gray-300
                prose-li:marker:text-[#f97316]
                prose-code:text-[#f97316] prose-code:bg-[#1a1a1a] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                prose-img:rounded-lg prose-img:my-8"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tags & Share */}
            <div className="mt-16 pt-8 border-t border-[#2a2a2a] flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-500" />
                <div className="flex gap-2 flex-wrap">
                  {(post.tags ?? ['时尚科技', 'AI设计', '趋势预测']).map(tag => (
                    <span key={tag} className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] px-3 py-1 rounded-full text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleShare} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />{t('分享', 'Share')}
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />{t('评论', 'Comment')}
                </button>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-20">
                <h3 className="text-xl font-bold mb-8">{t('相关阅读', 'Related Articles')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(related => (
                    <Link key={related.id} href={`/blog/${related.slug}`}
                      className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] p-4 flex gap-4 group hover:border-[#f97316]/30 transition-all">
                      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                        <img src={related.image} alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider">{related.category}</span>
                        <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-[#f97316] transition-colors mt-1">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-2">{related.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
