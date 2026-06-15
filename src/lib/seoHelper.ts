import metadata from '../../metadata.json';

const collectionImages: Record<string, string> = {
  'jobs': 'https://sarkariboard.com/og-jobs.png',
  'admissions': 'https://sarkariboard.com/og-admissions.png',
  'results': 'https://sarkariboard.com/og-results.png',
  'admit-cards': 'https://sarkariboard.com/og-admit.png',
  'scholarships': 'https://sarkariboard.com/og-scholarships.png'
};

export const getBaseSEO = (title?: string, description?: string, url?: string, collection?: string) => {
  const currentYear = new Date()?.getFullYear() || 2026;
  
  // Use the provided URL if available, otherwise construct from production domain + current path
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalUrl = url || `https://sarkariboard.com${path}`;

  return {
    title: title ? `${title} | ${metadata.name} ${currentYear}` : `${metadata.name} | Sarkari Result & Government Jobs Portal`,
    description: description || `Get the latest Sarkari Result, Admit Cards, and Government Jobs updates in India for ${currentYear}. Providing the fastest and most accurate notifications for competitive exams.`,
    url: canonicalUrl,
  };
};

export const getDynamicImage = (image?: string, collection?: string, title?: string, url?: string) => {
  const defaultImage = 'https://sarkariboard.com/logo-social.png'; 
  
  if (image) return image;
  if (collection && collectionImages[collection]) return collectionImages[collection];
  
  // Try to find if url or title hints at a collection
  const normalizedCollection = collection?.toLowerCase() || '';
  const normalizedUrl = (url || '').toLowerCase();
  const normalizedTitle = (title || '').toLowerCase();

  for (const [col, colImg] of Object.entries(collectionImages)) {
    if (
      normalizedCollection.includes(col) || 
      normalizedUrl.includes(col) || 
      normalizedTitle.includes(col)
    ) {
      return colImg;
    }
  }
  
  return defaultImage;
};

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": metadata.name,
  "url": "https://sarkariboard.com",
  "logo": "https://sarkariboard.com/logo.png",
  "sameAs": [
    "https://twitter.com/sarkariboard",
    "https://facebook.com/sarkariboard"
  ]
});

export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://sarkariboard.com/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://sarkariboard.com/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});
