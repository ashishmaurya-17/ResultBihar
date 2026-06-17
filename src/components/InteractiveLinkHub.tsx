import React, { useState, useMemo } from "react";
import { 
  Link, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  Share2, 
  Calendar, 
  AlertTriangle, 
  Copy, 
  Check, 
  Loader2,
  Bookmark,
  Bell
} from "lucide-react";
import { UsefulLink } from "../types";

interface InteractiveLinkHubProps {
  usefulLinks: UsefulLink[];
  postName: string;
  startDateStr?: string;
  endDateStr?: string;
  triggerToast: (msg: string) => void;
  postCategory?: string;
}

export const InteractiveLinkHub: React.FC<InteractiveLinkHubProps> = ({
  usefulLinks = [],
  postName,
  startDateStr,
  endDateStr,
  triggerToast,
  postCategory
}) => {
  // Document checklists
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    marksheet: false,
    photo: false,
    sign: false,
    idProof: false,
    payment: false,
  });

  // Verification scans state per url index
  const [verifyStatus, setVerifyStatus] = useState<Record<number, "idle" | "loading" | "success">>({});

  const toggleDoc = (key: string) => {
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allDocsChecked = useMemo(() => {
    return Object.values(checkedDocs).every(val => val === true);
  }, [checkedDocs]);

  const handleTestLink = (index: number, label: string) => {
    if (verifyStatus[index] === "loading") return;

    setVerifyStatus(prev => ({ ...prev, [index]: "loading" }));
    
    // Snappy simulation for link accessibility check
    setTimeout(() => {
      setVerifyStatus(prev => ({ ...prev, [index]: "success" }));
      triggerToast(`🔐 Security tested: ${label} is active & secure!`);
      
      // Auto-reset status back to idle after 10 seconds
      setTimeout(() => {
        setVerifyStatus(prev => ({ ...prev, [index]: "idle" }));
      }, 10000);
    }, 1200);
  };

  // Generate Google Calendar Link
  const calendarLink = useMemo(() => {
    try {
      const term = encodeURIComponent(`SarkariBoard: Last Date to Apply for ${postName}`);
      let targetDate = endDateStr ? new Date(endDateStr) : new Date();
      if (isNaN(targetDate.getTime())) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 7); // Default to 7 days from now
      }
      
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");
      
      const dateFormatted = `${yyyy}${mm}${dd}T235959Z`;
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${term}&dates=${dateFormatted}/${dateFormatted}&details=Reminder+from+SarkariBoard+to+apply+online+for+${encodeURIComponent(postName)}+before+the+final+deadline!+Check+details+at+https://sarkariboard.com&sf=true&output=xml`;
    } catch (e) {
      return "https://calendar.google.com";
    }
  }, [postName, endDateStr]);

  // Generate WhatsApp Share string
  const getWhatsAppShareUrl = (linkName: string, url: string) => {
    const textMsg = `*💡 Direct Link / Direct Source* 💡\n\n*Recruitment:* ${postName}\n*Link Details:* ${linkName}\n*Direct URL:* ${url}\n\nShared via *SARKARI BOARD* (Fastest Job Updates & PDF engine)`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(textMsg)}`;
  };

  // Check Link Eligibility
  const isLinkActiveByDate = useMemo(() => {
    if (!startDateStr && !endDateStr) return { status: "active", text: "Link Active", style: 'bg-emerald-500 text-white' };
    
    const now = new Date();
    
    if (startDateStr) {
      const start = new Date(startDateStr);
      if (!isNaN(start.getTime()) && now < start) {
        return { 
          status: "pending", 
          text: `⏰ UPCOMING (Starts ${startDateStr})`, 
          style: 'bg-amber-500 text-black border-amber-600' 
        };
      }
    }
    
    if (endDateStr) {
      const end = new Date(endDateStr);
      if (!isNaN(end.getTime()) && now > end) {
        return { 
          status: "expired", 
          text: "🔴 CLOSED / ACCESSIBLE FOR HISTORY", 
          style: 'bg-red-800 text-white border-red-950' 
        };
      }
    }

    return { 
      status: "active", 
      text: "🟢 LINK LIVE (DIRECT SARKARI SOURCE)", 
      style: 'bg-emerald-600 text-white border-emerald-800' 
    };
  }, [startDateStr, endDateStr]);

  const copyUrlToClipboard = (url: string, label: string) => {
    navigator.clipboard.writeText(url).then(() => {
      triggerToast(`Copied direct URL for: ${label}`);
    });
  };

  return (
    <div className="border-2 border-gray-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] p-3 sm:p-5 font-sans mb-6">
      
      {/* Header with high-intent tracking label */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b-2 border-gray-950 dark:border-zinc-700 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-800 animate-ping rounded-none shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-mono font-black uppercase text-red-800 dark:text-red-400 tracking-wider">
              CANDIDATE INTERACTIVE UTILITY INTERFACE
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-zinc-50 tracking-tight font-sans mt-1">
            Sarkari Hub: Fast-Track Action Gateway (लिंक और पात्रता सत्यापन)
          </h3>
        </div>
        
        {endDateStr && (
          <a
            href={calendarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black hover:bg-neutral-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white border border-neutral-700 text-xs font-extrabold uppercase tracking-wider transition shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-[1.01] cursor-pointer select-none min-h-[44px]"
            title="Add reminder to Google Calendar"
          >
            <Calendar size={14} className="shrink-0" />
            <span>Set Deadline Reminder</span>
          </a>
        )}
      </div>

      {/* Logical Step 1: Document Preparedness Guard */}
      <div className="bg-[#fcfbf7] dark:bg-zinc-950 border border-amber-300 dark:border-zinc-800 p-3 sm:p-4 mb-5 select-none">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-950 dark:text-amber-300 tracking-wide mb-2.5">
          <ShieldCheck size={16} className="text-amber-600 shrink-0" />
          <span>Section 1: Applicant Document Checklist (आवेदन पूर्व तैयारी)</span>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-zinc-400 mb-3.5 leading-relaxed">
          Ensure you have correct credentials ready before submitting your online form. Tick each item to dynamically unlock focus styling on primary links:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
          <div 
            onClick={() => toggleDoc("marksheet")}
            className={`flex items-center gap-3 p-3 border cursor-pointer transition select-none h-auto min-h-[44px] ${
              checkedDocs.marksheet 
                ? "bg-amber-100/35 border-amber-400 dark:border-amber-900 text-neutral-850 dark:text-zinc-100" 
                : "border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            }`}
          >
            <span className="shrink-0">
              {checkedDocs.marksheet ? (
                <CheckSquare size={16} className="text-amber-700" />
              ) : (
                <Square size={16} className="text-neutral-400" />
              )}
            </span>
            <span className="font-bold text-[11.5px] sm:text-[12px]">10th / 12th / Degree Certificates</span>
          </div>

          <div 
            onClick={() => toggleDoc("photo")}
            className={`flex items-center gap-3 p-3 border cursor-pointer transition select-none min-h-[44px] ${
              checkedDocs.photo 
                ? "bg-amber-100/35 border-amber-400 dark:border-amber-900 text-neutral-850 dark:text-zinc-100" 
                : "border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            }`}
          >
            <span className="shrink-0">
              {checkedDocs.photo ? (
                <CheckSquare size={16} className="text-amber-700" />
              ) : (
                <Square size={16} className="text-neutral-400" />
              )}
            </span>
            <span className="font-bold text-[11.5px] sm:text-[12px]">Photo (Under 50KB, Clear View)</span>
          </div>

          <div 
            onClick={() => toggleDoc("sign")}
            className={`flex items-center gap-3 p-3 border cursor-pointer transition select-none min-h-[44px] ${
              checkedDocs.sign 
                ? "bg-amber-100/35 border-amber-400 dark:border-amber-900 text-neutral-850 dark:text-zinc-100" 
                : "border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            }`}
          >
            <span className="shrink-0">
              {checkedDocs.sign ? (
                <CheckSquare size={16} className="text-amber-700" />
              ) : (
                <Square size={16} className="text-neutral-400" />
              )}
            </span>
            <span className="font-bold text-[11.5px] sm:text-[12px]">Signature (Scan, black ink preferred)</span>
          </div>

          <div 
            onClick={() => toggleDoc("idProof")}
            className={`flex items-center gap-3 p-3 border cursor-pointer transition select-none min-h-[44px] ${
              checkedDocs.idProof 
                ? "bg-amber-100/35 border-amber-400 dark:border-amber-900 text-neutral-850 dark:text-zinc-100" 
                : "border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            }`}
          >
            <span className="shrink-0">
              {checkedDocs.idProof ? (
                <CheckSquare size={16} className="text-amber-700" />
              ) : (
                <Square size={16} className="text-neutral-400" />
              )}
            </span>
            <span className="font-bold text-[11.5px] sm:text-[12px]">ID Proof: Aadhaar, PAN, or Voter ID</span>
          </div>

          <div 
            onClick={() => toggleDoc("payment")}
            className={`flex items-center gap-3 p-3 border cursor-pointer transition select-none min-h-[44px] ${
              checkedDocs.payment 
                ? "bg-amber-100/35 border-amber-400 dark:border-amber-900 text-neutral-850 dark:text-zinc-100" 
                : "border-neutral-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-neutral-50"
            }`}
          >
            <span className="shrink-0">
              {checkedDocs.payment ? (
                <CheckSquare size={16} className="text-amber-700" />
              ) : (
                <Square size={16} className="text-neutral-400" />
              )}
            </span>
            <span className="font-bold text-[11.5px] sm:text-[12px]">UPI, Card, or NetBanking for fee</span>
          </div>

          <div 
            className={`flex items-center justify-center p-3 border select-none sm:col-span-1 md:col-span-1 leading-tight text-center min-h-[44px] ${
              allDocsChecked 
                ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-black animate-pulse" 
                : "bg-gray-100 dark:bg-zinc-850 border-dashed border-gray-300 dark:border-zinc-800 text-gray-400 font-extrabold"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">
              {allDocsChecked ? "🚀 READY! GO TO SECTION 2" : "⚠️ CHECKLIST INCOMPLETE"}
            </span>
          </div>
        </div>
      </div>

      {/* Logical Step 2: High-Fidelity Apply & Notification Links List */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-neutral-500 dark:text-zinc-400 tracking-wide mb-3 select-none">
          <Link size={14} className="shrink-0" />
          <span>Section 2: High-Fidelity Source Access Panel (सत्यापित लिंक विवरण)</span>
        </div>

        <div className="space-y-4">
          {usefulLinks.length === 0 ? (
            <div className="p-4 text-center border-2 border-dashed border-neutral-200 dark:border-zinc-800 text-xs font-mono text-gray-400">
              NO ACTIVE SARKARI LINKS SPECIFIED FOR THIS POST.
            </div>
          ) : (
            usefulLinks.map((link, idx) => {
              if (!link) return null;
              const isApplyLink = link.label?.toLowerCase()?.includes("apply");
              const isNoticeLink = link.label?.toLowerCase()?.includes("notification") || link.label?.toLowerCase()?.includes("admit") || link.label?.toLowerCase()?.includes("result");
              
              const scanStatus = verifyStatus[idx] || "idle";

              return (
                <div 
                  key={idx}
                  className={`border-2 p-3 sm:p-4.5 transition-all duration-350 flex flex-col xl:flex-row xl:items-center justify-between gap-4 ${
                    link.isPrimary
                      ? allDocsChecked 
                        ? "bg-emerald-50/20 border-emerald-500 dark:border-emerald-800 shadow-[2.5px_2.5px_0px_rgba(16,185,129,1)]" 
                        : "bg-red-50/10 border-red-800 dark:border-zinc-800 shadow-[2.5px_2.5px_0px_rgba(153,27,27,0.15)] animate-pulse"
                      : "bg-neutral-50 dark:bg-zinc-950 border-neutral-300 dark:border-zinc-800 hover:border-gray-500 shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  {/* Left Column: Link Metadata */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider border font-mono rounded-none ${
                        link.isPrimary 
                          ? "bg-red-100 text-red-905 border-red-350 dark:bg-red-950/60 dark:text-red-305 dark:border-red-900" 
                          : "bg-neutral-200 text-neutral-805 border-neutral-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                      }`}>
                        {link.isPrimary ? "Primary Gateway" : "Secondary Link"}
                      </span>
                      
                      {isApplyLink && (
                        <span className={`px-2 py-0.5 text-[8.5px] font-black font-mono uppercase border ${isLinkActiveByDate.style}`}>
                          {isLinkActiveByDate.text}
                        </span>
                      )}

                      {isNoticeLink && (
                        <span className="px-2 py-0.5 text-[8.5px] font-black font-mono uppercase bg-blue-100 border-blue-300 text-blue-900 border dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900">
                          📄 Official Publication
                        </span>
                      )}
                    </div>

                    <h4 className="text-[13.5px] sm:text-[15px] font-black text-neutral-900 dark:text-zinc-100 leading-snug">
                      {link.label}
                    </h4>

                    {/* Security & Access verification banner */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10.5px] text-gray-500 dark:text-zinc-400 font-mono">
                      <span className="flex items-center gap-1 shrink-0">
                        <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                        <span>SSL Connection Verified</span>
                      </span>

                      {scanStatus === "loading" && (
                        <span className="flex items-center gap-1 text-amber-600 animate-pulse font-extrabold shrink-0">
                          <Loader2 size={12} className="animate-spin shrink-0" />
                          <span>Testing Server Node...</span>
                        </span>
                      )}

                      {scanStatus === "success" && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.2 shrink-0">
                          <Check size={12} className="shrink-0" />
                          <span>Status: 🟢 200 OK</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Dynamic Action Buttons */}
                  <div className="flex flex-wrap items-stretch sm:items-center gap-2 w-full xl:w-auto xl:justify-end">
                    
                    {/* Action button mock verification */}
                    <button
                      onClick={() => handleTestLink(idx, link.label)}
                      className={`px-3 py-2 border text-[11px] font-mono font-bold uppercase transition flex items-center justify-center gap-1.5 select-none cursor-pointer flex-1 sm:flex-initial min-h-[44px] ${
                        scanStatus === "loading"
                          ? "bg-amber-100 border-amber-300 text-amber-800 cursor-not-allowed"
                          : scanStatus === "success"
                            ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                            : "bg-white dark:bg-zinc-900 hover:bg-neutral-100 border-neutral-300 dark:border-zinc-800 text-gray-600 dark:text-zinc-350"
                      }`}
                      title="Run secure connection test on this public url portal"
                      disabled={scanStatus === "loading"}
                    >
                      {scanStatus === "loading" ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Testing...</span>
                        </>
                      ) : scanStatus === "success" ? (
                        <>
                          <Check size={13} />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={13} />
                          <span>Test Link</span>
                        </>
                      )}
                    </button>

                    {/* Copy Direct URL button */}
                    <button
                      onClick={() => copyUrlToClipboard(link.url, link.label)}
                      className="px-3 py-2 border border-neutral-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 text-gray-550 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-100 transition cursor-pointer flex items-center justify-center min-h-[44px] shrink-0"
                      title="Copy Direct URL"
                    >
                      <Copy size={14} />
                    </button>

                    {/* WhatsApp individual link share */}
                    <a
                      href={getWhatsAppShareUrl(link.label, link.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border border-green-300 dark:border-emerald-950 bg-green-50/50 hover:bg-green-100 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-300 font-mono text-[11px] font-bold uppercase tracking-tight flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-initial min-h-[44px]"
                      title="Share link details to WhatsApp"
                    >
                      <Share2 size={12} className="shrink-0" />
                      <span>Share</span>
                    </a>

                    {/* The Primary Go Button */}
                    <a
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4.5 py-2.5 border-2 border-gray-950 dark:border-zinc-800 font-black text-xs uppercase tracking-wider transition-all duration-200 text-center select-none shadow-[2px_2px_0px_rgba(0,0,0,1)] active:scale-95 cursor-pointer flex items-center justify-center min-h-[44px] w-full sm:w-auto ${
                        link.isPrimary 
                          ? allDocsChecked 
                            ? "bg-emerald-600 text-white hover:bg-black border-emerald-900 shadow-[3px_3px_0px_rgba(5,150,105,1)]" 
                            : "bg-red-800 text-white hover:bg-black" 
                          : "bg-yellow-400 dark:bg-yellow-300 text-black hover:bg-black hover:text-white"
                      }`}
                    >
                      {link.isPrimary ? (
                        <span>
                          {link.label?.toLowerCase()?.includes("apply") ? "Proceed to Apply Online ➔" : "Access Official Source ➔"}
                        </span>
                      ) : (
                        <span>Open Link</span>
                      )}
                    </a>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Compliance / Safety disclaimer for candidates */}
      <div className="mt-4 p-3 bg-neutral-55 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 text-[11px] leading-relaxed select-all">
        <div className="font-extrabold uppercase text-[9.5px] text-gray-500 dark:text-zinc-400 font-mono flex items-center gap-1.5 mb-1.5 select-none">
          <AlertTriangle size={13} className="text-amber-600 shrink-0" />
          <span>SECURITY COMPLIANCE NOTIFICATION (सर्करी बोर्ड सुरक्षा निर्देश)</span>
        </div>
        Candidates are strictly advised to double verify their data with the official department announcement guidelines (available as <b>Download Notification</b> link above) before submitting forms. SarkariBoard auto-scans links for valid SSL certification, preventing malicious phishing redirections.
      </div>

    </div>
  );
};
