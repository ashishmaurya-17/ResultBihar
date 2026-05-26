import React from 'react';
import { Post } from '../types';
import { Calendar, MapPin, ArrowRight, ExternalLink, HelpCircle, GraduationCap, Briefcase, FileText, BadgeCheck } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onClick: () => void;
  key?: string;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  // Collection Specific styling & icons
  const getCollectionConfig = (col: string) => {
    switch (col) {
      case 'jobs':
        return { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Latest Job', icon: <Briefcase className="w-3.5 h-3.5" /> };
      case 'results':
        return { bg: 'bg-green-100 text-green-800 border-green-200', label: 'Exam Result', icon: <BadgeCheck className="w-3.5 h-3.5" /> };
      case 'admit-cards':
        return { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Admit Card', icon: <FileText className="w-3.5 h-3.5" /> };
      case 'answer-keys':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-200', label: 'Answer Key', icon: <HelpCircle className="w-3.5 h-3.5" /> };
      case 'admissions':
        return { bg: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Admission', icon: <GraduationCap className="w-3.5 h-3.5" /> };
      default:
        return { bg: 'bg-gray-100 text-gray-800 border-gray-200', label: post.collection, icon: <FileText className="w-3.5 h-3.5" /> };
    }
  };

  const config = getCollectionConfig(post.collection);
  const isUrgent = post.urgent || post.featured;

  // Render responsive card item
  return (
    <div 
      onClick={onClick}
      className={`group bg-white rounded-xl border p-5 hover:shadow-md hover:border-red-400 transition duration-150 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden ${
        isUrgent ? 'border-l-4 border-l-red-650 border-neutral-300 bg-amber-50/10' : 'border-gray-200'
      }`}
      id={`post-card-${post.id}`}
    >
      {/* Accent strip for featured entries */}
      {isUrgent && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-650"></div>
      )}

      {/* Main Content Info */}
      <div className="space-y-2 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Organization Pill - Bold badge block */}
          <span className="font-mono text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded font-black tracking-tighter uppercase shrink-0">
            {post.organization}
          </span>

          {/* Category Collection Tag - Bold colors */}
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 font-extrabold uppercase shrink-0 ${config.bg}`}>
            {config.icon}
            <span>{config.label}</span>
          </span>

          {/* State Indicator */}
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-600 font-bold uppercase shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>{post.state}</span>
          </span>

          {/* New indicator of dynamic portal */}
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
            <span className="font-mono text-[9px] font-black text-[#D32F2F] tracking-tight uppercase">NEW</span>
          </span>
        </div>

        {/* Post Title - Extra bold upper-style */}
        <h3 className="font-black text-sm sm:text-base text-gray-900 leading-snug uppercase tracking-tight group-hover:text-[#D32F2F] transition duration-100">
          {post.title}
        </h3>

        {/* Short Summary Snippet */}
        <p className="text-xs text-gray-500 font-medium line-clamp-1">
          {post.summary}
        </p>
      </div>

      {/* Date & Trigger Button Action Section */}
      <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 gap-2 shrink-0">
        
        {/* Post date and info */}
        <div className="text-left md:text-right font-mono">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">POST DATE</p>
          <p className="text-xs font-semibold text-neutral-700 flex items-center gap-1 sm:justify-end">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <span>{post.postDate}</span>
          </p>
        </div>

        {/* Applied Deadline if present */}
        {post.lastDateToApply && (
          <div className="text-left md:text-right font-mono">
            <p className="text-[10px] text-red-500 uppercase tracking-wider font-bold">LAST DATE</p>
            <p className="text-xs font-bold text-red-600">{post.lastDateToApply}</p>
          </div>
        )}

        <div className="bg-neutral-50 hover:bg-red-50 text-neutral-600 hover:text-red-700 p-2 rounded-lg border border-neutral-200 transition group-hover:translate-x-1 duration-150">
          <ArrowRight className="w-4 h-4" />
        </div>

      </div>

    </div>
  );
}
