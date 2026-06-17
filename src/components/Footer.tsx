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
  Users,
  Bell
} from 'lucide-react';
import Logo from './Logo';
import { usePortalStore } from '../store';

interface FooterProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Footer({ currentView, setCurrentView }: FooterProps) {
  const [store, setStore] = usePortalStore();

  return (
    <footer 
      className="border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-sans relative overflow-hidden mt-auto bg-white dark:bg-zinc-950 shadow-inner" 
      id="portal-footer"
    >
      {/* Soft Colored Bloom behind the footer */}
      <div className="absolute right-10 bottom-0 w-64 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 col-span-2 md:col-span-1 border-b border-neutral-100 dark:border-neutral-800/50 md:border-b-0 pb-6 md:pb-0">
            <Logo variant="horizontal" isDarkBackground={false} iconSize={38} />
            <p className="text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              SarkariBoard gives you quick updates on government job results, board exams, teacher jobs, admit cards, answer keys, college admissions, and scholarships.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-full w-fit">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Supporting students and job seekers in India</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-indigo-500 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">
                  Latest Jobs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">
                  Help / FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/indexing" className="text-neutral-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-150 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block"></span>
                  Instant Indexing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-indigo-500 pl-3">
              Browse Jobs
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/?sector=railway" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">Railway Jobs</Link>
              </li>
              <li>
                <Link to="/?sector=ssc" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">SSC Jobs</Link>
              </li>
              <li>
                <Link to="/?state=bihar" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">Bihar Jobs</Link>
              </li>
              <li>
                <Link to="/?state=uttar%20pradesh" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">UP Jobs</Link>
              </li>
              <li>
                <Link to="/?category=results" className="text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150">Results by State</Link>
              </li>
            </ul>
          </div>

          {/* E-E-A-T Trust & Legitimacy Pages Column */}
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-indigo-500 pl-3">
              Legal Pages
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/editorial-methodology" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150" id="editorial-standards-link">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Trust & Editorial Standards</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150" id="privacy-policy-link">
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150" id="terms-conditions-link">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150" id="disclaimer-link">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>Disclaimer</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-150" id="contact-link">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links & Contact Column */}
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-200 uppercase tracking-widest mb-4 border-l-[3px] border-indigo-500 pl-3">
              Connect With Us
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a href="https://whatsapp.com/channel/0029Vb7jr5D17En1gOUJB01u" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-[#25D366] transition-colors duration-150">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="https://t.me/sarkariboardweb" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-[#0088cc] transition-colors duration-150">
                  Telegram
                </a>
              </li>
              <li>
                <a href="https://x.com/sarkariboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-150">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@makinglegacy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-[#FF0000] transition-colors duration-150">
                  YouTube
                </a>
              </li>
              <li className="pt-3 border-t border-neutral-200 dark:border-neutral-800 mt-3">
                <a href="mailto:contact@sarkariboard.com" className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-150 font-bold">
                  <span className="truncate">contact@sarkariboard.com</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* E-E-A-T Author Byline & Real Trust Signals */}
        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
              <Users className="w-4 h-4 text-indigo-500" />
              <div>
                <span className="block font-black text-neutral-800 dark:text-neutral-200">50,000+</span>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Monthly Visitors</span>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <span className="block font-black text-neutral-800 dark:text-neutral-200">Since 2024</span>
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Accurate Updates</span>
              </div>
            </div>
          </div>
          
          {/* Author Byline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-serif font-black text-xs shadow-sm">
              ✍️
            </div>
            <div className="text-xs">
              <span className="block text-neutral-800 dark:text-neutral-300 font-bold">Curated & Verified by Ashish Maurya</span>
              <span className="text-neutral-500 dark:text-neutral-500 font-medium">Former SSC Aspirant, Admin of SarkariBoard</span>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer and Copyright */}
        <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800/60 text-center text-xs space-y-5">
          <div className="flex justify-center mb-4">
            <Link 
              to="/notifications"
              onClick={() => {
                setStore({ isNotificationPanelOpen: false, unreadNotificationCount: 0 });
              }}
              className="group flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-zinc-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-full text-neutral-700 dark:text-neutral-300 transition-all shadow-sm mx-auto relative overflow-hidden"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                {store.unreadNotificationCount ? (
                   <span className="absolute -top-2 -right-2 bg-rose-500 text-white min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-black px-1 border-2 border-white dark:border-zinc-900">
                     {store.unreadNotificationCount > 99 ? '99+' : store.unreadNotificationCount}
                   </span>
                ) : null}
              </div>
              <span className="font-black uppercase tracking-widest text-[10px] text-neutral-800 dark:text-neutral-200 transition-colors">Alerts & Notifications History</span>
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-500 max-w-4xl mx-auto font-medium leading-relaxed">
            Disclaimer: This is NOT an official government website. We provide updates from official sources. Always verify details on the official board website.
          </p>
          <div className="flex flex-col items-center justify-center pb-2">
            <p className="font-mono font-bold text-[10px] text-neutral-400 dark:text-neutral-600 uppercase tracking-widest">
              © 2026 SarkariBoard. All rights reserved. | DMCA Protected
            </p>
          </div>
          
          {/* Bottom styling strip to match the header's top strip */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-900 dark:bg-black"></div>
        </div>
      </div>
    </footer>
  );
}
