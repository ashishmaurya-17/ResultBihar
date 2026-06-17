import React, { useState, useEffect } from 'react';
import { ApplicationFee } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Sliders, 
  Check, 
  HelpCircle, 
  Briefcase, 
  TrendingUp, 
  Copy, 
  RefreshCw, 
  Layers, 
  ArrowRight, 
  Minus, 
  Plus, 
  CreditCard, 
  Sparkles,
  Award,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { safeLocalStorage } from '../lib/storage';

interface ApplicationFeeDetailsProps {
  fee: ApplicationFee;
  post?: {
    a1_postName?: string;
    a17_salaryInfo?: { officialPay?: string; expectedInHand?: string } | null;
  };
}

export const ApplicationFeeDetails: React.FC<ApplicationFeeDetailsProps> = ({ fee, post }) => {
  if (!fee) return null;

  // 1. Initial Parsing
  const parseFeeNumber = (val: string): number => {
    if (!val) return 0;
    const digitsOnly = val.replace(/[^0-9]/g, '');
    return digitsOnly ? parseInt(digitsOnly, 10) : 0;
  };

  const generalCost = parseFeeNumber(fee.generalOBC);
  const scstCost = parseFeeNumber(fee.ewsSCST);
  const phCost = parseFeeNumber(fee.ph);

  // 2. State setup
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFeeType, setSelectedFeeType] = useState<'general' | 'scst' | 'ph' | 'custom'>('general');
  const [customBaseFee, setCustomBaseFee] = useState<number>(generalCost);
  const [cyberCharges, setCyberCharges] = useState<number>(50);
  const [includeSurcharge, setIncludeSurcharge] = useState<boolean>(true);
  const [photocopySets, setPhotocopySets] = useState<number>(2);
  const [miscTravel, setMiscTravel] = useState<number>(50);
  const [studyMaterials, setStudyMaterials] = useState<number>(0);
  
  // Custom inputs active toggles
  const [showCustomDetails, setShowCustomDetails] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'self' | 'cafe' | 'travel' | 'none'>('cafe');

  // Sync customBaseFee when selected category changes
  useEffect(() => {
    if (selectedFeeType === 'general') {
      setCustomBaseFee(generalCost);
    } else if (selectedFeeType === 'scst') {
      setCustomBaseFee(scstCost);
    } else if (selectedFeeType === 'ph') {
      setCustomBaseFee(phCost);
    }
  }, [selectedFeeType, generalCost, scstCost, phCost]);

  // Handle Preset Selections
  const applyPreset = (preset: 'self' | 'cafe' | 'travel') => {
    setActivePreset(preset);
    if (preset === 'self') {
      setCyberCharges(0);
      setIncludeSurcharge(false);
      setPhotocopySets(1);
      setMiscTravel(0);
      setStudyMaterials(0);
    } else if (preset === 'cafe') {
      setCyberCharges(60);
      setIncludeSurcharge(true);
      setPhotocopySets(2);
      setMiscTravel(40);
      setStudyMaterials(0);
    } else if (preset === 'travel') {
      setCyberCharges(120);
      setIncludeSurcharge(true);
      setPhotocopySets(4);
      setMiscTravel(350);
      setStudyMaterials(150);
    }
  };

  // Helper values
  const getSurchargeCost = (): number => {
    if (!includeSurcharge) return 0;
    const base = selectedFeeType === 'custom' ? customBaseFee : 
                 selectedFeeType === 'general' ? generalCost : 
                 selectedFeeType === 'scst' ? scstCost : phCost;
    // Standard bank utility fee models: 1.5% + GST or flat rate
    if (base === 0) return 0;
    return Math.max(10, Math.round(base * 0.015 + 3));
  };

  const getBaseFeeValue = (): number => {
    if (selectedFeeType === 'custom') return customBaseFee;
    if (selectedFeeType === 'general') return generalCost;
    if (selectedFeeType === 'scst') return scstCost;
    return phCost;
  };

  const photocopyCost = photocopySets * 15; // ₹15 per set (copy + envelope + glue etc)
  const bankCharges = getSurchargeCost();
  const totalEstimate = getBaseFeeValue() + bankCharges + cyberCharges + photocopyCost + miscTravel + studyMaterials;

  // Salary ROI Parsing
  const extractSalaryNumber = (salaryStr?: string | null): number => {
    if (!salaryStr) return 0;
    const cleaned = salaryStr.replace(/,/g, '');
    const matches = cleaned.match(/\d+/g);
    if (matches && matches.length > 0) {
      const val = parseInt(matches[0], 10);
      if (val > 5000) return val;
      if (matches[1] && parseInt(matches[1], 10) > 5000) {
        return parseInt(matches[1], 10);
      }
    }
    return 0;
  };

  // Check expected salary context
  const expectedSalary = extractSalaryNumber(post?.a17_salaryInfo?.expectedInHand) || 
                         extractSalaryNumber(post?.a17_salaryInfo?.officialPay) || 
                         35000; // default average govt grade-C base

  const hasRealSalary = !!(post?.a17_salaryInfo?.expectedInHand || post?.a17_salaryInfo?.officialPay);
  
  // Calculate metric factors
  const hourlySalaryRate = expectedSalary / 160; // 160 hours average work per month (40h/week)
  const breakEvenHours = totalEstimate / (hourlySalaryRate || 1);
  const roiMultiplier = Math.round(expectedSalary / (totalEstimate || 1));

  // Determine budget index rating:
  const getBudgetSeverity = () => {
    if (totalEstimate <= 150) return { label: 'Extremely Economical (अति सुगम)', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (totalEstimate <= 350) return { label: 'Highly Budget Friendly (बजट अनुकूल)', color: 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20' };
    if (totalEstimate <= 750) return { label: 'Moderate Expense (मध्यम व्यय)', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Substantial Budget Overhead (विशेष व्यय)', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const budgetSeverity = getBudgetSeverity();

  // Copy structured breakdown to clipboard
  const handleCopyBreakdown = () => {
    const textStr = `📋 SARKARIBOARD POCKET EXPENSE ESTIMATE (कुल खर्च अनुमानक)
-----------------------------------------------
Post Name: ${post?.a1_postName || 'Current Central/State Post'}
Expected Base Pay: ₹${expectedSalary.toLocaleString('en-IN')}/month
-----------------------------------------------
1. Categorized Base Fee : ₹${getBaseFeeValue()}
2. Online Surcharge     : ₹${bankCharges}
3. Cyber Cafe Service   : ₹${cyberCharges}
4. Photocopies & Xerox  : ₹${photocopyCost} (Qty: ${photocopySets} set)
5. Exam Travel/Commute  : ₹${miscTravel}
6. Books & Study Prep   : ₹${studyMaterials}
-----------------------------------------------
💰 TOTAL ESTIMATED POCKET EXPENSE: ₹${totalEstimate}/-
-----------------------------------------------
★ Career Return-on-Investment (ROI): ${roiMultiplier}x of application overhead!
★ Break-Even Time: Earned back in just ${breakEvenHours.toFixed(1)} hours of your first-month job!
* This pocket receipt was simulated live on SarkariBoard Budget Estimator.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textStr)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fallback if browser security blocks clipboard
          alert(textStr);
        });
    } else {
      alert(textStr);
    }
  };

  const feeItems = [
    { label: 'General / OBC / EWS', value: fee.generalOBC || 'Nil', valueNum: generalCost },
    { label: 'SC / ST / PH Female', value: fee.ewsSCST || 'Nil', valueNum: scstCost },
    { label: 'Payment Mode Type', value: fee.mode || 'Online Gateway' },
    { label: 'Gateway Bank Charges', value: fee.bankCharges || 'As per norms' },
  ];

  return (
    <div id="portal-expense-estimator" className="space-y-5 my-6 p-1 sm:p-2 bg-transparent">
      
      {/* 1. Official Board Application Fee Details Grid */}
      <div className="bg-white dark:bg-zinc-950 border-2 border-neutral-900 dark:border-zinc-800 p-0 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_rgba(39,39,42,1)] rounded-none">
        <div className="bg-emerald-600 px-4 py-2 border-b-2 border-neutral-900 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-[11px] font-black uppercase text-white tracking-widest flex items-center gap-2 select-none">
            <CreditCard className="w-4 h-4 text-emerald-100" />
            <span>Application Fees / आवेदन शुल्क</span>
          </h3>
          <span className="text-[9px] font-mono bg-white text-emerald-700 font-black px-1.5 py-0.5 uppercase tracking-tighter shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            OFFICIAL
          </span>
        </div>
        
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {feeItems.map((item, index) => (
            <div key={index} className="flex flex-col border-b sm:border-b-0 sm:border-r last:border-b-0 sm:last:border-r-0 border-neutral-100 dark:border-zinc-900/50 pb-3 sm:pb-0 sm:pr-3 last:pb-0 sm:last:pr-0 group">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-tight mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none shrink-0" />
                {item.label}
              </span>
              <span className="text-sm font-black text-neutral-900 dark:text-zinc-200 font-mono break-words leading-tight group-hover:text-emerald-600 transition-colors">
                {item.value}
              </span>
            </div>
          ))}
        </div>
        
        {/* Subtle decorative "secure" footer */}
        <div className="bg-neutral-50 dark:bg-zinc-900/50 px-4 py-1.5 border-t border-neutral-100 dark:border-zinc-900 flex justify-end gap-3">
           <div className="flex items-center gap-1 opacity-50">
             <span className="text-[8px] font-mono font-bold text-neutral-400 uppercase">Verified Sources</span>
             <Award className="w-2.5 h-2.5 text-neutral-300" />
           </div>
        </div>
      </div>

      {/* 2. Compact Expandable Button Trigger */}
      <div className="flex justify-center pt-1 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-5 py-3 border-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
            isOpen 
              ? 'border-neutral-950 dark:border-white bg-neutral-950 dark:bg-zinc-800 text-white shadow-[3px_3px_0_rgba(0,0,0,0.15)] hover:bg-neutral-900'
              : 'border-emerald-500 hover:border-neutral-950 dark:hover:border-white bg-emerald-500/10 text-emerald-750 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white shadow-[4px_4px_0_rgba(16,185,129,0.15)]'
          }`}
        >
          <Calculator className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-400' : 'text-emerald-500'}`} />
          <span>
            {isOpen ? 'Close Expense Estimator (अनुमानक छुपाएं)' : '⚙️ Portal Expense Estimator (कुल खर्च अनुमानक)'}
          </span>
          <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? '-rotate-90' : 'rotate-90'}`} />
        </button>
      </div>

      {/* 3. Collapsible Estimator Section */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden no-print"
          >
            <div className="border-4 border-emerald-500 dark:border-emerald-600 bg-white dark:bg-[#121214] p-4 sm:p-6 relative shadow-[8px_8px_0px_rgba(16,185,129,0.3)]">
              
              {/* Banner header inside card */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 dark:border-emerald-950 pb-4 mb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white font-sans text-[9px] font-black tracking-widest uppercase px-2 py-0.5 select-none rounded-none">
                      BUDGETING SYSTEM
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  </div>
                  <h4 className="text-base sm:text-lg font-black uppercase tracking-tight text-neutral-950 dark:text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>PORTAL EXPENSE ESTIMATOR (कुल खर्च अनुमानक)</span>
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-2xl font-medium leading-relaxed font-sans">
                    Applying for Indian competitive services involves additional subtle overheads (travel, printouts, photo edits, and cyber cafe tasks). Compute your absolute out-of-pocket costs accurately!
                  </p>
                </div>

                <button
                  onClick={() => {
                    applyPreset('cafe');
                    setSelectedFeeType('general');
                  }}
                  className="self-start md:self-center bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-zinc-300 px-3 py-1.5 border border-gray-250 dark:border-zinc-700 transition-colors duration-200 flex items-center gap-1.5 text-xs font-bold uppercase select-none cursor-pointer"
                  title="Reset settings"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Dynamic Quick Toggles Preset Rail */}
              <div className="mb-6 space-y-2 select-none">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#10b981] dark:text-emerald-400">
                  A. CHOOSE AN EXAMINATION DELIVERY PRESET (अनुमानित स्थिति चुनें)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  <button
                    onClick={() => applyPreset('self')}
                    className={`p-3 border-2 text-left flex flex-col justify-between transition-all relative rounded-none cursor-pointer ${
                      activePreset === 'self'
                        ? 'border-emerald-600 bg-emerald-50/25 dark:bg-emerald-950/20 shadow-[3px_3px_0_0_#10b981]'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-400 bg-neutral-50/50 dark:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black uppercase text-neutral-900 dark:text-white flex items-center gap-1">
                        🏠 1. Self Applied
                      </span>
                      {activePreset === 'self' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium italic">
                      No cyber charges, standard home internet filing, zero travel expense.
                    </p>
                  </button>

                  <button
                    onClick={() => applyPreset('cafe')}
                    className={`p-3 border-2 text-left flex flex-col justify-between transition-all relative rounded-none cursor-pointer ${
                      activePreset === 'cafe'
                        ? 'border-emerald-600 bg-emerald-50/25 dark:bg-emerald-950/20 shadow-[3px_3px_0_0_#10b981]'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-400 bg-neutral-50/50 dark:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black uppercase text-neutral-900 dark:text-white flex items-center gap-1">
                        💻 2. Cyber Cafe Standard
                      </span>
                      {activePreset === 'cafe' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium italic font-sans animate-fade-in">
                      Standard form filing assist, scans, online charge & passport photo print.
                    </p>
                  </button>

                  <button
                    onClick={() => applyPreset('travel')}
                    className={`p-3 border-2 text-left flex flex-col justify-between transition-all relative rounded-none cursor-pointer ${
                      activePreset === 'travel'
                        ? 'border-emerald-600 bg-emerald-50/25 dark:bg-emerald-950/20 shadow-[3px_3px_0_0_#10b981]'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-400 bg-neutral-50/50 dark:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-black uppercase text-neutral-900 dark:text-white flex items-center gap-1">
                        🚂 3. Remote Travel Pack
                      </span>
                      {activePreset === 'travel' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium italic">
                      Advanced scan assist, guide booklet, train/bus fare to remote testing city.
                    </p>
                  </button>

                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 dark:border-zinc-800/80 my-4"></div>

              {/* Main Budget Grid Configuration Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT PANEL: Inputs & Fine Tuning Sliders & Selection (7 Cols) */}
                <div className="lg:col-span-7 space-y-5">
                  
                  {/* Step 1: Base Fee category switch */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-black uppercase text-gray-800 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9.5px]">1</span>
                        <span>Select Board Base Fee (मूल विभाग शुल्क)</span>
                      </label>
                      <span className="text-[10px] text-neutral-400 font-mono font-bold">Category Match</span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => setSelectedFeeType('general')}
                        className={`py-2 px-1 text-center border-2 transition-all font-sans text-[11px] font-extrabold cursor-pointer ${
                          selectedFeeType === 'general'
                            ? 'border-gray-950 dark:border-white bg-gray-950 dark:bg-zinc-800 text-white shadow-sm'
                            : 'border-gray-255 dark:border-zinc-800 hover:border-gray-400 text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="uppercase">General / OBC</div>
                        <div className="font-mono mt-0.5 text-xs">₹{generalCost}</div>
                      </button>

                      <button
                        onClick={() => setSelectedFeeType('scst')}
                        className={`py-2 px-1 text-center border-2 transition-all font-sans text-[11px] font-extrabold cursor-pointer ${
                          selectedFeeType === 'scst'
                            ? 'border-gray-950 dark:border-white bg-gray-950 dark:bg-zinc-800 text-white'
                            : 'border-gray-255 dark:border-zinc-800 hover:border-gray-400 text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="uppercase">SC / ST / EWS</div>
                        <div className="font-mono mt-0.5 text-xs">₹{scstCost}</div>
                      </button>

                      <button
                        onClick={() => setSelectedFeeType('ph')}
                        className={`py-2 px-1 text-center border-2 transition-all font-sans text-[11px] font-extrabold cursor-pointer ${
                          selectedFeeType === 'ph'
                            ? 'border-gray-950 dark:border-white bg-gray-950 dark:bg-zinc-800 text-white'
                            : 'border-gray-255 dark:border-zinc-800 hover:border-gray-400 text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="uppercase">PH / Female</div>
                        <div className="font-mono mt-0.5 text-xs">₹{phCost}</div>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedFeeType('custom');
                          setActivePreset('none');
                        }}
                        className={`py-2 px-1 text-center border-2 transition-all font-sans text-[11px] font-extrabold cursor-pointer ${
                          selectedFeeType === 'custom'
                            ? 'border-amber-500 bg-amber-500 text-white'
                            : 'border-gray-255 dark:border-zinc-800 hover:border-gray-400 text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="uppercase">Custom Fee</div>
                        <div className="font-mono mt-0.5 text-xs">₹{customBaseFee}</div>
                      </button>
                    </div>

                    {/* Custom Fee Manual Slider when custom selected */}
                    <AnimatePresence>
                      {selectedFeeType === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-amber-500/10 p-3 border border-amber-500/20 space-y-2 mt-2"
                        >
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-extrabold text-amber-800 dark:text-amber-400">Specify Custom Exam Board Fee:</span>
                            <span className="font-mono font-black text-amber-900 dark:text-amber-200">₹{customBaseFee}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1500"
                            step="10"
                            value={customBaseFee}
                            onChange={(e) => setCustomBaseFee(parseInt(e.target.value, 10))}
                            className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-500 dark:bg-neutral-800"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step 2: Cyber Cafe Charges Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label className="text-[11px] font-black uppercase text-gray-800 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9.5px]">2</span>
                        <span>Cyber Cafe Filing Assistance (कैफे सेवा शुल्क)</span>
                      </label>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹{cyberCharges}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      step="10"
                      value={cyberCharges}
                      onChange={(e) => {
                        setCyberCharges(parseInt(e.target.value, 10));
                        setActivePreset('none');
                      }}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:bg-neutral-800"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                      <span>₹0 (Self-Online)</span>
                      <span className="text-gray-950 dark:text-zinc-350">
                        {cyberCharges === 0 ? 'Filer: Applied via own laptop/mobile!' : 
                         cyberCharges <= 50 ? 'Basic photo resize + scanning support' : 
                         cyberCharges <= 100 ? 'Standard full cyber registration' : 'Full assisted data verify + double printout'}
                      </span>
                      <span>₹250</span>
                    </div>
                  </div>

                  {/* Step 3: Printout & Photocopy Counting */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label className="text-[11px] font-black uppercase text-gray-800 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9.5px]">3</span>
                        <span>Document Photocopies & Hardcopy Sets (दस्तावेज़ सेट)</span>
                      </label>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹{photocopyCost}</span>
                    </div>
                    <div className="flex items-center gap-3 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-2 justify-between">
                      <div className="text-left">
                        <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">Admit Cards, Challans & Xerox Sets</span>
                        <span className="text-[10px] text-neutral-400">Compiling 3 sheets + photos + post envelope @ ₹15 per compile set</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (photocopySets > 0) setPhotocopySets(s => s - 1);
                            setActivePreset('none');
                          }}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-700 dark:text-white font-black hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer text-sm"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-10 text-center font-mono font-black text-xs">
                          {photocopySets}
                        </div>
                        <button
                          onClick={() => {
                            if (photocopySets < 12) setPhotocopySets(s => s + 1);
                            setActivePreset('none');
                          }}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-700 dark:text-white font-black hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer text-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 4: Travel & Commute Fees Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label className="text-[11px] font-black uppercase text-gray-800 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9.5px]">4</span>
                        <span>Exam Venue Commute & Logistics (परीक्षा केंद्र यात्रा खर्च)</span>
                      </label>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹{miscTravel}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1200"
                      step="25"
                      value={miscTravel}
                      onChange={(e) => {
                        setMiscTravel(parseInt(e.target.value, 10));
                        setActivePreset('none');
                      }}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:bg-neutral-800"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 font-medium animate-fade-in">
                      <span>₹0 (Nearby School Hall)</span>
                      <span className="text-gray-950 dark:text-zinc-350 font-sans">
                        {miscTravel === 0 ? 'Testing center within walking / bike range' : 
                         miscTravel <= 50 ? 'Local metro / bus daily pass cost' : 
                         miscTravel <= 250 ? 'Inter-state express bus / standard train ticket' : 
                         miscTravel <= 600 ? 'Auto fares + district transit + temporary meal' : 'Involves multi-step overnight train + stay cabin'}
                      </span>
                      <span>₹1200</span>
                    </div>
                  </div>

                  {/* Step 5: Test Materials & Practice series */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <label className="text-[11px] font-black uppercase text-gray-800 dark:text-zinc-300 tracking-wider flex items-center gap-1.5">
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[9.5px]">5</span>
                        <span>Exam Guide Books & Prep Material (अतिरिक्त पुस्तकें)</span>
                      </label>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹{studyMaterials}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="25"
                      value={studyMaterials}
                      onChange={(e) => {
                        setStudyMaterials(parseInt(e.target.value, 10));
                        setActivePreset('none');
                      }}
                      className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:bg-neutral-800"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                      <span>₹0 (Free online PDFs)</span>
                      <span className="text-gray-950 dark:text-zinc-350 font-sans">
                        {studyMaterials === 0 ? 'Leveraging SarkariBoard free links' : 
                         studyMaterials <= 100 ? 'Short current-affairs booklet purchase' : 
                         studyMaterials <= 250 ? 'Standard department complete practice guide book' : 'Premium mock test portal series subscription'}
                      </span>
                      <span>₹500</span>
                    </div>
                  </div>

                  {/* Surcharge Quick switch */}
                  <div className="bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="includeSurchargeChkbx"
                        checked={includeSurcharge}
                        onChange={(e) => setIncludeSurcharge(e.target.checked)}
                        className="w-4 h-4 accent-emerald-650 cursor-pointer"
                      />
                      <label htmlFor="includeSurchargeChkbx" className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                        Include Bank Gateway Surcharge (₹{bankCharges})
                      </label>
                    </div>
                    <span className="text-[9px] font-mono text-neutral-400">1.5% average</span>
                  </div>

                </div>

                {/* RIGHT PANEL: Digital Invoice Ledger & Dynamic ROI Metrics (5 Cols) */}
                <div className="lg:col-span-5 bg-[#17171a] border-3 border-neutral-900 text-white p-4 sm:p-5 relative flex flex-col justify-between">
                  
                  {/* Visual background pattern */}
                  <div className="absolute inset-0 bg-radial-gradient from-emerald-100/10 to-transparent pointer-events-none select-none"></div>

                  {/* Ledger content */}
                  <div className="relative z-10 space-y-4">
                    
                    <div className="flex justify-between items-center border-b border-white/10 pb-3">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981]">
                          POCKET PASSBOOK OVERVIEW
                        </span>
                      </div>
                      <div className="text-[9px] font-mono bg-[#222] border border-white/10 text-neutral-400 px-1.5 py-0.5">
                        SIMULATION
                      </div>
                    </div>

                    {/* Dynamic Severity indicator */}
                    <div className={`p-2.5 border text-center text-[10px] font-black uppercase tracking-wider ${budgetSeverity.color}`}>
                      Index: {budgetSeverity.label}
                    </div>

                    {/* Ledger item list */}
                    <div className="space-y-2.5 text-xs text-neutral-350 font-sans border-b border-dashed border-white/10 pb-4">
                      
                      <div className="flex justify-between items-center">
                        <span>1. Base Department Fee</span>
                        <span className="font-mono text-neutral-100">₹{getBaseFeeValue().toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>2. Online Gate Portal Surcharge</span>
                        <span className="font-mono text-neutral-100">₹{bankCharges}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>3. Assisted Cyber Cafe Fee</span>
                        <span className="font-mono text-neutral-100">₹{cyberCharges}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>4. Photocopy Materials & Xerox ({photocopySets} Sets)</span>
                        <span className="font-mono text-neutral-100">₹{photocopyCost}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>5. Transit Venue Ticket Expense</span>
                        <span className="font-mono text-neutral-100">₹{miscTravel}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>6. Learning & Practice Bundles</span>
                        <span className="font-mono text-neutral-100">₹{studyMaterials}</span>
                      </div>

                    </div>

                    {/* Massive Total display */}
                    <div className="bg-[#212124] border border-white/5 p-4 text-center space-y-1">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-emerald-400 font-bold block">
                        TOTAL ESTIMATED OVERHEAD / कुल संभावित व्यय
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono flex items-center justify-center gap-1">
                        ₹ {totalEstimate.toLocaleString('en-IN')}
                        <span className="text-xs text-neutral-500 font-bold mt-1">INR</span>
                      </div>
                      <div className="text-[9.5px] text-neutral-400 font-medium">
                        Composed of Board Application + Extra Pocket Items
                      </div>
                    </div>

                    {/* DYNAMIC FUTURE VALUATION RATIO (THE ROI STAT) */}
                    <div className="space-y-3 pt-2">
                      <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-emerald-500/10 pb-1.5">
                          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                          <span>CAREER VALUE RATIO (फ्यूचर रिटर्न अनुमान)</span>
                        </div>
                        
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between text-neutral-300">
                            <span>Provisional Cash Base Pay:</span>
                            <span className="font-black text-emerald-300 font-mono">
                              ₹ {expectedSalary.toLocaleString('en-IN')}/Month
                            </span>
                          </div>

                          <div className="flex justify-between text-neutral-300">
                            <span>Investment Return Ratio:</span>
                            <span className="font-extrabold text-[#10b981] font-mono">
                              ~ {roiMultiplier}X factor
                            </span>
                          </div>

                          <div className="flex justify-between text-neutral-300">
                            <span>Overhead Recovery Time:</span>
                            <span className="font-mono font-black text-amber-400">
                              {breakEvenHours.toFixed(1)} Job Hours
                            </span>
                          </div>

                          {/* Highly descriptive small prompt */}
                          <p className="text-[9.5px] text-neutral-400 pt-1 leading-relaxed border-t border-white/5 mt-1 font-medium font-sans">
                            {hasRealSalary ? (
                              `Applying for this board represents a tremendous prospective return. It takes just ${breakEvenHours.toFixed(1)} working hours of compensation to completely replenish this entire overhead.`
                            ) : (
                              `Based on a typical central/state Group-C employee starting grade pay, this fee represents an exceptional path of upward social mobility.`
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ACTION FOOTER INSIDE THE INVOICE CELL */}
                  <div className="relative z-10 pt-4 border-t border-white/10 mt-4 space-y-2 select-none">
                    
                    <button
                      onClick={handleCopyBreakdown}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-850 text-white font-sans text-xs font-black py-2.5 px-4 transition-all duration-150 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer border border-[#10b981] rounded-none shadow-sm shadow-black"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>
                        {copied ? '✅ Passed to Clipboard!' : 'Share Budget Passbook'}
                      </span>
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[8.5px] text-neutral-400 font-mono">
                      <AlertCircle className="w-3 h-3 text-emerald-500" />
                      <span>Computed factually based on normal Indian states criteria.</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
