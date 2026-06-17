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
      className="relative z-40 w-full bg-white dark:bg-zinc-950 shadow-sm"
      id="portal-header"
    >
      {/* Top Black Strip */}
      <div className="h-1.5 w-full bg-neutral-900 dark:bg-black"></div>

      {/* Main Details and Search Row */}
      <div className="bg-white dark:bg-zinc-950 px-4 py-4 relative overflow-hidden flex items-center justify-between">
        {/* Soft Colored Bloom behind Logo */}
        <div className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 w-48 h-32 bg-indigo-500/15 blur-[50px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full flex items-center gap-4 md:gap-8 relative z-10 flex-wrap md:flex-nowrap">
          {/* Logo Brand Section */}
          <div className="flex items-center gap-6 w-full md:w-auto shrink-0 justify-center md:justify-start">
            <div
              onClick={() => {
                setCurrentView("home");
                setSelectedCollection("all");
              }}
              className="cursor-pointer shrink-0"
            >
              <Logo variant="horizontal" isDarkBackground={false} iconSize={44} />
            </div>

            <div className="hidden md:flex items-center gap-5 shrink-0">
              <div className="w-[1px] h-9 bg-neutral-200 dark:bg-neutral-800"></div>
              <div className="flex flex-col select-none">
                <span className="text-sm font-black text-neutral-900 dark:text-zinc-100 tracking-tight leading-none mb-1">SARKARIBOARD</span>
                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase leading-none">MODERN RECRUITMENT HUB</span>
              </div>
            </div>
          </div>

          {/* Search container & Theme Toggle */}
          <div className="flex items-center gap-4 w-full justify-end mt-2 md:mt-0">
            {/* Search Box */}
            <div className="w-full md:max-w-[36rem] relative" ref={searchContainerRef}>
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" strokeWidth={2.5} />
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
                placeholder="QUERY NODES: BPSC, SSC, RESULTS..."
                className="w-full bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 placeholder-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-full py-3.5 pl-12 pr-14 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold uppercase tracking-wider shadow-sm"
              />
              
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute inset-y-0 right-10 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={toggleListening}
                className={`absolute inset-y-0 right-0 pr-5 flex items-center cursor-pointer ${isListening ? 'text-red-500 animate-pulse' : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200'}`}
              >
                <Mic className="h-4 w-4" />
              </button>

              {/* Recent Searches dropdown under Search Box */}
              {isRecentOpen && searchKeyword.length <= 1 && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 mt-3 w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg z-[60] overflow-hidden p-4">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100 dark:border-neutral-800 select-none">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <Search className="w-3 text-neutral-400" size={12} /> Recent Searches
                    </span>
                    <button
                      onClick={(e) => {
                         e.stopPropagation();
                         setRecentSearches([]);
                         localStorage.removeItem("sarkariboard_recent_searches");
                      }}
                      className="text-[10px] uppercase font-bold text-red-400 hover:text-red-500 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
                        className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-300 transition rounded-full text-xs font-bold cursor-pointer border border-neutral-200 dark:border-zinc-700"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(filteredPostsSuggestions.length > 0 || filteredCategorySuggestions.length > 0) && (
                <div className="absolute top-full left-0 mt-3 w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-lg z-[60] overflow-hidden divide-y divide-neutral-100 dark:divide-zinc-800">
                  {filteredCategorySuggestions.length > 0 && (
                      <div className="px-5 py-2.5 bg-neutral-50 dark:bg-zinc-800/50 text-[10px] font-bold uppercase text-neutral-400">Categories</div>
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
                      className="w-full text-left px-5 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-xs text-neutral-700 dark:text-neutral-300 font-bold transition-all"
                    >
                      {cat}
                    </button>
                  ))}
                  
                  {filteredPostsSuggestions.length > 0 && (
                      <div className="px-5 py-2.5 bg-neutral-50 dark:bg-zinc-800/50 text-[10px] font-bold uppercase text-neutral-400">Jump to Post</div>
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
                      className="block w-full text-left px-5 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-xs text-neutral-700 dark:text-neutral-300 font-bold transition-all"
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
               onClick={toggleTheme}
               className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors shadow-sm cursor-pointer"
               title={`Toggle Theme`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Category Bar */}
      <div className="border-t border-b border-neutral-200/80 dark:border-neutral-800 bg-[#fbfbfb] dark:bg-zinc-900/40 px-4 py-3 sm:py-4 overflow-x-auto scrollbar-none z-30 relative">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-6 sm:gap-8">
          <button
            onClick={() => {
              setCurrentView("home");
              setSelectedCollection("all");
              setStore({ currentFilter: 'all' });
            }}
            className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-800 dark:text-neutral-500 dark:hover:text-neutral-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer select-none"
          >
            System Home
          </button>
          
          <div className="w-[1px] h-5 bg-neutral-200 dark:bg-neutral-800 shrink-0"></div>

          <div className="flex items-center gap-6 lg:gap-10 shrink-0 flex-nowrap pb-0.5 select-none">
            {[
              { id: 'jobs', label: 'Jobs', colorClass: 'text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300' },
              { id: 'results', label: 'Results', colorClass: 'text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300' },
              { id: 'admit-cards', label: 'Admit Cards', colorClass: 'text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300' },
              { id: 'answer-keys', label: 'Answer Keys', colorClass: 'text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300' },
              { id: 'syllabus', label: 'Exam Syllabus', colorClass: 'text-fuchsia-500 hover:text-fuchsia-600 dark:text-fuchsia-400 dark:hover:text-fuchsia-300' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentView("home");
                  setSelectedCollection(cat.id);
                  setStore({ currentFilter: 'all' });
                }}
                className={`text-[11px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${cat.colorClass} ${
                  selectedCollection === cat.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-xl shadow-lg z-[100] text-xs font-bold uppercase">
          {error}
        </div>
      )}
    </header>
  );
}
