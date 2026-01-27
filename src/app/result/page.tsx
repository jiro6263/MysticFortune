'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Share2, Sparkles, ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import { FortuneInput, FortuneResult, FortuneCategory, getScoreColor, getScoreBgColor } from '@/types';
import { generateFortune } from '@/lib/fortune';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import AdBanner from '@/components/AdBanner';

export default function ResultPage() {
  const router = useRouter();
  const { t, locale } = useLanguage();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

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

    setIsSharing(true);
    setShowShareCard(true);

    // Wait for the card to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      if (!shareCardRef.current) {
        throw new Error('Share card not found');
      }

      // Capture the share card
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#0f0f1a',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create blob'));
        }, 'image/png', 1.0);
      });

      const file = new File([blob], 'mystic-fortune.png', { type: 'image/png' });
      const shareUrl = 'https://mysticfortune.pages.dev';

      // Check if Web Share API with files is supported
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t.appName,
          text: shareUrl,
        });
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mystic-fortune.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Copy link to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert(locale === 'ko' ? '이미지가 다운로드되었습니다. 링크가 복사되었습니다!' : 'Image downloaded. Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback to text-only share
      if (navigator.share) {
        try {
          await navigator.share({
            title: t.appName,
            text: t.shareText(displayScore, locale === 'ko' ? result.gradeLabel.kr : result.gradeLabel.en),
            url: 'https://mysticfortune.pages.dev',
          });
        } catch {
          // User cancelled
        }
      }
    } finally {
      setShowShareCard(false);
      setIsSharing(false);
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
      {/* Share Card for Capture */}
      {showShareCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div
            ref={shareCardRef}
            className="w-[360px] p-6 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-white/10"
          >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/40 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.appName}</h1>
          </div>

          {/* Category Badge */}
          {categoryInfo && (
            <div className="text-center mb-4">
              <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm border border-indigo-500/30">
                {categoryInfo.label}
              </span>
            </div>
          )}

          {/* Score */}
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-1 ${scoreColor}`}>
              {displayScore}
            </div>
            <p className="text-gray-400 text-sm">{t.fortuneScore}</p>
          </div>

          {/* Grade */}
          <div className="text-center mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className={`w-5 h-5 ${scoreColor}`} />
              <span className="text-xl font-bold text-white">
                {locale === 'ko' ? result.gradeLabel.kr : result.gradeLabel.en}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {result.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-gray-500 text-xs">mysticfortune.pages.dev</p>
          </div>
        </div>
      </div>
      )}

      {/* Ad Banner Section */}
      <div className="w-full max-w-md mx-auto mb-4">
        <AdBanner slot="4970447883" />
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

      {/* Square Ad Banner */}
      <div className="max-w-md mx-auto mt-8 flex justify-center">
        <AdBanner slot="2368335270" format="square" />
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
            disabled={isSharing}
            className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-wait rounded-xl flex items-center justify-center gap-2 text-white transition-colors"
          >
            {isSharing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {locale === 'ko' ? '준비 중...' : 'Preparing...'}
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                {t.share}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
