import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { useIntersectionObserver } from '../utils/useIntersectionObserver';

const ComparisonItem = ({ feature, weike, others, isLast }: { feature: string, weike: string, others: string, isLast?: boolean }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-6 ${!isLast ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors group`}>
    <div className="font-bold text-white flex items-center md:text-lg text-base">{feature}</div>
    
    <div className="flex items-center gap-3">
        <span className="md:hidden text-xs text-brand-green font-bold uppercase tracking-wider w-20 shrink-0">唯客</span>
        <div className="text-brand-green font-medium flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center shrink-0 border border-brand-green/30">
            <Check size={14} strokeWidth={3} />
        </div>
        <span className="text-white group-hover:text-brand-green transition-colors">{weike}</span>
        </div>
    </div>

    <div className="flex items-center gap-3">
        <span className="md:hidden text-xs text-gray-500 font-bold uppercase tracking-wider w-20 shrink-0">其他方案</span>
        <div className="text-gray-400 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/10">
            {others.includes("不支持") || others.includes("风险") || others.includes("高") || others.includes("需") || others.includes("阻断") || others.includes("结束") ? <X size={14} className="text-red-400"/> : <Minus size={14} className="text-gray-500"/>}
        </div>
        <span>{others}</span>
        </div>
    </div>
  </div>
);

const CompetitorComparison: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();

  return (
    <section className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            为什么选择唯客 AI 护栏？
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            相比通用开源方案或传统网关，唯客 AI 护栏专为 LLM 场景设计，提供极致的性能与合规性。
          </p>
        </div>

        <div 
          ref={ref}
          className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          {/* Header (Desktop only) */}
          <div className="hidden md:grid grid-cols-3 gap-4 p-6 bg-white/5 border-b border-white/10 text-sm uppercase tracking-wider font-semibold">
            <div className="text-gray-500">核心能力</div>
            <div className="text-brand-blue flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
                唯客 AI 护栏
            </div>
            <div className="text-gray-500">
                通用开源 / 传统方案
            </div>
          </div>

          {/* Rows - Reordered Dify to bottom */}
          <ComparisonItem 
            feature="检测延迟" 
            weike="< 50ms (流式并行检测)" 
            others="> 500ms (串行/批处理)" 
          />
          <ComparisonItem 
            feature="数据隐私" 
            weike="本地私有化部署，数据不出域" 
            others="SaaS API，存在数据出境风险" 
          />
           <ComparisonItem 
            feature="PII 识别能力" 
            weike="20+ 中国特化类型 (身份证/银行卡)" 
            others="仅支持基础正则或英文实体" 
          />
          <ComparisonItem 
            feature="敏感内容处理" 
            weike="智能脱敏 (***)，对话不中断" 
            others="整段阻断，强制结束会话" 
          />
           <ComparisonItem 
            feature="企业级服务" 
            weike="SLA 保障 + 专家支持" 
            others="无保障 / 社区支持" 
          />
          <ComparisonItem 
            feature="Dify 集成" 
            weike="一键嵌入" 
            others="需二次开发对接" 
            isLast
          />
        </div>
      </div>
    </section>
  );
};

export default CompetitorComparison;