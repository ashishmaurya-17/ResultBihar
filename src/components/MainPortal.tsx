import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import { Post } from '../types';
import { usePortalStore } from '../store';
import { safeLocalStorage } from '../lib/storage';
import Sarkari8Boards from './Sarkari8Boards';
import HomeSections from './HomeSections';
import Breadcrumbs from './Breadcrumbs';
import PostCard from './PostCard';
import { 
  Search, 
  Tags, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Languages, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Bookmark, 
  Trash2, 
  FolderHeart 
} from 'lucide-react';

interface MainPortalProps {
  initialPosts: Post[];
}

export default function MainPortal({ initialPosts }: MainPortalProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // Live dynamic mutable posts state
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  React.useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Sarkari Saver Saved Pocket Offline alerts
  const [savedPocket, setSavedPocket] = useState<any[]>([]);

  React.useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem("sarkari_saver_bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSavedPocket(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed retrieving saved pocket:", e);
    }
  }, []);

  const handleRemoveSaved = (bookmarkId: string) => {
    try {
      const filtered = savedPocket.filter(p => p.id !== bookmarkId);
      setSavedPocket(filtered);
      safeLocalStorage.setItem("sarkari_saver_bookmarks", JSON.stringify(filtered));
    } catch (e) {
      console.warn("Failed deleting bookmark:", e);
    }
  };
  
  // Connect to the shared store for navigation & view state
  const [store, setStore] = usePortalStore();

  // 1. Fuse.js Search Implementation
  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['title', 'organization', 'state', 'summary', 'collection'],
    threshold: 0.3,
    distance: 100,
  }), [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    
    // Filter by keyword
    if (store.searchKeyword) {
      result = fuse.search(store.searchKeyword).map(r => r.item);
    }
    
    // Filter by collection from header selection
    if (store.currentFilter === 'saved') {
      const savedIds = (safeLocalStorage.getItem('saved_posts') || '').split(',');
      result = result.filter(p => savedIds.includes(p.id));
    } else if (store.selectedCollection !== 'all' && !store.selectedCollection.startsWith('univ-')) {
      result = result.filter(p => p.collection === store.selectedCollection);
    } else if (store.selectedCollection.startsWith('univ-')) {
      const univId = store.selectedCollection.replace('univ-', '');
      result = result.filter(p => 
        p.organization?.toLowerCase().includes(univId) || 
        p.title.toLowerCase().includes(univId)
      );
    }

    // Filter by qualification
    if (store.selectedQualification && store.selectedQualification !== 'all') {
      const q = store.selectedQualification.toLowerCase();
      result = result.filter(p => {
        const textToSearch = `${p.title} ${p.summary} ${p.attributes?.qualification || ''} ${p.content || ''}`.toLowerCase();
        if (q === '10th pass') return textToSearch.includes('10th') || textToSearch.includes('matric') || textToSearch.includes('high school');
        if (q === '12th pass') return textToSearch.includes('12th') || textToSearch.includes('inter') || textToSearch.includes('10+2') || textToSearch.includes('senior secondary');
        if (q === 'graduate') return textToSearch.includes('graduat') || textToSearch.includes('degree') || textToSearch.includes('bachelor') || textToSearch.includes('b.a') || textToSearch.includes('b.sc') || textToSearch.includes('b.com');
        if (q === 'pg') return textToSearch.includes('pg') || textToSearch.includes('post graduat') || textToSearch.includes('master') || textToSearch.includes('m.a') || textToSearch.includes('m.sc');
        if (q === 'b.ed') return textToSearch.includes('b.ed') || textToSearch.includes('bed');
        if (q === 'b.tech') return textToSearch.includes('b.tech') || textToSearch.includes('btech') || textToSearch.includes('b.e') || textToSearch.includes('engineering');
        if (q === 'mbbs') return textToSearch.includes('mbbs') || textToSearch.includes('medical');
        if (q === 'ca/cs') return textToSearch.includes('ca ') || textToSearch.includes(' cs') || textToSearch.includes('chartered accountant');
        if (q === 'llb') return textToSearch.includes('llb') || textToSearch.includes('law');
        if (q === 'iti') return textToSearch.includes('iti');
        if (q === 'diploma') return textToSearch.includes('diploma');
        if (q === '8th pass') return textToSearch.includes('8th');
        return textToSearch.includes(q.replace(' pass',''));
      });
    }

    // Filter by state
    if (store.selectedState && store.selectedState !== 'all') {
      const st = store.selectedState.toLowerCase();
      result = result.filter(p => {
        const textToSearch = `${p.state || ''} ${p.title} ${p.summary} ${p.content || ''}`.toLowerCase();
        return textToSearch.includes(st);
      });
    }

    // Filter by sector
    if (store.selectedSector && store.selectedSector !== 'all') {
      const sec = store.selectedSector.toLowerCase();
      result = result.filter(p => {
        const textToSearch = `${p.title} ${p.summary} ${p.organization || ''} ${p.content || ''}`.toLowerCase();
        if (sec === 'railway') return textToSearch.includes('railway') || textToSearch.includes('rrb') || textToSearch.includes('rrc');
        if (sec === 'banking') return textToSearch.includes('bank') || textToSearch.includes('ibps') || textToSearch.includes('sbi') || textToSearch.includes('rbi');
        if (sec === 'police') return textToSearch.includes('police') || textToSearch.includes('constable') || textToSearch.includes('si ') || textToSearch.includes('sub inspector');
        if (sec === 'ssc') return textToSearch.includes('ssc') || textToSearch.includes('staff selection');
        if (sec === 'defence') return textToSearch.includes('defen') || textToSearch.includes('army') || textToSearch.includes('navy') || textToSearch.includes('air force') || textToSearch.includes('afcat') || textToSearch.includes('nda');
        if (sec === 'teaching') return textToSearch.includes('teach') || textToSearch.includes('tet') || textToSearch.includes('b.ed') || textToSearch.includes('kvs') || textToSearch.includes('dsssb');
        if (sec === 'upsc') return textToSearch.includes('upsc');
        if (sec === 'psc') return textToSearch.includes('psc ') || textToSearch.includes('public service commission');
        if (sec === 'psu') return textToSearch.includes('psu') || textToSearch.includes('ongc') || textToSearch.includes('bhel') || textToSearch.includes('ntpc') || textToSearch.includes('sail') || textToSearch.includes('gail');
        return textToSearch.includes(sec);
      });
    }

    // Sort the results
    result = [...result].sort((a, b) => {
      if (store.sortBy === 'deadline') {
        const deadlineA = a.lastDateToApply ? new Date(a.lastDateToApply).getTime() : Infinity;
        const deadlineB = b.lastDateToApply ? new Date(b.lastDateToApply).getTime() : Infinity;
        return deadlineA - deadlineB; // Nearest first
      }
      // Default to 'date' sorted newest first
      const timeA = new Date(a.postDate).getTime();
      const timeB = new Date(b.postDate).getTime();
      return timeB - timeA;
    });

    return result;
  }, [posts, store.searchKeyword, store.selectedCollection, store.selectedQualification, store.selectedState, store.selectedSector, fuse, store.sortBy]);

  // 2. Pagination Logic / View More Logic
  const defaultItems = store.selectedCollection === 'all' && !store.searchKeyword ? 12 : 100;
  const [itemsToShow, setItemsToShow] = useState(defaultItems);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    () => (safeLocalStorage.getItem('sarkari-view-mode') as 'grid' | 'list') || 'list'
  );
  
  React.useEffect(() => {
    safeLocalStorage.setItem('sarkari-view-mode', viewMode);
  }, [viewMode]);
  
  React.useEffect(() => {
    setItemsToShow(defaultItems);
  }, [store.selectedCollection, store.searchKeyword, store.selectedQualification, store.selectedState, store.selectedSector]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (itemsToShow >= filteredPosts.length || isLoadingMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Trigger when user reaches 80% of the page down
      if (scrollTop + windowHeight >= documentHeight * 0.8) {
        setIsLoadingMore(true);
        // Simulate fetch delay
        setTimeout(() => {
          setItemsToShow(prev => Math.min(prev + 50, filteredPosts.length));
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [itemsToShow, filteredPosts.length, isLoadingMore]);
  
  const paginatedPosts = filteredPosts.slice(0, itemsToShow);

  // 3. Derived Tags for Tag Cloud
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach(p => {
      tagsSet.add(p.collection);
      if (p.organization) tagsSet.add(p.organization);
    });
    return Array.from(tagsSet).slice(0, 15);
  }, [posts]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 py-6 grow w-full space-y-8">
        
        {/* Visually hidden but SEO important H1 */}
        <h1 className="sr-only">Sarkari Result 2026 - Latest Govt Jobs, Admit Cards & Results</h1>

        {/* SARKARI SAVER OFFLINE BOOKMARKS POCKET */}
        {savedPocket && savedPocket.length > 0 && (
          <section className="border-2 border-dashed border-amber-500 dark:border-amber-700/60 p-4 bg-amber-50/20 dark:bg-zinc-900/30 relative rounded-none transition-all">
            <div className="flex items-center justify-between mb-3 border-b border-amber-200 dark:border-zinc-800 pb-2">
              <span className="flex items-center gap-1.5 font-sans font-black uppercase text-[11.5px] text-amber-950 dark:text-amber-400">
                <FolderHeart size={14} className="text-amber-600 dark:text-amber-400" />
                Sarkari Saver: Your Offline Notice Pocket / आपके सहेजे गए फॉर्म
              </span>
              <span className="text-[9.5px] font-mono font-bold uppercase bg-amber-100 dark:bg-zinc-800 px-2 py-0.5 rounded-none text-amber-800 dark:text-amber-300">
                {savedPocket.length} Saved Offline
              </span>
            </div>
            
            <p className="text-[10.5px] text-neutral-600 dark:text-zinc-400 font-medium leading-relaxed mb-3">
              These notices have been safely cached inside your browser. You can access and view these active notification summaries, eligibility criteria, and important state guidelines <strong className="text-neutral-800 dark:text-zinc-200">even when offline or on unstable railway networks!</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {savedPocket.map((item, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-zinc-950 border border-amber-200 dark:border-zinc-850 hover:border-amber-653 dark:hover:border-amber-500 transition-all flex flex-col justify-between group relative shadow-xs">
                  <button 
                    onClick={() => handleRemoveSaved(item.id)}
                    className="absolute top-1.5 right-1.5 text-neutral-400 hover:text-red-700 dark:hover:text-red-400 hover:bg-neutral-50 dark:hover:bg-zinc-900 p-1 transition-colors rounded-none cursor-pointer select-none"
                    title="Remove from saved pocket"
                  >
                    <Trash2 size={11} />
                  </button>
                  <div className="space-y-1.5 pr-4 min-w-0">
                    <span className="inline-block text-[8px] font-mono font-black text-amber-850 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/20 px-1 py-0.5 select-none rounded-none">
                      {item.category?.toUpperCase() || "JOB ALERT"}
                    </span>
                    <Link 
                      to={`/post/${item.id}`}
                      className="block text-[11.5px] font-extrabold text-neutral-900 hover:text-amber-700 dark:text-zinc-100 dark:hover:text-amber-400 transition-colors cursor-pointer leading-snug break-words"
                    >
                      {item.title}
                    </Link>
                  </div>
                  <div className="mt-3.5 pt-2 border-t border-neutral-100 dark:border-zinc-900/60 flex justify-between items-center text-[10px] font-mono text-neutral-400 min-w-0">
                    <span className="truncate pr-2">{item.org}</span>
                    <span className="text-amber-653 hover:text-amber-752 dark:text-amber-400 text-[9.5px] font-bold shrink-0">View Spec Offline &gt;</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Main Boards */}
        {!store.searchKeyword && store.selectedCollection === 'all' && (
          <>
            <Sarkari8Boards 
              posts={posts}
              onSelectPost={(post) => {
                setStore({ currentView: 'detail', selectedPost: post });
                navigate(`/post/${post.id}`);
              }}
            />
            <HomeSections posts={posts} />
          </>
        )}

        {/* 3. Results Feed Section */}
        <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 gap-3 relative before:absolute before:bottom-[-1px] before:left-0 before:w-16 before:h-[2px] before:bg-blue-600">
               <h3 className="font-black text-xl uppercase tracking-tighter text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span className="bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black px-2.5 py-0.5 rounded-none italic shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-none bg-red-500 animate-pulse"></span>
                  LIVE
                </span>
              </h3>
              
              <div className="hidden sm:flex items-center bg-white dark:bg-neutral-900 border-2 border-gray-950 dark:border-zinc-700 rounded-none p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-none ${viewMode === 'grid' ? 'bg-neutral-100 dark:bg-neutral-800 text-blue-600' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-none ${viewMode === 'list' ? 'bg-neutral-100 dark:bg-neutral-800 text-blue-600' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {paginatedPosts.length > 0 ? (
              <div className={viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4'}>
                {paginatedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    viewMode={viewMode}
                    onClick={() => {
                      // Handled natively by target="_blank" Link component
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center bg-neutral-100 dark:bg-neutral-900/50 rounded-none border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                <Search className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
                <h3 className="font-black text-lg text-neutral-500 dark:text-neutral-400 uppercase">No Results Found</h3>
                <p className="text-neutral-400 text-xs">We couldn't find any results for that. Try searching for something else.</p>
              </div>
            )}

            {itemsToShow < filteredPosts.length && (
              <div className="flex justify-center pt-6 pb-8">
                {isLoadingMore ? (
                  <div className="flex items-center justify-center gap-2 text-neutral-500 border-none">
                    <span className="w-2 h-2 bg-blue-600 rounded-none animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-none animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-none animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                ) : (
                  <div className="h-4 border-t-2 border-dashed border-transparent w-full"></div>
                )}
              </div>
            )}
        </section>
      </main>
    </>
  );
}
