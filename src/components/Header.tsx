import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import {
  Search,
  Share2,
  PlusCircle,
  MessageSquareCode,
  Layers,
  ChevronDown,
  GraduationCap,
  Languages,
  X,
  Wrench,
  Type,
  AlertCircle,
  Sun,
  Moon,
  Mic,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Post, CollectionType } from "../types";
import { fetchMarkdownPosts } from "../lib/contentFetcher";
import { useTrendingSystem } from "../lib/trendingSystem";
import { usePortalStore } from "../store";
import { useTheme } from "../App";
import Logo from "./Logo";
import { JobCategory } from "../types";

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCollection: string;
  setSelectedCollection: (col: string) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export default function Header({
  currentView,
  setCurrentView,
  selectedCollection,
  setSelectedCollection,
  searchKeyword,
  setSearchKeyword,
  posts,
  onSelectPost,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isBoardOpen, setIsBoardOpen] = useState(false);
  const [isHomeHubOpen, setIsHomeHubOpen] = useState(false);
  const [isUrgentOpen, setIsUrgentOpen] = useState(false);
  const boardDropdownRef = useRef<HTMLDivElement>(null);
  const homeHubDropdownRef = useRef<HTMLDivElement>(null);
  const urgentBtnRef = useRef<HTMLButtonElement>(null);
  const urgentPopupRef = useRef<HTMLDivElement>(null);
  const [memberCounts] = useState({
    whatsapp: 14250,
    telegram: 85200,
  });

  const [store, setStore] = usePortalStore();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sarkariboard_recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const addRecentSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem("sarkariboard_recent_searches", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    function handleClickOutsideSearch(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsRecentOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, []);

  const [filteredPostsSuggestions, setFilteredPostsSuggestions] = useState<Post[]>([]);
  const [filteredCategorySuggestions, setFilteredCategorySuggestions] = useState<JobCategory[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchKeyword(transcript);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        setError(`Speech Error: ${event.error}`);
        setTimeout(() => setError(null), 3000);
      };
    }
  }, [setSearchKeyword]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (searchKeyword.length > 1) {
      const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchKeyword.toLowerCase())
      ).slice(0, 5);
      
      const filteredCategories = Object.values(JobCategory).filter((cat) =>
        cat.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      
      setFilteredPostsSuggestions(filteredPosts);
      setFilteredCategorySuggestions(filteredCategories);
    } else {
      setFilteredPostsSuggestions([]);
      setFilteredCategorySuggestions([]);
    }
  }, [searchKeyword, posts]);
  const allPosts = useMemo(() => fetchMarkdownPosts(), []);
  const { trendingPosts, boostPost } = useTrendingSystem(allPosts, 7);

  const handleTrendingClick = (post: any) => {
    boostPost(post.id);
    setStore({ currentView: "detail", selectedPost: post });
    onSelectPost(post);
  };

  const formatCount = (count: number) => {
    return (count / 1000).toFixed(1) + "K";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        boardDropdownRef.current &&
        !boardDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBoardOpen(false);
      }
      if (
        homeHubDropdownRef.current &&
        !homeHubDropdownRef.current.contains(event.target as Node)
      ) {
        setIsHomeHubOpen(false);
      }
      if (
        urgentBtnRef.current &&
        !urgentBtnRef.current.contains(event.target as Node) &&
        (!urgentPopupRef.current ||
          !urgentPopupRef.current.contains(event.target as Node))
      ) {
        setIsUrgentOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="relative z-40 w-full shadow-md bg-white dark:bg-zinc-950 pattern-boxes pattern-blue-900 pattern-bg-blue-900 pattern-size-4 pattern-opacity-5"
      id="portal-header"
    >
      {/* Main Blue Brand Header */}
      <div
        className="text-white shadow-xl px-4 py-3 sm:py-5 relative overflow-hidden group"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"), linear-gradient(110deg, #1a365d 0%, #1e40af 40%, #0f172a 100%)`,
          backgroundBlendMode: "overlay, normal",
        }}
      >
        {/* Subtle glow orb in background */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 -z-0 pointer-events-none group-hover:bg-blue-400/20 transition-all duration-1000"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
          {/* Logo Brand */}
          <div
            onClick={() => {
              setCurrentView("home");
              setSelectedCollection("all");
            }}
            className="cursor-pointer shrink-0"
          >
            <Logo variant="horizontal" isDarkBackground={true} iconSize={64} />
          </div>

          {/* Search container & Theme toggle area */}
          <div className="flex items-center gap-3 w-full md:max-w-xl grow justify-end mx-0 md:mx-4">
            {/* Premium Highly Visible Dynamic Search Box (Specially optimized for quick touch & find) */}
            <div className="w-full md:max-w-md relative grow" ref={searchContainerRef}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-200" />
              </div>
              <input
                type="text"
                value={searchKeyword}
                onFocus={() => setIsRecentOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addRecentSearch(searchKeyword);
                    setIsRecentOpen(false);
                  }
                }}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  if (currentView !== "home") {
                    setCurrentView("home");
                  }
                }}
                placeholder="Search jobs, results, admit cards, BPSC, SSC..."
                className="w-full bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 placeholder-gray-500/80 border-2 border-gray-950 dark:border-zinc-700 rounded-none py-2.5 pl-11 pr-10 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black transition-all font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]"
              />
              
              {/* Recent Searches dropdown under Search Box */}
              {isRecentOpen && searchKeyword.length <= 1 && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#FAF9F5] dark:bg-zinc-900 border-2 border-gray-950 dark:border-zinc-700 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[60] overflow-hidden p-3.5 text-neutral-800 dark:text-neutral-200 font-sans">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-gray-950 dark:border-zinc-800 select-none">
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-950 dark:text-zinc-200 flex items-center gap-1.5 font-mono">
                      <Search className="w-3 text-red-800" size={12} /> Recent Searches
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentSearches([]);
                        localStorage.removeItem("sarkariboard_recent_searches");
                      }}
                      className="text-[10px] uppercase font-black text-red-100 hover:text-red-950 cursor-pointer font-mono"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {recentSearches.map((term, sidx) => (
                      <button
                        key={sidx}
                        onClick={() => {
                          setSearchKeyword(term);
                          addRecentSearch(term);
                          setIsRecentOpen(false);
                          if (currentView !== "home") {
                            setCurrentView("home");
                          }
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-red-800 hover:text-white dark:bg-zinc-950 dark:hover:bg-red-900 border border-gray-950 dark:border-zinc-705 transition rounded-none text-xs font-black cursor-pointer shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(filteredPostsSuggestions.length > 0 || filteredCategorySuggestions.length > 0) && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-zinc-950 border-2 border-gray-950 dark:border-zinc-750 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[60] overflow-hidden divide-y divide-gray-300 dark:divide-zinc-800">
                  {filteredCategorySuggestions.length > 0 && (
                      <div className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold uppercase text-gray-500">Categories</div>
                  )}
                  {filteredCategorySuggestions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCollection(cat);
                        setSearchKeyword("");
                        setFilteredPostsSuggestions([]);
                        setFilteredCategorySuggestions([]);
                        if (currentView !== "home") {
                          setCurrentView("home");
                        }
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF9F5] dark:hover:bg-zinc-900 text-xs text-neutral-800 dark:text-neutral-200 font-bold transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                  
                  {filteredPostsSuggestions.length > 0 && (
                      <div className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-[10px] font-bold uppercase text-gray-500">Jobs</div>
                  )}
                  {filteredPostsSuggestions.map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        addRecentSearch(post.title);
                        setSearchKeyword("");
                        setFilteredPostsSuggestions([]);
                        setFilteredCategorySuggestions([]);
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-[#FAF9F5] dark:hover:bg-zinc-900 text-xs text-neutral-800 dark:text-neutral-200 font-bold transition-all"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              )}
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute inset-y-0 right-8 pr-3 flex items-center text-blue-100 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={toggleListening}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isListening ? 'text-red-500 animate-pulse' : 'text-blue-100 hover:text-white'}`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            {/* Persistent UI Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="relative shrink-0 overflow-hidden cursor-pointer select-none border-2 border-white/80 dark:border-zinc-700 bg-white/10 dark:bg-zinc-900/40 hover:bg-white/20 dark:hover:bg-zinc-900 transition-all rounded-none py-2 px-3 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.15)] group"
              aria-label="Toggle Theme"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              <motion.div 
                key={theme} 
                initial={{ rotate: -180, opacity: 0 }} 
                animate={{ rotate: 0, opacity: 1 }} 
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-300 fill-amber-300" />
                ) : (
                  <Moon className="w-4 h-4 text-blue-200 fill-blue-200" />
                )}
              </motion.div>
              <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[8px] uppercase font-bold text-blue-200/90 font-mono tracking-widest leading-none">Style</span>
                <span className="text-[10px] uppercase font-black text-white font-sans tracking-wide leading-none mt-0.5 whitespace-nowrap">
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Strip for Quick Filters */}
      <div
        className="border-b border-white/5 px-4 py-2.5 text-xs sm:text-sm overflow-x-auto md:overflow-x-visible scrollbar-none z-50 w-full shadow-md relative"
        id="portal-sub-strip"
        style={{
          backgroundColor: '#0f172a'
        }}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-nowrap items-center justify-between gap-2 overflow-y-visible">
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 py-0.5 shrink-0">
            {/* Simple Elegant Home Link Button */}
            <button
              onClick={() => {
                setCurrentView("home");
                setSelectedCollection("all");
                setStore({ currentFilter: 'all' });
              }}
              className={`px-3.5 py-1.5 rounded-none transition-all text-xs font-black uppercase tracking-wider border-2 border-black cursor-pointer flex items-center gap-1.5 select-none ${
                currentView === "home" && selectedCollection === "all"
                  ? "bg-amber-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-950 hover:bg-gray-100 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              <span>Home</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-nowrap overflow-x-auto scrollbar-none pb-0.5 max-w-full">
            {[
              { id: 'jobs', label: 'Jobs' },
              { id: 'results', label: 'Results' },
              { id: 'admit-cards', label: 'Admit Card' },
              { id: 'answer-keys', label: 'Answer Key' },
              { id: 'syllabus', label: 'Syllabus' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentView("home");
                  setSelectedCollection(cat.id);
                  setStore({ currentFilter: 'all' });
                }}
                className={`px-3 py-1 rounded transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                  selectedCollection === cat.id
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
            
          </div>
        </div>
      </div>

      {/* Quick Tools Drawer rendered globally */}
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-[100] text-xs font-bold uppercase">
          {error}
        </div>
      )}
    </header>
  );
}
