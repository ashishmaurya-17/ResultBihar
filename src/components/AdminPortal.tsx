import React, { useState } from 'react';
import { Post, CollectionType } from '../types';
import { X, Send, Command, AlertCircle, FileText, CheckCircle2, Copy } from 'lucide-react';

interface AdminPortalProps {
  onAddPost: (post: Post) => void;
  onClose: () => void;
}

export default function AdminPortal({ onAddPost, onClose }: AdminPortalProps) {
  const [collection, setCollection] = useState<CollectionType>('jobs');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [state, setState] = useState<'Bihar' | 'Uttar Pradesh' | 'Jharkhand' | 'All India'>('Bihar');
  const [summary, setSummary] = useState('');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(37);
  const [totalPosts, setTotalPosts] = useState<number>(150);
  const [lastDate, setLastDate] = useState('2026-06-30');
  const [primaryLink, setPrimaryLink] = useState('https://state.bihar.gov.in');
  const [isDraft, setIsDraft] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  // States to hold the generated YAML frontmatter copy
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organization || !summary) {
      alert('Please fill out the Title, Organization, and Summary to generate your post.');
      return;
    }

    const newPostId = `${organization.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30)}`;

    const newPostObj: Post = {
      id: newPostId,
      collection: collection,
      title: title,
      organization: organization,
      postDate: new Date().toISOString().split('T')[0],
      lastDateToApply: lastDate,
      state: state,
      draft: isDraft,
      featured: isUrgent,
      urgent: isUrgent,
      tags: [organization, collection, state, 'New Announcement'],
      summary: summary,
      ageLimits: {
        min: minAge,
        max: maxAge,
        description: `Minimum Age limit: ${minAge} Years. Maximum Age limit: ${maxAge} Years. Age relaxation applicable according to ${organization} criteria.`
      },
      vacancyDetails: {
        totalPosts: totalPosts,
        postName: `${organization} Certified Vacancy`
      },
      importantLinks: [
        { label: 'Apply Online', url: primaryLink, isPrimary: true },
        { label: 'Download Official Notification Document', url: primaryLink, isDownload: true }
      ]
    };

    // Build standard Astro collection Frontmatter Markdown blueprint for users to copy/save (Sections 1 & 8 instruction)
    const frontmatter = `---
title: "${title}"
organization: "${organization}"
collection: "${collection}"
postDate: "${new Date().toISOString().split('T')[0]}"
lastDateToApply: "${lastDate}"
state: "${state}"
draft: ${isDraft}
urgent: ${isUrgent}
tags: [${[organization, collection, state, 'New Announcement'].map(t => `"${t}"`).join(', ')}]
summary: "${summary}"
ageLimits:
  min: ${minAge}
  max: ${maxAge}
vacancyDetails:
  totalPosts: ${totalPosts}
---

# ${title}
Official circular issued by ${organization} for residents of ${state}. Apply using direct link: ${primaryLink}
`;

    setGeneratedMarkdown(frontmatter);
    onAddPost(newPostObj);
    setShowSuccess(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    alert('Astro Markdown code blueprint with schema validation copied to keyboard!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden border border-neutral-200"
        id="admin-portal-modal"
      >
        
        {/* Header content */}
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base sm:text-lg tracking-tight font-sans">
              RESULT BIHAR CMS & MARKDOWN GENERATOR
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-red-800 text-neutral-100 hover:text-white p-1 rounded-full transition"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form area */}
        <div className="p-6 overflow-y-auto grow space-y-6">
          
          {!showSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-950 flex gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Astro Content Collections Schema Matcher</p>
                  <p>Adding a post here automatically updates your React frontend listing, and generates a fully compliant Astro Markdown file matching schema validation criteria!</p>
                </div>
              </div>

              {/* Form entries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">1. Choose Content Folder</label>
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value as CollectionType)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm text-neutral-800 outline-none"
                  >
                    <option value="jobs">/jobs (Sarkari Jobs)</option>
                    <option value="results">/results (Exam Results)</option>
                    <option value="admit-cards">/admit-cards (Hall Tickets)</option>
                    <option value="answer-keys">/answer-keys (Keys & Objections)</option>
                    <option value="admissions">/admissions (Counselling)</option>
                    <option value="syllabus">/syllabus (Exam Schemes)</option>
                    <option value="scholarships">/scholarships (Student Aid)</option>
                    <option value="yojana">/yojana (Chief Minister Schemes)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">2. Hiring Organization</label>
                  <input
                    type="text"
                    placeholder="e.g., BPSC, BSEB, LNMU, CSBC"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm outline-none"
                    required
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">3. Announcement Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Bihar High School Teacher 4th Phase Online Registration form 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">4. Target State Zone</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value as any)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm text-neutral-800 outline-none"
                  >
                    <option value="Bihar">Bihar</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="All India">All India</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">5. Deadline to Register</label>
                  <input
                    type="date"
                    value={lastDate}
                    onChange={(e) => setLastDate(e.target.value)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">6. Total Post Counts</label>
                  <input
                    type="number"
                    value={totalPosts}
                    onChange={(e) => setTotalPosts(Number(e.target.value))}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">7. Direct Apply/Download URL</label>
                  <input
                    type="url"
                    placeholder="https://onlinebpsc.bihar.gov.in"
                    value={primaryLink}
                    onChange={(e) => setPrimaryLink(e.target.value)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm outline-none font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase font-mono">8. Core Summary Bulletin</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a 2-3 sentence overview of this news. It will appear on the bento listings."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-neutral-50 border rounded-lg px-3 py-2 text-sm outline-none"
                    required
                  />
                </div>

                <div className="flex items-center gap-4 sm:col-span-2 pt-2 border-t">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-red-700 focus:ring-red-600 h-4 w-4"
                    />
                    <span>Highlight on Urgently Header Ticker Scrolling</span>
                  </label>
                </div>

              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-600 text-white font-bold px-5 py-2 rounded-lg text-xs sm:text-sm font-sans flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate Astro MD File</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-5" id="cms-success-screen">
              <div className="text-center space-y-2 py-4">
                <div className="inline-flex bg-emerald-100 p-2 text-emerald-800 rounded-full animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-lg text-neutral-900 font-sans">
                  CONGRATULATIONS: NEW POST ACTIVE!
                </h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  The post has been injected directly to your active browser context state successfully, and can now be searched and filtered.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-neutral-700 uppercase font-mono">
                    Astro collection markdown file contents
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold px-2.5 py-1.5 rounded flex items-center gap-1.5 transition border"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Copy Post Code</span>
                  </button>
                </div>

                <pre className="bg-neutral-900 text-amber-200 rounded-xl p-4 text-xs font-mono overflow-auto max-h-56 border border-neutral-950 leading-relaxed">
                  {generatedMarkdown}
                </pre>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <p className="text-[10px] sm:text-xs text-neutral-500 max-w-sm">
                  Save this matching schema content as <strong className="font-mono">src/content/{collection}/{organization.toLowerCase()}-post.md</strong> to commit to Astro!
                </p>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setTitle('');
                    setSummary('');
                    setOrganization('');
                  }}
                  className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  Add Another Post
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
