import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { usePortalStore } from '../store';

export default function NotificationToast() {
  const [store, setStore] = usePortalStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Initial poll for notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        
        let updates: any = {};
        let shouldUpdate = false;
        
        if (data.history) {
          updates.notificationHistory = data.history;
          
          // Calculate unread count
          const lastId = store.lastViewedNotificationId || 0;
          const unread = data.history.filter((n: any) => n.id > lastId).length;
          updates.unreadNotificationCount = unread;
          shouldUpdate = true;
        }

        if (data.notification && (!store.systemNotification || data.notification.id !== store.systemNotification.id)) {
          updates.systemNotification = data.notification;
          shouldUpdate = true;
        }
        
        if (shouldUpdate) {
            setStore(updates);
        }
      } catch (e) {
        console.warn('Failed to fetch notifications:', e);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [store.systemNotification, setStore]);

  useEffect(() => {
    if (store.systemNotification) {
      setVisible(true);
      // Auto-hide after 15 seconds
      const timer = setTimeout(() => {
        setVisible(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [store.systemNotification]);

  // Sync the manual footer button toggle
  const isDisplaying = visible || store.isNotificationPanelOpen;

  const handleClose = () => {
    setVisible(false);
    setStore({ isNotificationPanelOpen: false });
  };

  const getIcon = () => {
    if (!store.systemNotification) return <Info className="text-neutral-500" size={24} />;
    switch (store.systemNotification.type) {
      case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
      case 'success': return <CheckCircle className="text-emerald-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  return (
    <AnimatePresence>
      {isDisplaying && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-6 z-[100] max-w-md w-full origin-bottom-right"
        >
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-[32px] shadow-2xl flex items-start gap-5 relative overflow-hidden backdrop-blur-xl">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full" />
            
            <div className="shrink-0 w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              {getIcon()}
            </div>
            
            <div className="flex-grow space-y-1 pr-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">System Broadcast</h4>
               <p className="text-sm font-bold text-white leading-relaxed">
                 {store.systemNotification?.message || "All systems operational. No new alerts at this time."}
               </p>
            </div>

            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors text-neutral-500 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
