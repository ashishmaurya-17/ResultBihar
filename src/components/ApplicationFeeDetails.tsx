import React, { useState, useEffect } from 'react';
import { ApplicationFee } from '../types';

interface ApplicationFeeDetailsProps {
  fee: ApplicationFee;
}

export const ApplicationFeeDetails: React.FC<ApplicationFeeDetailsProps> = ({ fee }) => {
  if (!fee) return null;

  const [selectedFeeType, setSelectedFeeType] = useState<'general' | 'scst' | 'ph'>('general');
  const [cyberCharges, setCyberCharges] = useState<number>(50);
  const [miscFee, setMiscFee] = useState<number>(20);

  // Parse numeric values from string fields
  const parseFeeNumber = (val: string): number => {
    if (!val) return 0;
    const digitsOnly = val.replace(/[^0-9]/g, '');
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  };

  const generalCost = parseFeeNumber(fee.generalOBC);
  const scstCost = parseFeeNumber(fee.ewsSCST);
  const phCost = parseFeeNumber(fee.ph);

  const getBaseFee = (): number => {
    if (selectedFeeType === 'general') return generalCost;
    if (selectedFeeType === 'scst') return scstCost;
    return phCost;
  };

  const baseFeeText = (): string => {
    if (selectedFeeType === 'general') return fee.generalOBC || 'Nil';
    if (selectedFeeType === 'scst') return fee.ewsSCST || 'Nil';
    return fee.ph || 'Nil';
  };

  const totalEstimate = getBaseFee() + cyberCharges + miscFee;

  const feeItems = [
    { label: 'General / OBC / EWS', value: fee.generalOBC },
    { label: 'SC / ST / PH', value: fee.ewsSCST },
    { label: 'Payment Mode', value: fee.mode },
    { label: 'Bank Charges', value: fee.bankCharges },
  ];

  return (
    <div className="space-y-4 my-6 p-4 border-2 border-emerald-400 dark:border-emerald-800 bg-emerald-50/20 dark:bg-emerald-950/20 rounded-xl">
      <h3 className="text-[11px] font-bold uppercase text-gray-700 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800 pb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-800 text-white px-1.5 py-0.5 text-[9px]">FEES</span>
          <span>Application Fee Details</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400">Verified Updates</span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {feeItems.map((item, index) => (
          <div key={index} className="bg-white dark:bg-zinc-900 p-3 border border-gray-200 dark:border-zinc-800 shadow-sm rounded-lg">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
              {item.value || 'N/A'}
            </div>
          </div>
        ))}
      </div>

      {/* Cyber Cafe and Extra Expense Interactive Pocket Calculator */}
      <div className="bg-white dark:bg-zinc-900/50 p-4 border border-emerald-200 dark:border-emerald-800/60 rounded-xl mt-4">
        <h4 className="text-xs font-black uppercase text-emerald-855 dark:text-emerald-400 flex items-center gap-1.5 mb-3 select-none">
          <span>⚙️ Portal Expense Estimator (कुल खर्च अनुमानक)</span>
          <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 px-1.5 py-0.5 rounded">BUDGET TOOL</span>
        </h4>
        
        <p className="text-[11px] text-gray-500 dark:text-zinc-400 mb-3 leading-relaxed">
          In India, applying for government forms can incur Cyber Cafe charges, online transaction fees, and travel/photo expenses. Adjust the settings below to estimate your exact pocket expense!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-gray-150 dark:border-zinc-800 py-3 mb-3">
          {/* Base Fee selection */}
          <div>
            <label className="block text-[10px] font-bold text-gray-550 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              1. Your Category Fee (वर्ग शुल्क)
            </label>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="feeType" 
                  checked={selectedFeeType === 'general'} 
                  onChange={() => setSelectedFeeType('general')}
                  className="accent-emerald-750"
                />
                <span>Gen / OBC: ₹{generalCost}</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer">
                <input 
                  type="radio" 
                  name="feeType" 
                  checked={selectedFeeType === 'scst'} 
                  onChange={() => setSelectedFeeType('scst')}
                  className="accent-emerald-750"
                />
                <span>SC / ST / PH: ₹{scstCost}</span>
              </label>
            </div>
          </div>

          {/* Cyber Cafe Cost selection */}
          <div>
            <label className="block text-[10px] font-bold text-gray-550 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              2. Cafe Fees (कैफे शुल्क)
            </label>
            <select
              value={cyberCharges}
              onChange={(e) => setCyberCharges(parseInt(e.target.value, 10))}
              className="w-full bg-gray-50 dark:bg-zinc-800 text-xs px-2.5 py-1.5 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-emerald-500 rounded"
            >
              <option value="0">₹0 (Apply Myself Online)</option>
              <option value="40">₹40 (Minimum Charge)</option>
              <option value="50">₹50 (Average cyber cafe rate)</option>
              <option value="100">₹100 (Standard cyber fee)</option>
              <option value="150">₹150 (Form + Document Scan)</option>
            </select>
          </div>

          {/* Miscellaneous cost selection */}
          <div>
            <label className="block text-[10px] font-bold text-gray-550 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
              3. Extra Expenses (अतिरिक्त खर्च)
            </label>
            <select
              value={miscFee}
              onChange={(e) => setMiscFee(parseInt(e.target.value, 10))}
              className="w-full bg-gray-50 dark:bg-zinc-800 text-xs px-2.5 py-1.5 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-emerald-500 rounded"
            >
              <option value="0">₹0 (None)</option>
              <option value="20">₹20 (Photocopies & Stamp)</option>
              <option value="50">₹50 (Travel + Photo print)</option>
              <option value="100">₹100 (Travel + Courier + Stamps)</option>
            </select>
          </div>
        </div>

        {/* Estimation calculation readout */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3.5 bg-emerald-100/30 dark:bg-emerald-950/40 border-2 border-emerald-500/30 rounded-xl gap-2 select-none">
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800 dark:text-emerald-400">
              ESTIMATED PORTAL EXPENSE / अनुमानित व्यय
            </span>
            <div className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
              Base Fee (₹{getBaseFee()}) + Cyber Cafe (₹{cyberCharges}) + Extra (₹{miscFee})
            </div>
          </div>
          <div className="text-right sm:text-left shrink-0">
            <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-400 font-mono">
              ₹ {totalEstimate} /-
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
