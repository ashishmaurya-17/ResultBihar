import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, AlertTriangle, CheckCircle, Info, Clock, Sparkles, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { usePortalStore } from '../store';
import SEO from './SEO';

export default function NotificationsPage() {
  const [store, setStore] = usePortalStore();
  const [digest, setDigest] = useState<string | null>(null);
  const [loadingDigest, setLoadingDigest] = useState(true);
  const [isAiPowered, setIsAiPowered] = useState(false);

  useEffect(() => {
    // When visiting the page, clear unread count and update last viewed ID
    if (store.notificationHistory?.length) {
      const topId = store.notificationHistory[0].id;
      localStorage.setItem('lastViewedNotificationId', topId.toString());
      setStore({ unreadNotificationCount: 0, lastViewedNotificationId: topId });
    }
  }, [store.notificationHistory, setStore]);

  const fetchDigest = async () => {
    setLoadingDigest(true);
    try {
      const res = await fetch('/api/notifications/digest');
      const data = await res.json();
      if (data.digest) {
        setDigest(data.digest);
        setIsAiPowered(!!data.isAiPowered);
      }
    } catch (e) {
      console.warn('Failed to fetch notifications digest:', e);
    } finally {
      setLoadingDigest(false);
    }
  };

  useEffect(() => {
    fetchDigest();
  }, [store.notificationHistory]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50';
      case 'success': return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50';
      default: return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50';
    }
  };

  return (
    <>
      <SEO 
        title="System Alerts & Notifications - SarkariBoard"
        description="History of high-volume alerts and system notifications for government job seekers."
      />
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 min-h-[60vh]">
        <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-2xl flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
            <Bell className="w-6 h-6 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
              System Alerts History
            </h1>
            <p className="text-sm font-bold uppercase tracking-widest text-neutral-500">Official Notification Sync Stream</p>
          </div>
        </div>

        {/* --- DAILY DIGEST SUMMARY SECTION --- */}
        <div className="mb-10">
          {loadingDigest ? (
            <div className="bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/6" />
              </div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-4/5" />
            </div>
          ) : digest ? (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white dark:bg-zinc-900/50 border border-neutral-200/80 dark:border-neutral-800/80 shadow-md rounded-[32px] p-6 sm:p-8 overflow-hidden"
            >
              {/* Premium Background Glimmer */}
              <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              <div className="absolute -top-10 -left-10 w-44 h-44 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-500/5 dark:bg-amber-500/10 blur-3xl rounded-full" />

              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/60 pb-5 mb-5 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                    <Sparkles size={16} className={isAiPowered ? "text-amber-500 animate-pulse" : "text-blue-500"} />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                      Daily Digest Summary
                    </h2>
                     <p className="text-[9px] font-black uppercase tracking-[0.15em] text-neutral-400">
                       Curated Notification Briefing
                     </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isAiPowered && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                      <Sparkles size={10} /> AI Generated
                    </span>
                  )}
                  <button 
                    onClick={fetchDigest}
                    title="Refresh Daily Digest"
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-neutral-800/85 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all cursor-pointer"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>

              <div className="relative z-10 prose prose-sm dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                <ReactMarkdown>{digest}</ReactMarkdown>
              </div>
            </motion.div>
          ) : null}
        </div>

        {(!store.notificationHistory || store.notificationHistory.length === 0) ? (
          <div className="relative bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200 dark:border-neutral-800/80 rounded-[32px] p-12 sm:p-16 text-center overflow-hidden">
             {/* Decorative Background Elements */}
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at center, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

             {/* Live Scanner Visual Animation */}
             <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
               <motion.div
                 animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.4, 0.15] }}
                 transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                 className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-full"
               />
               <motion.div
                 animate={{ scale: [1.1, 1.6, 1.1], opacity: [0.05, 0.2, 0.05] }}
                 transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
                 className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full border border-emerald-500/20"
               />
               <div className="relative z-10 w-14 h-14 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700 shadow-lg flex items-center justify-center">
                 <Bell className="w-6 h-6 text-neutral-400 dark:text-neutral-500" />
               </div>
               
               {/* Small Green Blinking Status Dot */}
               <span className="absolute bottom-1 right-1 flex h-4 w-4">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
               </span>
             </div>

             {/* Dynamic Status Badge */}
             <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 mb-6">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                 Automation Live & Scanning
               </span>
             </div>

             {/* Message */}
             <h3 className="text-xl sm:text-2xl font-black uppercase text-neutral-800 dark:text-white tracking-tight mb-3">
               Inbox Clear & Quiet
             </h3>
             <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
               Our scraping pipelines are active, monitoring and structuring real-time notifications. When high-volume government job sync events occur, they will instantly stream and record below.
             </p>
          </div>
        ) : (
          <div className="space-y-4">
            {store.notificationHistory.map((notif: any, i) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-5 rounded-2xl border ${getBgClass(notif.type)} flex flex-col sm:flex-row gap-4 sm:items-start group hover:shadow-md transition-shadow`}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-sm">
                      {notif.type === 'warning' ? 'CRITICAL UPDATE' : 'SYSTEM INFO'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase">
                      <Clock size={12} />
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-200 text-sm sm:text-base leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
