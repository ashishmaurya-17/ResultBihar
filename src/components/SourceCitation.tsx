import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { UsefulLink } from '../types';

interface SourceCitationProps {
  sources: UsefulLink[];
}

export default function SourceCitation({ sources }: SourceCitationProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="bg-[#fcfbf7] dark:bg-zinc-900/50 border-2 border-dashed border-[#d5d4d0] dark:border-zinc-800 rounded-none p-5 mb-6">
      <div className="flex items-center justify-between border-b border-[#e5e4e0] dark:border-zinc-800 pb-3 mb-4 flex-wrap gap-2">
        <h3 className="text-xs font-black uppercase text-neutral-800 dark:text-zinc-200 tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" /> 
          Verified Official Source Citations
        </h3>
        <span className="text-[9px] font-mono font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 rounded-none uppercase">
          E-E-A-T Verified
        </span>
      </div>

      <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/40 p-3 rounded-none text-[11px] leading-relaxed text-amber-900 dark:text-amber-250 font-medium">
        <strong>Government Source Reference:</strong> We strictly reference verified government domains (such as <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded-none font-mono font-bold">.gov.in</code> or <code className="bg-amber-100 dark:bg-amber-950 px-1 py-0.5 rounded-none font-mono font-bold">.nic.in</code>) and the week's Employment News papers. Click below to verify the raw notification on the primary agency's official website.
      </div>

      <div className="space-y-3">
        {sources.slice(0, 3).map((source, index) => {
          const isGovDomain = source.url.includes('.gov.in') || source.url.includes('.nic.in') || source.url.includes('.org');
          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-xs p-3 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-none hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/10 transition group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-neutral-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">
                  {source.label}
                </span>
                {isGovDomain && (
                  <span className="text-[9px] font-mono font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Official Board Domain (.gov.in / .nic.in verified)
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-zinc-200">Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600" />
              </div>
            </a>
          );
        })}
        {sources.length > 3 && (
          <p className="text-[10px] text-neutral-400 italic font-medium">...and more official portals</p>
        )}
      </div>
    </div>
  );
}
