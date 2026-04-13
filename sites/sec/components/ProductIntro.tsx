import React from 'react';
import { User, Cpu, Check, ChevronRight, Zap } from 'lucide-react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

const Connector = ({ isEnd = false }: { isEnd?: boolean }) => {
    return (
        <>
            {/* Desktop Line (Visible on LG+) */}
            {/* Added -translate-y-4 to visually center the arrow with the icons, compensating for the text labels below */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative px-1 min-w-[20px] xl:min-w-[40px] -translate-y-4">
                {/* Line Background */}
                <div className="h-[2px] w-full bg-slate-800 relative overflow-hidden rounded-full">
                    {/* Moving Light Effect */}
                    <div className={`absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-brand-blue to-transparent animate-shimmer ${isEnd ? 'via-brand-green' : ''}`} />
                </div>
                {/* Arrow Head */}
                <ChevronRight className={`text-slate-700 absolute -right-1 ${isEnd ? 'text-brand-green/50' : ''}`} size={20} />
            </div>
            
            {/* Mobile/Tablet Vertical Arrow (Hidden on LG+) */}
            <div className="lg:hidden py-6 text-slate-700 flex flex-col items-center">
                <div className="h-12 w-[2px] bg-slate-800 relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-brand-blue to-transparent animate-scan" />
                </div>
                <ChevronRight size={28} className="rotate-90 -mt-2 text-brand-blue/40" />
            </div>
        </>
    );
}

const ProductIntro: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section id="product" className="py-24 bg-brand-surface relative overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            唯客 AI 护栏是什么？
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            唯客 AI 护栏是一款专为中国企业设计的大模型应用运行时安全防护系统。
            它以<span className="text-brand-green">极低延迟的流式检测引擎</span>为核心，在用户输入和模型输出的双向数据流中，
            实时执行安全策略，同时提供完整的安全日志看板。
          </p>
        </div>

        {/* Diagram Container */}
        <div 
          ref={ref}
          className={`relative bg-[#0B1221] border border-white/5 rounded-3xl p-6 lg:p-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Flow Wrapper - Vertical on small/med, Horizontal on LG+ */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-0">
                
                {/* 1. User */}
                <div className="flex flex-col items-center gap-4 group shrink-0 w-full lg:w-auto">
                     <div className="relative">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative z-10 group-hover:border-brand-blue transition-colors shadow-lg">
                            <User size={32} className="text-slate-400 group-hover:text-brand-blue transition-colors" />
                        </div>
                        {/* Pulse effect */}
                        <div className="absolute inset-0 bg-brand-blue/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <span className="text-slate-400 font-medium text-sm">用户请求</span>
                </div>

                <Connector />

                {/* 2. Input Guard */}
                <div className="flex flex-col items-center gap-2 shrink-0 relative group z-10 w-full lg:w-auto px-4 lg:px-0">
                    <div className="w-full lg:w-60 xl:w-64 h-28 lg:h-32 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(46,124,246,0.5)] flex flex-col items-center justify-center gap-2 lg:gap-3 relative overflow-hidden transform group-hover:scale-105 transition-transform duration-300 border border-white/10">
                        {/* Scan line animation */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent translate-y-[-100%] animate-scan" />
                        
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 lg:w-9 lg:h-9 text-white drop-shadow-md">
                            <defs>
                                <linearGradient id="intro_logo_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#ffffff"/>
                                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8"/>
                                </linearGradient>
                            </defs>
                            <path 
                                d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                                stroke="url(#intro_logo_gradient)" 
                                strokeWidth="2.5" 
                                fill="url(#intro_logo_gradient)" 
                                fillOpacity="0.1"
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                            <path 
                                d="M14 20L18 24L26 16" 
                                stroke="url(#intro_logo_gradient)" 
                                strokeWidth="3.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-white font-bold text-base lg:text-lg tracking-wide">输入安全检测</span>
                    </div>
                    <span className="text-[10px] text-brand-blue font-bold tracking-[0.2em] uppercase mt-2 lg:mt-3">Guard Layer</span>
                </div>

                <Connector />

                {/* 3. Core Engine */}
                <div className="flex flex-col items-center gap-4 shrink-0 w-full lg:w-auto">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-900 border border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-2xl relative z-10 group hover:border-brand-green/50 transition-colors mx-auto">
                        <Cpu size={32} className="text-brand-green" />
                        <span className="text-slate-300 text-xs font-bold">LLM / Agent</span>
                    </div>
                    <span className="text-slate-400 font-medium text-sm">核心引擎</span>
                </div>

                <Connector />

                {/* 4. Output Guard */}
                <div className="flex flex-col items-center gap-2 shrink-0 relative group z-10 w-full lg:w-auto px-4 lg:px-0">
                     <div className="w-full lg:w-60 xl:w-64 h-28 lg:h-32 bg-gradient-to-br from-brand-blue to-blue-700 rounded-xl shadow-[0_10px_40px_-10px_rgba(46,124,246,0.5)] flex flex-col items-center justify-center gap-2 lg:gap-3 relative overflow-hidden transform group-hover:scale-105 transition-transform duration-300 border border-white/10">
                        {/* Scan line animation - Delayed */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/20 to-transparent translate-y-[-100%] animate-scan" style={{ animationDelay: '1.5s' }} />

                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 lg:w-9 lg:h-9 text-white drop-shadow-md">
                            <path 
                                d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                                stroke="url(#intro_logo_gradient)" 
                                strokeWidth="2.5" 
                                fill="url(#intro_logo_gradient)" 
                                fillOpacity="0.1"
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                            <path 
                                d="M14 20L18 24L26 16" 
                                stroke="url(#intro_logo_gradient)" 
                                strokeWidth="3.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span className="text-white font-bold text-base lg:text-lg tracking-wide">输出安全检测</span>
                    </div>
                    <span className="text-[10px] text-brand-blue font-bold tracking-[0.2em] uppercase mt-2 lg:mt-3">Guard Layer</span>
                </div>

                <Connector isEnd />

                {/* 5. Response */}
                <div className="flex flex-col items-center gap-4 group shrink-0 w-full lg:w-auto">
                    <div className="relative">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center relative z-10 group-hover:border-brand-green transition-colors shadow-lg">
                            <Check size={32} className="text-slate-400 group-hover:text-brand-green transition-colors" strokeWidth={3} />
                        </div>
                        <div className="absolute inset-0 bg-brand-green/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-slate-400 font-medium text-sm">安全响应</span>
                </div>

            </div>

             {/* Divider */}
             <div className="h-px w-full bg-white/5 my-12"></div>

            {/* Feature List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
                {[
                "提示词越狱检测",
                "PII 识别与遮掩",
                "违规内容过滤",
                "恶意链接检测",
                "黑白名单管控",
                "安全日志与审计"
                ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center group">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_#2E7CF6] group-hover:bg-brand-green transition-colors"></div>
                    <span className="text-gray-400 text-xs md:text-sm group-hover:text-gray-300 transition-colors">{item}</span>
                </div>
                ))}
            </div>

             {/* Footer Tagline */}
             <div className="text-center mt-12 flex items-center justify-center gap-3 text-brand-blue font-bold tracking-wider text-sm md:text-base opacity-80">
                <Zap size={16} fill="currentColor" />
                流式检测 · 双向防护 · 毫秒响应
             </div>
        </div>
      </div>
    </section>
  );
};

export default ProductIntro;