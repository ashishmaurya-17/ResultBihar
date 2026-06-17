import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function StructuredData() {
  const location = useLocation();

  const generateBreadcrumbList = () => {
    const paths = location.pathname.split('/').filter(p => p !== '');
    const baseUrl = 'https://sarkariboard.com';

    const itemListElement: any[] = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/`
      }
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      itemListElement.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
        "item": `${baseUrl}${currentPath}`
      });
    });

    return {
      "@type": "BreadcrumbList",
      "@id": `${baseUrl}${location.pathname}#breadcrumb`,
      "itemListElement": itemListElement
    };
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://sarkariboard.com/#organization",
        "name": "SarkariBoard",
        "url": "https://sarkariboard.com",
        "description": "An elegant, master-planned portal hub for latest govt jobs, exam results, admit cards, answer keys, scholarships, and yojanas."
      },
      {
        "@type": "WebSite",
        "@id": "https://sarkariboard.com/#website",
        "url": "https://sarkariboard.com/",
        "name": "SarkariBoard",
        "publisher": { "@id": "https://sarkariboard.com/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://sarkariboard.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      generateBreadcrumbList()
    ]
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Generated Structured Data (JSON-LD):', schema);
    }
  }, [location.pathname]);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
