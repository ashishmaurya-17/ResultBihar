import React, { useState, useEffect } from 'react';
import { AlignLeft, ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface TocItem {
  level: number;
  text: string;
  id: string;
  targetId: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  onItemClick: (targetId: string, text: string) => void;
  isMobileInline?: boolean;
}

export default function TableOfContents({ items, onItemClick, isMobileInline = false }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true); // collapsible on mobile inline

  // Set up an intersection/scroll observer to highlight the current active heading
  useEffect(() => {
    const handleScroll = () => {
      let currentActive = '';
      
      // Calculate active section based on scroll position
      const scrollPosition = window.scrollY + 140; // offset for sticky details header

      for (const item of items) {
        const el = document.getElementById(item.targetId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentActive = item.targetId;
          }
        }
      }

      // Default to first item if none matched but scrolled near top
      if (!currentActive && items.length > 0) {
        currentActive = items[0].targetId;
      }

      if (currentActive && currentActive !== activeId) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items, activeId]);

  if (!items || items.length === 0) return null;

  if (isMobileInline) {
    // Mobile inline collapsible accordion
    return (
      <div className="lg:hidden mb-8 bg-[#FAF9F5] dark:bg-zinc-950/40 border border-neutral-150 dark:border-zinc-800/85 rounded-2xl overflow-hidden no-print">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 font-sans font-black text-[11px] sm:text-xs uppercase tracking-wider text-neutral-800 dark:text-zinc-200 select-none cursor-pointer outline-none"
        >
          <span className="flex items-center gap-2">
            <AlignLeft size={15} className="text-red-700 dark:text-red-400" />
            <span>Table of Contents (विषय सूची)</span>
          </span>
          <span className="text-neutral-400">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {isOpen && (
          <div className="p-4 pt-0 border-t border-dashed border-neutral-200 dark:border-zinc-850">
            <nav className="space-y-1.5 mt-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => onItemClick(item.targetId, item.text)}
                  className={`w-full text-left flex items-start gap-2 py-2 px-3 rounded-lg text-xs leading-relaxed transition-all cursor-pointer font-sans font-bold ${
                    item.level === 3 ? 'pl-6 text-[11px]' : 'text-[12.5px]'
                  } ${
                    activeId === item.targetId
                      ? 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-450 border-l-2 border-red-800 font-black'
                      : 'text-neutral-600 dark:text-zinc-350 hover:bg-neutral-100/60 dark:hover:bg-zinc-900 border-l border-transparent'
                  }`}
                >
                  <span className="shrink-0 text-neutral-400 dark:text-zinc-500 mt-1">
                    {item.level === 3 ? '↳' : '•'}
                  </span>
                  <span className="truncate">{item.text}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  }

  // Desktop sidebar panel
  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden select-none">
      <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 blur-2xl pointer-events-none"></div>
      
      <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest text-[#1e293b] dark:text-zinc-100 border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4 flex items-center gap-1.5">
        <Compass size={15} className="text-red-600 dark:text-red-400" />
        <span>TABLE OF CONTENTS</span>
      </h3>

      <nav className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {items.map((item, idx) => (
          <button
            key={`${item.id}-${idx}`}
            onClick={() => onItemClick(item.targetId, item.text)}
            className={`w-full text-left flex items-start gap-2.5 py-1.5 px-2.5 rounded-xl text-xs leading-relaxed transition-all duration-200 cursor-pointer font-sans font-bold ${
              item.level === 3 ? 'pl-6 text-[11px] opacity-90' : 'text-xs'
            } ${
              activeId === item.targetId
                ? 'bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 border-l-3 border-red-750 font-black'
                : 'text-neutral-600 dark:text-zinc-350 hover:bg-neutral-50 dark:hover:bg-zinc-850 hover:text-black dark:hover:text-white border-l border-transparent'
            }`}
          >
            <span className="shrink-0 text-neutral-400 dark:text-zinc-500 mt-1">
              {item.level === 3 ? '↳' : '•'}
            </span>
            <span>{item.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
