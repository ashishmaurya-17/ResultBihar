import { Post } from '../types';

// Helper to generate realistic markdown details based on category and title
function generateMockContent(collection: string, title: string, postDate: string): string {
  const orgName = title.split(' ')[0] || 'Government';
  const lastDate = new Date(postDate);
  lastDate.setDate(lastDate.getDate() + 30);
  const lastDateStr = lastDate.toISOString().split('T')[0];

  return `---
title: "${title}"
collection: "${collection}"
postDate: "${postDate}"
summary: "Official bulletin and online registration details for ${title} under central/state services."
organization: "${orgName}"
state: "Central"
lastDateToApply: "${lastDateStr}"
examDate: "Notify Later"
---

## 🗓️ Important Dates
| Event | Date |
|:---|:---|
| Notification Release | ${postDate} |
| Online Application Starts | ${postDate} |
| Last Date to Apply Online | ${lastDateStr} |
| Exam Date | Announced Soon |
| Admit Card Availability | 10 Days Before Exam |

## 💳 Application Fee Details
| Candidates Category | Fee (Amount in INR) |
|:---|:---|
| General / OBC / EWS | Rs. 100 / Rs. 500 (As per norms) |
| SC / ST / Physically Challenged | Exempted / Rs. 100 |
| Female Applicants (All Categories) | Rs. 0 |

## 🎓 Age Criteria & Educational Qualification
* **Age Limit:** Minimal age 18 years, Maximum age 27 to 32 years. Upper age relaxations applicable.
* **Basic Requirement:** Passed Matriculation (Class 10th), Intermediate (Class 12th) or Bachelor Degree in the relevant disciplines from any recognized institute in India.

## 📋 Simple Instructions to Register
1. Visit the official website or portal link provided above.
2. Complete candidate registration using an active Email ID and Mobile number.
3. Login using your registration credentials and fill the personal information sheets.
4. Upload clear scanned copy of passport photographs and sign cards carefully.
5. Pay the online application fee via Netbanking, Credit card, Decit Card or UPI.
6. Verify and crosscheck all parameters before final submit. Take a print of the final page.
`;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')       // Remove common special characters
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

export function generateMockPostsForCollection(collection: string, currentCount: number, targetCount: number = 1000): Post[] {
  const needed = targetCount - currentCount;
  if (needed <= 0) return [];

  const mockLists: Record<string, string[]> = {
    'jobs': [
      "UP Police Constable Direct Recruitment 2026 Online Form (60,244 Posts)",
      "Indian Army Agniveer Rally Recruitment Scheme Online Registration 2026",
      "SBI Junior Associates Clerk Bharti Online Application 2026",
      "CISF Head Constable & ASI Recruitment Phase II Phase 2026",
      "Bihar Vidhan Parishad Sachivalaya Reporter & Assistant Online Form",
      "UPSC Civil Services Examination CSE Prelims Registration 2026",
      "IBPS RRB Officers Scale-I & Office Assistant Application 2026",
      "Haryana HSSC CET Group C & D Various Posts Registration 2026",
      "MPPEB Vyapam Sub Engineer & Group 3 Direct Recruitment 2026",
      "LIC Assistant Apprentice Development Officer ADO Entry 2026",
      "Navy SSC Executive & Technical Officer Online Registration 2026",
      "ISRO Scientist Engineer Technical SC Recruitment Portal 2026",
      "DFCCIL Executive and Junior Executive Post Cadre Details 2026",
      "FCI Category II & III Assistant Grade-3 Management Post Online 2026",
      "Delhi Police Multi Tasking Staff Civil Direct Recruitment 2026",
      "Coast Guard Navik General Duty & Domestic Branch Online Form 2026",
      "Sanjay Gandhi SGPGI Staff Nurse Grade B Nursing Bharti 2026",
      "EPFO Social Security Assistant SSA Combined Online Registration 2026",
      "Intelligence Bureau ACIO Grade II Executive Exam Online Form 2026",
      "BPSC Head Teacher Primary Schools competitive Written exam 2026",
      "North Souh Eastern Railways Class IV Apprentice Selection List 2026"
    ],
    'results': [
      "SSC GD Constable Computer Based Test Exam Result & Cutoffs 2026",
      "UPSC Civil Services Prelims Exam Declared Merit List 2026",
      "CBSE Class 12th Intermediate Annual Board Exam Result Score 2026",
      "NTA JEE Main Session II NTA Score & Rank Card Verification 2026",
      "BPSC 71st Combined Competitive Exam Final Selected Candidate List",
      "Bihar Board BSEB Inter Class 12th Toppers Marks Announcement",
      "UPSSSC PET Result & Score Card Verification Link 2025/2026",
      "NEET UG Entrance Exam Scoring & Qualifying Cutoffs List 2026",
      "IBPS PO Phase II Mains Exam Selected Candidates Merit List 2026",
      "DRDO CEPTAM Tech A & B Skill Test Outcomes Release 2026",
      "Rajasthan RSMSSB Patwari Written Exam Merit Selection Rank 2026",
      "MP Police Constable Written Test Final Qualifiers Rank 2026",
      "HSSC CET Group C Scores & Merit Eligibility Certificate 2026",
      "GATE Master Degree Entrance Exam Toppers List & Scorecard 2026",
      "CSIR NET Chemical/Physical Sciences Merit Qualification Rank 2026",
      "CTET Paper 1 and Paper 2 Official Final Result List Oct 2026",
      "UP Board High School & Intermediate Exams Merit Results 2026",
      "IBPS Clerk Recruitment Phase-I Test General Scores 2026",
      "Indian Airforce Agniveer Vayu Intake Selected Airmen Check 2026",
      "UGC NET Assistant Professor Exam Standard Scorecard Index 2026",
      "ESIC Nursing Sister Competitive Final Seat Allotment List 2026"
    ],
    'admit-cards': [
      "NTA NEET UG Entrance Exam Admit Card / Hall Ticket Download 2026",
      "SSC CGL Tier-1 Computer Based Examination Admit Card 2026",
      "UPSC Civil Services Civil Exam Pre Hall Ticket Download 2026",
      "Bihar STET (Secondary Teacher Eligibility Test) Admit Card Phase-I",
      "RRB Assistant Loco Pilot ALP Exam Date & City Intimation Slip 2026",
      "CSIR UGC NET June Session Admit Card Name Wise Download Online",
      "UP Police Constable Written Exam Admit Card / Center Location 2026",
      "JEE Advanced National Level Entrance Exam Admit Card June 2026",
      "CTET Sept 2026 Pre Admit Card & Center District Information",
      "BPSC 72nd Combined Competitive Exam Prelims Admit Card Download",
      "NDA & NA Group A Written Examination Call Letter Intake 2026",
      "SBI Clerk Main Test Phase 2 Admit Card / Venue Notice 2026",
      "Navy Agniveer SSR / MR Computer Test Hall Ticket Released 2026",
      "Airforce Agniveer Vayu Intake CBT Examination Phase I Call Letter",
      "Delhi Police Constable Physical Efficiency Test PET Dates Admit Card",
      "Bihar Police CSBC Inspector Physical Checkup Verification Admit Card",
      "UPPSC Combined State Upper Subordinate Pre Exam Hall Ticket 2026",
      "MPPSC State Service Competitive Exam Hall Ticket Call Letter 2026",
      "DSSSB TGT / PGT Vacancy Written Exam Call Letter Download 2026",
      "Jharkhand JSSC CGL Combined Graduate Rank Pre Exam Status Sheet",
      "Rajasthan REET Level 1 & 2 Teacher Eligibility Test Admit Card 2026"
    ],
    'answer-keys': [
      "UPSC CSE Preliminary Solved Question Paper / Unofficial Key 2026",
      "SSC GD Constable Computer Based Test Provisional Answer Key Sheet",
      "NTA JEE Main Session II Official Response Sheets & Answers Key",
      "CTET September Class I to VIII Series Wise Official Key Sheet",
      "GATE Written Entrance Exam Series Answer Book & Keys Sheet 2026",
      "UP Police SI / Platoon Commander Exam Answer Response Key 2026",
      "BPSC Secondary School Headmaster Competitive Key Answers PDF",
      "CSIR UGC NET Science Stream Official Key & Objection Portal",
      "Bihar Police CSBC Constable Exam Series-wise Set Keys 2026",
      "Agniveer Army Common Entrance Exam Provisional Keys PDF 2026",
      "RSMSSB Rajasthan Junior Accountant Phase-I Key Solutions 2026",
      "DSSSB Junior Clerk & Stenographer Response Sheet Keys Online",
      "MPPEB Primary Teacher Eligibility Exam Provisional Answers Key",
      "Haryana HSSC CET Group D Exam Master Set Key Solutions 2026",
      "UGC NET June Cycle Subject-Wise Key Sheets with Objections Check",
      "UPSSSC Lower Subordinate Preliminary Answer Key Download PDF",
      "CLAT National Law Entrance Exam Answer Key Objection Format 2026",
      "BCECEB Bihar Polytechnic PE / PM Entrance Answer Key Sheet 2026",
      "TSPSC Group II Services Exam Sectional Provisional Answers 2026",
      "APPSC Group-I Preliminary Exam Series A, B, C, D Key 2026",
      "LIC Apprentice Development Officer Written Exam Key Details 2026"
    ],
    'admissions': [
      "Delhi University DU UG Merit-Based Online Admission Form 2026",
      "JNU PG / Ph.D Entrance Admission Online Registrations Status 2026",
      "BHU SET Class 6th, 9th, 11th School Entrance Test Form 2026",
      "UP JEEP Polytechnic Engineering Diploma Admission Form 2026",
      "Bihar UGEAC Engineering Degree Rank Merit Online Counselling Form",
      "NTA CUET UG National Entrance Level Common Admission Form 2026",
      "CLAT UG / PG Integrated Law Course Online Form 2026-2027",
      "BCECEB Bihar B.Tech Common Private and Govt Engineering Form",
      "CBSE Class 11th Centralized School Transfer Registration 2026",
      "IP University IPU CET UG / PG Multi Professional Course Form 2026",
      "IIT JEE Advanced Online Joint Seat Allocation JOSAA Choice Form",
      "Jamia Millia Islamia School & University Admission Form 2026",
      "UP B.Ed Joint Entrance Examination JEE Counselling Form 2026",
      "IGNOU Open University July Session Fresh Admission Application 2026",
      "KVS Kendriya Vidyalaya Class 1 to 10 Admissions Merit Criteria",
      "Bihar D.El.Ed Joint Entrance Exam Course Admissions Form 2026",
      "Ambedkar University Delhi AUD UG Undergraduate Choice Enrolment 2026",
      "Sanjay Gandhi PGIMER Lucknow B.Sc Nursing Admission Form 2026",
      "AIIMS PG / Fellowship July Session Online Choice Enrolment 2026",
      "NIFT National Institute of Fashion Design UG Entry Registration",
      "Rajasthan PTET 2-Year & 4-Year Integrated Bed Admission Entry 2026"
    ],
    'syllabus': [
      "SSC CGL Tier 1 & Tier 2 Detailed Logical Exam Pattern 2026",
      "UPSC NDA & NA Written Exam Section-wise Subjects PDF Guide",
      "UPSC Civil Services Prelims & Mains General Studies Syllabus 2026",
      "BPSC 72nd Combined Civil Service Detailed Examination Pattern 2026",
      "RRB Assistant Loco Pilot ALP CBT-1, CBT-2 Technical Syllabus 2026",
      "CTET Class 1-5 & 6-8 Paper-I and Paper-II Detailed Guide Index",
      "UP Police Constable Written Exam Topic Wise Syllabus Details 2026",
      "Bihar Police Constable Physical Test Detailed Standards Index 2026",
      "JEE Main Session 1 & 2 Syllabus Physics, Chemistry, Maths Details",
      "SBI PO Phase I Prelims & Mains Aptitude Marking Pattern Syllabus",
      "UGC NET General Paper Humanities Optional Broad Subject Syllabus",
      "GATE Computer Science Engineering Chapter Wise Syllabus Scheme",
      "Navy Agniveer SSR Technical Math and Science Official Syllabus",
      "CSIR UGC NET Life Science and Physical Earth Science Blueprint 2026",
      "SSC GD Constable General Intelligence Reasoning Syllabus Plan 2026",
      "UPSSSC Lower Subordinate Administrative Posts Exam Blueprint 2026",
      "EPFO Assistant Provident Fund Commissioner Syllabus PDF Syllabus",
      "IBPS Clerk Combined Sectional Exam Marks Scheme Syllabus Guide",
      "LIC ADO Marketing & Insurance Awareness Topic Wise Checklist 2026",
      "CDS Combined Defence Services Written General Studies Syllabus 2026",
      "Indian Airforce Agniveer Non-Technical Airmen Syllabus Guide 2026"
    ],
    'scholarships': [
      "National Scholarship Portal NSP Pre/Post Matric Online Form 2026",
      "UP State Pre-Matric & Post-Matric Student Fee Rebate Status Check",
      "Bihar Post Matric Scholarship PMS OBC SC ST Registration Portal 2026",
      "AICTE Pragati Scholarship Scheme for Girls Engineering Students 2026",
      "ONGC Merit Scholarship Scheme for SC & ST Professional Students",
      "Jagadish Bose National Science Talent Search Senior Scheme Guide",
      "Central Sector Scheme of Scholarship for College and University 2026",
      "LIC Golden Jubilee Scholarship Scheme for Economically Weaker 2026",
      "Pre-Matric Scholarship Scheme for Minorities Online Selection 2026",
      "MOMA Post Matric National Minority Scholarship Program Form 2026",
      "Inspire Scholarship for Higher Education SHE Scheme Application",
      "Prime Minister Scholarship Scheme PMSS Central Armed Police Forces",
      "Rajasthan Uttar Matric Scholastic Fee Reimbursement Direct Benefit",
      "MP State Post Matric SC & ST Scholarship Profile Registration 2026",
      "HDFC Bank Educational Crisis Scholarship Support Program ECSS 2026",
      "Sitaram Jindal Foundation Rural & Weaker Section Student Scholarship",
      "Begum Hazrat Mahal National Scholarship for Minority Meritorious Girls",
      "GP Birla Educational Foundation Scholarship for Merit Weaker Boys",
      "Tata Trust Grant for Professional and Technical Degree Courses 2026",
      "Kotak Kanya Scholarship Scheme for Supporting Girl Candidates 2026",
      "AICTE Swanath Scholarship Scheme for Orphan or Specially Abled"
    ],
    'yojana': [
      "PM Kisan Samman Nidhi Yojana 18th Installment Beneficiary List 2026",
      "Pradhan Mantri Awas Yojana PMAY Urban and Gramin Application Status",
      "Ladli Behna Yojana Monthly Cash Transfer List Selection 2026",
      "Bihar Mukhyamantri Udyami Yojana Rs. 10 Lakh Loan Selection List",
      "Ayushman Bharat Golden Card Registration & Eligible Hospitals List",
      "PM Vishwakarma Toolkit Incentive Scheme Registration Checklist 2026",
      "PM Yashasvi Student Laptop and Incentive Scheme Qualifying Portal",
      "Mukhyamantri Kanya Utthan Yojana Graduation Degree Incentive Status",
      "UP BC Sakhi Yojana Gram Panchayat Wise Beneficiaries Online List",
      "PM Mudra Loan Scheme - Shishu Kishore Tarun Online Loan Options",
      "PM Swanidhi Special Rs. 10,000 Street Vendor Loan Online Apply 2026",
      "Jan Dhan Account Holder Insurance and Overdraft Benefit Schemes 2026",
      "Lakhpati Didi Self Help Group Financial Literacy & Grant Roster",
      "Pradhan Mantri Shram Yogi Maandhan PMSYM Pension Slater Chart 2026",
      "UP Free School Laptop/Tablet Distribution College Enrollment List",
      "Ladli Laxmi Scheme 2.0 Madhya Pradesh Certificates Download Guide",
      "Bihar Mukhyamantri Har Ghar Nal Ka Jal Complaint Reporting Portal",
      "Swachh Bharat Abhiyan Toilets Construction Subsidy Status Card 2026",
      "Atal Pension Yojana APY Monthly Premium & Pension Slater Chart",
      "PM Suraksha Bima Yojana Rs. 2 Lakh Accident Cover Enrollment Guide",
      "Stand Up India Scheme Loans for Women and SC/ST Entrepreneurs 2026"
    ]
  };

  const titles = mockLists[collection] || [];
  const results: Post[] = [];

  for (let i = 0; i < needed; i++) {
    const titleIndex = i % titles.length;
    const title = titles[titleIndex] || `${collection.toUpperCase()} Announcement ${i + 1}`;
    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${collection}-${i}`;

    // Create dates descending from 2026-06-02 to the past
    const postDateObj = new Date("2026-06-03");
    postDateObj.setDate(postDateObj.getDate() - (i + (currentCount > 0 ? 1 : 0)));
    const postDateStr = postDateObj.toISOString().split('T')[0];

    const content = generateMockContent(collection, title, postDateStr);

    results.push({
      id: slug,
      slug,
      title,
      collection,
      postDate: postDateStr,
      summary: `This is an official advisory notification for ${title}.`,
      attributes: {
        title,
        collection,
        postDate: postDateStr,
        summary: `This is an official advisory notification for ${title}.`,
      },
      content,
    });
  }

  return results;
}
