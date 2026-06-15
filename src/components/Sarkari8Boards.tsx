import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Post, CollectionType } from '../types';
import { usePortalStore } from '../store';
import { useTheme } from '../App';
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
  ArrowRight,
  Wrench,
  ChevronDown
} from 'lucide-react';

interface Sarkari8BoardsProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

const iconMap: Record<CollectionType, React.ComponentType<{ className?: string }>> = {
  'jobs': Briefcase,
  'results': Award,
  'admit-cards': CreditCard,
  'answer-keys': Key,
  'admissions': School,
  'syllabus': BookOpen,
  'scholarships': GraduationCap,
  'yojana': Globe,
};

const getCategoryThemeColors = (id: CollectionType) => {
  switch (id) {
    case 'jobs':
      return { 
        text: 'text-red-750 text-red-705 text-red-700', 
        dot: 'bg-red-650 bg-red-600', 
        badge: 'bg-red-800', 
        headerBg: 'bg-rose-50/90 dark:bg-rose-950/40', 
        headerBorder: 'border-red-600 dark:border-rose-900/60',
        titleText: 'text-red-950 dark:text-rose-100',
        iconBg: 'bg-rose-100/80 dark:bg-rose-900/60 text-red-700 dark:text-rose-200'
      };
    case 'results':
      return { 
        text: 'text-emerald-705 text-emerald-700', 
        dot: 'bg-emerald-600', 
        badge: 'bg-emerald-800', 
        headerBg: 'bg-emerald-50/90 dark:bg-emerald-950/40', 
        headerBorder: 'border-emerald-600 dark:border-emerald-950/60',
        titleText: 'text-emerald-955 dark:text-emerald-100',
        iconBg: 'bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-200'
      };
    case 'admit-cards':
      return { 
        text: 'text-indigo-705 text-indigo-700', 
        dot: 'bg-indigo-600', 
        badge: 'bg-indigo-800', 
        headerBg: 'bg-indigo-50/90 dark:bg-indigo-950/40', 
        headerBorder: 'border-indigo-600 dark:border-indigo-950/60',
        titleText: 'text-indigo-955 dark:text-indigo-100',
        iconBg: 'bg-indigo-100/80 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-200'
      };
    case 'answer-keys':
      return { 
        text: 'text-amber-705 text-amber-700', 
        dot: 'bg-amber-600', 
        badge: 'bg-amber-800', 
        headerBg: 'bg-amber-50/90 dark:bg-amber-950/40', 
        headerBorder: 'border-amber-600 dark:border-amber-950/60',
        titleText: 'text-amber-955 dark:text-amber-100',
        iconBg: 'bg-amber-100/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-200'
      };
    case 'admissions':
      return { 
        text: 'text-sky-705 text-sky-700', 
        dot: 'bg-sky-600', 
        badge: 'bg-sky-800', 
        headerBg: 'bg-sky-50/95 dark:bg-sky-950/40', 
        headerBorder: 'border-sky-600 dark:border-sky-950/60',
        titleText: 'text-sky-955 dark:text-sky-100',
        iconBg: 'bg-sky-100/80 dark:bg-sky-900/60 text-sky-700 dark:text-sky-200'
      };
    case 'syllabus':
      return { 
        text: 'text-purple-705 text-purple-700', 
        dot: 'bg-purple-600', 
        badge: 'bg-purple-800', 
        headerBg: 'bg-purple-50/90 dark:bg-purple-950/40', 
        headerBorder: 'border-purple-600 dark:border-purple-950/60',
        titleText: 'text-purple-955 dark:text-purple-100',
        iconBg: 'bg-purple-100/80 dark:bg-purple-900/60 text-purple-700 dark:text-purple-200'
      };
    case 'scholarships':
      return { 
        text: 'text-pink-750 text-pink-700', 
        dot: 'bg-pink-600', 
        badge: 'bg-pink-800', 
        headerBg: 'bg-pink-50/90 dark:bg-pink-950/40', 
        headerBorder: 'border-pink-600 dark:border-pink-950/60',
        titleText: 'text-pink-955 dark:text-pink-100',
        iconBg: 'bg-pink-100/80 dark:bg-pink-900/60 text-pink-750 dark:text-pink-200'
      };
    case 'yojana':
      return { 
        text: 'text-teal-705 text-teal-700', 
        dot: 'bg-teal-600', 
        badge: 'bg-teal-800', 
        headerBg: 'bg-teal-50/90 dark:bg-teal-950/40', 
        headerBorder: 'border-teal-600 dark:border-teal-950/60',
        titleText: 'text-teal-955 dark:text-teal-100',
        iconBg: 'bg-teal-100/80 dark:bg-teal-900/60 text-teal-700 dark:text-teal-200'
      };
    default:
      return { 
        text: 'text-neutral-700', 
        dot: 'bg-neutral-600', 
        badge: 'bg-neutral-800', 
        headerBg: 'bg-neutral-50 dark:bg-neutral-850', 
        headerBorder: 'border-neutral-600 dark:border-neutral-800',
        titleText: 'text-neutral-900 dark:text-neutral-100',
        iconBg: 'bg-neutral-100 dark:bg-neutral-850 text-neutral-700'
      };
  }
};



export default function Sarkari8Boards({ posts = [], onSelectPost }: Sarkari8BoardsProps) {
  const [store, setStore] = usePortalStore();
  const navigate = useNavigate();
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);

  const jumpToBoard = (boardId: string) => {
    const el = document.getElementById(`board-${boardId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveHighlightId(boardId);
      setTimeout(() => {
        setActiveHighlightId(null);
      }, 3000);
    }
  };

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
              {/* Category Header */}
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
              
              {/* Post List */}
              <div className="flex-grow p-1.5 sm:p-4 flex flex-col justify-between bg-[#FDFDFB] dark:bg-neutral-900/40 relative overflow-hidden border-t-0">
                {/* Granular noise texture overlay */}
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
                    {/* List section - Responsive sub-grid so that full-width links look structured on wider screens */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 font-sans">
                      {catPosts.slice(0, 30).map((post, postIndex) => {
                        // Dynamic Mini Deadline Indicator
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

                        // Extract parameters for optimizing empty space as requested
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
                          if (p.content) {
                            const match = p.content.match(/General\s*\/\s*OBC.*?Rs\.\s*(\d+)/i) || p.content.match(/General.*?Rs\.\s*(\d+)/i);
                            if (match) {
                              return `₹${match[1]}`;
                            }
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
                              {/* Title and dot container */}
                              <span className="flex items-start gap-1 w-full">
                                <span className={`w-1 h-1 rounded-none mt-1.5 shrink-0 ${colors.dot} shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.3)]`}></span>
                                <span className="flex-grow text-left py-0 leading-tight break-words whitespace-normal text-[#1e293b] dark:text-[#cbd5e1] group-hover:text-red-705 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all duration-100 font-extrabold text-[10px] sm:text-[10.5px]">
                                  {post.title}
                                </span>
                              </span>
                              
                              {/* Detailed Information Row designed to beautifully fill empty horizontal and vertical space */}
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
                                    {examFee && (
                                      <span className="flex items-center gap-0.5">
                                        <span className="text-emerald-650/80 font-medium">Fee:</span>
                                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{examFee}</span>
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {compactExam && (
                                      <span className="flex items-center gap-0.5">
                                        <span className="text-gray-400 font-medium">Exam Date:</span>
                                        <span className="text-gray-700 dark:text-zinc-300 font-bold">{compactExam}</span>
                                      </span>
                                    )}
                                    {compactStart && <span className="text-zinc-300 dark:text-zinc-800">|</span>}
                                    {compactStart && (
                                      <span className="flex items-center gap-0.5">
                                        <span className="text-emerald-650/80 font-medium">Released:</span>
                                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{compactStart}</span>
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

                    {/* View More Button */}
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
      {/* 2 columns on mobile/tablets for pristine side-by-side bento card layout; 3 columns on large desktop screens to fit 6 cards beautifully */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 p-0 w-full mt-2 font-sans">
        {categoriesList.slice(2).map((cat, secondaryIdx) => {
          const catPosts = groupedData[cat.id] || [];
          const colors = getCategoryThemeColors(cat.id);

          const isHighlighted = activeHighlightId === cat.id;

          const boardCard = (
            <div 
              key={cat.id}
              id={`board-${cat.id}`}
              className={`bg-white dark:bg-neutral-900 border-2 rounded-none flex flex-col h-auto transition-all duration-300 ease-out sm:hover:-translate-y-1 sm:hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:sm:hover:shadow-[5px_5px_0px_0px_rgba(39,39,42,1)] relative overflow-hidden group/board ${
                isHighlighted
                  ? "border-amber-400 dark:border-amber-400 ring-4 ring-amber-500/50 dark:ring-amber-500/50 scale-[1.01] shadow-[0_0_15px_10px_rgba(245,158,11,0.4)] px-0.5"
                  : "border-gray-900 dark:border-zinc-700 shadow-none sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:sm:shadow-[3px_3px_0px_0px_rgba(39,39,42,1)]"
              }`}
            >
              {/* Category Header */}
              <div className={`${colors.headerBg || 'bg-[#FAF9F5] dark:bg-zinc-805'} border-b-2 ${colors.headerBorder || 'border-gray-900 dark:border-zinc-700'} text-gray-900 dark:text-zinc-100 px-1.5 py-1 sm:px-2.5 sm:py-1.5 flex items-center justify-between relative overflow-hidden`}>
                <div className="flex items-center gap-1 z-10 w-full min-w-0">
                  <div className={`p-0.5 ${colors.iconBg || 'bg-gray-250 dark:bg-zinc-700 text-gray-900 dark:text-zinc-100'} border border-gray-950 shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center w-5 h-5`}>
                    {(() => {
                      const IconComp = iconMap[cat.id] || Sparkles;
                      return <IconComp className="w-3 h-3" />;
                    })()}
                  </div>
                  <div className="min-w-0 leading-none">
                    <h2 className={`font-mono font-black text-[9px] sm:text-[10.5px] uppercase tracking-tight ${colors.titleText || 'text-gray-900 dark:text-zinc-100'} truncate`}>
                      {cat.title}
                    </h2>
                    <span className={`font-mono text-[5.5px] sm:text-[6.5px] uppercase tracking-wider ${colors.text} block mt-0.5 font-bold truncate`}>
                      {cat.bilingualTitle}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Post List */}
              <div className="flex-grow p-1 sm:p-1.5 flex flex-col justify-between bg-[#FDFDFB] dark:bg-neutral-900/40 relative overflow-hidden border-t-0">
                {/* Granular noise texture overlay */}
                <div 
                  className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
                />

                {catPosts.length === 0 ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-3 text-center text-xs text-neutral-400 dark:text-neutral-400 gap-1 z-10 relative">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-750 animate-pulse" />
                    <p className="italic font-medium text-[8.5px]">No updates yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between z-10 relative gap-1.5">
                    {/* List section */}
                    <div className="space-y-1 font-sans">
                      {catPosts.slice(0, 15).map((post, postIndex) => {
                        // Dynamic Mini Deadline Indicator
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
                              text: `${daysDiff}d`,
                              severity: daysDiff <= 3 ? 'critical' : 'warning'
                            };
                          }
                          return null;
                        };
                        const deadlineInfo = getMiniDeadline(post);

                        // Extract parameters for optimizing empty space as requested
                        const appStart = post.attributes?.datesSchema?.applicationStart || post.attributes?.applicationStart || post.postDate;
                        const lastDate = post.lastDateToApply || post.attributes?.datesSchema?.lastDateToApply || post.attributes?.lastDateToApply;
                        const examDate = post.examDate || post.attributes?.datesSchema?.examDate || post.attributes?.examDate;

                        const formatCompactDate = (dStr?: string) => {
                          if (!dStr) return '';
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

                        const compactStart = formatCompactDate(appStart);
                        const compactLast = formatCompactDate(lastDate);
                        const compactExam = formatCompactDate(examDate);

                        return (
                          <Link
                            key={post.id}
                            to={`/post/${post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left py-1.5 px-0.5 sm:py-1 sm:px-1 border border-gray-300 dark:border-zinc-800/80 hover:border-red-650 dark:hover:border-red-500 bg-white dark:bg-zinc-950 hover:bg-[#FAF9F5] dark:hover:bg-zinc-900 group transition-all duration-100 ease-in-out font-bold cursor-pointer flex items-center justify-between relative sm:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.05)] sm:hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] rounded-none"
                          >
                            <span className="flex-grow flex flex-col gap-0.5 min-w-0 pr-0.5">
                              {/* Title and dot container */}
                              <span className="flex items-start gap-1 w-full">
                                <span className={`w-0.5 h-0.5 rounded-none mt-1.5 shrink-0 ${colors.dot} shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,0.3)]`}></span>
                                <span className="flex-grow text-left py-0 break-words whitespace-normal text-slate-800 dark:text-zinc-200 group-hover:text-red-705 dark:group-hover:text-red-400 group-hover:translate-x-0.5 transition-all duration-100 font-bold text-[8px] sm:text-[9px] leading-tight">
                                  {post.title}
                                </span>
                              </span>
                              
                              {/* Subtitle key information to fill extra empty space */}
                              <span className="flex flex-wrap items-center gap-x-1 pl-1.5 font-mono text-[6.5px] text-gray-500 dark:text-zinc-405 select-none">
                                {postIndex < 2 && (
                                  <span className="px-1 py-[0.5px] bg-[#D32F2F] text-white text-[5.5px] leading-none font-black uppercase tracking-wider rounded-none shrink-0 mr-0.5 animate-pulse">
                                    New
                                  </span>
                                )}
                                {cat.id === 'admit-cards' && compactExam && (
                                  <span>Exam: {compactExam}</span>
                                )}
                                {cat.id === 'answer-keys' && compactExam && (
                                  <span>Exam: {compactExam}</span>
                                )}
                                {cat.id === 'syllabus' && compactStart && (
                                  <span>Added: {compactStart}</span>
                                )}
                                {cat.id === 'admissions' && compactLast && (
                                  <span>Last: <span className="text-red-700/85 font-bold">{compactLast}</span></span>
                                )}
                                {cat.id === 'scholarships' && compactLast && (
                                  <span>Last: <span className="text-red-700/85 font-bold">{compactLast}</span></span>
                                )}
                                {cat.id === 'yojana' && compactStart && (
                                  <span>Started: {compactStart}</span>
                                )}
                                {deadlineInfo && (
                                  <span className="text-[6.5px] text-red-650 font-bold ml-auto">{deadlineInfo.text}</span>
                                )}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* View More Button */}
                    <div className="pt-2 px-0.5 pb-0.5 z-10 relative">
                      {catPosts.length > 15 ? (
                        <button
                          onClick={() => {
                            setStore({ selectedCollection: cat.id });
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          className="w-full text-center py-1.5 border border-gray-300 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-gray-900 bg-amber-200 hover:bg-[#1e293b] hover:text-white dark:hover:bg-neutral-800 dark:hover:text-white transition-all cursor-pointer shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 rounded-none h-auto"
                        >
                          View All {catPosts.length}
                        </button>
                      ) : (
                        <div className="w-full text-center py-1 text-[8px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-400 border-t border-dashed border-gray-250 dark:border-neutral-800">
                          Up To Date
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );

          // We insert the Mobile Social Join banner after second block in secondary layout
          if (secondaryIdx === 1) {
            return (
              <React.Fragment key={cat.id}>
                {boardCard}
                
                {/* Mobile-only social join card spanned across both columns */}
                <div key="mobile-join-section" className="col-span-2 md:hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-neutral-950 text-white p-4 rounded-xl shadow-lg border border-blue-800/50 flex flex-col gap-3 my-1">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-[#DC2626] text-white px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest font-mono animate-pulse">
                        Fast Update
                      </span>
                      <h4 className="font-sans font-extrabold text-[12px] uppercase tracking-wide text-amber-300">
                        Join Our Official Community
                      </h4>
                    </div>
                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      Sarkari Jobs, results & admit card notification direct on your mobile.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href="https://whatsapp.com/channel/0029Vb7jr5D17En1gOUJB01u"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] text-white p-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="https://t.me/sarkariboardweb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0088cc] text-white p-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.939z" />
                      </svg>
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>
              </React.Fragment>
            );
          }

          return boardCard;
        })}
      </div>
    </div>
  );
}
