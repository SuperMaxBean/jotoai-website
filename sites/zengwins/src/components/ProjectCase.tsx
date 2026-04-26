import { motion } from "motion/react";
import { CheckCircle, BarChart3, ExternalLink } from "lucide-react";

const cases = [
  {
    title: "全球 500 强奢侈品零售集团",
    category: "SD-WAN & Global Connectivity",
    desc: "交付覆盖亚太区 12 个国家、180+ 门店的 SD-WAN 网络架构。通过智选链路技术将跨境系统访问延迟降低 45%，并通过 IOR 代理解决东南亚多国出口管制难题。",
    tags: ["SD-WAN", "全托管", "跨境带宽优化"],
  },
  {
    title: "新能源车企欧洲研发中心基建",
    category: "Field Engineering & Logistics",
    desc: "从方案设计、IT 资产全球代采、出口申报到慕尼黑现场勘察集成。在 60 天内完成了从零到具备研发办公能力的整套网络环境投运。",
    tags: ["德国现场交付", "IOR/EOR", "结构化布线"],
  },
  {
    title: "头部金融科技高可用机房重构",
    category: "Enterprise Data Center",
    desc: "通过三地五中心架构设计，实现核心业务系统的零中断灾备切换。全量上线万兆光纤互联，部署次世代防火墙集群，确保金融级合规。",
    tags: ["容灾备份", "金融防火墙", "核心交换重构"],
  },
];

export default function ProjectCase() {
  return (
    <section id="cases" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-600 font-black text-sm uppercase tracking-widest mb-6">
              <BarChart3 size={18} />
              Success Stories
            </div>
            <h2 className="text-4xl lg:text-6xl font-display font-black text-neutral-900 mb-8 tracking-tight">
              见证每一个
              <br />
              <span className="text-brand-600">确定性交付</span>
            </h2>
            <p className="text-lg text-neutral-500 font-medium leading-relaxed">
              从亚太到欧美，从零售店面到核心算力机房，增瀛的交付成果正在撑起全球业务的每一面。
            </p>
          </div>
          <a
            href="#contact"
            className="flex items-center gap-2 font-black text-neutral-900 hover:text-brand-600 transition-colors py-4 group"
          >
            索取更多交付公报{" "}
            <ExternalLink
              size={20}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {cases.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative"
            >
              <div className="p-10 rounded-[3rem] bg-neutral-50 border border-neutral-100 h-full flex flex-col group-hover:bg-white group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500">
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-600 mb-6 bg-brand-50 inline-block self-start px-3 py-1.5 rounded-lg">
                  {project.category}
                </div>
                <h3 className="text-2xl font-black text-neutral-900 mb-6 leading-tight">
                  {project.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-10 flex-grow font-medium">
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-10">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-1.5 bg-white text-neutral-400 text-[10px] font-bold rounded-xl border border-neutral-100 group-hover:border-brand-100 group-hover:text-neutral-600 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="mailto:sales@zengwins.com?subject=%E7%B4%A2%E5%8F%96%E6%8A%80%E6%9C%AF%E7%99%BD%E7%9A%AE%E4%B9%A6"
                  className="w-full py-4 rounded-2xl bg-white border border-neutral-200 text-neutral-900 font-black text-xs hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all flex items-center justify-center gap-3"
                >
                  索取技术白皮书 <CheckCircle size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
