'use client';

import React from 'react';
import { Shield, FileCheck, FileWarning, Link2Off, Settings2, ArrowRightLeft, BarChart3, Server, Zap, Lock, Eye } from 'lucide-react';
import { useSEO } from '../utils/useSEO';

const FeaturesPage: React.FC = () => {
  useSEO({
    title: '核心功能 | 唯客 AI 护栏',
    description: '唯客 AI 护栏提供七大核心能力：Prompt 注入拦截、提示词越狱检测、PII 隐私数据保护、合规审计日志、恶意链接扫描、敏感词过滤、Dify 无缝集成，全方位守护您的 AI 应用安全。',
    keywords: 'AI护栏功能,Prompt注入检测,提示词越狱,PII保护,合规审计,恶意内容过滤,大模型安全防护',
    canonical: '/features',
  });
  const features = [
    {
        title: "大模型输入防火墙",
        desc: "在 Prompt 到达模型之前进行深度清洗，防止恶意攻击。",
        items: [
            { icon: <Shield size={20} />, title: "Prompt 注入拦截", text: "识别并阻断通过角色扮演、DAN 模式等方式绕过安全限制的指令。" },
            { icon: <Lock size={20} />, title: "PII 隐私脱敏", text: "自动识别姓名、身份证、銀行卡等10+种敏感信息，支持替换或哈希处理。" },
            { icon: <Link2Off size={20} />, title: "恶意 URL 过滤", text: "扫描输入中的链接，防止 SSRF 攻击或钓鱼链接注入。" }
        ]
    },
    {
        title: "大模型输出过滤器",
        desc: "实时监控模型生成的内容，确保输出合规、安全。",
        items: [
            { icon: <FileWarning size={20} />, title: "违规内容阻断", text: "基于行业词库和语义模型，拦截涉黄、涉暴、涉政等违规内容。" },
            { icon: <Eye size={20} />, title: "幻觉检测 (Beta)", text: "交叉验证模型输出的事实性，降低一本正经胡说八道的风险。" },
            { icon: <Settings2 size={20} />, title: "格式一致性校验", text: "确保输出符合 JSON/XML 等预定义格式，防止下游系统崩溃。" }
        ]
    },
    {
        title: "企业级管理与部署",
        desc: "专为企业环境设计，满足审计与运维需求。",
        items: [
            { icon: <Server size={20} />, title: "私有化部署", text: "Docker/K8s 容器化交付，数据不出内网，适配国产信创服务器。" },
            { icon: <BarChart3 size={20} />, title: "全链路审计日志", text: "记录每一次对话的原始输入、处理结果和拦截原因，支持导出报表。" },
            { icon: <Zap size={20} />, title: "低延迟引擎", text: "基于 Rust/Go 重写的核心检测引擎，平均处理延迟低于 300ms。" }
        ]
    }
  ];

  return (
    <div className="bg-brand-dark min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">核心功能概览</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            唯客 AI 护栏提供端到端的 LLM 安全防护能力，帮助企业构建可信赖的 AI 应用。
          </p>
        </div>

        <div className="space-y-24">
            {features.map((section, idx) => (
                <div key={idx} className="relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 mb-10 border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-bold text-brand-blue">{section.title}</h2>
                        <p className="text-gray-400 text-lg mb-1">{section.desc}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {section.items.map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 bg-brand-blue/20 rounded-lg flex items-center justify-center text-brand-blue mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;