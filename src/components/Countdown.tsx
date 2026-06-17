import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="bg-red-50 dark:bg-zinc-900 border-2 border-red-800 dark:border-red-900 rounded-none p-3 flex items-center justify-between gap-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.05)]">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-red-600 animate-pulse" />
        <span className="font-sans font-black text-[10px] sm:text-xs text-red-800 uppercase tracking-tighter">Registration Closes In:</span>
      </div>
      <div className="flex gap-1.5 font-mono text-xs sm:text-sm font-black text-red-700">
        <div className="flex flex-col items-center">
          <span>{timeLeft.days}</span>
          <span className="text-[8px] uppercase opacity-60 font-sans">Days</span>
        </div>
        <span className="opacity-30">:</span>
        <div className="flex flex-col items-center">
          <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className="text-[8px] uppercase opacity-60 font-sans">Hrs</span>
        </div>
        <span className="opacity-30">:</span>
        <div className="flex flex-col items-center">
          <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className="text-[8px] uppercase opacity-60 font-sans">Min</span>
        </div>
      </div>
    </div>
  );
}
