import type { RarityTier } from "../engine/codex";

export interface PomojiFriend {
  id: string;
  char: string;
  rarity: RarityTier;
  name: string;           // ユーザーが付けた名前
  level: number;
  xp: number;
  bondCount: number;      // 捕獲累計（絆値）
  isOriginal: boolean;
  tags: string[];
  capturedAt: number;     // timestamp
}

export interface InventoryItem {
  char: string;
  rarity: RarityTier;
  count: number;
  totalXpGained: number;
}

export interface DailyQuest {
  id: string;
  text: string;
  xpReward: number;
  completed: boolean;
  type: "pomodoro" | "capture" | "compose" | "phone";
  target: number;
  progress: number;
}

// 書体進化イベント（モーダル表示用）
export interface EvoEvent {
  friendId: string;
  char: string;
  friendName: string;
  newLevel: number;
  evoName: string;   // 例: "行書"
  evoGlyph: string;  // 例: "✦"
}

export interface GameState {
  // ユーザー基本情報
  playerName: string;
  playerLevel: number;
  playerXp: number;
  totalPomodoros: number;
  todayPomodoros: number;
  lastPlayDate: string;
  streak: number;
  maxStreak: number;

  // 相棒・図鑑
  party: (PomojiFriend | null)[];
  inventory: InventoryItem[];
  friends: PomojiFriend[];

  // クエスト
  dailyQuests: DailyQuest[];

  // 買い切り解放（完全版購入）
  isPurchased: boolean;        // 完全版購入済みか
  justPurchased: boolean;      // 購入直後フラグ（お祝いモーダル用）
  /** @deprecated use isPurchased */
  isPremium: boolean;          // 後方互換（localStorage移行用）

  // イベントキュー（モーダル表示）
  pendingEvoEvent: EvoEvent | null;

  // 設定
  focusMinutes: number;
  breakMinutes: number;
  soundEnabled: boolean;

  // オンボーディング完了
  onboardingDone: boolean;
}

export type GameAction =
  | { type: "COMPLETE_ONBOARDING"; payload: { playerName: string; originalFriend: PomojiFriend } }
  | { type: "CAPTURE_CHAR"; payload: { char: string; rarity: RarityTier; xpGained: number } }
  | { type: "POMODORO_COMPLETE"; payload: { mode: "focus" | "break" } }
  | { type: "SET_PARTY"; payload: { slot: number; friendId: string | null } }
  | { type: "ADD_XP"; payload: { amount: number } }
  | { type: "CLEAR_EVO_EVENT" }
  | { type: "PURCHASE_FULL_VERSION" }   // 買い切り購入
  | { type: "CLEAR_JUST_PURCHASED" }   // お祝いモーダル表示後にクリア
  | { type: "RESET_DAILY" }
  | { type: "SET_SETTING"; payload: Partial<Pick<GameState, "focusMinutes" | "breakMinutes" | "soundEnabled">> };
