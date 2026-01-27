import {
  FortuneInput,
  FortuneResult,
  FortuneCategory,
  CategoryScore,
} from '@/types';
import {
  generateBaseSeed,
  generateThemeSeed,
  generateTopicSeed,
  generateFinalSeed,
  calculateScore,
  hashToBigInt,
  sha256,
} from './seed';
import {
  categoryDescriptions,
  scoreAdvices,
  scoreCautions,
  scoreTags,
  gradeLabels,
  getScoreRange,
  ScoreRange,
} from './templates';
import { Locale } from './i18n/translations';

const CATEGORIES: FortuneCategory[] = ['love', 'money', 'study', 'social'];

/**
 * Calculate topic score with weighted formula
 */
function calculateTopicScore(topicSeed: string, overallScore: number): number {
  const topicBaseScore = calculateScore(topicSeed);
  return Math.round(0.65 * topicBaseScore + 0.35 * overallScore);
}

/**
 * Select items from array using seed
 */
async function selectTagsBySeed(tags: string[], seed: string, count: number): Promise<string[]> {
  const result: string[] = [];
  let remainingTags = [...tags];

  for (let i = 0; i < count && remainingTags.length > 0; i++) {
    const hashedSeed = await sha256(seed + `tag${i}`);
    const index = Number(hashToBigInt(hashedSeed) % BigInt(remainingTags.length));
    result.push(remainingTags[index]);
    remainingTags = remainingTags.filter((_, idx) => idx !== index);
  }

  return result;
}

/**
 * Generate fortune result from input
 */
export async function generateFortune(input: FortuneInput, locale: Locale = 'en'): Promise<FortuneResult> {
  // Generate seeds
  const baseSeed = await generateBaseSeed(input);
  const themeSeed = await generateThemeSeed(input);
  const finalSeed = await generateFinalSeed(baseSeed, themeSeed);

  // Calculate overall score
  const overallScore = calculateScore(finalSeed);
  const overallScoreRange = getScoreRange(overallScore);

  // Calculate category scores
  const categories: CategoryScore[] = await Promise.all(
    CATEGORIES.map(async (category) => {
      const topicSeed = await generateTopicSeed(baseSeed, category);
      const score = calculateTopicScore(topicSeed, overallScore);
      const scoreRange = getScoreRange(score);
      return {
        category,
        score,
        scoreRange,
      };
    })
  );

  // Get description for selected category
  const selectedCategory = input.selectedCategory;
  const categoryScore = categories.find(c => c.category === selectedCategory);
  const displayScore = categoryScore?.score ?? overallScore;
  const displayScoreRange = getScoreRange(displayScore);

  // Get category-specific description (localized)
  const description = categoryDescriptions[locale][selectedCategory][displayScoreRange];

  // Get advice and caution based on score (localized)
  const advice = scoreAdvices[locale][displayScoreRange];
  const caution = scoreCautions[locale][displayScoreRange];

  // Get tags (localized)
  const availableTags = scoreTags[locale][displayScoreRange];
  const selectedTags = await selectTagsBySeed(availableTags, finalSeed, 2);

  // Get grade label
  const gradeLabel = gradeLabels[displayScoreRange];

  return {
    overallScore,
    overallScoreRange,
    categories,
    description,
    advice,
    caution,
    tags: selectedTags,
    gradeLabel,
    baseSeed,
    themeSeed,
    finalSeed,
  };
}
