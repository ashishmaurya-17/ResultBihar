import React, { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, Search, ListCollapse, ListTree } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-white hover:border-amber-400 transition-colors duration-200">
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-neutral-50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-neutral-800 text-sm sm:text-base leading-snug">{question}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`p-1 rounded-full text-neutral-500 ${isOpen ? 'bg-red-100 text-red-600' : 'bg-neutral-100'}`}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-neutral-100 bg-neutral-50 text-neutral-600 text-sm leading-relaxed"
          >
            <div className="px-5 py-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQs({ onBackToHome }: { onBackToHome: () => void }) {
  const bpsc_faqs = [
    {
      question: "How do I apply for BPSC and BSEB exams?",
      answer: "First, find the official link to apply on our website. Keep your photo, signature, and resume ready before you start."
    },
    {
      question: "Are these tools free to use?",
      answer: "Yes, all our tools like the photo resizer, signature maker, format changer, age calculator, and resume builder are completely free. Your files stay on your phone or computer."
    },
    {
      question: "What is the perfect photo size for government websites?",
      answer: "Usually, websites ask for a photo under 50KB or a signature under 20KB in JPEG or PNG format. Please check the exact rule on the official exam notice."
    },
    {
      question: "How can I check my exact age for forms?",
      answer: "We have an 'Age Calculator' tool on the Tools page. Enter your birthdate and the cutoff date to find out your exact age."
    },
    {
      question: "Why should my name be in capital letters?",
      answer: "Many forms ask for your name in capital letters so there are no mistakes. Our Name Converter changes your name to capital letters easily."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": bpsc_faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return bpsc_faqs;
    const query = searchQuery.toLowerCase();
    return bpsc_faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const toggleFaq = (question: string) => {
    setOpenStates(prev => ({ ...prev, [question]: !prev[question] }));
  };

  const isAllExpanded = filteredFaqs.length > 0 && filteredFaqs.every(faq => openStates[faq.question]);

  const toggleAll = () => {
    const newStates: Record<string, boolean> = { ...openStates };
    filteredFaqs.forEach(faq => {
      newStates[faq.question] = !isAllExpanded;
    });
    setOpenStates(newStates);
  };

  return (
    <>
      <SEO 
        title="Frequently Asked Questions (FAQs)" 
        description="Find quick answers about Sarkariboard exams, applications, and free candidate tools."
        url="https://sarkariboard.com/faqs"
        jsonLd={faqSchema}
      />
      <main className="max-w-7xl mx-auto px-4 py-8 grow w-full font-sans">
      <div className="bg-white rounded-2xl border p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-xs">
        <div className="border-b border-neutral-100 pb-4 mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2.5 rounded-xl">
              <HelpCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight uppercase">
                Frequently Asked Questions
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                Find quick answers about exams, filling forms, and our tools.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs sm:text-sm text-amber-950 font-medium flex gap-2">
          <span className="font-bold flex-shrink-0">Tip:</span> 
          <span>Make sure you check all details and fees on the official government website before acting.</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl leading-5 bg-neutral-50 placeholder-neutral-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm transition-colors"
            />
          </div>
          <button
            onClick={toggleAll}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50 hover:text-neutral-900 font-semibold rounded-xl text-sm transition-colors shrink-0"
          >
            {isAllExpanded ? (
              <>
                <ListCollapse className="w-4 h-4 text-emerald-600" />
                <span>Collapse All</span>
              </>
            ) : (
              <>
                <ListTree className="w-4 h-4 text-amber-500" />
                <span>Expand All</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3 mt-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={!!openStates[faq.question]}
                onToggle={() => toggleFaq(faq.question)}
              />
            ))
          ) : (
            <div className="text-center py-10 bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
              <p className="text-neutral-500 text-sm">No answers found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-neutral-100">
          <button
            onClick={onBackToHome}
            className="bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl text-center shadow-md transition inline-flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer w-full sm:w-auto"
          >
            Back To Home
          </button>
        </div>
      </div>
    </main>
    </>
  );
}
