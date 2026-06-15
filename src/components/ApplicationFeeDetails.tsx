import React from 'react';
import { ApplicationFee } from '../types';

interface ApplicationFeeDetailsProps {
  fee: ApplicationFee;
}

export const ApplicationFeeDetails: React.FC<ApplicationFeeDetailsProps> = ({ fee }) => {
  if (!fee) return null;

  const feeItems = [
    { label: 'General / OBC / EWS', value: fee.generalOBC },
    { label: 'SC / ST / PH', value: fee.ewsSCST },
    { label: 'Payment Mode', value: fee.mode },
    { label: 'Bank Charges', value: fee.bankCharges },
  ];

  return (
    <div className="space-y-3 my-6 p-4 border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl">
      <h3 className="text-[11px] font-bold uppercase text-gray-700 dark:text-zinc-400 border-b border-gray-200 pb-1.5 flex items-center gap-2">
        <span className="bg-emerald-800 text-white px-1.5 py-0.5 text-[9px]">FEES</span>
        Application Fee Details
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {feeItems.map((item, index) => (
          <div key={index} className="bg-white dark:bg-zinc-800 p-3 border border-gray-200 dark:border-zinc-700 shadow-sm">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              {item.label}
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
              {item.value || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
