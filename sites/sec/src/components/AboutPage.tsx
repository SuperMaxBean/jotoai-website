'use client';

import React from 'react';
import { useSEO } from '../utils/useSEO';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  useSEO({
    title: t('关于我们 | 唯客 AI 护栏', 'About Us | JOTO AI Guardrails'),
    description: t(
      '唯客 AI 护栏由 JOTO.AI（上海聚托信息科技有限公司）打造，致力成为企业大模型应用的安全基石。中国首家 Dify 官方服务商，深耕大模型应用安全领域。',
      'JOTO AI Guardrails is built by JOTO.AI (Shanghai Jutuo Information Technology Co., Ltd.), dedicated to being the security cornerstone for enterprise LLM applications. China\'s first official Dify service provider.'
    ),
    keywords: t(
      'JOTO.AI,唯客AI护栏公司,上海聚托信息科技,Dify官方服务商,AI安全创业公司',
      'JOTO.AI,AI guardrails company,Dify official service provider,AI security startup'
    ),
    canonical: '/about',
  });

  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">{t('关于我们', 'About Us')}</h1>

          <div className="prose prose-invert prose-blue">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {t(
                '唯客 AI 护栏是 JOTO.AI (上海聚托信息科技有限公司) 旗下的核心安全产品。',
                'JOTO AI Guardrails is the core security product of JOTO.AI (Shanghai Jutuo Information Technology Co., Ltd.).'
              )}
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">{t('我们的愿景', 'Our Vision')}</h2>
            <p className="text-gray-400 mb-8">
              {t(
                '在生成式 AI 浪潮中，安全与合规是企业落地的第一道门槛。我们的愿景是构建一套透明、极速、可靠的 AI 安全基础设施，让每一家企业都能毫无顾虑地释放大模型的生产力。',
                'In the wave of generative AI, security and compliance are the first barriers to enterprise adoption. Our vision is to build transparent, ultra-fast, and reliable AI security infrastructure, enabling every enterprise to unleash the productivity of LLMs without hesitation.'
              )}
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">{t('专业团队', 'Professional Team')}</h2>
            <p className="text-gray-400 mb-8">
              {t(
                'JOTO.AI 作为中国首家 Dify 官方服务商，深耕大模型应用开发与部署领域。我们的团队由资深安全专家、算法工程师和全栈开发者组成，在 LLM 安全攻防、隐私计算和高性能网关领域拥有深厚积累。',
                "As China's first official Dify service provider, JOTO.AI has deep expertise in LLM application development and deployment. Our team consists of senior security experts, algorithm engineers, and full-stack developers with extensive experience in LLM security, privacy computing, and high-performance gateways."
              )}
            </p>

            <div className="p-8 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl mt-16">
              <h3 className="text-xl font-bold text-white mb-4">{t('联系我们', 'Contact Us')}</h3>
              <p className="text-gray-300 mb-6">{t('如果您对我们的产品感兴趣，或者有任何关于 AI 安全的疑问，欢迎随时联系。', 'If you are interested in our products or have any questions about AI security, feel free to reach out anytime.')}</p>
              <div className="space-y-2 text-brand-blue font-medium">
                <p>{t('邮箱', 'Email')}：jotoai@jototech.cn</p>
                <p>{t('地址：上海市杨浦区', 'Address: Yangpu District, Shanghai, China')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
