import React from 'react';
import { Helmet } from 'react-helmet-async';
import metadata from '../../metadata.json';
import { getBaseSEO, generateOrganizationSchema, generateWebSiteSchema, getDynamicImage } from '../lib/seoHelper';
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

  // Breadcrumb Schema
  let breadcrumbSchema = null;
  if (breadcrumbItems && breadcrumbItems.length > 0) {
    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.url ? (item.url.startsWith('http') ? item.url : `https://sarkariboard.com${item.url}`) : undefined
      }))
    };
  }

  // Compile JSON LD schemas
  const schemasToRender: any[] = [generateOrganizationSchema(), generateWebSiteSchema()];
  if (breadcrumbSchema) {
    schemasToRender.push(breadcrumbSchema);
  }
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemasToRender.push(...jsonLd);
    } else {
      schemasToRender.push(jsonLd);
    }
  }

  const isProduction = typeof window !== 'undefined' ? window.location.hostname === 'sarkariboard.com' : true;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      {!isProduction && <meta name="robots" content="noindex, nofollow" />}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />
      <link rel="alternate" hrefLang="en" href={seoUrl} />

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
