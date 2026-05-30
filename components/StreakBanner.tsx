"use client";

import { useState } from "react";
import { useGameState } from "@/lib/store/GameContext";
import PremiumGateModal from "./modals/PremiumGateModal";

export default function StreakBanner() {
  const { streak, isPurchased } = useGameState();
  const [showModal, setShowModal] = useState(false);

  // 7日以上連続 かつ 未購入のときだけ表示
  if (streak < 7 || isPurchased) return null;

  return (
    <>
      <div className="rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(240,212,138,0.09) 0%, rgba(135,206,235,0.05) 100%)",
          border: "1px solid rgba(240,212,138,0.22)",
          boxShadow: "0 4px 24px rgba(240,212,138,0.07)",
        }}>
        {/* 背景 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 font-kanji pointer-events-none select-none"
          style={{ fontSize: 64, color: "rgba(240,212,138,0.05)", fontWeight: 700 }}>継</div>

        <div className="text-3xl flex-none">🔥</div>

        <div className="flex-1 min-w-0 relative z-10">
          <p className="font-bold text-sm" style={{ color: "var(--color-gold)" }}>
            {streak}日連続達成！
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-mute)" }}>
            完全版なら★10以上の文字も集められます
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex-none px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
          style={{
            background: "rgba(240,212,138,0.14)",
            color: "var(--color-gold)",
            border: "1px solid rgba(240,212,138,0.28)",
          }}>
          ¥480
        </button>
      </div>

      {showModal && <PremiumGateModal onClose={() => setShowModal(false)} />}
    </>
  );
}
