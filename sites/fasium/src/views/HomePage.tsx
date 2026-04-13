'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import HowItWorks from '../components/HowItWorks';
import CoreFeatures from '../components/CoreFeatures';
import Technology from '../components/Technology';
import KnowledgeEngine from '../components/KnowledgeEngine';
import UseCases from '../components/UseCases';
import Comparison from '../components/Comparison';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#FF8A00]/30 selection:text-white">      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <CoreFeatures />
        <Technology />
        <KnowledgeEngine />
        <UseCases />
        <Comparison />
        <Testimonials />
        <FAQ />
        <Contact />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
