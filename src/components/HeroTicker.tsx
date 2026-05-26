import React from 'react';
import { Sparkles, Calendar, ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

interface HeroTickerProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export default function HeroTicker({ posts, onSelectPost }: HeroTickerProps) {
  // Filter for urgent/featured posts
  const urgentUpdates = posts.filter(p => p.urgent || p.featured).slice(0, 5);

  if (urgentUpdates.length === 0) return null;

  return (
    <div id="urgent-updates-ticker" className="bg-yellow-100 border-y border-yellow-200 py-2.5 px-4 relative overflow-hidden flex items-center gap-3">
      {/* Ticker Indicator Badge */}
      <div className="bg-red-600 text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded flex items-center gap-1.5 shrink-0 uppercase tracking-tighter z-10 shadow-sm">
        <span className="bg-white text-red-600 font-black text-[9px] px-1 py-0.2 rounded text-center">NEW</span>
        <span>UPDATING LIVE</span>
      </div>

      {/* Scrolling Text Container */}
      <div className="grow overflow-hidden relative h-5 sm:h-6 flex items-center">
        <div className="flex gap-8 items-center animate-[marquee_25s_linear_infinite] whitespace-nowrap hover:pause">
          {/* Repeat to ensure continuous scrolling layout */}
          {[...urgentUpdates, ...urgentUpdates].map((post, idx) => (
            <button
              key={`${post.id}-${idx}`}
              onClick={() => onSelectPost(post)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-900 hover:text-red-700 transition cursor-pointer"
            >
              <span className="font-mono bg-red-100 text-red-800 text-[10px] uppercase px-1.5 py-0.5 rounded font-black tracking-tight shrink-0">
                {post.collection.toUpperCase()}
              </span>
              <span className="hover:underline">{post.title}</span>
              <span className="text-red-600 font-extrabold">•</span>
              <span className="font-mono text-[10px] text-red-800/70 bg-white/80 px-1.5 py-0.5 rounded border border-yellow-200 flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                <span>{post.postDate}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
