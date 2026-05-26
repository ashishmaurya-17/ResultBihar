import React, { useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPortal from './components/MainPortal';
import ContactPortal from './components/ContactPortal';
import PostDetail from './components/PostDetail';
import StaticPages from './components/StaticPages';
import { usePortalStore } from './store';
import { INITIAL_POSTS } from './data';
import { CollectionType } from './types';

export default function App() {
  const [store, setStore] = usePortalStore();

  const handleSetCurrentView = (view: string) => {
    setStore({ currentView: view });
    // Scroll smoothly back to top on view changes to mirror natural page routing
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSetSelectedCollection = (col: string) => {
    setStore({ selectedCollection: col, currentView: 'home' });
  };

  const handleSetSearchKeyword = (kw: string) => {
    setStore({ searchKeyword: kw });
  };

  // Memoize similar/related posts for the detail page based on current selection
  const relatedPosts = useMemo(() => {
    if (!store.selectedPost) return [];
    return INITIAL_POSTS.filter(
      (p) =>
        p.id !== store.selectedPost?.id &&
        (p.collection === store.selectedPost?.collection || p.state === store.selectedPost?.state)
    );
  }, [store.selectedPost]);

  return (
    <div className="bg-neutral-50 min-h-screen flex flex-col justify-between font-sans selection:bg-red-700 selection:text-white">
      {/* 1. Portal Header */}
      <Header
        currentView={store.currentView}
        setCurrentView={handleSetCurrentView}
        selectedCollection={store.selectedCollection as CollectionType | 'all'}
        setSelectedCollection={handleSetSelectedCollection}
        onOpenAdmin={() => setStore({ adminOpen: true })}
        searchKeyword={store.searchKeyword}
        setSearchKeyword={handleSetSearchKeyword}
      />

      {/* 2. Dynamically Routed Client View Body */}
      <div className="grow">
        {store.currentView === 'home' && (
          <MainPortal initialPosts={INITIAL_POSTS} />
        )}

        {store.currentView === 'contact' && (
          <main className="max-w-7xl mx-auto px-4 py-8 grow w-full">
            <ContactPortal />
          </main>
        )}

        {store.currentView === 'detail' && store.selectedPost && (
          <main className="max-w-7xl mx-auto px-4 py-6 grow w-full">
            <PostDetail
              post={store.selectedPost}
              relatedPosts={relatedPosts}
              onBack={() => setStore({ currentView: 'home', selectedPost: null })}
              onSelectPost={(p) => {
                setStore({ currentView: 'detail', selectedPost: p });
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
            />
          </main>
        )}

        {['about', 'disclaimer', 'privacy', 'terms'].includes(store.currentView) && (
          <StaticPages
            view={store.currentView}
            onBackToHome={() => handleSetCurrentView('home')}
          />
        )}
      </div>

      {/* 3. Legal & Trust Footer Area */}
      <Footer
        currentView={store.currentView}
        setCurrentView={handleSetCurrentView}
      />
    </div>
  );
}
