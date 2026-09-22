import { useState, useEffect } from 'react';
import { Menu, X, Map, Globe, FileText, Compass, Mail } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenContact: () => void;
}

export default function Navigation({ activeSection, setActiveSection, onOpenContact }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'projects', label: 'GIS Projects', icon: Map },
    { id: 'resume', label: 'Curriculum Vitae', icon: FileText },
    { id: 'speculative-kit', label: 'Speculative Kit', icon: Compass },
  ];

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#2a473d]/10 bg-white shadow-sm ${
        scrolled ? 'py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
        {/* Logo / Brand Name */}
        <button
          onClick={() => scrollToSection('overview')}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#2a473d]/20 flex items-center justify-center bg-[#2a473d]/5 group-hover:bg-[#2a473d]/10 group-hover:border-[#2a473d]/40 transition-all duration-300">
            <span className="font-display font-semibold text-lg text-[#2a473d]">IM</span>
          </div>
          <div>
            <span className="block font-display font-semibold text-base sm:text-lg tracking-tight text-[#1b2421]">
              Isabella McInnes
            </span>
            <span className="block font-sans text-[10px] sm:text-xs tracking-wider uppercase text-[#4a6b5d] font-semibold">
              GIS &amp; Mapping Portfolio
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 rounded-full font-sans text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 group ${
                    isActive
                      ? 'text-[#fcfbf9] bg-[#2a473d]'
                      : 'text-[#4a6b5d] hover:text-[#1b2421] hover:bg-[#e6e3dd]/45'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#bda373]' : 'text-[#4a6b5d]/70 group-hover:text-[#2a473d]'}`} />
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#bda373]" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={onOpenContact}
            className="px-5 py-2 rounded-full bg-[#2a473d] hover:bg-[#1b2421] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow border border-[#bda373]/30 hover:scale-[1.02]"
          >
            <Mail className="w-3.5 h-3.5 text-[#bda373] animate-pulse" />
            Contact Me
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-[#2a473d] hover:bg-[#e6e3dd]/50 transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-[#2a473d]/10 py-4 shadow-xl px-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm font-bold flex items-center gap-3 transition-all ${
                  isActive
                    ? 'bg-[#2a473d] text-[#fcfbf9]'
                    : 'text-[#4a6b5d] hover:bg-[#e6e3dd]/45'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#bda373]' : 'text-[#4a6b5d]'}`} />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenContact();
            }}
            className="w-full text-center px-4 py-3 rounded-xl font-sans text-sm font-bold flex items-center justify-center gap-2 bg-[#2a473d] text-white hover:bg-[#bda373] transition-all cursor-pointer shadow border border-[#bda373]/20"
          >
            <Mail className="w-4 h-4 text-[#bda373]" />
            Contact Me
          </button>
        </div>
      )}
    </nav>
  );
}
