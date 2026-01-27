'use client';

import { useRouter } from 'next/navigation';
import { Heart, Coins, BookOpen, Users, Sparkles } from 'lucide-react';
import { FortuneCategory } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import AdBanner from '@/components/AdBanner';

const categoryIcons: Record<FortuneCategory, typeof Heart> = {
  love: Heart,
  money: Coins,
  study: BookOpen,
  social: Users,
};

const categoryGradients: Record<FortuneCategory, string> = {
  love: 'from-pink-500/30 to-rose-500/10',
  money: 'from-yellow-500/30 to-amber-500/10',
  study: 'from-blue-500/30 to-cyan-500/10',
  social: 'from-green-500/30 to-emerald-500/10',
};

const categoryColors: Record<FortuneCategory, string> = {
  love: 'text-pink-400',
  money: 'text-yellow-400',
  study: 'text-blue-400',
  social: 'text-green-400',
};

const categories: FortuneCategory[] = ['love', 'money', 'study', 'social'];

export default function HomePage() {
  const router = useRouter();
  const { t, locale } = useLanguage();

  const handleCategoryClick = (category: FortuneCategory) => {
    sessionStorage.setItem('selectedCategory', category);
    router.push('/input');
  };

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
      {/* Ad Banner Section */}
      <div className="w-full max-w-md mx-auto mb-4">
        <AdBanner slot="4970447883" />
      </div>

      {/* Language Selector */}
      <div className="w-full max-w-md mx-auto mb-6 flex justify-end">
        <LanguageSelector />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center animate-float">
          <Sparkles className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t.appName}</h1>
        <p className="text-gray-400">{t.tagline}</p>
      </div>

      {/* Category Cards */}
      <div className="max-w-md mx-auto space-y-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const catInfo = t.categories[category];

          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`w-full p-4 rounded-2xl bg-gradient-to-r ${categoryGradients[category]} border border-white/5 flex items-center gap-4 card-hover text-left`}
            >
              <div className={`w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center ${categoryColors[category]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{catInfo.label}</h3>
                <p className="text-gray-400 text-sm">{locale === 'ko' ? '' : catInfo.labelKr}</p>
              </div>
              <div className="text-gray-500">
                →
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-8">
        {t.footer}
      </p>

      {/* Square Ad Banner */}
      <div className="w-full max-w-md mx-auto mt-8 flex justify-center">
        <AdBanner slot="2368335270" format="square" />
      </div>
    </div>
  );
}
