'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Phone, Mail, User, Building2, RefreshCw, ArrowRight, QrCode, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE = '/api';

interface CaptchaResponse {
  id: string;
  svg: string;
}

interface FormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  captchaText: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
    captchaText: '',
  });

  const [captchaId, setCaptchaId] = useState('');
  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const res = await fetch(`${API_BASE}/captcha`);
      const data: CaptchaResponse = await res.json();
      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.svg);
    } catch {
      // 加载失败时静默处理，保留占位样式
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setErrorMsg('');

    // 前端基础校验
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.captchaText.trim()) {
      setSubmitStatus('error');
      setErrorMsg('请填写所有必填项（姓名、邮箱、电话、验证码）');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.company ? `${form.name}（${form.company}）` : form.name,
          email: form.email,
          phone: form.phone,
          message: form.message || '（未填写需求描述）',
          captchaId,
          captchaText: form.captchaText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || '提交失败，请稍后重试');
      }

      setSubmitStatus('success');
      setForm({ name: '', company: '', email: '', phone: '', message: '', captchaText: '' });
      fetchCaptcha();
    } catch (err: any) {
      setSubmitStatus('error');
      setErrorMsg(err.message || '网络错误，请稍后重试');
      fetchCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-[#121212] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-end">

          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 rounded-full border border-[#f97316] text-[#f97316] text-xs font-bold uppercase tracking-wider">
                联系我们
              </span>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                开启企业级<br />
                <span className="text-[#f97316]">AI 时尚新时代</span>
              </h2>
              <p className="text-[#9ca3af] max-w-md leading-relaxed">
                FasiumAI 致力于为服装企业提供最前沿的 AI 设计解决方案。无论您是独立设计师还是大型服装集团，我们的专家团队都将为您提供全方位的技术支持。
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* WeChat Card */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a] flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="text-[#f97316] w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-white">微信咨询</h3>
                    <p className="text-sm text-[#6b7280]">扫描二维码 / 添加安全专家一对一沟通</p>
                  </div>
                  <div className="w-[150px] h-[150px] rounded-xl overflow-hidden bg-white p-1">
                    <img
                      src="/wechat-qr.png"
                      alt="企业微信二维码"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a] flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center shrink-0">
                  <Phone className="text-[#f97316] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">致电我们</h3>
                  <p className="text-[#f97316] font-semibold">+86 (021) 6566 1628</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a] flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center shrink-0">
                  <Mail className="text-[#f97316] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">发送邮件</h3>
                  <p className="text-[#f97316] font-semibold">jotoai@jototech.cn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[#1a1a1a] rounded-[2rem] p-8 md:p-10 border border-[#2a2a2a]"
          >
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-2">填写需求单</h2>
              <p className="text-sm text-[#9ca3af]">收到您的信息后，我们将在 1 个工作日内与您取得联系。</p>
            </div>

            {/* Success State */}
            {submitStatus === 'success' && (
              <div className="mb-6 flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-bold text-sm">提交成功！</p>
                  <p className="text-green-400/70 text-xs mt-1">我们将在 1 个工作日内与您联系，请注意查收邮件。</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {submitStatus === 'error' && (
              <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{errorMsg}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#d1d5db] flex items-center">
                    姓名<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="称呼"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 outline-none transition-all text-sm text-white placeholder-[#555555]"
                    />
                  </div>
                </div>
                {/* Company */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#d1d5db]">企业名称</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="企业全称"
                      className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 outline-none transition-all text-sm text-white placeholder-[#555555]"
                    />
                  </div>
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#d1d5db]">
                    邮箱<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="work@email.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 outline-none transition-all text-sm text-white placeholder-[#555555]"
                    />
                  </div>
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#d1d5db]">
                    电话<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="手机号"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#333333] rounded-xl focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 outline-none transition-all text-sm text-white placeholder-[#555555]"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#d1d5db]">需求描述</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="请简要描述您的应用场景…"
                  className="w-full p-4 bg-[#111111] border border-[#333333] rounded-xl focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 outline-none transition-all text-sm text-white placeholder-[#555555] h-[150px] resize-none"
                />
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#d1d5db]">
                  验证码<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    name="captchaText"
                    value={form.captchaText}
                    onChange={handleChange}
                    placeholder="输入验证码"
                    required
                    className="flex-1 p-3 bg-[#111111] border border-[#333333] rounded-xl focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/10 outline-none transition-all text-sm text-white placeholder-[#555555]"
                  />
                  <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 rounded-xl border border-[#333333] min-w-[110px] h-[46px]">
                    {captchaLoading ? (
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
                    ) : captchaSvg ? (
                      <img
                        src={captchaSvg}
                        alt="验证码"
                        className="flex-1 h-8 object-contain select-none"
                        draggable={false}
                      />
                    ) : (
                      <span className="font-mono text-base tracking-widest text-gray-500 italic select-none flex-1 text-center">
                        ····
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={fetchCaptcha}
                      className="text-gray-400 hover:text-[#f97316] transition-colors shrink-0"
                      title="刷新验证码"
                    >
                      <RefreshCw className={`w-4 h-4 ${captchaLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#f97316] text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#f97316]/20 hover:bg-[#f97316]/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    提交中…
                  </>
                ) : (
                  <>
                    提交申请
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
