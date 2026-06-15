import React from 'react';

export default function StructuredData() {
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
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
