import React from 'react';
import AuthorCard from './AuthorCard';

interface Author {
  name: string;
  role: string;
  credentials: string[];
  qualifications: string[];
  bio: string;
  publications: string[];
  specialization: string[];
}

export const authors: Author[] = [
  {
    name: "Ashish Maurya",
    role: "Lead Content Curator & Founder",
    credentials: ["Former SSC Aspirant", "5+ Years Competitive Exam Analysis"],
    qualifications: ["B.Sc. in Physics", "Certified Content Strategist"],
    bio: "Ashish leverages his firsthand experience with India's top-tier competitive examinations to ensure every notification is synthesized with absolute accuracy and clarity for our users.",
    publications: ["The Future of Indian Competitive Exams (Journal of Education, 2023)", "SSC Aspirant's Handbook (Guidebook, 2022)"],
    specialization: ["SSC CGL", "Banking Exams", "Content Strategy"]
  },
  {
    name: "Editorial Team",
    role: "Verification & Compliance",
    credentials: ["Ex-Academic Researchers", "Data Science Professionals"],
    qualifications: ["M.A. in Public Administration", "Certified Data Analyst"],
    bio: "Our verification team meticulously cross-references official gazettes and direct government board portals to maintain the highest levels of trustworthiness in our recruitment data.",
    publications: ["Data Integrity in Public Notices (Research Paper, 2024)"],
    specialization: ["Official Gazettes", "Data Verification", "Compliance Monitoring"]
  }
];

export default function Authors() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {authors.map((author) => (
        <AuthorCard key={author.name} {...author} />
      ))}
    </div>
  );
}
