import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, ArrowRight, Zap } from 'lucide-react';

// Typing effect component
const StreamingText = ({ text, speed = 30, delay = 0 }: { text: string; speed?: number, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    const intervalId = setInterval(() => {
      if (index >= text.length) {
        setIsDone(true);
        clearInterval(intervalId);
        return;
      }
      // Add a bit of randomness to speed to simulate typing
      const randomSpeed = speed + (Math.random() * 20 - 10);
      
      setDisplayedText(text.slice(0, index + 1));
      index++;
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, started]);

  return (
    <span className="relative">
      {displayedText}
      {!isDone && (
        <span className="inline-block w-1.5 h-4 bg-brand-blue ml-0.5 align-middle animate-pulse"></span>
      )}
    </span>
  );
};

const BlogPage: React.FC = () => {
  const posts = [
    {
        title: "LLM 安全不仅是提示词工程：2025年企业 AI 安全趋势报告",
        date: "2025-05-15",
        author: "唯客安全实验室",
        excerpt: "随着 Agent 技术的普及，传统的 Prompt 攻击手段正在演变。本文深入探讨了新型攻击向量及防御策略。",
        tag: "行业洞察",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "如何利用唯客 AI 护栏在 Dify 中实现 PII 自动化脱敏？",
        date: "2025-04-22",
        author: "技术团队",
        excerpt: "手把手教程：在 Dify Workflow 中集成 weike-guardrails 插件，保护用户隐私数据不泄露。",
        tag: "最佳实践",
        image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2000&auto=format&fit=crop"
    },
    {
        title: "唯客 AI 护栏 v2.0 发布：流式检测性能提升 300%",
        date: "2025-04-10",
        author: "产品中心",
        excerpt: "新版本引入了基于 Rust 重写的核心匹配引擎，并新增了针对金融行业的合规词库。",
        tag: "产品动态",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "从「一本正经胡说八道」到「可信回答」：幻觉检测技术解析",
        date: "2025-03-28",
        author: "研发团队",
        excerpt: "大模型幻觉是企业应用落地的最大障碍之一。我们将解析唯客 RAG 事实性校验背后的技术原理。",
        tag: "技术解析",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {posts.map((post, i) => (
                <article key={i} className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden hover:border-brand-blue/50 transition-all hover:shadow-[0_0_30px_rgba(46,124,246,0.1)] group cursor-pointer flex flex-col h-full">
                    {/* Image Section */}
                    <div className="h-56 overflow-hidden relative">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-brand-dark/90 backdrop-blur-md rounded-full text-brand-green text-xs font-medium border border-white/10">
                                {post.tag}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                {post.author}
                            </div>
                        </div>
                        
                        <h2 className="text-xl font-bold text-white mb-4 group-hover:text-brand-blue transition-colors leading-snug line-clamp-2 min-h-[3.5rem]">
                            {post.title}
                        </h2>
                        
                        <div className="text-gray-400 mb-6 leading-relaxed text-sm flex-grow min-h-[4.5rem]">
                            {/* Staggered start times for effect */}
                            <StreamingText text={post.excerpt} delay={i * 200} />
                        </div>
                        
                        <div className="flex items-center text-brand-blue font-semibold group-hover:translate-x-2 transition-transform mt-auto pt-4 border-t border-white/5">
                            阅读全文 <ArrowRight size={16} className="ml-2" />
                        </div>
                    </div>
                </article>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;