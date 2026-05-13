import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'kn' | 'hi' | 'bn' | 'mr' | 'te' | 'ta' | 'gu' | 'ur' | 'ml' | 'pa';

export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
] as const;

interface Translations {
  [key: string]: Partial<Record<Language, string>>;
}

export const translations: Translations = {
  // Common
  'app.name': { 
    en: 'Jenu-Gumpu', 
    kn: 'ಜೇನು-ಗುಂಪು (Jenu-Gumpu)',
    hi: 'जेनु-गुंपू (Jenu-Gumpu)',
    te: 'జేను-గుంపు (Jenu-Gumpu)',
    ta: 'ஜேனு-கும்பு (Jenu-Gumpu)'
  },
  'app.subtitle': { 
    en: 'EMPOWERING HONEY HUNTERS', 
    kn: 'ಜೇನು ಕೃಷಿಕರ ಅಭಿವೃದ್ಧಿಗಾಗಿ',
    hi: 'शहद शिकारी सशक्तिकरण',
    te: 'తేనె వేటగాళ్ళ సాధికారత',
    ta: 'தேன் வேட்டைக்காரர்களுக்கு அதிகாரம் அளித்தல்'
  },
  'nav.home': { 
    en: 'HOME', 
    kn: 'ಮನೆ',
    hi: 'होम',
    mr: 'होम',
    bn: 'হোম'
  },
  'nav.logs': { 
    en: 'LOGS', 
    kn: 'ದಾಖಲೆಗಳು',
    hi: 'लॉग',
    te: 'లాగ్స్',
    ta: 'பதிவுகள்'
  },
  'nav.prices': { 
    en: 'PRICES', 
    kn: 'ದರಗಳು',
    hi: 'कीमतें',
    te: 'ధరలు',
    ta: 'விலைகள்'
  },
  'nav.collective': { 
    en: 'COLLECTIVE', 
    kn: 'ಗುಂಪು',
    hi: 'सामूहिक',
    te: 'సామూహిక',
    ta: 'கூட்டு'
  },
  'nav.profit': { 
    en: 'PROFIT', 
    kn: 'ಲಾಭ',
    hi: 'लाभ',
    te: 'లాభం',
    ta: 'லாபம்'
  },
  'common.back': { en: 'BACK', kn: 'ಹಿಂದಕ್ಕೆ', hi: 'पीछे' },

  // Dashboard
  'dash.welcome': { 
    en: 'Hello', 
    kn: 'ನಮಸ್ಕಾರ',
    hi: 'नमस्ते',
    ta: 'வணக்கம்'
  },
  'dash.total_stock': { 
    en: 'TOTAL STOCK', 
    kn: 'ಒಟ್ಟು ದಾಸ್ತಾನು',
    hi: 'कुल स्टॉक'
  },
  'dash.quick_actions': { 
    en: 'Quick Actions', 
    kn: 'ತ್ವರಿತ ಕ್ರಮಗಳು',
    hi: 'त्वरित कार्रवाई'
  },
  'dash.log_harvest': { en: 'Log Harvest', kn: 'ಸಂಗ್ರಹ ದಾಖಲಿಸಿ' },
  'dash.log_harvest_sub': { en: 'NEW LOG', kn: 'ಹೊಸ ದಾಖಲೆ' },
  'dash.grade_honey': { en: 'Grade Honey', kn: 'ದರ್ಜೆ ನಿರ್ಧರಿಸಿ' },
  'dash.grade_honey_sub': { en: 'AI TESTING', kn: 'AI ಪರೀಕ್ಷೆ' },
  'dash.prices': { en: 'Prices', kn: 'ಮಾರುಕಟ್ಟೆ' },
  'dash.prices_sub': { en: 'DAILY RATES', kn: 'ದೈನಂದಿನ ದರ' },
  'dash.recent': { en: 'Recent Activity', kn: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ' },
  'dash.view_all': { en: 'View All', kn: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ' },

  // Logs
  'logs.title': { en: 'Logs', kn: 'ದಾಖಲೆಗಳು' },
  'logs.add_harvest': { en: 'Log Harvest', kn: 'ಸುಗ್ಗಿ ದಾಖಲಿಸಿ' },
  'logs.quantity': { en: 'QUANTITY (KG)', kn: 'ಪ್ರಮಾಣ (ಕೆಜಿ)' },
  'logs.floral': { en: 'FLORAL SOURCE', kn: 'ಹೂವಿನ ಮೂಲ' },
  'logs.grade': { en: 'GRADE', kn: 'ದರ್ಜೆ' },
  'logs.save': { en: 'Save', kn: 'ಉಳಿಸಿ' },

  // Prices
  'prices.title': { en: 'Prices', kn: 'ದರಗಳು' },
  'prices.retail': { en: 'RETAIL PRICE', kn: 'ಚಿಲ್ಲರೆ ದರ' },
  'prices.wholesale': { en: 'WHOLESALE PRICE', kn: 'ಸಗಟು ದರ' },
  'prices.gap': { en: 'Gap', kn: 'ವ್ಯತ್ಯಾಸ' },
  'prices.trend': { en: '7-Day Price Trend', kn: '7-ದಿನಗಳ ದರ ಪ್ರವೃತ್ತಿ' },

  // Profit
  'profit.title': { en: 'Profit', kn: 'ಲಾಭ' },
  'profit.simulator': { en: 'PROFIT SIMULATOR', kn: 'ಲಾಭದ ಲೆಕ್ಕಾಚಾರ' },
  'profit.processed': { en: 'Process & Sell Retail', kn: 'ಸಂಸ್ಕರಿಸಿ ಮಾರಾಟ ಮಾಡಿ' },
  'profit.raw': { en: 'Sell to Middleman', kn: 'ಖರೀದಿದಾರರಿಗೆ ಮಾರಿ' },
  'profit.harvesting_cost': { en: 'Harvesting', kn: 'ಸಂಗ್ರಹಣೆ' },
  'profit.processing_cost': { en: 'Processing', kn: 'ಸಂಸ್ಕರಣೆ' },
  'profit.packaging_cost': { en: 'Packaging', kn: 'ಪ್ಯಾಕೇಜಿಂಗ್' },
  'profit.shipping_cost': { en: 'Shipping', kn: 'ಸಾಗಣೆ' },
  'profit.labor_cost': { en: 'Labor', kn: 'ಕೂಲಿ' },
  'profit.commission': { en: 'Platform Commission (%)', kn: 'ಕಮಿಷನ್ ಕಿಡಿ (%)' },
  'profit.selling_price': { en: 'Selling Price (₹/KG)', kn: 'ಮಾರಾಟ ದರ (₹/ಕೆಜಿ)' },
  'profit.target_margin': { en: 'Target Profit Margin (%)', kn: 'ಉದ್ದೇಶಿತ ಲಾಭ (%)' },
  'profit.total_cost': { en: 'Total Production Cost', kn: 'ಒಟ್ಟು ವೆಚ್ಚ' },
  'profit.cost_per_kg': { en: 'Cost Per KG', kn: 'ಪ್ರತಿ ಕೆಜಿ ವೆಚ್ಚ' },
  'profit.profit_per_kg': { en: 'Profit Per KG', kn: 'ಪ್ರತಿ ಕೆಜಿ ಲಾಭ' },
  'profit.total_profit': { en: 'Total Profit', kn: 'ಒಟ್ಟು ಲಾಭ' },
  'profit.rec_price': { en: 'Recommended Selling Price', kn: 'ಶಿಫಾರಸು ಮಾಡಿದ ಮಾರಾಟ ದರ' },

  // Profile
  'profile.title': { en: 'Profile', kn: 'ಪ್ರೊಫೈಲ್' },
  'profile.role_hunter': { en: 'Hunter', kn: 'ಕೃಷಿಕ' },
  'profile.sign_out': { en: 'Sign Out', kn: 'ನಿರ್ಗಮಿಸಿ' },
  'profile.language': { en: 'Language', kn: 'ಭಾಷೆ' },

  // Auth
  'auth.continue_google': { en: 'Continue with Google', kn: 'ಗೂಗಲ್ ಮೂಲಕ ಮುಂದುವರಿಯಿರಿ', hi: 'गूगल के साथ जारी रखें' },
  'auth.sign_in_password': { en: 'Sign in with Password', kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮೂಲಕ ಲಾಗಿನ್', hi: 'पासवर्ड से लॉगिन करें' },
  'auth.or_direct': { en: 'or direct links', kn: 'ಅಥವಾ ನೇರ ಲಿಂಕ್‌ಗಳು', hi: 'या सीधे लिंक' },
  'auth.phone_otp': { en: 'Phone OTP', kn: 'ಫೋನ್ OTP', hi: 'फोन ओटीपी' },
  'auth.sign_in_title': { en: 'Sign In', kn: 'ಲಾಗಿನ್', hi: 'साइन इन' },
  'auth.sign_up_title': { en: 'Create Account', kn: 'ಖಾತೆ ತೆರೆಯಿರಿ', hi: 'खाता बनाएं' },
  'auth.name_label': { en: 'Full Name', kn: 'ಪೂರ್ಣ ಹೆಸರು', hi: 'पूरा नाम' },
  'auth.email_label': { en: 'Email', kn: 'ಇಮೇಲ್', hi: 'ईमेल' },
  'auth.password_label': { en: 'Password', kn: 'ಪಾಸ್‌ವರ್ಡ್', hi: 'पासवर्ड' },
  'auth.login_button': { en: 'Log In', kn: 'ಲಾಗಿನ್', hi: 'लॉग इन' },
  'auth.signup_button': { en: 'Create Account', kn: 'ಲಾಗಿನ್', hi: 'खाता बनाएं' },
  'auth.no_account': { en: "Don't have an account?", kn: 'ಖಾತೆ ಇಲ್ಲವೇ?', hi: 'खाता नहीं है?' },
  'auth.have_account': { en: 'Already have an account?', kn: 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?', hi: 'पहले से ही खाता है?' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    const entry = translations[key];
    return entry?.[language] || entry?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
