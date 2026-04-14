'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Cpu, SearchX, ShieldAlert, Server, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

export default function Architecture() {
  const { t } = useLanguage();

  const engineItems = [
    { icon: Cpu, title: 'Legal-LLM', desc: t('垂直领域法律大模型，基于千亿级 Token 的法律文书、法规、案例进行预训练与微调，具备强大的法律逻辑推理能力。', 'Vertical legal LLM, pre-trained and fine-tuned on 100B+ tokens of legal documents, regulations, and cases, with powerful legal reasoning capabilities.') },
    { icon: SearchX, title: 'RAG Knowledge Base', desc: t('检索增强生成技术，实时挂载最新法条库与企业内部规章，有效解决大模型幻觉问题，确保审查建议的准确性与时效性。', 'Retrieval-augmented generation technology, real-time mounting of latest legal databases and internal regulations, effectively solving LLM hallucination issues, ensuring accuracy and timeliness of review suggestions.') },
    { icon: ShieldAlert, title: 'Security & Encryption', desc: t('全链路数据安全保障。采用 AES-256 数据加密传输与存储，内置敏感信息自动脱敏机制，符合国家数据安全标准。', 'End-to-end data security. AES-256 encrypted data transmission and storage, built-in automatic sensitive information redaction, compliant with national data security standards.') }
  ];

  return (
    <>    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{t('技术架构', 'Technology Architecture')}</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">{t('构建于先进的 LLM 大模型之上，结合 RAG 检索增强技术，确保数据安全与专业精准。', 'Built on advanced LLM large models, combined with RAG retrieval-augmented technology, ensuring data security and professional precision.')}</p>
        </motion.div>

        <motion.div
          {...fadeInUp}
          className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('部署方案', 'Deployment Options')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-blue-100 bg-blue-50 rounded-xl p-8 text-center"
            >
              <Server className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-blue-900 mb-2">{t('SaaS 云端部署', 'SaaS Cloud Deployment')}</h3>
              <p className="text-blue-700 mb-4">{t('多租户隔离 / 弹性伸缩 / 即开即用', 'Multi-tenant isolation / Auto-scaling / Ready to use')}</p>
              <p className="text-sm text-blue-600/80">{t('适合大多数企业，快速接入，享受持续的云端模型升级与功能迭代。', 'Ideal for most enterprises, quick onboarding with continuous cloud model upgrades and feature iterations.')}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="border border-slate-700 bg-slate-900 rounded-xl p-8 text-center"
            >
              <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{t('本地化私有部署', 'On-Premises Private Deployment')}</h3>
              <p className="text-slate-300 mb-4">{t('数据不出域 / 内网集成 / 定制化适配', 'Data stays on-premises / Intranet integration / Custom adaptation')}</p>
              <p className="text-sm text-slate-400">{t('专为对数据安全有极高要求的金融、军工等大型企业打造，支持信创环境。', 'Designed for large enterprises in finance, defense, and other sectors with strict data security requirements, supporting domestic IT ecosystems.')}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          {...fadeInUp}
          className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('AI 核心引擎 (AI Core Engine)', 'AI Core Engine')}</h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {engineItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="border border-slate-100 bg-slate-50 rounded-xl p-6"
              >
                <item.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
