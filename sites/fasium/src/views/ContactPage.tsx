'use client';
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  // Scroll to top when entering the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      <main className="pt-20"> {/* Add padding for fixed navbar */}
        <div className="py-12 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{t('联系我们', 'Contact Us')}</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t(
                '无论您有任何疑问或合作意向，我们的团队都随时准备为您提供帮助。',
                'Whether you have questions or partnership inquiries, our team is always ready to help.'
              )}
            </p>
          </div>
        </div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
