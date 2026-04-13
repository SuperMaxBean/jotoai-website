'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Atom, FlaskConical, Dna, ScrollText, Globe2, Landmark, 
  BrainCircuit, FileSpreadsheet, Presentation, FileJson,
  Database, Share2, FileText
} from 'lucide-react';

// 1. Parsing Capability Visual (Enterprise Document Parsing)
export const VisualParsing = () => {
  const docTypes = [
    { icon: FileText, label: "PDF/Word", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: FileSpreadsheet, label: "Excel/CSV", color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: Presentation, label: "PPT", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: Globe2, label: "Web/HTML", color: "text-cyan-500", bg: "bg-cyan-50" },
  ];

  return (
    <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center p-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="flex w-full max-w-md items-center justify-between relative z-10">
        {/* Left: Input Documents */}
        <div className="flex flex-col gap-3">
          {docTypes.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${doc.bg} border border-slate-100 shadow-sm`}
            >
              <doc.icon className={`w-4 h-4 ${doc.color}`} />
              <span className="text-xs font-bold text-slate-600">{doc.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Middle: Parsing Engine */}
        <div className="relative flex items-center justify-center px-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-300 flex items-center justify-center"
          >
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
          </motion.div>
          
          {/* Animated particles flowing right */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 30], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                className="absolute left-0 w-1.5 h-1.5 bg-indigo-500 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Right: Structured Output */}
        <div className="flex flex-col gap-3">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-inner w-28"
          >
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <FileJson className="w-3 h-3 text-indigo-500" /> JSON
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full" />
            <div className="h-1.5 w-4/5 bg-slate-200 rounded-full" />
            <div className="h-1.5 w-full bg-slate-200 rounded-full" />
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-inner w-28"
          >
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
              <ScrollText className="w-3 h-3 text-indigo-500" /> Markdown
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full" />
            <div className="h-1.5 w-3/4 bg-slate-200 rounded-full" />
          </motion.div>
        </div>
      </div>

      {/* Floating Background */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-50 rounded-full blur-3xl pointer-events-none z-0"
      />
    </div>
  );
};

// 2. Knowledge Base Visual (Enterprise RAG)
export const VisualKnowledgeBase = () => {
  return (
    <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center p-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
      
      <div className="w-full max-w-md relative z-10 flex flex-col items-center gap-6">
        
        {/* Search Bar */}
        <motion.div 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full bg-white border border-slate-200 rounded-full px-4 py-3 flex items-center gap-3 shadow-sm"
        >
          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
          <div className="h-2 w-32 bg-slate-200 rounded-full" />
        </motion.div>

        {/* Vector DB & Retrieval */}
        <div className="flex items-center gap-6 w-full justify-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-24 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center gap-2 shadow-inner relative"
          >
            <Database className="w-8 h-8 text-blue-500" />
            <span className="text-[9px] font-bold text-blue-700 uppercase">Vector DB</span>
            
            {/* Connecting line up */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-slate-200" />
          </motion.div>

          {/* Retrieved Chunks */}
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div className="h-1.5 w-16 bg-slate-300 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Generated Answer */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 relative"
        >
          <div className="flex gap-2 mb-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <div className="h-2 w-24 bg-indigo-200 rounded-full mt-1" />
          </div>
          <div className="space-y-1.5 pl-6">
            <div className="h-1.5 w-full bg-slate-300 rounded-full" />
            <div className="h-1.5 w-5/6 bg-slate-300 rounded-full" />
            <div className="h-1.5 w-4/6 bg-slate-300 rounded-full" />
          </div>
          {/* Citation badge */}
          <div className="absolute bottom-3 right-3 bg-white border border-slate-200 text-[8px] font-bold text-slate-500 px-1.5 py-0.5 rounded shadow-sm">
            [1] [2]
          </div>
        </motion.div>

      </div>
    </div>
  );
};

// 3. Skills Visual
export const VisualSkills = () => {
  return (
    <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center p-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
      
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Center Node */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-200 z-20 relative"
        >
          <BrainCircuit className="w-10 h-10 text-white" />
        </motion.div>

        {/* Satellite Nodes */}
        {[
          { icon: FileSpreadsheet, label: "Excel", pos: "top-0 left-1/4" },
          { icon: Presentation, label: "PPT", pos: "top-1/4 right-0" },
          { icon: FileText, label: "Report", pos: "bottom-0 right-1/4" },
          { icon: FileJson, label: "JSON", pos: "bottom-1/4 left-0" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className={`absolute ${item.pos} w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-lg flex flex-col items-center justify-center z-10`}
          >
            <item.icon className="w-6 h-6 text-slate-600 mb-1" />
            <span className="text-[10px] font-bold text-slate-400">{item.label}</span>
          </motion.div>
        ))}

        {/* Connecting Lines (Simulated with absolute divs for simplicity) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <motion.line x1="50%" y1="50%" x2="25%" y2="20%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
          <motion.line x1="50%" y1="50%" x2="80%" y2="40%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
          <motion.line x1="50%" y1="50%" x2="75%" y2="80%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
          <motion.line x1="50%" y1="50%" x2="20%" y2="60%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      </div>
    </div>
  );
};

// 4. MCP Visual
export const VisualMCP = () => {
  return (
    <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-xl shadow-indigo-100 border border-slate-100 overflow-hidden relative flex flex-col items-center justify-center p-8">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
      
      <div className="grid grid-cols-2 gap-12 w-full max-w-lg relative z-10">
        {/* Left: AI World */}
        <div className="flex flex-col gap-4">
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
                <span className="font-bold text-indigo-900">JOTO Agent</span>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 bg-indigo-400 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                <span className="font-bold text-indigo-900">Claude</span>
            </div>
        </div>

        {/* Right: Business World */}
        <div className="flex flex-col gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <Database className="w-5 h-5 text-slate-500" />
                <span className="font-bold text-slate-700">ERP System</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <Share2 className="w-5 h-5 text-slate-500" />
                <span className="font-bold text-slate-700">DingTalk</span>
            </div>
        </div>
      </div>

      {/* Bridge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-24 h-24 bg-white rounded-full border-4 border-emerald-500 shadow-xl flex items-center justify-center z-20">
            <span className="font-black text-emerald-600 text-xl">MCP</span>
        </div>
        <motion.div 
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute w-full h-1 bg-emerald-200"
        />
      </div>
    </div>
  );
};
