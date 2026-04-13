'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowDown, ArrowRight, Hourglass, SlidersHorizontal, SearchX, Wallet, Settings, ShieldAlert, Columns, Building2, Factory, Landmark, Cpu, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

export default function Home() {
  return (
    <>    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>JOTO AI 旗下产品</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6"
              >
                唯客智审<br />
                <motion.span 
                  initial={{ backgroundSize: "0% 100%" }}
                  animate={{ backgroundSize: "100% 100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="text-blue-600 bg-gradient-to-r from-blue-600 to-blue-400 bg-no-repeat bg-bottom pb-2"
                  style={{ backgroundImage: "linear-gradient(transparent 80%, rgba(37, 99, 235, 0.2) 0%)" }}
                >
                  AI 赋能
                </motion.span> 新一代<br />
                合同审查平台
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-slate-600 mb-8 font-medium"
              >
                [ 告别繁琐审查，拥抱智能风控 ]
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-slate-500 mb-10 max-w-lg leading-relaxed"
              >
                将合同审查时间从数小时缩短至几分钟，以95%的准确率，为企业规避潜在风险，重塑法务工作流。
              </motion.p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/contact" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors w-full sm:w-auto"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    预约演示
                  </Link>
                </motion.div>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#features" className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors"
                >
                  了解核心功能
                  <ArrowDown className="ml-2 h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              {/* Mockup UI Graphic */}
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 relative z-10">
                <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 ml-4 bg-slate-100 rounded text-xs text-center py-1 text-slate-400">https://ai-review.internal/contract/v2</div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Contract Title */}
                    <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ delay: 1, duration: 0.8 }} className="h-4 bg-slate-300 rounded mb-4 mx-auto"></motion.div>
                    
                    {/* Section 1 */}
                    <div className="h-2.5 bg-slate-200 rounded w-1/4 mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-2 bg-slate-100 rounded"></div>
                      <div className="h-2 bg-slate-100 rounded"></div>
                      <div className="h-2 bg-slate-100 rounded w-5/6"></div>
                    </div>

                    {/* Section 2 (The one with risk) */}
                    <div className="mt-6 h-2.5 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-2 bg-red-100 rounded relative overflow-hidden">
                       <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute top-0 left-0 h-full bg-red-400 w-3/4"
                       ></motion.div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded w-4/5"></div>
                    <div className="h-2 bg-slate-100 rounded"></div>

                    {/* Section 3 */}
                    <div className="mt-6 h-2.5 bg-slate-200 rounded w-1/4 mb-2"></div>
                    <div className="h-2 bg-slate-100 rounded w-full"></div>
                    <div className="h-2 bg-slate-100 rounded w-2/3"></div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="bg-slate-50 rounded-lg p-4 border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-sm">AI 风险分析</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">高风险 (1)</span>
                    </div>
                    <motion.div 
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.5 }}
                      className="bg-white border border-red-100 rounded p-3 shadow-sm mb-3"
                    >
                      <div className="flex items-start space-x-2 text-red-600 mb-2">
                        <ShieldAlert className="h-4 w-4 mt-0.5" />
                        <span className="text-sm font-medium">违约金条款缺失</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">第5.2条未明确规定逾期付款的违约责任。</p>
                      <button className="w-full text-xs border border-blue-200 text-blue-600 py-1.5 rounded hover:bg-blue-50 transition-colors">采纳 AI 修改建议</button>
                    </motion.div>
                    <div className="bg-amber-50 border border-amber-100 rounded p-3 shadow-sm">
                      <div className="flex items-center space-x-2 text-amber-600 mb-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm font-medium">争议解决条款建议</span>
                      </div>
                      <div className="h-2 bg-amber-200/50 rounded w-2/3"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
              {/* Decorative background element */}
              <motion.div 
                animate={{ rotate: [0, 2, -2, 0], scale: [1, 1.02, 0.98, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-10 w-full h-full border-2 border-blue-100 rounded-xl -z-10"
              ></motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">传统合同审查正在制约企业效率</h2>
            <p className="text-slate-500">法务团队面临的挑战日益严峻，人工审查模式已无法满足现代企业的快节奏需求。</p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: Hourglass, title: '效率低下', desc: '人工阅读耗时长，面对大量合同时响应滞后，严重拖慢业务签署流程。', color: 'text-blue-500', bg: 'bg-blue-50' },
              { icon: SlidersHorizontal, title: '标准不一', desc: '不同人员审查尺度差异大，难以统一企业内部的风控标准 and 合规要求。', color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { icon: SearchX, title: '风险遗漏', desc: '疲劳作业容易导致关键风险点被忽略，给企业带来潜在的法律与经济损失。', color: 'text-red-500', bg: 'bg-red-50' },
              { icon: Wallet, title: '成本高昂', desc: '资深法务和外部律师的人力成本高企，重复性劳动占据大量高价值资源。', color: 'text-amber-500', bg: 'bg-amber-50' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Core Capabilities */}
      <section id="features" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-slate-800 pb-8"
          >
            <div>
              <div className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-2">Core Capabilities</div>
              <h2 className="text-4xl font-bold">释放法务潜力，聚焦核心价值</h2>
            </div>
            <p className="text-slate-400 max-w-md mt-4 md:mt-0 text-sm">
              唯客智审不仅是工具，更是企业法务数字化的基础设施，帮助企业沉淀风控规则和数据资产。
            </p>
          </motion.div>

          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-8"
              >
                 <div className="flex items-center justify-between mb-6">
                   <span className="text-sm font-medium text-slate-300">规则配置中心</span>
                   <Settings className="h-4 w-4 text-slate-500" />
                 </div>
                 <div className="space-y-4">
                   <motion.div 
                    whileHover={{ x: 5 }}
                    className="bg-slate-800 border border-slate-600 rounded-lg p-4 flex justify-between items-center"
                   >
                     <div className="flex items-center space-x-3">
                       <div className="bg-blue-500/20 p-2 rounded text-blue-400"><FileText className="h-4 w-4" /></div>
                       <div>
                         <div className="text-sm font-medium">采购合同审查标准 V2.0</div>
                         <div className="text-xs text-slate-500">包含 48 项强制检查点</div>
                       </div>
                     </div>
                     <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">已启用</span>
                   </motion.div>
                   <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex justify-between items-center opacity-70">
                     <div className="flex items-center space-x-3">
                       <div className="bg-slate-700 p-2 rounded text-slate-400"><ShieldAlert className="h-4 w-4" /></div>
                       <div>
                         <div className="text-sm font-medium">NDA 风险过滤器</div>
                         <div className="text-xs text-slate-500">包含 12 项关键词匹配</div>
                       </div>
                     </div>
                   </div>
                 </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <div className="text-6xl font-black text-slate-800 mb-6">01</div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg"><Settings className="h-5 w-5 text-white" /></div>
                  <h3 className="text-2xl font-bold">企业专属规则库</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  将内部合规政策、业务规范转化为结构化规则。支持零代码配置，灵活适配不同业务线的审查需求，让经验得以传承。
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 沉淀企业知识资产</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 灵活配置审查维度</li>
                </ul>
              </motion.div>
            </div>

            {/* Feature 2: Automated Risk Library (New) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-6xl font-black text-slate-800 mb-6">02</div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg"><Cpu className="h-5 w-5 text-white" /></div>
                  <h3 className="text-2xl font-bold">自动化建立风险识别库</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  无需人工逐条编写规则。用户只需将标准合同模板导入系统，AI 即可深度解析条款逻辑，自动提取合规要点并一键生成专属风险识别库。
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 模板驱动，秒级建模</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 零人工干预，自动提取要点</li>
                </ul>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]"
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                
                {/* Document to Rules Animation */}
                <div className="relative z-10 w-full flex items-center justify-center space-x-4">
                  {/* Left: Document */}
                  <motion.div 
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-32 h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl relative"
                  >
                    <div className="h-2 w-12 bg-slate-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-1 bg-slate-800 rounded w-full"></div>
                      <div className="h-1 bg-slate-800 rounded w-full"></div>
                      <motion.div 
                        animate={{ backgroundColor: ["rgba(30, 41, 59, 1)", "rgba(59, 130, 246, 0.3)", "rgba(30, 41, 59, 1)"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="h-1 rounded w-4/5"
                      ></motion.div>
                      <div className="h-1 bg-slate-800 rounded w-full"></div>
                    </div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-blue-600 rounded-full p-1 shadow-lg">
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  </motion.div>

                  {/* Right: Generated Rules */}
                  <div className="flex flex-col space-y-2">
                    {[
                      { label: "付款期限规则", delay: 0 },
                      { label: "违约责任标准", delay: 0.5 },
                      { label: "争议解决地", delay: 1 }
                    ].map((rule, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: rule.delay + 0.5, duration: 0.5 }}
                        className="bg-blue-600/10 border border-blue-500/30 rounded px-3 py-2 flex items-center space-x-2 w-40"
                      >
                        <CheckCircle2 className="h-3 w-3 text-blue-500" />
                        <span className="text-[10px] font-medium text-blue-400">{rule.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Status Overlay */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="mt-8 bg-slate-900/80 backdrop-blur-sm border border-slate-700 px-4 py-2 rounded-full flex items-center space-x-3"
                >
                  <div className="flex space-x-1">
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full"></motion.div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">AI 正在从模板提取规则...</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Feature 3 (Was 2) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center"
              >
                <div className="relative w-32 h-32 mb-8">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-700" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <motion.path 
                      initial={{ strokeDasharray: "0, 100" }}
                      whileInView={{ strokeDasharray: "95, 100" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="text-red-500" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-2xl font-bold"
                    >95<span className="text-sm">%</span></motion.span>
                    <span className="text-[10px] text-slate-400">准确率</span>
                  </div>
                </div>
                <div className="w-full space-y-3">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-red-500/10 border border-red-500/20 rounded p-3 flex justify-between items-center"
                  >
                    <span className="text-sm text-red-400">高风险：管辖权争议</span>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">High</span>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="bg-amber-500/10 border border-amber-500/20 rounded p-3 flex justify-between items-center"
                  >
                    <span className="text-sm text-amber-400">中风险：付款周期模糊</span>
                    <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded">Medium</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <div className="text-6xl font-black text-slate-800 mb-6">03</div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg"><ShieldAlert className="h-5 w-5 text-white" /></div>
                  <h3 className="text-2xl font-bold">多维度风险分级</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  系统自动识别合同中的风险点，并按“高、中、低”三级进行分类提示。不仅指出问题，更提供基于法律大数据的专业修改建议。
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 红黄绿三色直观预警</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 提供法律依据与修改措辞</li>
                </ul>
              </motion.div>
            </div>

            {/* Feature 4 (Was 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-2 lg:order-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex h-64"
              >
                <div className="w-1/2 border-r border-slate-700 pr-4 space-y-4">
                  <div className="h-3 bg-slate-700 rounded w-full"></div>
                  <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                  <div className="h-3 bg-red-500/20 rounded relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="absolute top-0 left-0 h-full bg-red-500 w-full rounded"
                    ></motion.div>
                  </div>
                  <div className="h-3 bg-slate-700 rounded w-4/5"></div>
                </div>
                <div className="w-1/2 pl-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    className="bg-slate-800 border border-blue-500/30 rounded p-3 h-full"
                  >
                    <div className="text-xs text-blue-400 mb-2 font-medium">AI 建议修改</div>
                    <div className="h-2 bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-2 bg-slate-700 rounded w-2/3 mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-12 bg-blue-600 rounded"></div>
                      <div className="h-6 w-12 bg-slate-700 rounded"></div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="order-1 lg:order-2"
              >
                <div className="text-6xl font-black text-slate-800 mb-6">04</div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-600 p-2 rounded-lg"><Columns className="h-5 w-5 text-white" /></div>
                  <h3 className="text-2xl font-bold">双栏对比高效审查</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  创新的左右双栏界面，审查、修改无缝衔接。支持Word文档在线编辑，风险点联动高亮，一键采纳AI建议，生成洁净版文档。
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 实时进度更新与在线编辑</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-blue-500 mr-2" /> 自动生成审查报告</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>


      {/* Solutions */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">全场景覆盖的解决方案</h2>
            <p className="text-slate-500">基于深度行业知识图谱，精准匹配不同行业的合同审查需求，让AI更懂业务。</p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Building2, title: '地产建筑', items: ['物业管理合同审查', '商品房销售合同风险规避', '施工分包合规性检查'] },
              { icon: Factory, title: '先进制造', items: ['采购框架协议审核', '供应链风险控制', '设备租赁维保合同'] },
              { icon: Landmark, title: '金融服务', items: ['借款协议合规审查', '投资并购协议分析', '监管政策实时对齐'] },
              { icon: Cpu, title: '科技互联网', items: ['IP 授权许可与保护', '劳动人事合同批量处理', '数据出境安全协议'] }
            ].map((sol, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -5, shadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group transition-all duration-300"
              >
                <div className="h-32 bg-slate-800 flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]"></div>
                   <sol.icon className="h-12 w-12 text-white/50 relative z-10" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{sol.title}</h3>
                  <ul className="space-y-2 mb-6">
                    {sol.items.map((item, j) => (
                      <li key={j} className="text-sm text-slate-600 flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 mr-2 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                    查看方案 <ArrowDown className="h-4 w-4 ml-1 -rotate-90" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center"
          >
            {[
              { label: '审查效率提升', value: 90, suffix: '%' },
              { label: '风险识别准确率', value: 95, suffix: '%' },
              { label: '合规成本降低', value: 80, suffix: '%' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp} 
                className="py-4 group"
              >
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: i * 0.2 }}
                  className="text-5xl font-bold text-blue-600 mb-2 flex items-center justify-center"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-2xl ml-1">{stat.suffix}</span>
                </motion.div>
                <div className="text-slate-500 text-sm font-medium group-hover:text-blue-500 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">底层技术架构</h2>
            <p className="text-slate-500 mb-16">构建于先进的 LLM 大模型之上，结合 RAG 检索增强技术，确保数据安全与专业精准。</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden"
          >
             {/* Background decorative elements */}
             <motion.div 
               animate={{ 
                 opacity: [0.05, 0.1, 0.05],
                 scale: [1, 1.1, 1]
               }}
               transition={{ duration: 8, repeat: Infinity }}
               className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] pointer-events-none"
             ></motion.div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 relative z-10">
               <motion.div 
                 variants={{
                   initial: { opacity: 0, x: -20 },
                   whileInView: { opacity: 1, x: 0 }
                 }}
                 whileHover={{ scale: 1.02, translateY: -5 }}
                 className="bg-blue-50 text-blue-800 py-6 rounded-2xl border border-blue-100 font-bold shadow-sm group transition-all"
               >
                 <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">☁️</div>
                 <div>SaaS 云端部署</div>
                 <div className="text-xs text-blue-600/70 mt-2 font-normal px-4">多租户隔离 / 弹性伸缩 / 即开即用</div>
               </motion.div>
               <motion.div 
                 variants={{
                   initial: { opacity: 0, x: 20 },
                   whileInView: { opacity: 1, x: 0 }
                 }}
                 whileHover={{ scale: 1.02, translateY: -5 }}
                 className="bg-slate-900 text-white py-6 rounded-2xl font-bold shadow-lg group transition-all"
               >
                 <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">🏢</div>
                 <div>本地化私有部署</div>
                 <div className="text-xs text-slate-400 mt-2 font-normal px-4">数据不出域 / 内网集成 / 定制化适配</div>
               </motion.div>
             </div>
             
             <div className="relative border-t border-slate-100 pt-12 mt-4">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1 rounded-full border border-slate-200 text-xs font-black text-blue-600 tracking-[0.2em] shadow-sm"
               >
                 AI CORE ENGINE
               </motion.div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { icon: Cpu, title: 'Legal-LLM', desc: '垂直领域法律大模型\n千亿级 Token 预训练', delay: 0.1 },
                   { icon: SearchX, title: 'RAG Knowledge Base', desc: '检索增强生成\n实时挂载最新法条库', delay: 0.3 },
                   { icon: ShieldAlert, title: 'Security & Encryption', desc: 'AES-256 数据加密\n敏感信息自动脱敏', delay: 0.5 }
                 ].map((item, idx) => (
                   <motion.div 
                     key={idx}
                     variants={{
                       initial: { opacity: 0, y: 20 },
                       whileInView: { opacity: 1, y: 0 }
                     }}
                     whileHover={{ y: -8, backgroundColor: "rgba(248, 250, 252, 1)" }}
                     className="border border-slate-100 bg-slate-50/50 rounded-2xl p-6 transition-colors relative group"
                   >
                     <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:shadow-md group-hover:text-blue-600 transition-all">
                       <item.icon className="h-6 w-6 text-blue-600" />
                     </div>
                     <div className="font-bold text-slate-900 mb-2">{item.title}</div>
                     <div className="text-xs text-slate-500 leading-relaxed whitespace-pre-line">{item.desc}</div>
                     
                     {/* Animated pulse effect behind icon */}
                     <motion.div 
                       animate={{ scale: [1, 1.5, 1], opacity: [0, 0.2, 0] }}
                       transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
                       className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-400 rounded-full -z-10"
                     ></motion.div>
                   </motion.div>
                 ))}
               </div>
             </div>

             <div className="relative border-t border-slate-100 pt-12 mt-12">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1 rounded-full border border-slate-200 text-xs font-black text-slate-400 tracking-[0.2em] shadow-sm"
               >
                 DATA FOUNDATION
               </motion.div>
               <motion.div 
                 variants={staggerContainer}
                 className="bg-slate-50/30 rounded-2xl p-6 flex flex-wrap justify-center gap-4"
               >
                 {['合同文档数据', '法律法规库', '司法判例库', '企业合规手册'].map((tag, i) => (
                   <motion.span 
                     key={i}
                     variants={{
                       initial: { opacity: 0, scale: 0.9 },
                       whileInView: { opacity: 1, scale: 1 }
                     }}
                     whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#2563eb", borderColor: "#bfdbfe" }}
                     className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 shadow-sm cursor-default transition-all"
                   >
                     {tag}
                   </motion.span>
                 ))}
               </motion.div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">赋能法务团队、风控专家与每一个企业</h2>
            <p className="text-slate-500">听听行业领袖们如何使用唯客智审提升效能。</p>
          </motion.div>
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { quote: "引入唯客智审后，我们的合同审核周期从平均3天缩短到了2小时。AI 的风险提示非常精准，帮我们规避了几次重大的合规风险。", author: "某上市科技集团", role: "法务总监 Head of Legal", icon: Building2 },
              { quote: "对于采购部门来说，大量的供应商合同让人头疼。这个平台不仅能快速比对条款，还能统一我们的验收标准，效率提升太明显了。", author: "某头部制造企业", role: "采购总监 Procurement Director", icon: Factory },
              { quote: "作为 CEO，我看重的是风控与速度的平衡。唯客智审做到了这一点，它让我们的业务跑得更快，同时睡得更安稳。", author: "创新金融服务公司", role: "首席执行官 CEO", icon: Landmark }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative group transition-all duration-300"
              >
                <div className="text-4xl text-blue-200 font-serif absolute top-6 left-6 group-hover:text-blue-400 transition-colors">"</div>
                <p className="text-slate-600 italic mb-8 relative z-10 pt-4 leading-relaxed">{t.quote}</p>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">为什么选择唯客智审？</h2>
            <p className="text-slate-500">从效率、成本到风险控制，AI 带来的不仅仅是速度的提升，更是质的飞跃。</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white font-medium text-center">
              <div className="py-4 border-r border-slate-700">维度</div>
              <div className="py-4 border-r border-slate-700">传统人工审查</div>
              <div className="py-4 bg-blue-900 text-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 transform rotate-45 translate-x-4 -translate-y-4"></div>
                唯客智审 AI
              </div>
            </div>
            {[
              { dim: '审查速度', icon: Hourglass, old: '数小时 / 份', oldDesc: '受限于阅读速度', new: '3 分钟 / 份', newDesc: '秒级解析与反馈', newColor: 'text-blue-600' },
              { dim: '准确性与一致性', icon: CheckCircle2, old: '易疲劳出错', oldDesc: '标准因人而异', new: '全天候稳定输出', newDesc: '100% 执行统一标准', newColor: 'text-indigo-600' },
              { dim: '综合成本', icon: Wallet, old: '高昂', oldDesc: '人力与外聘律师费用', new: '降低 80%', newDesc: '释放高价值人力', newColor: 'text-emerald-600' },
              { dim: '风险管理', icon: ShieldAlert, old: '主观判断', oldDesc: '依赖个人经验', new: '数据驱动风控', newDesc: '基于大数据的客观评判', newColor: 'text-slate-900' }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 text-center border-b border-slate-100 last:border-0">
                <div className="py-6 border-r border-slate-100 flex flex-col items-center justify-center">
                  <row.icon className="h-5 w-5 text-blue-500 mb-2" />
                  <span className="font-medium text-slate-900 text-sm">{row.dim}</span>
                </div>
                <div className="py-6 border-r border-slate-100 flex flex-col items-center justify-center">
                  <span className={`font-medium mb-1 ${row.old === '高昂' ? 'text-red-500' : 'text-slate-600'}`}>{row.old}</span>
                  <span className="text-xs text-slate-400">{row.oldDesc}</span>
                </div>
                <div className="py-6 flex flex-col items-center justify-center bg-blue-50/30">
                  <span className={`font-bold text-lg mb-1 ${row.newColor}`}>{row.new}</span>
                  <span className="text-xs text-blue-600/70">{row.newDesc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-blue-600 rounded-3xl py-16 text-white shadow-2xl shadow-blue-200 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl"
          ></motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">开启您的智能合同审查之旅</h2>
          <p className="text-blue-100 mb-10 relative z-10 text-lg">立即预约演示，体验 AI 如何重塑您的法务工作流。</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className="inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-bold rounded-xl text-blue-600 bg-white hover:bg-blue-50 shadow-lg transition-colors w-full sm:w-auto">
                预约演示
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact" className="inline-flex justify-center items-center px-8 py-3 border border-blue-400 text-base font-bold rounded-xl text-white bg-transparent hover:bg-blue-500 transition-colors w-full sm:w-auto">
                联系我们
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
    </>
  );
}