'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Heart, Palette, Cat, Utensils, Sparkles, ArrowLeft } from 'lucide-react';
import { Gender, FortuneInput, FortuneCategory } from '@/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function InputPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategory | null>(null);
  const [formData, setFormData] = useState<Omit<FortuneInput, 'selectedCategory'>>({
    name: '',
    birthDay: 0,
    birthMonth: 0,
    birthYear: 0,
    gender: 'female',
    person: '',
    color: '',
    animal: '',
    food: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const category = sessionStorage.getItem('selectedCategory') as FortuneCategory | null;
    if (!category) {
      router.push('/');
      return;
    }
    setSelectedCategory(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (field: keyof FortuneInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
    }

    if (!formData.birthDay || formData.birthDay < 1 || formData.birthDay > 31) {
      newErrors.birthDay = t.validDateRequired;
    }

    if (!formData.birthMonth || formData.birthMonth < 1 || formData.birthMonth > 12) {
      newErrors.birthMonth = t.validDateRequired;
    }

    if (!formData.birthYear || formData.birthYear < 1900 || formData.birthYear > new Date().getFullYear()) {
      newErrors.birthYear = t.validDateRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !selectedCategory) return;

    const fullInput: FortuneInput = {
      ...formData,
      selectedCategory,
    };
    sessionStorage.setItem('fortuneInput', JSON.stringify(fullInput));
    router.push('/result');
  };

  const handleBack = () => {
    router.push('/');
  };

  const categoryInfo = selectedCategory ? t.categories[selectedCategory] : null;

  return (
    <div className="min-h-screen px-4 py-6 pb-24">
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
        <p className="text-gray-400">{t.taglineInput}</p>
        {categoryInfo && (
          <div className="inline-block mt-3 px-4 py-1 rounded-full text-indigo-400 bg-white/5 text-sm">
            {categoryInfo.label}
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Basic Info Section */}
        <section>
          <h2 className="text-sm font-semibold text-indigo-400 mb-4 tracking-wider">
            {t.basicInfo}
          </h2>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">{t.yourName}</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={t.enterName}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">{t.dateOfBirth}</label>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <input
                  type="number"
                  placeholder="DD"
                  min="1"
                  max="31"
                  value={formData.birthDay || ''}
                  onChange={(e) => handleInputChange('birthDay', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors text-center"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="MM"
                  min="1"
                  max="12"
                  value={formData.birthMonth || ''}
                  onChange={(e) => handleInputChange('birthMonth', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors text-center"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="YYYY"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={formData.birthYear || ''}
                  onChange={(e) => handleInputChange('birthYear', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors text-center"
                />
              </div>
            </div>
            {(errors.birthDay || errors.birthMonth || errors.birthYear) && (
              <p className="text-red-400 text-xs mt-1">{t.validDateRequired}</p>
            )}
          </div>

          {/* Gender Selection */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">{t.gender}</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'female', label: t.female, icon: '♀' },
                { value: 'male', label: t.male, icon: '♂' },
                { value: 'other', label: t.other, icon: '⚥' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('gender', option.value as Gender)}
                  className={`py-4 px-4 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                    formData.gender === option.value
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-background-input border-gray-700/50 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-sm">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Cosmic Context Section */}
        <section>
          <h2 className="text-sm font-semibold text-indigo-400 mb-4 tracking-wider">
            {t.cosmicContext}
          </h2>

          {/* Person on your mind */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              {t.personOnMind} <span className="text-gray-500">{t.personOnMindOptional}</span>
            </label>
            <div className="relative">
              <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={t.nameOfPerson}
                value={formData.person}
                onChange={(e) => handleInputChange('person', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Favorite Color */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">{t.favoriteColor}</label>
            <div className="relative">
              <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={t.colorExample}
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Favorite Animal */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">{t.favoriteAnimal}</label>
            <div className="relative">
              <Cat className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={t.animalExample}
                value={formData.animal}
                onChange={(e) => handleInputChange('animal', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Favorite Food */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">{t.favoriteFood}</label>
            <div className="relative">
              <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={t.foodExample}
                value={formData.food}
                onChange={(e) => handleInputChange('food', e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background-input rounded-xl border border-gray-700/50 text-white placeholder-gray-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all animate-pulse-glow"
        >
          {t.revealFortune}
          <span className="text-lg">→</span>
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {t.footer}
        </p>
      </div>
    </div>
  );
}
