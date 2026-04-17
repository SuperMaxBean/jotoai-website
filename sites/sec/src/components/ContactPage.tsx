'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw, Mail, Phone, MessageSquare, Building2, User, Send, CheckCircle2 } from 'lucide-react';
import { apiService } from '@/services/api';
import { getTrafficSource } from '@/services/traffic-source';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    needs: '',
    captchaText: ''
  });
  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const data = await apiService.getCaptcha();
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.svg);
    } catch (e) {
      console.error('验证码获取失败', e);
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!captchaId) {
      setErrorMsg(t('请先获取验证码', 'Please get the captcha first'));
      return;
    }
    if (!formData.captchaText.trim()) {
      setErrorMsg(t('请输入验证码', 'Please enter the captcha'));
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.submitContact({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        message: formData.needs,
        captchaId: captchaId,
        captchaText: formData.captchaText,
        trafficSource: getTrafficSource(),
      });
      setIsSuccess(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t('提交失败，请稍后重试', 'Submission failed, please try again later');
      setErrorMsg(msg);
      // 提交失败时刷新验证码
      fetchCaptcha();
      setFormData(prev => ({ ...prev, captchaText: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] pt-32 flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('提交成功', 'Submission Successful')}</h2>
          <p className="text-slate-600 mb-8">{t('感谢您的关注！我们的安全专家将在 1 个工作日内与您联系。', 'Thank you for your interest! Our security experts will contact you within 1 business day.')}</p>
          <button
            onClick={() => { setIsSuccess(false); setFormData({ name: '', company: '', email: '', phone: '', needs: '', captchaText: '' }); fetchCaptcha(); }}
            className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
          >
            {t('返回', 'Go Back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-24 pb-12 lg:pt-32 lg:pb-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-stretch max-w-7xl mx-auto">

          {/* Left Side: Content */}
          <div className="lg:w-5/12 pt-4 flex flex-col">
            <div className="inline-block px-3 py-1 mb-4 lg:mb-6 bg-blue-50 text-brand-blue rounded-full text-xs lg:text-sm font-semibold tracking-wide">
              {t('联系我们', 'Contact Us')}
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-[#0A1628] mb-4 lg:mb-6 leading-[1.2]">
              {t('开启企业级', 'Start Enterprise-grade')} <br className="hidden lg:block"/>
              <span className="text-brand-blue">{t('AI 安全新时代', 'AI Security')}</span>
            </h1>
            <p className="text-slate-600 text-base lg:text-lg mb-8 lg:mb-10 leading-relaxed">
              {t(
                '唯客专注于大模型应用的安全与合规。无论是金融、教育还是政企场景，我们都能为您构建坚固的 AI 护栏，让每一次对话都安全可信。',
                'JOTO focuses on LLM application security and compliance. Whether in finance, education, or government, we build robust AI guardrails to make every conversation safe and trustworthy.'
              )}
            </p>
            <div className="space-y-4 lg:space-y-5 flex-1">
              <div className="flex items-start gap-4 p-4 lg:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={20} className="text-brand-blue" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm lg:text-base mb-1">{t('微信咨询', 'WeChat Consultation')}</p>
                  <p className="text-slate-500 text-xs lg:text-sm mb-3">{t('扫描二维码', 'Scan the QR code')}<br/>{t('添加安全专家一对一沟通', 'to connect with a security expert')}</p>
                  <img src="https://admin.jotoai.com/brand/wechat-qr.png?v=1" alt={t('微信二维码', 'WeChat QR Code')} className="w-32 h-32 object-contain rounded-lg border border-gray-100" />
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 lg:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-brand-blue" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm lg:text-base mb-1">{t('致电我们', 'Call Us')}</p>
                  <p className="text-slate-500 text-xs lg:text-sm">+86 (021) 6566 1628</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 lg:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 lg:w-11 lg:h-11 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-brand-blue" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm lg:text-base mb-1">{t('发送邮件', 'Send Email')}</p>
                  <p className="text-slate-500 text-xs lg:text-sm">jotoai@jototech.cn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-7/12 w-full flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-10 border border-gray-100 flex flex-col flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900 mb-1 lg:mb-2">{t('填写需求单', 'Submit Your Request')}</h2>
              <p className="text-slate-500 text-sm mb-6 lg:mb-8">{t('收到您的信息后，我们将在 1 个工作日内与您取得联系。', 'After receiving your information, we will contact you within 1 business day.')}</p>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5 flex flex-col flex-1">
                <div className="grid grid-cols-2 gap-3 lg:gap-5">
                  <div className="col-span-1">
                    <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('姓名', 'Name')} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-10 lg:h-11 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-[#0A1628] text-xs lg:text-sm placeholder:text-slate-400"
                        placeholder={t('称呼', 'Your name')}
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('企业名称', 'Company')} <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full h-10 lg:h-11 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-[#0A1628] text-xs lg:text-sm placeholder:text-slate-400"
                        placeholder={t('企业全称', 'Company name')}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 lg:gap-5">
                  <div className="col-span-1">
                    <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('邮箱', 'Email')} <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-10 lg:h-11 px-3 lg:px-4 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-[#0A1628] text-xs lg:text-sm placeholder:text-slate-400"
                      placeholder="work@email.com"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('电话', 'Phone')} <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-10 lg:h-11 px-3 lg:px-4 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-[#0A1628] text-xs lg:text-sm placeholder:text-slate-400"
                      placeholder={t('手机号', 'Phone number')}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-1">
                  <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('需求描述', 'Requirements')} <span className="text-red-500">*</span></label>
                  <textarea
                    name="needs"
                    value={formData.needs}
                    onChange={handleChange}
                    required
                    className="w-full flex-1 min-h-[80px] p-3 lg:p-4 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none resize-none text-[#0A1628] text-xs lg:text-sm placeholder:text-slate-400"
                    placeholder={t('请简要描述您的应用场景...', 'Briefly describe your use case...')}
                  />
                </div>
                <div>
                  <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('验证码', 'Captcha')} <span className="text-red-500">*</span></label>
                  <div className="flex gap-2 lg:gap-3">
                    <input
                      type="text"
                      name="captchaText"
                      required
                      value={formData.captchaText}
                      onChange={handleChange}
                      className="flex-1 h-10 lg:h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-[#0A1628] text-xs lg:text-sm"
                      placeholder={t('输入验证码字符', 'Enter captcha characters')}
                    />
                    <div className="w-28 lg:w-32 h-10 lg:h-11 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50">
                      {captchaLoading ? (
                        <span className="text-xs text-slate-400">{t('加载中...', 'Loading...')}</span>
                      ) : captchaSvg ? (
                        <img src={captchaSvg} alt={t('验证码', 'Captcha')} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400">{t('点击刷新', 'Click to refresh')}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      disabled={captchaLoading}
                      className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-colors disabled:opacity-50"
                      title={t('刷新验证码', 'Refresh captcha')}
                    >
                      <RefreshCcw size={16} className={captchaLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 lg:h-12 bg-brand-blue hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-lg font-bold text-sm lg:text-base shadow-lg shadow-blue-500/25 transition-all mt-2 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? t('提交中...', 'Submitting...') : t('提交申请', 'Submit')}
                  <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
