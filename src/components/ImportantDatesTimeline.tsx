import React from 'react';
import { ImportantDate } from '../types';
import { Calendar, Clock, Sparkles, Bell, Info } from 'lucide-react';

interface ImportantDatesTimelineProps {
  dates: ImportantDate[];
}

const shortenLabel = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('last date') || lower.includes('deadline') || lower.includes('closing') || lower.includes('end') || lower.includes('close')) return 'Deadline';
  if (lower.includes('start') || lower.includes('open')) return 'Start Date';
  if (lower.includes('exam')) return 'Exam Date';
  if (lower.includes('admit')) return 'Admit Card';
  if (lower.includes('result')) return 'Result Date';
  return label;
};

const getDateConfig = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('last date') || lower.includes('deadline') || lower.includes('closing') || lower.includes('end') || lower.includes('close')) {
    return {
      icon: Clock,
      colorClass: 'text-amber-600 dark:text-amber-400',
      borderClass: 'border-amber-205 dark:border-amber-900/40',
      bgClass: 'bg-amber-50/20 dark:bg-amber-950/10',
      accentColor: 'amber',
    };
  }
  if (lower.includes('start') || lower.includes('open')) {
    return {
      icon: Calendar,
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-emerald-205 dark:border-emerald-900/40',
      bgClass: 'bg-emerald-50/20 dark:bg-emerald-950/10',
      accentColor: 'emerald',
    };
  }
  if (lower.includes('exam')) {
    return {
      icon: Sparkles,
      colorClass: 'text-blue-600 dark:text-blue-400',
      borderClass: 'border-blue-205 dark:border-blue-900/40',
      bgClass: 'bg-blue-50/20 dark:bg-blue-950/10',
      accentColor: 'blue',
    };
  }
  if (lower.includes('admit')) {
    return {
      icon: Bell,
      colorClass: 'text-indigo-600 dark:text-indigo-400',
      borderClass: 'border-indigo-205 dark:border-indigo-900/40',
      bgClass: 'bg-indigo-50/20 dark:bg-indigo-950/10',
      accentColor: 'indigo',
    };
  }
  return {
    icon: Calendar,
    colorClass: 'text-neutral-600 dark:text-neutral-400',
    borderClass: 'border-neutral-200 dark:border-zinc-800',
    bgClass: 'bg-neutral-50/30 dark:bg-zinc-950/10',
    accentColor: 'neutral',
  };
};

export const ImportantDatesTimeline: React.FC<ImportantDatesTimelineProps> = ({ dates }) => {
  if (!dates || dates.length === 0) return null;

  return (
    <div className="w-full">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-neutral-150 dark:border-zinc-850 pb-3 mb-4 select-none">
        <h3 className="text-xs sm:text-xs.5 font-sans font-black uppercase text-neutral-900 dark:text-zinc-100 flex items-center gap-2 tracking-wider">
          <Calendar className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={2.5} />
          <span>Important Dates Timeline (महत्वपूर्ण तिथियां)</span>
        </h3>
        <span className="hidden xs:inline-flex items-center gap-1 text-[9px] font-black uppercase bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-100 dark:border-rose-900/40 font-sans tracking-widest animate-pulse">
          Official Notice
        </span>
      </div>

      {/* Grid of highly polished compact date cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dates.map((item, index) => {
          const config = getDateConfig(item.label);
          const IconComponent = config.icon;
          const displayLabel = shortenLabel(item.label);
          
          // Check if date represents "unavailable" or "coming soon"
          const isTba = item.date.toLowerCase().includes('soon') || 
                        item.date.toLowerCase().includes('announce') ||
                        item.date.toLowerCase().includes('tba') ||
                        item.date.toLowerCase().includes('tbd');

          return (
            <div 
              key={index} 
              className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-300 hover:shadow-3xs group h-full ${config.borderClass} ${config.bgClass} relative overflow-hidden`}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 opacity-40 group-hover:opacity-70 transition-opacity ${
                config.accentColor === 'amber' ? 'bg-amber-500' :
                config.accentColor === 'emerald' ? 'bg-emerald-500' :
                config.accentColor === 'blue' ? 'bg-blue-500' :
                config.accentColor === 'indigo' ? 'bg-indigo-500' : 'bg-neutral-500'
              }`} />

              <div>
                {/* Meta Header */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div className={`p-1 rounded-lg ${
                    config.accentColor === 'amber' ? 'bg-amber-100/60 dark:bg-amber-950/40' :
                    config.accentColor === 'emerald' ? 'bg-emerald-100/60 dark:bg-emerald-950/40' :
                    config.accentColor === 'blue' ? 'bg-blue-100/60 dark:bg-blue-950/40' :
                    config.accentColor === 'indigo' ? 'bg-indigo-100/60 dark:bg-indigo-950/40' : 'bg-neutral-100 dark:bg-zinc-800'
                  } shrink-0`}>
                    <IconComponent className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-sans font-black uppercase text-neutral-400 dark:text-zinc-500 tracking-wider truncate">
                    {displayLabel}
                  </span>
                </div>

                {/* Main Date Display */}
                <div className="mt-1">
                  {isTba ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-neutral-500 dark:text-zinc-400 bg-neutral-150/50 dark:bg-zinc-800/80 border border-neutral-200/50 dark:border-zinc-700 font-mono tracking-tight animate-pulse">
                      {item.date}
                    </span>
                  ) : (
                    <span className="text-xs sm:text-xs.5 font-black text-neutral-900 dark:text-zinc-100 font-mono tracking-tight select-all">
                      {item.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Optional sub-note */}
              {item.note && (
                <div className="mt-3 pt-2 border-t border-dashed border-neutral-250 dark:border-zinc-800 flex items-start gap-1">
                  <Info className="w-2.5 h-2.5 text-neutral-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-[9.5px] font-sans font-medium text-neutral-500 dark:text-zinc-400 leading-tight">
                    {item.note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
