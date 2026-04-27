import { motion, useScroll, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const Logo = () => (
  <a href="#top" className="flex items-center gap-2.5 group cursor-pointer">
    <div className="relative w-10 h-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-brand-600 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500" />
      <div className="absolute inset-[3px] bg-white rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
      <div className="relative flex gap-1">
        <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" />
        <div className="w-1.5 h-1.5 bg-brand-600 rounded-full" />
      </div>
    </div>
    <div className="flex flex-col leading-none">
      <span className="font-display font-extrabold text-xl tracking-tight text-neutral-900 group-hover:text-brand-600 transition-colors">
        ZENGWINS
      </span>
      <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mt-0.5">
        Network Tech
      </span>
    </div>
  </a>
);

const NAV_LINKS = [
  { name: "业务范围", href: "#services" },
  { name: "部署能力", href: "#global" },
  { name: "公司理念", href: "#about" },
  { name: "交付案例", href: "#cases" },
  { name: "联系我们", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );

  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(226, 232, 240, 1)"]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <motion.nav
      style={{
        backgroundColor: navBackground,
        borderBottom: `1px solid`,
        borderBottomColor: borderBottom,
      }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm lg:backdrop-blur-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />

          <div className="hidden lg:flex items-center space-x-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-neutral-600 hover:text-brand-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-600 transition-all group-hover:w-full" />
              </a>
            ))}
            <a
              href="#contact"
              className="bg-brand-600 hover:bg-brand-700 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-xl hover:shadow-brand-500/30 active:scale-95"
            >
              立即咨询
            </a>
          </div>

          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-neutral-900 hover:text-brand-600 p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="lg:hidden overflow-hidden bg-white border-t border-neutral-100 shadow-2xl"
      >
        <div className="px-4 pt-4 pb-8 space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-4 py-4 text-lg font-bold text-neutral-800 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="tel:13681624613"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-3 text-base font-bold text-brand-600"
          >
            +86 136 8162 4613
          </a>
          <div className="pt-4 px-4">
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block text-center w-full bg-brand-600 text-white px-6 py-5 rounded-2xl font-bold shadow-lg shadow-brand-500/20"
            >
              立即咨询
            </a>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
