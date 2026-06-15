import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const isStorageAvailable = () => {
  try {
    const key = '__i18n_test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

const isCookieAvailable = () => {
  try {
    return typeof document !== 'undefined' && typeof document.cookie === 'string';
  } catch (e) {
    return false;
  }
};

const detectionOrder = ['querystring', 'navigator', 'htmlTag'];
const detectionCaches: string[] = [];

if (isStorageAvailable()) {
  detectionOrder.push('localStorage', 'sessionStorage');
  detectionCaches.push('localStorage');
}
if (isCookieAvailable()) {
  detectionOrder.push('cookie');
  detectionCaches.push('cookie');
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    detection: {
      order: detectionOrder,
      caches: detectionCaches,
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          'nav.home': 'Home',
          'nav.jobs': 'Latest Jobs',
          'nav.results': 'Results',
          'nav.admit_cards': 'Admit Cards',
          'nav.answer_keys': 'Answer Keys',
          'nav.syllabus': 'Syllabus',
          'nav.admissions': 'Admission',
          'nav.scholarships': 'Scholarship',
          'nav.yojana': 'Govt Yojana',
          'nav.contact': 'Contact Us',
          'search.placeholder': 'Search jobs, results, syllabus...',
          'search.results_for': 'Search results for',
          'hero.title': 'India Public Information & Sarkari Portal',
          'hero.subtitle': 'Verified government jobs, exam results, and academic notifications for All India States.',
          'common.back': 'Back to Feed',
          'common.print': 'Print Details',
          'common.share': 'Share Post',
          'common.breaking': 'BREAKING',
          'common.news': 'NEWS',
          'detail.dynamic_attributes': 'Document Details',
          'footer.about': 'About Us',
          'footer.contact': 'Contact',
          'footer.privacy': 'Privacy Policy',
          'footer.disclaimer': 'Disclaimer'
        }
      },
      hi: {
        translation: {
          'nav.home': 'मुख्य पृष्ठ',
          'nav.jobs': 'नवीनतम नौकरियां',
          'nav.results': 'रिजल्ट',
          'nav.admit_cards': 'प्रवेश पत्र',
          'nav.answer_keys': 'उत्तर कुंजी',
          'nav.syllabus': 'पाठ्यक्रम',
          'nav.admissions': 'प्रवेश',
          'nav.scholarships': 'छात्रवृत्ति',
          'nav.yojana': 'सरकारी योजना',
          'nav.contact': 'संपर्क करें',
          'search.placeholder': 'नौकरी, रिजल्ट, सिलेबस खोजें...',
          'search.results_for': 'खोज परिणाम:',
          'hero.title': 'भारत सार्वजनिक सूचना एवं सरकारी पोर्टल',
          'hero.subtitle': 'सभी भारतीय राज्यों के लिए सत्यापित सरकारी नौकरियां, परीक्षा परिणाम और शैक्षणिक सूचनाएं।',
          'common.back': 'पीछे लौटें',
          'common.print': 'विवरण प्रिंट करें',
          'common.share': 'पोस्ट साझा करें',
          'common.breaking': 'ब्रेकिंग',
          'common.news': 'न्यूज़',
          'detail.dynamic_attributes': 'दस्तावेज़ विवरण',
          'footer.about': 'हमारे बारे में',
          'footer.contact': 'संपर्क',
          'footer.privacy': 'गोपनीयता नीति',
          'footer.disclaimer': 'अस्वीकरण'
        }
      }
    }
  });

export default i18n;
