export type Gender = 'female' | 'male' | 'other';

export interface BaseInput {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: Gender;
}

export interface ThemeInput {
  person: string;
  color: string;
  animal: string;
  food: string;
}

export type FortuneCategory = 'love' | 'money' | 'study' | 'social';

export interface FortuneInput extends BaseInput, ThemeInput {
  selectedCategory: FortuneCategory;
}

// 점수 구간 타입
export type ScoreRange =
  | '95-100' | '90-94' | '85-89' | '80-84' | '75-79'
  | '70-74' | '65-69' | '60-64' | '55-59' | '50-54'
  | '45-49' | '40-44' | '35-39' | '30-34' | '25-29'
  | '20-24' | '15-19' | '10-14' | '5-9' | '0-4';

export interface CategoryScore {
  category: FortuneCategory;
  score: number;
  scoreRange: ScoreRange;
}

export interface GradeLabel {
  en: string;
  kr: string;
}

export interface FortuneResult {
  overallScore: number;
  overallScoreRange: ScoreRange;
  categories: CategoryScore[];
  description: string;
  advice: string;
  caution: string;
  tags: string[];
  gradeLabel: GradeLabel;
  baseSeed: string;
  themeSeed: string;
  finalSeed: string;
}

export const categoryInfoMap: Record<FortuneCategory, { label: string; labelKr: string; icon: string; color: string; bgGradient: string }> = {
  love: {
    label: 'Romance Luck',
    labelKr: '연애운',
    icon: 'heart',
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/30 to-rose-500/10',
  },
  money: {
    label: 'Wealth Luck',
    labelKr: '금전운',
    icon: 'coins',
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/30 to-amber-500/10',
  },
  study: {
    label: 'Academic Luck',
    labelKr: '학업운',
    icon: 'book',
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/30 to-cyan-500/10',
  },
  social: {
    label: 'Interpersonal Luck',
    labelKr: '대인관계',
    icon: 'users',
    color: 'text-green-400',
    bgGradient: 'from-green-500/30 to-emerald-500/10',
  },
};

// 점수 구간별 색상
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-400';
  if (score >= 75) return 'text-green-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 45) return 'text-yellow-400';
  if (score >= 30) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 90) return 'bg-emerald-500/20';
  if (score >= 75) return 'bg-green-500/20';
  if (score >= 60) return 'bg-blue-500/20';
  if (score >= 45) return 'bg-yellow-500/20';
  if (score >= 30) return 'bg-orange-500/20';
  return 'bg-red-500/20';
}
