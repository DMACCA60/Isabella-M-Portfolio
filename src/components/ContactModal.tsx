import { useState } from 'react';
import { 
  Mail, Phone, Linkedin, MapPin, X, Copy, Check, 
  Calendar, Briefcase, MessageSquare, Send, ExternalLink, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CV_PROFILE } from '../data';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface MessageTemplate {
  id: string;
  label: string;
  icon: typeof Calendar | typeof Briefcase | typeof MessageSquare;
  subject: string;
  body: string;
}

export default function ContactModal({ isOpen, onClose, onOpen }: ContactModalProps) {
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('interview');
  const [recruiterName, setRecruiterName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');

  const templates: MessageTemplate[] = [
    {
      id: 'interview',
      label: 'Schedule Interview',
      icon: Calendar,
      subject: 'Graduate GIS Interview Invitation - Isabella McInnes',
      body: `Hi Isabella,

We were highly impressed by your GIS & mapping portfolio (particularly your interactive coastal erosion models & due diligence assessments).

We would love to schedule a brief introductory call or interview with you to discuss graduate opportunities at our firm.

Please let us know your availability over the coming week.

Best regards,
[RecruiterName]
[CompanyName]`
    },
    {
      id: 'graduate-role',
      label: 'Graduate Job Opportunity',
      icon: Briefcase,
      subject: 'Graduate GIS / Environmental Consultant Opportunity - Isabella McInnes',
      body: `Hi Isabella,

I am a recruiter looking at your geospatial portfolio. We have an upcoming Graduate GIS / Environmental Consultant position that aligns perfectly with your First-Class Honours degree, Python automation skills, and Landmark Information Group placement experience.

Are you available for a brief discussion about this role?

Kind regards,
[RecruiterName]
[CompanyName]`
    },
    {
      id: 'general-query',
      label: 'Portfolio / GIS Inquiry',
      icon: MessageSquare,
      subject: 'GIS Portfolio Inquiry - Isabella McInnes',
      body: `Hi Isabella,

I was reviewing your interactive portfolio exhibits and would like to learn more about your experience with UAV-SfM photogrammetry, QGIS, and Data Analysis.

Best regards,
[RecruiterName]`
    }
  ];

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const getCustomizedBody = () => {
    let text = activeTemplate.body;
    text = text.replace('[RecruiterName]', recruiterName || 'Hiring Manager');
    text = text.replace('[CompanyName]', companyName || 'Our Consultancy');
    return text;
  };

  const getCustomizedSubject = () => {
    return activeTemplate.subject;
  };

  const mailtoLink = `mailto:${CV_PROFILE.email}?subject=${encodeURIComponent(getCustomizedSubject())}&body=${encodeURIComponent(getCustomizedBody())}`;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const copyTemplateToClipboard = () => {
    navigator.clipboard.writeText(getCustomizedBody());
    setCopiedType('email'); // Trigger visual copy feedback on the draft card
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <>
      {/* 1. PERSISTENT FLOATING ACTION BUTTON (FAB) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="persistent-contact-fab"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 z-50 print:hidden cursor-pointer group flex items-center gap-2.5 bg-[#2a473d] hover:bg-[#1b2421] text-[#fcfbf9] px-5 py-3.5 rounded-full font-sans font-bold text-sm tracking-wide shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-[#bda373]/30"
          >
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bda373] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#bda373]"></span>
            </div>
            <Mail className="w-4 h-4 text-[#bda373]" />
            <span>Contact Isabella</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* 2. MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 print:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-[#1b2421]/60 backdrop-blur-md"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-[#fcfbf9] rounded-2xl shadow-2xl overflow-hidden border border-[#2a473d]/15 z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
            >
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#fcfbf9]/90 border border-[#2a473d]/10 text-[#2a473d] hover:bg-[#e6e3dd]/60 hover:text-[#1b2421] transition-all cursor-pointer focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT COLUMN: Profile & Standard Contact Details (38%) */}
              <div className="w-full md:w-[38%] bg-[#2a473d]/5 border-b md:border-b-0 md:border-r border-[#2a473d]/10 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-6">
                  {/* Header Branding */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#2a473d]/20 flex items-center justify-center bg-[#2a473d]/10">
                      <span className="font-display font-bold text-base text-[#2a473d]">IM</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#1b2421] leading-tight">Isabella McInnes</h3>
                      <span className="block font-sans text-[10px] tracking-wider uppercase text-[#4a6b5d] font-bold">GIS &amp; Mapping Portfolio</span>
                    </div>
                  </div>

                  {/* Profile Picture & Availability */}
                  <div className="relative group overflow-hidden bg-white border border-[#2a473d]/10 rounded-xl p-2 shadow-sm max-w-[180px] md:max-w-none mx-auto md:mx-0">
                    <div className="aspect-[4/5] w-full rounded-lg overflow-hidden bg-[#e6e3dd]/20 relative">
                      <img 
                        src="https://storage.googleapis.com/my-app-assets-legaldm/Isabella.JPEG" 
                        alt="Isabella McInnes" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="mt-2 text-center md:text-left px-1">
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold tracking-wider uppercase bg-[#bda373]/20 text-[#2a473d] px-2 py-0.5 rounded border border-[#2a473d]/5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#bda373] animate-pulse"></span>
                        Available for Graduate Roles
                      </span>
                    </div>
                  </div>

                  {/* Contact Info Channels */}
                  <div className="space-y-3.5">
                    <span className="block text-[10px] uppercase font-extrabold text-[#4a6b5d] tracking-wider mb-2">Direct Channels</span>
                    
                    {/* Email */}
                    <div className="flex items-center justify-between bg-white border border-[#2a473d]/8 p-2.5 rounded-xl hover:border-[#2a473d]/20 transition-all shadow-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d] shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-[#4a6b5d]">Email</span>
                          <a href={`mailto:${CV_PROFILE.email}`} className="block text-xs font-bold text-[#1b2421] hover:underline truncate">
                            {CV_PROFILE.email}
                          </a>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(CV_PROFILE.email, 'email')}
                        className="p-1.5 text-[#4a6b5d] hover:text-[#2a473d] hover:bg-[#e6e3dd]/35 rounded transition-all cursor-pointer"
                        title="Copy Email Address"
                      >
                        {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center justify-between bg-white border border-[#2a473d]/8 p-2.5 rounded-xl hover:border-[#2a473d]/20 transition-all shadow-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d] shrink-0">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-[#4a6b5d]">Phone</span>
                          <a href={`tel:${CV_PROFILE.phone}`} className="block text-xs font-bold text-[#1b2421] hover:underline">
                            {CV_PROFILE.phone}
                          </a>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(CV_PROFILE.phone, 'phone')}
                        className="p-1.5 text-[#4a6b5d] hover:text-[#2a473d] hover:bg-[#e6e3dd]/35 rounded transition-all cursor-pointer"
                        title="Copy Phone Number"
                      >
                        {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* LinkedIn */}
                    <a 
                      href="https://linkedin.com/in/isabella-mcinnes" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-between bg-white border border-[#2a473d]/8 p-2.5 rounded-xl hover:border-[#2a473d]/30 hover:bg-[#2a473d]/5 transition-all shadow-sm group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d] shrink-0 group-hover:bg-[#2a473d]/10">
                          <Linkedin className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-[#4a6b5d]">LinkedIn</span>
                          <span className="block text-xs font-bold text-[#1b2421] truncate">
                            {CV_PROFILE.linkedIn}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-[#4a6b5d] group-hover:text-[#2a473d] mr-1.5 transition-colors" />
                    </a>

                    {/* Location */}
                    <div className="flex items-center gap-2.5 bg-white border border-[#2a473d]/8 p-2.5 rounded-xl shadow-sm">
                      <div className="w-7 h-7 rounded-full bg-[#2a473d]/5 flex items-center justify-center text-[#2a473d] shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider font-extrabold text-[#4a6b5d]">Location</span>
                        <span className="block text-xs font-bold text-[#1b2421]">
                          {CV_PROFILE.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-footer credentials */}
                <div className="mt-6 pt-4 border-t border-[#2a473d]/10 text-[10px] text-[#4a6b5d] leading-normal font-medium">
                  <span className="block font-bold text-[#1b2421] mb-0.5">Academic Credentials</span>
                  BSc (Hons) Geography &mdash; First Class
                  <span className="block opacity-80">University of Sussex</span>
                </div>
              </div>

              {/* RIGHT COLUMN: Recruiter Interactive Message Tailoring (62%) */}
              <div className="w-full md:w-[62%] p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-[#4a6b5d] font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#bda373]" />
                    Recruiter Quick-Reach 
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-[#1b2421]">
                    Draft a Pre-formatted Message
                  </h3>
                  <p className="text-xs text-[#1b2421]/70 leading-relaxed mt-1">
                    Select a workflow template below and customize it. Reaching out with a targeted speculative email reduces recruiter friction and connects instantly with Isabella.
                  </p>

                  {/* Template selector buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
                    {templates.map((temp) => {
                      const Icon = temp.icon;
                      const isSelected = temp.id === selectedTemplateId;
                      return (
                        <button
                          key={temp.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(temp.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-[#2a473d] text-white border-[#2a473d] shadow-sm'
                              : 'bg-white text-[#4a6b5d] border-stone-200 hover:bg-[#e6e3dd]/30 hover:text-[#1b2421]'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#bda373]' : 'text-[#4a6b5d]'}`} />
                            <span className="font-bold text-[10px] sm:text-xs leading-none">{temp.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inputs for customization */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex flex-col gap-1 text-[11px]">
                      <label className="font-bold text-[#4a6b5d]">Your Name</label>
                      <input 
                        type="text" 
                        placeholder="Hiring Manager Name"
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        className="p-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2a473d] bg-white text-[#1b2421]"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-[11px]">
                      <label className="font-bold text-[#4a6b5d]">Your Agency / Company</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Zephyr Environmental"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="p-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2a473d] bg-white text-[#1b2421]"
                      />
                    </div>
                  </div>

                  {/* Message Draft Box */}
                  <div className="mt-4 flex flex-col">
                    <div className="flex justify-between items-center bg-[#2a473d]/5 px-3 py-1.5 rounded-t-lg border-t border-x border-stone-200 text-[10px] font-bold text-[#2a473d]">
                      <span>EMAIL SUBJECT: {getCustomizedSubject()}</span>
                      <button 
                        onClick={copyTemplateToClipboard} 
                        className="text-[#4a6b5d] hover:text-[#2a473d] flex items-center gap-1 cursor-pointer"
                        title="Copy text of the draft"
                      >
                        {copiedType === 'email' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Copied draft!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy draft</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={getCustomizedBody()}
                      className="w-full h-44 border border-stone-200 rounded-b-lg p-3 text-[11px] sm:text-xs font-mono bg-[#1b2421]/2 text-stone-700 leading-relaxed overflow-y-auto select-all focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-200">
                  <a
                    href={mailtoLink}
                    className="flex-grow py-3 bg-[#2a473d] hover:bg-[#1b2421] text-white rounded-xl font-bold text-xs tracking-wider uppercase text-center transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#bda373]" />
                    Send Draft via Default Email App
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 px-6 border border-stone-200 hover:border-[#2a473d] hover:bg-[#e6e3dd]/30 text-stone-600 hover:text-[#2a473d] rounded-xl font-bold text-xs tracking-wider uppercase text-center transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
