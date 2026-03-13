import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getStrings } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: ReturnType<typeof getStrings>;
  lowDataMode: boolean;
  setLowDataMode: (mode: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('hi'); // Default to Hindi
  const [lowDataMode, setLowDataModeState] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('swaasthya-language');
    if (saved && saved in getStrings('en')) {
      setLanguageState(saved as Language);
    }
    
    const savedLowData = localStorage.getItem('swaasthya-low-data');
    if (savedLowData) {
      setLowDataModeState(savedLowData === 'true');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('swaasthya-language', lang);
  };

  const setLowDataMode = (mode: boolean) => {
    setLowDataModeState(mode);
    localStorage.setItem('swaasthya-low-data', mode.toString());
  };

  const strings = getStrings(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, strings, lowDataMode, setLowDataMode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
