import React, { useState } from 'react';
import { Post } from '../types';
import { 
  X, 
  Calendar, 
  FileText, 
  Share2, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  HelpCircle, 
  ExternalLink, 
  Printer, 
  ClipboardCheck, 
  UserPlus, 
  ChevronRight,
  Info
} from 'lucide-react';

interface PostDetailProps {
  post: Post;
  relatedPosts: Post[];
  onBack: () => void;
  onSelectPost: (post: Post) => void;
}

export default function PostDetail({ post, relatedPosts, onBack, onSelectPost }: PostDetailProps) {
  // Share notification state
  const [copiedLink, setCopiedLink] = useState(false);

  // States for interactive widgets
  // 1. Result scorecard widget
  const [rollCode, setRollCode] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [searchedResult, setSearchedResult] = useState<any | null>(null);

  // 2. Eligibility calculator widget
  const [candidateAge, setCandidateAge] = useState<number | ''>('');
  const [candidateDregree, setCandidateDegree] = useState('none');
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const checkEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateAge || typeof candidateAge !== 'number') {
      setEligibilityResult('Please enter a valid age numeric value.');
      return;
    }

    const minAge = post.ageLimits?.min || 18;
    const maxAge = post.ageLimits?.max || 37;

    if (candidateAge < minAge) {
      setEligibilityResult(`❌ Not Eligible. The minimum required age is ${minAge} years. Your input: ${candidateAge}`);
    } else if (candidateAge > maxAge) {
      setEligibilityResult(`❌ Not Eligible. The maximum required age is ${maxAge} years. Your input: ${candidateAge}`);
    } else {
      if (post.id === 'bpsc-tre-4-teacher' && candidateDregree === 'none') {
        setEligibilityResult(`⚠️ Age fits (${candidateAge}), but BPSC TRE 4.0 requires D.El.Ed, B.Ed or equivalent teacher training qualification.`);
      } else {
        setEligibilityResult(`✅ Congratulations! You meet standard age criteria and eligibility qualifications for ${post.organization} recruitment.`);
      }
    }
  };

  const handleResultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollCode || !rollNumber) {
      alert('Please fill out Roll Code and Roll Number as printed on your admit card.');
      return;
    }
    
    // Realistic dummy memo generation based on BSEB metrics
    setSearchedResult({
      studentName: 'ASHISH KUMAR',
      fatherName: 'RAMESH PRASAD SINGH',
      schoolName: 'Zila School Patna, Bihar',
      rollCode: rollCode,
      rollNo: rollNumber,
      subjects: [
        { code: '101', name: 'Hindi (M.I.L)', fullMarks: 100, passMarks: 30, theory: 78, practical: '-', total: 78, grade: 'A' },
        { code: '102', name: 'Sanskrit (S.I.L)', fullMarks: 100, passMarks: 30, theory: 84, practical: '-', total: 84, grade: 'A+' },
        { code: '112', name: 'Mathematics', fullMarks: 100, passMarks: 30, theory: 95, practical: '-', total: 95, grade: 'O' },
        { code: '113', name: 'Science', fullMarks: 100, passMarks: 30, theory: 62, practical: 19, total: 81, grade: 'A+' },
        { code: '114', name: 'Social Science', fullMarks: 100, passMarks: 30, theory: 59, practical: 18, total: 77, grade: 'A' },
        { code: '115', name: 'English (Non-Math)', fullMarks: 100, passMarks: 30, theory: 72, practical: '-', total: 72, grade: 'A' }
      ],
      totalObtained: 415,
      percentage: '83%',
      division: 'FIRST DIVISION WITH DISTINCTION',
      resultStatus: 'PASS'
    });
  };

  return (
    <article className="space-y-6 pt-2 pb-12" id={`post-detail-${post.id}`}>
      
      {/* Dynamic Segment Breadcrumb list */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 font-medium font-mono" aria-label="Breadcrumb" id="detail-breadcrumbs">
        <button onClick={onBack} className="hover:text-red-700 transition">Portal Index</button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="capitalize">{post.collection.replace('-', ' ')}</span>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="text-neutral-800 font-semibold line-clamp-1">{post.organization} Bulletin</span>
      </nav>

      {/* Detail Banner Header */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-4">
        
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-red-100 text-red-900 border border-red-200 font-mono text-xs font-black uppercase px-2.5 py-1 rounded">
            {post.organization} Bulletin
          </span>
          <span className="bg-amber-100 text-amber-900 border border-amber-200 font-mono text-xs font-black uppercase px-2.5 py-1 rounded">
            {post.collection.replace('-', ' ')}
          </span>
          <span className="bg-neutral-100 text-neutral-800 border border-neutral-200 font-mono text-xs font-bold px-2.5 py-1 rounded">
            {post.state} Selection
          </span>
        </div>

        {/* Big Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 uppercase tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Timelines block */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-neutral-100 pt-4 text-xs font-mono text-neutral-500">
          <p className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>Bulletin Date: <strong className="text-neutral-800">{post.postDate}</strong></span>
          </p>
          {post.lastDateToApply && (
            <p className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>Submission Deadline: <strong className="text-red-700">{post.lastDateToApply}</strong></span>
            </p>
          )}
        </div>

        {/* Social Sharing Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-neutral-100">
          <button 
            onClick={onBack}
            className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-red-700 flex items-center gap-1 px-3 py-2 hover:bg-neutral-50 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back To Board Feed</span>
          </button>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://api.whatsapp.com/send?text=Check out latestResult Bihar update: "
              target="_blank"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
            >
              <span>Share WhatsApp Group</span>
            </a>

            <button
              onClick={handleShare}
              className="bg-neutral-100 text-neutral-800 hover:bg-neutral-200 font-bold text-xs sm:text-sm px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition"
              id="detail-share-btn"
            >
              <Share2 className="w-4 h-4 text-neutral-600" />
              <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Sarkari Table Layout (Core Characteristic of Bihar Job Portals) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Summary Description */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 border-b pb-2 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-red-700" />
              <span>Short Bullet Information</span>
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {post.summary}
            </p>

            {/* Extra markdown text mock if available */}
            {post.howToApply && (
              <div className="space-y-2 mt-4">
                <h3 className="font-bold text-xs sm:text-sm text-neutral-800 uppercase tracking-wider font-mono">
                  Procedure & Steps to Complete Application:
                </h3>
                <div className="bg-neutral-50 p-4 rounded-xl text-xs sm:text-sm text-neutral-600 whitespace-pre-line border leading-relaxed">
                  {post.howToApply}
                </div>
              </div>
            )}
          </div>

          {/* Sarkari table breakdown: Feelist and Agelist */}
          {(post.applicationFee || post.ageLimits) && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden" id="details-tables-board">
              <div className="bg-[#D32F2F] text-white px-5 py-3.5 font-black text-sm uppercase tracking-tight flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-300" />
                <span>SPECIFIC CRITERIA & GENERAL GUIDELINES</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-neutral-100">
                
                {/* Application Fee Table */}
                {post.applicationFee && (
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs sm:text-sm font-black text-rose-800 uppercase font-mono tracking-wider">
                      Application Fee Structure
                    </h3>
                    <table className="w-full text-xs font-mono">
                      <tbody>
                        <tr className="border-b border-rose-50 py-1">
                          <td className="text-neutral-500 py-1.5">General / J&K:</td>
                          <td className="text-right font-bold text-neutral-800">₹{post.applicationFee.general}</td>
                        </tr>
                        <tr className="border-b border-rose-50 py-1">
                          <td className="text-neutral-500 py-1.5">OBC / EBC:</td>
                          <td className="text-right font-bold text-neutral-800">₹{post.applicationFee.obc_ebc}</td>
                        </tr>
                        <tr className="border-b border-rose-50 py-1">
                          <td className="text-neutral-500 py-1.5">SC / ST Reservation:</td>
                          <td className="text-right font-bold text-neutral-800">₹{post.applicationFee.sc_st}</td>
                        </tr>
                        <tr className="border-b border-rose-50 py-1">
                          <td className="text-neutral-500 py-1.5">Female Candidates:</td>
                          <td className="text-right font-bold text-neutral-800">₹{post.applicationFee.female}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[10px] sm:text-xs text-neutral-500 italic bg-neutral-50 p-2.5 rounded-lg">
                      {post.applicationFee.description}
                    </p>
                  </div>
                )}

                {/* Age Limits Box */}
                {post.ageLimits && (
                  <div className="p-4 sm:p-5 space-y-3">
                    <h3 className="text-xs sm:text-sm font-black text-indigo-800 uppercase font-mono tracking-wider">
                      Age Boundaries (Ref Date)
                    </h3>
                    <table className="w-full text-xs font-mono">
                      <tbody>
                        <tr className="border-b border-neutral-100 py-1">
                          <td className="text-neutral-500 py-1.5">Minimum Required Age:</td>
                          <td className="text-right font-bold text-neutral-800">{post.ageLimits.min || '18'} Years</td>
                        </tr>
                        <tr className="border-b border-neutral-100 py-1">
                          <td className="text-neutral-500 py-1.5">Maximum Bound Age:</td>
                          <td className="text-right font-bold text-neutral-800">{post.ageLimits.max || '37'} Years</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[10px] sm:text-xs text-neutral-500 italic bg-neutral-50 p-2.5 rounded-lg leading-relaxed">
                      {post.ageLimits.description}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* Vacancy Breakdown Table */}
          {post.vacancyDetails && post.vacancyDetails.table && (
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-neutral-900 text-white px-5 py-3 font-bold text-sm tracking-wide">
                VACANCY POST & DETAILED SELECTION MATRIX ({post.vacancyDetails.totalPosts} Total Posts)
              </div>
              <div className="overflow-x-auto text-xs sm:text-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-100 border-b font-mono text-neutral-500 text-[10px] uppercase font-bold">
                      <th className="p-3">Recruitment Post Name</th>
                      <th className="p-3 text-center">Vacancies</th>
                      <th className="p-3">Qualifying Eligibility Requirement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-sans">
                    {post.vacancyDetails.table.map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50">
                        <td className="p-3 font-semibold text-neutral-800">{row.postName}</td>
                        <td className="p-3 font-bold text-center text-red-700 font-mono">{row.total}</td>
                        <td className="p-3 text-neutral-600 text-xs leading-relaxed">{row.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interactive Core Feature: Specific action tools */}
          {/* A. If collection is 'results' -> Live Scorecard Lookup! */}
          {post.collection === 'results' && (
            <div className="bg-gradient-to-r from-red-900 to-rose-950 text-white rounded-2xl p-6 shadow-md space-y-4 border border-rose-900" id="result-scorecard-lookup-utility">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black font-sans tracking-tight text-amber-300">
                  LIVE BSEB CERTIFICATE & RESULT SEARCH
                </h3>
              </div>
              <p className="text-xs text-rose-100">
                Simulated access of real-time database credentials. Input your details to retrieve marks memo:
              </p>

              <form onSubmit={handleResultSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-rose-200 font-extrabold">Roll Code (5 digits)</label>
                  <input
                    type="number"
                    placeholder="e.g. 51004"
                    value={rollCode}
                    onChange={(e) => setRollCode(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none font-mono focus:border-amber-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-rose-200 font-extrabold">Roll Number (7 digits)</label>
                  <input
                    type="number"
                    placeholder="e.g. 2603415"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none font-mono focus:border-amber-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-lg self-end h-[38px] transition shadow-md"
                >
                  Generate Scorecard
                </button>
              </form>

              {searchedResult && (
                <div className="bg-white text-neutral-900 rounded-xl p-4 sm:p-6 border border-amber-300 text-xs sm:text-sm font-sans space-y-4 shadow-xl select-all" id="marks-scorecard-memo">
                  
                  {/* Scorecard Header */}
                  <div className="text-center border-b pb-3 border-neutral-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700">BIHAR SCHOOL EXAMINATION BOARD, PATNA</h4>
                    <p className="font-mono text-[10px] text-neutral-500 font-medium">ANNUAL CLASS 10TH (MATRICULE) EXAMINATION MEMORANDUM 2026</p>
                  </div>

                  {/* Student Credentials row */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-sans border-b pb-3 border-neutral-100 text-neutral-700 font-medium">
                    <p>Student Name: <strong className="text-neutral-900 uppercase font-semibold">{searchedResult.studentName}</strong></p>
                    <p>Roll Code / Number: <strong className="text-neutral-900 font-mono">{searchedResult.rollCode} / {searchedResult.rollNo}</strong></p>
                    <p>Father's Name: <strong className="text-neutral-900 uppercase font-semibold">{searchedResult.fatherName}</strong></p>
                    <p>School/College Code: <strong className="text-neutral-900 text-xs">{searchedResult.schoolName}</strong></p>
                  </div>

                  {/* Subject Sheet Matrix */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border text-xs">
                      <thead>
                        <tr className="bg-neutral-100 border-b font-mono font-bold text-neutral-600 uppercase text-[9px]">
                          <th className="p-2">Subject Name</th>
                          <th className="p-2 text-center">Full Marks</th>
                          <th className="p-2 text-center">Theory Marks</th>
                          <th className="p-2 text-center">Prac/Int</th>
                          <th className="p-2 text-center">TOTAL</th>
                          <th className="p-2 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-mono font-semibold">
                        {searchedResult.subjects.map((sub: any, i: number) => (
                          <tr key={i}>
                            <td className="p-2 text-neutral-800 font-sans font-semibold">{sub.name}</td>
                            <td className="p-2 text-center">100</td>
                            <td className="p-2 text-center text-neutral-700">{sub.theory}</td>
                            <td className="p-2 text-center text-neutral-700">{sub.practical}</td>
                            <td className="p-2 text-center text-red-700 font-bold">{sub.total}</td>
                            <td className="p-2 text-center text-emerald-600 font-mono font-bold">{sub.grade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary aggregate scores */}
                  <div className="flex items-center justify-between flex-wrap gap-4 pt-3 border-t bg-neutral-50 px-4 py-3 rounded-lg border">
                    <p className="font-mono text-xs sm:text-sm">Aggregate: <strong className="text-neutral-900 text-base">{searchedResult.totalObtained} / 500</strong> ({searchedResult.percentage})</p>
                    <p className="font-sans text-xs sm:text-sm font-bold text-red-700 uppercase">Division: {searchedResult.division}</p>
                    <button 
                      onClick={() => window.print()}
                      className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 p-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition no-print"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Memo</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* B. If collection is jobs or admissions -> Eligibility check form! */}
          {(post.collection === 'jobs' || post.collection === 'admissions') && (
            <div className="bg-gradient-to-r from-red-950 via-rose-950 to-neutral-900 text-white rounded-2xl p-6 shadow-md space-y-4" id="eligibility-calculator-matrix-tool">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black tracking-tight text-amber-300 flex items-center gap-1.5">
                  INSTANT ELIGIBILITY ASSESSOR
                </h3>
              </div>
              <p className="text-xs text-rose-100">
                Check whether your age limits and certificate match BPSC/LNMU benchmarks:
              </p>

              <form onSubmit={checkEligibility} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-rose-200 font-extrabold">Enter Your Current Age</label>
                  <input
                    type="number"
                    placeholder="e.g. 24"
                    value={candidateAge}
                    onChange={(e) => setCandidateAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none font-mono focus:border-amber-400"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono uppercase text-rose-200 font-extrabold">Teacher's Degree / Qualification</label>
                  <select
                    value={candidateDregree}
                    onChange={(e) => setCandidateDegree(e.target.value)}
                    className="w-full bg-neutral-800 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none font-mono focus:border-amber-400"
                  >
                    <option value="none">none / Graduation Only</option>
                    <option value="deled">12th + D.El.Ed & CTET I</option>
                    <option value="bed">B.Ed + STET I/II qualified</option>
                    <option value="postgrad">Post Graduation + B.Ed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-red-950 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-lg self-end h-[38px] transition shadow-md"
                >
                  Verify Qualifications
                </button>
              </form>

              {eligibilityResult && (
                <div className="bg-neutral-900 border border-amber-300/30 text-amber-100 p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-start gap-2.5">
                  <div className="text-amber-400 font-mono font-black shrink-0">RESULT:</div>
                  <p>{eligibilityResult}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar details with Direct links and social anchors */}
        <div className="space-y-6">
          
          {/* Direct links box (CRITICAL characteristic of sarkari results page) */}
          <div className="bg-[#D32F2F] text-white rounded-2xl p-5 shadow-lg space-y-4" id="direct-links-download-utility-box">
            <h3 className="font-black text-sm sm:text-base tracking-wide uppercase border-b border-white/20 pb-2.5 flex items-center gap-2 text-white">
              <Download className="w-5 h-5 text-yellow-350" />
              <span>DIRECT OFF-SHORE LINKS</span>
            </h3>
            
            <p className="text-[11px] text-blue-100 leading-relaxed italic">
              These direct access links are generated statelessly. Avoid standard web popups. Server load is monitored.
            </p>

            <div className="space-y-3 pt-2">
              {post.importantLinks.map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-black transition duration-150 shadow-md ${
                    link.isPrimary 
                      ? 'bg-amber-400 hover:bg-amber-300 text-neutral-900 border border-amber-300 transform scale-[1.01]' 
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                  id={`direct-link-${post.id}-${lIdx}`}
                >
                  <span className="truncate">{link.label}</span>
                  {link.isDownload ? (
                    <Download className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
                  ) : (
                    <ExternalLink className="w-4 h-4 shrink-0 text-blue-200" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Social join alert marquee widget */}
          <div className="bg-white border rounded-2xl p-5 space-y-3.5 shadow-sm">
            <h3 className="font-sans font-black text-sm text-neutral-800 uppercase tracking-tight flex items-center gap-1.5 border-b pb-2">
              <UserPlus className="w-4 py-0.5 h-4 text-emerald-500" />
              <span>Subscribe Live</span>
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Never miss any recruitment admit cards, notifications or board exam answer key objections. Get directly posted to your mobile phone inbox:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://chat.whatsapp.com/example-result-bihar-group"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold p-2.5 rounded-lg text-center transition"
              >
                Join WhatsApp
              </a>
              <a
                href="https://t.me/example_result_bihar"
                target="_blank"
                rel="noreferrer"
                className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold p-2.5 rounded-lg text-center transition"
              >
                Telegram Channel
              </a>
            </div>
          </div>

          {/* Related notifications block */}
          {relatedPosts.length > 0 && (
            <div className="bg-white border rounded-2xl p-5 space-y-4 shadow-sm" id="related-posts-list-sidebar">
              <h3 className="font-sans font-black text-sm text-neutral-800 uppercase tracking-tight flex items-center gap-1 px-1">
                <span>SIMILAR BULLETINS</span>
              </h3>
              <div className="space-y-3">
                {relatedPosts.slice(0, 4).map((rPost) => (
                  <button
                    key={rPost.id}
                    onClick={() => onSelectPost(rPost)}
                    className="w-full text-left p-3 rounded-lg hover:bg-neutral-50 border border-neutral-100 transition flex flex-col gap-1 cursor-pointer"
                  >
                    <span className="font-mono text-[9px] font-extrabold uppercase bg-red-100 text-red-800 px-1.5 py-0.5 rounded w-fit">
                      {rPost.organization}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-800 leading-tight hover:underline line-clamp-2">
                      {rPost.title}
                    </h4>
                    <span className="font-mono text-[10px] text-neutral-400">
                      Posted: {rPost.postDate}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </article>
  );
}
