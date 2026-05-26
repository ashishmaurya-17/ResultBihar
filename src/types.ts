export type CollectionType =
  | 'jobs'
  | 'results'
  | 'admit-cards'
  | 'answer-keys'
  | 'admissions'
  | 'syllabus'
  | 'scholarships'
  | 'yojana';

export interface Post {
  id: string;
  collection: CollectionType;
  title: string;
  organization: string; // e.g., BPSC, CSBC, BSEB, SSC
  postDate: string; // YYYY-MM-DD
  lastDateToApply?: string; // YYYY-MM-DD (mostly for jobs/admissions/scholarships/yojana)
  resultDate?: string; // (for results)
  admitCardPublishDate?: string; // (for admit cards)
  category?: string; // e.g., "Sarkari Job", "10th/12th Result", "Degree Admission"
  districtLocations?: string[]; // e.g., ["Patna", "Muzaffarpur", "Gaya"] or ["All Districts"]
  state: 'Bihar' | 'Uttar Pradesh' | 'Jharkhand' | 'All India';
  draft: boolean;
  featured?: boolean; // Highlight box and marquee
  urgent?: boolean; // Marquee and hero ticker
  tags: string[];
  
  // Rich detailed content for the detail view
  summary: string;
  ageLimits?: {
    min?: number;
    max?: number;
    description?: string;
  };
  applicationFee?: {
    general?: number;
    obc_ebc?: number;
    sc_st?: number;
    female?: number;
    description?: string;
  };
  vacancyDetails?: {
    totalPosts?: number;
    postName?: string;
    eligibility?: string;
    table?: Array<{ postName: string; total: string | number; eligibility: string }>;
  };
  importantLinks: Array<{
    label: string;
    url: string;
    isPrimary?: boolean;
    isDownload?: boolean;
  }>;
  selectionProcess?: string[]; // e.g., ["Written Exam", "Physical Test", "Document Verification"]
  howToApply?: string;
  fullBodyMarkdown?: string;
}

export interface SearchQuery {
  keyword: string;
  collection: CollectionType | 'all';
  state: string | 'all';
  district: string | 'all';
}
