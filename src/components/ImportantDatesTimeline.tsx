import React from 'react';
import { ImportantDate } from '../types';

interface ImportantDatesTimelineProps {
  dates: ImportantDate[];
}

const shortenLabel = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('last date') || lower.includes('deadline') || lower.includes('closing') || lower.includes('end date')) return 'Deadline';
  if (lower.includes('start')) return 'Start';
  if (lower.includes('exam')) return 'Exam';
  if (lower.includes('admit')) return 'Admit Card';
  return label;
};

export const ImportantDatesTimeline: React.FC<ImportantDatesTimelineProps> = ({ dates }) => {
  if (!dates || dates.length === 0) return null;

  return (
    <div className="space-y-3 my-4 p-4 border-2 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20 rounded-xl">
      <h3 className="text-[11px] font-bold uppercase text-gray-700 dark:text-zinc-400 border-b border-gray-200 pb-1.5 flex items-center gap-2">
        <span className="bg-red-800 text-white px-1.5 py-0.5 text-[9px]">TIMELINE</span>
        Important Dates
      </h3>
      <div className="relative border-l border-dashed border-gray-300 dark:border-zinc-700 ml-1.5 space-y-3">
        {dates.map((item, index) => {
          const isEnd = item.label.toLowerCase().includes('last') || 
                        item.label.toLowerCase().includes('end') || 
                        item.label.toLowerCase().includes('deadline') || 
                        item.label.toLowerCase().includes('closing');
          
          return (
            <div key={index} className="relative pl-4 group">
              <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border border-white dark:border-zinc-900 ${
                isEnd ? 'bg-yellow-400' : 'bg-gray-400'
              }`} />
              <div className="bg-white dark:bg-zinc-800 p-2 border border-gray-200 dark:border-zinc-700 shadow-sm">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-[11px] leading-snug">
                    {shortenLabel(item.label)}
                  </h4>
                  <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap ${
                    isEnd 
                      ? 'bg-yellow-100 text-yellow-900' 
                      : 'bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-zinc-300'
                  }`}>
                    {item.date}
                  </span>
                </div>
                {item.note && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{item.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
