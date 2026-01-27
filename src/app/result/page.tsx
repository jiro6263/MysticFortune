'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Share2, Sparkles, ArrowLeft } from 'lucide-react';
import { FortuneInput, FortuneResult, FortuneCategory, getScoreColor, getScoreBgColor } from '@/types';
import { generateFortune } from '@/lib/fortune';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ResultPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFortune = async () => {
      setLoading(true);
      const inputData = sessionStorage.getItem('fortuneInput');

      if (!inputData) {
        router.push('/');
        return;
      }

      try {
        const input: FortuneInput = JSON.parse(inputData);
        const fortuneResult = await generateFortune(input, locale);
        setResult(fortuneResult);
        setSelectedCategory(input.selectedCategory);
      } catch (error) {
        console.error('Error generating fortune:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadFortune();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const handleShare = async () => {
    if (!result) return;

    const categoryScore = selectedCategory
      ? result.categories.find((c) => c.category === selectedCategory)
      : null;

    const score = categoryScore?.score ?? result.overallScore;
    const gradeText = locale === 'ko' ? result.gradeLabel.kr : result.gradeLabel.en;

    const shareText = t.shareText(score, gradeText);

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.appName,
          text: shareText,
          url: window.location.origin,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        alert(t.copied);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-gray-400">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Get display data based on selected category
  const categoryScore = selectedCategory
    ? result.categories.find((c) => c.category === selectedCategory)
    : null;

  const displayScore = categoryScore?.score ?? result.overallScore;
  const categoryInfo = selectedCategory ? t.categories[selectedCategory] : null;
  const scoreColor = getScoreColor(displayScore);
  const scoreBgColor = getScoreBgColor(displayScore);

  return (
    <div className="min-h-screen px-4 py-6 pb-32">
      {/* Ad Banner Section */}
      <div className="w-full max-w-md mx-auto mb-4">
        <div className="h-[50px] bg-gray-800/80 rounded-lg flex items-center justify-center text-gray-500 text-xs border border-gray-700/50">
          <span className="tracking-widest">{t.adBanner}</span>
        </div>
      </div>

      {/* Back Button */}
      <div className="w-full max-w-md mx-auto mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">{t.back}</span>
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center animate-float">
          <Sparkles className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t.appName}</h1>
        <p className="text-gray-400">{t.taglineResult}</p>
      </div>

      {/* Score Section */}
      <div className="text-center mb-8">
        <p className="text-indigo-400 text-xs tracking-widest mb-2">
          {categoryInfo ? categoryInfo.label.toUpperCase() : 'DAILY INSIGHT'}
        </p>
        <div className={`text-7xl font-bold mb-2 ${scoreColor}`}>
          {displayScore}
        </div>
        <p className="text-gray-400 text-sm">{t.fortuneScore}</p>
      </div>

      {/* Result Card */}
      <div className="max-w-md mx-auto">
        <div className="p-6 rounded-2xl glass border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className={`w-5 h-5 ${scoreColor}`} />
            <h2 className="text-xl font-bold text-white">
              {locale === 'ko' ? result.gradeLabel.kr : result.gradeLabel.en}
            </h2>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {result.description}
          </p>

          {/* Advice Section */}
          {result.advice && (
            <div className="mb-4 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <p className="text-sm text-indigo-300">
                <span className="font-semibold">{t.advice}:</span> {result.advice}
              </p>
            </div>
          )}

          {/* Caution Section */}
          {result.caution && (
            <div className="mb-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <p className="text-sm text-orange-300">
                <span className="font-semibold">{t.watchOut}:</span> {result.caution}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {result.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 text-indigo-300 text-sm border border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={handleHome}
            className="flex-1 py-4 bg-background-card border border-gray-700/50 rounded-xl flex items-center justify-center gap-2 text-white hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            {t.home}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
            {t.share}
          </button>
        </div>
      </div>
    </div>
  );
}
