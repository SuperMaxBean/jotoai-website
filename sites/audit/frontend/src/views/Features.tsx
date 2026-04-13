'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ArrowDownUp, FileCheck, FileText, Search, ShieldCheck, BrainCircuit, Activity, ShieldAlert } from 'lucide-react';
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

export default function Features() {
  return (
    <>    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-blue-50/50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1e293b] mb-6 tracking-tight">
            释放法务潜力，聚焦核心价值
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto"
          >
            唯客智审不仅仅是一个工具，它是您企业法务数字化的智能引擎。通过深度学习与规则引擎的双重驱动，我们重新定义合同审查标准。
          </motion.p>
        </motion.div>
      </section>

      {/* Core 01 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-block bg-blue-50 text-blue-600 font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-100">
                CORE 01
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                审查更精准：<br />构建您的企业专属规则库
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                通用模型无法解决特定行业的合规痛点。唯客智审允许您将企业内部的合规政策、业务规范转化为结构化的数字规则。无论是付款账期、违约金比例，还是特定条款的禁用词，都能灵活配置，实现毫秒级的精准匹配与审查。
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "支持自然语言转规则，非技术人员也可轻松配置",
                  "版本化管理规则集，适应不同业务线需求",
                  "沉淀企业法务智慧，避免人员流动导致经验流失"
                ].map((text, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">{text}</span>
                  </motion.li>
                ))}
              </ul>
              <a href="#" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 text-lg transition-colors">
                了解规则配置详情 <ArrowRight className="h-5 w-5 ml-2" />
              </a>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 bg-slate-100 rounded-2xl p-6 md:p-8 shadow-inner border border-slate-200"
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">规则管理面板 - v2.4</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 text-lg">采购合同审查规则集</h3>
                    <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition-colors">新增规则</button>
                  </div>
                  <div className="space-y-4">
                    {/* Rule 1 */}
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="border border-slate-200 rounded-lg p-4 bg-slate-50/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">强制性</span>
                          <span className="font-bold text-slate-800">付款账期限制</span>
                        </div>
                        <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded p-2 text-xs font-mono text-slate-600">
                        IF "付款时间" &gt; 60 DAYS THEN TRIGGER "风险提示"
                      </div>
                    </motion.div>
                    {/* Rule 2 */}
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">建议性</span>
                          <span className="font-bold text-slate-800">争议解决地</span>
                        </div>
                        <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        必须包含"甲方所在地"或"北京仲裁委员会"
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core 02: Automated Risk Library (New) */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-slate-200/50 rounded-2xl p-6 md:p-8 shadow-inner border border-slate-200"
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden p-8">
                {/* Header with simulated file name */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">标准采购合同模板.docx</div>
                      <div className="text-[10px] text-slate-400">2.4 MB • 正在解析条款...</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">AI 模式</div>
                </div>

                {/* Extracted Rules List */}
                <div className="space-y-3 mb-8">
                  {[
                    { label: "付款期限: 收到发票后30天内", delay: 0.2 },
                    { label: "违约金: 合同总额的 5%", delay: 0.8 },
                    { label: "争议解决: 上海国际仲裁中心", delay: 1.4 }
                  ].map((rule, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: rule.delay, duration: 0.5 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-xs font-medium text-slate-700">{rule.label}</span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>规则库生成进度</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-blue-600"
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-blue-50 text-blue-600 font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-100">
                CORE 02
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                自动化建立风险识别库：<br />从模板到规则的秒级跨越
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                不再需要法务专家耗费数周时间手动梳理规则。唯客智审支持“模板驱动建模”，您只需导入企业的标准合同模板，AI 即可自动识别关键变量、合规基准与风险敞口，并自动生成配套的审查规则库。
              </p>
              <ul className="space-y-4">
                {[
                  "模板特征自动学习，无需人工拆解条款",
                  "智能推荐风险判定标准，大幅降低系统初始化成本",
                  "支持多版本模板对比，自动同步规则变更"
                ].map((text, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-lg">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core 03 (Was 02) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-block bg-blue-50 text-blue-600 font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-100">
                CORE 03
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                风险一目了然：<br />智能风险分级与具体修改建议
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                无需逐字阅读，系统自动扫描并识别合同中的潜在陷阱。我们按风险严重程度建立了三色分级体系，让核心问题无处遁形。更重要的是，唯客智审不仅仅是“发现问题”，它还能结合法律法规库，为您提供有理有据的“修改建议”。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: '高风险', color: 'red', desc: '重大责任缺失、法律禁止性条款' },
                  { label: '中风险', color: 'amber', desc: '条款模糊、权益不对等' },
                  { label: '低风险', color: 'green', desc: '格式规范、非关键性建议' }
                ].map((risk, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-${risk.color}-50/50 border border-${risk.color}-100 rounded-xl p-4`}
                  >
                    <div className={`text-${risk.color}-600 font-bold mb-2`}>{risk.label}</div>
                    <div className="text-xs text-slate-600 leading-relaxed">{risk.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 bg-slate-200/50 rounded-2xl p-6 md:p-8 shadow-inner border border-slate-200"
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">合同风险分析报告</h3>
                  <div className="flex space-x-3">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">● 高风险: 3</span>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">● 中风险: 5</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-red-700 font-bold">
                        <ShieldAlert className="h-5 w-5 mr-2" />
                        违约责任不对等
                      </div>
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider">High Risk</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      当前条款规定甲方违约金为合同总额的0.5%，而乙方（我方）违约金高达20%。这严重违反了公平原则，且增加了我方财务风险。
                    </p>
                    <motion.div 
                      initial={{ scale: 0.98, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-white border border-blue-100 rounded p-3"
                    >
                       <div className="text-xs font-bold text-blue-600 mb-1">AI 修改建议：</div>
                       <div className="text-sm text-slate-700">建议将双方违约金比例统一调整为合同总额的 <span className="text-blue-600 bg-blue-50 px-1 rounded">5%</span>，或设定违约金上限。</div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core 04 (Was 03) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-block bg-blue-50 text-blue-600 font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-100">
                CORE 04
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                审查修改无缝衔接：<br />创新的双栏交互设计
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                告别在Word文档和审查报告之间反复切换的痛苦。唯客智审采用符合法务工作习惯的左文右析双栏布局。左侧查看原文档，右侧实时展示AI审查结果，两者滚动联动。点击风险点，即刻定位原文；一键接受建议，自动修订文档。
              </p>
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-50 p-3 rounded-lg mr-4 shrink-0">
                    <ArrowDownUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">实时滚动联动</h4>
                    <p className="text-slate-600">文档与审查意见区精准同步，阅读体验如丝般顺滑。</p>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start"
                >
                  <div className="bg-blue-50 p-3 rounded-lg mr-4 shrink-0">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">一键智能修订</h4>
                    <p className="text-slate-600">认可AI建议？只需点击“接受”，系统自动在原文中完成修订模式下的修改。</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 bg-slate-100 rounded-2xl p-6 shadow-inner border border-slate-200"
            >
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-[500px]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="w-24 h-2 bg-slate-200 rounded"></div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Pane: Document */}
                  <div className="w-1/2 border-r border-slate-100 p-6 space-y-6 overflow-y-auto">
                    <div className="h-4 bg-slate-800 rounded w-1/2 mb-8"></div>
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-200 rounded w-full"></div>
                      <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                      <motion.div 
                        initial={{ backgroundColor: "rgba(226, 232, 240, 1)" }}
                        whileInView={{ backgroundColor: "rgba(254, 243, 199, 1)" }}
                        transition={{ delay: 1, duration: 1 }}
                        className="h-2 rounded w-full"
                      ></motion.div>
                      <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                    </div>
                  </div>
                  {/* Right Pane: AI Assistant */}
                  <div className="w-1/2 bg-slate-50/50 p-4 overflow-y-auto">
                    <div className="text-sm font-bold text-slate-700 mb-4">AI 审查助手</div>
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="bg-white border border-amber-200 rounded-lg p-3 shadow-sm"
                      >
                        <div className="font-bold text-slate-900 text-sm mb-1">管辖权异议</div>
                        <div className="text-xs text-slate-600 mb-3">建议修改为原告所在地法院管辖。</div>
                        <div className="flex space-x-2">
                          <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">定位</button>
                          <button className="text-xs text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">替换</button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core 05 (Was 04): RAG & Multi-Agent */}
      <section className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            {...fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-block bg-blue-900/50 text-blue-400 font-bold text-sm px-4 py-1.5 rounded-full mb-6 border border-blue-800">
              CORE 05
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              攻克严肃场景：多智能体 RAG 召回架构
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
              在法律等严肃场景中，准确性是生命线。我们设计了独创的多智能体（Multi-Agent）架构，彻底解决大模型幻觉与知识召回难题，确保每一条审查建议都经得起推敲。
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 relative"
          >
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
            
            {[
              { step: '01', icon: Search, title: 'QA 拆解与预处理', color: 'blue', desc: '将复杂冗长的合同条款拆解为标准问答对，提取核心意图，为高精度检索奠定数据基础。' },
              { step: '02', icon: BrainCircuit, title: '多维检索评估', color: 'indigo', desc: '综合关键词匹配、实体识别与深度语义相似度，进行多维度交叉评估，确保相关法条与规则的精准召回。' },
              { step: '03', icon: Activity, title: '置信度评分机制', color: 'emerald', desc: '基于检索结果与企业规则库的匹配度，计算严谨的置信度分数。低于阈值的建议将被拦截或标记为需人工复核。' },
              { step: '04', icon: ShieldCheck, title: 'Audit 智能体校验', color: 'rose', desc: '引入独立的 Audit（审计）智能体，专门负责审查和校验前置智能体的输出逻辑，形成闭环，确保零幻觉。' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 relative z-10 hover:border-blue-500 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-${item.color}-600 rounded-lg flex items-center justify-center mb-6 shadow-lg shadow-${item.color}-900/50`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-${item.color}-400 font-mono text-sm mb-2`}>STEP {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#1e3a8a] text-center">
        <motion.div 
          {...fadeInUp}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备好升级您的法务工作流了吗？
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            立即预约演示，体验唯客智审如何帮您构建安全的商业护城河。
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contact" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-md text-white bg-blue-500 hover:bg-blue-400 shadow-lg transition-colors"
              >
                预约产品演示
              </Link>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/contact" className="inline-flex justify-center items-center px-8 py-3.5 border border-blue-400 text-base font-bold rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
              >
                联系销售团队
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
    </>
  );
}