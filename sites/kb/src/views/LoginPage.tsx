'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Mail, Globe, MessageSquare, 
  ArrowRight, Shield, Lock, Layers
} from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100"
      >
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Layers className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">JOTO</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">欢迎回来</h1>
            <p className="text-slate-500 mt-2">请登录您的企业账户</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="企业邮箱" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                placeholder="密码" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]">
              继续登录
            </button>
          </div>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">或者通过以下方式登录</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold text-[10px]">飞</div>
              <span className="text-sm font-bold text-slate-700">飞书</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
              <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center text-white font-bold text-[10px]">微</div>
              <span className="text-sm font-bold text-slate-700">微信</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
              <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold text-[10px]">MS</div>
              <span className="text-sm font-bold text-slate-700">Microsoft</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
              <Building2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              <span className="text-sm font-bold text-slate-700">企业 SSO</span>
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            登录即代表您同意我们的 <a href="#" className="text-indigo-600 hover:underline">服务条款</a> 和 <a href="#" className="text-indigo-600 hover:underline">隐私政策</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
