import type { GameState, GameAction, PomojiFriend, EvoEvent } from "./types";
import { addXp, xpRequired } from "../engine/xp";
import { getEvoStage } from "../engine/codex";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export const DEFAULT_QUESTS = [
  { id: "q_pomo",    text: "ポモドーロを2回完了する", xpReward: 60,  type: "pomodoro" as const, target: 2, progress: 0, completed: false },
  { id: "q_capture", text: "文字を5字捕獲する",       xpReward: 45,  type: "capture"  as const, target: 5, progress: 0, completed: false },
  { id: "q_streak",  text: "今日も連続記録を続ける",   xpReward: 30,  type: "phone"    as const, target: 1, progress: 0, completed: false },
];

export function initialState(): GameState {
  return {
    playerName: "",
    playerLevel: 1,
    playerXp: 0,
    totalPomodoros: 0,
    todayPomodoros: 0,
    lastPlayDate: "",
    streak: 0,
    maxStreak: 0,
    party: [null, null, null, null],
    inventory: [],
    friends: [],
    dailyQuests: DEFAULT_QUESTS,
    isPurchased: false,
    justPurchased: false,
    isPremium: false,
    pendingEvoEvent: null,
    focusMinutes: 25,
    breakMinutes: 5,
    soundEnabled: true,
    onboardingDone: false,
  };
}

// 書体進化チェック: before/after level を比べて段をまたいだか判定
function checkEvoEvent(friend: PomojiFriend, prevLevel: number): EvoEvent | null {
  const prevEvo = getEvoStage(prevLevel);
  const nextEvo = getEvoStage(friend.level);
  if (nextEvo.name !== prevEvo.name && friend.level >= 10) {
    return {
      friendId: friend.id,
      char: friend.char,
      friendName: friend.name,
      newLevel: friend.level,
      evoName: nextEvo.name,
      evoGlyph: nextEvo.glyph,
    };
  }
  return null;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case "COMPLETE_ONBOARDING": {
      const { playerName, originalFriend } = action.payload;
      return {
        ...state,
        playerName,
        onboardingDone: true,
        friends: [originalFriend],
        party: [originalFriend, null, null, null],
        lastPlayDate: todayStr(),
        streak: 1,
        maxStreak: 1,
      };
    }

    case "CAPTURE_CHAR": {
      const { char, rarity, xpGained } = action.payload;

      // inventory 更新
      const inv = [...state.inventory];
      const idx = inv.findIndex(i => i.char === char);
      if (idx >= 0) {
        inv[idx] = { ...inv[idx], count: inv[idx].count + 1, totalXpGained: inv[idx].totalXpGained + xpGained };
      } else {
        inv.push({ char, rarity, count: 1, totalXpGained: xpGained });
      }

      // party の各仲間にXP付与（オリジナルにボーナス）
      let evoEvent: EvoEvent | null = state.pendingEvoEvent;
      const party = state.party.map((f) => {
        if (!f) return f;
        const bonus = f.isOriginal ? 1 : 0.3;
        const xp = Math.ceil(xpGained * bonus);
        const prevLevel = f.level;
        const res = addXp(f.level, f.xp, xp);
        const updated: PomojiFriend = {
          ...f,
          level: res.level,
          xp: res.xp,
          bondCount: f.bondCount + (char === f.char ? 1 : 0),
        };
        if (!evoEvent) evoEvent = checkEvoEvent(updated, prevLevel);
        return updated;
      });

      // プレイヤーXP
      const pRes = addXp(state.playerLevel, state.playerXp, Math.ceil(xpGained / 4));

      // friends 配列も同期
      const friends = state.friends.map(f => {
        const updated = party.find(p => p?.id === f.id);
        return updated ?? f;
      });

      // クエスト進捗
      const dailyQuests = state.dailyQuests.map(q => {
        if (q.id === "q_capture" && !q.completed) {
          const progress = q.progress + 1;
          return { ...q, progress, completed: progress >= q.target };
        }
        return q;
      });

      return {
        ...state,
        inventory: inv,
        party,
        friends,
        playerLevel: pRes.level,
        playerXp: pRes.xp,
        dailyQuests,
        pendingEvoEvent: evoEvent,
      };
    }

    case "POMODORO_COMPLETE": {
      const { mode } = action.payload;
      const bonusXp = mode === "focus" ? 50 : 10;
      const pRes = addXp(state.playerLevel, state.playerXp, bonusXp);
      const today = todayStr();
      const totalPomodoros = mode === "focus" ? state.totalPomodoros + 1 : state.totalPomodoros;
      const todayPomodoros = mode === "focus" ? state.todayPomodoros + 1 : state.todayPomodoros;

      let streak = state.streak;
      if (state.lastPlayDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        streak = state.lastPlayDate === yesterday ? streak + 1 : 1;
      }
      const maxStreak = Math.max(streak, state.maxStreak);

      const dailyQuests = state.dailyQuests.map(q => {
        if (q.id === "q_pomo" && !q.completed && mode === "focus") {
          const progress = q.progress + 1;
          return { ...q, progress, completed: progress >= q.target };
        }
        if (q.id === "q_streak" && !q.completed) {
          return { ...q, progress: 1, completed: true };
        }
        return q;
      });

      return {
        ...state,
        totalPomodoros,
        todayPomodoros,
        lastPlayDate: today,
        streak,
        maxStreak,
        playerLevel: pRes.level,
        playerXp: pRes.xp,
        dailyQuests,
      };
    }

    case "ADD_XP": {
      const res = addXp(state.playerLevel, state.playerXp, action.payload.amount);
      return { ...state, playerLevel: res.level, playerXp: res.xp };
    }

    case "CLEAR_EVO_EVENT":
      return { ...state, pendingEvoEvent: null };

    case "PURCHASE_FULL_VERSION":
      return { ...state, isPurchased: true, isPremium: true, justPurchased: true };

    case "CLEAR_JUST_PURCHASED":
      return { ...state, justPurchased: false };

    case "SET_PARTY": {
      const { slot, friendId } = action.payload;
      const party = [...state.party];
      party[slot] = friendId ? (state.friends.find(f => f.id === friendId) ?? null) : null;
      return { ...state, party };
    }

    case "RESET_DAILY": {
      const today = todayStr();
      if (state.lastPlayDate === today) return state;
      return {
        ...state,
        todayPomodoros: 0,
        dailyQuests: DEFAULT_QUESTS.map(q => ({ ...q })),
        lastPlayDate: today,
      };
    }

    case "SET_SETTING":
      return { ...state, ...action.payload };

    default:
      return state;
  }
}
