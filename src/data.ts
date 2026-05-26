import { Post } from './types';

export const INITIAL_POSTS: Post[] = [
  {
    id: 'bpsc-tre-4-teacher',
    collection: 'jobs',
    title: 'BPSC School Teacher Recruitment (TRE 4.0) Online Form 2026',
    organization: 'BPSC',
    postDate: '2026-05-20',
    lastDateToApply: '2026-06-15',
    category: 'Latest Job',
    districtLocations: ['All Bihar Districts'],
    state: 'Bihar',
    draft: false,
    featured: true,
    urgent: true,
    tags: ['BPSC', 'Teacher', 'TRE 4.0', 'Sarkari Naukri', 'Patna'],
    summary: 'Bihar Public Service Commission (BPSC) has released the official advertisement for school teacher recruitment Exam (TRE 4.0) for Primary, Middle, Secondary, and Higher Secondary Classes. Eligible candidates can apply online starting from May 25, 2026.',
    ageLimits: {
      min: 18,
      max: 37,
      description: 'Minimum Age limit: 18 years (Primary) / 21 Years (TGT/PGT). Maximum Age: 37 years for Male & 40 years for Female. Age relaxation applicable as per rules.'
    },
    applicationFee: {
      general: 750,
      obc_ebc: 750,
      sc_st: 200,
      female: 200,
      description: 'Biometric identification fee of ₹200 additional for candidates not providing Aadhaar Number during registration.'
    },
    vacancyDetails: {
      totalPosts: 85500,
      postName: 'School Teacher (Primary, Middle, TGT, PGT)',
      eligibility: 'CTET/BTET, STET, D.El.Ed, B.Ed or equivalent qualification based on the level.',
      table: [
        { postName: 'Primary Teacher (Class 1-5)', total: '28,140', eligibility: '12th (50%) + D.El.Ed & CTET/BTET Paper-I qualified' },
        { postName: 'Middle School (Class 6-8)', total: '19,650', eligibility: 'Graduation + D.El.Ed/B.Ed & CTET/BTET Paper-II qualified' },
        { postName: 'TGT Trained Graduate (Class 9-10)', total: '20,110', eligibility: 'Graduation in related subject + B.Ed & STET Paper-I qualified' },
        { postName: 'PGT Post Graduate (Class 11-12)', total: '17,600', eligibility: 'Post Graduation in related subject + B.Ed & STET Paper-II qualified' }
      ]
    },
    importantLinks: [
      { label: 'Apply Online (Link Active)', url: 'https://onlinebpsc.bihar.gov.in', isPrimary: true },
      { label: 'Download TRE 4.0 Official Notification', url: 'https://bpsc.bih..nic.in', isDownload: true },
      { label: 'BPSC Official Website', url: 'https://bpsc.bih.nic.in' }
    ],
    selectionProcess: [
      'Written MCQ-Based Combined Examination (No Negative Marking)',
      'Document Verification',
      'Final Merit List Allocation based on Score and District Preferences'
    ],
    howToApply: `1. Visit Bihar Public Service Commission (BPSC) official registration portal.
2. Under "Online Applied", click on the registration link for TRE 4.
3. Fill out basic registration details and pay the registration fee.
4. Upload high-quality scans of signature, passport photo (live capture), and essential qualification certificates (certificates/degree marksheets).
5. Review all details carefully before final submit. Take a printout of the final system-generated PDF copy for counseling references.`
  },
  {
    id: 'bseb-10th-matric-result-2026',
    collection: 'results',
    title: 'BSEB Bihar Board Class 10th (Matric) Annual Examination Result 2026',
    organization: 'BSEB',
    postDate: '2026-05-25',
    resultDate: '2026-05-25',
    category: 'Board Result',
    districtLocations: ['All Bihar Districts'],
    state: 'Bihar',
    draft: false,
    featured: true,
    urgent: true,
    tags: ['BSEB', 'Matric Result', 'Class 10th', 'Bihar Board'],
    summary: 'Bihar School Examination Board (BSEB) has officially declared the Class 10th (Matriculation) annual exam cumulative scores and division list. Over 16 Lakh candidates appeared in this year\'s examination across Bihar.',
    importantLinks: [
      { label: 'Check Matric Result Link I', url: 'http://results.biharboardonline.com', isPrimary: true },
      { label: 'Check Matric Result Link II', url: 'http://biharboardonline.bihar.gov.in', isPrimary: true },
      { label: 'Download Toppers List PDF', url: 'http://biharboardonline.com/toppers', isDownload: true }
    ],
    selectionProcess: [
      'Enter Roll Code and Roll Number as printed on your official BSEB Admit Card.',
      'Solve the simple Captcha verification calculation.',
      'Click "View / Submit" to check grades, subject-wise marks, and division allocation.'
    ],
    howToApply: 'No Application required. Simply click the primary links above, enter your roll code, roll number and save your marks memo.'
  },
  {
    id: 'bihar-police-constable-admit-card-2026',
    collection: 'admit-cards',
    title: 'CSBC Bihar Police Constable Written Exam Admit Card 2026',
    organization: 'CSBC',
    postDate: '2026-05-24',
    admitCardPublishDate: '2026-05-24',
    category: 'Admit Card',
    districtLocations: ['All Bihar Districts'],
    state: 'Bihar',
    draft: false,
    featured: true,
    urgent: false,
    tags: ['Bihar Police', 'CSBC', 'Admit Card', 'Constable', 'Sarkari Exam'],
    summary: 'Central Selection Board of Constables (CSBC) has released the admit cards for the written examination of Bihar Police Constable (21,391 Posts). Download starts from midnight 24th May.',
    vacancyDetails: {
      totalPosts: 21391,
      postName: 'Police Constable',
      eligibility: '12th (Intermediate) passed from recognized board.'
    },
    importantLinks: [
      { label: 'Download Constable Admit Card Link I', url: 'https://csbc.bih.nic.in/constable-admit', isPrimary: true },
      { label: 'Find Exam Center List Details PDF', url: 'https://csbc.bih.nic.in/centers.pdf', isDownload: true }
    ],
    selectionProcess: [
      'Written Examination (Qualifying, 100 Marks MCQ)',
      'Physical Efficiency Test (PET) - Qualifying & Rank Booster (Running, Shot Put, High Jump)',
      'Medical Test & Document Checklist Scrutiny'
    ]
  },
  {
    id: 'bseb-stet-answer-key-2026',
    collection: 'answer-keys',
    title: 'Bihar STET 2026 Official Answer Key & Objection Portal',
    organization: 'BSEB',
    postDate: '2026-05-22',
    category: 'Answer Key',
    state: 'Bihar',
    draft: false,
    tags: ['BSEB', 'STET', 'Answer Key', 'Objection'],
    summary: 'Bihar School Examination Board (BSEB) has uploaded the preliminary answer key and response sheet for the State Teacher Eligibility Test (STET) 2026. Candidates can check answers and submit grievances.',
    importantLinks: [
      { label: 'Download STET Paper 1 Answer Key', url: 'https://secondary.biharboardonline.com/stet-key1', isPrimary: true },
      { label: 'Download STET Paper 2 Answer Key', url: 'https://secondary.biharboardonline.com/stet-key2', isPrimary: true },
      { label: 'Submit Answer Key Challenge / Objection', url: 'https://secondary.biharboardonline.com/objections' }
    ],
    selectionProcess: [
      'Login with Application Number and Date of Birth.',
      'Check question number with corresponding official keys.',
      'Pay ₹50 per question challenged in case of errors in keys.'
    ]
  },
  {
    id: 'bihar-bed-cet-admission-2026',
    collection: 'admissions',
    title: 'Bihar B.Ed Combined Entrance Test CET (LNMU) Admission 2026',
    organization: 'LNMU',
    postDate: '2026-05-18',
    lastDateToApply: '2026-06-10',
    category: 'Admission',
    state: 'Bihar',
    draft: false,
    tags: ['B.Ed', 'CET', 'LNMU', 'Darbhanga', 'Admission'],
    summary: 'Lalit Narayan Mithila University (LNMU), Darbhanga has released the Prospectus and application form for state level regular B.Ed and Shiksha Shastri 2 Year Course Joint Entrance Exam CET. Supercharge your teaching credentials.',
    applicationFee: {
      general: 1000,
      obc_ebc: 750,
      sc_st: 500,
      description: 'Online modes: Debit card, credit card, netbanking, or UPI payments are accepted.'
    },
    vacancyDetails: {
      totalPosts: 35000,
      postName: 'B.Ed Teacher Training Seat Allotment',
      eligibility: 'Graduate or Master Degree with at least 55% aggregate marks.'
    },
    importantLinks: [
      { label: 'Fill B.Ed CET Entrance Application', url: 'https://biharcetbed-lnmu.in', isPrimary: true },
      { label: 'Download Complete B.Ed Prospectus PDF', url: 'https://biharcetbed-lnmu.in/prospectus.pdf', isDownload: true }
    ],
    selectionProcess: [
      'State level Written Entrance Test (CET-BED, 120 Marks MCQ)',
      'Web Counselling & Merit College Selection Choice Lock',
      'Reporting at Colleges and Fee Submission'
    ]
  },
  {
    id: 'bpsc-main-syllabus-2026',
    collection: 'syllabus',
    title: 'BPSC Integrated 70th Combined Competitive Main Exam Syllabus',
    organization: 'BPSC',
    postDate: '2026-05-15',
    category: 'Syllabus',
    state: 'Bihar',
    draft: false,
    tags: ['BPSC', 'Syllabus', '70th CCE', 'Patna'],
    summary: 'Detailed examination pattern, topic distributions, and guidelines released by BPSC for the integrated 70th CCE Mains papers. Download the syllabus PDF for General Hindi, GS-I, GS-II, Essay and Optional subjects.',
    importantLinks: [
      { label: 'Download BPSC Main Exam Syllabus PDF', url: 'https://bpsc.bih.nic.in/70-mains-syllabus.pdf', isPrimary: true, isDownload: true },
      { label: 'Go to standard sample papers archive', url: 'https://bpsc.bih.nic.in/previous-papers' }
    ]
  },
  {
    id: 'bihar-pms-scholarship-2026',
    collection: 'scholarships',
    title: 'Bihar Post Matric Scholarship PMS Online Registration Form 2026',
    organization: 'Education Dept',
    postDate: '2026-05-24',
    lastDateToApply: '2026-07-15',
    category: 'Scholarship',
    state: 'Bihar',
    draft: false,
    featured: true,
    tags: ['PMS', 'Scholarship', 'OBC', 'SC', 'ST', 'Education'],
    summary: 'Government of Bihar Education Department invites online registration forms for SC, ST, EBC, and BC category students of Bihar State pursuing Post-Metric intermediate, graduation, medical, or engineering programs in or outside Bihar.',
    applicationFee: {
      general: 0,
      obc_ebc: 0,
      sc_st: 0,
      description: 'Zero Application Fee for applying. Strictly for residents of Bihar with family annual incomes under ₹3 Lakhs.'
    },
    importantLinks: [
      { label: 'Register as SC/ST Student link', url: 'https://pmsonline.bih.nic.in', isPrimary: true },
      { label: 'Register as BC/EBC Student link', url: 'https://pmsonline.bih.nic.in/bcebc', isPrimary: true },
      { label: 'PMS Student Guidelines & FAQs', url: 'https://pmsonline.bih.nic.in/help.html' }
    ],
    selectionProcess: [
      'Online Form Submission with valid caste, income, and residential certificates.',
      'Verification of student records by Institution Nodal Officer.',
      'Physical verification of institutions, followed by DBT direct bank transfer of scholarship amount into student\'s Aadhaar-seeded bank account.'
    ]
  },
  {
    id: 'bihar-kanya-utthan-yojana-2026',
    collection: 'yojana',
    title: 'Mukhyamantri Kanya Utthan Yojana (Graduation Passed) Form 2026',
    organization: 'WCD Bihar',
    postDate: '2026-05-25',
    lastDateToApply: '2026-08-30',
    category: 'Government Scheme',
    state: 'Bihar',
    draft: false,
    tags: ['Kanya Utthan', 'Yojana', 'Girl Child', 'Graduation Promotion'],
    summary: 'Under the flagship Chief Minister Kanya Utthan Yojana, women students who have successfully cleared graduate degree exams from recognized universities of Bihar are provided with an incentive award of ₹50,000.',
    importantLinks: [
      { label: 'Apply Online for Graduation Incentive', url: 'https://medhasoft.bih.nic.in', isPrimary: true },
      { label: 'Track Payment & Beneficiary Status', url: 'https://medhasoft.bih.nic.in/status' },
      { label: 'Download Guideline Instructions PDF', url: 'https://medhasoft.bih.nic.in/guidelines.pdf', isDownload: true }
    ],
    howToApply: `1. Ensure your university has already uploaded your name and final grade transcript to the Medhasoft portal.
2. Complete online registration by matching Aadhaar detail, bank details (which must belong directly to the nominee candidate), and certificate.
3. Submit residency certificate details (must be a permanent citizen of Bihar state).
4. After verification by respective administrative bodies, the fund will be deposited directly to your bank account.`
  },
  {
    id: 'up-police-constable-result-2026',
    collection: 'results',
    title: 'Uttar Pradesh UP Police Constable Written Exam Result scorecard 2026',
    organization: 'UPPRPB',
    postDate: '2026-05-23',
    resultDate: '2026-05-23',
    category: 'Board Result',
    districtLocations: ['All UP Districts'],
    state: 'Uttar Pradesh',
    draft: false,
    tags: ['UP Police', 'Result', 'UPPRPB', 'Lucknow'],
    summary: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) has declared the final results for the written examination for constable vacancies (60,244 Posts). Access cutoffs and physical exam schedules.',
    importantLinks: [
      { label: 'Check UP Police Result direct Link', url: 'https://uppbpb.gov.in', isPrimary: true },
      { label: 'Download Selection List PDF', url: 'https://uppbpb.gov.in/cutoff-list.pdf', isDownload: true }
    ]
  },
  {
    id: 'jharkhand-jssc-cgl-admit-card-2026',
    collection: 'admit-cards',
    title: 'JSSC Jgclcce (CGL Combined Graduate Level) Exam Admit Card 2026',
    organization: 'JSSC',
    postDate: '2026-05-22',
    admitCardPublishDate: '2026-05-22',
    category: 'Admit Card',
    districtLocations: ['All Jharkhand Districts'],
    state: 'Jharkhand',
    draft: false,
    tags: ['JSSC', 'CGL', 'Admit Card', 'Ranchi'],
    summary: 'Jharkhand Staff Selection Commission (JSSC) has uploaded the electronic admit card/hall tickets for the Graduate level Jgclcce competitive exams. Exam schedule is active across state centers.',
    importantLinks: [
      { label: 'Download JSSC CGL Admit Card', url: 'https://jssc.nic.in/cgl-admit', isPrimary: true },
      { label: 'Official Exam Instructions Circular', url: 'https://jssc.nic.in/instructions.pdf' }
    ]
  },
  {
    id: 'ssc-cgl-job-2026',
    collection: 'jobs',
    title: 'SSC CGL Group B & C Vacancy Online Application Form 2026',
    organization: 'SSC',
    postDate: '2026-05-15',
    lastDateToApply: '2026-06-25',
    category: 'Latest Job',
    districtLocations: ['All Over India'],
    state: 'All India',
    draft: false,
    tags: ['SSC', 'CGL', 'Central Job', 'Income Tax', 'CBI'],
    summary: 'Staff Selection Commission (SSC) has announced Tier 1 Combined Graduate Level CGL Recruitment 2026. This mega exam offers stellar posts like Assistant Section Officer, Assistant Audit Officer, Income Tax Inspector, and Excise Inspectors.',
    ageLimits: {
      min: 18,
      max: 32,
      description: 'Varies by individual post guidelines. Age relaxations apply for standard reservations.'
    },
    applicationFee: {
      general: 100,
      obc_ebc: 100,
      sc_st: 0,
      female: 0,
      description: 'Exempted for Women, SC, ST, ESM, and PwD applicants.'
    },
    vacancyDetails: {
      totalPosts: 12400,
      postName: 'ASO, Inspector, Auditor, Assistant',
      eligibility: 'Bachelor Degree in graduation from any recognized university.'
    },
    importantLinks: [
      { label: 'Register and Apply at SSC', url: 'https://ssc.gov.in', isPrimary: true },
      { label: 'Download SSC CGL 2026 Brochure PDF', url: 'https://ssc.gov.in/brochure.pdf', isDownload: true }
    ],
    selectionProcess: [
      'Tier 1 Computer-Based Written Objective MCQ Screening',
      'Tier 2 Core Mathematical, Reasoning, English, and General Studies Exam',
      'Computer Proficiency and Speed Typing Assessment Test'
    ]
  },
  {
    id: 'brabu-ug-admission-2026',
    collection: 'admissions',
    title: 'BRABU Bihar University UG CBCS Regular (BA, BSc, BCom) Admission Part 1 Form 2026',
    organization: 'BRABU',
    postDate: '2026-05-24',
    lastDateToApply: '2026-06-20',
    category: 'University Admission',
    state: 'Bihar',
    draft: false,
    tags: ['BRABU', 'Babu', 'Admission', 'UG', 'Muzaffarpur'],
    summary: 'Babasaheb Bhimrao Ambedkar Bihar University (BRABU), Muzaffarpur has commenced the online registration process for 4-Year Choice Based Credit System (CBCS) Undergraduate programs for Semester 1 (Session 2026-2030). Apply for BA, BSc, BCom streams across all constituent & affiliated colleges.',
    applicationFee: {
      general: 600,
      obc_ebc: 600,
      sc_st: 300,
      description: 'Late payment fee of ₹100 applies after final scheduled date.'
    },
    importantLinks: [
      { label: 'BRABU UMIS UG Admission portal', url: 'https://brabu.edu.in/umis', isPrimary: true },
      { label: 'Download BRABU Choice Colleges List PDF', url: 'https://brabu.net/college-list-2026.pdf', isDownload: true }
    ],
    selectionProcess: [
      'Registration on the official BRABU UMIS Admission Portal.',
      'Choice locking of selected constituent colleges in order of preferences.',
      'First Merit List publication based on intermediate 12th state board percentiles.',
      'Physical seat authentication at designated colleges.'
    ]
  },
  {
    id: 'vksu-graduation-part-1-result-2026',
    collection: 'results',
    title: 'VKSU Bihar Veer Kunwar Singh University Ara UG Part 1 BA, BSc, BCom Results 2026',
    organization: 'VKSU',
    postDate: '2026-05-26',
    resultDate: '2026-05-26',
    category: 'University Result',
    state: 'Bihar',
    draft: false,
    featured: true,
    tags: ['VKSU', 'Babu', 'Result', 'Part 1', 'Ara'],
    summary: 'Veer Kunwar Singh University (VKSU), Ara has officially declared the Bachelor of Arts (BA), Bachelor of Science (BSc), and Bachelor of Commerce (BCom) Part 1 (Honours/General) cumulative results. Download Subject wise scorecard memos online.',
    importantLinks: [
      { label: 'Check VKSU Part 1 Results portal Link', url: 'https://vksu.ac.in/results', isPrimary: true },
      { label: 'VKSU Official Homepage', url: 'https://vksu.ac.in' }
    ],
    selectionProcess: [
      'Navigate to VKSU Online Exam result gateway.',
      'Select Exam Session: 2025-2026, Course Type: Part 1 BA/BSc/BCom.',
      'Provide University Register Roll Code number & Mother\'s/Father\'s registered full name.',
      'Print or save the displayed subject-wise mark details.'
    ]
  }
];

export const STATES_LIST = ['All India', 'Bihar', 'Uttar Pradesh', 'Jharkhand'] as const;

export const DISTRICTS_BIHAR = [
  'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Arrah', 'Begusarai', 'Purnia', 'Katihar',
  'Munger', 'Nalanda', 'Chhapra', 'Vaishali', 'Samastipur', 'Motihari', 'Bettiah', 'Siwan', 'Gopalganj',
  'Jehanabad', 'Arwal', 'Baurh', 'Nawada', 'Aurangabad', 'Rohtas', 'Kaimur', 'Buxar', 'Lakhisarai', 'Sheikhpura',
  'Jamui', 'Khagaria', 'Saharasa', 'Supaul', 'Madhepura', 'Araria', 'Kishanganj', 'Purnea', 'Sheohar', 'Sitamarhi', 'Madhubani'
];
