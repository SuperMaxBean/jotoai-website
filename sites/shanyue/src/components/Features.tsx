"use client";


import React, { useEffect, useState } from 'react';
import { FEATURES } from '../constants';
import { 
    BookOpen, Calculator, Languages, Atom, FlaskConical,
    Dna, ScrollText, Globe, Landmark, CheckCircle2,
    XCircle, BrainCircuit
} from 'lucide-react';

// Custom component for the "Subject Coverage" feature
const CustomDiagram = () => {
  const subjects = [
    { name: '数学', en: 'Math', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50', border: 'group-hover:border-blue-200' },
    { name: '语文', en: 'Chinese', icon: BookOpen, color: 'text-red-600', bg: 'bg-red-50', border: 'group-hover:border-red-200' },
    { name: '英语', en: 'English', icon: Languages, color: 'text-purple-600', bg: 'bg-purple-50', border: 'group-hover:border-purple-200' },
    { name: '物理', en: 'Physics', icon: Atom, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'group-hover:border-indigo-200' },
    { name: '化学', en: 'Chemistry', icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'group-hover:border-emerald-200' },
    { name: '生物', en: 'Biology', icon: Dna, color: 'text-teal-600', bg: 'bg-teal-50', border: 'group-hover:border-teal-200' },
    { name: '历史', en: 'History', icon: ScrollText, color: 'text-amber-600', bg: 'bg-amber-50', border: 'group-hover:border-amber-200' },
    { name: '地理', en: 'Geography', icon: Globe, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'group-hover:border-cyan-200' },
    { name: '政治', en: 'Politics', icon: Landmark, color: 'text-rose-600', bg: 'bg-rose-50', border: 'group-hover:border-rose-200' },
  ];

  // Triplicate the list to ensure seamless scrolling with buffer
  const scrollSubjects = [...subjects, ...subjects, ...subjects];

  return (
    <div className="w-full h-full bg-slate-50/30 relative overflow-hidden select-none flex flex-col items-center justify-center">
       {/* Background Decoration */}
       <div className="absolute inset-0 bg-white/40"></div>
       <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl opacity-60"></div>
       <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl opacity-60"></div>

       {/* Gradient Masks for smooth scroll edges - Top and Bottom */}
       <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none"></div>

       {/* Scrolling Container */}
       <div className="relative z-10 w-full max-w-[460px] h-full overflow-hidden py-10">
          <div className="animate-scroll-y grid grid-cols-3 gap-4 w-full absolute top-0 left-0 px-6">
             {scrollSubjects.map((s, i) => (
                 <div 
                    key={i} 
                    className={`bg-white border border-slate-100/80 rounded-2xl p-4 flex flex-col items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-500 aspect-[4/3] ${s.border} group relative`}
                 >
                    <div className={`${s.bg} p-3 rounded-xl mb-3 ${s.color} transition-colors duration-300 ring-1 ring-inset ring-black/5`}>
                        <s.icon size={24} strokeWidth={2} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 tracking-tight">{s.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1 opacity-70">{s.en}</span>
                 </div>
             ))}
          </div>
       </div>

       {/* Animation Styles */}
       <style>{`
         @keyframes scroll-y {
           0% { transform: translateY(-33.33%); }
           100% { transform: translateY(0); }
         }
         .animate-scroll-y {
           animation: scroll-y 25s linear infinite;
         }
         .animate-scroll-y:hover {
            animation-play-state: paused;
         }
       `}</style>
    </div>
  )
}

// New Component: Animated OCR Visualization
const OCRDemo = () => {
  return (
    <div className="relative w-full h-full bg-[#fcfcfc] overflow-hidden flex items-center justify-center select-none font-serif border-0">
      {/* Grid Background */}
      <div className="absolute inset-0 z-0 opacity-40" 
           style={{
             backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
             backgroundSize: '32px 32px'
           }}
      />
      
      {/* HUD Corners - Cleaner Look */}
      <div className="absolute inset-8 border border-slate-100 rounded-3xl z-0"></div>
      
      {/* Center Focus Area */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
         <div className="w-64 h-32 border-x border-purple-100 opacity-50"></div>
      </div>

      {/* Math Equation Container */}
      <div className="relative z-10 bg-white px-8 py-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-3 md:gap-5 scale-90 md:scale-100 lg:scale-110 transition-transform">
         
         {/* Part 1: Integral */}
         <div className="relative group mr-1">
            <span className="text-5xl font-light italic text-slate-800 font-[Times_New_Roman]">∫</span>
            {/* Annotation */}
            <div className="absolute top-[85%] left-[-5px] w-3 h-3 rounded-full bg-white border-[2.5px] border-purple-500 opacity-0 animate-[fadeIn_0.1s_1.0s_forwards] shadow-sm"></div>
            <div className="absolute top-[calc(85%+6px)] left-0 w-8 h-[1px] bg-purple-500 origin-left rotate-[45deg] opacity-0 animate-[fadeIn_0.1s_1.2s_forwards]"></div>
            <div className="absolute top-[calc(85%+30px)] left-[20px] bg-slate-900 text-white text-[9px] font-sans font-bold px-2 py-1 rounded shadow-lg opacity-0 animate-[fadeIn_0.3s_1.4s_forwards]">
               SYMBOL
            </div>
         </div>

         {/* Part 2: Fraction */}
         <div className="flex flex-col items-center">
             <div className="border-b-2 border-slate-800 px-3 pb-1 mb-1 flex items-center gap-2">
                <span className="text-3xl font-serif italic font-semibold text-slate-800">x²</span>
                <span className="text-3xl font-serif text-slate-800">sin(x)</span>
             </div>
             <div className="relative">
                 <span className="text-3xl font-serif italic text-slate-800">eˣ</span>
             </div>
             
              {/* Group Annotation */}
              <div className="absolute -right-4 top-0 bottom-0 w-[1px] bg-purple-200 opacity-0 animate-[fadeIn_0.5s_2.5s_forwards]"></div>
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 bg-purple-50 text-purple-700 text-[9px] font-sans font-bold px-2 py-1 rounded border border-purple-100 opacity-0 animate-[fadeIn_0.3s_2.7s_forwards]">
                 COMPLEX_TERM
              </div>
         </div>

         {/* Part 3: dx */}
         <div className="relative pt-2 ml-1">
             <span className="text-4xl font-serif italic text-slate-800">dx</span>
         </div>

         {/* Part 4: = */}
         <div className="relative mx-1 pt-1">
             <span className="text-4xl font-serif text-slate-400">=</span>
         </div>
         
         {/* Result (Simulated) */}
         <div className="flex items-center gap-1 pt-1 opacity-50 blur-[1px]">
             <span className="text-3xl font-serif italic text-slate-800">...</span>
         </div>
      </div>

      {/* Modern Scanner Bar */}
      <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-500 to-transparent shadow-[0_0_25px_2px_rgba(168,85,247,0.4)] z-30 animate-[scan_5s_ease-in-out_infinite]" />
      
      <style>{`
        @keyframes scan {
            0% { left: -10%; }
            100% { left: 110%; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const GradingEngineDemo = () => {
    return (
        <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden flex items-center justify-center select-none font-sans text-xs md:text-sm">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 z-0 opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10 w-full max-w-[90%] md:max-w-[85%] h-full flex items-center justify-between gap-6">
                
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    <defs>
                         <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#cbd5e1" />
                        </marker>
                    </defs>
                    <path d="M 42% 38% C 48% 38%, 48% 35%, 54% 35%" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" className="opacity-0 animate-[drawPath_0.6s_1.2s_forwards]" strokeDasharray="100" strokeDashoffset="100" />
                    <path d="M 35% 50% C 40% 50%, 40% 52%, 54% 52%" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" className="opacity-0 animate-[drawPath_0.6s_3.2s_forwards]" strokeDasharray="100" strokeDashoffset="100" />
                    <path d="M 32% 62% C 40% 62%, 40% 68%, 54% 68%" fill="none" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" className="opacity-0 animate-[drawPath_0.6s_5.2s_forwards]" strokeDasharray="100" strokeDashoffset="100" />
                </svg>

                {/* Left Panel: Paper Card */}
                <div className="bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 p-8 w-[45%] h-[65%] flex flex-col justify-center relative z-10">
                    <div className="absolute top-4 left-4 text-[9px] text-slate-400 font-bold tracking-widest uppercase bg-slate-50 px-2 py-1 rounded">Input Source</div>
                    <div className="space-y-6 font-handwriting text-[#1e293b] text-xl leading-relaxed">
                        <div className="flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_0.5s_forwards]">
                            <span className="font-medium tracking-wide">(3x + 4)(2x - 1)</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_2.5s_forwards]">
                            <div className="relative font-medium tracking-wide">
                                6x² - 3x + <span className="relative inline-block px-1">8x
                                    <div className="absolute inset-0 border-2 border-red-400 rounded-full opacity-0 animate-[drawCircle_0.4s_3.0s_forwards]"></div>
                                </span> - 4
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 animate-[fadeIn_0.5s_4.5s_forwards]">
                             <div className="relative font-medium tracking-wide">
                                6x² + <span className="relative inline-block px-1">5x
                                    <div className="absolute inset-0 border-2 border-red-400 rounded-full opacity-0 animate-[drawCircle_0.4s_5.0s_forwards]"></div>
                                </span> - 4
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Logic Blocks (Glass Cards) */}
                <div className="flex flex-col gap-3 w-[50%] z-10">
                    {/* Step 1 */}
                    <div className="relative opacity-0 animate-[slideInRight_0.5s_1.5s_forwards]">
                        <div className="bg-white/80 backdrop-blur border border-green-100 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-slate-700">Expansion Check</div>
                            </div>
                            <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+2</div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative opacity-0 animate-[slideInRight_0.5s_3.5s_forwards]">
                        <div className="bg-white/80 backdrop-blur border border-red-100 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <XCircle size={16} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-slate-700">Calculation Error</div>
                                <div className="text-[10px] text-slate-400">Line 2: 8x should be -8x</div>
                            </div>
                            <div className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">-2</div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative opacity-0 animate-[slideInRight_0.5s_5.5s_forwards]">
                         <div className="bg-white/80 backdrop-blur border border-purple-100 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <BrainCircuit size={16} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <div className="text-xs font-bold text-slate-700">Logic Validated</div>
                                <div className="text-[10px] text-slate-400">Method correct despite error</div>
                            </div>
                            <div className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">+1</div>
                        </div>
                    </div>
                </div>

            </div>
            
            <style>{`
                @keyframes drawPath {
                    to { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes drawCircle {
                    to { stroke-dashoffset: 0; opacity: 1; }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    )
}

const TemplateEditorDemo = () => {
    return (
        <div className="relative w-full h-full bg-slate-50 flex flex-col overflow-hidden font-sans select-none">
            {/* Toolbar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 justify-between shadow-sm z-20">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider">Editor Mode</div>
                 </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative p-8 flex justify-center items-start overflow-hidden">
                
                {/* The Paper */}
                <div className="bg-white shadow-2xl shadow-slate-200 w-full max-w-lg min-h-[500px] relative p-8 rounded-lg ring-1 ring-slate-900/5">
                    {/* Header */}
                    <div className="border-b-2 border-slate-900 pb-4 mb-8">
                        <h3 className="text-lg font-bold text-slate-900 font-serif break-words">利用导数研究不等式问题</h3>
                    </div>

                    {/* Content Columns */}
                    <div className="space-y-8">
                        {/* Question 1 */}
                        <div className="relative group">
                            <div className="text-sm font-serif leading-relaxed mb-3 text-slate-800">
                                <span className="font-bold">1. (15分)</span> 已知函数 f(x) = ax + x ln x 的图像在 x=e 处的切线斜率为 3.
                            </div>
                            <div className="font-handwriting text-blue-900 text-lg opacity-80 pl-4 border-l-2 border-slate-100">
                                解: f'(x) = a + ln x + 1 <br/>
                                f'(e) = a + 1 + 1 = 3  {"=>"} a = 1
                            </div>

                            {/* Clean Editor Overlays */}
                            <div className="absolute -top-3 -left-3 -right-3 bottom-[60%] border-2 border-dashed border-green-400 bg-green-50/20 rounded-lg animate-[pulseBox_3s_infinite]">
                                 <div className="absolute -top-2.5 left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">Q-ZONE</div>
                            </div>
                            <div className="absolute top-[45%] -left-3 -right-3 -bottom-3 border-2 border-dashed border-blue-400 bg-blue-50/20 rounded-lg animate-[pulseBox_3s_1.5s_infinite]">
                                 <div className="absolute -top-2.5 left-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">A-ZONE</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Scanning Line Effect */}
                    <div className="absolute left-0 right-0 h-[1px] bg-red-500 shadow-[0_0_20px_2px_rgba(239,68,68,0.5)] z-30 animate-[scanVertical_4s_linear_infinite] pointer-events-none opacity-80"></div>
                </div>
            </div>

            <style>{`
                @keyframes pulseBox {
                    0%, 100% { opacity: 0.4; border-color: rgba(96, 165, 250, 0.4); }
                    50% { opacity: 1; border-color: rgba(96, 165, 250, 1); }
                }
                @keyframes scanVertical {
                    0% { top: 10%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 60%; opacity: 0; }
                }
            `}</style>
        </div>
    )
}

const Features: React.FC = () => {
  return (
    <section className="py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-32 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1A2F] mb-6 tracking-tight leading-tight">
            从“批卷”走向 <span className="text-[#7c3aed]">积累教学数据资产</span>
          </h2>
          <p className="text-xl text-slate-500 font-light">
             不仅仅是工具，更是教育数字化转型的基础设施
          </p>
        </div>

        <div className="space-y-40">
          {FEATURES.map((feature, idx) => (
            <div 
                key={idx} 
                className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${
                    feature.align === 'right' ? 'lg:flex-row-reverse' : ''
                }`}
            >
              {/* Text Content */}
              <div className="flex-1 lg:max-w-xl">
                <div className="inline-flex items-center gap-2 border border-purple-100 bg-purple-50/50 rounded-full px-4 py-1.5 mb-8">
                    <feature.icon size={14} className="text-[#7c3aed]" />
                    <span className="text-xs font-bold tracking-widest text-[#7c3aed] uppercase">{feature.tag}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] mb-6 leading-tight tracking-tight">
                    {feature.title}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    {feature.desc}
                </p>
              </div>

              {/* Image/Mockup Wrapper */}
              <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 bg-white aspect-[4/3] flex items-center justify-center p-0 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500">
                    
                    {/* Feature Visualization Switcher */}
                    {feature.title === '全题型覆盖' ? (
                        <CustomDiagram />
                    ) : feature.title === '自研 OCR 智能试卷识别' ? (
                        <OCRDemo />
                    ) : feature.title === '智能分步阅卷引擎' ? (
                        <GradingEngineDemo />
                    ) : feature.title === '自动识别题目与答题区域' ? (
                        <TemplateEditorDemo />
                    ) : (
                        <div className="relative w-full h-full bg-slate-50 flex items-center justify-center overflow-hidden">
                            {feature.image ? (
                                <img 
                                    src={feature.image} 
                                    alt={feature.title} 
                                    className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
                                        feature.imageFit === 'contain' 
                                            ? 'object-contain p-8' 
                                            : 'object-cover'
                                    }`}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 flex items-center justify-center">
                                    <span className="text-purple-300 text-6xl font-extrabold">{feature.tag}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
