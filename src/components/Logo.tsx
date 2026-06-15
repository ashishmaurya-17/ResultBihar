import React from 'react';
import { usePortalStore } from '../store';

interface LogoProps {
  className?: string; // Additional classes for the container
  iconSize?: number;  // Height/width of the icon in px (defaults to 40)
  variant?: 'horizontal' | 'vertical' | 'icon-only';
  textColorClass?: string; // Custom text color class (e.g. 'text-white' or 'text-[#0b2154]')
  isDarkBackground?: boolean; // Whether it is placed on a dark red/black background
}

export default function Logo({
  className = '',
  iconSize = 40,
  variant = 'horizontal',
  textColorClass = '',
  isDarkBackground = false,
}: LogoProps) {
  const [store] = usePortalStore();

  const logoFont = store.logoFont || 'Inter';
  const logoWeight1 = store.logoWeight1 || 'font-medium';
  const logoWeight2 = store.logoWeight2 || 'font-black';
  const logoLetterSpacing = store.logoLetterSpacing || 'tracking-tighter';
  const logoCase = store.logoCase || 'uppercase';
  const logoColorStyle = store.logoColorStyle || 'saffron-green';

  // SVG Logo Icon Component
  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
    >
      {/* 1. Deep Navy Shield (Outer Outline) */}
      <path
        d="M 32,25 C 38,21 44,19 50,19 C 56,19 62,21 68,25 L 68,48 C 68,66 50,79 50,79 C 50,79 32,66 32,48 Z"
        stroke={isDarkBackground ? '#bbccff' : '#0b2154'}
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* 2. Orange/Saffron Document (Middle Layer overlay) */}
      <path
        d="M 38,58 L 38,20 L 54,20 L 62,28 L 62,58 Z"
        fill="#ffffff"
        stroke="#e07a16"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* Folded paper corner representation */}
      <path
        d="M 54,20 L 54,28 L 62,28"
        fill="#ffffff"
        stroke="#e07a16"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* 3. Official Green Seal (Inner Document Circle) */}
      <circle
        cx="50"
        cy="42"
        r="8"
        fill="none"
        stroke="#106934"
        strokeWidth="2"
      />
      
      {/* Green Star inside Seal */}
      <path
        d="M50,36.2 L50.7,37.8 L52.4,37.8 L51.0,38.8 L51.5,40.5 L50,39.5 L48.5,40.5 L49.0,38.8 L47.6,37.8 L49.3,37.8 Z"
        fill="#106934"
      />
      
      {/* 4 horizontal bars representing lines in the official stamp */}
      <line x1="45" y1="42.1" x2="55" y2="42.1" stroke="#106934" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="44" y1="43.6" x2="56" y2="43.6" stroke="#106934" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="45" y1="45.1" x2="55" y2="45.1" stroke="#106934" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="47.5" y1="46.6" x2="52.5" y2="46.6" stroke="#106934" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );

  const resolvedTextColor = textColorClass
    ? textColorClass
    : isDarkBackground
    ? 'text-white'
    : 'text-[#0b2154]';

  if (variant === 'icon-only') {
    return <LogoIcon />;
  }

  // Resolve color classes for the logo spans dynamically
  const getWordColors = () => {
    switch (logoColorStyle) {
      case 'ochre':
        return {
          word1Class: 'text-[#e07a16]',
          word2Class: 'text-[#e07a16]',
        };
      case 'gold':
        return {
          word1Class: isDarkBackground ? 'text-amber-100' : 'text-amber-600',
          word2Class: 'text-amber-400 dark:text-amber-400 font-extrabold',
        };
      case 'monochrome':
        return {
          word1Class: resolvedTextColor,
          word2Class: resolvedTextColor,
        };
      case 'royal-white':
        return {
          word1Class: 'text-white',
          word2Class: 'text-amber-300',
        };
      case 'saffron-green':
      default:
        return {
          word1Class: resolvedTextColor,
          word2Class: 'text-[#e07a16] group-hover:text-[#106934] transition-colors duration-300',
        };
    }
  };

  const { word1Class, word2Class } = getWordColors();
  const caseClass = logoCase === 'uppercase' ? 'uppercase' : logoCase === 'capitalize' ? 'capitalize' : 'normal-case';

  // Apply letter spacing
  const spacingClass = 
    logoLetterSpacing === 'tracking-tighter' ? 'tracking-tighter' :
    logoLetterSpacing === 'tracking-tight' ? 'tracking-tight' :
    logoLetterSpacing === 'tracking-normal' ? 'tracking-normal' :
    logoLetterSpacing === 'tracking-wide' ? 'tracking-wide' :
    logoLetterSpacing === 'tracking-widest' ? 'tracking-widest' : 'tracking-tighter';

  // Generate CSS style for custom fonts
  const headingStyle = {
    fontFamily: `"${logoFont}", system-ui, sans-serif`,
  };

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center text-center gap-3 group ${className}`} id="brand-logo-vertical">
        <LogoIcon />
        <span 
          style={headingStyle}
          className={`text-xl sm:text-2xl ${spacingClass} ${caseClass} ${resolvedTextColor}`}
        >
          <span className={logoWeight1}>Sarkari</span>
          <span className={`${logoWeight2} ml-0.5`}>Board</span>
        </span>
      </div>
    );
  }

  // Horizontal Logo layout
  return (
    <div className={`flex items-center gap-2 group ${className}`} id="brand-logo-horizontal">
      <LogoIcon />
      <div className="flex flex-col justify-center select-none">
        <h1 
          className={`text-2xl sm:text-3.5xl leading-none ${spacingClass} ${caseClass} drop-shadow-sm flex items-center`}
          style={headingStyle}
        >
          <span className={`${logoWeight1} ${word1Class}`}>Sarkari</span>
          <span className={`${logoWeight2} ${word2Class} ml-0.5`}>Board</span>
        </h1>
        <span className={`text-[9.5px] font-sans font-bold tracking-[0.22em] uppercase leading-none opacity-90 mt-1.5 ${isDarkBackground ? 'text-green-200' : 'text-neutral-600'}`}>
          Trust • Governance • Careers
        </span>
      </div>
    </div>
  );
}
