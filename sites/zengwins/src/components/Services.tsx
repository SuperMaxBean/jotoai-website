import { motion } from "motion/react";
import {
  Network,
  PackageCheck,
  Construction,
  Cpu,
  ArrowUpRight,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "网络架构设计与咨询",
    desc: "基于业务增长预研，提供 LAN / WAN / 数据中心网络深度架构设计。覆盖 BGP / OSPF 路由优化、Spine-Leaf 数据中心矩阵、SD-WAN 与 MPLS 混合组网方案。",
    icon: Network,
    tags: ["SD-WAN", "BGP/OSPF", "Spine-Leaf", "多云互联"],
  },
  {
    title: "全球站点合规交付 (IOR/EOR)",
    desc: "解决跨国 IT 部署的清关、税务与合规难题。作为名义进口商，代理由硬件采购、本地物流到机房通电的全流程合规手续，覆盖东南亚 / 欧洲 / 中东主流市场。",
    icon: PackageCheck,
    tags: ["IOR/EOR", "清关支持", "税务合规", "全球物流"],
  },
  {
    title: "现场工程与弱电集成",
    desc: "百余名经验丰富的布线与机房工程师团队。提供高标准综合布线、机柜冷/热通道布局、配电与 UPS 集成、物理安防一站式施工服务。",
    icon: Construction,
    tags: ["机房集成", "结构化布线", "冷/热通道", "物理安防"],
  },
  {
    title: "数字化智慧运维平台",
    desc: "自主研发的云端运维平台，对全球站点资产进行实时监控与可视化管理。7x24 Smart Hands 现场快速响应，平均故障恢复时间 (MTTR) 控制在 30 分钟内。",
    icon: Cpu,
    tags: ["实时监控", "资产管理", "Smart Hands", "MTTR < 30min"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-32 bg-neutral-50 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-brand-600 font-black text-sm uppercase tracking-widest mb-6"
            >
              <div className="w-8 h-px bg-brand-600" />
              Our Core Expertise
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-6xl font-display font-black text-neutral-900 leading-tight"
            >
              从宏观架构到物理执行的
              <br />
              <span className="text-brand-600">全栈式 IT 服务</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-neutral-500 max-w-md lg:mb-2"
          >
            我们深知 IT 网络是企业运行的血脉。增瀛网络致力于消除跨境部署的技术与合规堡垒，确保您的业务基石稳如泰山。
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-10 rounded-[2.5rem] bg-white border border-neutral-100 hover:border-brand-500/20 hover:shadow-[0_32px_64px_-16px_rgba(37,99,235,0.1)] transition-all duration-500 overflow-hidden"
            >
              <div className="flex items-start justify-between mb-10">
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-900 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500">
                  <service.icon size={32} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <ArrowUpRight size={24} className="text-brand-600" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-neutral-900 mb-6">{service.title}</h3>
              <p className="text-neutral-500 leading-relaxed mb-8 text-base">{service.desc}</p>

              <div className="flex flex-wrap gap-3">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-neutral-50 text-neutral-600 text-xs font-bold rounded-xl border border-neutral-100 group-hover:bg-brand-50 group-hover:border-brand-100 group-hover:text-brand-700 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="absolute top-0 right-0 w-1 h-0 bg-brand-600 group-hover:h-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="#about"
            className="inline-flex items-center gap-4 px-8 py-5 rounded-3xl bg-white border border-brand-100 text-neutral-900 shadow-xl shadow-brand-500/10 hover:shadow-2xl hover:shadow-brand-500/20 hover:border-brand-200 transition-all cursor-pointer group"
          >
            <span className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
              <ShieldCheck size={20} />
            </span>
            <span className="font-bold">了解增瀛的 ISO 安全与交付标准</span>
            <span className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center group-hover:bg-brand-700 transition-colors">
              <ArrowRight size={20} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
