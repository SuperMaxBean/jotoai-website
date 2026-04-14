'use client';
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ArrowDownUp, FileCheck, FileText, Search, ShieldCheck, BrainCircuit, Activity, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  const core01Bullets = [
    t("支持自然语言转规则，非技术人员也可轻松配置", "Supports natural language to rule conversion -- non-technical staff can easily configure"),
    t("版本化管理规则集，适应不同业务线需求", "Versioned rule set management, adapting to different business line needs"),
    t("沉淀企业法务智慧，避免人员流动导致经验流失", "Accumulate corporate legal wisdom, preventing knowledge loss from staff turnover")
  ];

  const core02Rules = [
    { label: t("付款期限: 收到发票后30天内", "Payment Term: Within 30 days of invoice"), delay: 0.2 },
    { label: t("违约金: 合同总额的 5%", "Penalty: 5% of total contract value"), delay: 0.8 },
    { label: t("争议解决: 上海国际仲裁中心", "Dispute Resolution: Shanghai International Arbitration Center"), delay: 1.4 }
  ];

  const core02Bullets = [
    t("模板特征自动学习，无需人工拆解条款", "Auto-learn template features, no manual clause breakdown needed"),
    t("智能推荐风险判定标准，大幅降低系统初始化成本", "Smart risk criteria recommendations, greatly reducing system initialization costs"),
    t("支持多版本模板对比，自动同步规则变更", "Multi-version template comparison with auto-synced rule changes")
  ];

  const riskLevels = [
    { label: t('高风险', 'High Risk'), color: 'red', desc: t('重大责任缺失、法律禁止性条款', 'Major liability gaps, legally prohibited clauses') },
    { label: t('中风险', 'Medium Risk'), color: 'amber', desc: t('条款模糊、权益不对等', 'Ambiguous clauses, unequal rights') },
    { label: t('低风险', 'Low Risk'), color: 'green', desc: t('格式规范、非关键性建议', 'Formatting standards, non-critical suggestions') }
  ];

  const ragSteps = [
    { step: '01', icon: Search, title: t('QA 拆解与预处理', 'QA Decomposition & Preprocessing'), color: 'blue', desc: t('将复杂冗长的合同条款拆解为标准问答对，提取核心意图，为高精度检索奠定数据基础。', 'Break down complex contract clauses into standard Q&A pairs, extract core intent, and lay the data foundation for high-precision retrieval.') },
    { step: '02', icon: BrainCircuit, title: t('多维检索评估', 'Multi-Dimensional Retrieval Assessment'), color: 'indigo', desc: t('综合关键词匹配、实体识别与深度语义相似度，进行多维度交叉评估，确保相关法条与规则的精准召回。', 'Combine keyword matching, entity recognition, and deep semantic similarity for multi-dimensional cross-evaluation, ensuring precise recall of relevant legal provisions and rules.') },
    { step: '03', icon: Activity, title: t('置信度评分机制', 'Confidence Scoring Mechanism'), color: 'emerald', desc: t('基于检索结果与企业规则库的匹配度，计算严谨的置信度分数。低于阈值的建议将被拦截或标记为需人工复核。', 'Calculate rigorous confidence scores based on retrieval results and enterprise rule matching. Below-threshold suggestions are intercepted or flagged for manual review.') },
    { step: '04', icon: ShieldCheck, title: t('Audit 智能体校验', 'Audit Agent Verification'), color: 'rose', desc: t('引入独立的 Audit（审计）智能体，专门负责审查和校验前置智能体的输出逻辑，形成闭环，确保零幻觉。', 'Introduce an independent Audit agent dedicated to reviewing and verifying the output logic of preceding agents, forming a closed loop to ensure zero hallucination.') }
  ];

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
            {t('释放法务潜力，聚焦核心价值', 'Unleash Legal Potential, Focus on Core Value')}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto"
          >
            {t(
              '唯客智审不仅仅是一个工具，它是您企业法务数字化的智能引擎。通过深度学习与规则引擎的双重驱动，我们重新定义合同审查标准。',
              '唯客智审 is more than just a tool -- it is the intelligent engine for your enterprise legal digitization. Through the dual drive of deep learning and rule engines, we redefine contract review standards.'
            )}
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
                {t('审查更精准：', 'More Precise Review:')}<br />{t('构建您的企业专属规则库', 'Build Your Custom Enterprise Rule Library')}
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                {t(
                  '通用模型无法解决特定行业的合规痛点。唯客智审允许您将企业内部的合规政策、业务规范转化为结构化的数字规则。无论是付款账期、违约金比例，还是特定条款的禁用词，都能灵活配置，实现毫秒级的精准匹配与审查。',
                  'Generic models cannot address industry-specific compliance pain points. 唯客智审 allows you to transform internal compliance policies and business standards into structured digital rules. Whether it is payment terms, penalty ratios, or prohibited words in specific clauses, everything can be flexibly configured for millisecond-level precise matching and review.'
                )}
              </p>
              <ul className="space-y-4 mb-8">
                {core01Bullets.map((text, i) => (
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
                {t('了解规则配置详情', 'Learn about rule configuration')} <ArrowRight className="h-5 w-5 ml-2" />
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
                  <div className="text-xs text-slate-400 font-medium">{t('规则管理面板 - v2.4', 'Rule Management Panel - v2.4')}</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 text-lg">{t('采购合同审查规则集', 'Procurement Contract Review Rule Set')}</h3>
                    <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 transition-colors">{t('新增规则', 'Add Rule')}</button>
                  </div>
                  <div className="space-y-4">
                    {/* Rule 1 */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="border border-slate-200 rounded-lg p-4 bg-slate-50/50"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">{t('强制性', 'Mandatory')}</span>
                          <span className="font-bold text-slate-800">{t('付款账期限制', 'Payment Term Limit')}</span>
                        </div>
                        <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded p-2 text-xs font-mono text-slate-600">
                        IF "{t('付款时间', 'Payment Time')}" &gt; 60 DAYS THEN TRIGGER "{t('风险提示', 'Risk Alert')}"
                      </div>
                    </motion.div>
                    {/* Rule 2 */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">{t('建议性', 'Advisory')}</span>
                          <span className="font-bold text-slate-800">{t('争议解决地', 'Dispute Resolution Venue')}</span>
                        </div>
                        <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        {t('必须包含"甲方所在地"或"北京仲裁委员会"', 'Must include "Party A\'s domicile" or "Beijing Arbitration Commission"')}
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
                      <div className="text-sm font-bold text-slate-900">{t('标准采购合同模板.docx', 'Standard_Procurement_Contract.docx')}</div>
                      <div className="text-[10px] text-slate-400">{t('2.4 MB \u2022 正在解析条款...', '2.4 MB \u2022 Parsing clauses...')}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{t('AI 模式', 'AI Mode')}</div>
                </div>

                {/* Extracted Rules List */}
                <div className="space-y-3 mb-8">
                  {core02Rules.map((rule, idx) => (
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
                    <span>{t('规则库生成进度', 'Rule Library Generation Progress')}</span>
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
                {t('自动化建立风险识别库：', 'Automated Risk Identification Library:')}<br />{t('从模板到规则的秒级跨越', 'From Template to Rules in Seconds')}
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                {t(
                  '不再需要法务专家耗费数周时间手动梳理规则。唯客智审支持"模板驱动建模"，您只需导入企业的标准合同模板，AI 即可自动识别关键变量、合规基准与风险敞口，并自动生成配套的审查规则库。',
                  'No more spending weeks having legal experts manually compile rules. 唯客智审 supports "template-driven modeling" -- simply import your standard contract templates, and AI will automatically identify key variables, compliance benchmarks, and risk exposures, generating a matching review rule library.'
                )}
              </p>
              <ul className="space-y-4">
                {core02Bullets.map((text, i) => (
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
                {t('风险一目了然：', 'Risks at a Glance:')}<br />{t('智能风险分级与具体修改建议', 'Smart Risk Classification & Specific Revision Suggestions')}
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                {t(
                  '无需逐字阅读，系统自动扫描并识别合同中的潜在陷阱。我们按风险严重程度建立了三色分级体系，让核心问题无处遁形。更重要的是，唯客智审不仅仅是"发现问题"，它还能结合法律法规库，为您提供有理有据的"修改建议"。',
                  'No need to read word by word -- the system automatically scans and identifies potential pitfalls in contracts. Our three-color risk classification system ensures no critical issues are missed. More importantly, 唯客智审 does not just "find problems" -- it combines legal databases to provide well-founded "revision suggestions".'
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {riskLevels.map((risk, i) => (
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
                  <h3 className="font-bold text-slate-900">{t('合同风险分析报告', 'Contract Risk Analysis Report')}</h3>
                  <div className="flex space-x-3">
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100">{t('● 高风险: 3', '● High Risk: 3')}</span>
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">{t('● 中风险: 5', '● Medium Risk: 5')}</span>
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
                        {t('违约责任不对等', 'Unequal Breach Liability')}
                      </div>
                      <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase tracking-wider">High Risk</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {t(
                        '当前条款规定甲方违约金为合同总额的0.5%，而乙方（我方）违约金高达20%。这严重违反了公平原则，且增加了我方财务风险。',
                        'The current clause stipulates Party A\'s penalty at 0.5% of the contract value, while Party B\'s (our) penalty is as high as 20%. This seriously violates the principle of fairness and increases our financial risk.'
                      )}
                    </p>
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-white border border-blue-100 rounded p-3"
                    >
                       <div className="text-xs font-bold text-blue-600 mb-1">{t('AI 修改建议：', 'AI Revision Suggestion:')}</div>
                       <div className="text-sm text-slate-700">{t(
                         '建议将双方违约金比例统一调整为合同总额的',
                         'It is recommended to unify both parties\' penalty ratio to'
                       )} <span className="text-blue-600 bg-blue-50 px-1 rounded">5%</span>{t('，或设定违约金上限。', ' of the contract value, or set a penalty cap.')}</div>
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
                {t('审查修改无缝衔接：', 'Seamless Review & Editing:')}<br />{t('创新的双栏交互设计', 'Innovative Dual-Pane Interactive Design')}
              </h2>
              <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                {t(
                  '告别在Word文档和审查报告之间反复切换的痛苦。唯客智审采用符合法务工作习惯的左文右析双栏布局。左侧查看原文档，右侧实时展示AI审查结果，两者滚动联动。点击风险点，即刻定位原文；一键接受建议，自动修订文档。',
                  'Say goodbye to the pain of switching between Word documents and review reports. 唯客智审 features a dual-pane layout designed for legal workflows -- original document on the left, real-time AI review results on the right, with synchronized scrolling. Click a risk point to instantly locate the source; accept suggestions with one click to auto-revise the document.'
                )}
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
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{t('实时滚动联动', 'Real-Time Scroll Sync')}</h4>
                    <p className="text-slate-600">{t('文档与审查意见区精准同步，阅读体验如丝般顺滑。', 'Document and review panel precisely synchronized for a silky-smooth reading experience.')}</p>
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
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{t('一键智能修订', 'One-Click Smart Revision')}</h4>
                    <p className="text-slate-600">{t('认可AI建议？只需点击"接受"，系统自动在原文中完成修订模式下的修改。', 'Agree with the AI suggestion? Simply click "Accept" and the system auto-applies the revision in track-changes mode.')}</p>
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
                    <div className="text-sm font-bold text-slate-700 mb-4">{t('AI 审查助手', 'AI Review Assistant')}</div>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="bg-white border border-amber-200 rounded-lg p-3 shadow-sm"
                      >
                        <div className="font-bold text-slate-900 text-sm mb-1">{t('管辖权异议', 'Jurisdiction Objection')}</div>
                        <div className="text-xs text-slate-600 mb-3">{t('建议修改为原告所在地法院管辖。', 'Suggest changing to court jurisdiction at plaintiff\'s domicile.')}</div>
                        <div className="flex space-x-2">
                          <button className="text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">{t('定位', 'Locate')}</button>
                          <button className="text-xs text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">{t('替换', 'Replace')}</button>
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
              {t('攻克严肃场景：多智能体 RAG 召回架构', 'Conquering Critical Scenarios: Multi-Agent RAG Retrieval Architecture')}
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
              {t(
                '在法律等严肃场景中，准确性是生命线。我们设计了独创的多智能体（Multi-Agent）架构，彻底解决大模型幻觉与知识召回难题，确保每一条审查建议都经得起推敲。',
                'In critical scenarios like law, accuracy is the lifeline. We designed a proprietary Multi-Agent architecture that thoroughly solves LLM hallucination and knowledge retrieval challenges, ensuring every review suggestion withstands scrutiny.'
              )}
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

            {ragSteps.map((item, i) => (
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
            {t('准备好升级您的法务工作流了吗？', 'Ready to Upgrade Your Legal Workflow?')}
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            {t('立即预约演示，体验唯客智审如何帮您构建安全的商业护城河。', 'Book a demo now to experience how 唯客智审 helps you build a secure business moat.')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-bold rounded-md text-white bg-blue-500 hover:bg-blue-400 shadow-lg transition-colors"
              >
                {t('预约产品演示', 'Book Product Demo')}
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact" className="inline-flex justify-center items-center px-8 py-3.5 border border-blue-400 text-base font-bold rounded-md text-blue-100 hover:bg-blue-800 hover:text-white transition-colors"
              >
                {t('联系销售团队', 'Contact Sales')}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
    </>
  );
}
