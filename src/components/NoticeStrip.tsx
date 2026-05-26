import React, { useState } from 'react';
import { Megaphone, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function NoticeStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div id="notice-strip" className="bg-red-800 text-white px-4 py-2 text-xs font-sans flex items-center justify-between gap-3 shadow-md border-b border-red-950">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        
        {/* Notice Info */}
        <div className="flex items-center gap-2">
          <div className="bg-amber-400 text-red-950 p-1 rounded-md shrink-0">
            <Megaphone className="w-3.5 h-3.5 animate-bounce" />
          </div>
          <span className="font-semibold tracking-wide">
            IMPORTANT LINK STATUS:
          </span>
          <span className="text-amber-300 font-extrabold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400 inline" />
            BSEB Matric 10th Result Server Link 1 & 2 is ACTIVE. Check roll code now.
          </span>
        </div>

        {/* Action Link & Close */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[11px] text-red-200">
            Server Load: Optimal (0.1ms)
          </span>
          <button
            onClick={() => setVisible(false)}
            className="hover:bg-red-900 text-red-200 hover:text-white p-1 rounded-full transition"
            aria-label="Dismiss notice"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
