import { Compass, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { CV_PROFILE } from '../data';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1b2421] text-[#fcfbf9]/90 border-t border-stone-800 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start border-b border-stone-800 pb-12">
          
          {/* Logo & Slogan */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#fcfbf9]/20 flex items-center justify-center bg-[#fcfbf9]/5">
                <span className="font-display font-semibold text-lg text-[#bda373]">IM</span>
              </div>
              <div>
                <span className="block font-display font-semibold text-base tracking-tight text-[#fcfbf9]">
                  Isabella McInnes
                </span>
                <span className="block font-sans text-[10px] tracking-wider uppercase text-[#bda373] font-bold">
                  BSc (Hons) Geography &mdash; First Class
                </span>
              </div>
            </div>
            <p className="text-xs text-[#fcfbf9]/60 leading-relaxed max-w-sm">
              Applying first-class spatial analytics, remote sensing, and environmental due diligence to deliver professional client-ready mapping deliverables.
            </p>
          </div>

          {/* Quick contact list */}
          <div className="md:col-span-4 space-y-3.5 text-xs">
            <h4 className="font-display font-bold text-[#bda373] text-[10px] tracking-wider uppercase">Contact Channels</h4>
            <div className="space-y-2.5 text-[#fcfbf9]/75">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#bda373]" />
                <a href={`mailto:${CV_PROFILE.email}`} className="hover:text-white hover:underline">{CV_PROFILE.email}</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#bda373]" />
                <a href={`tel:${CV_PROFILE.phone}`} className="hover:text-white hover:underline">{CV_PROFILE.phone}</a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#bda373]" />
                <span>{CV_PROFILE.location}</span>
              </p>
            </div>
          </div>

          {/* Cartographic reminder */}
          <div className="md:col-span-3 text-xs md:text-right flex flex-col md:items-end justify-between h-full space-y-4 md:space-y-0">
            <div>
              <h4 className="font-display font-bold text-[#bda373] text-[10px] tracking-wider uppercase mb-1.5">Affiliations</h4>
              <p className="text-[#fcfbf9]/60">Student Member &mdash; Royal Geographical Society</p>
              <p className="text-[#fcfbf9]/60 mt-0.5">ArcGIS for Personal Use Licence holder</p>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2a473d] text-[#fcfbf9] font-bold text-[10px] uppercase tracking-wider hover:bg-[#bda373] transition-colors cursor-pointer w-fit"
            >
              Back to Top
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>

        </div>

        {/* Bottom copyright block */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#fcfbf9]/40 gap-4">
          <p>© {new Date().getFullYear()} Isabella McInnes. All Rights Reserved. Designed in accordance with standard cartographic practices.</p>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors">TALDOGS Compliant</span>
            <span>•</span>
            <span className="hover:text-white transition-colors font-sans font-bold">First Class Honours (Sussex)</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
