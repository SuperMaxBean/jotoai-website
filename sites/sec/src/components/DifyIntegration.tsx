import React from 'react';
import Image from 'next/image';
import { Layers, Workflow, Bot, Code } from 'lucide-react';

/** 唯客 logo 行高；Dify 略小一圈 */
const LOGO_ROW_HEIGHT = 'h-16 sm:h-[3.5rem]';
const LOGO_BOX_SIZE = 'h-16 w-16 sm:h-[3.5rem] sm:w-[3.5rem]';
const DIFY_LOGO_HEIGHT = 'h-12 sm:h-[2.5rem]';

const DifyIntegration: React.FC = () => {
  return (
    <section className="py-24 bg-indigo-50/50">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-indigo-100 flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-6">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
               {/* Dify AI Logo - 比唯客小一圈 */}
               <div className={`flex items-center ${DIFY_LOGO_HEIGHT}`}>
                 <Image src="/dify-ai-logo.png" alt="Dify 品牌 logo" width={160} height={48} className="h-full w-auto object-contain object-center" />
               </div>
               <span className="text-2xl sm:text-3xl text-gray-300 font-light self-center">×</span>
               {/* 唯客盾牌 - 与 Dify 同高，使用同一 LOGO_ROW_HEIGHT / LOGO_BOX_SIZE */}
               <div className={`flex items-center gap-2 sm:gap-3 ${LOGO_ROW_HEIGHT}`}>
                 <div className={`${LOGO_BOX_SIZE} relative flex items-center justify-center flex-shrink-0`}>
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <defs>
                            <linearGradient id="logo_gradient_dify" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#2E7CF6"/>
                                <stop offset="100%" stopColor="#00E5A0"/>
                            </linearGradient>
                            <filter id="dify_logo_glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="1" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        {/* Glow Layer */}
                        <path 
                            d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                            fill="url(#logo_gradient_dify)" 
                            fillOpacity="0.2"
                            filter="url(#dify_logo_glow)"
                        />
                        {/* Shield Body */}
                        <path 
                            d="M20 5L8 10V19C8 26.5 13 33.5 20 36C27 33.5 32 26.5 32 19V10L20 5Z" 
                            stroke="url(#logo_gradient_dify)" 
                            strokeWidth="2.5" 
                            fill="url(#logo_gradient_dify)" 
                            fillOpacity="0.05"
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        />
                        {/* Inner Checkmark */}
                        <path 
                            d="M14 20L18 24L26 16" 
                            stroke="url(#logo_gradient_dify)" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            filter="url(#dify_logo_glow)"
                        />
                    </svg>
                 </div>
                 <span className="font-bold text-3xl text-slate-900">唯客</span>
               </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              与 Dify 无缝集成，<br/>开箱即用
            </h2>
            
            <p className="text-slate-600 text-lg">
              JOTO.AI 作为中国首家 Dify 官方服务商，唯客 AI 护栏为 Dify 生态量身打造。
              Chatflow、Workflow、Agent 全场景覆盖，无需修改业务代码，安装即生效。
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {[
                { icon: <Layers size={16}/>, text: "Chatflow" },
                { icon: <Workflow size={16}/>, text: "Workflow" },
                { icon: <Bot size={16}/>, text: "Agent" },
                { icon: <Code size={16}/>, text: "API 调用" }
              ].map((tag, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                  {tag.icon} {tag.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-900 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
               {/* Fake Code / Config Interface */}
               <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <span className="text-xs text-gray-500 ml-2">dify-config.yml</span>
               </div>
               
               <div className="space-y-2 font-mono text-sm">
                 <div className="flex">
                    <span className="text-purple-400 w-8">01</span>
                    <span className="text-pink-400">plugins:</span>
                 </div>
                 <div className="flex">
                    <span className="text-purple-400 w-8">02</span>
                    <span className="text-gray-300 pl-4">- name: <span className="text-green-400">joto-guardrails</span></span>
                 </div>
                 <div className="flex">
                    <span className="text-purple-400 w-8">03</span>
                    <span className="text-gray-300 pl-4">  enabled: <span className="text-blue-400">true</span></span>
                 </div>
                 <div className="flex">
                    <span className="text-purple-400 w-8">04</span>
                    <span className="text-gray-300 pl-4">  config:</span>
                 </div>
                 <div className="flex bg-white/5 -mx-6 px-6 py-1 border-l-2 border-brand-blue">
                    <span className="text-purple-400 w-8">05</span>
                    <span className="text-gray-300 pl-8">  mode: <span className="text-yellow-300">"strict_blocking"</span></span>
                 </div>
                 <div className="flex">
                    <span className="text-purple-400 w-8">06</span>
                    <span className="text-gray-300 pl-8">  pii_masking: <span className="text-blue-400">true</span></span>
                 </div>
               </div>

               <div className="absolute bottom-6 right-6">
                 <div className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded shadow-lg animate-bounce">
                   Active ✅
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifyIntegration;