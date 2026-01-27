import { BaseInput, ThemeInput, FortuneInput } from '@/types';

const FIELD_SEPARATOR = '\u001F';

/**
 * Normalize input string according to rules:
 * - Trim whitespace
 * - Collapse multiple spaces
 * - Remove newlines/tabs
 * - Convert to lowercase
 * - Apply NFKC normalization
 */
export function normalize(input: string): string {
  if (!input) return '';

  return input
    .normalize('NFKC')
    .trim()
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Convert string to SHA-256 hash
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get today's date in YYYY-MM-DD format (Asia/Seoul timezone)
 */
export function getTodayDate(): string {
  const now = new Date();
  const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreaTime.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Serialize base input for hashing (includes selected category)
 */
export function serializeBaseInput(input: FortuneInput): string {
  const today = getTodayDate();
  const [year, month, day] = today.split('-');

  const fields = [
    today,
    year,
    month,
    day,
    normalize(input.name),
    normalize(input.gender),
    String(input.birthYear),
    String(input.birthMonth),
    String(input.birthDay),
    normalize(input.selectedCategory), // 카테고리 포함
  ];

  return fields.join(FIELD_SEPARATOR);
}

/**
 * Serialize theme input for hashing
 */
export function serializeThemeInput(input: ThemeInput): string {
  const fields = [
    normalize(input.color),
    normalize(input.animal),
    normalize(input.person),
    normalize(input.food),
  ];

  return fields.join(FIELD_SEPARATOR);
}

/**
 * Generate base seed from input (includes selected category)
 */
export async function generateBaseSeed(input: FortuneInput): Promise<string> {
  const serialized = serializeBaseInput(input);
  return sha256(serialized);
}

/**
 * Generate theme seed from input
 */
export async function generateThemeSeed(input: ThemeInput): Promise<string> {
  const serialized = serializeThemeInput(input);
  return sha256(serialized);
}

/**
 * Generate topic-specific seed
 */
export async function generateTopicSeed(baseSeed: string, topic: string): Promise<string> {
  return sha256(baseSeed + topic);
}

/**
 * Generate final seed combining base and theme
 */
export async function generateFinalSeed(baseSeed: string, themeSeed: string): Promise<string> {
  return sha256(baseSeed + themeSeed);
}

/**
 * Convert hex hash to BigInt for score calculation
 */
export function hashToBigInt(hash: string): bigint {
  return BigInt('0x' + hash);
}

/**
 * Calculate score from seed (0-100)
 */
export function calculateScore(seed: string): number {
  const bigInt = hashToBigInt(seed);
  return Number(bigInt % 101n);
}
