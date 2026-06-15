import React, { useEffect } from 'react';
import Authors from './Authors';

interface StaticPageProps {
  view: string;
  onBackToHome: () => void;
}

export default function StaticPages({ view, onBackToHome }: StaticPageProps) {
  useEffect(() => {
    if (window.location.hash) {
      const anchor = document.getElementById(window.location.hash.substring(1));
      if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
    }
  }, [view]);

  if (view === 'about') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full">
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#D32F2F] dark:text-[#ef4444] tracking-tight font-sans border-b border-neutral-150 dark:border-zinc-800 pb-3 uppercase">
            About SarkariBoard
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-300 leading-relaxed font-sans">
            SarkariBoard is a premier, private informational aggregator dedicated to streamlining the government examination landscape in India. We meticulously gather and synthesize official government job notifications, college admission deadlines, admit card schedules, and exam results to save you valuable time.
          </p>
          <div className="space-y-6 font-sans">
            <section>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-zinc-100 mb-2">Our Mission & Vision</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed">
                In a digital landscape often cluttered with noise and conflicting data, our mission is to act as a beacon of clarity for students and job seekers. We aim to provide direct, trusted links and accurate schedules in a clean, user-friendly interface, free from predatory advertising practices.
              </p>
            </section>
            
            <section>
              <h2 className="text-lg font-bold text-neutral-800 dark:text-zinc-100 mb-2">Our Editorial Rigor & Expertise</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-3">
                Information accuracy is our highest priority, as we recognize the life-altering importance of these recruitment opportunities. 
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-500 dark:text-zinc-400">
                <li><strong>Data Verification:</strong> Our content team manually cross-references information from Official Gazettes, Employment News newspapers, and direct government board portals before publication.</li>
                <li><strong>Expert Curation:</strong> Our editorial board comprises individuals with firsthand experience in competitive examination ecosystems (SSC, UPSC, Banking), ensuring we understand the nuances of the data we present.</li>
                <li><strong>Constant Updates:</strong> We operate a continuous monitoring cycle to reflect fast-changing exam dates, admit card releases, and notice corrections in real-time.</li>
              </ul>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mt-3">
                *Note: While we strive for absolute precision, we strongly mandate that all users cross-check information against the primary official website mentioned in our links before submitting any application or fee.*
              </p>
            </section>
            
            <section id="editorial-standards">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-zinc-100 mb-4 border-b border-neutral-100 dark:border-zinc-800 pb-2">Trust & Editorial Standards</h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed mb-6">
                We are committed to transparency and accuracy. Our editorial processes ensure that all information provided is verified, objective, and serves the best interests of our users. Below are the experts responsible for our content curation.
              </p>
              <Authors />
            </section>
          </div>
          <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800">
            <button 
              onClick={onBackToHome}
              className="bg-[#D32F2F] hover:bg-neutral-900 dark:hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center shadow-md transition inline-block uppercase cursor-pointer"
            >
              Back To Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (view === 'editorial-methodology') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#D32F2F] dark:text-[#ef4444] tracking-tight border-b border-neutral-150 dark:border-zinc-800 pb-3 uppercase flex items-center gap-2">
            <span>Editorial & Verification Methodology</span>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-xl">
            <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 font-bold leading-relaxed">
              At SarkariBoard, credibility is our single most valuable asset. Because our users rely on us for critical job openings and career timelines (YMYL - Your Money or Your Life topics), we operate a strict editorial pipeline modeled after top-tier journalism and public research standards.
            </p>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-lg font-black text-neutral-800 dark:text-zinc-100 uppercase tracking-tight">
                1. Information Sourcing Standards
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed">
                We strictly ban the copy-pasting of job information from other unofficial sources. Every piece of data hosted on our site is tracked down to the physical or digital official government notice. Our primary sources include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-zinc-400">
                <li>
                  <strong className="text-neutral-800 dark:text-zinc-200">Official Gazettes & Bulletins:</strong> Gazette notifications released by Union and State governments of India.
                </li>
                <li>
                  <strong className="text-neutral-800 dark:text-zinc-200">Official Departmental Web Portals:</strong> Directly checking domains ending specifically in <code className="bg-neutral-100 dark:bg-zinc-800 px-1 rounded text-red-600 dark:text-red-400">.gov.in</code> or <code className="bg-neutral-100 dark:bg-zinc-800 px-1 rounded text-red-600 dark:text-red-400">.nic.in</code>.
                </li>
                <li>
                  <strong className="text-neutral-800 dark:text-zinc-200">Employment News (Rozgar Samachar):</strong> Weekly official publications printed by the Ministry of Information and Broadcasting.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-neutral-800 dark:text-zinc-100 uppercase tracking-tight">
                2. Our Five-Step Verification Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed">
                Before any job notice is uploaded, it is subjected to an exhaustive verification checklist to prevent spreading fake circulars or outdated dates:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200 dark:border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1">Step 01</span>
                  <h4 className="font-bold text-xs text-neutral-800 dark:text-zinc-100 uppercase mb-1">Notice Retrieval & Domain Audit</h4>
                  <p className="text-[11px] text-neutral-500">We verify the domain certificate of the issuing department of the board to make sure we're downloading authentic communications.</p>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200 dark:border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1">Step 02</span>
                  <h4 className="font-bold text-xs text-neutral-800 dark:text-zinc-100 uppercase mb-1">Date validation (validThrough check)</h4>
                  <p className="text-[11px] text-neutral-500">Last dates to apply are double-checked, confirming any late submission intervals or offline payment receipt deadlines accurately.</p>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200 dark:border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1">Step 03</span>
                  <h4 className="font-bold text-xs text-neutral-800 dark:text-zinc-100 uppercase mb-1">Category & Seat Categorization mapping</h4>
                  <p className="text-[11px] text-neutral-500">Seats are broken down strictly according to reservation norms of the Indian constitution—making sure OBC, SC, ST, EWS categories align precisely.</p>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200 dark:border-zinc-800">
                  <span className="text-[10px] font-extrabold uppercase text-neutral-400 block mb-1">Step 04</span>
                  <h4 className="font-bold text-xs text-neutral-800 dark:text-zinc-100 uppercase mb-1">Authentic Citing & Direct Links</h4>
                  <p className="text-[11px] text-neutral-500">We configure fully transparent citation links so candidates can view original notifications on the official parent board portal without intermediate hops.</p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-black text-neutral-800 dark:text-zinc-100 uppercase tracking-tight">
                3. Editorial team & Author bio expertise
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed mb-4">
                SarkariBoard is run by former competitive examination advocates and experts who possess decades of cumulative experience tracking and preparing lists.
              </p>
              <Authors />
            </section>

            <section className="space-y-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-zinc-100 uppercase">Correcting Mistakes Transparently</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                If an official department releases a corrigendum update (subsequent date changes, seat updates), our team triggers an immediate update override within minutes of disclosure, flashing warning banners dynamically on the detail view so candidates do not submit outdated fees.
              </p>
            </section>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-4">
            <button 
              onClick={onBackToHome}
              className="bg-[#D32F2F] hover:bg-neutral-900 dark:hover:bg-zinc-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer font-sans"
            >
              Back To Home Portal
            </button>
            <span className="text-[10px] uppercase font-mono text-neutral-400 font-bold">
              Last Audited: June 2026 • Verified True
            </span>
          </div>
        </div>
      </main>
    );
  }

  if (view === 'disclaimer') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#D32F2F] dark:text-[#ef4444] tracking-tight border-b border-neutral-150 dark:border-zinc-800 pb-3 uppercase">
            Disclaimer
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-semibold">
            NOTICE: SarkariBoard is NOT a government website or official agency.
          </div>
          
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-300 leading-relaxed font-normal">
            All information and links on this site are for your help and learning only.
          </p>
 
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-500 dark:text-zinc-400">
            <li>We try our best to give correct data, but we are not responsible for typing mistakes or date changes.</li>
            <li>You must read the official notice from the government before you pay any fees or submit forms.</li>
            <li>We do not take any payments on this website. All fees go directly to the official government payment pages.</li>
          </ul>
 
          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-[#D32F2F] hover:bg-neutral-900 dark:hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center shadow-md transition inline-block uppercase cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </main>
    );
  }
 
  if (view === 'privacy') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#D32F2F] dark:text-[#ef4444] tracking-tight border-b border-neutral-150 dark:border-zinc-800 pb-3 uppercase">
            Privacy Policy
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-300 leading-relaxed">
            This Privacy Policy explains what information we collect when you visit SarkariBoard and how we use it.
          </p>
          <div className="space-y-4">
            <h2 className="font-bold text-neutral-800 dark:text-zinc-100 text-base sm:text-lg">Log Files</h2>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
              We keep standard log files to understand how people use our website. This includes your IP address, browser type, date and time, and pages you click. None of this tells us who you are.
            </p>
            <h2 className="font-bold text-neutral-800 dark:text-zinc-100 text-base sm:text-lg">Online Ads</h2>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
              Other companies that show ads on our site might use cookies to show you better ads. We do not control how they do this.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-[#D32F2F] hover:bg-neutral-900 dark:hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center transition inline-block uppercase cursor-pointer"
            >
              Agree & Close
            </button>
          </div>
        </div>
      </main>
    );
  }
 
  if (view === 'terms') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white dark:bg-[#121214] rounded-2xl border border-neutral-200 dark:border-zinc-800 p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-[#D32F2F] dark:text-[#ef4444] tracking-tight border-b border-neutral-150 dark:border-zinc-800 pb-3 uppercase">
            Terms of Use
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-zinc-300 leading-relaxed">
            These terms explain the rules for using SarkariBoard. If you use this site, we assume you agree to them. If you do not agree, please do not use the website.
          </p>
          <div className="space-y-4">
            <h2 className="font-bold text-neutral-800 dark:text-zinc-100 text-base sm:text-lg">Website Content</h2>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
              SarkariBoard collects information. You can download and save PDFs, answer keys, and syllabus lists for your own personal use.
            </p>
            <h2 className="font-bold text-neutral-800 dark:text-zinc-100 text-base sm:text-lg">Our Responsibility</h2>
            <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
              We are not responsible if the website goes down or if there are mistakes in dates or numbers. Always check the official government notices.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-neutral-900 dark:bg-zinc-800 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center transition inline-block uppercase cursor-pointer"
            >
              I Accept
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
