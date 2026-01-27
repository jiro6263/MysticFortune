'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale } from '@/lib/i18n/translations';

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Locale; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
  ];

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 transition-colors text-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang?.flag} {currentLang?.label}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 py-2 w-36 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-700 transition-colors ${
                  locale === lang.code ? 'text-indigo-400' : 'text-gray-300'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {locale === lang.code && <span className="ml-auto">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
