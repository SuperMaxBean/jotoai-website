"use client";

import React, { useEffect, useRef } from 'react';
import { ArrowRight, ScanLine, BrainCircuit, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const QUESTIONS = [
    {
        id: 1,
        score: "15分",
        title: "1. (15分) 已知函数 f(x) = ax + x ln x 的图像在 x=e 处的切线斜率为 3.",
        handwriting: (
            <>
                解: f'(x) = a + ln x + 1 <br/>
                f'(e) = a + 1 + 1 = 3  {"=>"} a = 1
            </>
        ),
        type: "correct"
    },
    {
        id: 2,
        score: "15分",
        title: "2. (15分) 证明：当 x > 1 时，x - 1 - ln x > 0",
        handwriting: (
            <>
                令 g(x) = x - 1 - ln x <br/>
                g'(x) = 1 - 1/x = (x-1)/x <br/>
                当 x {">"} 1 时, g'(x) {">"} 0 <br/>
                <span className="relative inline-block">
                    ∴ g(x) 在 (1, +∞) 单调递增
                    <span className="absolute -top-1 -right-4 w-2 h-2 bg-red-500/50 rounded-full animate-ping"></span>
                </span>
            </>
        ),
        type: "wrong"
    },
    {
        id: 3,
        score: "10分",
        title: "3. (10分) 计算不定积分 ∫ x e^x dx",
        handwriting: (
            <>
                解: 令 u = x, dv = e^x dx <br/>
                du = dx, v = e^x <br/>
                ∴ ∫ x e^x dx = x e^x - ∫ e^x dx <br/>
                = x e^x - e^x + C
            </>
        ),
        type: "correct"
    },
    {
        id: 4,
        score: "12分",
        title: "4. (12分) 求极限 lim(x→0) (e^x - 1 - x) / x²",
        handwriting: (
            <>
                解: 洛必达法则 (L'Hopital's Rule) <br/>
                原式 = lim(x→0) (e^x - 1) / 2x <br/>
                = lim(x→0) e^x / 2 = 1/2
            </>
        ),
        type: "correct"
    },
    {
        id: 5,
        score: "12分",
        title: "5. (12分) 设 z = 1 + i, 求 |z| 及 z²",
        handwriting: (
            <>
                解: |z| = √(1² + 1²) = √2 <br/>
                z² = (1+i)² = 1 + 2i + i² <br/>
                ∵ i² = -1 <br/>
                ∴ z² = 1 + 2i - 1 = 2i
            </>
        ),
        type: "correct"
    },
    {
        id: 6,
        score: "14分",
        title: "6. (14分) 已知向量 a=(1,2), b=(x,4), 且 a//b, 求 x",
        handwriting: (
            <>
                解: ∵ a // b <br/>
                ∴ 1×4 - 2x = 0 <br/>
                4 - 2x = 0 <br/>
                2x = 4 {"=>"} x = 2
            </>
        ),
        type: "correct"
    }
];

// Duplicate for infinite scroll
const SCROLL_ITEMS = [...QUESTIONS, ...QUESTIONS];

interface HeroProps {
  onNavigate?: (page: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const { t } = useLanguage();

  const handleNavigate = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = canvas.width;
    let height = canvas.height;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseX: number;
      baseY: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.3; // Slower, calmer movement
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (maxDistance - distance) / maxDistance;

            const directionX = forceDirectionX * force * 1.5;
            const directionY = forceDirectionY * force * 1.5;

            this.x += directionX;
            this.y += directionY;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124, 58, 237, 0.4)'; // Lower opacity
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((width * height) / 25000); // Less dense
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const resize = () => {
      if (section && canvas) {
        width = canvas.width = section.offsetWidth;
        height = canvas.height = section.offsetHeight;
        initParticles();
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.update();
        p.draw();

        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.4 * (1 - distance / 200)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
        }

        for (let j = i; j < particles.length; j++) {
            const p2 = particles[j];
            const dx2 = p.x - p2.x;
            const dy2 = p.y - p2.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (distance2 < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - distance2 / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
  };

  const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative pt-36 pb-24 lg:pt-52 lg:pb-40 overflow-hidden gradient-hero grid-bg"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-purple-100 shadow-sm mb-8 hover:shadow-md transition-shadow cursor-default">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-slate-600 text-xs font-bold tracking-widest uppercase">{t('JOTO 旗下核心教育产品', 'JOTO Core Education Product')}</span>
            </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0A1A2F] tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
            {t('闪阅', 'ShanYue')} <span className="text-[#7c3aed]">{t('AI 全科阅卷', 'AI All-Subject Grading')}</span>
          </h1>
          <p className="text-2xl font-medium text-slate-700 mb-6 font-mono tracking-tight opacity-90">
             {t('[ 面向未来的教学评估与资产沉淀平台 ]', '[ Future-Oriented Teaching Assessment & Asset Platform ]')}
          </p>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            {t(
              '让老师从"批卷机器"回归"教学设计者"。',
              'Free teachers from "grading machines" back to "instructional designers".'
            )}<br/>
            {t(
              '重构批阅工作流，实现从"批卷"走向"教学数据资产"。',
              'Reinvent the grading workflow, turning grading into teaching data assets.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
            <a
              href='/contact'

              className="bg-[#7c3aed] text-white px-10 py-4 rounded-xl text-base font-bold hover:bg-[#6d28d9] transition-all hover:-translate-y-1 hover:shadow-lg shadow-purple-500/20 w-full sm:w-auto text-center cursor-pointer"
            >
              {t('预约演示', 'Book Demo')}
            </a>
            <a
              href='/contact'

              className="group flex items-center justify-center text-[#0A1A2F] px-10 py-4 rounded-xl text-base font-bold bg-white border border-slate-200 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-500/5 transition-all w-full sm:w-auto cursor-pointer"
            >
              {t('定制方案咨询', 'Custom Solution')}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-[#7c3aed]" />
            </a>
          </div>
        </div>

        {/* Hero Visual - Premium Browser Window */}
        <div className="relative mx-auto max-w-6xl mt-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Enhanced Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-purple-300/20 via-blue-200/20 to-purple-300/20 blur-[100px] -z-10" />

          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-white/60 ring-1 ring-slate-900/5 overflow-hidden relative backdrop-blur-sm">
            {/* Mac-style Header */}
            <div className="bg-slate-50/80 backdrop-blur border-b border-slate-200 px-5 py-3.5 flex items-center gap-4 relative z-20">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                </div>
                {/* Centered URL Bar */}
                <div className="absolute left-1/2 -translate-x-1/2 w-1/2 max-w-md">
                     <div className="bg-white/80 hover:bg-white transition-colors px-3 py-1.5 rounded-md text-xs text-slate-500 border border-slate-200/60 shadow-sm font-mono flex items-center justify-center gap-2 group cursor-text">
                        <span className="text-slate-400 group-hover:text-[#7c3aed] transition-colors"><ScanLine size={12}/></span>
                        <span>shanyue.jotoai.com/grading/math-101</span>
                    </div>
                </div>
            </div>

            {/* Split View Interface */}
            <div className="flex flex-col md:flex-row h-[680px] bg-[#fcfcfc]">

                {/* Left: Scanned Paper (Scrollable) */}
                <div className="flex-1 border-r border-slate-200 overflow-hidden relative flex flex-col bg-[#FAFAFA]">

                    <div className="p-3 sm:p-4 md:p-6 pb-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                        <div className="flex justify-between items-start gap-3 sm:gap-4">
                             <div className="min-w-0 flex-1">
                                 <h2 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800 tracking-tight break-words leading-tight">{t('利用导数研究不等式问题', 'Using Derivatives to Study Inequalities')}</h2>
                                 <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-400 mt-1 font-mono">Exam ID: 2024-MATH-FINAL-01</p>
                             </div>
                             <div className="text-right flex-shrink-0">
                                 <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#7c3aed] leading-none">88</div>
                                 <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Score</div>
                             </div>
                         </div>
                    </div>

                    {/* Paper Container - Scrollable Area */}
                    <div className="flex-1 w-full h-full relative overflow-hidden">
                         {/* Scrolling Content */}
                         <div className="animate-scroll-vertical w-full px-6 pt-6 pb-20">
                             {SCROLL_ITEMS.map((q, index) => (
                                 <div key={`${q.id}-${index}`} className="mb-8 last:mb-0">
                                     {/* Question Card */}
                                     <div className={`relative p-5 rounded-xl border transition-all duration-300 ${
                                         q.type === 'correct' ? 'bg-white border-slate-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5' :
                                         q.type === 'wrong' ? 'bg-red-50/30 border-red-100 hover:shadow-lg hover:shadow-red-500/5' : ''
                                     }`}>

                                         {/* Status Indicators */}
                                         {q.type === 'correct' && (
                                                <div className="absolute top-4 right-4 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                    <CheckCircle2 size={12} /> Full Score
                                                </div>
                                         )}

                                         {q.type === 'wrong' && (
                                                <div className="absolute top-4 right-4 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                    <XCircle size={12} /> Review
                                                </div>
                                         )}

                                         {/* Question Title */}
                                         <p className="mb-4 text-sm text-slate-700 font-bold leading-relaxed pr-20">{q.title}</p>

                                         {/* Handwritten Answer */}
                                         <div className="pl-4 border-l-2 border-slate-200 font-handwriting text-[#000080]/80 relative py-1">
                                            {q.handwriting}
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>

                         {/* Gradient Overlays */}
                         <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
                         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAFA] to-transparent z-10 pointer-events-none"></div>
                    </div>
                </div>

                {/* Right: Grading Analysis (Static) */}
                <div className="w-full md:w-[400px] bg-white p-0 flex flex-col border-l border-slate-100 z-20 shadow-[ -10px_0_30px_rgba(0,0,0,0.02)]">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <BrainCircuit size={16} className="text-[#7c3aed]" />
                            AI Insight Engine
                        </h3>
                    </div>

                    {/* Feedback Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar bg-slate-50/30">
                        {/* Positive Feedback */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-green-200 transition-colors">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-xl"></div>
                            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><CheckCircle2 size={12}/></span>
                                {t('逻辑推导完整', 'Complete Logical Derivation')}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed pl-7">
                                {t(
                                  '准确求出切线斜率，并在 x=e 处正确计算导数值。逻辑清晰，步骤完整。',
                                  'Accurately found the tangent slope and correctly calculated the derivative at x=e. Clear logic with complete steps.'
                                )}
                            </p>
                        </div>

                        {/* Constructive Feedback */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-amber-200 transition-colors">
                             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl"></div>
                            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><AlertCircle size={12}/></span>
                                {t('论证过程跳跃', 'Argument Gaps')}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed pl-7 mb-2">
                                {t(
                                  '虽然结论正确，但 "单调递增" 推导过程缺乏关键步骤。建议补充 g(1)=0 的验证。',
                                  'The conclusion is correct, but the "monotonically increasing" derivation lacks key steps. Recommend verifying g(1)=0.'
                                )}
                            </p>
                            <div className="pl-7">
                                <span className="inline-block bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded">{t('建议扣分: 0.5', 'Suggested Deduction: 0.5')}</span>
                            </div>
                        </div>

                        {/* Knowledge Graph Asset */}
                        <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border border-purple-100/50">
                            <h4 className="text-xs font-bold text-slate-800 mb-4 uppercase tracking-wider flex justify-between items-center">
                                {t('知识点掌握度', 'Knowledge Mastery')}
                                <span className="text-purple-600">High</span>
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-[11px] text-slate-600 mb-1.5 font-medium">
                                        <span>{t('导数应用 (Derivatives)', 'Derivatives Application')}</span>
                                        <span className="text-slate-900">95%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#7c3aed] w-[95%] rounded-full"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[11px] text-slate-600 mb-1.5 font-medium">
                                        <span>{t('逻辑推理 (Logic)', 'Logical Reasoning')}</span>
                                        <span className="text-slate-900">82%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#7c3aed] w-[82%] rounded-full opacity-60"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 border-t border-slate-100 bg-white flex gap-3">
                        <button className="flex-1 bg-[#0A1A2F] text-white text-xs font-bold py-3 rounded-lg hover:bg-[#0A1A2F]/90 transition-all shadow-lg shadow-slate-900/10">
                            {t('生成个性化作业', 'Generate Personalized Homework')}
                        </button>
                        <button className="flex-1 border border-slate-200 text-slate-600 text-xs font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors hover:border-slate-300">
                            {t('查看全班分析', 'View Class Analysis')}
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
