"use client";

import React, { useState } from 'react';
import { Hexagon, Zap, ArrowRight, Lock, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4 relative overflow-hidden font-sans pt-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-10">
            <div className="relative flex items-center justify-center">
                <Hexagon className="w-14 h-14 text-[#7c3aed] fill-[#7c3aed]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white fill-white" />
                </div>
            </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0A1A2F] mb-2">{t('欢迎回来', 'Welcome Back')}</h1>
            <p className="text-slate-500 text-sm">{t('登录您的闪阅管理后台', 'Sign in to your iMark dashboard')}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {t('账号 / 邮箱', 'Account / Email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none transition-all hover:bg-white placeholder:text-slate-400"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  {t('密码', 'Password')}
                </label>
                <a href="#" className="text-xs text-[#7c3aed] font-medium hover:underline">{t('忘记密码?', 'Forgot password?')}</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none transition-all hover:bg-white placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#7c3aed] text-white font-bold rounded-lg hover:bg-[#6d28d9] transition-all shadow-lg shadow-purple-200 mt-2 flex items-center justify-center gap-2 group"
            >
              {t('登录', 'Sign In')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('还没有账号?', "Don't have an account?")}{' '}
              <a href="#" className="text-[#7c3aed] font-bold hover:underline">
                {t('联系客服开通', 'Contact us to get started')}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">&copy; 2026 {t('闪阅 AI', 'iMark')}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
