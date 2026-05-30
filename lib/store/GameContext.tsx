"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react";
import { gameReducer, initialState } from "./gameReducer";
import type { GameState, GameAction } from "./types";

const LS_KEY = "pomojikan_next_v1";

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

function loadFromStorage(): GameState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initialState();
    const saved = JSON.parse(raw) as Partial<GameState>;

    // isPremium（旧フラグ）から isPurchased を復元（後方互換）
    if (saved.isPremium && !saved.isPurchased) {
      saved.isPurchased = true;
    }

    // justPurchased は起動時にリセット（お祝いモーダルを再表示しない）
    saved.justPurchased = false;

    return { ...initialState(), ...saved };
  } catch {
    return initialState();
  }
}

function saveToStorage(state: GameState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // quota exceeded など
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => {
    // SSR時は initialState を使い、クライアントで hydrate
    if (typeof window === "undefined") return initialState();
    return loadFromStorage();
  });

  // state変化時に保存
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  // 日付リセット（毎回起動時）
  useEffect(() => {
    dispatch({ type: "RESET_DAILY" });
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

export function useGameState() {
  return useGame().state;
}

export function useGameDispatch() {
  return useGame().dispatch;
}
