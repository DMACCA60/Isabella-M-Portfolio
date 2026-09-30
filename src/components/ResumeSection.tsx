import { useState } from 'react';
import { 
  GraduationCap, Briefcase, Award, Calendar, MapPin, Printer, 
  Map, Camera, Binary, FileText, CheckCircle2, ChevronRight, User,
  Download, Loader2, X
} from 'lucide-react';
import { CV_PROFILE, SKILL_CATEGORIES, EDUCATION, EXPERIENCE, AFFILIATIONS } from '../data';

const getCompanyLogo = (company: string) => {
  switch (company) {
    case "Landmark Information Group (Argyll Branch)":
      return (
        <div className="w-12 h-12 bg-white border border-stone-200/80 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Specialized "L" from Landmark Information Group logo */}
            <path d="M22 20 V80 H72" stroke="#1b2421" strokeWidth="15" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
            {/* Orange dot as in original logo */}
            <circle cx="70" cy="42" r="11" fill="#f26522" />
          </svg>
        </div>
      );
    case "Hadden Hill Nursery":
      return (
        <div className="w-12 h-12 bg-[#f0f7f4] border border-[#2a473d]/10 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Elegant organic tree/leaf icon */}
            <path d="M50 15 C30 40 30 75 50 85 C70 75 70 40 50 15 Z" fill="#2a473d" />
            <path d="M50 35 V85" stroke="#fcfbf9" strokeWidth="4" strokeLinecap="round" />
            <path d="M50 50 C42 55 42 60 50 65" stroke="#fcfbf9" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M50 60 C58 65 58 70 50 75" stroke="#fcfbf9" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );
    case "Dobbies Garden Centres":
      return (
        <div className="w-12 h-12 bg-[#fcf9f2] border border-[#8b5a2b]/10 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Elegant botanical floral design */}
            <circle cx="50" cy="50" r="32" stroke="#4a6b5d" strokeWidth="5" fill="none" />
            <circle cx="50" cy="50" r="24" stroke="#8b5a2b" strokeWidth="2" strokeDasharray="4 4" fill="none" />
            {/* Center flower petals */}
            <circle cx="50" cy="42" r="8" fill="#4a6b5d" />
            <circle cx="50" cy="58" r="8" fill="#4a6b5d" />
            <circle cx="42" cy="50" r="8" fill="#4a6b5d" />
            <circle cx="58" cy="50" r="8" fill="#4a6b5d" />
            <circle cx="50" cy="50" r="6" fill="#ffb81c" />
          </svg>
        </div>
      );
    case "Hilton DoubleTree":
      return (
        <div className="w-12 h-12 bg-[#f9f6f0] border border-[#bda373]/20 rounded-xl flex items-center justify-center p-2 shadow-sm shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Elegant hospitality serif letter "H" and DoubleTree leaves */}
            <text x="50" y="65" fontFamily="Georgia, serif" fontWeight="bold" fontSize="48" fill="#bda373" textAnchor="middle">
              H
            </text>
            {/* Two stylized leaves at the top corner */}
            <path d="M25 22 C35 22 38 12 30 10 C22 12 15 22 25 22 Z" fill="#bda373" opacity="0.8" />
            <path d="M75 22 C65 22 62 12 70 10 C78 12 85 22 75 22 Z" fill="#bda373" opacity="0.8" />
          </svg>
        </div>
      );
    default:
      return null;
  }
};

export default function ResumeSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'Map': return <Map className="w-5 h-5" />;
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'Binary': return <Binary className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateActualPDF = () => {
    setIsGenerating(true);
    try {
      const link = document.createElement('a');
      link.href = '/resume.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Direct PDF Download Error:', err);
      // Fallback: open in new tab
      window.open('/resume.pdf', '_blank');
    } finally {
      setIsGenerating(false);
      setShowDownloadModal(false);
    }
  };

  const handleDownloadPDF = () => {
    setShowDownloadModal(true);
    setIsGenerating(true);
    setDownloadProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          generateActualPDF();
        }, 300);
      }
    }, 80);
  };

  return (
    <section id="resume" className="py-24 sm:py-32 bg-[#fcfbf9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header with Print Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 print:hidden">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-[#4a6b5d] font-semibold text-xs tracking-wider uppercase">
              <FileText className="w-4 h-4 text-[#bda373]" />
              Curriculum Vitae
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-[#1b2421] mb-4">
              Academic &amp; Professional Credentials
            </h2>
            <p className="text-[#1b2421]/75 leading-relaxed">
              Explore Isabella's first-class credentials, professional placement logs, and core competencies. 
              Use the PDF download option to output a cleanly styled, recruiter-ready physical document.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#2a473d] hover:bg-[#1b2421] text-[#fcfbf9] font-sans font-bold text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PDF Resume
            </button>
          </div>
        </div>

        {/* CV PRINT AREA FOR HIGH-FIDELITY PDF GENERATION */}
        <div id="cv-print-area">
          {/* PRINT ONLY HEADER - Hidden on screen, shown in print mode */}
          <div id="pdf-print-header" className="hidden print:block mb-8 border-b-2 border-[#2a473d] pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-display font-bold text-[#1b2421]">{CV_PROFILE.name}</h1>
              <p className="text-lg font-semibold text-[#4a6b5d] mt-1">{CV_PROFILE.title} | {CV_PROFILE.subtitle}</p>
              <p className="text-sm text-[#1b2421]/80 mt-1 max-w-3xl leading-relaxed">{CV_PROFILE.summary}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right text-xs text-[#1b2421]/80 space-y-1 font-semibold font-sans">
                <p className="flex items-center justify-end gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#bda373]" /> {CV_PROFILE.location}</p>
                <p>Email: {CV_PROFILE.email}</p>
                <p>Phone: {CV_PROFILE.phone}</p>
                <p>LinkedIn: {CV_PROFILE.linkedIn}</p>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white border border-[#2a473d]/10 rounded-lg p-1.5 shadow-sm shrink-0">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    typeof window !== 'undefined' 
                      ? `${window.location.origin}${window.location.pathname}?contact=true`
                      : 'https://bellsmcinnes.com?contact=true'
                  )}`}
                  alt="Scan to Contact"
                  className="w-14 h-14"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[7px] text-[#2a473d] font-bold uppercase tracking-wider text-center block">Scan to Contact</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CV GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 print:block print:space-y-8">
          
          {/* LEFT SIDEBAR: Skills & Certifications (4 cols) */}
          <div className="lg:col-span-4 space-y-8 print:block print:w-full">
            
            {/* SKILLS BOX */}
            <div id="pdf-skills-box" className="bg-[#e6e3dd]/30 border border-[#2a473d]/10 rounded-2xl p-6 sm:p-8 print:bg-transparent print:border-none print:p-0">
              <h3 className="font-display font-bold text-xl text-[#1b2421] mb-6 flex items-center gap-2 border-b border-[#2a473d]/10 pb-3 print:mb-4 print:text-lg">
                <Award className="w-5 h-5 text-[#bda373]" />
                Technical Skillsets
              </h3>

              <div className="space-y-6 print:space-y-4">
                {SKILL_CATEGORIES.map((category, idx) => (
                  <div 
                    key={idx}
                    onMouseEnter={() => setActiveCategory(category.title)}
                    onMouseLeave={() => setActiveCategory(null)}
                    className={`rounded-xl p-4.5 border transition-all duration-300 print:p-0 print:border-none ${
                      activeCategory === category.title
                        ? 'bg-[#fcfbf9] border-[#2a473d]/20 shadow-md'
                        : 'bg-[#fcfbf9]/50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3 print:mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-[#2a473d]/10 flex items-center justify-center text-[#2a473d] print:hidden">
                        {getSkillIcon(category.icon)}
                      </div>
                      <h4 className="font-display font-bold text-sm text-[#2a473d]">{category.title}</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx} 
                          className="px-2 py-0.5 bg-[#fcfbf9] border border-[#2a473d]/10 text-[#1b2421]/90 rounded text-[11px] font-medium font-sans print:bg-transparent print:border-none print:px-0 print:after:content-[',_'] print:last:after:content-none print:text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CERTIFICATIONS & AFFILIATIONS BOX */}
            <div className="bg-[#e6e3dd]/30 border border-[#2a473d]/10 rounded-2xl p-6 sm:p-8 print:bg-transparent print:border-none print:p-0">
              <h3 className="font-display font-bold text-xl text-[#1b2421] mb-6 flex items-center gap-2 border-b border-[#2a473d]/10 pb-3 print:mb-4 print:text-lg">
                <CheckCircle2 className="w-5 h-5 text-[#bda373]" />
                Affiliations &amp; Credentials
              </h3>

              <div className="space-y-5 print:space-y-3">
                {AFFILIATIONS.map((aff, idx) => (
                  <div key={idx} className="text-sm affiliation-item">
                    <span className="block font-bold text-[#2a473d]">{aff.title}</span>
                    <span className="block font-sans text-xs font-semibold text-[#4a6b5d]">{aff.organization}</span>
                    <p className="text-xs text-[#1b2421]/75 mt-1 leading-relaxed print:text-[11px]">{aff.detail}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Timeline Education & Experience (8 cols) */}
          <div className="lg:col-span-8 space-y-10 print:block print:w-full print:space-y-6">
            
            {/* EDUCATION TIMELINE SECTION */}
            <div>
              <h3 className="font-display font-bold text-2xl text-[#1b2421] mb-8 flex items-center gap-2.5 border-b border-[#2a473d]/10 pb-3 print:mb-4 print:text-lg">
                <GraduationCap className="w-6 h-6 text-[#2a473d]" />
                Education Journey
              </h3>

              <div className="relative border-l-2 border-[#2a473d]/10 pl-6 sm:pl-8 ml-3 space-y-8 print:border-none print:pl-0 print:ml-0 print:space-y-4">
                
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-[#fcfbf9] bg-[#bda373] print:hidden"></div>

                <div className="flex gap-4 items-start">
                  {/* Logo (LinkedIn Style) */}
                  <div className="w-12 h-12 bg-white border border-stone-200/80 rounded-xl flex items-center justify-center p-1 shadow-sm shrink-0 overflow-hidden">
                    <img 
                      src="https://storage.cloud.google.com/my-app-assets-legaldm/UniofSussex.jpeg" 
                      alt="University of Sussex Logo" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div>
                        <h4 className="font-display font-bold text-lg text-[#1b2421]">{EDUCATION.degree} &mdash; <span className="text-[#2a473d]">{EDUCATION.grade}</span></h4>
                        <p className="font-sans text-sm font-semibold text-[#4a6b5d]">{EDUCATION.institution}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2a473d] bg-[#2a473d]/5 px-3 py-1 rounded-full w-fit print:bg-transparent print:p-0 print:font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-[#bda373] print:hidden" />
                        {EDUCATION.period}
                      </div>
                    </div>

                    {/* Relevant Modules list */}
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#4a6b5d] mb-1.5">Key Syllabus Modules</span>
                      <div className="flex flex-wrap gap-1.5">
                        {EDUCATION.modules.map((mod, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-[#2a473d]/5 text-[#2a473d] text-xs font-semibold rounded print:bg-transparent print:p-0 print:after:content-[',_'] print:last:after:content-none font-sans">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dissertation Specific Box */}
                    <div className="bg-[#e6e3dd]/35 rounded-xl p-5 border border-[#2a473d]/10 print:bg-transparent print:p-0 print:border-none print:mt-2">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 print:mb-1">
                        <span className="inline-block px-2.5 py-0.5 bg-[#bda373] text-[#fcfbf9] text-[9px] font-bold tracking-wider uppercase rounded print:text-[#2a473d] print:bg-transparent print:p-0 print:font-bold">
                          Honours Dissertation Topic
                        </span>
                        <a 
                          href="https://storage.cloud.google.com/my-app-assets-legaldm/AN%20ASSESSMENT%20OF%20WINTER%20STORM%20DAMAGE%20AT%20TELSCOMBE%20CLIFFS%20Poster.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#2a473d] hover:bg-[#1e332c] text-[#fcfbf9] rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow active:scale-95 print:hidden cursor-pointer whitespace-nowrap shrink-0 border border-[#bda373]/30"
                        >
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bda373] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bda373]"></span>
                          </span>
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Dissertation Poster Summary</span>
                        </a>
                      </div>
                      <h5 className="font-display font-bold text-base text-[#1b2421] leading-snug mb-3">
                        "{EDUCATION.dissertation.title}"
                      </h5>
                      
                      <ul className="space-y-3.5 print:space-y-1.5">
                        {EDUCATION.dissertation.points.map((pt, idx) => (
                          <li key={idx} className="flex gap-2.5 text-xs text-[#1b2421]/80 leading-relaxed items-start">
                            <ChevronRight className="w-4 h-4 text-[#bda373] shrink-0 mt-0.5 print:hidden" />
                            <div>
                              <span className="font-bold text-[#2a473d] mr-1">{pt.category}:</span>
                              {pt.description}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* EXPERIENCE TIMELINE SECTION */}
            <div>
              <h3 className="font-display font-bold text-2xl text-[#1b2421] mb-8 flex items-center gap-2.5 border-b border-[#2a473d]/10 pb-3 print:mb-4 print:text-lg">
                <Briefcase className="w-6 h-6 text-[#2a473d]" />
                Professional &amp; Placement Experience
              </h3>

              <div className="relative border-l-2 border-[#2a473d]/10 pl-6 sm:pl-8 ml-3 space-y-10 print:border-none print:pl-0 print:ml-0 print:space-y-6">
                {EXPERIENCE.filter(exp => exp.isPlacement).map((exp, idx) => (
                  <div key={idx} className="relative space-y-3">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-[#fcfbf9] bg-[#bda373] print:hidden"></div>

                    <div className="flex gap-4 items-start">
                      {/* Logo (LinkedIn Style) */}
                      {getCompanyLogo(exp.company)}

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <h4 className="font-display font-bold text-base text-[#1b2421] flex items-center gap-2 flex-wrap">
                              {exp.role}
                              {exp.isPlacement && (
                                <span className="px-2 py-0.5 bg-[#bda373]/25 text-[#2a473d] rounded text-[9px] font-bold uppercase tracking-wider print:text-stone-700">
                                  Placement
                                </span>
                              )}
                            </h4>
                            <p className="font-sans text-sm font-semibold text-[#4a6b5d]">{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2a473d] bg-[#2a473d]/5 px-3 py-1 rounded-full w-fit print:bg-transparent print:p-0 print:font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#bda373] print:hidden" />
                            {exp.period}
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {exp.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex gap-2 text-xs text-[#1b2421]/85 leading-relaxed items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2a473d] shrink-0 mt-2 print:mt-1.5"></span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADDITIONAL WORK HISTORY SECTION */}
              <h3 className="additional-work-header font-display font-bold text-2xl text-[#1b2421] mb-8 flex items-center gap-2.5 border-b border-[#2a473d]/10 pb-3 mt-12 print:mt-8 print:mb-4 print:text-lg">
                <FileText className="w-6 h-6 text-[#2a473d]" />
                ADDITIONAL WORK HISTORY
              </h3>

              <div className="relative border-l-2 border-[#2a473d]/10 pl-6 sm:pl-8 ml-3 space-y-10 print:border-none print:pl-0 print:ml-0 print:space-y-6">
                {EXPERIENCE.filter(exp => !exp.isPlacement).map((exp, idx) => (
                  <div key={idx} className="relative space-y-3">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-[#fcfbf9] bg-[#2a473d] print:hidden"></div>

                    <div className="flex gap-4 items-start">
                      {/* Logo (LinkedIn Style) */}
                      {getCompanyLogo(exp.company)}

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <div>
                            <h4 className="font-display font-bold text-base text-[#1b2421] flex items-center gap-2 flex-wrap">
                              {exp.role}
                            </h4>
                            <p className="font-sans text-sm font-semibold text-[#4a6b5d]">{exp.company}</p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2a473d] bg-[#2a473d]/5 px-3 py-1 rounded-full w-fit print:bg-transparent print:p-0 print:font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#bda373] print:hidden" />
                            {exp.period}
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {exp.points.map((pt, pIdx) => (
                            <li key={pIdx} className="flex gap-2 text-xs text-[#1b2421]/85 leading-relaxed items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2a473d] shrink-0 mt-2 print:mt-1.5"></span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
        </div> {/* END cv-print-area */}

      </div>

      {/* High-Fidelity PDF Download Helper Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm flex items-center justify-center z-[100] px-4 print:hidden">
          <div className="bg-[#fcfbf9] border border-[#2a473d]/20 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#2a473d]/10 flex items-center justify-center text-[#2a473d]">
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </div>
              <h3 className="font-display font-bold text-xl text-[#1b2421]">
                {isGenerating ? 'Structuring PDF Document...' : 'PDF Resume Ready'}
              </h3>
              <p className="text-xs text-[#4a6b5d] font-medium">
                Using system high-fidelity print rendering
              </p>
            </div>

            {/* Simulated generation progress bar */}
            {isGenerating && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#2a473d]">
                  <span>Optimizing styles...</span>
                  <span>{downloadProgress}%</span>
                </div>
                <div className="w-full bg-[#e6e3dd] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#bda373] h-full transition-all duration-150 ease-out"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Direct High-Fidelity PDF info card */}
            <div className="bg-[#2a473d]/5 border border-[#2a473d]/10 rounded-xl p-4 space-y-3 text-xs text-stone-700">
              <p className="font-bold text-[#2a473d] flex items-center gap-1.5">
                💡 Direct PDF Engine:
              </p>
              <ul className="space-y-2.5 font-sans">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bda373] mt-1.5 shrink-0"></span>
                  <span><strong>Automatic Save:</strong> The PDF generates directly in your browser and automatically downloads to your device.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bda373] mt-1.5 shrink-0"></span>
                  <span><strong>High Fidelity:</strong> Captures colors, visual badges, and custom icons beautifully in standard letter size.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bda373] mt-1.5 shrink-0"></span>
                  <span><strong>Recruiter Ready:</strong> A perfectly structured, physical-ready document designed for direct reading.</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateActualPDF}
                className="flex-1 py-3 bg-[#2a473d] hover:bg-[#1b2421] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Trigger Direct PDF
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-3 bg-[#e6e3dd]/40 hover:bg-[#e6e3dd]/80 text-[#2a473d] rounded-xl font-bold text-sm tracking-wide transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
