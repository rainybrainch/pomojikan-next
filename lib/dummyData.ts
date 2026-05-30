import type { Companion, Quest, PhoneUsage, UserStats } from "./types";

export const dummyCompanion: Companion = {
  id: "c_静謐",
  kanji: "静",
  name: "しずか",
  yomi: "せいひつ",
  rarity: "初段",
  script: "行書",
  level: 12,
  xp: 340,
  xpToNext: 500,
  tags: ["禅", "美", "静"],
  desc: "深い静けさ。雑音の中で揺れない核を持つ。",
  bondCount: 47,
  isOriginal: true,
};

export const dummyQuests: Quest[] = [
  {
    id: "q1",
    text: "ポモドーロを2回完了する",
    xpReward: 60,
    completed: true,
    type: "pomodoro",
  },
  {
    id: "q2",
    text: "新しい文字を3字捕獲する",
    xpReward: 45,
    completed: false,
    type: "collect",
  },
  {
    id: "q3",
    text: "熟語を1つ合成する",
    xpReward: 80,
    completed: false,
    type: "compose",
  },
  {
    id: "q4",
    text: "スマホ使用時間を昨日より30分減らす",
    xpReward: 100,
    completed: false,
    type: "daily",
  },
];

export const dummyPhoneUsage: PhoneUsage[] = [
  { hour: 7, minutes: 12 },
  { hour: 8, minutes: 8 },
  { hour: 9, minutes: 5 },
  { hour: 10, minutes: 22 },
  { hour: 11, minutes: 15 },
  { hour: 12, minutes: 35 },
  { hour: 13, minutes: 18 },
  { hour: 14, minutes: 10 },
  { hour: 15, minutes: 28 },
  { hour: 16, minutes: 42 },
  { hour: 17, minutes: 20 },
  { hour: 18, minutes: 55 },
  { hour: 19, minutes: 38 },
  { hour: 20, minutes: 30 },
  { hour: 21, minutes: 25 },
  { hour: 22, minutes: 18 },
];

export const dummyStats: UserStats = {
  streak: 14,
  totalPomodoros: 283,
  todayPomodoros: 2,
  totalXp: 8420,
};

export const RARITY_COLORS: Record<string, string> = {
  拾級: "#9ca3af",
  五級: "#60a5fa",
  三級: "#34d399",
  一級: "#a78bfa",
  初段: "#f59e0b",
  拾段: "#d4a843",
};

export const RARITY_GLOW: Record<string, string> = {
  拾級: "none",
  五級: "0 0 12px rgba(96,165,250,0.4)",
  三級: "0 0 12px rgba(52,211,153,0.4)",
  一級: "0 0 16px rgba(167,139,250,0.5)",
  初段: "0 0 20px rgba(245,158,11,0.5)",
  拾段: "0 0 28px rgba(212,168,67,0.7), 0 0 56px rgba(212,168,67,0.3)",
};
