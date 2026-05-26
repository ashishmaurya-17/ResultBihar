import React from 'react';
import { Calendar, HelpCircle, Shield, FileText, Phone, Award } from 'lucide-react';

interface FooterProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Footer({ currentView, setCurrentView }: FooterProps) {
  return (
    <footer className="bg-neutral-950 border-t-4 border-red-700 text-neutral-400 font-sans" id="portal-footer">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-700 text-white p-1.5 rounded-lg text-sm font-black font-mono">RB</div>
              <h2 className="text-lg font-bold text-neutral-100 font-sans uppercase tracking-tight">
                Result Bihar <span className="text-amber-500">Official</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
              Result Bihar is Bihar's state education information portal, providing instant updates regarding Central & State Govt Job results, Bihar Secondary Board exams, BPSC Teacher Vacancy notes, admit cards, answer keys, university admissions, and chief minister scholarships/yojanas.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-md w-fit">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Dedicated to Merit-Based Career Growth in Bihar</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="text-neutral-400 hover:text-white transition duration-150"
                >
                  Latest Job Board
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('disclaimer')} 
                  className="text-neutral-400 hover:text-white transition duration-150"
                >
                  Govt Job Disclaimer Disclaimer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('about')} 
                  className="text-neutral-400 hover:text-white transition duration-150"
                >
                  About Our Organization
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('contact')} 
                  className="text-neutral-400 hover:text-white transition duration-150"
                >
                  Submit Query / Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* E-E-A-T Trust & Legitimacy Pages Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-4 border-l-2 border-red-600 pl-2">
              Legal & Trust Pages
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentView('privacy')} 
                  className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150"
                  id="privacy-policy-link"
                >
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Privacy Policy Directive</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('terms')} 
                  className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150"
                  id="terms-conditions-link"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Terms & Conditions</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('disclaimer')} 
                  className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150"
                  id="disclaimer-link"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sarkari Info Disclaimer</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('contact')} 
                  className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150"
                  id="contact-link"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Contact Official Desk</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-900 text-center text-xs space-y-3">
          <p className="text-neutral-500 max-w-4xl mx-auto italic">
            Disclaimer: Result Bihar is a private informational resource and is not affiliated with the Bihar School Examination Board (BSEB), Bihar Public Service Commission (BPSC), or any Government Ministry of India. Information supplied here is collected from formal public gazetters and websites. Candidates are requested to kindly cross-check with original board credentials.
          </p>
          <p className="font-mono text-[11px] text-neutral-600">
            © 2026 Result Bihar Inc. All Rights Reserved. Fully Statically Rendered for Peak Response.
          </p>
        </div>
      </div>
    </footer>
  );
}
