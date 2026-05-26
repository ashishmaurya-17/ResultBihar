import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Share2, PlusCircle, MessageSquareCode, Layers, ChevronDown, GraduationCap } from 'lucide-react';
import { CollectionType } from '../types';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCollection: string;
  setSelectedCollection: (col: string) => void;
  onOpenAdmin: () => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}

export default function Header({
  currentView,
  setCurrentView,
  selectedCollection,
  setSelectedCollection,
  onOpenAdmin,
  searchKeyword,
  setSearchKeyword
}: HeaderProps) {
  const [isUnivOpen, setIsUnivOpen] = useState(false);
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const univDropdownRef = useRef<HTMLDivElement>(null);
  const boardDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (univDropdownRef.current && !univDropdownRef.current.contains(event.target as Node)) {
        setIsUnivOpen(false);
      }
      if (boardDropdownRef.current && !boardDropdownRef.current.contains(event.target as Node)) {
        setIsBoardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full" id="portal-header">
      {/* Top Bar with Urgent Notes */}
      <div className="bg-amber-500 text-amber-950 px-4 py-1.5 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-red-600"></span>
        <span className="font-mono tracking-wide">CONFIDENTIAL & OFFICIAL PORTAL</span>
        <span className="hidden sm:inline">| Best Education, Admit Card & Sarkari Result Hub for Bihar State & Neighbors</span>
      </div>

      {/* Main Red Brand Header */}
      <div className="bg-[#D32F2F] text-white shadow-lg px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div 
            onClick={() => { setCurrentView('home'); setSelectedCollection('all'); }} 
            className="flex items-center gap-4 cursor-pointer group"
          >
            <div className="bg-white text-[#D32F2F] font-black text-2xl px-3.5 py-1 rounded shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform shrink-0">
              <span className="text-xl sm:text-2xl font-black font-mono tracking-tighter">RB</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white">
                Result Bihar
              </h1>
              <p className="text-[10px] sm:text-xs text-white/80 font-mono tracking-wider uppercase font-bold">
                Bihar's #1 Premium Sarkari Portal
              </p>
            </div>
          </div>

          {/* University Quick Selector Hub (Premium Gold style Dropdown) */}
          <div className="relative inline-block text-left" ref={boardDropdownRef}>
            <button
              onClick={() => setIsBoardOpen(!isBoardOpen)}
              className={`px-4 py-2 rounded-lg transition-all font-mono font-extrabold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-between gap-2 border shadow-md cursor-pointer select-none w-full sm:w-auto ${
                selectedCollection.startsWith('univ-')
                  ? 'bg-amber-400 border-amber-300 text-neutral-950 hover:bg-amber-300 font-black'
                  : 'bg-red-800/90 border-red-700/80 hover:bg-red-900 hover:border-amber-400 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className={`w-4 h-4 ${selectedCollection.startsWith('univ-') ? 'text-neutral-950 animate-bounce' : 'text-amber-400 animate-pulse'}`} />
                <span>
                  {selectedCollection.startsWith('univ-')
                    ? `${selectedCollection.replace('univ-', '').toUpperCase()} Board`
                    : 'State University Board'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isBoardOpen ? 'rotate-180' : ''}`} />
            </button>

            {isBoardOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 py-1.5 font-sans divide-y divide-neutral-800">
                <div className="px-3.5 py-2 text-[10px] uppercase tracking-wider text-amber-400 font-extrabold flex items-center gap-1.5 bg-neutral-950/40 rounded-t-xl">
                  <GraduationCap className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span>Choose Your University</span>
                </div>
                <div className="p-1.5 grid grid-cols-2 gap-1 bg-neutral-900">
                  {[
                    { id: 'univ-brabu', short: 'BRABU (Babu)', label: 'BRABU' },
                    { id: 'univ-lnmu', short: 'LNMU (Lnu)', label: 'LNMU' },
                    { id: 'univ-vksu', short: 'VKSU (Babu)', label: 'VKSU' },
                    { id: 'univ-ppu', short: 'PPU', label: 'PPU' },
                    { id: 'univ-pu', short: 'PU', label: 'PU' },
                    { id: 'univ-mu', short: 'MU', label: 'MU' },
                  ].map((univ) => {
                    const isSelected = selectedCollection === univ.id;
                    return (
                      <button
                        key={univ.id}
                        onClick={() => {
                          setCurrentView('home');
                          setSelectedCollection(univ.id);
                          setIsBoardOpen(false);
                        }}
                        className={`px-2 py-2 rounded-lg text-xs font-bold transition-all text-center uppercase font-mono cursor-pointer flex flex-col items-center justify-center min-h-[48px] ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 font-black shadow-inner border border-amber-300'
                            : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white border border-neutral-700/50 hover:border-amber-400/50'
                        }`}
                      >
                        <span className="text-xs tracking-wider">{univ.short}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="px-1 py-1 bg-neutral-950/60 rounded-b-xl flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedCollection('all');
                      setIsBoardOpen(false);
                    }}
                    className="w-full text-center py-1.5 text-[11px] text-neutral-400 hover:text-white transition font-semibold cursor-pointer animate-pulse"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Strip for Quick Filters */}
      <div className="bg-neutral-900 border-b border-rose-950 text-neutral-200 px-4 py-2 text-xs sm:text-sm overflow-x-auto lg:overflow-x-visible whitespace-nowrap scrollbar-none flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => { setCurrentView('home'); setSelectedCollection('all'); }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'home' && selectedCollection === 'all'
                  ? 'bg-rose-700 text-white shadow-inner font-semibold'
                  : 'hover:bg-neutral-800 hover:text-white'
              }`}
            >
              Home Hub
            </button>
            <div className="h-4 w-[1px] bg-neutral-700"></div>
            
            {/* Collection Navigation Buttons */}
            {[
              { id: 'jobs', label: 'Jobs' },
              { id: 'results', label: 'Results' },
              { id: 'admit-cards', label: 'Admit Cards' },
              { id: 'answer-keys', label: 'Answer Keys' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'syllabus', label: 'Syllabus' },
              { id: 'scholarships', label: 'Scholarships' },
              { id: 'yojana', label: 'Yojana' }
            ].map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  setCurrentView('home');
                  setSelectedCollection(col.id);
                }}
                className={`px-2.5 py-1.5 rounded-md transition-all text-xs font-medium ${
                  currentView === 'home' && selectedCollection === col.id
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow-inner'
                    : 'hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {col.label}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-neutral-700"></div>

            {/* University Dropdown Tab */}
            <div className="relative inline-block text-left" ref={univDropdownRef}>
              <button
                onClick={() => setIsUnivOpen(!isUnivOpen)}
                className={`px-2.5 py-1.5 rounded-md transition-all text-xs font-medium flex items-center gap-1 cursor-pointer ${
                  selectedCollection.startsWith('univ-')
                    ? 'bg-amber-500 text-neutral-950 font-semibold shadow-inner'
                    : 'hover:bg-neutral-800 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                <span>University</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {isUnivOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl z-50 py-1.5 font-sans whitespace-normal">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-400 font-extrabold border-b border-neutral-800 flex items-center gap-1.5 mb-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Bihar State Universities</span>
                  </div>
                  {[
                    { id: 'univ-brabu', label: 'BRABU (Babu / Muzaffarpur)', desc: 'Babasaheb Bhimrao Ambedkar Bihar University' },
                    { id: 'univ-lnmu', label: 'LNMU (Lnu / Darbhanga)', desc: 'Lalit Narayan Mithila University' },
                    { id: 'univ-vksu', label: 'VKSU (Babu / Ara)', desc: 'Veer Kunwar Singh University' },
                    { id: 'univ-ppu', label: 'PPU (Patliputra Univ / Patna)', desc: 'Patliputra University, Patna' },
                    { id: 'univ-pu', label: 'PU (Patna University)', desc: 'Patna University, Patna' },
                    { id: 'univ-mu', label: 'MU (Magadh Univ / Bodhgaya)', desc: 'Magadh University' },
                  ].map((univ) => {
                    const isSelected = selectedCollection === univ.id;
                    return (
                      <button
                        key={univ.id}
                        type="button"
                        onClick={() => {
                          setCurrentView('home');
                          setSelectedCollection(univ.id);
                          setIsUnivOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-neutral-800 transition flex flex-col cursor-pointer ${
                          isSelected ? 'bg-amber-500/15 text-amber-400 font-bold border-l-2 border-amber-500' : 'text-neutral-200'
                        }`}
                      >
                        <span className="text-xs">{univ.label}</span>
                        <span className="text-[9px] text-neutral-500 font-normal">{univ.desc}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-1.5 text-neutral-400 text-xs">
              <Layers className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Live Updates</span>
            </div>

            {/* WhatsApp Link */}
            <a 
              href="https://chat.whatsapp.com/example-result-bihar-group" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded transition-all border border-emerald-500/10 flex items-center gap-1"
              id="whatsapp-channel-btn"
            >
              <span className="font-sans">WhatsApp</span>
            </a>

            {/* Telegram Link */}
            <a 
              href="https://t.me/example_result_bihar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-2.5 py-1 rounded transition-all border border-sky-500/10 flex items-center gap-1"
              id="telegram-channel-btn"
            >
              <span className="font-sans">Telegram</span>
            </a>

            {/* Quick Content Creator Tool (Section 8 Content Workflow) */}
            <button
              onClick={onOpenAdmin}
              className="bg-amber-400 hover:bg-amber-300 text-red-950 text-xs font-bold px-2.5 py-1 rounded transition-all border border-amber-300 flex items-center gap-1 cursor-pointer"
              title="Post generator panel for jobs/results"
              id="admin-portal-trigger"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>CMS</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
