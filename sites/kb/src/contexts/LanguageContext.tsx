'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  t: (zh: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  toggleLanguage: () => {},
  t: (zh: string) => zh,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('fasium-lang') as Language | null;
    if (saved === 'en' || saved === 'zh') {
      setLang(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'zh' ? 'en' : 'zh';
      localStorage.setItem('fasium-lang', next);
      return next;
    });
  }, []);

  const t = useCallback((zh: string, en: string) => {
    return lang === 'zh' ? zh : en;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
