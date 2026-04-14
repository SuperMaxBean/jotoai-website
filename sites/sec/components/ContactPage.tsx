'use client';

import React, { useState } from 'react';
import { RefreshCcw, Mail, Phone, MessageSquare, Building2, User, Send, CheckCircle2 } from 'lucide-react';
import { apiService } from '../src/services/api';
import { useLanguage } from '../src/contexts/LanguageContext';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    needs: '',
    captcha: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 实际对接时，这里会调用 apiService
      await apiService.submitContact({
        name: formData.name,
        company: formData.company,
        email: formData.email,
        jobTitle: 'N/A', // 示例中未包含职位字段
        needs: formData.needs
      });

      // 模拟成功
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      alert(t('提交失败，请稍后重试', 'Submission failed, please try again later'));
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
            onClick={() => setIsSuccess(false)}
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 items-start max-w-7xl mx-auto">

          {/* Left Side: Content */}
          <div className="lg:w-5/12 pt-4">
            <div className="inline-block px-3 py-1 mb-4 lg:mb-6 bg-blue-50 text-brand-blue rounded-full text-xs lg:text-sm font-semibold tracking-wide">
              {t('联系我们', 'Contact Us')}
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-[#0A1628] mb-4 lg:mb-6 leading-[1.2]">
              {t('开启企业级', 'Start Enterprise-grade')} <br className="hidden lg:block"/>
              <span className="text-brand-blue">{t('AI 安全新时代', 'AI Security')}</span>
            </h1>

            <p className="text-slate-600 text-base lg:text-lg leading-relaxed mb-8 lg:mb-10">
              {t(
                '唯客专注于大模型应用的安全与合规。无论是金融、教育还是政企场景，我们都能为您构建坚固的 AI 护栏，让每一次对话都安全可信。',
                'JOTO focuses on LLM application security and compliance. Whether in finance, education, or government, we build robust AI guardrails to make every conversation safe and trustworthy.'
              )}
            </p>

            <div className="flex flex-col gap-4 lg:gap-6">
              {/* WeChat Box */}
              <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-4 lg:gap-6 transition-transform hover:-translate-y-1 duration-300">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-50 p-1.5 rounded-xl shrink-0 border border-gray-100">
                    <img
                        src="/wechat-qr.png"
                        alt={t('微信二维码', 'WeChat QR Code')}
                        className="w-full h-full mix-blend-multiply opacity-90"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-[#0A1628] font-bold text-base lg:text-lg mb-1">
                         <MessageSquare size={18} className="text-brand-green fill-brand-green/20"/>
                         <span>{t('微信咨询', 'WeChat Consultation')}</span>
                    </div>
                    <p className="text-xs lg:text-sm text-slate-500 leading-snug">
                      {t('扫描二维码', 'Scan the QR code')}<br/>
                      {t('添加安全专家一对一沟通', 'to connect with a security expert')}
                    </p>
                </div>
              </div>

              {/* Other Contact Info */}
              <div className="space-y-3 lg:space-y-4 pl-2">
                <div className="flex items-center gap-4 group">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-slate-400 group-hover:text-brand-blue group-hover:border-brand-blue transition-colors shadow-sm">
                        <Phone size={16} />
                    </div>
                    <div>
                        <div className="text-[10px] lg:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{t('致电我们', 'Call Us')}</div>
                        <div className="text-[#0A1628] font-medium text-sm lg:text-base">+86 (021) 6566 1628</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 group">
                     <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-slate-400 group-hover:text-brand-blue group-hover:border-brand-blue transition-colors shadow-sm">
                        <Mail size={16} />
                    </div>
                    <div>
                        <div className="text-[10px] lg:text-xs text-slate-400 uppercase tracking-wider font-semibold mb-0.5">{t('发送邮件', 'Send Email')}</div>
                        <div className="text-[#0A1628] font-medium text-sm lg:text-base">jotoai@jototech.cn</div>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-7/12 w-full mt-4 lg:mt-0">
            <div className="bg-white rounded-2xl p-6 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
               {/* Decorative Gradient Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-green to-brand-blue"></div>

               <h2 className="text-xl lg:text-2xl font-bold text-[#0A1628] mb-2">
                 {t('填写需求单', 'Submit Your Request')}
               </h2>
               <p className="text-slate-500 mb-6 lg:mb-8 text-xs lg:text-sm">
                 {t('收到您的信息后，我们将在 1 个工作日内与您取得联系。', 'After receiving your information, we will contact you within 1 business day.')}
               </p>

               <form className="space-y-3 lg:space-y-5" onSubmit={handleSubmit}>
                 {/* Mobile: 2 Columns, Gap reduced */}
                 <div className="grid grid-cols-2 gap-3 lg:gap-5">
                    <div className="relative col-span-1">
                        <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('姓名', 'Name')} <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-3 lg:top-3.5 text-slate-400 pointer-events-none" />
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
                    <div className="relative col-span-1">
                        <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('企业名称', 'Company')} <span className="text-red-500">*</span></label>
                         <div className="relative">
                            <Building2 size={16} className="absolute left-3 top-3 lg:top-3.5 text-slate-400 pointer-events-none" />
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

                 <div>
                    <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('需求描述', 'Requirements')} <span className="text-red-500">*</span></label>
                    <textarea
                      name="needs"
                      rows={4}
                      value={formData.needs}
                      onChange={handleChange}
                      required
                      className="w-full p-3 lg:p-4 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none resize-none text-[#0A1628] text-xs lg:text-sm placeholder:text-slate-400"
                      placeholder={t('请简要描述您的应用场景...', 'Briefly describe your use case...')}
                    />
                 </div>

                 <div>
                    <label className="block text-xs lg:text-sm font-semibold text-[#334155] mb-1.5">{t('验证码', 'Captcha')} <span className="text-red-500">*</span></label>
                    <div className="flex gap-2 lg:gap-3">
                        <input
                          type="text"
                          name="captcha"
                          required
                          value={formData.captcha}
                          onChange={handleChange}
                          className="flex-1 h-10 lg:h-11 px-3 rounded-lg bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all outline-none text-[#0A1628] text-xs lg:text-sm"
                          placeholder={t('输入字符', 'Enter characters')}
                        />
                        <div className="w-24 lg:w-28 h-10 lg:h-11 bg-slate-100 rounded-lg flex items-center justify-center text-base lg:text-lg font-mono text-slate-700 font-bold relative overflow-hidden select-none border border-slate-200 tracking-wider">
                            <span className="relative z-10" style={{ letterSpacing: '4px' }}>5xA9</span>
                            {/* Noise overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] bg-[size:4px_4px]"></div>
                        </div>
                        <button type="button" className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:border-brand-blue transition-colors">
                            <RefreshCcw size={16} />
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
