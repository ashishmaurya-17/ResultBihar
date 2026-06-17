import React from 'react';
import { 
  Bell, 
  Wrench, 
  Filter, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  Calculator,
  ImageIcon,
  UserCheck,
  FileSearch,
  Zap,
  TrendingUp,
  Cpu,
  ShieldCheck,
  History
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortalStore } from '../store';
import { Post } from '../types';
import { motion } from 'motion/react';

interface HomeSectionsProps {
  posts: Post[];
}

export default function HomeSections({ posts }: HomeSectionsProps) {
  const [store, setStore] = usePortalStore();
  const navigate = useNavigate();

  // Logic for subsets of data
  const latestAlerts = posts.slice(0, 6);
  const relatedNotices = posts.slice(6, 12);

  const quickFilters = [
    { label: '8th Pass', value: '8th pass', type: 'qualification', icon: ShieldCheck },
    { label: '10th Pass', value: '10th pass', type: 'qualification', icon: ShieldCheck },
    { label: '12th Pass', value: '12th pass', type: 'qualification', icon: ShieldCheck },
    { label: 'Graduate', value: 'graduate', type: 'qualification', icon: ShieldCheck },
    { label: 'SSC', value: 'SSC', type: 'sector', icon: Cpu },
    { label: 'Railway', value: 'railway', type: 'sector', icon: Cpu },
    { label: 'Police', value: 'police', type: 'sector', icon: Cpu },
    { label: 'Banking', value: 'banking', type: 'sector', icon: Cpu },
  ];

  const studentTools = [
    { title: 'Age Calculator', desc: 'Verify eligibility dates.', icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { title: 'Photo Resizer', desc: 'Format official uploads.', icon: ImageIcon, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { title: 'Resume Builder', desc: 'Craft basic Govt. CVs.', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-500/10' },
    { title: 'Syllabus Finder', desc: 'Find latest exam patterns.', icon: FileSearch, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
  ];

  const publicServices = [
    { name: 'Aadhar Card', url: 'https://uidai.gov.in/', color: 'bg-emerald-500' },
    { name: 'PAN Card', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', color: 'bg-blue-500' },
    { name: 'Voter ID', url: 'https://voters.eci.gov.in/', color: 'bg-red-500' },
    { name: 'Ration Card', url: 'https://nfsa.gov.in/', color: 'bg-amber-500' },
    { name: 'Ayushman Card', url: 'https://pmjay.gov.in/', color: 'bg-cyan-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. ALERT DESK / अलर्ट डेस्क */}
      <section className="group" id="alert-desk-section">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-zinc-800 pb-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-red-500 rounded-full blur opacity-25 animate-pulse" />
              <div className="bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center relative shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-zinc-50">
                Alert Desk <span className="text-neutral-400 mx-2">/</span> <span className="text-red-600">अलर्ट डेस्क</span>
              </h2>
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest mt-1 italic">Real-time Bulletin Stream</p>
            </div>
          </div>
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full transition-all">
            History Archives
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {latestAlerts.map((alert, idx) => (
            <motion.div variants={itemVariants} key={alert.id}>
              <Link 
                to={`/post/${alert.id}`}
                className="group/card bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-5 hover:border-blue-500/50 transition-all rounded-3xl flex items-start gap-4 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover/card:bg-blue-500/10 transition-colors" />
                
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl border border-neutral-100 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-950 font-black text-xs text-neutral-400 italic">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-grow py-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-red-500/10 text-red-600 text-[8px] font-black px-2 py-0.5 uppercase tracking-tighter rounded-full border border-red-500/20">
                      Live
                    </span>
                    <span className="text-[9px] text-neutral-400 font-black uppercase tracking-tight truncate">{alert.org}</span>
                  </div>
                  <h3 className="text-sm font-black text-neutral-900 dark:text-zinc-100 leading-snug group-hover/card:text-blue-600 transition-colors uppercase tracking-tight">
                    {alert.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 2. QUICK JOB FILTERS / नौकरी फ़िल्टर */}
      <section className="relative p-8 sm:p-12 overflow-hidden rounded-[40px] border border-neutral-100 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900" id="quick-filters-section">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-neutral-900 dark:text-white tracking-tighter flex items-center justify-center gap-4">
              <TrendingUp className="text-blue-600 w-10 h-10" />
              Quick Filters
            </h2>
            <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest italic">Find your niche in the system with one click.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {quickFilters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (filter.type === 'qualification') setStore({ selectedQualification: filter.value });
                  if (filter.type === 'sector') setStore({ selectedSector: filter.value });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group/btn relative bg-neutral-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-neutral-100 dark:border-zinc-800 p-5 rounded-3xl transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex flex-col items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center shadow-sm group-hover/btn:scale-110 group-hover/btn:rotate-6 transition-transform">
                     <filter.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-[11px] font-black uppercase text-neutral-900 dark:text-zinc-200 tracking-widest">{filter.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STUDENT HELP CENTER & PUBLIC SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20" id="resource-hub-section">
        
        {/* STUDENT HELP CENTER */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-amber-400 rounded-3xl shrink-0 flex items-center justify-center shadow-lg">
                <Wrench className="w-6 h-6 text-black" />
             </div>
             <div>
               <h2 className="text-2xl font-black uppercase text-neutral-900 dark:text-zinc-50 tracking-tight">
                 Student Help Hub
               </h2>
               <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Utility Ecosystem</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {studentTools.map((tool, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 p-6 rounded-[32px] hover:shadow-2xl transition-all group cursor-pointer flex flex-col gap-6">
                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <tool.icon size={26} />
                </div>
                <div>
                  <h3 className="font-black uppercase text-neutral-900 dark:text-zinc-100 text-base tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{tool.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium leading-relaxed">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PUBLIC SERVICES */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-emerald-600 rounded-3xl shrink-0 flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-2xl font-black uppercase text-neutral-900 dark:text-zinc-50 tracking-tight">
                 Public Access
               </h2>
               <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Citizen Portals</p>
             </div>
          </div>

          <div className="bg-neutral-50/50 dark:bg-zinc-900/20 p-2 rounded-[40px] border border-neutral-100 dark:border-zinc-800">
            <div className="bg-white dark:bg-zinc-950 rounded-[34px] p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="w-12 h-1 bg-emerald-600 rounded-full" />
                <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-sm">Seamless connectivity to verified Government document and utility infrastructure.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {publicServices.map((service, idx) => (
                  <a 
                    key={idx}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-zinc-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 ${service.color} rounded-full`} />
                      <span className="text-[13px] font-black uppercase text-neutral-800 dark:text-zinc-300 group-hover:text-emerald-700">{service.name}</span>
                    </div>
                    <ArrowRight size={16} className="text-neutral-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. RELATED NOTICES / संबंधित सरकारी नौकरी */}
      <section className="space-y-10" id="related-notices-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-600 rounded-3xl shrink-0 flex items-center justify-center shadow-lg">
                <History className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-2xl font-black uppercase text-neutral-900 dark:text-zinc-50 tracking-tight">
                 Related Updates
               </h2>
               <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Cross-Agency Highlights</p>
             </div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-10 scrollbar-hide -mx-4 px-4 sm:-mx-0 sm:px-0">
           {relatedNotices.map((post) => (
             <Link
               key={post.id}
               to={`/post/${post.id}`}
               className="shrink-0 w-72 bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 p-7 rounded-[32px] hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between h-64"
             >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{post.org}</span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-zinc-100 uppercase tracking-tight line-clamp-3 leading-tight">
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-50 dark:border-zinc-800 pt-4">
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">View Details</span>
                   <span className="text-[10px] font-bold text-neutral-400 italic">{post.postDate}</span>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Modern Technical Footer Meta */}
      <section className="bg-neutral-950 rounded-[40px] p-10 sm:p-16 flex flex-col items-center text-center space-y-10 relative overflow-hidden text-neutral-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] from-blue-500/20 opacity-40" />
        
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl font-black uppercase tracking-tighter">Powered for the Modern Era</h3>
          <p className="text-neutral-500 font-medium max-w-xl mx-auto leading-relaxed">Combining legacy official speed with contemporary architectural precision. Optimized for high-throughput bulletin processing across all cellular generations.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-10 opacity-60">
           <div className="flex items-center gap-3">
              <Cpu className="text-blue-500" size={24} />
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest leading-none">Core Engine</span>
                <span className="text-[12px] font-bold">Node-X v3.1</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <Zap className="text-amber-500" size={24} />
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest leading-none">Edge Cache</span>
                <span className="text-[12px] font-bold">Latency &lt; 40ms</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={24} />
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-widest leading-none">Security</span>
                <span className="text-[12px] font-bold">Official Cert</span>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}
