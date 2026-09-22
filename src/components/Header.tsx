import { Globe, Mail, Phone, MapPin, Linkedin, ArrowRight, Download, CheckCircle, Compass } from 'lucide-react';
import { CV_PROFILE } from '../data';

interface HeaderProps {
  onExploreProjects: () => void;
}

export default function Header({ onExploreProjects }: HeaderProps) {
  return (
    <header
      id="overview"
      className="relative pt-20 sm:pt-24 pb-10 overflow-hidden bg-[#fcfbf9]"
    >
      {/* Subtle coordinate-inspired alignment grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a473d_1px,transparent_1px),linear-gradient(to_bottom,#2a473d_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Decorative compass outline */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full border border-[#2a473d]/5 flex items-center justify-center pointer-events-none z-0 translate-x-1/3">
        <div className="w-[30rem] h-[30rem] rounded-full border border-dashed border-[#2a473d]/5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#2a473d]/5 flex items-center justify-center">
            <Compass className="w-8 h-8 text-[#2a473d]/10 animate-spin-slow" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Brief Introduction, Credentials, CTAs */}
        <div className="lg:col-span-8 flex flex-col justify-center text-left">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-[#2a473d]/10 text-[#2a473d] px-4.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 w-fit border border-[#2a473d]/15">
            <span className="w-2 h-2 rounded-full bg-[#bda373] animate-pulse"></span>
            First Class Honours Geography Graduate
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[1.1] text-[#1b2421] mb-6">
            Bridging Physical Geography <br className="hidden sm:inline" />
            &amp; <span className="text-[#2a473d]">Geospatial Analysis</span>
          </h1>

          <p className="font-display font-medium text-lg sm:text-xl text-[#4a6b5d] mb-5">
            {CV_PROFILE.name} <span className="text-[#bda373] mx-1">|</span> {CV_PROFILE.title}
          </p>

          <p className="font-sans text-base sm:text-lg text-[#1b2421]/80 leading-relaxed max-w-2xl mb-8">
            {CV_PROFILE.summary}
          </p>

          {/* Quick Contact Info Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-xl">
            <div className="flex items-center gap-3 bg-[#e6e3dd]/30 hover:bg-[#e6e3dd]/60 transition-all p-3.5 rounded-xl border border-[#2a473d]/5">
              <div className="w-10 h-10 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d]">
                <Mail className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="block text-[10px] tracking-wider uppercase font-bold text-[#4a6b5d]">Email</span>
                <a
                  href={`mailto:${CV_PROFILE.email}`}
                  className="block text-sm font-semibold text-[#1b2421] hover:underline truncate"
                >
                  {CV_PROFILE.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#e6e3dd]/30 hover:bg-[#e6e3dd]/60 transition-all p-3.5 rounded-xl border border-[#2a473d]/5">
              <div className="w-10 h-10 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] tracking-wider uppercase font-bold text-[#4a6b5d]">Phone</span>
                <a
                  href={`tel:${CV_PROFILE.phone}`}
                  className="block text-sm font-semibold text-[#1b2421] hover:underline"
                >
                  {CV_PROFILE.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#e6e3dd]/30 hover:bg-[#e6e3dd]/60 transition-all p-3.5 rounded-xl border border-[#2a473d]/5">
              <div className="w-10 h-10 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] tracking-wider uppercase font-bold text-[#4a6b5d]">Location</span>
                <span className="block text-sm font-semibold text-[#1b2421]">{CV_PROFILE.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#e6e3dd]/30 hover:bg-[#e6e3dd]/60 transition-all p-3.5 rounded-xl border border-[#2a473d]/5">
              <div className="w-10 h-10 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d]">
                <Linkedin className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] tracking-wider uppercase font-bold text-[#4a6b5d]">LinkedIn</span>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-semibold text-[#1b2421] hover:underline truncate"
                >
                  {CV_PROFILE.linkedIn}
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <button
              onClick={onExploreProjects}
              className="px-8 py-4 rounded-full bg-[#2a473d] hover:bg-[#1b2421] text-[#fcfbf9] font-sans font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 group cursor-pointer"
            >
              Explore Interactive Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <a
              href="#resume"
              className="px-8 py-4 rounded-full border border-[#2a473d]/20 hover:border-[#2a473d] text-[#2a473d] hover:bg-[#e6e3dd]/30 font-sans font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              View &amp; Print Full CV
            </a>
          </div>
        </div>

        {/* Right Column: Profile Photo & Key Competencies */}
        <div className="lg:col-span-4 relative">
          <div className="space-y-6 relative mx-auto max-w-sm lg:max-w-none pt-12 sm:pt-16 lg:pt-20">
            {/* Elegant Profile Photo Container (Reduced to 75% size) */}
            <div className="relative group overflow-hidden bg-[#fcfbf9] border border-[#2a473d]/10 rounded-2xl p-3.5 shadow-lg z-10 transition-all duration-300 hover:shadow-xl hover:border-[#2a473d]/25 max-w-[75%] mx-auto lg:mx-0">
              <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-[#e6e3dd]/30 relative">
                <img 
                  src="https://storage.googleapis.com/my-app-assets-legaldm/Isabella.JPEG" 
                  alt="Isabella McInnes" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-105"
                />
                {/* Visual Accent Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2a473d]/15 to-transparent pointer-events-none"></div>
              </div>
              <div className="mt-3.5 px-1.5 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-[#1b2421] text-base">{CV_PROFILE.name}</h3>
                  <p className="text-xs text-[#4a6b5d] font-semibold mt-0.5">{CV_PROFILE.location}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#2a473d]/5 text-[#2a473d] font-sans font-bold tracking-wider uppercase text-[9px] border border-[#2a473d]/10">
                  Active Portfolio
                </span>
              </div>
            </div>

            {/* Main Profile Info Card */}
            <div className="relative bg-[#fcfbf9] border border-[#2a473d]/10 rounded-2xl p-6 sm:p-8 shadow-xl z-10">
              <div className="flex justify-between items-start mb-6 border-b border-[#2a473d]/10 pb-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#1b2421]">Core Competencies</h3>
                  <p className="text-xs text-[#4a6b5d] font-semibold tracking-wide uppercase mt-0.5">Academic &amp; Professional Highlights</p>
                </div>
                <Globe className="w-6 h-6 text-[#bda373]" />
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#2a473d]" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-bold text-[#2a473d]">Spatial Modelling</h4>
                    <p className="text-sm text-[#1b2421]/80 mt-0.5">Expertise in 3D photogrammetry, Digital Surface Models, and DEM of Difference (DoD) analysis.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#2a473d]" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-bold text-[#2a473d]">Environmental Risk Due Diligence</h4>
                    <p className="text-sm text-[#1b2421]/80 mt-0.5">Commercial experience drafting RALRs, evaluating flood hazards, and researching site constraints.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#2a473d]" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-bold text-[#2a473d]">Statistical Precision</h4>
                    <p className="text-sm text-[#1b2421]/80 mt-0.5">Rigorous data science processing, including error thresholds (LoD) and lagged linear regression models (R² = 0.67).</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#2a473d]" />
                  </div>
                  <div>
                    <h4 className="text-xs tracking-wider uppercase font-bold text-[#2a473d]">UK Planning Expert Integration</h4>
                    <p className="text-sm text-[#1b2421]/80 mt-0.5">Proficient with Ordnance Survey datasets and statutory planning requirements under the NPPF.</p>
                  </div>
                </div>
              </div>

              {/* Mini visual summary */}
              <div className="mt-6 bg-[#2a473d]/5 rounded-xl p-4 border border-[#2a473d]/10 flex justify-between items-center text-xs">
                <div>
                  <span className="block font-bold text-[#2a473d]">Sussex Dissertation</span>
                  <span className="block text-[#1b2421]/70 mt-0.5">Storm Cliff Erosion Modeling</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#bda373]/20 text-[#2a473d] font-bold tracking-wider uppercase text-[10px]">
                  R² = 0.67
                </span>
              </div>
            </div>

            {/* Accent tag */}
            <div className="absolute -bottom-5 -right-3 bg-[#bda373] text-[#fcfbf9] px-4 py-2 rounded-lg text-[10px] tracking-wider uppercase font-bold shadow-lg rotate-3 z-20">
              QGIS • ArcGIS Pro • Python
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
