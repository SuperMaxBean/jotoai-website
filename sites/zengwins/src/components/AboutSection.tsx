import { motion } from "motion/react";
import { Zap, ShieldCheck, Award, BadgeCheck, Layers } from "lucide-react";
import teamPhoto from "../assets/images/professional_it_team_bright_1777208075990.png";

const stats = [
  { label: "资深技术人员", value: "100+", sub: "CCIE / PMP / ITIL" },
  { label: "全球交付足迹", value: "150+", sub: "国家/地区覆盖" },
  { label: "行业深耕", value: "15年", sub: "自 2009 年起" },
  { label: "SLA 表现", value: "99.9%", sub: "服务可用性" },
];

const credentials = [
  { Icon: Award, label: "ISO 9001", sub: "质量管理体系" },
  { Icon: ShieldCheck, label: "ISO 27001", sub: "信息安全管理" },
  { Icon: Layers, label: "CMMI L3", sub: "软件交付能力" },
  { Icon: BadgeCheck, label: "厂商授权", sub: "Cisco · Huawei · H3C" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-32 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white/50">
              <img
                src={teamPhoto}
                alt="Zengwins Team"
                className="w-full aspect-[4/5] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 text-brand-600 font-black text-sm uppercase tracking-widest mb-6">
              <Zap size={16} />
              Heritage & Seniority
            </div>
            <h2 className="text-4xl lg:text-6xl font-display font-black text-neutral-900 mb-8 leading-[1.1] tracking-tight">
              我们不仅部署网络
              <br />
              更在<span className="text-brand-600">建立信任</span>
            </h2>
            <p className="text-lg text-neutral-500 mb-8 leading-relaxed font-medium">
              上海增瀛网络科技有限公司（Zengwins）立足于中国上海，服务半径覆盖全球。核心团队平均拥有超过 10 年的大型外企及跨国 IT 项目服务经验，已为 150+ 国家与地区的跨国企业、金融机构、制造与物流园区交付端到端网络解决方案，是 Cisco / Huawei / H3C 等主流厂商的长期合作伙伴。
            </p>

            <div className="grid grid-cols-2 gap-8 mt-12 pb-10 border-b border-neutral-200">
              <div>
                <h4 className="text-neutral-900 font-black text-lg mb-2">架构为魂</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  坚持以"业务驱动技术"，先理解业务流，再定义数据流，最后通过标准化的物理设施进行落地，确保技术服务于长期增长。
                </p>
              </div>
              <div>
                <h4 className="text-neutral-900 font-black text-lg mb-2">执行为翼</h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  依托完善的全球供应链资源，我们不仅能设计方案，更能将每一个机柜、每一根光纤在全球任何站点分毫不差地投运。
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
              {stats.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-3xl font-black text-neutral-900 leading-none">
                    {item.value}
                  </span>
                  <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest mt-3">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 mt-1">{item.sub}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
              {credentials.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col gap-3 p-5 rounded-2xl bg-white border border-neutral-200 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5 transition-all"
                >
                  <span className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <c.Icon size={20} />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-black text-neutral-900 whitespace-nowrap">
                      {c.label}
                    </span>
                    <span className="text-[11px] font-bold text-neutral-400 mt-1.5">{c.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
