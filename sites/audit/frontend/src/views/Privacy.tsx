'use client';
import React from 'react';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <>    <div className="bg-slate-50 min-h-screen pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-slate-100"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-8">隐私政策</h1>
          <p className="text-slate-500 mb-8 text-sm">最近更新日期：2024年3月3日</p>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">1. 引言</h2>
              <p>
                唯客智审（以下简称“我们”）非常重视您的隐私。本隐私政策旨在说明我们如何收集、使用、披露、处理和保护您在使用我们的 AI 合同审查服务时提供给我们的信息。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">2. 我们收集的信息</h2>
              <p>在您使用我们的服务过程中，我们可能会收集以下类型的信息：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>账户信息：</strong> 当您注册账户时，我们会收集您的姓名、电子邮箱、联系电话及所属机构信息。</li>
                <li><strong>合同数据：</strong> 您上传进行审查的合同文件。我们深知合同数据的敏感性，所有上传的文件均经过加密处理。</li>
                <li><strong>使用数据：</strong> 关于您如何访问和使用服务的信息，包括您的 IP 地址、浏览器类型、访问时间等。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. 信息的使用</h2>
              <p>我们收集的信息主要用于以下用途：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>提供、维护和改进我们的 AI 合同审查服务。</li>
                <li>处理您的请求并提供客户支持。</li>
                <li>向您发送服务更新、安全警报和支持消息。</li>
                <li><strong>关于 AI 训练：</strong> 除非获得您的明确许可，否则我们不会使用您的原始合同数据来训练我们的通用基础模型。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. 数据安全</h2>
              <p>
                我们采取了行业领先的安全措施来保护您的信息，包括但不限于 SSL/TLS 加密传输、静态数据加密、严格的访问控制和定期的安全审计。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. 信息的共享与披露</h2>
              <p>
                我们不会将您的个人信息或合同数据出售给第三方。我们仅在以下情况下共享您的信息：
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>获得您的明确同意。</li>
                <li>法律法规要求或响应法律程序。</li>
                <li>保护我们的权利、财产或安全，或保护用户及公众的安全。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">6. 您的权利</h2>
              <p>
                您有权访问、更正或删除您的个人信息。您也可以随时要求我们停止处理您的数据或注销您的账户。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">7. 联系我们</h2>
              <p>
                如果您对本隐私政策有任何疑问，请通过以下方式联系我们：<br />
                电子邮箱：jotoai@jototech.cn
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
    </>
  );
}