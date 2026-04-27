import { motion } from "motion/react";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

const channels = [
  {
    Icon: Phone,
    label: "联系电话",
    value: "+86 136 8162 4613",
    href: "tel:13681624613",
    sub: "工作日 9:00 – 18:00",
  },
  {
    Icon: Mail,
    label: "商务邮箱",
    value: "sales@zengwins.com",
    href: "mailto:sales@zengwins.com",
    sub: "工程师 24 小时内回复",
  },
  {
    Icon: MapPin,
    label: "公司地址",
    value: "上海市 · 详情面谈",
    href: "#cases",
    sub: "支持线上 / 线下方案沟通",
  },
];

export default function ContactCTA() {
  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-brand-100/40 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-brand-200/30 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center gap-2 text-brand-600 font-black text-sm uppercase tracking-widest mb-6">
            <div className="w-8 h-px bg-brand-600" />
            Plan Your Next Network
          </div>
          <h2 className="text-4xl lg:text-6xl font-display font-black text-neutral-900 leading-[1.1] tracking-tight">
            与我们规划下一段
            <br />
            <span className="text-brand-600">企业级网络</span>
          </h2>
          <p className="text-lg text-neutral-500 mt-8 leading-relaxed font-medium">
            无论是新建跨境分支、数据中心扩容、还是 SD-WAN 升级，增瀛工程师都可在 24 小时内回应需求并提供初步方案建议。
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {channels.map((c, idx) => (
              <motion.a
                key={c.label}
                href={c.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group p-6 rounded-3xl bg-white border border-neutral-200 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10 transition-all flex items-center gap-5"
              >
                <span className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors shrink-0">
                  <c.Icon size={22} />
                </span>
                <div className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-brand-600 mb-1">
                    {c.label}
                  </span>
                  <span className="block text-base font-black text-neutral-900 tracking-tight truncate">
                    {c.value}
                  </span>
                  <span className="block text-xs font-medium text-neutral-400 mt-1">{c.sub}</span>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
