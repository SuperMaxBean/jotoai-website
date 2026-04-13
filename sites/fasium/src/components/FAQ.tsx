'use client';
import React, { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "FasiumAI 适合什么规模的团队？",
      answer: "FasiumAI 适合各种规模的服装设计团队。无论是需要快速响应市场的快时尚品牌，还是追求小团队大产出的独立设计师品牌，或者是需要提升提案能力的代工厂/ODM，都能从中受益。"
    },
    {
      question: "AI 生成的设计会和别人撞款吗？",
      answer: "不会。FasiumAI 支持私有化微调，通过学习您的品牌历史数据，AI 会掌握您品牌的独特 DNA，生成符合您品牌风格的专属设计。"
    },
    {
      question: "需要学习 prompt 吗？",
      answer: "不需要。我们将服装设计的专业语言深度编码进 AI 系统，您只需要用设计师日常使用的语言即可驱动 AI，无需学习复杂的 prompt 工程。"
    },
    {
      question: "生成的 Tech Pack 可以直接给工厂用吗？",
      answer: "可以。系统自动生成的 Tech Pack 包含花型文件、配色参数、版型尺寸、工艺说明等全部生产所需信息，格式标准，可直接对接工厂生产。"
    },
    {
      question: "支持哪些品类？",
      answer: "目前支持女装、男装、童装等主流服装品类，涵盖 T恤、卫衣、连衣裙、外套等常见款式。知识库还在持续更新中。"
    },
    {
      question: "数据安全怎么保障？",
      answer: "我们采用企业级加密技术保护您的数据安全。您的私有数据仅用于您自己账号的模型微调，绝不会用于训练公共模型或泄露给第三方。"
    }
  ];

  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <p className="text-[#FF8A00] text-sm font-bold tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">常见问题</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-white/10 pb-4"
            >
              <button 
                className="w-full flex items-center justify-between py-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                <span className={`text-gray-500 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
