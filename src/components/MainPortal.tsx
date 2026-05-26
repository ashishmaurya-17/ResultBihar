import React, { useState, useMemo } from 'react';
import { DISTRICTS_BIHAR, STATES_LIST } from '../data';
import { Post, CollectionType } from '../types';
import { usePortalStore } from '../store';
import HeroTicker from './HeroTicker';
import NoticeStrip from './NoticeStrip';
import CategoryGrid from './CategoryGrid';
import PostCard from './PostCard';
import AdminPortal from './AdminPortal';
import { 
  Building2, 
  MapPin, 
  Search, 
  HelpCircle, 
  Globe, 
  Sparkles, 
  Clock, 
  Rss, 
  ChevronRight, 
  Layers, 
  TrendingUp, 
  BellRing,
  Award
} from 'lucide-react';

interface MainPortalProps {
  initialPosts: Post[];
}

export default function MainPortal({ initialPosts }: MainPortalProps) {
  // Live dynamic mutable posts state
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  
  // Connect to the shared store for navigation & view state
  const [store, setStore] = usePortalStore();
  const selectedCollection = store.selectedCollection;
  const setSelectedCollection = (col: string) => setStore({ selectedCollection: col });
  const searchKeyword = store.searchKeyword;
  const setSearchKeyword = (keyword: string) => setStore({ searchKeyword: keyword });
  const adminOpen = store.adminOpen;
  const setAdminOpen = (open: boolean) => setStore({ adminOpen: open });
  
  // Selected filter criteria
  const [selectedState, setSelectedState] = useState<string>('all');

  // Filter posts based on collection + state + keyword search
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // 1. Skip drafts
      if (post.draft) return false;

      // 2. Collection filter
      if (selectedCollection !== 'all') {
        if (selectedCollection.startsWith('univ-')) {
          const univName = selectedCollection.replace('univ-', '').toLowerCase(); // e.g., "brabu", "lnmu", "vksu", "ppu", "pu", "mu"
          const matchesOrg = post.organization.toLowerCase() === univName;
          const matchesTags = post.tags.some(
            t => t.toLowerCase() === univName || 
                 (t.toLowerCase() === 'babu' && (univName === 'brabu' || univName === 'vksu')) ||
                 (t.toLowerCase() === 'lnu' && univName === 'lnmu')
          );
          const matchesTitle = post.title.toLowerCase().includes(univName) || 
                               (univName === 'brabu' && post.title.toLowerCase().includes('brabu')) ||
                               (univName === 'lnmu' && post.title.toLowerCase().includes('lnmu')) ||
                               (univName === 'vksu' && post.title.toLowerCase().includes('vksu'));
          if (!matchesOrg && !matchesTags && !matchesTitle) {
            return false;
          }
        } else if (post.collection !== selectedCollection) {
          return false;
        }
      }

      // 3. State filter
      if (selectedState !== 'all' && post.state.toLowerCase() !== selectedState.toLowerCase()) {
        return false;
      }

      // 4. Keyword search (looks at title, summary, organization, and tags)
      if (searchKeyword.trim() !== '') {
        const query = searchKeyword.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesSummary = post.summary.toLowerCase().includes(query);
        const matchesOrg = post.organization.toLowerCase().includes(query);
        const matchesTags = post.tags.some(t => t.toLowerCase().includes(query));
        return matchesTitle || matchesSummary || matchesOrg || matchesTags;
      }

      return true;
    });
  }, [posts, selectedCollection, selectedState, searchKeyword]);

  // Handle adding new posts via the CMS Admin Panel
  const handleAddPost = async (newPost: Post) => {
    try {
      setPosts(prev => [newPost, ...prev]);
      await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
    } catch (err) {
      console.error('Error saving post on server:', err);
    }
  };

  return (
    <>
      {/* 2. Top Notice Bar */}
      <NoticeStrip />

      {/* 3. Urgent Updates Hero Marquee Ticker */}
      <HeroTicker 
        posts={posts} 
        onSelectPost={(post) => {
          setStore({ currentView: 'detail', selectedPost: post });
        }}
      />

      {/* 4. Main Core Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 grow w-full">
        <div className="space-y-6">
          
          {/* Bento Categories Navigation */}
          <CategoryGrid 
            posts={posts}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            searchKeyword={searchKeyword}
          />

          {/* Middle hub with column boards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left Column: Post Listings Board (Mainly Jobs, results etc) */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Board header settings & State filters */}
              <div className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#D32F2F]"></div>
                  <span className="font-sans font-black text-xs sm:text-sm tracking-tight text-neutral-800 uppercase">
                    {selectedCollection === 'all' 
                      ? 'Unified Master Updates Board' 
                      : selectedCollection.startsWith('univ-')
                        ? `${selectedCollection.replace('univ-', '').toUpperCase()} University Feed`
                        : `${selectedCollection.replace('-', ' ')} Feed`
                    }
                  </span>
                </div>

                {/* Regional State filters targeting State Pages */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  <span className="font-mono text-[10px] text-neutral-400 font-extrabold uppercase shrink-0 mr-1.5 hidden sm:inline">Zone Filter:</span>
                  {[
                    { id: 'all', label: 'All Zones' },
                    { id: 'Bihar', label: 'Bihar Gate' },
                    { id: 'Uttar Pradesh', label: 'UP Gate' },
                    { id: 'Jharkhand', label: 'Jharkhand Gate' },
                    { id: 'All India', label: 'Central/All India' }
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedState(st.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedState.toLowerCase() === st.id.toLowerCase()
                          ? 'bg-red-50 text-[#D32F2F] border-red-200 border'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-time text search filter */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search news by exam authority, boards, key details (e.g. BPSC TRE, STET, BSEB Matric)..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-white text-neutral-800 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border border-neutral-200 focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] transition"
                  id="client-search-input"
                />
                {searchKeyword && (
                  <button 
                    onClick={() => setSearchKeyword('')} 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-neutral-400 hover:text-neutral-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Listings Grid of Posts */}
              {filteredPosts.length > 0 ? (
                <div className="space-y-3" id="posts-listing-container">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => {
                        setStore({ currentView: 'detail', selectedPost: post });
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border p-12 text-center space-y-3 shadow-xs">
                  <p className="text-neutral-400 text-sm font-mono uppercase">0 Bulletins Match Filter</p>
                  <h3 className="font-bold text-neutral-800 text-base">No active post records found</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    We couldn't locate updates matching "{searchKeyword}" in the selected region directory. Clear the filter above to reload our Bihar master portal listings.
                  </p>
                  <button 
                    onClick={() => { setSearchKeyword(''); setSelectedCollection('all'); setSelectedState('all'); }}
                    className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                  >
                    Reset Filter Feeds
                  </button>
                </div>
              )}

            </div>

            {/* Right Column: Portal Widget Sidebar Sections */}
            <div className="space-y-6">
              
              {/* Live RSS & Sitemap statistics indicator box */}
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-red-950 p-5 rounded-2xl shadow-md space-y-3" id="social-invitation-box">
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-red-950 animate-bounce" />
                  <h3 className="font-sans font-black text-sm tracking-tight uppercase">
                    SUBSCRIBE TO SARKARI RSS
                  </h3>
                </div>
                <p className="text-xs text-red-950 leading-relaxed font-medium">
                  Our servers generate stateless <strong className="font-mono">sitemap.xml</strong> and <strong className="font-mono">rss.xml</strong> indices corresponding exactly with the Bihar board. Bookmark this dashboard.
                </p>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => alert('Static RSS Feed Generated Successfully for all 8 collections! Ready to integrate.')}
                    className="bg-red-800 hover:bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                  >
                    <Rss className="w-3.5 h-3.5" />
                    <span>Get XML Feed</span>
                  </button>
                </div>
              </div>

              {/* Trending Search Topics list */}
              <div className="bg-white border rounded-2xl p-5 space-y-3.5 shadow-sm">
                <h3 className="font-sans font-black text-sm text-neutral-800 uppercase tracking-tight flex items-center gap-2 border-b pb-2">
                  <TrendingUp className="w-4 h-4 text-rose-600" />
                  <span>TRENDING IN BIHAR</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: 'BPSC TRE 4.0', val: 'TRE 4' },
                    { tag: 'Matric Result Link', val: 'Matric' },
                    { tag: 'Bihar Board 10th Toppers', val: 'Toppers' },
                    { tag: 'Police Constable Admit Card', val: 'Police' },
                    { tag: 'Kanya Utthan ₹50,000', val: 'Kanya Utthan' },
                    { tag: 'Post Matric SC Scholarship', val: 'Scholarship' },
                    { tag: 'Bihar B.Ed Counselling List', val: 'CET' }
                  ].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchKeyword(topic.val)}
                      className="bg-neutral-50 hover:bg-red-50 hover:text-red-700 border hover:border-red-200 transition text-[11px] font-semibold text-neutral-600 px-2.5 py-1 rounded-md"
                    >
                      #{topic.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* State/District-wise Fast Links */}
              <div className="bg-white border rounded-2xl p-5 space-y-3 shadow-sm">
                <h3 className="font-sans font-black text-sm text-neutral-800 uppercase tracking-tight flex items-center gap-2 border-b pb-2">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span>BIHAR DISTRICTS FILTER</span>
                </h3>
                <div className="max-h-56 overflow-y-auto space-y-1.5 scrollbar-thin">
                  {DISTRICTS_BIHAR.slice(0, 15).map((dist, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSearchKeyword(dist);
                      }}
                      className="w-full text-left text-xs font-semibold text-neutral-700 hover:text-red-700 hover:bg-neutral-50 px-2 py-1.5 rounded transition flex items-center justify-between"
                    >
                      <span>{dist} District Board</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-neutral-400 italic text-center pt-2 border-t font-mono">
                  Showing top-15 highly requested centers
                </p>
              </div>

              {/* Trust and E-E-A-T Badging badge */}
              <div className="bg-neutral-900 text-white rounded-2xl p-5 space-y-3.5 shadow-md">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="font-sans text-[11px] font-extrabold uppercase tracking-widest text-amber-400">
                    OFFICIAL COMPLIANCE
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Result Bihar ensures sitemap validity and strictly lists data derived directly from official gazettes and respective state ministries.
                </p>
                <button 
                  onClick={() => { setStore({ currentView: 'disclaimer' }) }}
                  className="text-[11px] font-mono font-bold text-rose-300 hover:underline"
                >
                  Read Public Terms & Disclaimers
                </button>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* 5. CMS/Contributor Portal Dialog Modal */}
      {adminOpen && (
        <AdminPortal
          onAddPost={handleAddPost}
          onClose={() => setAdminOpen(false)}
        />
      )}
    </>
  );
}
