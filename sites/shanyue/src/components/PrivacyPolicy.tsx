"use client";

import { ShieldCheck, Lock, Eye, FileText, Server, UserCheck } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();

  const SECTIONS = [
    {
      icon: FileText,
      title: t("信息收集与使用", "Information Collection & Usage"),
      content: [
        t(
          "我们仅收集为提供阅卷服务所必需的信息，包括：学校/机构名称、联系人姓名、联系方式、考试试卷图像数据。",
          "We only collect information necessary for providing grading services, including: school/organization name, contact person name, contact information, and exam paper image data."
        ),
        t(
          "试卷图像数据仅用于 AI 阅卷处理，处理完成后根据客户配置的保留策略自动清除或归档。",
          "Exam paper image data is only used for AI grading processing, and is automatically cleared or archived after processing based on the client's configured retention policy."
        ),
        t(
          "我们不会将您的数据用于任何与阅卷服务无关的用途，包括但不限于广告投放、用户画像等。",
          "We will not use your data for any purpose unrelated to grading services, including but not limited to advertising, user profiling, etc."
        ),
      ],
    },
    {
      icon: Lock,
      title: t("数据安全措施", "Data Security Measures"),
      content: [
        t(
          "所有数据传输均采用 TLS 1.3 加密协议，确保传输过程中的数据安全。",
          "All data transmission uses TLS 1.3 encryption protocol to ensure data security during transmission."
        ),
        t(
          "静态数据采用 AES-256 加密存储，即使存储介质丢失也无法被读取。",
          "Data at rest is encrypted with AES-256, making it unreadable even if storage media is lost."
        ),
        t(
          "支持本地离线部署模式，数据完全不离开客户的物理网络环境。",
          "Supports local offline deployment mode, where data never leaves the client's physical network environment."
        ),
        t(
          "定期进行第三方安全审计和渗透测试，确保系统安全性。",
          "Regular third-party security audits and penetration tests are conducted to ensure system security."
        ),
      ],
    },
    {
      icon: Server,
      title: t("数据存储与保留", "Data Storage & Retention"),
      content: [
        t(
          "私有化部署方案中，所有数据存储在客户自有服务器上，闪阅 AI 无法访问。",
          "In private deployment, all data is stored on the client's own servers, and 闪阅 AI cannot access it."
        ),
        t(
          "云端方案的数据存储于通过等保三级认证的数据中心，物理位置位于中国大陆境内。",
          "Cloud solution data is stored in data centers certified with Level 3 security protection, physically located within mainland China."
        ),
        t(
          "考试数据默认保留 180 天，客户可根据需求自定义保留周期。",
          "Exam data is retained for 180 days by default; clients can customize the retention period as needed."
        ),
        t(
          "数据删除采用安全擦除方式，确保不可恢复。",
          "Data deletion uses secure erasure methods to ensure non-recoverability."
        ),
      ],
    },
    {
      icon: UserCheck,
      title: t("用户权利", "User Rights"),
      content: [
        t(
          "您有权随时查阅、更正或删除您的个人信息和考试数据。",
          "You have the right to access, correct, or delete your personal information and exam data at any time."
        ),
        t(
          "您有权要求我们导出您的全部数据，我们将在 5 个工作日内提供结构化数据包。",
          "You have the right to request export of all your data, and we will provide a structured data package within 5 business days."
        ),
        t(
          "您有权撤回此前给予的数据处理授权，撤回后我们将停止处理并安全删除相关数据。",
          "You have the right to withdraw previously given data processing authorization; after withdrawal, we will stop processing and securely delete related data."
        ),
        t(
          "如对数据处理有任何疑问，可通过 jotoai@jototech.cn 联系我们的数据保护官。",
          "For any questions about data processing, you can contact our Data Protection Officer at jotoai@jototech.cn."
        ),
      ],
    },
    {
      icon: Eye,
      title: t("第三方共享", "Third-Party Sharing"),
      content: [
        t(
          "我们不会将您的数据出售、出租或以其他方式提供给任何第三方。",
          "We will not sell, rent, or otherwise provide your data to any third party."
        ),
        t(
          "仅在法律法规明确要求的情况下，我们可能向执法机构提供必要的数据。",
          "Only when explicitly required by laws and regulations may we provide necessary data to law enforcement agencies."
        ),
        t(
          "如需使用第三方服务（如云计算基础设施），我们会确保第三方遵守同等的数据保护标准。",
          "When third-party services (such as cloud computing infrastructure) are needed, we ensure third parties comply with equivalent data protection standards."
        ),
      ],
    },
    {
      icon: ShieldCheck,
      title: t("合规与认证", "Compliance & Certification"),
      content: [
        t(
          "本系统严格遵守《中华人民共和国个人信息保护法》（PIPL）及相关法规。",
          "This system strictly complies with the Personal Information Protection Law (PIPL) of the People's Republic of China and related regulations."
        ),
        t(
          "通过国家信息安全等级保护三级认证。",
          "Certified with National Information Security Level 3 Protection."
        ),
        t(
          "遵循《教育部教育数据管理办法》相关规定。",
          "Complies with relevant provisions of the Ministry of Education's Data Management Measures."
        ),
        t(
          "本隐私政策最后更新日期：2026 年 3 月 1 日。如有重大变更，我们将提前 30 天通知。",
          "This privacy policy was last updated on March 1, 2026. We will notify you 30 days in advance of any significant changes."
        ),
      ],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <ShieldCheck className="h-4 w-4" />
            {t('法律条款', 'Legal Terms')}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('隐私政策', 'Privacy Policy')}
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t(
              '闪阅 AI 全科阅卷系统高度重视您的数据安全与隐私保护',
              '闪阅 AI All-Subject Grading system places the highest priority on your data security and privacy protection'
            )}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {t(
              '生效日期：2026 年 1 月 1 日 | 最后更新：2026 年 3 月 1 日',
              'Effective Date: January 1, 2026 | Last Updated: March 1, 2026'
            )}
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#0A1A2F]">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((paragraph, pIndex) => (
                    <li
                      key={pIndex}
                      className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300" />
                      {paragraph}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-2xl bg-slate-50 border border-slate-100 p-8 text-center">
          <p className="text-sm text-slate-500">
            {t(
              '如您对本隐私政策有任何疑问，请联系我们的数据保护官：',
              'If you have any questions about this privacy policy, please contact our Data Protection Officer:'
            )}
          </p>
          <p className="mt-2 text-sm font-semibold text-purple-700">
            jotoai@jototech.cn
          </p>
        </div>
      </div>
    </section>
  );
}
