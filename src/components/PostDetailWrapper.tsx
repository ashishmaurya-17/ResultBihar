import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../types';
import SEO from './SEO';
import { PostSchemaProcessor } from '../lib/PostSchemaProcessor';
import { SarkariPostLayout, SiloGroup } from './SarkariPostLayout';

export default function PostDetailWrapper({ allPosts }: { allPosts: Post[] }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const post = useMemo(() => allPosts.find(p => p.id === slug), [allPosts, slug]);

    const sarkariPost = useMemo(() => {
        if (!post) return null;
        return PostSchemaProcessor.fromLegacyPost(post);
    }, [post]);

    const relatedPostsList = useMemo(() => {
        if (!post) return [];
        return allPosts
          .filter(
            (p) =>
              p.id !== post.id &&
              (p.collection === post.collection || p.state === post.state)
          )
          .slice(0, 5)
          .map(p => ({
            title: p.title,
            url: `/post/${p.id}`,
            id: p.id
          }));
      }, [post, allPosts]);

    const siloGroup = useMemo<SiloGroup | null>(() => {
        if (!post) return null;
        
        let siloName = "";
        let siloDescription = "";
        let filtered: Post[] = [];

        // 1. Priority: State-specific semantic links (e.g., Bihar Jobs / UP Jobs)
        if (post.state && post.state !== 'all') {
            const stateName = post.state;
            siloName = `${stateName} Recruitment & Notices SILO Hub`;
            siloDescription = `Directly interconnected active links for ${stateName} state recruitment notifications, online schedules, card releases, eligibility guidelines, and merit lists.`;
            filtered = allPosts.filter(p => p.id !== post.id && p.state === post.state);
        } 
        // 2. Organization-specific semantic links
        else if (post.organization) {
            const org = post.organization;
            siloName = `${org} Official Notice SILO Hub`;
            siloDescription = `Directly interconnected group of alerts, solutions sheets, admit cards, and results releases published officially under ${org}.`;
            filtered = allPosts.filter(p => p.id !== post.id && p.organization === post.organization);
        }
        // 3. Category/Collection-specific semantic links (e.g., admissions, results)
        else {
            const catName = post.collection || 'jobs';
            const prettyCat = catName.charAt(0).toUpperCase() + catName.slice(1).replace('-', ' ');
            siloName = `${prettyCat} Category SILO Hub`;
            siloDescription = `Deep interlinked group for other active ${prettyCat} announcements, dates tables, registration steps, and state board sheets.`;
            filtered = allPosts.filter(p => p.id !== post.id && p.collection === post.collection);
        }

        // Limit to top 8 highly relevant internal posts to construct excellent spider crawling nodes
        const siloPosts = filtered.slice(0, 8).map(p => ({
            title: p.title,
            url: `/post/${p.id}`,
            id: p.id,
            categoryName: p.collection ? p.collection.toUpperCase().replace('-', ' ') : 'ALERT'
        }));

        return {
            name: siloName,
            description: siloDescription,
            posts: siloPosts
        };
    }, [post, allPosts]);
    
    if (!slug) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-xl mx-auto font-sans">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 border border-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase">Invalid Post URL</h2>
                <p className="mt-2 text-neutral-500 text-sm">Please provide a valid government job post identifier.</p>
                <button onClick={() => navigate('/')} className="mt-6 px-5 py-2 bg-red-800 text-white font-bold tracking-tight text-xs uppercase cursor-pointer border border-gray-950">
                    Go Back to Portal Home
                </button>
            </div>
        );
    }

    if (!post || !sarkariPost) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-xl mx-auto font-sans">
                <div className="w-12 h-12 bg-red-100 text-rose-600 rounded-full flex items-center justify-center mb-4 border border-red-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-black text-neutral-800 tracking-tight uppercase">Alert Bulletin Not Found</h2>
                <p className="mt-2 text-neutral-500 text-sm leading-relaxed">
                    The requested job alert, answer key, or result update key <code className="bg-neutral-200 text-rose-600 px-1.5 py-0.5 rounded font-mono text-xs">{slug}</code> is either incorrect or is currently restricted.
                </p>
                <button onClick={() => navigate('/')} className="mt-6 px-5 py-2 bg-red-800 text-white font-bold tracking-tight text-xs uppercase cursor-pointer border border-gray-950">
                    Browse All Sarkari Jobs
                </button>
            </div>
        );
    }

    return (
        <>
            <SEO 
                sarkariPost={sarkariPost}
                url={`https://sarkariboard.com/post/${post.id}`}
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": sarkariPost.a1_postName,
                    "description": sarkariPost.a3_seoDescription,
                    "author": {
                        "@type": "Organization",
                        "name": "SarkariBoard"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "SarkariBoard",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://sarkariboard.com/logo.png"
                        }
                    }
                }}
            />
            <SarkariPostLayout
                post={sarkariPost}
                relatedPosts={relatedPostsList}
                siloGroup={siloGroup}
                onBack={() => navigate('/')}
            />
        </>
    );
}

