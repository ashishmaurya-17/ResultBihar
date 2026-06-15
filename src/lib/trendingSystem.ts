import { useState, useEffect } from 'react';
import { Post } from '../types';

export interface TrendingPost extends Post {
  currentTrendScore: number;
}

// Keep the master list of scored posts outside so it persists across re-renders
let masterScoredPosts: TrendingPost[] = [];

export function useTrendingSystem(initialPosts: Post[], maxPosts: number = 7) {
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);

  useEffect(() => {
    if (!initialPosts || initialPosts.length === 0) return;

    if (masterScoredPosts.length === 0) {
      masterScoredPosts = initialPosts.map(post => {
        // Use real view count if available in frontmatter, else stable hash based on ID
        const realCount = post.attributes?.views || post.attributes?.viewCount;
        let baseScore = 0;
        if (realCount && !isNaN(Number(realCount))) {
           baseScore = Number(realCount);
        } else {
           const pseudoRandom = Array.from(post.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
           // Base views: 1000 to 15000 view count roughly
           baseScore = 1500 + (pseudoRandom % 13500);
        }
        return { ...post, currentTrendScore: baseScore };
      });
    }

    const sortAndSet = () => {
      masterScoredPosts.sort((a, b) => b.currentTrendScore - a.currentTrendScore);
      setTrendingPosts([...masterScoredPosts.slice(0, maxPosts)]);
    };

    // Initial render
    sortAndSet();

  }, [initialPosts, maxPosts]);

  // Expose a method to manually boost a post (e.g. if the user clicks it)
  const boostPost = (postId: string) => {
    masterScoredPosts = masterScoredPosts.map(p => {
      if (p.id === postId) {
        return { ...p, currentTrendScore: p.currentTrendScore + 1 }; // Boost by 1
      }
      return p;
    });
    // Let the standard set cycle handle update if needed, but we decoupled real-time updates.
  };

  return { trendingPosts, boostPost };
}
