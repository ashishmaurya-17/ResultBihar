export enum JobCategory {
  LATEST_JOBS = 'Latest Jobs',
  RESULT = 'Results',
  ADMIT_CARD = 'Admit Card',
  ANSWER_KEY = 'Answer Key',
  ADMISSION = 'Admission',
  SYLLABUS = 'Syllabus',
  SCHOLARSHIP = 'Scholarship',
  SARKARI_YOJANA = 'Sarkari Yojana',
}

export interface ImportantDate {
  label: string;
  date: string;
  note?: string;
}

export interface ApplicationFee {
  generalOBC: string;
  ewsSCST: string;
  ph: string;
  mode: string;
  bankCharges: string;
}

export interface VacancyDetail {
  postName: string;
  totalPosts: string;
  details: string;
}

export interface UsefulLink {
  label: string;
  url: string;
  isPrimary?: boolean;
}

export interface SarkariPost {
  id: string;
  category: JobCategory;
  a1_postName: string;
  a2_postDateTime: string;
  a3_seoDescription: string;
  a4_importantDates: ImportantDate[];
  a5_applicationFee: ApplicationFee;
  a6_ageLimit: { minAge: string; maxAge: string; relaxation: string };
  a7_postOverview: string;
  a8_vacancyDetails: VacancyDetail[];
  a9_eligibility: string;
  a10_howToFill: string;
  a11_selectionMode: string;
  a12_usefulLinks: UsefulLink[];
  a13_faq: { question: string; answer: string }[];
  a14_relatedPosts: { title: string; url: string }[];
  a15_tools: string[];
  a16_footerInfo: { readTime: string; shareUrl: string };
  a17_salaryInfo?: { officialPay: string; expectedInHand: string } | null;
}

export type CollectionType =
  | 'jobs'
  | 'results'
  | 'admit-cards'
  | 'answer-keys'
  | 'admissions'
  | 'syllabus'
  | 'scholarships'
  | 'yojana'
  | string;

export interface Post {
  id: string;
  collection: string;
  title: string;
  postDate: string; // YYYY-MM-DD
  summary: string;
  attributes: Record<string, any>;
  content: string;
  organization?: string;
  lastDateToApply?: string;
  state?: string;
  urgent?: boolean;
  featured?: boolean;
  featuredImage?: string;
  importantLinks?: Array<{
    label: string;
    url: string;
    isPrimary?: boolean;
    isDownload?: boolean;
  }>;
  [key: string]: any; // Allows dynamic access
}

export interface SearchQuery {
  keyword: string;
  collection: CollectionType | 'all';
  state: string | 'all';
  district: string | 'all';
}

