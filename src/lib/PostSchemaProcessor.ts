import { JobCategory, SarkariPost, ApplicationFee, UsefulLink, Post, ImportantDate, VacancyDetail } from '../types';

export class PostSchemaProcessor {
  static mapCollectionToCategory(col?: string): JobCategory {
    if (!col) return JobCategory.LATEST_JOBS;
    const c = col.toLowerCase().trim();
    if (c.includes('job')) return JobCategory.LATEST_JOBS;
    if (c.includes('result')) return JobCategory.RESULT;
    if (c.includes('admit')) return JobCategory.ADMIT_CARD;
    if (c.includes('answer')) return JobCategory.ANSWER_KEY;
    if (c.includes('admission')) return JobCategory.ADMISSION;
    if (c.includes('syllabus')) return JobCategory.SYLLABUS;
    if (c.includes('scholarship')) return JobCategory.SCHOLARSHIP;
    if (c.includes('yojana')) return JobCategory.SARKARI_YOJANA;
    return JobCategory.LATEST_JOBS;
  }

  static fromLegacyPost(legacy: Post): SarkariPost {
    const category = this.mapCollectionToCategory(legacy.collection);
    const attr = legacy.attributes || {};

    // 1. Dynamic Dates Extraction
    const dates: ImportantDate[] = [];
    if (Array.isArray(attr.importantDates)) {
      dates.push(...attr.importantDates);
    } else if (attr.importantDates && typeof attr.importantDates === 'object') {
      Object.entries(attr.importantDates).forEach(([label, val]) => {
        if (typeof val === 'string') {
          // Simplify common names on-the-fly
          let simpleLabel = label;
          if (label.toLowerCase().includes('commencement')) simpleLabel = 'Form Start Date';
          if (label.toLowerCase().includes('bulletin')) simpleLabel = 'Notice Update';
          dates.push({ label: simpleLabel, date: val });
        }
      });
    }

    // Fallbacks if empty
    if (dates.length === 0) {
      if (legacy.postDate) {
        dates.push({ label: "Form Start Date", date: legacy.postDate });
      }
      if (legacy.lastDateToApply) {
        dates.push({ label: "Last Date to Apply Online", date: legacy.lastDateToApply });
      } else if (attr.lastDateToApply) {
        dates.push({ label: "Last Date to Apply Online", date: attr.lastDateToApply });
      } else {
        // Fallback relative to published date + 20 days
        const publish = new Date(legacy.postDate || Date.now());
        const last = new Date(publish.getTime() + (20 * 24 * 60 * 60 * 1000));
        dates.push({ label: "Last Date to Apply (Expected)", date: last.toISOString().split('T')[0] });
      }
      dates.push({ label: "Exam Date Notice", date: "To be announced soon" });
      dates.push({ label: "Admit Card Download Date", date: "Coming soon" });
    }

    // 2. Fees extraction
    let fee: Partial<ApplicationFee> = {};
    if (attr.applicationFee && typeof attr.applicationFee === 'object') {
      fee = attr.applicationFee;
    } else if (attr.fees && typeof attr.fees === 'object') {
      fee = {
        generalOBC: attr.fees.general || attr.fees.obc,
        ewsSCST: attr.fees.sc || attr.fees.st || attr.fees.ews,
        ph: attr.fees.ph,
        mode: attr.fees.mode || "Online Debit / Credit Card / UPI",
        bankCharges: "None"
      };
    } else {
      fee = {
        generalOBC: attr.feeGeneral || attr.feeGeneralOBC || (attr.fee && typeof attr.fee === 'string' ? attr.fee : undefined),
        ewsSCST: attr.feeSCST || attr.feeEswSCST,
        ph: attr.feePH,
        mode: attr.paymentMode || attr.modeOfPayment,
      };
    }

    // Clean up empty parameters in partial fee object
    const cleanFee: ApplicationFee = {
      generalOBC: fee.generalOBC || "₹ 100/-",
      ewsSCST: fee.ewsSCST || "₹ 0/- (No Fee)",
      ph: fee.ph || "₹ 0/- (No Fee)",
      mode: fee.mode || "Debit Card, Credit Card, Net Banking or UPI Only",
      bankCharges: fee.bankCharges || "Bank charge extra as per your card/bank provider rules."
    };

    // 3. Age Limit
    const age = {
      minAge: attr.ageLimits?.min || attr.minAge || "18 Years",
      maxAge: attr.ageLimits?.max || attr.maxAge || "37 Years",
      relaxation: attr.ageRelaxation || "Extra age relaxation is given as per simple government rules."
    };

    // 4. Vacancies
    const vacancies: VacancyDetail[] = [];
    if (Array.isArray(attr.vacancies)) {
      vacancies.push(...attr.vacancies);
    } else if (attr.vacancyDetails) {
      if (Array.isArray(attr.vacancyDetails)) {
        vacancies.push(...attr.vacancyDetails);
      }
    }
    if (vacancies.length === 0) {
      vacancies.push({
        postName: legacy.title.replace(/Recruitment|2026/gi, '').trim() || "General Post",
        totalPosts: attr.totalPosts || attr.vacanciesCount || "Multiple Posts",
        details: attr.vacancyAllotment || "Please read the full notice details below."
      });
    }

    // 5. Links
    const links: UsefulLink[] = [];
    const sourceLinks = legacy.importantLinks || attr.importantLinks;
    if (Array.isArray(sourceLinks)) {
      sourceLinks.forEach((lnk: any) => {
        links.push({
          label: lnk.label || lnk.text || "Direct Link",
          url: lnk.url || "#",
          isPrimary: lnk.isPrimary || false
        });
      });
    }
    // Fallback links if missing
    if (links.length === 0) {
      links.push({ label: "Click here to Apply Online directly", url: "https://sarkariboard.com", isPrimary: true });
      links.push({ label: "Download Short Notice Bulletin PDF", url: "https://sarkariboard.com" });
      links.push({ label: "Download Full Official Notification", url: "https://sarkariboard.com" });
      links.push({ label: "Go to Official Website", url: "https://sarkariboard.com" });
    }

    // 6. Tools Allocation based on Category Custom Spec 15
    let tools: string[] = ["Age Checker Calculator", "Fee Estimator Calculator"];
    if (category === JobCategory.LATEST_JOBS) {
      tools = ["Bihar SSC Age Checker Tool", "Photo & Sign Sizes Resizer Tool", "OBC / EWS Document Validity Checker"];
    } else if (category === JobCategory.RESULT) {
      tools = ["BSEB Matric 10th Marks Checker", "Marks to GPA Grade Converter"];
    } else if (category === JobCategory.ADMIT_CARD) {
      tools = ["Admit Card Finder Tool", "Exam Centre Map Locator"];
    } else if (category === JobCategory.ANSWER_KEY) {
      tools = ["Negative Marks Estimator Tool", "Cutoff Category Target Decoder"];
    }

    // 7. Dynamic FAQs
    const faqs = attr.faqs || attr.faq || [];
    const cleanFaqs = Array.isArray(faqs) ? faqs.map((f: any) => ({
      question: f.question || f.q || "Common Help Query",
      answer: f.answer || f.a || "No extra details needed here."
    })) : [];

    if (cleanFaqs.length === 0) {
      cleanFaqs.push({
        question: `How to apply for ${legacy.title}?`,
        answer: `Go to direct link section below, click on the active Apply Online button, fill physical data, and submit before date closes.`
      });
      cleanFaqs.push({
        question: "Is there any extra age benefit available?",
        answer: "Yes, candidates representing SC, ST, OBC, or female/PH categories will get standard age limit relaxation as per basic reservation rules."
      });
    }

    return this.populateSarkariPost(category, {
      id: legacy.id,
      a1_postName: legacy.title,
      a2_postDateTime: legacy.postDate + "T10:00:00Z",
      a3_seoDescription: legacy.summary || `Get easy updates, simple dates schedule, check lists, and direct download links for ${legacy.title}. Stay updated with Sarkari Board expert helper.`,
      a4_importantDates: dates.map(d => {
        let label = d.label;
        if (label.toLowerCase().includes('commencement')) label = 'Form Start Date';
        if (label.toLowerCase().includes('bulletin')) label = 'Notice Page';
        return { ...d, label };
      }),
      a5_applicationFee: cleanFee,
      a6_ageLimit: age,
      a7_postOverview: attr.overview || legacy.summary || `Helpful notice issued by department heads about ${legacy.title} dates and application process. Check details below.`,
      a8_vacancyDetails: vacancies,
      a9_eligibility: attr.eligibility || attr.qualification || "Must have passed High School 10th Class, Intermediate 12th Class, Graduate Degree, or other qualification from any recognized board/university.",
      a10_howToFill: attr.howToFill || `Simple steps to apply for ${legacy.title}:\n\n1. Read the short notice PDF download link given below.\n2. Keep your photo, signature, and 10th/12th certificate photos ready on your phone.\n3. Fill in all details in simple form and review for spelling mistakes.\n4. Complete the online fee payment if any fee is asked.\n5. Click Submit and save the print of your form.`,
      a11_selectionMode: attr.selectionMode || "Simple Written Exam followed by Document Checking or Merit List.",
      a12_usefulLinks: links.map(l => {
        let label = l.label;
        if (label.toLowerCase().includes('bulletin')) label = 'Download Short Notice PDF';
        if (label.toLowerCase().includes('commencement')) label = 'Direct Apply Online Link';
        return { ...l, label };
      }),
      a13_faq: cleanFaqs,
      a14_relatedPosts: (attr.related || []).map((r: any) => ({ title: r.title || String(r), url: r.url || "#" })),
      a15_tools: tools,
      a16_footerInfo: { readTime: attr.readTime || "5 min read", shareUrl: `https://sarkariboard.com/post/${legacy.id}` },
      a17_salaryInfo: this.decodeSalary(legacy)
    });
  }

  static populateSarkariPost(category: JobCategory, rawData: Partial<SarkariPost>): SarkariPost {
    
    // Default Fallbacks
    const defaultFee: ApplicationFee = {
      generalOBC: "Not Applicable",
      ewsSCST: "Not Applicable",
      ph: "Not Applicable",
      mode: "Not Applicable",
      bankCharges: "Not Applicable"
    };

    const isResultRelated = [
      JobCategory.RESULT, 
      JobCategory.ADMIT_CARD, 
      JobCategory.ANSWER_KEY
    ].includes(category);

    const populatedFee = isResultRelated 
      ? {
          generalOBC: "No fees (Not Applicable for this page)",
          ewsSCST: "No fees (Not Applicable for this page)",
          ph: "No fees (Not Applicable for this page)",
          mode: "Not Applicable",
          bankCharges: "Not Applicable"
        }
      : { ...defaultFee, ...rawData.a5_applicationFee };

    const populatedAge = (isResultRelated && !rawData.a6_ageLimit)
      ? { 
          minAge: "N/A", 
          maxAge: "N/A", 
          relaxation: "Age limits were checked during standard form filling time. Not required to download or check this page." 
        }
      : rawData.a6_ageLimit || { minAge: "N/A", maxAge: "N/A", relaxation: "Not specified" };

    const sarkariPost: SarkariPost = {
      id: rawData.id || crypto.randomUUID(),
      category,
      a1_postName: rawData.a1_postName || "Untitled Post",
      a2_postDateTime: rawData.a2_postDateTime || new Date().toISOString(),
      a3_seoDescription: "",
      a4_importantDates: rawData.a4_importantDates || [],
      a5_applicationFee: populatedFee,
      a6_ageLimit: populatedAge,
      a7_postOverview: rawData.a7_postOverview || "",
      a8_vacancyDetails: rawData.a8_vacancyDetails || [],
      a9_eligibility: rawData.a9_eligibility || "",
      a10_howToFill: rawData.a10_howToFill || "",
      a11_selectionMode: rawData.a11_selectionMode || "",
      a12_usefulLinks: this.getLinksForCategory(category, rawData.a12_usefulLinks).map(link => {
        let label = link.label;
        if (label.toLowerCase().includes('bulletin')) label = 'Download Short Notice PDF';
        if (label.toLowerCase().includes('commencement')) label = 'Direct Apply Online Link';
        return { ...link, label };
      }),
      a13_faq: rawData.a13_faq || [],
      a14_relatedPosts: rawData.a14_relatedPosts || [],
      a15_tools: rawData.a15_tools || [],
      a16_footerInfo: rawData.a16_footerInfo || { readTime: "5 min", shareUrl: "" },
      a17_salaryInfo: rawData.a17_salaryInfo || null
    };

    const originalDesc = rawData.a3_seoDescription || "";
    const isCustomText = originalDesc && 
                         originalDesc.trim().length > 30 &&
                         !originalDesc.includes("Get easy updates") && 
                         !originalDesc.includes("Sarkari Board expert helper");

    sarkariPost.a3_seoDescription = isCustomText 
      ? this.truncateDescription(originalDesc, 158)
      : this.generateDynamicSeoDescription(sarkariPost);

    return sarkariPost;
  }

  static generateDynamicSeoDescription(p: SarkariPost): string {
    const title = p.a1_postName || "Sarkari Job Alert";
    
    // 1. Calculate total vacancies
    let totalVacanciesStr = "";
    if (p.a8_vacancyDetails && p.a8_vacancyDetails.length > 0) {
      let totalCount = 0;
      let hasValidCount = false;
      p.a8_vacancyDetails.forEach(v => {
        const parsed = parseInt(String(v.totalPosts).replace(/,/g, '').trim(), 10);
        if (!isNaN(parsed) && parsed > 0) {
          totalCount += parsed;
          hasValidCount = true;
        }
      });
      if (hasValidCount && totalCount > 0) {
        totalVacanciesStr = `${totalCount} posts`;
      } else {
        const firstTotal = p.a8_vacancyDetails[0].totalPosts;
        if (firstTotal && !String(firstTotal).toLowerCase().includes('multiple')) {
          totalVacanciesStr = `${firstTotal} posts`;
        }
      }
    }

    // 2. Extract Important Dates
    const lastDateObj = p.a4_importantDates.find(d => {
      const lbl = d.label.toLowerCase();
      return lbl.includes('last date') || lbl.includes('closing') || lbl.includes('end');
    });
    const lastDate = lastDateObj ? lastDateObj.date : "";

    // 3. Extract Age limit
    let ageText = "";
    if (p.a6_ageLimit && (p.a6_ageLimit.minAge !== "N/A" || p.a6_ageLimit.maxAge !== "N/A")) {
      const min = p.a6_ageLimit.minAge;
      const max = p.a6_ageLimit.maxAge;
      if (min && max && min !== "N/A" && max !== "N/A") {
        ageText = `${min}-${max} yrs`;
      } else if (min && min !== "N/A") {
        ageText = `Min ${min}`;
      } else if (max && max !== "N/A") {
        ageText = `Max ${max}`;
      }
    }

    // 4. Extract Salary
    let salaryText = "";
    if (p.a17_salaryInfo && p.a17_salaryInfo.officialPay) {
      const pay = p.a17_salaryInfo.officialPay.trim();
      const isInvalid = pay.toLowerCase().includes('not specify') || 
                        pay.toLowerCase().includes('n/a') || 
                        pay.toLowerCase().includes('none') ||
                        pay.length < 3;
      if (!isInvalid) {
        salaryText = pay;
      }
    }

    // 5. Shorten/clean Eligibility
    let eligibilityText = "";
    if (p.a9_eligibility) {
      eligibilityText = p.a9_eligibility.replace(/[#*`\-[\]()]/g, '').replace(/\s+/g, ' ').trim();
      if (eligibilityText.length > 50) {
        eligibilityText = eligibilityText.slice(0, 47) + "...";
      }
    }

    let description = "";

    switch (p.category) {
      case JobCategory.LATEST_JOBS:
        description = `Apply Online for ${title}. ${totalVacanciesStr ? `Total Vacancies: ${totalVacanciesStr}. ` : ""}${eligibilityText ? `Eligibility: ${eligibilityText}. ` : ""}${ageText ? `Age Limit: ${ageText}. ` : ""}${salaryText ? `Salary: ${salaryText}. ` : ""}${lastDate ? `Last Date to Apply: ${lastDate}. ` : ""}Check core guidelines and links.`;
        break;

      case JobCategory.RESULT:
        description = `Check ${title} Official Exam Result & Marks scorecard online now. Check Merit List status, category-wise cutoff scores, and download roll number select list PDF here.`;
        break;

      case JobCategory.ADMIT_CARD:
        description = `Download ${title} Admit Card, Exam Hall Ticket and review the schedule dates sheet. Check exam venue code guidelines, shift timings, and direct print links here.`;
        break;

      case JobCategory.ANSWER_KEY:
        description = `Check ${title} Official Solutions & Answer Key PDF online. Estimate your raw score via our Negative Marks calculator and learn instructions to file online objections.`;
        break;

      case JobCategory.ADMISSION:
        description = `Apply for ${title} Admissions. Check qualifications, entry guidelines, brochure PDF, seat allotment matrix, and register online before the ${lastDate ? `last date ${lastDate}` : 'closing date'}.`;
        break;

      case JobCategory.SCHOLARSHIP:
        description = `Apply Online for ${title} Scholarship programs. Check income guidelines, amount benefits, mandatory documents check list, and active direct registration links.`;
        break;

      case JobCategory.SARKARI_YOJANA:
        description = `Read full guidelines, benefits eligibility rules, necessary documents checklist, and step-by-step registration instructions for ${title} welfare scheme scheme.`;
        break;

      case JobCategory.SYLLABUS:
        description = `Download ${title} Exam Syllabus & updated Exam Pattern PDF. Check marks weighting per topic, syllabus outline, negative marking rules, and prepare efficiently.`;
        break;

      default:
        description = `Get dates, fees breakdown, eligibility qualifications, and detailed online application steps for ${title}. Stay updated with Sarkari Board expert portal.`;
        break;
    }

    description = description.replace(/\s+/g, ' ').trim();
    return this.truncateDescription(description, 158);
  }

  static truncateDescription(desc: string, maxLen: number = 158): string {
    if (desc.length <= maxLen) return desc;
    let truncated = desc.slice(0, maxLen);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLen - 25) {
      truncated = truncated.slice(0, lastSpace);
    }
    return truncated.trim() + '...';
  }

  static decodeSalary(legacy: Post): { officialPay: string; expectedInHand: string } | null {
    const attr = legacy.attributes || {};
    let rawPay = attr.salary || attr.payScale || attr.payMatrix || attr.pay || attr.salaryRange || "";
    
    // If no raw salary is found, let's make a guess or use fallback
    if (!rawPay) {
      const titleLower = legacy.title.toLowerCase();
      if (titleLower.includes("constable") || titleLower.includes("police")) {
        rawPay = "Rs 21,700 - 69,100 (Level 3)";
      } else if (titleLower.includes("officer") || titleLower.includes("ssc cgl") || titleLower.includes("alp")) {
        rawPay = "Rs 25,500 - 81,100 (Level 4)";
      } else if (titleLower.includes("peon") || titleLower.includes("mts")) {
        rawPay = "Rs 18,000 - 56,900 (Level 1)";
      } else {
        rawPay = "Rs 25,500 - 81,100"; // Fallback as requested in the prompt example
      }
    }

    const payStr = String(rawPay);
    let expectedInHand = "";

    // Regex check for levels 1 to 6
    if (/level\s*1/i.test(payStr) || payStr.includes("18,000") || payStr.includes("18,050") || payStr.includes("18000")) {
      expectedInHand = "~₹22,000 to ₹25,000 / Month";
    } else if (/level\s*2/i.test(payStr) || payStr.includes("19,900") || payStr.includes("19900")) {
      expectedInHand = "~₹25,000 to ₹28,000 / Month";
    } else if (/level\s*3/i.test(payStr) || payStr.includes("21,700") || payStr.includes("21700")) {
      expectedInHand = "~₹28,000 to ₹31,000 / Month";
    } else if (/level\s*4/i.test(payStr) || payStr.includes("25,500") || payStr.includes("25500") || payStr.includes("81,100") || payStr.includes("81100")) {
      expectedInHand = "~₹32,000 to ₹35,000 / Month";
    } else if (/level\s*5/i.test(payStr) || payStr.includes("29,200") || payStr.includes("29200") || payStr.includes("92,300") || payStr.includes("92300")) {
      expectedInHand = "~₹38,000 to ₹42,000 / Month";
    } else if (/level\s*6/i.test(payStr) || payStr.includes("35,400") || payStr.includes("35400") || payStr.includes("1,12,400") || payStr.includes("112400")) {
      expectedInHand = "~₹46,000 to ₹51,000 / Month";
    } else {
      expectedInHand = "~₹32,000 to ₹35,000 / Month";
    }

    return {
      officialPay: payStr,
      expectedInHand
    };
  }

  private static getLinksForCategory(category: JobCategory, suggestedLinks?: UsefulLink[]): UsefulLink[] {
    const baseLinks = suggestedLinks || [];
    return baseLinks;
  }
}
