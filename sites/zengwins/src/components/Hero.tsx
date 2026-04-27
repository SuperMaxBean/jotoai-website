import { motion } from "motion/react";
import { ArrowRight, ChevronDown, ShieldCheck, Globe2 } from "lucide-react";
import heroMesh from "../assets/images/global_network_light_mesh_1777208045525.png";
import heroServer from "../assets/images/modern_bright_server_row_1777208059047.png";

const STATS = [
  {
    value: "100%",
    label: "物理交付率",
    Icon: ShieldCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    value: "150+",
    label: "国家/地区覆盖",
    Icon: Globe2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    value: "15年",
    label: "行业服务积累",
    text: "15",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    value: "7x24",
    label: "全球中心看护",
    text: "24",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center pt-24 overflow-hidden bg-white"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={heroMesh}
          alt="Global Network"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="lg:grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 bg-brand-50 border border-brand-100 px-5 py-2 rounded-2xl mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600" />
              </span>
              <span className="text-brand-700 text-xs font-extrabold tracking-widest uppercase">
                Enterprise IT Infrastructure Experts
              </span>
            </div>

            <h1 className="font-display text-5xl lg:text-8xl font-black text-neutral-900 leading-[0.95] mb-10 tracking-tight">
              赋能企业
              <br />
              <span className="text-gradient">全球连接力</span>
            </h1>

            <p className="text-xl text-neutral-500 max-w-xl leading-relaxed mb-12 font-medium">
              上海增瀛网络为您提供一站式、可落地、全球化的 IT 网络基建。从架构愿景到物理部署，我们助力您的业务在任何维度自由伸展。
            </p>

            <div className="flex flex-col sm:flex-row gap-5 mb-16">
              <a
                href="#contact"
                className="flex items-center justify-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:shadow-2xl hover:shadow-brand-500/30 active:scale-95"
              >
                立即咨询方案 <ArrowRight size={22} />
              </a>
              <a
                href="#cases"
                className="flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-sm"
              >
                交付案例
              </a>
            </div>

            <div className="flex flex-wrap gap-x-12 gap-y-8 mt-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`p-1.5 ${stat.iconBg} ${stat.iconColor} rounded-full`}
                    >
                      {stat.Icon ? (
                        <stat.Icon size={18} />
                      ) : (
                        <div className="w-[18px] h-[18px] flex items-center justify-center font-bold text-[10px]">
                          {stat.text}
                        </div>
                      )}
                    </div>
                    <span className="text-neutral-900 text-lg font-black tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative group"
          >
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] ring-1 ring-neutral-200">
              <img
                src={heroServer}
                alt="Zengwins Infrastructure"
                className="w-full aspect-[1/1] object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/10 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      <a
        href="#services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-300 hover:text-brand-600 flex-col items-center gap-2 hidden md:flex transition-colors"
        aria-label="Scroll to services"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] font-black">
          Explore Capability
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </a>
    </section>
  );
}
