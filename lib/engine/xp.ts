import { RARITY, type RarityTier } from "./codex";

// レベルアップに必要なXP（指数曲線）
export function xpRequired(level: number): number {
  return Math.floor(100 * Math.pow(1.18, level - 1));
}

// XP追加後のレベル/XP計算（連続レベルアップ対応）
export interface LevelResult {
  level: number;
  xp: number;
  leveledUp: boolean;
  levelsGained: number;
}

export function addXp(currentLevel: number, currentXp: number, gained: number): LevelResult {
  let lv = currentLevel;
  let xp = currentXp + gained;
  let levelsGained = 0;

  while (xp >= xpRequired(lv)) {
    xp -= xpRequired(lv);
    lv++;
    levelsGained++;
  }

  return { level: lv, xp, leveledUp: levelsGained > 0, levelsGained };
}

// レアリティからEXP計算（拾段は大量EXP）
export function expFromCapture(rarity: RarityTier, companionBond: number): number {
  const base = RARITY[rarity].exp;
  const bondBonus = 1 + companionBond * 0.02; // 絆が高いほど少しボーナス
  return Math.ceil(base * bondBonus);
}

// レベルに応じたグロー半径
export function lvGlowRadius(lv: number): number {
  return Math.min(120, 8 + Math.log10(Math.max(1, lv)) * 22);
}

// Pomodoro完了ボーナスXP
export function pomodoroCompleteBonus(mode: "focus" | "break"): number {
  return mode === "focus" ? 50 : 10;
}

// レアリティ tier → 落下サイズ（px）
export function dropFontSize(tier: number): number {
  const base = 48;
  // 高レアほど大きく（tier 1: 48px → tier 16: 96px）
  return Math.floor(base + (tier - 1) * 3.2);
}

// 落下速度（重力倍率）
export const TIER_FALL_MUL = [
  1.0, 0.97, 0.94, 0.90, 0.86, 0.82, 0.78, 0.74,
  0.70, 0.66, 0.62, 0.58, 0.54, 0.50, 0.46, 0.42,
];

export const GRAVITY_BASE = 0.07;
export const MAX_FALL_VY  = 2.6;
