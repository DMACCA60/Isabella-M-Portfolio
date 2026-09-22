import { useState } from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { 
  GraduationCap, Briefcase, Award, Calendar, MapPin, Printer, 
  Map, Camera, Binary, FileText, CheckCircle2, ChevronRight, User,
  Download, Loader2, X
} from 'lucide-react';
import { CV_PROFILE, SKILL_CATEGORIES, EDUCATION, EXPERIENCE, AFFILIATIONS } from '../data';

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
    const element = document.getElementById('cv-print-area');
    if (!element) {
      setIsGenerating(false);
      return;
    }

    // Helper: LMS cube transformation matrix
    const oklabToRgb = (L: number, a: number, b: number, A = 1) => {
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

      const l = l_ * l_ * l_;
      const m = m_ * m_ * m_;
      const s = s_ * s_ * s_;

      let rL = l * 4.0767416621 - m * 3.3077115913 + s * 0.2309699292;
      let gL = -l * 1.2684380046 + m * 2.6097574011 - s * 0.3413193965;
      let bL = -l * 0.0041960863 - m * 0.7034186147 + s * 1.7076147010;

      const gamma = (c: number) => {
        if (c <= 0.0031308) return 12.92 * c;
        return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
      };

      const outR = Math.max(0, Math.min(255, Math.round(gamma(rL) * 255)));
      const outG = Math.max(0, Math.min(255, Math.round(gamma(gL) * 255)));
      const outB = Math.max(0, Math.min(255, Math.round(gamma(bL) * 255)));

      return A < 1 ? `rgba(${outR}, ${outG}, ${outB}, ${A})` : `rgb(${outR}, ${outG}, ${outB})`;
    };

    const oklchToRgb = (L: number, C: number, H: number, A = 1) => {
      const hRad = (H * Math.PI) / 180;
      const a = C * Math.cos(hRad);
      const b = C * Math.sin(hRad);
      return oklabToRgb(L, a, b, A);
    };

    const parseOklch = (str: string) => {
      const match = str.match(/oklch\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\)/i);
      if (match) {
        return {
          L: parseFloat(match[1]),
          C: parseFloat(match[2]),
          H: parseFloat(match[3]),
          A: match[4] ? parseFloat(match[4]) : 1
        };
      }
      return null;
    };

    const parseOklab = (str: string) => {
      const match = str.match(/oklab\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\)/i);
      if (match) {
        return {
          L: parseFloat(match[1]),
          a: parseFloat(match[2]),
          b: parseFloat(match[3]),
          A: match[4] ? parseFloat(match[4]) : 1
        };
      }
      return null;
    };

    // Create a temporary beautiful wrapper container to lay out the PDF
    const container = document.createElement('div');
    container.style.padding = '25px 35px';
    container.style.backgroundColor = '#fcfbf9';
    container.style.color = '#1b2421';
    container.style.width = '740px'; // standard width for Letter/A4 layout
    container.style.boxSizing = 'border-box';
    container.style.fontSize = '12px'; // slightly smaller base text to fit beautifully
    container.style.lineHeight = '1.45';
    container.style.overflowX = 'hidden';
    
    // Clone the print area element
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Ensure the print-only header is displayed in the PDF
    const printHeader = clone.querySelector('#pdf-print-header');
    if (printHeader) {
      printHeader.classList.remove('hidden');
      printHeader.setAttribute('style', 'display: block !important; margin-bottom: 2rem; border-bottom: 2px solid #2a473d; padding-bottom: 1.5rem;');
    }
    
    // Remove the Technical Skillsets box as requested to allow more space and avoid cutoffs
    const skillsBox = clone.querySelector('#pdf-skills-box');
    if (skillsBox) {
      skillsBox.remove();
    }
    
    // Force a full-width stacked layout inside the PDF clone to maximize horizontal space and completely eliminate clipping
    const grid = clone.querySelector('.grid');
    if (grid) {
      grid.setAttribute('style', 'display: flex !important; flex-direction: column !important; gap: 2rem !important; width: 100% !important;');
    }
    
    // Left column (now containing only Affiliations) gets full width and shifts below the main timeline for logical CV order
    const leftCol = clone.querySelector('.lg\\:col-span-4');
    if (leftCol) {
      leftCol.setAttribute('style', 'width: 100% !important; display: flex !important; flex-direction: column !important; gap: 1.5rem !important; order: 2 !important;');
    }
    
    // Right column (containing main Education & Experience timelines) gets full width and takes top priority
    const rightCol = clone.querySelector('.lg\\:col-span-8');
    if (rightCol) {
      rightCol.setAttribute('style', 'width: 100% !important; display: flex !important; flex-direction: column !important; gap: 2rem !important; order: 1 !important;');
    }

    // Reduce margins, indents, and paddings of timeline elements to maximize horizontal fit
    const timelines = clone.querySelectorAll('.border-l-2');
    timelines.forEach((tl) => {
      tl.setAttribute('style', 'border-left: 2px solid rgba(42, 71, 61, 0.1) !important; padding-left: 1rem !important; margin-left: 0.5rem !important; margin-top: 1rem !important;');
    });

    // Reduce padding on cards/boxes so they fit beautifully
    const cards = clone.querySelectorAll('.bg-\\[\\#e6e3dd\\]\\/30, .bg-\\[\\#e6e3dd\\]\\/35, [id="pdf-skills-box"]');
    cards.forEach((card) => {
      card.setAttribute('style', 'background-color: rgba(230, 227, 221, 0.35) !important; padding: 16px !important; border: 1px solid rgba(42, 71, 61, 0.1) !important; border-radius: 12px !important; margin-top: 0.5rem !important;');
    });

    // Clean up layout headings
    const headings = clone.querySelectorAll('h1, h2, h3, h4, h5');
    headings.forEach((h) => {
      const tag = h.tagName.toLowerCase();
      if (tag === 'h1') h.setAttribute('style', 'font-size: 24px !important; font-weight: bold !important; line-height: 1.2 !important;');
      else if (tag === 'h2') h.setAttribute('style', 'font-size: 18px !important; font-weight: bold !important; line-height: 1.2 !important; margin-bottom: 0.5rem !important;');
      else if (tag === 'h3') h.setAttribute('style', 'font-size: 15px !important; font-weight: bold !important; border-bottom: 1px solid rgba(42, 71, 61, 0.15) !important; padding-bottom: 0.25rem !important; margin-bottom: 1rem !important;');
      else if (tag === 'h4') h.setAttribute('style', 'font-size: 13px !important; font-weight: bold !important; line-height: 1.2 !important;');
      else if (tag === 'h5') h.setAttribute('style', 'font-size: 11px !important; font-weight: bold !important; line-height: 1.2 !important;');
    });

    // Adjust margins on main lists
    const lists = clone.querySelectorAll('ul');
    lists.forEach((list) => {
      list.setAttribute('style', 'margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; display: flex !important; flex-direction: column !important; gap: 0.35rem !important;');
    });

    // Ensure all print-hidden badges are shown as colorful tags in the PDF
    const printHiddens = clone.querySelectorAll('.print\\:hidden');
    printHiddens.forEach((el) => {
      if (!el.classList.contains('cursor-pointer') && !el.tagName.toLowerCase().includes('button')) {
        el.classList.remove('print:hidden');
      }
    });

    // Temporarily append clone to body to compute styles and resolve any oklch/oklab values to sRGB
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '-9999px';
    clone.style.width = '740px';
    document.body.appendChild(clone);

    const convertOklchAndOklabStyles = (node: HTMLElement) => {
      const computed = window.getComputedStyle(node);
      const props = [
        'color', 'backgroundColor', 'borderColor', 
        'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor',
        'fill', 'stroke'
      ];
      
      props.forEach((prop) => {
        const val = computed[prop as any];
        if (val) {
          if (val.includes('oklch')) {
            const parsed = parseOklch(val);
            if (parsed) {
              node.style[prop as any] = oklchToRgb(parsed.L, parsed.C, parsed.H, parsed.A);
            }
          } else if (val.includes('oklab')) {
            const parsed = parseOklab(val);
            if (parsed) {
              node.style[prop as any] = oklabToRgb(parsed.L, parsed.a, parsed.b, parsed.A);
            }
          }
        }
      });

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child instanceof HTMLElement) {
          convertOklchAndOklabStyles(child);
        }
      }
    };

    convertOklchAndOklabStyles(clone);

    // Clean up clone styles and remove from body
    clone.style.position = '';
    clone.style.left = '';
    clone.style.top = '';
    clone.style.width = '';
    document.body.removeChild(clone);

    container.appendChild(clone);
    
    const opt = {
      margin:       [0.3, 0.3, 0.3, 0.3],
      filename:     'Isabella_McInnes_Resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, letterRendering: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // @ts-ignore
    html2pdf().set(opt).from(container).save().then(() => {
      setIsGenerating(false);
      setShowDownloadModal(false);
    }).catch((err: any) => {
      console.error('Direct PDF Generation Error:', err);
      setIsGenerating(false);
      // Fallback to standard print in case of total failure
      window.print();
    });
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
            <div className="text-right text-xs text-[#1b2421]/80 space-y-1 shrink-0 font-semibold font-sans">
              <p className="flex items-center justify-end gap-1.5"><MapPin className="w-3.5 h-3.5" /> {CV_PROFILE.location}</p>
              <p>Email: {CV_PROFILE.email}</p>
              <p>Phone: {CV_PROFILE.phone}</p>
              <p>LinkedIn: {CV_PROFILE.linkedIn}</p>
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
                  <div key={idx} className="text-sm">
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
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#bda373] border-4 border-[#fcfbf9] print:hidden"></div>

                <div className="space-y-4">
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
                    <span className="inline-block px-2.5 py-0.5 bg-[#bda373] text-[#fcfbf9] text-[9px] font-bold tracking-wider uppercase rounded mb-2 print:text-[#2a473d] print:bg-transparent print:p-0 print:font-bold">
                      Honours Dissertation Topic
                    </span>
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

            {/* EXPERIENCE TIMELINE SECTION */}
            <div>
              <h3 className="font-display font-bold text-2xl text-[#1b2421] mb-8 flex items-center gap-2.5 border-b border-[#2a473d]/10 pb-3 print:mb-4 print:text-lg">
                <Briefcase className="w-6 h-6 text-[#2a473d]" />
                Professional &amp; Placement Experience
              </h3>

              <div className="relative border-l-2 border-[#2a473d]/10 pl-6 sm:pl-8 ml-3 space-y-10 print:border-none print:pl-0 print:ml-0 print:space-y-6">
                
                {EXPERIENCE.map((exp, idx) => (
                  <div key={idx} className="relative space-y-3">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-[#fcfbf9] print:hidden ${
                      exp.isPlacement ? 'bg-[#bda373]' : 'bg-[#2a473d]'
                    }`}></div>

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
