export type Locale = 'en' | 'ko';

export const translations = {
  en: {
    // Common
    appName: 'Mystic Fortune',
    tagline: 'Discover your destiny today',
    taglineInput: 'Unlock the secrets of your future',
    taglineResult: 'Your destiny revealed',
    adBanner: 'AD BANNER 320×50',
    back: 'Back',
    home: 'Home',
    share: 'Share',
    fortuneScore: 'Fortune Score',
    footer: 'Fortune telling is for entertainment purposes only.',

    // Categories
    categories: {
      love: { label: 'Romance Luck', labelKr: 'Romance' },
      money: { label: 'Wealth Luck', labelKr: 'Wealth' },
      study: { label: 'Academic Luck', labelKr: 'Academic' },
      social: { label: 'Interpersonal Luck', labelKr: 'Social' },
    },

    // Input Page
    basicInfo: 'BASIC INFO',
    cosmicContext: 'COSMIC CONTEXT',
    yourName: 'Your Name',
    enterName: 'Enter your full name',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    female: 'Female',
    male: 'Male',
    other: 'Other',
    personOnMind: 'Person on your mind',
    personOnMindOptional: '(Optional)',
    nameOfPerson: 'Name of person',
    favoriteColor: 'Favorite Color',
    colorExample: 'e.g. Crimson Red',
    favoriteAnimal: 'Favorite Animal',
    animalExample: 'e.g. Wolf',
    favoriteFood: 'Favorite Food',
    foodExample: 'e.g. Sushi',
    revealFortune: 'Reveal My Fortune',

    // Validation
    nameRequired: 'Name is required',
    validDateRequired: 'Please enter a valid date of birth',

    // Result Page
    advice: 'Advice',
    watchOut: 'Watch out',
    loading: 'Reading the stars...',

    // Share
    shareText: (score: number, grade: string) =>
      `My Fortune Score today is ${score}! ${grade}\n\nCheck your fortune at Mystic Fortune!`,
    copied: 'Result copied to clipboard!',
  },

  ko: {
    // Common
    appName: 'Mystic Fortune',
    tagline: '오늘의 운세를 확인하세요',
    taglineInput: '당신의 미래를 열어보세요',
    taglineResult: '운명이 밝혀졌습니다',
    adBanner: '광고 배너 320×50',
    back: '뒤로',
    home: '홈',
    share: '공유',
    fortuneScore: '운세 점수',
    footer: '운세는 오락 목적으로만 제공됩니다.',

    // Categories
    categories: {
      love: { label: '연애운', labelKr: '연애운' },
      money: { label: '금전운', labelKr: '금전운' },
      study: { label: '학업운', labelKr: '학업운' },
      social: { label: '대인관계', labelKr: '대인관계' },
    },

    // Input Page
    basicInfo: '기본 정보',
    cosmicContext: '우주적 맥락',
    yourName: '이름',
    enterName: '이름을 입력하세요',
    dateOfBirth: '생년월일',
    gender: '성별',
    female: '여성',
    male: '남성',
    other: '기타',
    personOnMind: '생각나는 사람',
    personOnMindOptional: '(선택)',
    nameOfPerson: '이름',
    favoriteColor: '좋아하는 색',
    colorExample: '예: 빨간색',
    favoriteAnimal: '좋아하는 동물',
    animalExample: '예: 늑대',
    favoriteFood: '좋아하는 음식',
    foodExample: '예: 초밥',
    revealFortune: '운세 확인하기',

    // Validation
    nameRequired: '이름을 입력해주세요',
    validDateRequired: '올바른 생년월일을 입력해주세요',

    // Result Page
    advice: '조언',
    watchOut: '주의',
    loading: '별을 읽는 중...',

    // Share
    shareText: (score: number, grade: string) =>
      `오늘의 운세 점수는 ${score}점! ${grade}\n\nMystic Fortune에서 운세를 확인해보세요!`,
    copied: '결과가 클립보드에 복사되었습니다!',
  },
};

export type Translation = typeof translations['en'];

export function getTranslation(locale: Locale) {
  return translations[locale];
}

export const locales: Locale[] = ['en', 'ko'];
export const defaultLocale: Locale = 'en';
