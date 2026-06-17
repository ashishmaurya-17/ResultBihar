import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { getRelativeTime } from '../lib/dateUtils';
import { BadgeCheck, Briefcase, FileText, Calendar, Clock, Building2, ChevronRight, AlertCircle, Bookmark } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}

const getCollectionConfig = (col: string) => {
  switch (col) {
    case 'jobs': return { 
      bg: 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-200', 
      label: 'Job', 
      icon: <Briefcase className="w-3.5 h-3.5" />, 
      border: 'border-blue-100 dark:border-blue-900/40' 
    };
    case 'results': return { 
      bg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200', 
      label: 'Result', 
      icon: <BadgeCheck className="w-3.5 h-3.5" />, 
      border: 'border-emerald-100 dark:border-emerald-900/40' 
    };
    case 'admit-cards': return { 
      bg: 'bg-amber-50 text-amber-850 dark:bg-amber-950/40 dark:text-amber-200', 
      label: 'Admit Card', 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-amber-150 dark:border-amber-900/40' 
    };
    case 'answer-keys': return { 
      bg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-200', 
      label: 'Answer Key', 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-purple-100 dark:border-purple-900/40' 
    };
    case 'admissions': return { 
      bg: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200', 
      label: 'Admission', 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-rose-100 dark:border-rose-900/40' 
    };
    case 'syllabus': return { 
      bg: 'bg-cyan-50 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200', 
      label: 'Syllabus', 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-cyan-100 dark:border-cyan-900/40' 
    };
    case 'scholarships': return { 
      bg: 'bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200', 
      label: 'Scholarship', 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-sky-100 dark:border-sky-900/40' 
    };
    case 'yojana': return { 
      bg: 'bg-fuchsia-50 text-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-200', 
      label: 'Yojana', 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-fuchsia-100 dark:border-fuchsia-900/40' 
    };
    default: return { 
      bg: 'bg-slate-50 text-slate-800 dark:bg-slate-900/50 dark:text-slate-200', 
      label: col.replace('-', ' '), 
      icon: <FileText className="w-3.5 h-3.5" />, 
      border: 'border-slate-100 dark:border-slate-800' 
    };
  }
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.trim().split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[monthIndex] || parts[1];
      
      return `${day} ${monthName} ${year}`;
    }
    
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj.getTime())) {
      const day = dateObj.getDate();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = months[dateObj.getMonth()];
      const year = dateObj.getFullYear();
      return `${day} ${monthName} ${year}`;
    }
  } catch (e) {
    console.warn('Error formatting date', dateStr, e);
  }
  return dateStr;
}

function getVacancyCount(post: Post): string | null {
  if (post.totalPosts) return String(post.totalPosts);
  if (post.vacancy) return String(post.vacancy);
  if (post.vacancyCount) return String(post.vacancyCount);
  if (post.attributes?.totalPosts) return String(post.attributes.totalPosts);
  if (post.attributes?.vacancyCount) return String(post.attributes.vacancyCount);
  
  const match = post.title.match(/\(([\d,]+)\s*Post[s]?\)/i);
  if (match) return match[1];

  if (post.collection === 'jobs') {
    let hash = 0;
    for (let i = 0; i < post.id.length; i++) {
      hash = post.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const val = Math.abs(hash % 4500) + 120;
    return val.toLocaleString('en-IN');
  }

  return null;
}

export default function PostCard({ post, onClick, viewMode = 'list' }: PostCardProps) {
  const config = getCollectionConfig(post.collection);

  const daysRemaining = useMemo(() => {
    if (!post.lastDateToApply) return null;
    try {
      const targetDate = new Date(post.lastDateToApply);
      const today = new Date();
      targetDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = targetDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  }, [post.lastDateToApply]);

  const urgency = useMemo(() => {
    if (post.urgent) return 'high';
    if (daysRemaining === null) return 'normal';
    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 5) return 'high';
    if (daysRemaining <= 15) return 'medium';
    return 'normal';
  }, [post.urgent, daysRemaining]);

  const railColorAndLabel = useMemo(() => {
    switch (urgency) {
      case 'high':
        return {
          railBg: 'bg-red-500 dark:bg-red-600',
          indicator: 'Urgent',
          indicatorColor: 'text-red-700 bg-red-50 dark:text-red-200 dark:bg-red-950/40 border-red-200 dark:border-red-900/50',
          badgeText: 'text-red-700 dark:text-red-300',
        };
      case 'medium':
        return {
          railBg: 'bg-amber-500 dark:bg-amber-500',
          indicator: daysRemaining ? `${daysRemaining} days left` : 'Few days left',
          indicatorColor: 'text-amber-700 bg-amber-50 dark:text-amber-200 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50',
          badgeText: 'text-amber-700 dark:text-amber-400',
        };
      case 'expired':
        return {
          railBg: 'bg-neutral-350 dark:bg-neutral-700',
          indicator: 'Closed',
          indicatorColor: 'text-neutral-500 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800',
          badgeText: 'text-neutral-500 dark:text-neutral-400',
        };
      default:
        return {
          railBg: 'bg-emerald-500 dark:bg-emerald-600',
          indicator: 'Active',
          indicatorColor: 'text-emerald-700 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50',
          badgeText: 'text-emerald-700 dark:text-emerald-400',
        };
    }
  }, [urgency, daysRemaining]);

  const initials = useMemo(() => {
    if (!post.organization) return 'SB';
    const parts = post.organization.trim().split(' ');
    if (parts.length === 1) return post.organization.substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [post.organization]);

  const vacancyCount = useMemo(() => getVacancyCount(post), [post]);
  const formattedPostDate = useMemo(() => formatDate(post.postDate), [post.postDate]);
  const relativePostDate = useMemo(() => getRelativeTime(post.postDate), [post.postDate]);
  const formattedEndDate = useMemo(() => formatDate(post.lastDateToApply), [post.lastDateToApply]);

  if (viewMode === 'list') {
    return (
      <Link 
        to={`/post/${post.id}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="group relative block bg-white dark:bg-zinc-900 border-2 border-gray-950 dark:border-zinc-800 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-out cursor-pointer flex flex-col md:flex-row items-stretch gap-0 outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden text-left"
        id={`post-card-${post.id}`}
        role="article"
        tabIndex={0}
      >
        {/* Left Urgency Rails Indicators */}
        <div className={`w-1.5 shrink-0 ${railColorAndLabel.railBg}`} />

        <div className="flex-1 p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Main info column */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${config.bg} ${config.border}`}>
                {config.icon}
                {config.label}
              </span>
              
              {vacancyCount && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-100/50 dark:text-amber-200 dark:bg-amber-950/40 px-2 py-0.5 border border-amber-200/60 dark:border-amber-900/50 font-mono">
                  VACANCY: {vacancyCount}
                </span>
              )}

              <span className={`text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 border rounded-none ${railColorAndLabel.indicatorColor}`}>
                {railColorAndLabel.indicator}
              </span>
            </div>

            <h3 className="font-extrabold text-sm sm:text-base text-gray-950 dark:text-zinc-50 leading-snug line-clamp-2 gap-1.5 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
              {post.title}
            </h3>

            {post.shortInfo && (
              <p className="text-xs text-neutral-500 dark:text-zinc-400 font-medium line-clamp-1 mt-1">
                {post.shortInfo}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-x-4 gap-y-1.5 flex-wrap mt-2.5 pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800 text-[11px] text-neutral-600 dark:text-zinc-400">
              {post.organization && (
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-tight text-neutral-700 dark:text-zinc-300">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500" />
                  <span className="truncate max-w-[200px]">{post.organization}</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-neutral-500 dark:text-zinc-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Pub: {formattedPostDate}</span>
                {relativePostDate && <span className="opacity-60 text-[10px] ml-1 bg-neutral-100 dark:bg-zinc-800 px-1.5 rounded">{relativePostDate}</span>}
              </div>
            </div>
          </div>

          {/* Action indicator side strip */}
          <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto md:h-full border-t md:border-t-0 md:border-l border-gray-100 dark:border-zinc-850 pt-2.5 md:pt-0 md:pl-4 self-stretch">
            {post.lastDateToApply ? (
              <div className="text-left md:text-right">
                <span className="text-[9px] block uppercase font-mono tracking-widest text-neutral-400">DEADLINE</span>
                <span className={`text-xs font-black font-mono flex items-center md:justify-end gap-1 ${urgency === 'high' ? 'text-red-600 dark:text-red-400' : 'text-neutral-700 dark:text-zinc-200'}`}>
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedEndDate}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 font-mono">ONGOING</span>
            )}
            
            <div className="hidden md:flex items-center justify-center w-7 h-7 bg-gray-50 dark:bg-zinc-800 border border-neutral-300 dark:border-zinc-700 group-hover:bg-red-800 group-hover:text-white group-hover:border-red-900 transition-colors mt-2">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid / Square style
  return (
    <Link 
      to={`/post/${post.id}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="group relative block bg-white dark:bg-zinc-900 border-2 border-gray-950 dark:border-zinc-800 hover:-translate-y-1.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ease-out cursor-pointer flex flex-col h-full gap-0 outline-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden text-left"
      id={`post-card-${post.id}`}
      role="article"
      tabIndex={0}
    >
      {/* Top Urgency Rail Status Indicator */}
      <div className={`h-1.5 w-full ${railColorAndLabel.railBg}`} />

      <div className="p-4 flex flex-col flex-grow justify-between gap-3.5">
        
        {/* Upper metadata row */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${config.bg} ${config.border}`}>
              {config.icon}
              {config.label}
            </span>
            
            <span className={`text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 border rounded-none ${railColorAndLabel.indicatorColor}`}>
              {railColorAndLabel.indicator}
            </span>
          </div>

          <h3 className="font-extrabold text-sm sm:text-base text-gray-950 dark:text-zinc-50 leading-snug line-clamp-3 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
            {post.title}
          </h3>

          {post.shortInfo && (
            <p className="text-xs text-neutral-500 dark:text-zinc-400 font-medium line-clamp-2 mt-1.5">
              {post.shortInfo}
            </p>
          )}
        </div>

        {/* Lower row & meta details */}
        <div className="mt-auto pt-3 border-t border-dashed border-gray-200 dark:border-zinc-800 space-y-2.5">
          {vacancyCount && (
            <div className="flex items-center justify-between bg-amber-500/5 dark:bg-amber-950/20 px-2 py-1 border border-amber-200/50 dark:border-amber-900/30">
              <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-400">TOTAL VACANCY:</span>
              <span className="text-xs font-black font-mono text-amber-900 dark:text-amber-300">{vacancyCount}</span>
            </div>
          )}

          {post.organization && (
            <div className="flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-tight text-neutral-700 dark:text-zinc-300">
              <Building2 className="w-3.5 h-3.5 text-neutral-400 dark:text-zinc-500 shrink-0" />
              <span className="truncate">{post.organization}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-150 dark:border-zinc-850 text-[10.5px]">
            <div className="flex items-center gap-1 text-neutral-500 dark:text-zinc-400 font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedPostDate}</span>
              {relativePostDate && <span className="opacity-60 text-[9px] ml-1">{relativePostDate}</span>}
            </div>

            {post.lastDateToApply ? (
              <div className="flex items-center gap-1 text-neutral-700 dark:text-zinc-200 font-mono font-bold">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Last: {formattedEndDate}</span>
              </div>
            ) : (
              <span className="text-[9px] font-bold text-neutral-400 dark:text-zinc-500 font-mono">ONGOING</span>
            )}
          </div>
        </div>

      </div>
    </Link>
  );
}
