import { motion } from "motion/react";
import { MapPin, Globe, CheckCircle, Activity } from "lucide-react";

const regions = [
  {
    name: "大中华区总枢纽",
    sites: "上海 / 北京 / 深圳 / 香港 · 50+ 城市交付中心 · 24x7 实时响应",
  },
  {
    name: "东南亚及亚太",
    sites: "新加坡 · 曼谷 · 雅加达 · 马尼拉 · 吉隆坡 · 东京 · 首尔 · 悉尼",
  },
  {
    name: "欧洲及北美",
    sites: "法兰克福 · 伦敦 · 阿姆斯特丹 · 巴黎 · 旧金山 · 纽约 · 芝加哥",
  },
  {
    name: "中东 / 非洲 / 拉美",
    sites: "迪拜 · 利雅得 · 约翰内斯堡 · 圣保罗 · 墨西哥城 · 孟买",
  },
];

const valueProps = [
  {
    title: "现场安装调度",
    desc: "派遣持证中高级工程师 (CCIE / PMP) 实地部署，完成包括物理上架、逻辑配置同步、割接演练及标准验收的全过程交付。",
  },
  {
    title: "资产反向物流",
    desc: "支持全球范围内的 IT 资产下架、集中与回收，提供符合 GDPR / SOX 国际审计要求的合规数据擦除报告。",
  },
  {
    title: "代采购与集采",
    desc: "依托香港及新加坡的全球集采中心，支持主流厂商硬件代采购、短期租赁、跨境物流分发，平均报价响应 24 小时内。",
  },
  {
    title: "全球 NOC 驻场",
    desc: "7x24 小时全球运维看护，支持远程 CLI 诊断、本地热备插拔更换及应急事故第一现场响应，平均到场时间 < 4 小时。",
  },
];

export default function GlobalNetwork() {
  return (
    <section id="global" className="py-32 bg-neutral-50 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-brand-600 font-black text-sm uppercase tracking-widest mb-6">
                <Globe size={18} />
                Global Execution Force
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-black text-neutral-900 mb-8 leading-tight tracking-tight">
                跨越国界的
                <br />
                <span className="text-brand-600">IT 落地体系</span>
              </h2>
              <p className="text-lg text-neutral-500 mb-12 leading-relaxed font-medium">
                增瀛网络通过在 150+ 国家与地区的本地资源网，为您消除跨境部署的"最后一公里"障碍。我们不仅是方案的设计者，更是每一个复杂站点的实干家。
              </p>

              <div className="space-y-4">
                {regions.map((region, i) => (
                  <motion.div
                    key={region.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center justify-between p-6 rounded-3xl bg-white border border-neutral-200 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5 min-w-0">
                      <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center text-brand-600 shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-all shrink-0">
                        <MapPin size={24} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-neutral-900 font-black tracking-tight">
                          {region.name}
                        </div>
                        <div className="text-neutral-400 text-xs font-bold mt-1 truncate">
                          {region.sites}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full shrink-0 ml-3">
                      <Activity size={12} className="text-green-500" />
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                        活跃
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-6">
              {valueProps.map((prop, idx) => (
                <motion.div
                  key={prop.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-10 rounded-[2.5rem] bg-white border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500"
                >
                  <CheckCircle size={32} className="text-brand-600 mb-6" />
                  <h4 className="text-neutral-900 font-black text-xl mb-4 uppercase tracking-tight">
                    {prop.title}
                  </h4>
                  <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                    {prop.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-10 bg-white border border-brand-100 rounded-[3rem] grid grid-cols-3 gap-6 shadow-xl shadow-brand-500/5">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl lg:text-5xl font-black leading-none text-brand-600">
                  15<span className="text-3xl">年+</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-3">
                  深耕行业
                </span>
              </div>
              <div className="flex flex-col items-center text-center border-x border-neutral-100">
                <span className="text-4xl lg:text-5xl font-black leading-none text-brand-600">
                  100<span className="text-3xl">k+</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-3">
                  交付工单
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl lg:text-5xl font-black leading-none text-brand-600">
                  98<span className="text-3xl">%</span>
                </span>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mt-3">
                  客户留存率
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
