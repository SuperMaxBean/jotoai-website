"use client";

'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS } from '../constants';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  // Allow multiple items to be open at once, or change logic to allow only one.
  // Using single open item for cleaner look by default, but set to -1 initially.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A1A2F] mb-4">
            常见问题 (FAQ)
          </h2>
          <p className="text-lg text-slate-500">
            关于部署、功能与安全的快速解答
          </p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border-b border-slate-100 last:border-0 transition-colors duration-300 ${isOpen ? 'bg-slate-50/50 rounded-lg border-transparent' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between py-6 px-4 text-left focus:outline-none group"
                >
                  <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-[#7c3aed]' : 'text-slate-800 group-hover:text-[#7c3aed]'}`}>
                    {item.question}
                  </span>
                  <div className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#7c3aed] text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-[#7c3aed]/10 group-hover:text-[#7c3aed]'}`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0 pb-0'}`}
                >
                  <div className="overflow-hidden px-4">
                    <p className="text-slate-600 leading-relaxed text-base pt-2 whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
