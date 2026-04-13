'use client';

import React from 'react';
import { Map, Flag, Zap, Shield, Lock } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

const RoadmapPage: React.FC = () => {
  useSEO({
    title: '技术路线图 | 唯客 AI 护栏',
    description: '唯客 AI 护栏未来发展规划，致力构建最全面的 AI 安全防护体系。包括幻觉检测、多模态内容安全、全球合规框架等前沿能力规划。',
    keywords: '唯客AI护栏路线图,AI安全规划,大模型安全未来,LLM安全发展',
    canonical: '/roadmap',
  });
  const milestones = [
    {
      quarter: "2025 Q2",
      title: "智能增强与生态扩展",
      status: "进行中",
      items: [
        "支持图像模态安全检测 (Image-Input Guard)",
        "新增 5+ 种主流 Agent 框架的中间件支持 (LangChain, AutoGen)",
        "私有化部署支持 ARM 架构服务器",
        "推出「红蓝对抗」自动化评测工具"
      ]
    },
    {
      quarter: "2025 Q3",
      title: "行业深度定制",
      status: "规划中",
      items: [
        "发布医疗行业专属知识库与风控模型",
        "支持多模态输出（音频/视频）的违规检测",
        "企业级 SSO 单点登录与权限精细化管理",
        "SaaS 版上线，支持 API 按量计费调用"
      ]
    },
    {
      quarter: "2025 Q4",
      title: "自主进化安全系统",
      status: "规划中",
      items: [
        "引入自适应学习机制，根据攻击样本自动更新防御策略",
        "联邦学习支持，在不共享数据的前提下提升模型泛化能力",
        "支持端侧小模型 (SLM) 的轻量化安全护栏"
      ]
    }
  ];

  return (
    <div className="bg-brand-dark min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">技术路线图</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            唯客始终站在 AI 安全的最前沿。这是我们未来的发展规划。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {milestones.map((m, i) => (
                <div key={i} className="relative group">
                    {/* Status Badge */}
                    <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold uppercase rounded-bl-xl rounded-tr-xl border-l border-b ${m.status === '进行中' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white/5 text-gray-500 border-white/5'}`}>
                        {m.status}
                    </div>

                    <div className="h-full bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-brand-blue/40 transition-all hover:-translate-y-2 duration-300">
                        <div className="text-brand-green font-mono font-bold text-xl mb-2">{m.quarter}</div>
                        <h2 className="text-2xl font-bold text-white mb-6 group-hover:text-brand-blue transition-colors">{m.title}</h2>
                        
                        <div className="space-y-6">
                             {m.items.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="mt-1 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-brand-blue/30 transition-colors">
                                        <div className={`w-2 h-2 rounded-full ${m.status === '进行中' ? 'bg-brand-blue' : 'bg-gray-600'}`}></div>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item}</p>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Vision Section */}
        <div className="mt-24 p-8 lg:p-12 bg-gradient-to-r from-blue-900/20 to-brand-dark border border-white/10 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">我们的愿景</h3>
                <p className="text-xl text-blue-200 max-w-3xl mx-auto italic">
                    "构建 AI 时代的数字免疫系统，让智能应用在安全边界内自由生长。"
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RoadmapPage;