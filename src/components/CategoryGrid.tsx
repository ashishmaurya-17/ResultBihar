import React from 'react';
import { CollectionType, Post } from '../types';
import { 
  Briefcase, 
  FileCheck2, 
  UserSquare2, 
  KeyRound, 
  GraduationCap, 
  Receipt, 
  Tags,
  Compass,
  Search
} from 'lucide-react';

interface CategoryGridProps {
  posts: Post[];
  selectedCollection: string;
  setSelectedCollection: (col: string) => void;
  searchKeyword: string;
}

export default function CategoryGrid({ 
  posts, 
  selectedCollection, 
  setSelectedCollection,
  searchKeyword 
}: CategoryGridProps) {
  
  // Count counts of each collection
  const getCount = (type: CollectionType) => {
    return posts.filter(p => p.collection === type && !p.draft).length;
  };

  const categories: Array<{
    id: CollectionType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    count: number;
    badgeText?: string;
  }> = [
    {
      id: 'jobs',
      title: 'Latest Sarkari Jobs',
      description: 'Form submission, notification alerts, last dates',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-100 hover:border-rose-300',
      count: getCount('jobs'),
      badgeText: 'New Vacancy'
    },
    {
      id: 'results',
      title: 'Exam Results',
      description: 'Board results, recruitment merit lists, scorings',
      icon: <FileCheck2 className="w-5 h-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300',
      count: getCount('results'),
      badgeText: 'Declared'
    },
    {
      id: 'admit-cards',
      title: 'Admit Cards',
      description: 'Call letters, exam date notices, exam venue lookup',
      icon: <UserSquare2 className="w-5 h-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300',
      count: getCount('admit-cards'),
      badgeText: 'Active'
    },
    {
      id: 'answer-keys',
      title: 'Answer Keys',
      description: 'Official keys, candidate objection submission links',
      icon: <KeyRound className="w-5 h-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100 hover:border-amber-300',
      count: getCount('answer-keys'),
      badgeText: 'Objections Open'
    },
    {
      id: 'admissions',
      title: 'Admissions Board',
      description: 'B.Ed, DElEd, ITI, Graduation counselling schedules',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 border-cyan-100 hover:border-cyan-300',
      count: getCount('admissions'),
      badgeText: 'Counselling'
    },
    {
      id: 'syllabus',
      title: 'Exam Syllabus',
      description: 'Exam scheme breakdown, topic weightage, preparation files',
      icon: <Receipt className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100 hover:border-purple-300',
      count: getCount('syllabus'),
      badgeText: 'Free PDF'
    },
    {
      id: 'scholarships',
      title: 'Scholarships Hub',
      description: 'State Post-Matric, National, girl child aid support',
      icon: <Tags className="w-5 h-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 border-pink-100 hover:border-pink-300',
      count: getCount('scholarships'),
      badgeText: 'OBC/SC/ST Benefit'
    },
    {
      id: 'yojana',
      title: 'Sarkari Yojanas',
      description: 'Student credit cards, state development schemes',
      icon: <Compass className="w-5 h-5" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 border-teal-100 hover:border-teal-300',
      count: getCount('yojana'),
      badgeText: 'Direct Benefit'
    }
  ];

  return (
    <div id="category-grid-bento" className="space-y-4">
      {/* Search status header if searching */}
      {searchKeyword && (
        <div className="bg-neutral-100 text-neutral-800 rounded-lg p-3 inline-flex items-center gap-2 text-xs font-mono font-semibold border">
          <Search className="w-3.5 h-3.5 text-neutral-500" />
          <span>Searching filter results active: "{searchKeyword}"</span>
        </div>
      )}

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* All India Reset Option */}
        <button
          onClick={() => setSelectedCollection('all')}
          className={`col-span-2 md:col-span-4 p-4 rounded-xl border text-left transition duration-200 cursor-pointer flex items-center justify-between gap-4 ${
            selectedCollection === 'all'
              ? 'bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg font-black'
              : 'bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50 hover:shadow-md'
          }`}
          id="category-option-all"
        >
          <div>
            <h3 className="font-black text-base sm:text-lg uppercase tracking-tight">View Compiled Unified Master Feed</h3>
            <p className={`text-xs ${selectedCollection === 'all' ? 'text-white/80' : 'text-neutral-500'}`}>
              Browse and search across all {posts.length} active notifications in Bihar, Jharkhand & UP.
            </p>
          </div>
          <span className={`px-3 py-1.5 rounded text-xs font-mono font-bold ${
            selectedCollection === 'all' ? 'bg-white text-red-700 shadow-md' : 'bg-neutral-100 text-neutral-700'
          }`}>
            {posts.length} Active Feeds
          </span>
        </button>

        {/* Categories Dynamic Tiles */}
        {categories.map((cat) => {
          const isActive = selectedCollection === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCollection(cat.id)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between h-32 relative group overflow-hidden ${
                isActive
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl scale-[1.02]'
                  : `${cat.bgColor} text-neutral-800 hover:shadow-md hover:border-red-300`
              }`}
              id={`category-option-${cat.id}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-amber-400 text-red-950' : `${cat.color} bg-white shadow-sm`}`}>
                  {cat.icon}
                </div>
                {cat.badgeText && !isActive && (
                  <span className="hidden sm:inline-block font-mono text-[9px] bg-white border font-bold uppercase px-1.5 py-0.5 rounded text-neutral-500">
                    {cat.badgeText}
                  </span>
                )}
              </div>

              {/* Card Metadata */}
              <div className="space-y-0.5 mt-2 z-10">
                <h4 className="font-black text-xs sm:text-sm uppercase tracking-tight line-clamp-1 group-hover:underline">
                  {cat.title}
                </h4>
                <p className={`text-[10px] sm:text-xs tracking-tight line-clamp-1 ${isActive ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {cat.description}
                </p>
              </div>

              {/* Count Ribbon */}
              <div className={`absolute bottom-2 right-2 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded ${
                isActive ? 'bg-amber-400 text-neutral-950' : 'bg-white/80 border text-neutral-700'
              }`}>
                {cat.count} Active
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
