import React, { useState } from 'react';
import { Award, X, BookOpen, Target } from 'lucide-react';

interface AuthorCardProps {
  name: string;
  role: string;
  credentials: string[];
  qualifications: string[];
  bio: string;
  publications: string[];
  specialization: string[];
}

export default function AuthorCard({ name, role, credentials, qualifications, bio, publications, specialization }: AuthorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="border border-neutral-200 dark:border-zinc-800 rounded-2xl p-6 bg-neutral-50 dark:bg-neutral-900/50 cursor-pointer hover:border-blue-300 transition"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl text-blue-600">👤</div>
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{name}</h3>
            <p className="text-sm text-neutral-500 dark:text-zinc-400">{role}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-2 text-xs text-neutral-600 dark:text-zinc-300 items-start">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="font-medium">{credentials.join(" • ")}</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed italic">
            "{bio}"
          </p>
          <span className="text-xs text-blue-600 font-semibold underline">View Full Profile</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 max-w-lg w-full border border-neutral-200 dark:border-zinc-800 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white" onClick={() => setIsModalOpen(false)}>
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl text-blue-600">👤</div>
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{name}</h2>
                <p className="text-neutral-500 dark:text-zinc-400">{role}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-zinc-100 mb-2">Qualifications</h4>
                <ul className="list-disc pl-5 text-sm text-neutral-600 dark:text-zinc-300 space-y-1">
                  {qualifications.map((q, i) => <li key={i}>{q}</li>)}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-neutral-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Publications
                </h4>
                <ul className="text-sm text-neutral-600 dark:text-zinc-300 space-y-1">
                  {publications.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" /> Areas of Specialization
                </h4>
                <div className="flex flex-wrap gap-2">
                  {specialization.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-neutral-100 dark:bg-zinc-800 rounded-full text-xs font-medium text-neutral-700 dark:text-zinc-300">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
