import React, { useMemo, useState, useEffect, useRef, createContext, useContext, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, HelpCircle, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import SEO from './components/SEO';
import ScrollProgressBar from './components/ScrollProgressBar';
import MainPortal from './components/MainPortal';
import PostDetailWrapper from './components/PostDetailWrapper';
import Breadcrumbs from './components/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { usePortalStore } from './store';
import { fetchMarkdownPosts } from './lib/contentFetcher';
import { safeLocalStorage } from './lib/storage';
import SarkariSaathi from './components/SarkariSaathi';
import StructuredData from './components/StructuredData';

const StaticPages = lazy(() => import('./components/StaticPages'));
const ContactPortal = lazy(() => import('./components/ContactPortal'));
const StateHubPage = lazy(() => import('./components/StateHubPage'));
const FAQs = lazy(() => import('./components/FAQs'));
const IndexingDashboard = lazy(() => import('./components/IndexingDashboard'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-64 text-neutral-500 dark:text-neutral-400 font-sans">
    Loading...
  </div>
);


import { CATEGORY_MAP } from './lib/constants';

type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
export const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const { t } = useTranslation();
  const [store, setStore] = usePortalStore();
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [lastState, setLastState] = useState<'online' | 'offline' | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastState('online');
      setShowStatusToast(true);
      const timer = setTimeout(() => {
        setShowStatusToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastState('offline');
      setShowStatusToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // If initially offline, show status toast matching
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setLastState('offline');
      setShowStatusToast(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = safeLocalStorage.getItem('sarkari-theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    safeLocalStorage.setItem('sarkari-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update Back to Top visibility
      setShowBackToTop(currentScrollY > 400);

      // Scroll direction check for Header
      if (currentScrollY < 120) {
        setIsHeaderVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollYRef.current;
      if (Math.abs(diff) > 8) {
        if (diff > 0) {
          // Scrolling down -> hide header
          setIsHeaderVisible(false);
        } else {
          // Scrolling up -> show header
          setIsHeaderVisible(true);
        }
        lastScrollYRef.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once initially to capture initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allPosts = useMemo(() => fetchMarkdownPosts(), []);

  // Sync route with store (basic sync for existing UI logic)
  useEffect(() => {
    let view = 'home';
    if (location.pathname.startsWith('/post/')) {
        view = 'detail';
    } else if (location.pathname === '/contact') {
        view = 'contact';
    } else if (location.pathname === '/faqs') {
        view = 'faqs';
    } else if (['/about', '/disclaimer', '/privacy', '/terms'].includes(location.pathname)) {
        view = location.pathname.substring(1);
    }
    
    // Parse URL params for filters
    const searchParams = new URLSearchParams(location.search);
    const updates: any = { currentView: view };
    
    if (view === 'home') {
      const qState = searchParams.get('state');
      const qSector = searchParams.get('sector');
      const qCategory = searchParams.get('category');
      
      if (qState) {
        // Convert to title case just in case
        const titleCaseState = qState.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        updates.selectedState = titleCaseState;
      }
      if (qSector) {
        const titleCaseSector = qSector.charAt(0).toUpperCase() + qSector.slice(1).toLowerCase();
        updates.selectedSector = qSector === 'ssc' ? 'SSC' : (qSector === 'upsc' ? 'UPSC' : (qSector === 'psc' ? 'PSC' : (qSector === 'psu' ? 'PSU' : titleCaseSector)));
      }
      if (qCategory) updates.selectedCollection = qCategory;
    }
    
    setStore(updates);
  }, [location, setStore]);

  const handleSetCurrentView = (view: string) => {
    // Map view to route
    if (view === 'home') navigate('/');
    else if (view === 'detail') {} // Should be navigated to via links
    else navigate(`/${view}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSetSelectedCollection = (col: string) => {
    setStore({ selectedCollection: col, currentView: 'home' });
    navigate('/');
  };

  const breadcrumbItems = useMemo(() => {
    const pathname = location.pathname;
    const items: { label: string; onClick?: () => void; url?: string }[] = [
      { 
        label: 'Home',
        url: '/',
        onClick: () => { 
          setStore({ selectedCollection: 'all', selectedState: 'all', searchKeyword: '', currentView: 'home' }); 
        } 
      }
    ];

    if (pathname === '/') {
      if (store.selectedState && store.selectedState !== 'all') {
        const queryParams = new URLSearchParams({ state: store.selectedState });
        items.push({
          label: store.selectedState,
          url: `/?${queryParams.toString()}`,
          onClick: () => {
            setStore({ selectedState: store.selectedState, selectedCollection: 'all', searchKeyword: '', currentView: 'home' });
          }
        });
      }
      if (store.selectedCollection && store.selectedCollection !== 'all') {
        const catLabel = CATEGORY_MAP[store.selectedCollection] || store.selectedCollection;
        const queryParams = new URLSearchParams({ category: store.selectedCollection });
        items.push({
          label: catLabel,
          url: `/?${queryParams.toString()}`,
          onClick: () => {
            setStore({ selectedCollection: store.selectedCollection, selectedState: store.selectedState || 'all', searchKeyword: '', currentView: 'home' });
          }
        });
      }
    } else if (pathname.startsWith('/post/')) {
      const slug = pathname.substring(6);
      const post = allPosts.find(p => p.id === slug);
      if (post) {
        if (post.state && post.state !== 'all' && post.state !== 'Central') {
          const queryParams = new URLSearchParams({ state: post.state });
          items.push({
            label: post.state,
            url: `/?${queryParams.toString()}`,
            onClick: () => {
              setStore({ selectedState: post.state, selectedCollection: 'all', searchKeyword: '', currentView: 'home' });
            }
          });
        }
        if (post.collection) {
          const catLabel = CATEGORY_MAP[post.collection] || post.collection;
          const queryParams = new URLSearchParams({ category: post.collection });
          items.push({
            label: catLabel,
            url: `/?${queryParams.toString()}`,
            onClick: () => {
              setStore({ selectedCollection: post.collection, selectedState: 'all', searchKeyword: '', currentView: 'home' });
            }
          });
        }
        items.push({ label: post.title, url: `/post/${slug}` });
      } else {
        items.push({ label: 'Alert Bulletins' });
      }
    } else if (pathname === '/contact') {
      items.push({ label: 'Contact Portal', url: '/contact' });
    } else if (pathname === '/faqs') {
      items.push({ label: 'Frequently Asked Questions', url: '/faqs' });
    } else if (['/about', '/disclaimer', '/privacy', '/terms'].includes(pathname)) {
      const pageName = pathname.substring(1);
      const label = pageName.charAt(0).toUpperCase() + pageName.slice(1);
      items.push({ label, url: pathname });
    } else {
      const statePath = pathname.substring(1);
      if (statePath) {
        const decoded = decodeURIComponent(statePath).replace(/-jobs$/, '');
        const stateLabel = decoded.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        items.push({ label: stateLabel, url: pathname });
      }
    }
    return items;
  }, [location.pathname, store.selectedCollection, store.selectedState, allPosts, navigate, setStore]);

  const { seoTitle, seoDescription } = useMemo(() => {
    let title = undefined;
    let description = undefined;
    const path = location.pathname;

    if (path === '/about') {
      title = 'About Us';
      description = 'Learn about SarkariBoard, our mission, and how we provide accurate and timely information on government jobs and exam results across India.';
    } else if (path === '/contact') {
      title = 'Contact Us';
      description = 'Get in touch with SarkariBoard for queries, feedback, or support regarding government job notifications and exam updates.';
    } else if (path === '/faqs') {
      title = 'Frequently Asked Questions';
      description = 'Find answers to common queries regarding Sarkari job alerts, application processes, admit cards, and results on our portal.';
    } else if (path === '/disclaimer') {
      title = 'Disclaimer';
      description = 'Read the disclaimer for SarkariBoard. We are a private informational portal and not affiliated with any official government organization.';
    } else if (path === '/privacy') {
      title = 'Privacy Policy';
      description = 'Understand how SarkariBoard collects, uses, and protects your personal information while you browse our job and result platform.';
    } else if (path === '/terms') {
      title = 'Terms of Service';
      description = 'Review the terms and conditions for using the SarkariBoard platform to access timely job opportunities, results, and notifications.';
    } else if (path.startsWith('/post/')) {
      // The post detail wrapper will handle its own SEO overrides.
    } else if (path === '/') {
      const searchParams = new URLSearchParams(location.search);
      const state = searchParams.get('state');
      const category = searchParams.get('category');
      
      if (state && state !== 'all') {
        const titleCaseState = state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        title = `${titleCaseState} Sarkari Jobs & Results`;
        description = `Find the latest Sarkari Result, Admit Cards, and Government Job updates for ${titleCaseState}. Get the fastest notifications tailored to your state.`;
      } else if (category && category !== 'all') {
        const catLabel = CATEGORY_MAP[category] || category;
        const titleCaseCat = catLabel.charAt(0).toUpperCase() + catLabel.slice(1);
        title = `Latest ${titleCaseCat} Updates`;
        description = `Find the latest Sarkari Result updates for ${titleCaseCat}. Stay informed on all recent government notifications and public exam schedules.`;
      }
    } else if (path !== '/') {
      const decoded = decodeURIComponent(path.substring(1)).replace(/-jobs$/, '');
      const stateLabel = decoded.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      title = `${stateLabel} Government Jobs`;
      description = `Find the most recent ${stateLabel} government jobs, admit cards, exam circulars, and the latest public employment news for ${stateLabel}.`;
    }

    return { seoTitle: title, seoDescription: description };
  }, [location.pathname, location.search]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StructuredData />
      <div 
        className="min-h-screen flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white pb-[60px] relative bg-[#f4f6fa] dark:bg-zinc-950 text-neutral-900 dark:text-zinc-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
        }}
      >
        {/* Subtle ambient light effects */}
        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none -z-10 bg-gradient-to-b from-blue-200/30 dark:from-blue-950/20 to-transparent opacity-80 blur-3xl" />
        
        <SEO breadcrumbItems={breadcrumbItems} title={seoTitle} description={seoDescription} />
        <ScrollProgressBar />
        
        <div className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
          <Header
            currentView={store.currentView}
            setCurrentView={handleSetCurrentView}
            selectedCollection={store.selectedCollection}
            setSelectedCollection={handleSetSelectedCollection}
            searchKeyword={store.searchKeyword}
            setSearchKeyword={(kw) => setStore({ searchKeyword: kw })}
            posts={allPosts}
            onSelectPost={(post) => {
              navigate(`/post/${post.id}`);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        </div>

        {location.pathname === '/' && (
          <div className="breaking-news-banner bg-red-805 bg-red-800 text-white py-1.5 sm:py-2 font-mono text-xs overflow-hidden border-b border-red-950 font-bold tracking-wide z-10 flex select-none shrink-0">
            <div className="shrink-0 bg-red-950 px-3 py-0.5 sm:py-1 flex items-center font-sans font-black text-[9px] sm:text-[10px] uppercase text-white border-r border-red-900 z-20 shadow-[2px_0_4px_rgba(0,0,0,0.5)]">
              ⚡ {t('common.breaking')}<span className="hidden sm:inline"> {t('common.news')}</span>
            </div>
            <div className="relative flex-grow overflow-hidden flex items-center bg-red-800">
              <div className="animate-marquee whitespace-nowrap flex gap-12 items-center text-[11px] sm:text-xs">
                {allPosts.slice(0, 4).map((post, idx) => (
                  <React.Fragment key={`marquee-1-${idx}`}>
                    <span 
                      onClick={() => {
                        navigate(`/post/${post.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="cursor-pointer hover:underline"
                    >
                      {post.isNew && <span className="text-yellow-300 mr-2 border border-yellow-300/30 px-1 py-0.5 rounded text-[9px] animate-pulse">NEW</span>}
                      {post.urgent && <span className="text-red-200 mr-2 border border-red-200/30 px-1 py-0.5 rounded text-[9px] animate-pulse">URGENT</span>}
                      {post.title}
                    </span>
                    <span>•</span>
                  </React.Fragment>
                ))}
                {allPosts.slice(0, 4).map((post, idx) => (
                  <React.Fragment key={`marquee-2-${idx}`}>
                    <span 
                      onClick={() => {
                        navigate(`/post/${post.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }} 
                      className="cursor-pointer hover:underline"
                    >
                      {post.isNew && <span className="text-yellow-300 mr-2 border border-yellow-300/30 px-1 py-0.5 rounded text-[9px] animate-pulse">NEW</span>}
                      {post.urgent && <span className="text-red-200 mr-2 border border-red-200/30 px-1 py-0.5 rounded text-[9px] animate-pulse">URGENT</span>}
                      {post.title}
                    </span>
                    <span>•</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full px-4 pt-4 pb-2 sm:pb-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="grow relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full flex flex-col"
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainPortal initialPosts={allPosts} />} />
                <Route path="/post/:slug" element={
                  <main className="max-w-[1580px] mx-auto px-1.5 xs:px-2 md:px-6 py-4 md:py-6 grow w-full">
                    <PostDetailWrapper allPosts={allPosts} />
                  </main>
                } />
                <Route path="/contact" element={<main className="max-w-7xl mx-auto px-4 py-8 grow w-full"><Suspense fallback={<LoadingFallback />}><ContactPortal /></Suspense></main>} />
                <Route path="/indexing" element={<main className="max-w-7xl mx-auto px-4 py-8 grow w-full"><Suspense fallback={<LoadingFallback />}><IndexingDashboard /></Suspense></main>} />
                <Route path="/:state" element={<Suspense fallback={<LoadingFallback />}><StateHubPage /></Suspense>} />
                <Route path="/faqs" element={<Suspense fallback={<LoadingFallback />}><FAQs onBackToHome={() => navigate('/')} /></Suspense>} />
                <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><StaticPages view="about" onBackToHome={() => navigate('/')} /></Suspense>} />
                <Route path="/editorial-methodology" element={<Suspense fallback={<LoadingFallback />}><StaticPages view="editorial-methodology" onBackToHome={() => navigate('/')} /></Suspense>} />
                <Route path="/disclaimer" element={<Suspense fallback={<LoadingFallback />}><StaticPages view="disclaimer" onBackToHome={() => navigate('/')} /></Suspense>} />
                <Route path="/privacy" element={<Suspense fallback={<LoadingFallback />}><StaticPages view="privacy" onBackToHome={() => navigate('/')} /></Suspense>} />
                <Route path="/terms" element={<Suspense fallback={<LoadingFallback />}><StaticPages view="terms" onBackToHome={() => navigate('/')} /></Suspense>} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>

        <Footer
          currentView={store.currentView}
          setCurrentView={handleSetCurrentView}
        />

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-[150px] right-4 md:bottom-24 md:right-8 bg-red-600 hover:bg-black text-white p-3 rounded-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-40 border-2 border-black transition-all duration-300 active:translate-y-0.5 flex items-center justify-center cursor-pointer group ${
            showBackToTop 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <SarkariSaathi />

        {/* Connection Status Toast */}
        <AnimatePresence>
          {showStatusToast && lastState && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed bottom-[74px] md:bottom-8 left-4 md:left-8 z-[10001] max-w-sm w-[calc(100vw-32px)] xs:w-80 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] p-3 flex items-start gap-3 select-none"
            >
              {/* Indicator bullet and icon container */}
              <div className={`p-1.5 border border-black ${!isOnline ? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'} shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
                {!isOnline ? <WifiOff size={16} /> : <Wifi size={16} />}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 border border-black ${!isOnline ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                    {!isOnline ? 'OFFLINE / ऑफलाइन' : 'CONNECTED / ऑनलाइन'}
                  </span>
                  
                  <button 
                    onClick={() => setShowStatusToast(false)}
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 text-xs font-bold leading-none cursor-pointer p-0.5"
                  >
                    ×
                  </button>
                </div>
                
                <h4 className="font-extrabold text-xs text-gray-950 dark:text-zinc-50 mt-1.5 leading-tight">
                  {!isOnline ? 'Network Connection Lost' : 'Network Connection Restored'}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1 leading-normal font-medium">
                  {!isOnline 
                    ? 'Working offline. You can still view loaded updates.' 
                    : 'Your system is back online. Content is fully synchronized.'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Navigation Bar */}
        <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t border-gray-300 dark:border-zinc-800 flex justify-around items-center z-[9999] shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
          <button 
            onClick={() => {
              navigate('/');
              window.scrollTo(0,0);
              setStore({ selectedCollection: 'all', currentFilter: 'all', currentView: 'home' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${store.currentView === 'home' && store.selectedCollection !== 'results' ? 'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border-r border-gray-200 dark:border-zinc-800'}`}
          >
            <Home size={22} className={store.currentView === 'home' && store.selectedCollection !== 'results' ? "fill-blue-100 dark:fill-blue-900" : ""} strokeWidth={store.currentView === 'home' && store.selectedCollection !== 'results' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Home</span>
          </button>
          
          <button 
            onClick={() => {
              navigate('/');
              window.scrollTo(0,0);
              setStore({ selectedCollection: 'results', currentFilter: 'all', currentView: 'home' });
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${store.selectedCollection === 'results' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border-r border-gray-200 dark:border-zinc-800'}`}
          >
            <FileText size={22} className={store.selectedCollection === 'results' ? "fill-emerald-100 dark:fill-emerald-900" : ""} strokeWidth={store.selectedCollection === 'results' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Results</span>
          </button>

          <button 
            onClick={() => {
              navigate('/faqs');
              window.scrollTo(0,0);
            }}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors ${location.pathname === '/faqs' ? 'text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
          >
            <HelpCircle size={22} className={location.pathname === '/faqs' ? "fill-amber-100 dark:fill-amber-900" : ""} strokeWidth={location.pathname === '/faqs' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">FAQ / Help</span>
          </button>
        </nav>
      </div>
    </ThemeContext.Provider>
  );
}
