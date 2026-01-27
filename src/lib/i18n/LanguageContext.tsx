'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, Translation, getTranslation, defaultLocale } from './translations';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translation;
}

const defaultValue: LanguageContextType = {
  locale: defaultLocale,
  setLocale: () => {},
  t: getTranslation(defaultLocale),
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved && (saved === 'en' || saved === 'ko')) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = getTranslation(locale);

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
  };

  // Always provide context, even before mount (for SSR)
  return (
    <LanguageContext.Provider value={mounted ? value : defaultValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
