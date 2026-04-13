import React from 'react';
import { ArrowRight, Zap, Unlock, EyeOff, AlertTriangle, Link2 } from 'lucide-react';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-dark">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            <span className="text-sm text-gray-300">企业级 LLM 安全防护系统</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
            为每一次 AI 对话，<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">
              筑起安全防线
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
            唯客 AI 护栏 —— 企业级大模型应用安全防护系统。<br/>
            实时检测输入输出 · 本地私有化部署 · 与 Dify 无缝集成
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/contact"
              className="px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              联系我们 <ArrowRight size={20} />
            </a>
          </div>

          <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-4 sm:gap-2 group">
              <div className="w-10 h-10 sm:w-5 sm:h-5 bg-brand-green/10 sm:bg-transparent rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-full sm:h-full text-brand-green">
                    <path 
                        d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        fill="currentColor" 
                        fillOpacity="0.2"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    <path 
                        d="M14 20L18 24L26 16" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
              </div>
              <span className="font-medium sm:font-normal">已服务 200+ 企业</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-2 group">
              <div className="w-10 h-10 sm:w-5 sm:h-5 bg-brand-green/10 sm:bg-transparent rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                <Zap size={20} className="text-brand-green sm:w-full sm:h-full" />
              </div>
              <span className="font-medium sm:font-normal">日均拦截 50万+ 风险请求</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-2 group">
              <div className="w-10 h-10 sm:w-5 sm:h-5 bg-brand-green/10 sm:bg-transparent rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-green/20 transition-colors">
                <div className="w-5 h-5 sm:w-4 sm:h-4 rounded bg-brand-green/20 flex items-center justify-center text-xs sm:text-[10px] text-brand-green font-bold">D</div>
              </div>
              <span className="font-medium sm:font-normal">Dify 官方服务商出品</span>
            </div>
          </div>
        </div>

        {/* Right Visual (Shield & Features) */}
        <div className="relative h-[600px] w-full hidden lg:flex items-center justify-center perspective-1000">
             {/* Central Shield System */}
             <div className="relative w-full h-full flex items-center justify-center">
                
                {/* Central Glowing Shield Group */}
                <div className="relative z-20 flex items-center justify-center">
                    {/* Deep Glow */}
                    <div className="absolute w-[300px] h-[300px] bg-brand-blue/20 rounded-full blur-[80px] animate-pulse-slow"></div>
                    
                    {/* Shield Icon - Floating Free */}
                    <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                        {/* Shadow layer for depth */}
                        <div className="absolute inset-0 bg-brand-blue/30 blur-3xl rounded-full transform scale-75"></div>
                        
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[200px] h-[200px] relative z-10">
                            <defs>
                                <linearGradient id="hero_logo_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#2E7CF6"/>
                                    <stop offset="100%" stopColor="#00E5A0"/>
                                </linearGradient>
                                <filter id="glow_filter" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>
                            <path 
                                d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                                fill="url(#hero_logo_gradient)" 
                                fillOpacity="0.4"
                                filter="url(#glow_filter)"
                            />
                            <path 
                                d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                                stroke="url(#hero_logo_gradient)" 
                                strokeWidth="2" 
                                fill="url(#hero_logo_gradient)" 
                                fillOpacity="0.1"
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            />
                            <path 
                                d="M14 20L18 24L26 16" 
                                stroke="url(#hero_logo_gradient)" 
                                strokeWidth="3" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                filter="url(#glow_filter)"
                            />
                        </svg>
                    </div>
                </div>

                {/* Floating Feature Cards */}
                <div className="absolute top-[20%] left-[10%] p-4 bg-brand-surface/90 backdrop-blur-md border border-red-500/30 rounded-xl shadow-lg animate-float flex items-center gap-4 max-w-[200px] hover:border-red-500/60 transition-colors" style={{ animationDelay: '0s' }}>
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <Unlock size={24} className="text-red-400" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">越狱攻击</div>
                        <div className="text-xs text-red-300">实时拦截</div>
                    </div>
                </div>

                <div className="absolute top-[15%] right-[5%] p-4 bg-brand-surface/90 backdrop-blur-md border border-brand-green/30 rounded-xl shadow-lg animate-float flex items-center gap-4 max-w-[200px] hover:border-brand-green/60 transition-colors" style={{ animationDelay: '2s' }}>
                    <div className="p-3 bg-brand-green/10 rounded-lg border border-brand-green/20">
                        <EyeOff size={24} className="text-brand-green" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">隐私泄露</div>
                        <div className="text-xs text-brand-green">自动遮掩</div>
                    </div>
                </div>

                <div className="absolute bottom-[20%] left-[15%] p-4 bg-brand-surface/90 backdrop-blur-md border border-yellow-500/30 rounded-xl shadow-lg animate-float flex items-center gap-4 max-w-[200px] hover:border-yellow-500/60 transition-colors" style={{ animationDelay: '1s' }}>
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <AlertTriangle size={24} className="text-yellow-400" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">违规内容</div>
                        <div className="text-xs text-yellow-300">精准过滤</div>
                    </div>
                </div>

                <div className="absolute bottom-[25%] right-[10%] p-4 bg-brand-surface/90 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-lg animate-float flex items-center gap-4 max-w-[200px] hover:border-purple-500/60 transition-colors" style={{ animationDelay: '3s' }}>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Link2 size={24} className="text-purple-400" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-sm">恶意链接</div>
                        <div className="text-xs text-purple-300">防钓鱼注入</div>
                    </div>
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <line x1="30%" y1="30%" x2="50%" y2="50%" stroke="#2E7CF6" strokeDasharray="4 4" />
                    <line x1="70%" y1="25%" x2="50%" y2="50%" stroke="#00E5A0" strokeDasharray="4 4" />
                    <line x1="35%" y1="70%" x2="50%" y2="50%" stroke="#EAB308" strokeDasharray="4 4" />
                    <line x1="75%" y1="65%" x2="50%" y2="50%" stroke="#A855F7" strokeDasharray="4 4" />
                </svg>
             </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
