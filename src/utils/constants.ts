export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS_RANGE = 5;

export const AVAILABLE_YEARS = Array.from(
  { length: YEARS_RANGE + 1 },
  (_, index) => CURRENT_YEAR - YEARS_RANGE + index
);

export const CATEGORY_CONFIG = {
  start: {
    title: "시작할 것",
    description: "새롭게 시작하고 싶은 습관, 활동, 목표",
    color: "emerald",
    emoji: "🚀",
  },
  stop: {
    title: "멈플 것",
    description: "그만두거나 줄이고 싶은 습관, 활동",
    color: "rose",
    emoji: "🛑",
  },
  continue: {
    title: "계속할 것",
    description: "잘 진행되어 계속 유지하고 싶은 것",
    color: "indigo",
    emoji: "✨",
  },
} as const;

export const STORAGE_KEYS = {
  REVIEWS: "year_end_reviews",
  THEME: "theme_preference",
  SOLO_NICKNAME: "solo_nickname",
} as const;
