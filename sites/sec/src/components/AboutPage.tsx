'use client';

import React from 'react';
import { useSEO } from '../utils/useSEO';

const AboutPage: React.FC = () => {
  useSEO({
    title: '关于我们 | 唯客 AI 护栏',
    description: '唯客 AI 护栏由 JOTO.AI（上海聚托信息科技有限公司）打造，致力成为企业大模型应用的安全基石。中国首家 Dify 官方服务商，深耕大模型应用安全领域。',
    keywords: 'JOTO.AI,唯客AI护栏公司,上海聚托信息科技,Dify官方服务商,AI安全创业公司',
    canonical: '/about',
  });
  return (
    <div className="pt-32 pb-24 bg-brand-dark min-h-screen">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">关于我们</h1>

          <div className="prose prose-invert prose-blue">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              唯客 AI 护栏是 JOTO.AI (上海聚托信息科技有限公司) 旗下的核心安全产品。
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">我们的愿景</h2>
            <p className="text-gray-400 mb-8">
              在生成式 AI 浪潮中，安全与合规是企业落地的第一道门槛。我们的愿景是构建一套透明、极速、可靠的 AI 安全基础设施，让每一家企业都能毫无顾虑地释放大模型的生产力。
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">专业团队</h2>
            <p className="text-gray-400 mb-8">
              JOTO.AI 作为中国首家 Dify 官方服务商，深耕大模型应用开发与部署领域。我们的团队由资深安全专家、算法工程师和全栈开发者组成，在 LLM 安全攻防、隐私计算和高性能网关领域拥有深厚积累。
            </p>

            <div className="p-8 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl mt-16">
              <h3 className="text-xl font-bold text-white mb-4">联系我们</h3>
              <p className="text-gray-300 mb-6">如果您对我们的产品感兴趣，或者有任何关于 AI 安全的疑问，欢迎随时联系。</p>
              <div className="space-y-2 text-brand-blue font-medium">
                <p>邮箱：jotoai@jototech.cn</p>
                <p>地址：上海市杨浦区</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
