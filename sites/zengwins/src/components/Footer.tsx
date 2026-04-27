import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 text-neutral-500 py-20 border-t border-neutral-100 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-600 rounded-xl rotate-45" />
                <div className="absolute inset-[3px] bg-white rounded-lg rotate-45" />
                <div className="relative flex gap-1">
                  <div className="w-1.5 h-1.5 bg-brand-600 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-brand-600 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-xl tracking-tight text-neutral-900">
                  ZENGWINS
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mt-0.5">
                  Network Tech
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-medium">
              上海增瀛网络专注于全球 IT 网络基础设施的设计、部署与托管。通过我们的一站式合规方案，助力企业连接全球。
            </p>
            <div className="flex gap-4">
              <a
                href="mailto:sales@zengwins.com"
                aria-label="Email Zengwins"
                className="w-10 h-10 flex items-center justify-center bg-neutral-50 hover:bg-brand-600 hover:text-white rounded-xl transition-all"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://www.linkedin.com/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer noopener"
                className="w-10 h-10 flex items-center justify-center bg-neutral-50 hover:bg-brand-600 hover:text-white rounded-xl transition-all"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-neutral-900 font-black mb-8 uppercase tracking-widest text-xs">
              服务能力
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <a href="#services" className="hover:text-brand-600 transition-colors">
                  SD-WAN 架构
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-600 transition-colors">
                  IOR / EOR 全球转运
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-600 transition-colors">
                  弱电集成工程
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-600 transition-colors">
                  NOC 智慧运维
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-600 transition-colors">
                  多云链路优化
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-neutral-900 font-black mb-8 uppercase tracking-widest text-xs">
              关于增瀛
            </h4>
            <ul className="space-y-4 text-sm font-bold">
              <li>
                <a href="#about" className="hover:text-brand-600 transition-colors">
                  公司简介
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-brand-600 transition-colors">
                  交付案例
                </a>
              </li>
              <li>
                <a href="#global" className="hover:text-brand-600 transition-colors">
                  全球部署
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-600 transition-colors">
                  联系合作
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-neutral-900 font-black mb-8 uppercase tracking-widest text-xs">
              联系我们
            </h4>
            <div className="space-y-5">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-brand-600 shrink-0">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-medium leading-normal">
                  上海市 · 详情面谈
                </span>
              </div>
              <a
                href="tel:13681624613"
                className="flex gap-4 items-center hover:text-brand-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-brand-600 shrink-0">
                  <Phone size={18} />
                </div>
                <span className="text-sm font-bold">+86 136 8162 4613</span>
              </a>
              <a
                href="mailto:sales@zengwins.com"
                className="flex gap-4 items-center hover:text-brand-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-brand-600 shrink-0">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-bold tracking-tight">sales@zengwins.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            © {currentYear} 上海增瀛网络科技有限公司. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
            <a href="mailto:sales@zengwins.com" className="hover:text-brand-600 transition-colors">
              Privacy
            </a>
            <a href="mailto:sales@zengwins.com" className="hover:text-brand-600 transition-colors">
              Legal
            </a>
            <a href="#global" className="hover:text-brand-600 transition-colors">
              SLA
            </a>
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-neutral-400 hover:text-brand-600 transition-colors tracking-wide"
          >
            沪ICP备2024096280号-1
          </a>
        </div>
      </div>

      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
    </footer>
  );
}
