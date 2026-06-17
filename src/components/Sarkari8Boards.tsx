import React, { useMemo, useState } from 'react';
import { Post, CollectionType } from '../types';
import { usePortalStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Award,
  CreditCard,
  Key,
  School,
  BookOpen,
  GraduationCap,
  Globe,
  ArrowRight
} from 'lucide-react';

interface Sarkari8BoardsProps {
  posts: Post[];
  onSelectPost?: (post: Post) => void;
}

const iconMap: Record<string, any> = {
  jobs: Briefcase,
  results: Award,
  'admit-cards': CreditCard,
  'answer-keys': Key,
  admissions: School,
  syllabus: BookOpen,
  scholarships: GraduationCap,
  yojana: Globe
};

const getCategoryThemeColors = (catId: CollectionType) => {
  switch (catId) {
    case 'jobs': return { headerBg: 'bg-red-50 dark:bg-red-950/20', headerBorder: 'border-red-900', titleText: 'text-red-900 dark:text-red-400', badge: 'bg-red-600', dot: 'bg-red-600', text: 'text-red-700/70', iconBg: 'bg-red-100 dark:bg-red-900' };
    case 'results': return { headerBg: 'bg-emerald-50 dark:bg-emerald-950/20', headerBorder: 'border-emerald-900', titleText: 'text-emerald-900 dark:text-emerald-400', badge: 'bg-emerald-600', dot: 'bg-emerald-600', text: 'text-emerald-700/70', iconBg: 'bg-emerald-100 dark:bg-emerald-900' };
    case 'admit-cards': return { headerBg: 'bg-indigo-50 dark:bg-indigo-950/20', headerBorder: 'border-indigo-900', titleText: 'text-indigo-900 dark:text-indigo-400', badge: 'bg-indigo-600', dot: 'bg-indigo-600', text: 'text-indigo-700/70', iconBg: 'bg-indigo-100 dark:bg-indigo-900' };
    case 'answer-keys': return { headerBg: 'bg-amber-50 dark:bg-amber-950/20', headerBorder: 'border-amber-900', titleText: 'text-amber-900 dark:text-amber-400', badge: 'bg-amber-600', dot: 'bg-amber-600', text: 'text-amber-700/70', iconBg: 'bg-amber-100 dark:bg-amber-900' };
    case 'admissions': return { headerBg: 'bg-cyan-50 dark:bg-cyan-950/20', headerBorder: 'border-cyan-900', titleText: 'text-cyan-900 dark:text-cyan-400', badge: 'bg-cyan-600', dot: 'bg-cyan-600', text: 'text-cyan-700/70', iconBg: 'bg-cyan-100 dark:bg-cyan-900' };
    case 'syllabus': return { headerBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/20', headerBorder: 'border-fuchsia-900', titleText: 'text-fuchsia-900 dark:text-fuchsia-400', badge: 'bg-fuchsia-600', dot: 'bg-fuchsia-600', text: 'text-fuchsia-700/70', iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-900' };
    case 'scholarships': return { headerBg: 'bg-pink-50 dark:bg-pink-950/20', headerBorder: 'border-pink-900', titleText: 'text-pink-900 dark:text-pink-400', badge: 'bg-pink-600', dot: 'bg-pink-600', text: 'text-pink-700/70', iconBg: 'bg-pink-100 dark:bg-pink-900' };
    case 'yojana': return { headerBg: 'bg-teal-50 dark:bg-teal-950/20', headerBorder: 'border-teal-900', titleText: 'text-teal-900 dark:text-teal-400', badge: 'bg-teal-600', dot: 'bg-teal-600', text: 'text-teal-700/70', iconBg: 'bg-teal-100 dark:bg-teal-900' };
    default: return { headerBg: '', headerBorder: '', titleText: '', badge: '', dot: '', text: '', iconBg: '' };
  }
};

export default function Sarkari8Boards({ posts = [], onSelectPost }: Sarkari8BoardsProps) {
  const [store, setStore] = usePortalStore();
  const navigate = useNavigate();
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  const categoriesList: Array<{
    id: CollectionType;
    title: string;
    bilingualTitle: string;
    color: string;
    accentClass: string;
    hoverTextClass: string;
  }> = [
    { id: 'jobs', title: 'Latest Jobs', bilingualTitle: 'Government Jobs', color: 'bg-gradient-to-br from-red-600 via-rose-600 to-pink-800', accentClass: 'border-red-600', hoverTextClass: 'hover:text-red-700 dark:hover:text-red-400' },
    { id: 'results', title: 'Results', bilingualTitle: 'Check Your Score', color: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-800', accentClass: 'border-emerald-600', hoverTextClass: 'hover:text-emerald-700 dark:hover:text-emerald-400' },
    { id: 'admit-cards', title: 'Admit Card', bilingualTitle: 'Download Hall Ticket', color: 'bg-gradient-to-br from-indigo-600 via-blue-700 to-sky-800', accentClass: 'border-indigo-600', hoverTextClass: 'hover:text-indigo-600 dark:hover:text-indigo-400' },
    { id: 'answer-keys', title: 'Answer Key', bilingualTitle: 'View Test Answers', color: 'bg-gradient-to-br from-amber-500 via-orange-600 to-red-700', accentClass: 'border-amber-600', hoverTextClass: 'hover:text-amber-600 dark:hover:text-amber-400' },
    { id: 'admissions', title: 'Admission', bilingualTitle: 'College Forms', color: 'bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-800', accentClass: 'border-cyan-600', hoverTextClass: 'hover:text-cyan-600 dark:hover:text-cyan-400' },
    { id: 'syllabus', title: 'Syllabus', bilingualTitle: 'Exam Topics', color: 'bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-800', accentClass: 'border-purple-600', hoverTextClass: 'hover:text-purple-600 dark:hover:text-purple-400' },
    { id: 'scholarships', title: 'Scholarship', bilingualTitle: 'Student Helps', color: 'bg-gradient-to-br from-pink-600 via-rose-500 to-red-700', accentClass: 'border-pink-600', hoverTextClass: 'hover:text-pink-600 dark:hover:text-pink-400' },
    { id: 'yojana', title: 'Sarkari Yojana', bilingualTitle: 'Govt. Schemes', color: 'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-800', accentClass: 'border-teal-600', hoverTextClass: 'hover:text-teal-600 dark:hover:text-teal-400' }
  ];

  const groupedData = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    return categoriesList.reduce((acc, cat) => {
      let filtered = list.filter(p => p && p.collection === cat.id && !p.draft);
      filtered = filtered.sort((a, b) => {
        const timeA = a.postDate ? new Date(a.postDate).getTime() : 0;
        const timeB = b.postDate ? new Date(b.postDate).getTime() : 0;
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });
      acc[cat.id] = filtered;
      return acc;
    }, {} as Record<CollectionType, Post[]>);
  }, [posts]);

  return (
    <div id="sarkari-8-boards-section" className="w-full space-y-4 sm:space-y-5">
      {/* Top Bilingual Notification Header */}
      <div className="border-b-2 border-gray-900 dark:border-zinc-700 pb-2 sm:pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-1 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 sm:w-2.5 sm:h-7 bg-[#D32F2F] shrink-0 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
          <div>
            <h2 className="font-sans font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-gray-900 dark:text-zinc-100 flex items-center gap-1.5 leading-none">
              Notifications
            </h2>
          </div>
        </div>
      </div>

      {/* Primary Full-Length Focus Boards: Latest Jobs & Results */}
      <div className="space-y-4 sm:space-y-5 w-full font-sans">
        {categoriesList.slice(0, 2).map((cat) => {
          const catPosts = groupedData[cat.id] || [];
          const colors = getCategoryThemeColors(cat.id);
          const isHighlighted = activeHighlightId === cat.id;

          return (
            <div 
              key={cat.id}
              id={`board-${cat.id}`}
              className={`bg-white dark:bg-neutral-900 border-2 rounded-none flex flex-col h-auto transition-all duration-300 ease-out sm:hover:-translate-y-1 sm:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:sm:hover:shadow-[6px_6px_0px_0px_rgba(39,39,42,1)] relative overflow-hidden group/board w-full ${
                isHighlighted
                  ? "border-amber-400 dark:border-amber-400 ring-4 ring-amber-500/50 dark:ring-amber-500/50 scale-[1.01] shadow-[0_0_15px_10px_rgba(251,191,36,0.4)]"
                  : "border-gray-900 dark:border-zinc-700 shadow-none sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:sm:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]"
              }`}
            >
              <div className={`${colors.headerBg || 'bg-[#FAF9F5] dark:bg-zinc-800'} border-b-2 ${colors.headerBorder || 'border-gray-900 dark:border-zinc-700'} text-gray-900 dark:text-zinc-100 px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between relative overflow-hidden`}>
                <div className="flex items-center gap-1.5 z-10 w-full min-w-0">
                  <div className={`p-1 ${colors.iconBg || 'bg-gray-250 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100'} border border-gray-950 shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center w-7 h-7 rounded-none`}>
                    {(() => {
                      const IconComp = iconMap[cat.id] || Sparkles;
                      return <IconComp className="w-3.5 h-3.5" />;
                    })()}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h2 className={`font-mono font-black text-xs sm:text-sm uppercase tracking-tight ${colors.titleText || 'text-gray-900 dark:text-zinc-100'} truncate`}>
                      {cat.title}
                    </h2>
                    <span className={`font-mono text-[8px] sm:text-[9px] uppercase tracking-widest ${colors.text} block -mt-0.5 font-bold truncate`}>
                      {cat.bilingualTitle}
                    </span>
                  </div>
                </div>
                <span className={`font-mono text-[6.5px] sm:text-[7.5px] uppercase ${colors.badge} text-white px-1.5 py-0.5 shrink-0 tracking-widest font-black select-none border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
                  LIVE
                </span>
              </div>
              
              <div className="flex-grow p-1.5 sm:p-4 flex flex-col justify-between bg-[#FDFDFB] dark:bg-neutral-900/40 relative overflow-hidden border-t-0">
                 <div 
                  className="absolute inset-0 z-0 opacity-[0.025] dark:opacity-[0.06] pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                />

                {catPosts.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-xs text-neutral-400 dark:text-neutral-400 gap-1.5 z-10 relative">
                    <Sparkles className="w-6 h-6 text-neutral-300 dark:text-neutral-700 animate-pulse" />
                    <p className="italic font-medium text-[11px] sm:text-xs">No updates available at the moment</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between z-10 relative gap-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 font-sans">
                      {catPosts.slice(0, 30).map((post, postIndex) => {
                        const getMiniDeadline = (p: Post) => {
                          const lastDateStr = p.lastDateToApply || p.attributes?.lastDateToApply || p.attributes?.importantDates?.['Last Date to Apply Online'] || p.attributes?.importantDates?.['Last Date for Apply Online'];
                          if (!lastDateStr) return null;
                          const dateMatch = String(lastDateStr).match(/\d{4}-\d{2}-\d{2}/);
                          if (!dateMatch) return null;
                          const deadline = new Date(dateMatch[0]);
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          deadline.setHours(0, 0, 0, 0);
                          const msDiff = deadline.getTime() - today.getTime();
                          const daysDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
                          if (daysDiff > 0 && daysDiff <= 15) {
                            return {
                              text: `${daysDiff}d left`,
                              severity: daysDiff <= 3 ? 'critical' : 'warning'
                            };
                          }
                          return null;
                        };
                        const deadlineInfo = getMiniDeadline(post);

                        const appStart = post.attributes?.datesSchema?.applicationStart || post.attributes?.applicationStart || post.postDate;
                        const lastDate = post.lastDateToApply || post.attributes?.datesSchema?.lastDateToApply || post.attributes?.lastDateToApply;
                        const examDate = post.examDate || post.attributes?.datesSchema?.examDate || post.attributes?.examDate;

                        const formatCompactDate = (dStr?: string) => {
                          const match = String(dStr).match(/(\d{4})-(\d{2})-(\d{2})/);
                          if (match) {
                            const [_, year, rMonth, rDay] = match;
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const mIdx = parseInt(rMonth, 10) - 1;
                            if (mIdx >= 0 && mIdx < 12) {
                              return `${parseInt(rDay, 10)} ${months[mIdx]}`;
                            }
                          }
                          return String(dStr);
                        };

                        const getFeeDisplay = (p: Post) => {
                          if (p.collection !== 'jobs') return null;
                          const generalFee = p.attributes?.generalOBC || p.attributes?.applicationFee?.generalOBC || p.attributes?.datesSchema?.examFee || p.examFee;
                          if (generalFee) {
                            const numberOnly = String(generalFee).replace(/[^\d]/g, '');
                            return numberOnly ? `₹${numberOnly}` : String(generalFee);
                          }
                          return '₹100';
                        };

                        const compactStart = formatCompactDate(appStart);
                        const compactLast = formatCompactDate(lastDate);
                        const compactExam = formatCompactDate(examDate);
                        const examFee = getFeeDisplay(post);

                        return (
                          <Link
                            key={post.id}
                            to={`/post/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left py-1.5 px-1 md:py-1 md:px-1.5 border border-gray-300 dark:border-zinc-800/85 hover:border-red-650 dark:hover:border-red-500 bg-white dark:bg-zinc-950 hover:bg-[#FAF9F5] dark:hover:bg-zinc-900 group transition-all duration-100 ease-in-out font-bold cursor-pointer flex items-center justify-between relative sm:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.05)] sm:hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rounded-none"
                          >
                            <span className="flex-grow flex flex-col gap-0.5 min-w-0 pr-1">
                              <span className="flex items-start gap-1 w-full">
                                <span className={`w-1 h-1 rounded-none mt-1.5 shrink-0 ${colors.dot} shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.3)]`}></span>
                                <span className="flex-grow text-left py-0 leading-tight break-words whitespace-normal text-[#1e293b] dark:text-[#cbd5e1] group-hover:text-red-705 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all duration-100 font-extrabold text-[10px] sm:text-[10.5px]">
                                  {post.title}
                                </span>
                              </span>
                              
                              <span className="flex flex-wrap items-center gap-x-1 gap-y-0.5 pl-2 mt-0.5 font-mono text-[7.5px] text-gray-500 dark:text-zinc-400 select-none">
                                {postIndex < 2 && (
                                  <span className="px-1 py-[0.5px] bg-[#D32F2F] text-white text-[6.5px] leading-none font-black uppercase tracking-wider rounded-none animate-pulse shrink-0">
                                    New
                                  </span>
                                )}
                                {post.collection === 'jobs' ? (
                                  <>
                                    {compactStart && (
                                      <span className="flex items-center gap-0.5">
                                        <span className="text-gray-400 font-medium">Start:</span>
                                        <span className="text-gray-700 dark:text-zinc-300 font-bold">{compactStart}</span>
                                      </span>
                                    )}
                                    {compactLast && <span className="text-zinc-300 dark:text-zinc-800">|</span>}
                                    {compactLast && (
                                      <span className="flex items-center gap-0.5">
                                        <span className="text-red-650/80 font-medium">Last:</span>
                                        <span className="text-red-700 dark:text-red-400 font-bold">{compactLast}</span>
                                      </span>
                                    )}
                                    {examFee && <span className="text-zinc-300 dark:text-zinc-800">|</span>}
                                  </>
                                ) : (
                                  <>
                                    {compactExam && (
                                      <span className="flex items-center gap-0.5">
                                        <span className="text-gray-400 font-medium">Exam Date:</span>
                                        <span className="text-gray-700 dark:text-zinc-300 font-bold">{compactExam}</span>
                                      </span>
                                    )}
                                  </>
                                )}
                                {deadlineInfo && (
                                  <>
                                    <span className="text-zinc-300 dark:text-zinc-800">|</span>
                                    <span className={`px-1 py-[0.5px] border text-[6.5px] leading-none font-bold uppercase tracking-wider rounded-none shrink-0 ${
                                      deadlineInfo.severity === 'critical'
                                        ? 'border-red-500 bg-red-100 text-red-800'
                                        : 'border-amber-500 bg-amber-100 text-amber-850'
                                    }`}>
                                      {deadlineInfo.text}
                                    </span>
                                  </>
                                )}
                              </span>
                            </span>
                            <ArrowRight className="hidden sm:block w-2.5 h-2.5 text-red-650 dark:text-red-400 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150 ease-out" />
                          </Link>
                        );
                      })}
                    </div>

                    <div className="pt-2 px-1 pb-1 z-10 relative">
                      {catPosts.length > 24 ? (
                        <button
                          onClick={() => {
                            setStore({ selectedCollection: cat.id });
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          className="w-full text-center py-2.5 sm:py-3 border-2 border-gray-900 dark:border-zinc-700 text-xs font-black uppercase tracking-widest text-gray-900 bg-amber-300 hover:bg-[#1e293b] hover:text-white dark:hover:bg-neutral-800 dark:hover:text-white transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 animate-none rounded-none"
                        >
                          View All {catPosts.length} {cat.title} Updates
                        </button>
                      ) : (
                        <div className="w-full text-center py-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 border-t border-dashed border-gray-300 dark:border-neutral-800">
                          Bulletin Up To Date
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Focus Boards: Compact Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 w-full">
        {categoriesList.slice(2).map((cat) => {
          const catPosts = groupedData[cat.id] || [];
          const colors = getCategoryThemeColors(cat.id);
          const isHighlighted = activeHighlightId === cat.id;

          return (
            <div 
              key={cat.id}
              id={`board-${cat.id}`}
              className={`bg-white dark:bg-neutral-900 border-2 rounded-none flex flex-col h-auto transition-all duration-200 sm:hover:-translate-y-1 sm:hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:sm:hover:shadow-[5px_5px_0px_0px_rgba(39,39,42,1)] relative overflow-hidden group/board ${
                isHighlighted
                  ? "border-amber-400 dark:border-amber-400 ring-4 ring-amber-500/50 dark:ring-amber-500/50 scale-[1.01] shadow-[0_0_15px_10px_rgba(251,191,36,0.3)]"
                  : "border-gray-900 dark:border-zinc-700 shadow-none sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:sm:shadow-[3px_3px_0px_0px_rgba(39,39,42,1)]"
              }`}
            >
              <div className={`${colors.headerBg || 'bg-[#FAF9F5] dark:bg-zinc-800'} border-b-2 ${colors.headerBorder || 'border-gray-900 dark:border-zinc-700'} text-gray-900 dark:text-zinc-100 px-2 py-1.5 sm:px-3 sm:py-2 flex items-center justify-between relative`}>
                <div className="flex items-center gap-1.5 z-10 w-full min-w-0">
                  <div className={`p-1 ${colors.iconBg || 'bg-gray-250 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100'} border border-gray-950 shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-none`}>
                    {(() => {
                      const IconComp = iconMap[cat.id] || Sparkles;
                      return <IconComp className="w-3 sm:w-3.5 h-3 sm:h-3.5" />;
                    })()}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h2 className={`font-mono font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-tight ${colors.titleText || 'text-gray-900 dark:text-zinc-100'} truncate`}>
                      {cat.title}
                    </h2>
                  </div>
                </div>
              </div>
              
              <div className="flex-grow p-1 sm:p-2 flex flex-col justify-between bg-[#FDFDFB] dark:bg-neutral-900/40 relative">
                {catPosts.length === 0 ? (
                  <div className="flex-grow flex items-center justify-center p-4 text-center text-[10px] text-neutral-400 dark:text-neutral-500 italic font-medium">
                    No updates available
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 sm:gap-1.5 pt-0.5">
                    {catPosts.slice(0, 15).map((post) => (
                      <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => {}}
                        className="w-full text-left py-1 px-1.5 border border-transparent bg-transparent hover:border-gray-200 dark:hover:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 group transition-all duration-75 ease-in font-bold cursor-pointer flex items-center justify-between relative rounded-none"
                      >
                        <span className="flex-grow flex items-center gap-1.5 min-w-0 pr-1">
                          <span className={`w-1 h-1 rounded-none shrink-0 ${colors.dot} shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]`}></span>
                          <span className="flex-grow text-left py-0 leading-tight break-words whitespace-normal text-gray-800 dark:text-zinc-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-75 font-extrabold text-[9px] sm:text-[10px] md:text-[10.5px]">
                            {post.title}
                          </span>
                        </span>
                        <ArrowRight className="w-2 h-2 text-blue-600 dark:text-blue-400 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-75" />
                      </Link>
                    ))}
                    
                    <div className="mt-1 px-1 pb-1">
                       <button
                        onClick={() => {
                          setStore({ selectedCollection: cat.id });
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="w-full text-center py-1 sm:py-1.5 border border-gray-900 dark:border-zinc-700 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-neutral-600 dark:text-zinc-400 hover:bg-gray-950 hover:text-white dark:hover:bg-neutral-800 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rounded-none"
                      >
                        Full List &gt;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
