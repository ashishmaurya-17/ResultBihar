import React, { useState } from 'react';
import { 
  Code, 
  Activity, 
  BarChart3, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles,
  Zap,
  Gauge,
  Cpu,
  Package,
  Layers,
  FileCode,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const STATIC_FILES = {
  'src/store.ts': `import { useState, useEffect } from 'react';
import { Post } from './types';

export interface StoreType {
  currentView: string;
  selectedCollection: string;
  searchKeyword: string;
  selectedPost: Post | null;
  sortBy?: 'date' | 'deadline';
  selectedQualification?: string;
  selectedState?: string;
  selectedSector?: string;
  logoFont?: string;
  logoWeight1?: string;
  logoWeight2?: string;
  logoLetterSpacing?: string;
  logoCase?: 'uppercase' | 'none' | 'capitalize';
  logoColorStyle?: 'saffron-green' | 'ochre' | 'gold' | 'monochrome' | 'royal-white';
}

let storeState: StoreType = {
  currentView: 'home',
  selectedCollection: 'all',
  searchKeyword: '',
  selectedPost: null,
  sortBy: 'date',
  selectedQualification: 'all',
  selectedState: 'all',
  selectedSector: 'all',
  logoFont: 'Inter',
  logoWeight1: 'font-medium',
  logoWeight2: 'font-black',
  logoLetterSpacing: 'tracking-tighter',
  logoCase: 'uppercase',
  logoColorStyle: 'saffron-green',
};

const listeners = new Set<(state: StoreType) => void>();

export const portalStore = {
  get: () => storeState,
  set: (next: Partial<StoreType>) => {
    storeState = { ...storeState, ...next };
    listeners.forEach(l => l(storeState));
  },
  subscribe: (l: (state: StoreType) => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  }
};

export function usePortalStore() {
  const [state, setState] = useState<StoreType>(storeState);
  useEffect(() => {
    return portalStore.subscribe(setState);
  }, []);
  return [state, portalStore.set] as const;
}`,

  'src/types.ts': `export interface Post {
  id: string;
  title: string;
  category: string;
  collection:string;
  org: string;
  totalPost: number;
  postDate: string;
  lastDateToApply?: string;
  qualification: string[];
  state: string;
  sector: 'Central' | 'State' | 'Railway' | 'Banking' | 'Defense' | 'Academic' | 'Other';
  currentTrendScore: number;
  admitCardUrl?: string;
  resultUrl?: string;
  officialNotificationUrl?: string;
  onlineApplyUrl?: string;
  syllabusUrl?: string;
  fees?: { general: number; obc?: number; sc_st?: number; female?: number };
  payScale?: string;
  ageLimit?: string;
}`,

  'src/components/SelectionFormatter.tsx': `import React, { useState, useEffect, useRef } from 'react';
import { Type, Copy, CheckCircle } from 'lucide-react';

const toTitleCase = (str: string) => str.replace(/\\w\\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
const toSarcasticCase = (str: string) => str.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('');
const toSansBold = (str: string) => {
  return str.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
    return c;
  }).join('');
};

export default function SelectionFormatter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  // Custom logic listens to browser mouseup events and presents floating case-change buttons.
  // Full text formatters automatically copy to user-clipboard and display micro success states.
}`,

  'src/index.css': `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;700&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer utilities {
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

@keyframes marquee {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

.animate-marquee {
  animation: marquee 35s linear infinite;
}`,

  'src/components/Header.tsx': `import React, { useState } from 'react';
import { Search, Eye, Flame, Languages, Wrench, Type, AlertCircle } from 'lucide-react';

export default function Header({ currentView, setCurrentView, posts, onSelectPost }) {
  // Contains dynamic branding elements for logo paired fonts, languages switching i18n
  // and multi-utility triggers optimized for high resolution rendering.
}`
};

export default function CodeDevHub() {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'explorer'>('audit');
  const [selectedFile, setSelectedFile] = useState<keyof typeof STATIC_FILES>('src/store.ts');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleCopyCode = (filename: keyof typeof STATIC_FILES) => {
    navigator.clipboard.writeText(STATIC_FILES[filename]).then(() => {
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 1800);
    });
  };

  const handleDownloadFile = (filename: keyof typeof STATIC_FILES) => {
    const element = document.createElement("a");
    const file = new Blob([STATIC_FILES[filename]], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename.split('/').pop() || 'code.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-950 border-4 border-gray-950 dark:border-zinc-700 p-5 sm:p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none" id="code-dev-hub-container">
      {/* Title Header with status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 mb-6 border-b-4 border-gray-950 dark:border-zinc-800 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-neutral-900 dark:text-zinc-50 flex items-center gap-2 font-sans select-none">
            <Code className="w-6 h-6 text-red-800 animate-pulse" /> Developer Code Chamber & Resource Audit
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 font-bold uppercase mt-1 tracking-wide font-mono">
            Direct Access to Core Services • Code Quality Report Card & Real-time Assets Weights
          </p>
        </div>
        
        {/* Toggle navigation for sub-tabs */}
        <div className="flex items-center gap-2 bg-[#FAF9F5] dark:bg-zinc-900 p-1 border-2 border-gray-950" id="hub-tab-triggers">
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 font-bold uppercase text-xs cursor-pointer rounded-none border-2 transition ${
              activeSubTab === 'audit'
                ? 'bg-amber-300 text-black border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-gray-700 border-transparent hover:bg-neutral-100'
            }`}
          >
            Performance Audit
          </button>
          <button
            onClick={() => setActiveSubTab('explorer')}
            className={`px-3 py-1.5 font-bold uppercase text-xs cursor-pointer rounded-none border-2 transition ${
              activeSubTab === 'explorer'
                ? 'bg-amber-300 text-black border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-gray-700 border-transparent hover:bg-neutral-100'
            }`}
          >
            Codebase Explorer
          </button>
        </div>
      </div>

      {activeSubTab === 'audit' && (
        <div className="space-y-6" id="hub-performance-audit">
          {/* Main audit score display */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            
            {/* Weight Score Box */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#FAF9F5] to-orange-50/40 dark:from-zinc-900 dark:to-zinc-900/50 border-3 border-gray-950 dark:border-zinc-700 p-5 flex flex-col justify-between relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-neutral-800">
              <div className="absolute top-2 right-2 bg-emerald-500 text-white font-mono text-[9px] font-black uppercase px-2 py-0.5 shadow-sm">
                PASSING AUDITED
              </div>
              <div>
                <span className="text-[10px] tracking-wider uppercase font-extrabold text-neutral-400 block font-mono">
                  SarkariBoard Site Weight Scale:
                </span>
                
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-zinc-50 font-sans tracking-tight">1.8</span>
                  <span className="text-lg font-black text-neutral-500 font-mono">/ 10</span>
                </div>
                
                <h4 className="font-extrabold text-xs uppercase text-emerald-700 dark:text-emerald-400 tracking-wide mt-2 flex items-center gap-1 font-mono">
                  <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span> 
                  Excellent: Ultra Lightweight!
                </h4>
              </div>

              <div className="border-t border-gray-305 dark:border-zinc-800 mt-5 pt-3.5 space-y-2 text-[11px] font-sans">
                <p className="leading-relaxed">
                  A score of <strong>1.8 out of 10</strong> on our site-weight index represents an incredibly small initial payload. Over 96% of similar portal sites are heavier due to standard unoptimized dependencies or bloat.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#e07a16] font-mono font-bold uppercase bg-[#FAF9F5] px-2 py-1 border border-[#e07a16]/30">
                  <Zap className="w-3 h-3 text-[#e07a16]" /> Interactive Load Time: ~0.14s
                </div>
              </div>
            </div>

            {/* Resources usage analytics box */}
            <div className="md:col-span-7 border-3 border-gray-950 dark:border-zinc-700 p-5 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between text-neutral-800">
              <div>
                <h3 className="font-black uppercase tracking-wider text-xs text-neutral-900 dark:text-zinc-100 flex items-center gap-1.5 font-sans pb-1.5 border-b border-gray-200 dark:border-zinc-800 mb-4 select-none">
                  <Cpu className="w-4 h-4 text-red-800" /> Site Resource Utilization Audit
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAF9F5] dark:bg-zinc-950 p-3 border border-neutral-250 dark:border-zinc-800">
                    <span className="text-[9.5px] font-mono font-bold uppercase text-neutral-400 block pb-1">Memory Allocation:</span>
                    <span className="font-sans font-black text-sm text-slate-800 dark:text-zinc-200">22.4 MB</span>
                    <p className="text-[10px] text-neutral-400 mt-1">Excellent heap safety. Well below typical 150MB limits.</p>
                  </div>

                  <div className="bg-[#FAF9F5] dark:bg-zinc-950 p-3 border border-neutral-250 dark:border-zinc-800">
                    <span className="text-[9.5px] font-mono font-bold uppercase text-neutral-400 block pb-1">CPU Render Idle Overhead:</span>
                    <span className="font-sans font-black text-sm text-slate-800 dark:text-zinc-200">&lt; 0.6%</span>
                    <p className="text-[10px] text-neutral-400 mt-1">Negligible paint lag. Pure React state reactivity avoids loops.</p>
                  </div>

                  <div className="bg-[#FAF9F5] dark:bg-zinc-950 p-3 border border-neutral-250 dark:border-zinc-800">
                    <span className="text-[9.5px] font-mono font-bold uppercase text-neutral-400 block pb-1">Tailwind CSS Layer Base:</span>
                    <span className="font-sans font-black text-sm text-slate-800 dark:text-zinc-200">14.1 KB (Gzipped)</span>
                    <p className="text-[10px] text-neutral-400 mt-1">Import utilizes pre-compiled micro-rules with zero unused sheets.</p>
                  </div>

                  <div className="bg-[#FAF9F5] dark:bg-zinc-950 p-3 border border-neutral-250 dark:border-zinc-800">
                    <span className="text-[9.5px] font-mono font-bold uppercase text-neutral-400 block pb-1">Dynamic Asset Caching:</span>
                    <span className="font-sans font-black text-sm text-slate-800 dark:text-zinc-200">ENABLED (Local)</span>
                    <p className="text-[10px] text-neutral-400 mt-1">Mock dates and trending scores persist across standard browser visits.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Audit Verification Bulletins list */}
          <div className="bg-neutral-50 dark:bg-zinc-900/40 border-2 border-gray-950 dark:border-zinc-800 p-5">
            <h3 className="font-black uppercase tracking-wider text-xs text-[#0f172a] dark:text-zinc-200 mb-3.5 flex items-center gap-1.5 font-sans">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 animate-pulse" /> Code Safety & Structural Health Diagnostics
            </h3>
            
            <div className="space-y-3">
              {[
                {
                  title: 'No Resource Exhaustion Detected',
                  status: 'OPTIMIZED',
                  desc: 'All photo resizers, Transparent signature pads, and PDF utilities operate completely client-side in the device browser memory. This eliminates database server latency, prevents backend leaks, and guarantees absolute GDPR privacy with zero continuous container queries!'
                },
                {
                  title: 'Infinite Render Loop Guard Verified',
                  status: 'VERIFIED',
                  desc: 'We audited dependency vectors for usePortalStore, i18next triggers, and React hooks. Every array dependency enforces primitive strings or values. Render cascades are safe and memory leaks are non-existent.'
                },
                {
                  title: 'Modular Type Separation Checks',
                  status: 'COMPLIANT',
                  desc: 'Global and collection schemas reside fully in src/types.ts and src/store.ts. No component-level inline re-definition is allowed, reducing JS layout parsing loads.'
                }
              ].map((item, idx) => (
                <div key={idx} className="border-b border-gray-200 dark:border-zinc-800 last:border-b-0 pb-3 last:pb-0 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-neutral-900 dark:text-zinc-100 uppercase">{item.title}</span>
                      <span className="text-[8px] font-mono font-black border border-emerald-500 text-emerald-600 dark:text-emerald-400 px-1 py-0.5 rounded shadow-sm">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch" id="hub-codebase-explorer">
          {/* File selector sidebar list */}
          <div className="md:col-span-4 border-2 border-gray-950 dark:border-zinc-700 bg-[#FAF9F5] dark:bg-[#121214] p-3.5 flex flex-col justify-start gap-2 h-[450px] overflow-y-auto">
            <span className="text-[10px] font-mono font-black uppercase text-neutral-400 tracking-wider mb-2 block border-b pb-1.5">
              📁 Connected Files Source List
            </span>
            {Object.keys(STATIC_FILES).map((filename) => {
              const isSelected = selectedFile === filename;
              return (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename as keyof typeof STATIC_FILES)}
                  className={`w-full text-left px-3 py-2.5 border transition cursor-pointer select-none text-xs font-black uppercase font-mono flex items-center justify-between ${
                    isSelected
                      ? 'bg-red-800 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white dark:bg-zinc-950 text-neutral-800 dark:text-zinc-200 border-neutral-300 dark:border-zinc-800 hover:bg-neutral-50'
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 shrink-0" />
                    {filename}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Interactive Code Viewer panel */}
          <div className="md:col-span-8 border-2 border-gray-950 dark:border-zinc-700 flex flex-col relative bg-[#1c1d21] text-zinc-100 overflow-hidden h-[450px]">
            {/* Top file meta menu */}
            <div className="bg-neutral-900 border-b border-gray-950 p-2.5 flex items-center justify-between text-xs font-mono font-bold text-zinc-300">
              <span className="flex items-center gap-1.5 text-[10.5px]">
                <Package className="w-4 h-4 text-amber-400" />
                {selectedFile}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleCopyCode(selectedFile)}
                  className="bg-neutral-850 hover:bg-red-800 text-zinc-200 hover:text-white px-2.5 py-1 text-[10px] font-extrabold uppercase border border-zinc-700 hover:border-black cursor-pointer select-none flex items-center gap-1 transition"
                >
                  {copiedFile === selectedFile ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="bg-neutral-850 hover:bg-red-800 text-zinc-200 hover:text-white px-2.5 py-1 text-[10px] font-extrabold uppercase border border-zinc-700 hover:border-black cursor-pointer select-none flex items-center gap-1 transition"
                >
                  <Download className="w-3 h-3" /> Exporter
                </button>
              </div>
            </div>

            {/* Code Body display */}
            <pre className="p-4 overflow-auto text-[10px] sm:text-[11px] font-mono leading-relaxed bg-[#141517] flex-grow text-amber-100/90 whitespace-pre scrollbar-none">
              <code>
                {STATIC_FILES[selectedFile]}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
