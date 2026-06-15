import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void; url?: string }[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url ? (item.url.startsWith('http') ? item.url : `https://sarkariboard.com${item.url}`) : `https://sarkariboard.com`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <nav className="flex items-center gap-2 text-xs text-neutral-500 font-medium font-mono mb-4" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3 h-3 text-neutral-400" />}
            {item.url ? (
              <Link to={item.url} onClick={item.onClick} className="hover:text-blue-700 transition capitalize cursor-pointer">
                {item.label}
              </Link>
            ) : item.onClick ? (
              <button onClick={item.onClick} className="hover:text-blue-700 transition capitalize cursor-pointer">
                {item.label}
              </button>
            ) : (
              <span className="text-neutral-800 font-semibold capitalize">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumbs;
