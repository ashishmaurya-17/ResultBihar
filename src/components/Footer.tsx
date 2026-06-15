import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  HelpCircle, 
  Shield, 
  FileText, 
  Phone, 
  Award, 
  FileCode, 
  Image as ImageIcon, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  Users
} from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Footer({ currentView, setCurrentView }: FooterProps) {
  return (
    <footer 
      className="border-t border-white/10 text-neutral-400 font-sans relative overflow-hidden mt-auto bg-neutral-950" 
      id="portal-footer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"), linear-gradient(135deg, #09090b 0%, #0f172a 60%, #020617 100%)`,
        backgroundBlendMode: 'overlay, normal',
      }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 col-span-2 md:col-span-1 border-b border-white/10 md:border-b-0 pb-6 md:pb-0">
            <Logo variant="horizontal" isDarkBackground={true} iconSize={38} />
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-400">
              SarkariBoard gives you quick updates on government job results, board exams, teacher jobs, admit cards, answer keys, college admissions, and scholarships.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-neutral-900 px-3 py-1.5 rounded-md w-fit">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Supporting students and job seekers in India</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-blue-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition duration-150">
                  Latest Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition duration-150">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-neutral-400 hover:text-white transition duration-150">
                  Help / FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-white transition duration-150">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/indexing" className="text-neutral-400 hover:text-emerald-400 transition duration-150 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block mr-1"></span>
                  Instant Indexing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-blue-500 pl-3">
              Browse Jobs
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/?sector=railway" className="text-neutral-400 hover:text-white transition duration-150">Railway Jobs</Link>
              </li>
              <li>
                <Link to="/?sector=ssc" className="text-neutral-400 hover:text-white transition duration-150">SSC Jobs</Link>
              </li>
              <li>
                <Link to="/?state=bihar" className="text-neutral-400 hover:text-white transition duration-150">Bihar Jobs</Link>
              </li>
              <li>
                <Link to="/?state=uttar%20pradesh" className="text-neutral-400 hover:text-white transition duration-150">UP Jobs</Link>
              </li>
              <li>
                <Link to="/?category=results" className="text-neutral-400 hover:text-white transition duration-150">Results by State</Link>
              </li>
            </ul>
          </div>

          {/* E-E-A-T Trust & Legitimacy Pages Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-blue-500 pl-3">
              Legal Pages
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/editorial-methodology" className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150" id="editorial-standards-link">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>Trust & Editorial Standards</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150" id="privacy-policy-link">
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150" id="terms-conditions-link">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150" id="disclaimer-link">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-white flex items-center gap-1.5 transition duration-150" id="contact-link">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links & Contact Column */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-blue-500 pl-3">
              Connect With Us
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://whatsapp.com/channel/0029Vb7jr5D17En1gOUJB01u" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#25D366] transition duration-150 flex items-center gap-1.5">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://t.me/sarkariboardweb" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#0088cc] transition duration-150 flex items-center gap-1.5">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://x.com/sarkariboard" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition duration-150 flex items-center gap-1.5">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@makinglegacy" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FF0000] transition duration-150 flex items-center gap-1.5">
                  YouTube
                </a>
              </li>
              <li className="pt-2 border-t border-neutral-800 mt-2">
                <a href="mailto:contact@sarkariboard.com" className="text-neutral-400 hover:text-emerald-400 transition duration-150 flex items-center gap-1.5">
                  <span className="truncate">contact@sarkariboard.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* E-E-A-T Author Byline & Real Trust Signals */}
        <div className="mt-8 pt-8 border-t border-neutral-900 border-opacity-50 flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">
              <Users className="w-4 h-4 text-blue-500" />
              <div>
                <span className="block font-bold text-neutral-300">50,000+</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Monthly Visitors</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="block font-bold text-neutral-300">Since 2024</span>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Accurate Updates</span>
              </div>
            </div>
          </div>
          
          {/* Author Byline */}
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center border border-blue-500/30 text-blue-400 font-serif font-black text-xs">
              ✍️
            </div>
            <div className="text-xs">
              <span className="block text-neutral-300 font-bold">Curated & Verified by Ashish Maurya</span>
              <span className="text-neutral-500 italic">Former SSC Aspirant, Admin of SarkariBoard</span>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-900 text-center text-xs space-y-3">
          <p className="text-neutral-500 max-w-4xl mx-auto italic">
            Disclaimer: This is NOT an official government website. We provide updates from official sources. Always verify details on the official board website.
          </p>
          <p className="font-mono text-[11px] text-neutral-600">
            © 2026 SarkariBoard. All rights reserved. | DMCA Protected
          </p>
        </div>
      </div>
    </footer>
  );
}
