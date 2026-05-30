export type Rarity = "拾級" | "五級" | "三級" | "一級" | "初段" | "拾段";

export type Script = "楷書" | "行書" | "草書" | "篆書" | "甲骨";

export interface Companion {
  id: string;
  kanji: string;
  name: string;
  yomi: string;
  rarity: Rarity;
  script: Script;
  level: number;
  xp: number;
  xpToNext: number;
  tags: string[];
  desc: string;
  bondCount: number;
  isOriginal: boolean;
}

export interface Quest {
  id: string;
  text: string;
  xpReward: number;
  completed: boolean;
  type: "pomodoro" | "collect" | "compose" | "daily";
}

export interface PhoneUsage {
  hour: number;
  minutes: number;
}

export type TimerMode = "focus" | "break";

export interface TimerState {
  mode: TimerMode;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface UserStats {
  streak: number;
  totalPomodoros: number;
  todayPomodoros: number;
  totalXp: number;
}
