import React from 'react';
import { Helmet } from 'react-helmet-async';
import metadata from '../../metadata.json';
import { getBaseSEO, getDynamicImage } from '../lib/seoHelper';
import { SarkariPost } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  collection?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  breadcrumbItems?: { label: string; url?: string }[];
  sarkariPost?: SarkariPost;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  image,
  type = 'website',
  collection,
  jsonLd,
  breadcrumbItems,
  sarkariPost
}) => {
  const finalTitle = title || sarkariPost?.a1_postName;
  const finalDescription = description || sarkariPost?.a3_seoDescription;
  const finalCollection = collection || (sarkariPost ? sarkariPost.category.toLowerCase().replace(' ', '-') : undefined);
  
  const { title: seoTitle, description: seoDescription, url: seoUrl } = getBaseSEO(finalTitle, finalDescription, url, finalCollection);
  const seoImage = getDynamicImage(image, finalCollection, finalTitle, seoUrl);

  // Compile JSON LD schemas
  const schemasToRender: any[] = [];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemasToRender.push(...jsonLd);
    } else {
      schemasToRender.push(jsonLd);
    }
  }

  const isProduction = typeof window !== 'undefined' ? window.location.hostname === 'sarkariboard.com' : true;

  // Helper to append/set the language query parameter for alternates
  const getLocalizedUrl = (urlStr: string, lang: string): string => {
    try {
      const parsed = new URL(urlStr);
      parsed.searchParams.set('lng', lang);
      return parsed.toString();
    } catch (err) {
      const baseUrl = urlStr.split('?')[0];
      const params = new URLSearchParams(urlStr.split('?')[1] || '');
      params.set('lng', lang);
      return `${baseUrl}?${params.toString()}`;
    }
  };

  const englishUrl = getLocalizedUrl(seoUrl, 'en');
  const hindiUrl = getLocalizedUrl(seoUrl, 'hi');

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      {!isProduction && <meta name="robots" content="noindex, nofollow" />}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />
      <link rel="alternate" hrefLang="en" href={englishUrl} />
      <link rel="alternate" hrefLang="hi" href={hindiUrl} />
      <link rel="alternate" hrefLang="x-default" href={seoUrl} />

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:site_name" content={metadata.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={seoUrl} />

      {/* Twitter Cards Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sarkariboard" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemasToRender)}
      </script>
    </Helmet>
  );
};

export default SEO;
