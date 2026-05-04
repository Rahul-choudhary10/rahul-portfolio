import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeContext';

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#020817] text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-500`}>
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb w-[600px] h-[600px] bg-purple-600/10 -top-48 -left-48" style={{ animationDelay: '0s' }} />
        <div className="orb w-[500px] h-[500px] bg-blue-600/10 -bottom-48 -right-48" style={{ animationDelay: '3s' }} />
        <div className="orb w-[300px] h-[300px] bg-pink-600/8 top-1/2 left-1/2 -translate-x-1/2" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
