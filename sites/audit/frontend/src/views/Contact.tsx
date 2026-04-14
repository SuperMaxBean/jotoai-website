'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { apiClient } from '../utils/api';
import { useLanguage } from '../contexts/LanguageContext';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function Contact() {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    captchaText: ''
  });

  const [captcha, setCaptcha] = useState<{ id: string; svg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const loadCaptcha = async () => {
    try {
      const captchaData = await apiClient.getCaptcha();
      setCaptcha(captchaData);
    } catch (error) {
      console.error('Failed to load captcha:', error);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.captchaText) {
      setErrorMessage(t('请填写所有必填字段', 'Please fill in all required fields'));
      setSubmitStatus('error');
      return;
    }

    if (!captcha) {
      setErrorMessage(t('验证码加载失败，请刷新页面', 'CAPTCHA failed to load, please refresh the page'));
      setSubmitStatus('error');
      return;
    }

    setLoading(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await apiClient.submitContactForm({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        captchaId: captcha.id,
        captchaText: formData.captchaText
      });

      setSubmitStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: '',
        captchaText: ''
      });
      loadCaptcha();
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || t('提交失败，请稍后重试', 'Submission failed, please try again later'));
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Text and Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight mb-8">
                {t('准备好利用 AI', 'Ready to Leverage AI')}<br />
                <span className="text-blue-600 font-black">{t('开启智能合同审查新时代', 'to Start a New Era of Smart Contract Review')}</span>{t('了吗？', '?')}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                {t(
                  '唯客智审专注于法律合规场景 AI 审查技术，为企业与法律机构定制 AI 合同审查解决方案。无论是日常合同批改、大型项目尽调，还是合规风险分析，我们都能帮助您突破效率瓶颈，沉淀数字资产，探索 AI 法务的无限可能。',
                  'WeiKe Audit specializes in AI review technology for legal compliance scenarios, providing customized AI contract review solutions for enterprises and legal institutions. Whether it is routine contract review, large-scale project due diligence, or compliance risk analysis, we help you break through efficiency bottlenecks, accumulate digital assets, and explore the limitless possibilities of AI-powered legal work.'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-12">
              <div className="text-center">
                <div className="bg-white p-2 rounded-xl shadow-md border border-slate-100 mb-3">
                  <img
                    src="/wechat-qr.png"
                    alt={t('微信咨询', 'WeChat')}
                    className="w-32 h-32"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-sm font-bold text-slate-900">{t('微信咨询', 'WeChat')}</div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{t('电话', 'Phone')}</div>
                  <div className="text-lg font-bold text-slate-900">+86 (021) 6566 1628</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{t('邮箱', 'Email')}</div>
                  <div className="text-lg font-bold text-slate-900">jotoai@jototech.cn</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10"
          >
            <h2 className="text-xl font-bold text-slate-900 mb-8">
              {t('留下您的联系方式，我们将在一个工作日内回复！', 'Leave your contact info and we will get back to you within one business day!')}
            </h2>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                {t('提交成功！我们会尽快与您联系。', 'Submitted successfully! We will contact you shortly.')}
              </div>
            )}

            {submitStatus === 'error' && errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('姓名', 'Name')} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t('请输入您的姓名', 'Enter your name')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('公司 / 机构名称', 'Company / Organization')}</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t('请输入您的公司或机构名称', 'Enter your company or organization name')}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('邮箱', 'Email')} <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t('请输入您的电子邮箱', 'Enter your email address')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('电话号码', 'Phone Number')} <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t('请输入您的联系电话', 'Enter your phone number')}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('留言', 'Message')} <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={t('请描述您的具体需求...', 'Describe your specific needs...')}
                ></textarea>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t('验证码', 'CAPTCHA')} <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="captchaText"
                    value={formData.captchaText}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder={t('请输入验证码', 'Enter CAPTCHA')}
                    required
                  />
                </div>
                <div className="mt-7 flex items-center space-x-2">
                  {captcha && (
                    <img
                      src={captcha.svg}
                      alt={t('验证码', 'CAPTCHA')}
                      className="bg-slate-100 px-2 py-1 rounded-xl border border-slate-200 h-14 cursor-pointer"
                      onClick={loadCaptcha}
                    />
                  )}
                  <button
                    type="button"
                    onClick={loadCaptcha}
                    className="p-3 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-xl shadow-blue-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('提交中...', 'Submitting...') : t('提交', 'Submit')}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
