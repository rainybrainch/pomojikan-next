"use client";

import { useGameState, useGameDispatch } from "@/lib/store/GameContext";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import BottomNav from "./navigation/BottomNav";
import RainBackground from "./RainBackground";
import EvoModal from "./modals/EvoModal";
import PurchasedModal from "./modals/PurchasedModal";
import { useEffect, useRef } from "react";
import { useSound } from "@/lib/sound/useSound";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const sound = useSound(state.soundEnabled);
  const prevLevelRef = useRef(state.playerLevel);

  // プレイヤーレベルアップ音
  useEffect(() => {
    if (state.playerLevel > prevLevelRef.current) sound.levelUp();
    prevLevelRef.current = state.playerLevel;
  }, [state.playerLevel, sound]);

  if (!state.onboardingDone) return <OnboardingFlow />;

  return (
    <>
      <RainBackground />
      <div className="relative z-10">{children}</div>
      <BottomNav />

      {/* 書体進化モーダル（優先度高） */}
      {state.pendingEvoEvent && (
        <EvoModal event={state.pendingEvoEvent} soundEnabled={state.soundEnabled} />
      )}

      {/* 購入完了モーダル（進化モーダルがない時だけ） */}
      {!state.pendingEvoEvent && state.justPurchased && (
        <PurchasedModal />
      )}
    </>
  );
}
