'use client';
import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <>    <div className="bg-slate-50 min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-8">{t('隐私政策', 'Privacy Policy')}</h1>
          <p className="text-slate-500 mb-8 text-sm">{t('最近更新日期：2024年3月3日', 'Last updated: March 3, 2024')}</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('1. 引言', '1. Introduction')}</h2>
              <p>
                {t(
                  '唯客智审（以下简称"我们"）非常重视您的隐私。本隐私政策旨在说明我们如何收集、使用、披露、处理和保护您在使用我们的 AI 合同审查服务时提供给我们的信息。',
                  'Avaca AI Audit (hereinafter referred to as "we") highly values your privacy. This Privacy Policy is intended to explain how we collect, use, disclose, process, and protect the information you provide to us when using our AI contract review services.'
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('2. 我们收集的信息', '2. Information We Collect')}</h2>
              <p>{t('在您使用我们的服务过程中，我们可能会收集以下类型的信息：', 'During your use of our services, we may collect the following types of information:')}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>{t('账户信息：', 'Account Information:')}</strong> {t('当您注册账户时，我们会收集您的姓名、电子邮箱、联系电话及所属机构信息。', 'When you register an account, we collect your name, email address, phone number, and organization information.')}</li>
                <li><strong>{t('合同数据：', 'Contract Data:')}</strong> {t('您上传进行审查的合同文件。我们深知合同数据的敏感性，所有上传的文件均经过加密处理。', 'Contract files you upload for review. We understand the sensitivity of contract data -- all uploaded files are encrypted.')}</li>
                <li><strong>{t('使用数据：', 'Usage Data:')}</strong> {t('关于您如何访问和使用服务的信息，包括您的 IP 地址、浏览器类型、访问时间等。', 'Information about how you access and use our services, including your IP address, browser type, access time, etc.')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('3. 信息的使用', '3. Use of Information')}</h2>
              <p>{t('我们收集的信息主要用于以下用途：', 'The information we collect is primarily used for the following purposes:')}</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('提供、维护和改进我们的 AI 合同审查服务。', 'Providing, maintaining, and improving our AI contract review services.')}</li>
                <li>{t('处理您的请求并提供客户支持。', 'Processing your requests and providing customer support.')}</li>
                <li>{t('向您发送服务更新、安全警报和支持消息。', 'Sending you service updates, security alerts, and support messages.')}</li>
                <li><strong>{t('关于 AI 训练：', 'Regarding AI Training:')}</strong> {t('除非获得您的明确许可，否则我们不会使用您的原始合同数据来训练我们的通用基础模型。', 'Unless we obtain your explicit permission, we will not use your raw contract data to train our general foundation models.')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('4. 数据安全', '4. Data Security')}</h2>
              <p>
                {t(
                  '我们采取了行业领先的安全措施来保护您的信息，包括但不限于 SSL/TLS 加密传输、静态数据加密、严格的访问控制和定期的安全审计。',
                  'We have adopted industry-leading security measures to protect your information, including but not limited to SSL/TLS encrypted transmission, data-at-rest encryption, strict access controls, and regular security audits.'
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('5. 信息的共享与披露', '5. Information Sharing and Disclosure')}</h2>
              <p>
                {t(
                  '我们不会将您的个人信息或合同数据出售给第三方。我们仅在以下情况下共享您的信息：',
                  'We will not sell your personal information or contract data to third parties. We only share your information under the following circumstances:'
                )}
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('获得您的明确同意。', 'With your explicit consent.')}</li>
                <li>{t('法律法规要求或响应法律程序。', 'As required by laws and regulations or in response to legal processes.')}</li>
                <li>{t('保护我们的权利、财产或安全，或保护用户及公众的安全。', 'To protect our rights, property, or safety, or the safety of users and the public.')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('6. 您的权利', '6. Your Rights')}</h2>
              <p>
                {t(
                  '您有权访问、更正或删除您的个人信息。您也可以随时要求我们停止处理您的数据或注销您的账户。',
                  'You have the right to access, correct, or delete your personal information. You may also request that we stop processing your data or delete your account at any time.'
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('7. 联系我们', '7. Contact Us')}</h2>
              <p>
                {t(
                  '如果您对本隐私政策有任何疑问，请通过以下方式联系我们：',
                  'If you have any questions about this Privacy Policy, please contact us at:'
                )}<br />
                {t('电子邮箱：', 'Email: ')}jotoai@jototech.cn
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
