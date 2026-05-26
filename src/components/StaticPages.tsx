import React from 'react';

interface StaticPageProps {
  view: string;
  onBackToHome: () => void;
}

export default function StaticPages({ view, onBackToHome }: StaticPageProps) {
  if (view === 'about') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full">
        <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight font-sans border-b pb-3 uppercase text-[#D32F2F]">
            About Our Organizational Board
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
            Result Bihar is a leading standalone private digital archive portal initiated to aggregate governmental vacancies, university enrollment deadlines, exam cards and results memo across regional boards.
          </p>
          <div className="space-y-4 font-sans">
            <h2 className="text-lg font-bold text-neutral-800">Our Strategic Aim</h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Most students and job seekers in Bihar suffer from information blockades, fake web links, and confusing redirects. Result Bihar solves this by publishing a clear, direct, and zero-clutter dashboard containing simple target buttons pointing to official servers without interstitial scripts.
            </p>
            <h2 className="text-lg font-bold text-neutral-800">Curation Standards</h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              All details, fee structures, minimum ages, and qualifying scores are audited by volunteers compiling data directly from newspapers, local administrative boards (such as BPSC Patna, BSEB, LNMU Darbhanga), and central ministries. We strictly urge prospective students to verify actual forms against authentic government registers.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-red-[750] bg-[#D32F2F] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center shadow-md transition inline-block uppercase cursor-pointer"
            >
              Back To Portal Home Hub
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (view === 'disclaimer') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-[#D32F2F] tracking-tight border-b pb-3 uppercase">
            Government Job Info Disclaimer
          </h1>
          
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs sm:text-sm text-amber-950 font-semibold">
            CRITICAL NOTICE: Result Bihar is NOT an official agency, bureau, or board of the Government of India, State Government of Bihar, or any local municipal authority.
          </div>
          
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
            Any information, instructions, circular summaries, vacancies tables, age parameters, recruitment criteria, and results linked on this dashboard are purely for user guidance and educational search.
          </p>

          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-neutral-500">
            <li>Our team makes utmost efforts to verify data, but cannot be held liable for typographical errors or schedule modifications.</li>
            <li>Candidates are strictly instructed to read the official brochure published by authorities (such as BPSC, UPSC, SSC, BSEB) before paying fees or locking application seats.</li>
            <li>No payment or fee transactions are processed inside the Result Bihar portal directly. All transaction requests redirect strictly to official financial gateways of the sovereign boards.</li>
          </ul>

          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-[#D32F2F] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center shadow-md transition inline-block uppercase cursor-pointer"
            >
              Verify & Return Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (view === 'privacy') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-[#D32F2F] tracking-tight border-b pb-3 uppercase">
            Privacy Policy & Tracking Directives
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            At Result Bihar, accessible via the shared application service, one of our main priorities is the absolute privacy of our visitors. This Privacy Policy document outlines our policies on logging, user parameters cookies, and browser cache structures.
          </p>
          <div className="space-y-4">
            <h2 className="font-bold text-neutral-800 text-base sm:text-lg">Log Information and Queries</h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Result Bihar uses standard logs system. These logs record visitors on the platform as part of analytics. The details collected by log files include internet protocol (IP) addresses, browser brand types, date/time logs, referring/exit paths, and the count of mouse clicks. None of this data points to identifiable personal credentials.
            </p>
            <h2 className="font-bold text-neutral-800 text-base sm:text-lg">Google Advertising & External Embeds</h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Third-party ad networks or search partners may use cookies, JavaScript, and beacon protocols on their respective platforms to deliver relevancy in results search. Note that Result Bihar has no control over these third-party behaviors.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-[#D32F2F] hover:bg-neutral-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center transition inline-block uppercase cursor-pointer"
            >
              Close & Agree
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (view === 'terms') {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
        <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-black text-[#D32F2F] tracking-tight border-b pb-3 uppercase">
            Terms And Conditions Of Use
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            These terms outline the rules and general guidelines for the usage of the Result Bihar Portal Hub. By accessing this platform, we assume you accept these terms in full. Do not continue to browse if you do not agree to the standard terms listed.
          </p>
          <div className="space-y-4">
            <h2 className="font-bold text-neutral-800 text-base sm:text-lg">Intellectual Property Rights</h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Unless otherwise stated, Result Bihar is an informational aggregator. Users are permitted to download and copy individual updates PDF sheets, previous answer keys questions, and syllabus lists strictly for personal, non-commercial educational guidance.
            </p>
            <h2 className="font-bold text-neutral-800 text-base sm:text-lg">Liability Restrictions</h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Result Bihar will not be liable for any direct or indirect losses occurring out of server downtime, missing crucial STET objection dates, incorrect age parameters, or changes in board roll number allocations. Check with sovereign gazettes.
            </p>
          </div>
          <div className="pt-4">
            <button 
              onClick={onBackToHome}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl text-center transition inline-block uppercase cursor-pointer"
            >
              I Accept Terms
            </button>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
