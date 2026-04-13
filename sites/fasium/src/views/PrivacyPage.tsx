'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">隐私政策</h1>
          <div className="prose prose-invert prose-orange max-w-none text-gray-400 space-y-6">
            <p>最后更新日期：2026年3月8日</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. 信息收集</h2>
              <p>
                当您使用 FasiumAI 时，我们可能会收集以下类型的信息：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>账户信息：如姓名、电子邮件地址和联系方式。</li>
                <li>设计数据：您在平台上创建的灵感图、花型和设计稿。</li>
                <li>使用数据：有关您如何与平台交互的技术信息，包括 IP 地址、浏览器类型和访问时间。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. 信息使用</h2>
              <p>
                我们使用收集的信息来：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>提供、维护和改进我们的 AI 设计服务。</li>
                <li>处理您的请求并提供客户支持。</li>
                <li>发送有关产品更新、安全警报和支持消息的通知。</li>
                <li>分析使用趋势以优化用户体验。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. 数据安全</h2>
              <p>
                我们采取商业上合理的物理、技术和管理措施来保护您的个人信息免受未经授权的访问、使用或披露。您的设计作品是您的知识产权，我们承诺不会在未经您许可的情况下将其用于训练我们的基础模型或泄露给第三方。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. 信息共享</h2>
              <p>
                我们不会将您的个人信息出售给第三方。我们仅在以下情况下共享信息：
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>获得您的明确同意。</li>
                <li>法律要求或为了保护我们的权利。</li>
                <li>与协助我们运营平台的受信任服务提供商合作（受严格的保密协议约束）。</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. 您的权利</h2>
              <p>
                您有权访问、更正或删除您的个人信息。如果您对我们的隐私实践有任何疑问，请通过联系页面与我们取得联系。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. 政策更新</h2>
              <p>
                我们可能会不时更新本隐私政策。重大变更将通过平台通知或电子邮件告知。
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
