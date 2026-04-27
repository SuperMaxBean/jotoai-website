import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import AboutSection from "./components/AboutSection";
import ProjectCase from "./components/ProjectCase";
import GlobalNetwork from "./components/GlobalNetwork";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <main className="relative min-h-screen bg-white selection:bg-brand-500/30 selection:text-brand-900">
      <Navbar />
      <Hero />
      <Services />
      <AboutSection />
      <ProjectCase />
      <GlobalNetwork />
      <ContactCTA />
      <Footer />
    </main>
  );
}
