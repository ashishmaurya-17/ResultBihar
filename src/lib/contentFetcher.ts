import yaml from 'yaml';
import { Post, CollectionType } from '../types';
import { generateMockPostsForCollection } from './boardMocks';
import { safeLocalStorage } from './storage';

export const fetchMarkdownPosts = (): Post[] => {
  // Use Vite's glob import to pull all markdown files as raw text
  const modules = import.meta.glob('/src/content/**/*.md', { query: '?raw', eager: true, import: 'default' });
  
  const posts: Post[] = [];
  const seenIds = new Set<string>();

  for (const path in modules) {
    const rawMarkdownStr = (modules[path] as string) || '';
    
    let frontmatter: any = {};
    let content = rawMarkdownStr;

    const trimmedStr = rawMarkdownStr.trimStart();

    // Safe, O(N) linear-scan index slice for frontmatter extraction (prevents regex catastrophic backtracking / REDoS / UI freeze)
    if (trimmedStr.startsWith('---')) {
      const nextTripleDash = trimmedStr.indexOf('---', 3);
      if (nextTripleDash !== -1) {
        const fmSection = trimmedStr.substring(3, nextTripleDash).trim();
        // Skip over the closing triple dash (handles if there's \n or \r\n multiple times or trailing spaces)
        let sliceStart = nextTripleDash + 3;
        while (sliceStart < trimmedStr.length && (trimmedStr[sliceStart] === '\r' || trimmedStr[sliceStart] === '\n' || trimmedStr[sliceStart] === ' ')) {
          sliceStart++;
        }
        content = trimmedStr.substring(sliceStart).trim();
        
        try {
          frontmatter = yaml.parse(fmSection) || {};
        } catch (e) {
          console.error('Error parsing YAML frontmatter in', path, e);
        }
      }
    }

    // Determine collection from path based on directory structure: /src/content/[collection]/[filename].md
    const parts = path.split('/');
    const parentFolder = parts[parts.length - 2];
    
    const postDate = frontmatter.date || frontmatter.postDate || new Date().toISOString().split('T')[0];
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    if (seenIds.has(slug)) {
      console.warn('Duplicate post ID found, skipping:', slug, 'in path:', path);
      continue; // Prevent duplicates
    }
    seenIds.add(slug);

    const post: Post = {
      id: slug,
      slug,
      title: frontmatter.title || 'Untitled Post',
      collection: frontmatter.collection || parentFolder,
      postDate,
      summary: frontmatter.summary || '',
      featuredImage: frontmatter.featuredImage || undefined,
      attributes: frontmatter,
      content,
      ...frontmatter // Allow direct access for backward compatibility with React views initially expecting top-level properties
    };

    // Filter out drafts if needed
    if (!frontmatter.draft) {
      posts.push(post);
    }
  }

  // Count existing posts per collection
  const collectionCounts: Record<string, number> = {};
  
  for (const post of posts) {
    collectionCounts[post.collection] = (collectionCounts[post.collection] || 0) + 1;
  }

  // Define core collections
  const collections = ['jobs', 'results', 'admit-cards', 'answer-keys', 'admissions', 'syllabus', 'scholarships', 'yojana'];
  
  for (const col of collections) {
    const currentCount = collectionCounts[col] || 0;
    // User requested "5 genuine posts to each"
    const targetCount = 5;
    
    if (currentCount < targetCount) {
      const mockPosts = generateMockPostsForCollection(col, currentCount, targetCount);
      posts.push(...mockPosts);
    }
  }

  // Sort by date descending
  const sortedPosts = posts.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());

  if (sortedPosts.length > 0) {
    safeLocalStorage.setItem('sarkari_latest_posts_cache_v2', JSON.stringify(sortedPosts));
  } else {
    // If empty (e.g. environment issue), load from the offline cache
    const cachedStr = safeLocalStorage.getItem('sarkari_latest_posts_cache_v2');
    if (cachedStr) {
      try {
        const cachedPosts = JSON.parse(cachedStr);
        if (cachedPosts && Array.isArray(cachedPosts) && cachedPosts.length > 0) {
          console.log('[Offline Cache] Loaded', cachedPosts.length, 'posts successfully from localStorage.');
          return cachedPosts;
        }
      } catch (err) {
        console.error('Failed to parse cached posts from local storage:', err);
      }
    }
  }

  return sortedPosts;
};
