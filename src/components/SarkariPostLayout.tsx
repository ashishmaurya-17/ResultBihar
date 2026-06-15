import React, { useRef, useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePortalStore } from "../store";
import { JobCategory, SarkariPost, ImportantDate, UsefulLink, VacancyDetail } from "../types";
import { ImportantDatesTimeline } from "./ImportantDatesTimeline";
import { ApplicationFeeDetails } from "./ApplicationFeeDetails";
import { SarkariDataTable } from "./SarkariDataTable";
import { CommentSection } from "./CommentSection";
import AuthorCard from "./AuthorCard";
import SourceCitation from "./SourceCitation";
import { authors } from "./Authors";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  UserCheck,
  Award,
  HelpCircle,
  Wrench,
  Printer,
  Info,
  Share2,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { safeLocalStorage } from "../lib/storage";

const InfoTooltip: React.FC<{ content: string; align?: "right" | "center" }> = ({ content, align = "center" }) => {
  return (
    <div className={`relative group/tooltip inline-flex items-center ${align === 'right' ? 'ml-auto' : 'ml-1.5'} no-print`} style={{ verticalAlign: 'middle' }}>
      <Info className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-help transition-colors inline-block" />
      <div className={`absolute bottom-full mb-2 w-58 p-2 bg-neutral-900 dark:bg-zinc-800 text-neutral-100 dark:text-neutral-200 text-[10.5px] rounded border border-neutral-800 dark:border-zinc-700 shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto transition-opacity duration-200 z-50 font-sans tracking-normal font-medium normal-case leading-snug ${
        align === 'right' ? 'right-0' : 'left-0 sm:left-1/2 sm:-translate-x-1/2'
      }`}>
        {content}
        <div className={`absolute top-full border-4 border-transparent border-t-neutral-900 dark:border-t-zinc-800 ${
          align === 'right' ? 'right-1.5' : 'left-3 sm:left-1/2 sm:-translate-x-1/2'
        }`} />
      </div>
    </div>
  );
};

export interface SiloGroup {
  name: string;
  description: string;
  posts: Array<{ title: string; url: string; id: string; categoryName: string }>;
}

interface SarkariPostLayoutProps {
  post: SarkariPost;
  onBack?: () => void;
  relatedPosts?: { title: string; url: string; id?: string }[];
  siloGroup?: SiloGroup | null;
}

const CyberCafeChecklist: React.FC = () => {
  const documents = [
    { name: "Aadhar Card or Valid ID Proof", hindiName: "आधार कार्ड या वैध पहचान पत्र" },
    { name: "10th / 12th / Degree Marksheets", hindiName: "10वीं / 12वीं / डिग्री अंकपत्र" },
    { name: "Recent Passport Photo (White Background)", hindiName: "पासपोर्ट फोटो (सफेद बैकग्राउंड)" },
    { name: "Scanned Signature", hindiName: "हस्ताक्षर की स्कैन कॉपी" },
    { name: "Caste Certificate (Only if SC/ST/OBC)", hindiName: "जाति प्रमाण पत्र (केवल OBC/SC/ST के लिए)" }
  ];

  return (
    <div className="mb-6 bg-white border border-neutral-300 p-4 shadow-sm">
      <h3 className="text-sm font-bold uppercase text-neutral-800 border-b-2 border-neutral-200 pb-2 mb-3 flex items-center justify-between">
        <span>📋 Documents Needed</span>
        <span className="text-[10px] bg-red-800 text-white px-2 py-0.5 rounded">CYBER CAFE</span>
      </h3>
      <div className="space-y-3">
        {documents.map((doc, idx) => (
          <div key={idx} className="flex gap-3 items-start">
            <div className="w-5 h-5 flex items-center justify-center bg-green-50 text-green-700 border border-green-200 mt-0.5">
              ✓
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 leading-tight">{doc.name}</div>
              <div className="text-[11px] text-neutral-500 font-medium leading-snug">{doc.hindiName}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SarkariPostLayout: React.FC<SarkariPostLayoutProps> = ({
  post,
  onBack,
  relatedPosts = [],
  siloGroup = null
}) => {
  const navigate = useNavigate();
  const [store, setStore] = usePortalStore();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("Link Copied Successfully!");
  const [printTip, setPrintTip] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = safeLocalStorage.getItem("sarkari_saver_bookmarks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setIsSaved(parsed.some((p: any) => p.id === post.id));
        }
      }
    } catch (e) {
      console.warn("Failed parsing bookmarked post:", e);
    }
  }, [post.id]);

  const toggleBookmark = () => {
    try {
      const saved = safeLocalStorage.getItem("sarkari_saver_bookmarks");
      let parsed: any[] = [];
      if (saved) {
        parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) parsed = [];
      }
      
      const exists = parsed.some((p: any) => p.id === post.id);
      if (exists) {
        parsed = parsed.filter((p: any) => p.id !== post.id);
        setIsSaved(false);
        triggerToast("Removed from offline Sarkari Saver Pocket!");
      } else {
        parsed.unshift({
          id: post.id,
          title: post.a1_postName,
          category: post.category,
          postDate: post.a2_postDateTime,
          org: "Govt Board",
          savedAt: new Date().toISOString()
        });
        setIsSaved(true);
        triggerToast("✓ Saved offline in your Sarkari Saver Pocket!");
      }
      safeLocalStorage.setItem("sarkari_saver_bookmarks", JSON.stringify(parsed));
    } catch (e) {
      console.warn("Error bookmarking post:", e);
    }
  };
  const printableAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        setScrollProgress((window.scrollY / scrollTotal) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse start and end dates for ProgressBar
  const startDateObj = (post.a4_importantDates || []).find(d => 
    d?.label?.toLowerCase()?.includes("start") || d?.label?.toLowerCase()?.includes("first")
  );
  const endDateObj = (post.a4_importantDates || []).find(d => 
    d?.label?.toLowerCase()?.includes("last") || d?.label?.toLowerCase()?.includes("end") || d?.label?.toLowerCase()?.includes("deadline")
  );

  const startDateStr = startDateObj?.date;
  const endDateStr = endDateObj?.date;

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setCopied(true);
    const id = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(id);
  };

  const handleCopyLink = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      triggerToast("Link Copied Successfully!");
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: post.a1_postName,
      text: post.a3_seoDescription || `Check out this government job update: ${post.a1_postName}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        triggerToast("Post shared successfully!");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.warn("Error sharing via Web Share API:", err);
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
      triggerToast("Web Share not supported. Link copied!");
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      triggerToast(`${label} copied successfully!`);
    }).catch((err) => {
      console.warn("Could not copy:", err);
    });
  };

  const CopyValueButton = ({ text, label }: { text: string; label: string }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCopyText(text, label);
        }}
        title={`Copy ${label}`}
        className="ml-1 px-1 py-0.5 rounded border border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-850 hover:bg-neutral-150 dark:hover:bg-zinc-805 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-100 transition duration-150 cursor-pointer inline-flex items-center justify-center align-middle"
      >
        <Copy className="w-3 h-3" />
      </button>
    );
  };

  const handlePrint = () => {
    try {
      window.print();
      // Even if print starts or standard call proceeds, check if inside preview iframe and show tip
      const isIframe = window.self !== window.top;
      if (isIframe) {
        setPrintTip(true);
        setTimeout(() => setPrintTip(false), 8005);
      }
    } catch (err) {
      console.warn("Print action failed or blocked:", err);
      setPrintTip(true);
      setTimeout(() => setPrintTip(false), 8005);
    }
  };

  const computedReadTime = useMemo(() => {
    const textToCount = [
      post.a1_postName || "",
      post.a3_seoDescription || "",
      post.a7_postOverview || "",
      post.a10_howToFill || "",
      post.a11_selectionMode || "",
      post.a9_eligibility || ""
    ].join(" ");
    const words = textToCount.trim().split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(words / 185));
    return `${minutes} Min Read`;
  }, [post]);

  // Convert A4 Important Dates to Rows for Table (with Yellow Marker UX for end date)
  // Convert A4 Important Dates to Rows for Table (with Yellow Marker UX for end date)
  const importantDatesRows = (post.a4_importantDates || []).map((item: ImportantDate) => {
    const isEnd = item?.label?.toLowerCase()?.includes("last") || item?.label?.toLowerCase()?.includes("end") || item?.label?.toLowerCase()?.includes("deadline") || item?.label?.toLowerCase()?.includes("closing");
    const dateVal = item?.date || "";
    return [
      item?.label || "",
      <span className="inline-flex items-center gap-1" key={item?.label || ""}>
        {isEnd ? (
          <span className="bg-yellow-250 dark:bg-yellow-300 text-black font-extrabold px-1.5 py-0.5 border border-yellow-450 select-all shadow-sm">
            {dateVal}
          </span>
        ) : (
          <span>{dateVal}</span>
        )}
        {dateVal && dateVal !== "N/A" && (
          <CopyValueButton text={dateVal} label={item?.label || "Important Date"} />
        )}
      </span>,
      item?.note || "N/A"
    ];
  });

  // Convert A5 Application Fee to Rows for Table (with Yellow Marker UX for fee values)
  const applicationFeeRows = [
    [
      "General / OBC Fees", 
      <span className="inline-flex items-center gap-1" key="gen-fee">
        <span className="bg-yellow-250 dark:bg-yellow-300 text-black px-1.5 py-0.5 border border-yellow-450 font-extrabold shadow-sm">
          {post.a5_applicationFee?.generalOBC || "N/A"}
        </span>
        {post.a5_applicationFee?.generalOBC && post.a5_applicationFee?.generalOBC !== "N/A" && (
          <CopyValueButton text={post.a5_applicationFee.generalOBC} label="General Fees" />
        )}
      </span>
    ],
    [
      "EWS / SC / ST Fees", 
      <span className="inline-flex items-center gap-1" key="ews-fee">
        <span className="bg-yellow-250 dark:bg-yellow-300 text-black px-1.5 py-0.5 border border-yellow-450 font-extrabold shadow-sm">
          {post.a5_applicationFee?.ewsSCST || "N/A"}
        </span>
        {post.a5_applicationFee?.ewsSCST && post.a5_applicationFee?.ewsSCST !== "N/A" && (
          <CopyValueButton text={post.a5_applicationFee.ewsSCST} label="SC/ST Fees" />
        )}
      </span>
    ],
    [
      "PH (Physically Handicapped) Fees", 
      <span className="inline-flex items-center gap-1" key="ph-fee">
        <span className="bg-yellow-250 dark:bg-yellow-300 text-black px-1.5 py-0.5 border border-yellow-450 font-extrabold shadow-sm">
          {post.a5_applicationFee?.ph || "N/A"}
        </span>
        {post.a5_applicationFee?.ph && post.a5_applicationFee?.ph !== "N/A" && (
          <CopyValueButton text={post.a5_applicationFee.ph} label="PH Fees" />
        )}
      </span>
    ],
    ["Payment Mode", post.a5_applicationFee?.mode || "N/A"],
    ["Extra Bank Charges", post.a5_applicationFee?.bankCharges || "N/A"]
  ];

  // Convert A6 Age Limit to Rows for Table (with Yellow Marker UX for max age limit)
  const ageLimitRows = [
    [
      "Minimum Age Limit", 
      <span className="inline-flex items-center gap-1" key="min-age">
        <span>{post.a6_ageLimit?.minAge || "N/A"}</span>
        {post.a6_ageLimit?.minAge && post.a6_ageLimit?.minAge !== "N/A" && (
          <CopyValueButton text={post.a6_ageLimit.minAge} label="Min Age" />
        )}
      </span>
    ],
    [
      "Maximum Age Limit", 
      <span className="inline-flex items-center gap-1" key="max-age">
        <span className="bg-yellow-250 dark:bg-yellow-300 text-black px-1.5 py-0.5 border border-yellow-450 font-extrabold shadow-sm">
          {post.a6_ageLimit?.maxAge || "N/A"}
        </span>
        {post.a6_ageLimit?.maxAge && post.a6_ageLimit?.maxAge !== "N/A" && (
          <CopyValueButton text={post.a6_ageLimit.maxAge} label="Max Age" />
        )}
      </span>
    ],
    ["Age Relaxation Rules", post.a6_ageLimit?.relaxation || "N/A"]
  ];

  // Convert A8 Vacancy Details to Rows for Table
  const vacancyRows = (post.a8_vacancyDetails || []).map((v: VacancyDetail) => [
    v?.postName || "",
    v?.totalPosts || "",
    v?.details || ""
  ]);

  // Convert A12 Useful Links to Rows
  const usefulLinksRows = (post.a12_usefulLinks || []).map((link: UsefulLink) => [
    link?.label || "",
    <div className="flex items-center gap-2" key={link?.label || ""}>
      <a
        href={link?.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-3 py-1 font-bold text-xs border border-gray-900 transition-all duration-200 hover:scale-105 active:scale-95 uppercase ${
          link?.isPrimary 
            ? "bg-red-800 text-white hover:bg-black" 
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        Click Here
      </a>
      {link?.url && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopyText(link.url, link.label || "Link URL");
          }}
          title="Copy Link URL"
          className="p-1 rounded border border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-850 hover:bg-neutral-150 dark:hover:bg-zinc-805 text-gray-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-100 transition duration-150 cursor-pointer flex items-center justify-center h-7 w-7"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  ]);

  const structuredData = useMemo(() => {
    // Extract last date to apply from important dates for the validThrough parameter
    const lastDateEntry = post.a4_importantDates?.find(d => {
      const lbl = d.label.toLowerCase();
      return lbl.includes('last date') || lbl.includes('closing') || lbl.includes('end') || lbl.includes('valid');
    });
    
    let validThrough = "2026-12-31"; // Default fallback
    if (lastDateEntry && lastDateEntry.date) {
      const rawDate = lastDateEntry.date.trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        validThrough = rawDate;
      } else {
        // Safe conversion of common formats like DD/MM/YYYY or DD-MM-YYYY
        const parts = rawDate.split(/[-/]/);
        if (parts.length === 3) {
          if (parts[0].length === 4) { // YYYY-MM-DD
            validThrough = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
          } else if (parts[2].length === 4) { // DD-MM-YYYY
            validThrough = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      }
    }

    // Extract dynamic hiring organization from title matching
    let orgName = "Govt Exams Department";
    if (post.a1_postName) {
      const title = post.a1_postName;
      const boardMatch = title.match(/^(UP Police|BPSC|CBSE|RRB|SSC|UPSC|BSEB|NTA|Indian Navy|Indian Army|Air Force|Railway|ISRO|DRDO|RBI|SBI|IBPS)/i);
      if (boardMatch) {
        orgName = `${boardMatch[1]} Board`;
      } else {
        const words = title.split(/\s+/);
        if (words.length > 2) {
          orgName = words.slice(0, 2).join(" ") + " Board";
        }
      }
    }

    return JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": post.a1_postName,
      "description": post.a7_postOverview || post.a3_seoDescription || "Government job notification.",
      "datePosted": post.a2_postDateTime || new Date().toISOString(),
      "validThrough": validThrough,
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": orgName,
        "sameAs": window.location.origin
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        }
      }
    });
  }, [post]);

  return (
    <div className="relative min-h-screen bg-[#FDFDFB] dark:bg-zinc-950 text-gray-900 dark:text-zinc-150 selection:bg-red-200 selection:text-red-900 p-1 xs:p-2 sm:p-6 md:p-8 font-sans transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-1 z-[1000] bg-gray-200 dark:bg-zinc-800">
        <div className="h-full bg-red-800 transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
      </div>
      {/* Subtle Grain Effect Overlay */}
      <script type="application/ld+json">
        {structuredData}
      </script>
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.015] z-50 bg-repeat bg-[size:16px_16px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Copy Link Status Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-gray-900 text-white border-2 border-gray-950 px-5 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none no-print min-w-[300px]"
          >
            <div className="bg-green-500 text-black rounded-full p-1 flex items-center justify-center">
              <Check size={16} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-green-400">SUCCESS / सफलता</div>
              <div className="text-sm font-sans font-black">{toastMessage}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print Tip Toast Notification for sandbox environment */}
      <AnimatePresence>
        {printTip && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-neutral-900 text-white border-2 border-red-500 px-5 py-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none no-print w-[90%] max-w-[450px]"
          >
            <div className="bg-amber-500 text-black rounded-full p-1.5 flex items-center justify-center shrink-0">
              <Info size={18} strokeWidth={3} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] uppercase font-mono font-extrabold tracking-wider text-amber-400">PRINT PREVIEW TIP / प्रिंट सुझाव</div>
              <div className="text-xs font-sans font-medium text-neutral-200 mt-0.5 leading-relaxed font-semibold">
                If the print dialog didn't open, browsers block it in preview frames. Please click the <strong className="text-white font-extrabold">"Open in New Tab" ↗</strong> button at the top-right of your screen to print/save flawlessly!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Core Full Width Container (Exactly like Landing Page w/ max-w-[1580px]) */}
      <div className="max-w-[1580px] mx-auto w-full px-0 sm:px-2 md:px-4 py-2">
        
        {/* Custom Premium Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-[10px] sm:text-xs font-mono uppercase bg-gray-100 dark:bg-zinc-855 border border-gray-300 dark:border-zinc-750 p-2 sm:p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider select-none">
          <Link to="/" onClick={onBack} className="hover:text-red-800 dark:hover:text-red-400 font-extrabold transition-colors uppercase">
            HOME
          </Link>
          <span className="text-gray-400">➔</span>
          <span className="text-gray-500 dark:text-zinc-400">{post.category.replace("-", " ")}</span>
          <span className="text-gray-400">➔</span>
          <span className="text-gray-900 dark:text-gray-200 font-bold truncate max-w-[150px] sm:max-w-md">
            {post.a1_postName}
          </span>
        </div>

        {/* Two-Column Grid: Left Column is Official Document Paper, Right is redesigned sidebar */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Main Paper Content Container (col-span-12 lg:col-span-8 xl:col-span-9) */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 w-full min-w-0 overflow-hidden">
            <div className="border-2 border-gray-900 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2.5 xs:p-3 sm:p-6 md:p-8 relative shadow-[6px_6px_0px_0px_rgba(31,41,55,1)] dark:shadow-[6px_6px_0px_0px_rgba(39,39,42,1)] transition-colors duration-305">
        
        {/* PRINTABLE CONTENT */}
        <div ref={printableAreaRef} className="text-sm transition-all duration-300">

          {/* BLOCK 1: Post Name (Premium government serif gaze font) */}
          <section className="mb-6 relative">
            <span className="absolute right-0 top-0 text-[10px] text-gray-200 select-none font-mono opacity-20">A1_POST</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-950 dark:text-zinc-100 uppercase tracking-tight leading-tight pb-2">
              {post.a1_postName}
            </h1>

            {/* BLOCK 2: Date, Time & Read Badge (Placed directly under H1 title) */}
            <motion.section
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mt-3 mb-4 flex flex-wrap items-center gap-3 text-xs font-mono text-gray-750 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800/80 p-2.5 border border-gray-350 dark:border-zinc-700 relative select-none"
            >
              <span className="absolute right-2 top-2 text-[8px] text-gray-300 select-none opacity-20">A2</span>
              <div>
                <span className="font-bold">PUBLISHED DATE:</span> {new Date(post.a2_postDateTime).toLocaleString('en-IN')}
              </div>
              <div className="sm:inline hidden text-gray-400 border-r border-gray-300 dark:border-zinc-700 h-4" />
              <div>
                <span className="font-bold">STATUS:</span> Verified Official Notice
              </div>
              <div className="sm:inline hidden text-gray-450 border-r border-gray-300 dark:border-zinc-700 h-4" />
              <div className="bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-100 px-2.5 py-0.5 font-bold uppercase text-[10px] tracking-wide inline-flex items-center gap-1 border border-amber-300 dark:border-amber-800 rounded-sm">
                ⏱️ {computedReadTime}
              </div>

              {/* Info Icon with Hover Tooltip */}
              <InfoTooltip align="right" content="This section provides the officially released notification timestamp, formal verification status, and dynamic processing metrics." />
            </motion.section>
          </section>

          {/* Gazette banner (Placed under Post Name) */}
          <div className="border-b-4 border-double border-gray-900 dark:border-zinc-700 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-red-800 text-white font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-gray-900 dark:border-zinc-850">
                OFFICIAL SARKARI UPDATE
              </span>
              <div className="text-gray-650 dark:text-zinc-400 text-xs font-mono mt-1 flex flex-wrap items-center gap-x-2">
                <span>CATEGORY: {post.category.toUpperCase()}</span>
                <span>•</span>
                <span className="text-green-800 dark:text-green-400 font-sans font-black italic tracking-wide">✓ Curated & Verified by Ashish Maurya</span>
              </div>
            </div>
            <div className="flex flex-nowrap items-center gap-1 sm:gap-1.5 no-print mt-2 md:mt-0">
              {onBack && (
                <Link
                  to="/"
                  onClick={onBack}
                  className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-950 font-sans text-[9px] sm:text-[10px] uppercase font-black tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-md hover:translate-x-[0.5px] hover:translate-y-[0.5px]"
                  title="Go back to dashboard"
                >
                  <ArrowLeft className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />
                  <span>Home</span>
                </Link>
              )}
              <button
                onClick={handleCopyLink}
                className="flex-shrink-0 flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-50 text-blue-950 border border-blue-950 hover:bg-blue-100 font-sans text-[9px] sm:text-[10px] uppercase font-black tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none shadow-[1px_1px_0px_0px_rgba(29,78,216,1)] hover:shadow-md hover:translate-x-[0.5px] hover:translate-y-[0.5px]"
                title="Copy shareable post link to clipboard"
              >
                {copied ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" strokeWidth={3} /> : <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={3} />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-shrink-0 flex items-center gap-1 px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-emerald-50 text-emerald-950 border border-emerald-950 hover:bg-emerald-100 font-sans text-[8px] sm:text-[9px] uppercase font-black tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none shadow-[1px_1px_0px_0px_rgba(16,185,129,1)] hover:shadow-md hover:translate-x-[0.5px] hover:translate-y-[0.5px]"
                title="Share this job update via social media or messaging apps"
              >
                <Share2 className="w-2 h-2 sm:w-2.5 sm:h-2.5" strokeWidth={3} />
                <span>Share</span>
              </button>
              
              <button
                onClick={toggleBookmark}
                className={`flex-shrink-0 flex items-center gap-1 px-1 py-0.5 sm:px-1.5 sm:py-0.5 font-sans text-[8px] sm:text-[9px] uppercase font-black tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none border hover:shadow-md hover:translate-x-[0.5px] hover:translate-y-[0.5px] ${
                  isSaved 
                    ? "bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-300 border-amber-950 shadow-[1px_1px_0px_0px_rgba(245,158,11,1)]"
                    : "bg-amber-50 dark:bg-zinc-900 text-amber-900 dark:text-zinc-200 border-amber-805 shadow-[1px_1px_0px_0px_rgba(180,83,9,1)]"
                }`}
                title="Save this notice to your offline bookmarked pocket for train/offline viewing"
              >
                {isSaved ? <BookmarkCheck className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-655" strokeWidth={3} /> : <Bookmark className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-805" strokeWidth={3} />}
                <span>{isSaved ? "Saved Saver" : "Save Offline"}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-shrink-0 flex items-center gap-1 px-1 py-0.5 sm:px-1.5 sm:py-0.5 bg-[#D32F2F] text-white border border-red-950 hover:bg-[#B71C1C] font-sans text-[8px] sm:text-[9px] uppercase font-black tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer select-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-md hover:translate-x-[0.5px] hover:translate-y-[0.5px]"
                title="Print this Page"
              >
                <Printer className="w-2 h-2 sm:w-2.5 sm:h-2.5" strokeWidth={3} />
                <span>Print</span>
              </button>

            </div>
          </div>

          {/* FEATURE 3: CURRENT RECRUITMENT PHASE (General Process Viewer - Elevated Modern Sleek Stepper) */}
          <section className="mb-4 py-1.5 px-2 bg-neutral-50 dark:bg-[#1a1a1e] border-y border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-xs font-sans">
            <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-extrabold uppercase tracking-widest text-[9.5px] select-none">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span>Requisite Phase / स्थिति:</span>
            </div>

            {/* Compact timeline bar */}
            <div className="flex items-center gap-1 sm:gap-2 grow max-w-full md:max-w-xl select-none overflow-x-auto scrollbar-none py-1 flex-nowrap shrink-0">
              {[
                { step: 1, label: "Started" },
                { step: 2, label: "Closed" },
                { step: 3, label: "Admit Card" },
                { step: 4, label: "Exam" },
                { step: 5, label: "Result" }
              ].map((ph, idx) => {
                let activePhase = 1;
                const catStr = post.category;
                if (catStr === JobCategory.LATEST_JOBS) {
                  if (endDateStr) {
                    try {
                      const endDate = new Date(endDateStr);
                      const today = new Date();
                      if (today <= endDate) {
                        activePhase = 1;
                      } else {
                        activePhase = 2;
                      }
                    } catch (e) {
                      activePhase = 1;
                    }
                  } else {
                    activePhase = 1;
                  }
                } else if (catStr === JobCategory.ADMIT_CARD) {
                  activePhase = 3;
                } else if (catStr === JobCategory.ANSWER_KEY || catStr === JobCategory.SYLLABUS) {
                  activePhase = 4;
                } else if (catStr === JobCategory.RESULT) {
                  activePhase = 5;
                } else {
                  activePhase = 1;
                }

                const isActive = ph.step === activePhase;
                const isPassed = ph.step < activePhase;

                return (
                  <React.Fragment key={ph.step}>
                    <div className="flex items-center gap-1 relative group">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ${
                        isActive 
                          ? "bg-green-600 scale-125 ring-2 ring-green-100 dark:ring-green-950/40" 
                          : isPassed 
                            ? "bg-neutral-800 dark:bg-neutral-200" 
                            : "bg-neutral-200 dark:bg-neutral-700"
                      }`} />
                      <span className={`text-[9.5px] uppercase tracking-tighter ${
                        isActive 
                          ? "text-green-700 dark:text-green-400 font-extrabold" 
                          : isPassed 
                            ? "text-neutral-500 dark:text-neutral-400 font-bold" 
                            : "text-neutral-300 dark:text-neutral-600 font-medium"
                      }`}>
                        {ph.label}
                      </span>
                    </div>
                    {idx < 4 && (
                      <div className={`h-[1px] grow min-w-[8px] transition-all duration-300 ${
                        isPassed ? "bg-neutral-850 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-700"
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          {/* BLOCK 3: Simple Description */}
          {post.a3_seoDescription && (
            <section className="mb-7 p-4 sm:p-5 border-2 border-gray-900 bg-[#FAF9F5] text-sm sm:text-[14.5px] text-gray-900 tracking-wide leading-loose font-serif relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="absolute right-2 top-2 text-[8px] text-gray-300 select-none opacity-20">A3</span>
              <span className="font-mono text-xs font-bold text-red-800 mb-1 flex items-center gap-1 select-none">
                <span>DESCRIPTION DETAILS & INFO:</span>
                <InfoTooltip content="Official summarized brief of the department recruitment announcement and core eligibility highlights." />
              </span>
              {post.a3_seoDescription}
            </section>
          )}

          {/* BLOCK 4: Important Dates */}
          <section className="mb-5 relative">
            <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A4_DATES</span>
            <ImportantDatesTimeline dates={post.a4_importantDates || []} />

            {/* Disclaimer below dates */}
            <div className="mt-2 text-[10.5px] font-mono leading-normal text-amber-900 bg-amber-50 p-2.5 border border-amber-300">
              <span className="font-extrabold uppercase flex items-center gap-1.5 mb-1 text-amber-955">
                <AlertTriangle size={13} className="shrink-0 text-amber-600 animate-pulse" /> IMPORTANT NOTICE
              </span>
              Please confirm all dates and details from the official website of the department before applying.
            </div>
          </section>

          {/* BLOCK 5: Fee Details */}
          <section className="mb-5 relative">
            <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A5_FEE</span>
            <ApplicationFeeDetails fee={post.a5_applicationFee} />
          </section>

          {/* BLOCK 12: Useful links */}
          <section className="mb-6 relative">
            <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A12_LINKS</span>
            <h2 className="text-xs sm:text-sm font-mono font-black uppercase text-gray-900 dark:text-zinc-100 border-l-4 border-red-800 pl-2 bg-gray-100 dark:bg-zinc-800 py-1.5 tracking-wide mb-2.5 flex items-center gap-1 select-none">
              <span>Important Notification & Apply Links</span>
              <InfoTooltip content="Fast track links to register, log in, download the official notification PDF, or visit the department's home portal." />
            </h2>
            <div className="overflow-x-auto w-full">
              <SarkariDataTable
                headers={["Link Name", "Official link"]}
                rows={usefulLinksRows}
                colWidths={["60%", "40%"]}
              />
            </div>

          </section>

          {/* BLOCK 6: Age Details */}
          <section className="mb-5 relative">
            <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A6_AGE</span>
            <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
              <span>Age Limits & Rules</span>
              <InfoTooltip content="Min/max age requirements, crucial cutoff dates, and state/central age relaxation provisions for categories." />
            </h2>
            <div className="overflow-x-auto w-full">
              <SarkariDataTable
                headers={["Category Type", "Age Limit Details"]}
                rows={ageLimitRows}
              />
            </div>
          </section>

          {/* BLOCK 7: Post Overview */}
          {post.a7_postOverview && (
            <section className="mb-7 relative">
              <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A7_INFO</span>
              <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                <span>About this Post</span>
                <InfoTooltip content="A synthesized overview detailing the organization, job rules, and basic working profile of this position." />
              </h2>
              <div className="border-2 border-gray-950 p-4 leading-loose font-mono text-[12px] sm:text-[13px] text-gray-900 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:bg-zinc-900 transition-colors">
                {post.a7_postOverview}
              </div>
            </section>
          )}

          {/* BLOCK 8: Vacancy Details */}
          {post.a8_vacancyDetails && post.a8_vacancyDetails.length > 0 && (
            <section className="mb-5 relative">
              <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A8_SEATS</span>
              <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                <span>Seats & Vacancy Details</span>
                <InfoTooltip content="Distribution of available seats by name, category partitions, and vertical/horizontal reservation metrics." />
              </h2>
              <div className="overflow-x-auto w-full">
                <SarkariDataTable
                  headers={["Post Name", "Total Seats", "Castes & Categorized Seats"]}
                  rows={vacancyRows}
                  colWidths={["35%", "25%", "40%"]}
                />
              </div>
            </section>
          )}

          {/* FEATURE 2: SALARY / PAY SCALE DECODER */}
          {post.a17_salaryInfo && (
            <section className="mb-5 relative">
              <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A17_SALARY</span>
              <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                <span>Monthly Salary & Pay scale (वेतनमान)</span>
                <InfoTooltip content="Decoded official pay matrix scale level, grade pay, and current approximated cash in-hand cash guidelines." />
              </h2>
              <div className="border border-gray-955 dark:border-zinc-700 p-3.5 font-mono text-[11px] sm:text-[12px] text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(39,39,42,1)] flex items-start gap-3 transition-colors">
                <span className="text-base select-none">💰</span>
                <div className="w-full">
                  <div className="font-bold leading-normal text-gray-900 dark:text-zinc-100">
                    Official Pay scale: <span className="text-red-800 dark:text-red-400 font-extrabold">{post.a17_salaryInfo.officialPay}</span>
                  </div>
                  <div className="mt-1.5">
                    <span className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-450 text-emerald-900 dark:text-emerald-200 px-2.5 py-0.5 font-black text-[11px] sm:text-xs shadow-3xs tracking-tight inline-block">
                      ★ Expected In-Hand Cash: {post.a17_salaryInfo.expectedInHand}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[9.5px] text-gray-500 dark:text-zinc-400 italic font-medium leading-relaxed">
                    *Estimated In-Hand includes Basic Pay + approximate allowances as of 2026 guidelines.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* BLOCK 9: Eligibility */}
          {post.a9_eligibility && (
            <section className="mb-7 relative">
              <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A9_ELIGIBILITY</span>
              <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                <span>Qualifications Needed</span>
                <InfoTooltip content="Minimum educational benchmarks, professional certificates, training, and physical eligibility conditions." />
              </h2>
              <div className="border-2 border-gray-955 dark:border-zinc-700 p-4 font-mono text-[11.5px] sm:text-[13px] text-gray-900 dark:text-zinc-150 bg-[#FAF9F5] dark:bg-zinc-900/40 flex items-start gap-3 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="shrink-0 bg-red-800 text-white p-2 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rounded-none">
                  <Award size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono font-extrabold tracking-tight text-gray-500 dark:text-zinc-400 mb-1.5">QUALIFICATION BENCHMARK</div>
                  <div className="font-extrabold whitespace-pre-wrap leading-loose text-neutral-850 dark:text-zinc-250">{post.a9_eligibility}</div>
                </div>
              </div>
            </section>
          )}

            {/* BLOCK 10: How to Fill */}
            {post.a10_howToFill && (
              <section className="mb-7 relative">
                <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A10_STEPS</span>
                <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                  <span>How to Fill Form</span>
                  <InfoTooltip content="Explicit directives to successfully register, upload files, verify information, and print application confirmation." />
                </h2>
                <div className="border-2 border-gray-955 p-3 sm:p-4 bg-white dark:bg-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
                  {post.a10_howToFill.split("\n").map(l => l.trim()).filter(l => l.length > 0).map((line, idx) => {
                    const stepMatch = line.match(/^(\d+[\.\)]|Step\s*\d+[:\.]|[-•\*])\s*(.*)$/i);
                    const showNumber = stepMatch ? (isNaN(parseInt(stepMatch[1])) ? `${idx + 1}` : stepMatch[1].replace(/[\.\)]/g, "")) : `${idx + 1}`;
                    const content = stepMatch ? stepMatch[2] : line;
                    
                    return (
                      <div key={idx} className="flex gap-2.5 items-start p-3 bg-neutral-50 dark:bg-zinc-900/40 border border-gray-950 dark:border-zinc-805 hover:bg-neutral-100/50 transition-colors">
                        <div className="shrink-0 flex items-center justify-center font-mono font-black text-[10px] bg-red-800 text-white border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] w-5 h-5 select-none mt-0.5">
                          {showNumber}
                        </div>
                        <div className="text-neutral-800 dark:text-zinc-200 leading-loose font-mono font-semibold text-[12px] sm:text-[13px]">
                          {content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* BLOCK 11: Mode of Selection */}
            {post.a11_selectionMode && (
              <section className="mb-5 relative">
                <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A11_SELECTION</span>
                <h2 className="text-xs sm:text-sm font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                  <span>How Selection is Done</span>
                  <InfoTooltip content="The multi-tiered screening procedures including exam rounds, skill checks, interviews, and background verifications." />
                </h2>
                <div className="border border-gray-950 dark:border-zinc-700 p-3.5 font-mono text-[11px] sm:text-[12px] text-gray-900 dark:text-zinc-100 bg-white dark:bg-zinc-900/40 flex items-start gap-3 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="shrink-0 bg-gray-900 text-white p-1.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <UserCheck size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono font-extrabold tracking-tight text-gray-500 dark:text-zinc-400 mb-1">SELECTION PLAN</div>
                    <div className="font-semibold whitespace-pre-wrap leading-relaxed text-neutral-855 dark:text-zinc-200">{post.a11_selectionMode}</div>
                  </div>
                </div>
              </section>
            )}

          {/* BLOCK 12: Useful links */}
          <section className="mb-6 relative">
            <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A12_LINKS</span>
            <h2 className="text-xs sm:text-sm font-mono font-black uppercase text-gray-900 dark:text-zinc-100 border-l-4 border-red-800 pl-2 bg-gray-100 dark:bg-zinc-800 py-1.5 tracking-wide mb-2.5 flex items-center gap-1 select-none">
              <span>Important Notification & Apply Links</span>
              <InfoTooltip content="Fast track links to register, log in, download the official notification PDF, or visit the department's home portal." />
            </h2>
            <div className="overflow-x-auto w-full">
              <SarkariDataTable
                headers={["Link Name", "Official link"]}
                rows={usefulLinksRows}
                colWidths={["60%", "40%"]}
              />
            </div>

            {/* FEATURE 4_1: REPORT BROKEN LINK BUTTON */}
            {/* Removed Broken Link Report button per user request */}
          </section>

          {/* BLOCK 13: FAQ Section */}
          {post.a13_faq && post.a13_faq.length > 0 && (
            <section className="mb-6 relative">
              <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A13_FAQ</span>
              <h2 className="text-md font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                <span>Common Questions & Answers (FAQ)</span>
                <InfoTooltip content="Frequently asked questions concerning eligibility, corrections, age Relaxation, fee payment, and exam dates." />
              </h2>
              <div className="space-y-2 border border-gray-800 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900 transition-colors">
                {post.a13_faq.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-300 dark:border-zinc-700">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full flex justify-between items-center bg-gray-100 dark:bg-zinc-800 p-2.5 text-left text-xs uppercase font-bold tracking-wider hover:bg-gray-200 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-gray-900 dark:text-zinc-150 font-black">
                          <HelpCircle size={14} className="shrink-0 text-gray-600 dark:text-zinc-400" />
                          {faq.question}
                        </span>
                        {isOpen ? <ChevronUp size={14} className="text-gray-650 dark:text-zinc-400" /> : <ChevronDown size={14} className="text-gray-650 dark:text-zinc-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-3 bg-neutral-50 dark:bg-zinc-850 text-xs text-gray-800 dark:text-zinc-300 leading-relaxed font-semibold border-t border-gray-300 dark:border-zinc-700">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Dedicated table-based Cyber Cafe checklist */}
          <CyberCafeChecklist />

          {/* BLOCK 14: Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="mb-6 border border-gray-800 dark:border-zinc-700 p-4 bg-white dark:bg-zinc-900 relative transition-colors">
              <span className="absolute right-2 top-2 text-[8px] text-gray-350 select-none font-mono opacity-25">A14_RELATED</span>
              <h2 className="text-xs uppercase font-sans font-extrabold tracking-tight text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 flex items-center gap-1 select-none">
                <span>Related Posts</span>
                <InfoTooltip content="Other active recruitment configurations, notification details, or results by the same organization or stream." />
              </h2>
              <ul className="space-y-1.5 font-sans text-xs">
                {relatedPosts.map((r, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-800 dark:bg-red-500 shrink-0" />
                    <a
                      href={r.url || `#`}
                      className="text-red-900 dark:text-red-400 font-bold hover:underline text-[12px] tracking-tight hover:text-black dark:hover:text-white leading-tight transition-all duration-200 hover:text-red-700"
                    >
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* SEMANTIC INTERNAL LINKING (SILO STRUCTURE) GATEWAY */}
          {siloGroup && siloGroup.posts && siloGroup.posts.length > 0 && (
            <section className="mb-6 border-2 border-dashed border-red-800 dark:border-red-400 p-5 bg-[#FAF9F5] dark:bg-zinc-900/50 relative rounded-none transition-colors shadow-[3px_3px_0px_rgba(153,27,27,1)] dark:shadow-[3px_3px_0px_rgba(248,113,113,0.4)]">
              <span className="absolute right-3 top-3 text-[9px] font-mono font-black text-red-850 dark:text-red-400 uppercase select-none opacity-50">
                SEO SILO CONNECTED
              </span>
              
              <div className="mb-3.5">
                <span className="inline-block bg-red-800 text-white font-mono text-[9.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none mb-1 shadow-sm">
                  📁 {siloGroup.name}
                </span>
                <p className="text-[11px] text-neutral-600 dark:text-zinc-300 font-medium leading-relaxed mt-1">
                  {siloGroup.description} <span className="font-semibold text-neutral-700 dark:text-zinc-200">Search spider directory for seamless high-priority indexing and categorical deep crawl paths:</span>
                </p>
              </div>

              {/* Grid-based deep semantic links for fast indexing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1.5">
                {siloGroup.posts.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 bg-white dark:bg-zinc-950 border border-neutral-300 dark:border-zinc-800 hover:border-red-800 dark:hover:border-red-400 transition-all shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.1)]">
                    <span className="shrink-0 flex items-center justify-center font-mono font-bold text-[10px] bg-red-100 text-red-950 dark:bg-red-950/50 dark:text-red-300 w-5.5 h-5.5 rounded-full mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[9px] font-mono font-extrabold text-[#7c2d12] dark:text-[#fdba74] uppercase tracking-wider bg-red-50 dark:bg-red-950/20 px-1 py-0.5 rounded-sm">
                        {item.categoryName}
                      </span>
                      <Link 
                        to={item.url}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                        className="block text-[12.5px] font-extrabold text-neutral-900 hover:text-red-800 dark:text-zinc-100 dark:hover:text-red-400 transition-colors leading-snug hover:underline tracking-tight"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crawl-indicator label */}
              <div className="mt-4 pt-3.5 border-t border-neutral-200 dark:border-zinc-800 flex items-center justify-between text-[10.5px] font-mono text-neutral-400 dark:text-zinc-500">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Crawler-Optimized SILO Hub (2026 Engine Rules)
                </span>
                <span className="hidden sm:inline">No irrelevant inter-link pollution</span>
              </div>
            </section>
          )}
          
                    {/* Author trust section */}
          <section className="mb-6 pt-6 border-t border-neutral-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase text-neutral-500 tracking-wider">Content Curated & Verified By</h3>
              <span className="text-[10px] text-neutral-400 font-mono">Last Updated: {post.a2_postDateTime}</span>
            </div>
            <div className="grid gap-4">
                <AuthorCard {...authors[0]} />
            </div>
          </section>

          {/* Source Citation */}
          <SourceCitation sources={post.a12_usefulLinks} />
          
          <CommentSection postId={post.id} />

          {/* BLOCK 15: Helpful Tools */}
          {post.a15_tools && post.a15_tools.length > 0 && (
            <section className="mb-6 relative">
              <span className="absolute right-0 top-1 text-[8px] text-gray-350 select-none font-mono opacity-25">A15_TOOLS</span>
              <h2 className="text-md font-sans font-extrabold uppercase text-gray-900 dark:text-zinc-100 border-b border-gray-900 pb-2 mb-4 tracking-tight flex items-center gap-1 select-none">
                <span>Helpful Tools for Students</span>
                <InfoTooltip content="Integrated utility widgets like image re-sizers, age calculators, offline application worksheets, and document templates." />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.a15_tools.map((toolName, tIdx) => (
                  <div key={tIdx} className="border border-gray-800 p-3 bg-neutral-50 flex items-center gap-2.5">
                    <div className="p-1 bg-gray-200 border border-gray-800">
                      <Wrench size={14} className="text-gray-800" />
                    </div>
                    <div>
                      <div className="text-[11px] font-mono leading-none text-gray-500">SUGGESTED HELP TOOL</div>
                      <div className="text-xs font-bold uppercase tracking-tight mt-0.5 text-gray-950">{toolName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BLOCK 16: Action Footer */}
          <section className="mt-8 pt-6 border-t-4 border-double border-gray-900 bg-neutral-900 text-white p-4 sm:p-6 relative">
            <span className="absolute right-2 top-2 text-[8px] text-gray-500 select-none font-mono opacity-25">A16_FOOTER</span>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              
              {/* Info Column */}
              <div className="space-y-2 max-w-md">
                <div className="text-xs font-mono tracking-widest text-red-500 font-black">
                  SARKARIBOARD HELP SHEET
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed font-mono">
                  This page gets simple data dynamically to show the correct notice. Please print this page to keep a physical copy.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-gray-400">
                  <div className="bg-neutral-800 px-2 py-0.5 border border-neutral-700">
                    READ TIME: {post.a16_footerInfo.readTime || "5 min"}
                  </div>
                  <div className="bg-neutral-800 px-2 py-0.5 border border-neutral-700">
                    STATUS: SEALED & PUBLISHED
                  </div>
                </div>
              </div>

              {/* QR Share Code */}
              <div className="flex items-center gap-3 bg-white p-2.5 border border-gray-900 shrink-0">
                <QRCode 
                  value={window.location.href} 
                  size={65} 
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  className="bg-white p-0.5"
                />
                <div className="text-gray-900 font-mono text-[9px] flex flex-col justify-between max-w-[120px]">
                  <div>
                    <span className="font-bold uppercase block text-red-800 mb-0.5">SCAN HERE</span>
                    Scan this code with your mobile camera to check this notice instantly.
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="mt-1.5 flex items-center justify-center gap-1 w-full bg-red-800 text-white py-1 px-1.5 text-[9px] uppercase font-bold tracking-wider hover:bg-black cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={10} /> COPIED!
                      </>
                    ) : (
                      <>
                        <Copy size={10} /> COPY LINK
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </section>

        </div> {/* End printableAreaRef */}
      </div> {/* End Paper Inner Container */}
    </div> {/* End Paper Column (Left) */}

    {/* Sidebar Column (Right) */}
    <aside className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6 no-print w-full min-w-0 overflow-hidden">
       
       {/* 1. SARKARIBOARD OFFICIAL ALERT DESK */}
       <div className="bg-[#FAF9F5] dark:bg-zinc-900 border-2 border-gray-900 dark:border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]">
         <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest text-[#1e293b] dark:text-zinc-100 border-b-2 border-gray-900 dark:border-zinc-700 pb-2 mb-3 flex items-center justify-between font-bold">
           <span>🔔 ALERT DESK / अलर्ट डेस्क</span>
           <span className="font-mono text-[9px] bg-red-800 text-white px-2 py-0.5 uppercase tracking-wide">Live Updates</span>
         </h3>
         <p className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 leading-relaxed mb-3 font-sans">
           जुड़ें भारत के सबसे बड़े सरकारी नौकरी सूचना नेटवर्क से और पाएं हर भर्ती का अपडेट सबसे पहले सीधे अपने फ़ोन पर!
         </p>
         <div className="flex flex-col gap-2">
           <a
             href="https://whatsapp.com/channel/0029Vb7jr5D17En1gOUJB01u"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1ca34d] text-white font-sans font-black text-xs uppercase tracking-wider py-2.5 px-3 border border-gray-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition transform active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer text-center select-none"
           >
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 00-5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
             </svg>
             <span>Join WhatsApp Channel</span>
           </a>
           <a
             href="https://t.me/sarkariboardweb"
             target="_blank"
             rel="noopener noreferrer"
             className="flex items-center justify-center gap-1.5 bg-[#0088cc] hover:bg-[#007cbd] active:bg-[#0070ab] text-white font-sans font-black text-xs uppercase tracking-wider py-2.5 px-3 border border-gray-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition transform active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer text-center select-none"
           >
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
               <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.136-.954l11.566-4.458c.538-.196 1.006.128.832.939z" />
             </svg>
             <span>Join Telegram Group</span>
           </a>
         </div>
       </div>
       
       {/* 2. ONLINE CANDIDATE HELP TOOLS BANNER */}
       <div className="bg-white dark:bg-zinc-900 border-2 border-gray-900 dark:border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]">
         <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest text-gray-950 dark:text-neutral-200 mb-2.5 border-b-2 border-gray-900 dark:border-zinc-700 pb-2 flex items-center justify-between font-bold">
           <span>🛠️ STUDENT HELP CENTER</span>
           <span className="font-mono text-[9px] bg-red-800 text-white px-2 py-0.5 uppercase tracking-wide">Free Tools</span>
         </h3>
         <p className="text-[11px] text-gray-500 dark:text-zinc-400 mb-3.5 leading-relaxed font-bold font-sans">
           परीक्षा फॉर्म भरने से पहले फोटो, सिग्नेचर को रिसाइज करें, सही आयु की गणना करें या बायोडाटा बनाएं:
         </p>
         <div className="flex flex-col gap-1.5 font-sans">
           {[
             { label: "📷 Photo Resizer Tool", key: "resizer" },
             { label: "🔄 PNG to JPG Converter", key: "converter" },
             { label: "📅 Cutoff Age Calculator", key: "age" },
             { label: "📝 Govt Resume-Biodata Maker", key: "biodata" },
             { label: "🔠 Name Case Capitalizer", key: "caps" }
           ].map((t) => (
             <button
               key={t.key}
               onClick={() => {
                 navigate('/tools');
                 setStore({ currentView: 'tools' });
               }}
               className="w-full text-left py-1.5 px-2.5 border border-gray-400 dark:border-zinc-700 hover:border-red-800 dark:hover:border-red-400 font-bold text-[11px] uppercase tracking-wide transition-all bg-neutral-50 dark:bg-zinc-800/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-900 dark:text-zinc-200 select-none cursor-pointer"
             >
               {t.label} ➔
             </button>
           ))}
         </div>
       </div>

       {/* 3. LATEST RELATED NOTICES BULLETINS */}
       {relatedPosts && relatedPosts.length > 0 && (
         <div className="bg-white dark:bg-zinc-900 border-2 border-gray-900 dark:border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]">
           <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest text-gray-950 dark:text-neutral-200 mb-3 border-b-2 border-gray-900 dark:border-zinc-700 pb-2 flex items-center justify-between font-bold">
             <span>📌 RELATED NOTICES / संबंधित सरकारी नौकरी</span>
             <span className="font-mono text-[9px] bg-amber-600 text-white px-2 py-0.5 uppercase tracking-wide">Jobs</span>
           </h3>
           <ul className="space-y-3 font-sans">
             {relatedPosts.map((r, idx) => (
               <li key={idx} className="border-b border-gray-250 dark:border-zinc-800 last:border-b-0 pb-2.5 last:pb-0 flex items-start gap-2">
                 <span className="text-red-800 dark:text-red-400 mt-0.5 font-bold shrink-0">⚡</span>
                 <a
                   href={r.url || `#`}
                   className="text-gray-950 dark:text-zinc-100 hover:text-red-800 dark:hover:text-red-400 font-bold text-xs leading-snug tracking-tight hover:underline block"
                 >
                   {r.title}
                 </a>
               </li>
             ))}
           </ul>
         </div>
       )}

       {/* 4. POPULAR FILTERS / CAREER PILLS */}
       <div className="bg-[#FAF9F5] dark:bg-zinc-900/40 border-2 border-gray-900 dark:border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]">
         <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest text-[#1e293b] dark:text-zinc-100 border-b-2 border-gray-900 dark:border-zinc-700 pb-2 mb-3 font-bold">
           🏷️ QUICK JOB FILTERS / नौकरी फ़िल्टर
         </h3>
         <div className="flex flex-wrap gap-1.5">
           {[
             { label: "10th Pass Jobs", filter: { selectedQualification: "10th Pass", selectedState: "all", searchKeyword: "" } },
             { label: "12th Pass Jobs", filter: { selectedQualification: "12th Pass", selectedState: "all", searchKeyword: "" } },
             { label: "Graduate Jobs", filter: { selectedQualification: "Graduate", selectedState: "all", searchKeyword: "" } },
             { label: "Bihar Recruitment", filter: { selectedState: "Bihar", selectedQualification: "all", searchKeyword: "" } },
             { label: "UP Recruitment", filter: { selectedState: "Uttar Pradesh", selectedQualification: "all", searchKeyword: "" } },
             { label: "Railway Updates", filter: { searchKeyword: "Railway", selectedState: "all", selectedQualification: "all" } },
             { label: "SSC Board Notice", filter: { searchKeyword: "SSC", selectedState: "all", selectedQualification: "all" } },
             { label: "Police Careers", filter: { searchKeyword: "Police", selectedState: "all", selectedQualification: "all" } }
           ].map((pill, pidx) => (
             <button
               key={pidx}
               onClick={() => {
                 setStore(pill.filter);
                 onBack?.();
               }}
               className="px-2 py-1 border border-gray-900 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-950 dark:text-zinc-200 hover:bg-red-800 hover:text-white dark:hover:bg-red-900 transition-colors cursor-pointer select-none text-[10px] uppercase font-bold tracking-wide"
             >
               {pill.label}
             </button>
           ))}
         </div>
       </div>

       {/* 5. IMPORTANT CITIZEN SERVICES TABLE BOX */}
       <div className="bg-white dark:bg-zinc-900 border-2 border-gray-900 dark:border-zinc-700 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(39,39,42,1)]">
         <h3 className="font-sans font-black text-xs sm:text-sm uppercase tracking-widest text-[#1e293b] dark:text-neutral-200 mb-2.5 border-b-2 border-gray-900 dark:border-zinc-700 pb-2 flex items-center justify-between font-bold">
           <span>💼 PUBLIC SERVICES / जन सेवाएं</span>
           <span className="font-mono text-[9px] bg-red-800 text-white px-2 py-0.5 uppercase tracking-wide">Govt Links</span>
         </h3>
         <div className="flex flex-col gap-2 font-sans text-xs">
           {[
             { title: "Download Aadhaar Card", url: "https://uidai.gov.in" },
             { title: "Check PAN Card Status", url: "https://www.pan.utiitsl.com" },
             { title: "Apply New Voter ID Card", url: "https://voters.eci.gov.in" },
             { title: "Ration Card Beneficiary List", url: "https://nfsa.gov.in" },
             { title: "Driving License Search", url: "https://sarathi.parivahan.gov.in" }
           ].map((srv, sIdx) => (
             <a
               key={sIdx}
               href={srv.url}
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-between py-1 px-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors border-b border-gray-200 dark:border-zinc-850 last:border-0"
             >
               <span className="font-bold text-gray-900 dark:text-zinc-300 truncate text-[11px] uppercase tracking-wide">
                 {srv.title}
               </span>
               <span className="text-red-800 dark:text-red-400 font-bold shrink-0 font-mono text-[10px] ml-2">➔ VISIT</span>
             </a>
           ))}
         </div>
       </div>

    </aside> {/* End Sidebar Column */}

  </div> {/* End Grid */}
</div> {/* End Core Container max-w-1580px */}
</div>

  );
};
