import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import ProjectsSection from './components/ProjectsSection';
import ResumeSection from './components/ResumeSection';
import SpeculativeLetter from './components/SpeculativeLetter';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'projects', 'resume', 'speculative-kit'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreProjects = () => {
    setActiveSection('projects');
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#1b2421]">
      {/* Navigation Bar */}
      <Navigation 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Hero Header Section */}
      <Header onExploreProjects={handleExploreProjects} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* Interactive GIS Mapping Projects Section */}
        <ProjectsSection />

        {/* Detailed Printable Resume / CV Section */}
        <ResumeSection />

        {/* Speculative Proposal Matching Assistant Section */}
        <SpeculativeLetter />

      </main>

      {/* Footer Section */}
      <Footer />

      {/* Persistent Contact Modal & Floating Action Button */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        onOpen={() => setIsContactOpen(true)}
      />
    </div>
  );
}
