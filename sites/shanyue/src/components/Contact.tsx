"use client";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building2,
  Clock,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();

  const CONTACT_INFO = [
    {
      icon: Phone,
      label: t("咨询热线", "Hotline"),
      value: "+86 (021) 6566 1628",
      desc: t("工作日 9:00-18:00", "Weekdays 9:00-18:00"),
    },
    {
      icon: Mail,
      label: t("商务邮箱", "Business Email"),
      value: "jotoai@jototech.cn",
      desc: t("24 小时内回复", "Reply within 24 hours"),
    },
    {
      icon: MapPin,
      label: t("公司地址", "Address"),
      value: t("上海市杨浦区", "Yangpu District, Shanghai"),
      desc: t("欢迎来访参观", "Visitors welcome"),
    },
    {
      icon: Clock,
      label: t("服务时间", "Service Hours"),
      value: t("7 x 24 小时", "24/7"),
      desc: t("紧急问题全天候响应", "Round-the-clock response for urgent issues"),
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    org: "",
    phone: "",
    email: "",
    role: "",
    message: "",
    captchaText: "",
  });
  const [captcha, setCaptcha] = useState<{ captchaId: string; svg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const loadCaptcha = async () => {
    try {
      const res = await fetch('/api/captcha');
      const data = await res.json();
      setCaptcha(data);
    } catch {}
  };

  useState(() => { loadCaptcha(); });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captcha) { setErrorMessage(t('验证码加载失败，请刷新页面', 'Captcha failed to load, please refresh')); setSubmitStatus('error'); return; }
    setLoading(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/shanyue/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.org,
          email: formData.email,
          phone: formData.phone,
          message: formData.role ? `[${formData.role}] ${formData.message}` : formData.message,
          captchaId: captcha.captchaId,
          captchaText: formData.captchaText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('提交失败', 'Submission failed'));
      setSubmitStatus('success');
      setFormData({ name: '', org: '', phone: '', email: '', role: '', message: '', captchaText: '' });
      loadCaptcha();
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMessage(err.message || t('提交失败，请稍后重试', 'Submission failed, please try again'));
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
            <MessageSquare className="h-4 w-4" />
            {t('联系我们', 'Contact Us')}
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0A1A2F] sm:text-4xl">
            {t('期待与您合作', 'Looking Forward to Working with You')}
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {t(
              '留下您的需求，我们的教育行业顾问将在 24 小时内与您联系',
              'Leave your requirements, and our education industry consultant will contact you within 24 hours'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#7c3aed] to-indigo-700 p-8 text-white">
              <Building2 className="h-10 w-10 mb-4 text-purple-200" />
              <h3 className="text-xl font-semibold mb-2">{t('闪阅 AI 科技', 'iMark AI')}</h3>
              <p className="text-sm text-purple-200 leading-relaxed">
                {t(
                  '专注于教育领域的人工智能技术研发与应用，致力于用 AI 技术革新教育评估方式。',
                  'Focused on AI technology R&D and applications in education, committed to revolutionizing educational assessment with AI.'
                )}
              </p>
            </div>

            {CONTACT_INFO.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm"
                >
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">
                      {info.label}
                    </p>
                    <p className="text-sm font-semibold text-[#0A1A2F]">
                      {info.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{info.desc}</p>
                  </div>
                </div>
              );
            })}

            {/* 微信扫码咨询 */}
            <div className="flex items-center gap-5 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
              <div className="shrink-0 rounded-xl bg-purple-50 p-2">
                <img
                  src="/wechat-qr.png"
                  alt={t('微信扫码咨询', 'Scan QR to chat on WeChat')}
                  className="h-28 w-28 rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">
                  {t('微信咨询', 'WeChat')}
                </p>
                <p className="text-sm font-semibold text-[#0A1A2F]">
                  {t('扫码添加教育顾问', 'Scan to add our advisor')}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('获取产品资料与报价', 'Get product info & pricing')}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white border border-slate-100 p-8 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#0A1A2F] mb-6">
                {t('提交咨询', 'Submit Inquiry')}
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('姓名', 'Name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t('请输入您的姓名', 'Enter your name')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('学校/机构', 'School/Organization')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="org"
                    value={formData.org}
                    onChange={handleChange}
                    required
                    placeholder={t('请输入学校或机构名称', 'Enter school or organization name')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('手机号', 'Phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={t('请输入手机号码', 'Enter phone number')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('邮箱', 'Email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('请输入邮箱地址', 'Enter email address')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('您的角色', 'Your Role')}
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="">{t('请选择', 'Please select')}</option>
                    <option value="teacher">{t('一线教师', 'Teacher')}</option>
                    <option value="admin">{t('教务管理', 'Academic Admin')}</option>
                    <option value="principal">{t('校长/院长', 'Principal/Dean')}</option>
                    <option value="edu-bureau">{t('教育局', 'Education Bureau')}</option>
                    <option value="training">{t('教培机构', 'Training Institution')}</option>
                    <option value="other">{t('其他', 'Other')}</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('需求描述', 'Requirements')} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder={t(
                      '请简要描述您的需求，例如：学校规模、年级范围、考试频次等',
                      'Briefly describe your needs, e.g., school size, grade range, exam frequency, etc.'
                    )}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {t('验证码', 'Captcha')} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="captchaText"
                      value={formData.captchaText}
                      onChange={handleChange}
                      required
                      placeholder={t('请输入验证码', 'Enter captcha')}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                    {captcha?.svg && (
                      <img src={captcha.svg} alt="captcha" className="h-10 rounded border border-slate-200 cursor-pointer" onClick={loadCaptcha} />
                    )}
                  </div>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  {t('提交成功！我们会尽快与您联系。', 'Submitted successfully! We will contact you shortly.')}
                </div>
              )}
              {submitStatus === 'error' && errorMessage && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-xl sm:w-auto disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {loading ? t('提交中...', 'Submitting...') : t('提交咨询', 'Submit Inquiry')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
