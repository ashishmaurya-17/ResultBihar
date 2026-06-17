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
  History,
  Fingerprint,
  IdCard,
  ShoppingBag,
  Heart
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
    { name: 'Aadhar Card', url: 'https://uidai.gov.in/', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Fingerprint },
    { name: 'PAN Card', url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: IdCard },
    { name: 'Voter ID', url: 'https://voters.eci.gov.in/', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: UserCheck },
    { name: 'Ration Card', url: 'https://nfsa.gov.in/', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: ShoppingBag },
    { name: 'Ayushman Card', url: 'https://pmjay.gov.in/', color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: Heart },
    { name: 'DigiLocker', url: 'https://www.digilocker.gov.in/', color: 'text-orange-500', bg: 'bg-orange-500/10', icon: ShieldCheck }
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
    <div className="space-y-8 sm:space-y-10">
      
      {/* 1. ALERT DESK / अलर्ट डेस्क */}
      <section className="group" id="alert-desk-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 dark:border-zinc-800 pb-2 mb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-rose-500 rounded-lg blur opacity-15 animate-pulse" />
              <div className="bg-rose-500 w-8 h-8 rounded-lg flex items-center justify-center relative shadow-xs">
                <Bell className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-neutral-850 dark:text-zinc-50 flex items-center gap-1">
                ALERT DESK <span className="text-neutral-300 dark:text-neutral-700 font-normal">/</span> <span className="text-rose-500">अलर्ट डेस्क</span>
              </h2>
              <p className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">Real-time Bulletin Stream</p>
            </div>
          </div>
          <Link 
            to="/" 
            className="self-start sm:self-auto text-[9px] font-black uppercase tracking-wider text-rose-500 hover:text-rose-600 bg-rose-50/50 dark:bg-rose-950/10 px-3 py-1 rounded transition-colors font-sans hover:shadow-xs"
          >
            History Archives
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {latestAlerts.map((alert, idx) => (
            <motion.div variants={itemVariants} key={alert.id}>
              <Link 
                to={`/post/${alert.id}`}
                className="group/card bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-3 hover:border-rose-500/50 dark:hover:border-rose-500/30 transition-all rounded-xl flex items-start gap-3 shadow-xs hover:shadow-sm hover:-translate-y-0.5 relative overflow-hidden h-full"
              >
                {/* Soft Colored Bloom */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 dark:bg-rose-500/10 blur-xl pointer-events-none group-hover/card:scale-125 transition-transform duration-500" />
                
                <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded bg-rose-50/50 dark:bg-rose-950/20 font-sans font-black text-[10px] text-rose-500">
                  {idx + 1}
                </div>
                <div className="min-w-0 flex-grow py-0 relative z-10">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="font-mono text-[8px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded uppercase tracking-wider scale-90 origin-left">
                      Live
                    </span>
                    <span className="text-[8px] text-neutral-450 font-black uppercase tracking-widest truncate">{alert.org}</span>
                  </div>
                  <h3 className="text-[11px] sm:text-[11px] leading-tight font-bold text-neutral-800 dark:text-zinc-100 group-hover/card:text-rose-500 transition-colors uppercase tracking-tight font-sans line-clamp-2">
                    {alert.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 2. QUICK JOB FILTERS / नौकरी फ़िल्टर */}
      <section className="relative p-4 sm:p-5 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs bg-white dark:bg-zinc-900 group" id="quick-filters-section">
        {/* Soft corner bloom */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-0.5">
            <h2 className="text-xs sm:text-sm font-black uppercase text-neutral-850 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
              <TrendingUp className="text-fuchsia-500 w-4 h-4 shrink-0" />
              QUICK JOB FILTERS <span className="text-fuchsia-500">/</span> नौकरी फ़िल्टर
            </h2>
            <p className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest leading-none">Find your niche in the system with one click.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
            {quickFilters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (filter.type === 'qualification') setStore({ selectedQualification: filter.value });
                  if (filter.type === 'sector') setStore({ selectedSector: filter.value });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group/btn bg-neutral-50 dark:bg-zinc-800/20 hover:bg-fuchsia-50/20 dark:hover:bg-fuchsia-950/10 border border-neutral-200 dark:border-neutral-800 p-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 w-full text-left font-sans select-none"
              >
                <div className="w-7 h-7 rounded bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-fuchsia-500 shadow-xs shrink-0 group-hover/btn:scale-105 transition-transform">
                   <filter.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-black uppercase text-neutral-700 dark:text-zinc-200 tracking-wider group-hover/btn:text-fuchsia-500 transition-colors truncate">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STUDENT HELP CENTER & PUBLIC SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8" id="resource-hub-section">
        
        {/* STUDENT HELP CENTER */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-zinc-800 pb-2">
             <div className="w-8 h-8 bg-indigo-500 rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                <Wrench className="w-4 h-4 text-white" />
             </div>
             <div>
               <h2 className="text-sm sm:text-base font-black uppercase text-neutral-850 dark:text-zinc-50 tracking-tight">
                 Student Help Hub
               </h2>
               <p className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">Utility Ecosystem</p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {studentTools.map((tool, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  navigate('/tools');
                  setStore({ currentView: 'tools' });
                }}
                className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl shadow-xs hover:border-indigo-500/40 hover:shadow-xs transition-all group cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                {/* Soft blue/indigo bloom */}
                <div className="absolute right-0 top-0 w-20 h-20 bg-indigo-500/5 dark:bg-indigo-500/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                
                <div className={`w-8 h-8 ${tool.bg} ${tool.color} rounded flex items-center justify-center transition-transform group-hover:scale-105 shrink-0`}>
                  <tool.icon size={15} />
                </div>
                <div className="relative z-10 font-sans">
                  <h3 className="font-black uppercase text-neutral-800 dark:text-zinc-100 text-[10px] tracking-wider mb-0.5 group-hover:text-indigo-500 transition-colors flex items-center justify-between">
                    <span>{tool.title}</span>
                    <span className="text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">➔</span>
                  </h3>
                  <p className="text-[10px] text-neutral-450 dark:text-zinc-400 font-bold leading-normal">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PUBLIC SERVICES */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-zinc-800 pb-2">
             <div className="w-8 h-8 bg-emerald-500 rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4 text-white" />
             </div>
             <div>
               <h2 className="text-sm sm:text-base font-black uppercase text-neutral-850 dark:text-zinc-50 tracking-tight">
                 Public Access
               </h2>
               <p className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">Citizen Portals</p>
             </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1.5 shadow-xs relative overflow-hidden">
            {/* Soft Green Bloom */}
            <div className="absolute right-0 top-0 w-16 h-16 bg-emerald-500/5 dark:bg-emerald-500/10 blur-lg pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col font-sans">
                {publicServices.map((service, idx) => {
                  const IconComp = service.icon;
                  return (
                    <a 
                      key={idx}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-1 px-2.5 rounded hover:bg-neutral-50 dark:hover:bg-neutral-850/40 transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <IconComp size={12} className={`${service.color} shrink-0`} />
                        <span className="text-[12px] font-bold text-neutral-700 dark:text-zinc-300 group-hover:text-emerald-500 transition-colors truncate">
                          {service.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-wide text-neutral-450 dark:text-neutral-500 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-150 pl-2 shrink-0">
                        ➔ VISIT
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. RELATED NOTICES / संबंधित सरकारी नौकरी */}
      <section className="space-y-4" id="related-notices-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 dark:border-zinc-800 pb-2 gap-2">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 bg-orange-500 rounded-lg shrink-0 flex items-center justify-center shadow-xs">
                <History className="w-4 h-4 text-white" />
             </div>
             <div>
               <h2 className="text-sm sm:text-base font-black uppercase text-neutral-850 dark:text-zinc-50 tracking-tight">
                 Related Updates
               </h2>
               <p className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest leading-none mt-0.5">Cross-Agency Highlights</p>
             </div>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-3.5 pb-2 scrollbar-hide -mx-4 px-4 sm:-mx-0 sm:px-0">
           {relatedNotices.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="shrink-0 w-60 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-xl hover:shadow-xs hover:border-orange-500/30 hover:-translate-y-0.5 transition-all flex flex-col justify-between h-40 relative overflow-hidden group/notice"
              >
                {/* Soft orange bloom */}
                <div className="absolute right-0 top-0 w-20 h-20 bg-orange-500/5 dark:bg-orange-500/10 blur-xl pointer-events-none group-hover/notice:scale-125 transition-transform duration-500" />
                
                <div className="space-y-2 relative z-10 font-sans">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-orange-500 rounded-full shrink-0" />
                    <span className="text-[8px] font-black uppercase text-neutral-400 dark:text-zinc-400 tracking-widest truncate max-w-[180px]">{post.org}</span>
                  </div>
                  <h3 className="text-11px font-bold text-neutral-855 dark:text-zinc-100 uppercase tracking-tight line-clamp-3 leading-tight group-hover/notice:text-indigo-500 dark:group-hover/notice:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-100 dark:border-zinc-800 pt-2.5 relative z-10 font-sans">
                   <span className="text-[9px] font-black text-orange-500 uppercase tracking-wider flex items-center gap-0.5 group-hover/notice:translate-x-0.5 transition-transform">
                     View Details ➔
                   </span>
                   <span className="text-[8px] font-bold text-neutral-400 italic">{post.postDate}</span>
                </div>
              </Link>
           ))}
        </div>
      </section>

      {/* Modern Technical Footer Meta */}
      <section className="bg-neutral-900 dark:bg-zinc-950 border border-neutral-800 rounded-xl p-5 sm:p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden text-neutral-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] from-blue-500/10 opacity-30 pointer-events-none" />
        
        <div className="relative z-10 space-y-1">
          <h3 className="text-base font-black uppercase tracking-tight">Powered for the Modern Era</h3>
          <p className="text-zinc-400 text-[10px] font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-wider">Combining legacy speed with contemporary precision. Optimized for high-throughput bulletin processing.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 opacity-90 relative z-10 font-sans">
           <div className="flex items-center gap-2">
              <Cpu className="text-blue-500" size={16} />
              <div className="text-left">
                <span className="block text-[7px] font-extrabold uppercase tracking-widest text-zinc-500 leading-none">Core Engine</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-200">Node-X v3.1</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Zap className="text-amber-500" size={16} />
              <div className="text-left">
                <span className="block text-[7px] font-extrabold uppercase tracking-widest text-zinc-500 leading-none">Edge Cache</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-200">Latency &lt; 40ms</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={16} />
              <div className="text-left">
                <span className="block text-[7px] font-extrabold uppercase tracking-widest text-zinc-500 leading-none">Security</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-200">Official Cert</span>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
}
