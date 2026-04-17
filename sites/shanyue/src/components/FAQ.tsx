"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const FAQ_ITEMS = [
    {
      question: t(
        "相比 ChatGPT 等通用大模型，闪阅有何独特优势？",
        "What unique advantages does iMark have over general LLMs like ChatGPT?"
      ),
      answer: t(
        `通用大模型在教育场景面临四大痛点：\n\n1. 理科识别软肋：在复杂数学公式、化学符号及受力图上易产生\u201C幻觉\u201D；\n2. 隐私合规风险：云端判卷涉及数据上传，面临监管风险；\n3. 成本高昂：软硬一体方案导致升级迭代成本剧增；\n4. 缺乏灵活性：无法针对雅思作文、理科垂类等特定场景进行微调。\n\n闪阅支持本地化部署与专项训练，精准解决上述问题。`,
        "General LLMs face four major pain points in education:\n\n1. Weak in STEM recognition: prone to 'hallucinations' with complex math formulas, chemistry symbols, and force diagrams;\n2. Privacy compliance risks: cloud-based grading requires data upload, facing regulatory risks;\n3. High costs: integrated hardware-software solutions lead to soaring upgrade costs;\n4. Lack of flexibility: cannot fine-tune for specific scenarios like IELTS essays or STEM verticals.\n\niMark supports local deployment and specialized training to precisely solve these issues."
      ),
    },
    {
      question: t(
        "系统是否支持手写体的中英文混合识别？",
        "Does the system support mixed Chinese-English handwriting recognition?"
      ),
      answer: t(
        "支持。闪阅搭载了专为教育场景优化的 OCR 引擎，对于潦草的手写中文、英文以及数字混合书写具有极高的识别准确率，特别针对学生试卷场景进行了大量数据训练。",
        "Yes. iMark features an OCR engine optimized specifically for educational scenarios, with extremely high accuracy for messy handwritten Chinese, English, and mixed numeric writing, with extensive data training specifically for student exam papers."
      ),
    },
    {
      question: t(
        "理科公式、几何图形能否被正确识别？",
        "Can science formulas and geometric figures be correctly recognized?"
      ),
      answer: t(
        "完全可以。这是闪阅的核心优势之一。我们针对数学、物理、化学中的复杂公式、特殊符号（如积分、求和、化学分子式）以及几何图形进行了深度优化，识别准确率远超通用 OCR 模型。",
        "Absolutely. This is one of iMark's core strengths. We have deeply optimized for complex formulas, special symbols (such as integrals, summations, chemical molecular formulas), and geometric figures in math, physics, and chemistry, with recognition accuracy far exceeding general OCR models."
      ),
    },
    {
      question: t(
        "数据存储在哪里？是否支持私有化部署？",
        "Where is data stored? Is private deployment supported?"
      ),
      answer: t(
        "我们提供多种部署方案。对于对数据安全有极高要求的学校和教育局，我们支持完全的本地私有化部署（On-premise），所有数据存储在您自己的服务器上，无需上传云端，确保数据主权。",
        "We offer multiple deployment options. For schools and education bureaus with high data security requirements, we support fully on-premise private deployment, with all data stored on your own servers, no cloud upload needed, ensuring data sovereignty."
      ),
    },
    {
      question: t(
        "能否与学校现有的教务系统对接？",
        "Can it integrate with the school's existing academic systems?"
      ),
      answer: t(
        "支持。我们提供完善的 API 接口文档，可以轻松与学校现有的 LMS（学习管理系统）、教务系统或家校互通平台进行数据打通，实现名单同步与成绩自动回传。",
        "Yes. We provide comprehensive API documentation for easy integration with existing LMS (Learning Management Systems), academic administration systems, or home-school communication platforms, enabling roster sync and automatic score reporting."
      ),
    },
    {
      question: t(
        "如何收费？是否提供试用？",
        "How is it priced? Is a trial available?"
      ),
      answer: t(
        `我们提供灵活的报价方案，通常根据使用人数或部署规模进行定制。您可以点击页面上的\u201C申请测试\u201D按钮，我们的解决方案专家会为您开通演示账号，并提供详细的报价咨询。`,
        "We offer flexible pricing plans, typically customized based on the number of users or deployment scale. Click the 'Request Trial' button on the page, and our solution experts will set up a demo account and provide detailed pricing consultation."
      ),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] mb-4">
            {t('常见问题 (FAQ)', 'Frequently Asked Questions')}
          </h2>
          <p className="text-lg text-slate-500">
            {t('关于部署、功能与安全的快速解答', 'Quick answers about deployment, features, and security')}
          </p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`border-b border-slate-100 last:border-0 transition-colors duration-300 ${isOpen ? 'bg-slate-50/50 rounded-lg border-transparent' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-6 px-4 text-left focus:outline-none group"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-[#7c3aed]' : 'text-slate-800 group-hover:text-[#7c3aed]'}`}>
                    {item.question}
                  </span>
                  <div className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#7c3aed] text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-[#7c3aed]/10 group-hover:text-[#7c3aed]'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'}`}
                >
                  <div className="overflow-hidden px-4">
                    <p className="text-slate-600 leading-relaxed text-base pt-2 whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
