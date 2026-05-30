"use client";

import { useState } from "react";
import { useGameState } from "@/lib/store/GameContext";
import PremiumGateModal from "./modals/PremiumGateModal";

export default function PremiumBanner() {
  const { isPurchased } = useGameState();
  const [showModal, setShowModal] = useState(false);

  // 購入済みなら非表示
  if (isPurchased) return null;

  return (
    <>
      <div
        className="rounded-2xl p-5 relative overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(135deg, rgba(240,212,138,0.07) 0%, rgba(135,206,235,0.04) 100%)",
          border: "1px solid rgba(240,212,138,0.18)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
        }}
        onClick={() => setShowModal(true)}
      >
        {/* 背景文字 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 font-kanji pointer-events-none select-none"
          aria-hidden style={{ fontSize: 100, lineHeight: 1, color: "rgba(240,212,138,0.05)", fontWeight: 700 }}>
          拾
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* バッジ */}
              <div className="inline-flex items-center gap-1.5 mb-3">
                <span className="rarity-badge"
                  style={{ color: "var(--color-gold)", borderColor: "rgba(240,212,138,0.3)", background: "rgba(240,212,138,0.1)" }}>
                  完全版
                </span>
              </div>
              <h3 className="font-kanji text-lg font-semibold leading-snug mb-1"
                style={{ color: "var(--color-ink)" }}>
                文字の博物館へ
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-mute)" }}>
                ★10〜★16・草書から甲骨まで<br />
                一度購入すれば、ずっと使えます
              </p>
            </div>

            {/* 価格タグ */}
            <div className="flex-none flex flex-col items-center justify-center px-4 py-3 rounded-xl"
              style={{ background: "rgba(240,212,138,0.10)", border: "1px solid rgba(240,212,138,0.2)", minWidth: 72 }}>
              <span className="font-bold text-xl leading-none" style={{ color: "var(--color-gold)" }}>¥480</span>
              <span className="text-xs mt-1" style={{ color: "var(--color-ink-dim)" }}>買い切り</span>
            </div>
          </div>

          {/* 機能ピル */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {["★16 神字", "甲骨文字", "熟語合成", "5テーマ", "パーティ8枠"].map(t => (
              <span key={t} className="text-xs px-2 py-1 rounded-full"
                style={{ background: "rgba(240,212,138,0.07)", color: "var(--color-ink-dim)", border: "1px solid rgba(240,212,138,0.12)" }}>
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={e => { e.stopPropagation(); setShowModal(true); }}
            className="w-full mt-4 py-3.5 rounded-xl text-sm font-bold tracking-wide btn-gold"
            style={{ borderRadius: 12 }}>
            完全版を手に入れる →
          </button>
          <p className="text-center text-xs mt-2" style={{ color: "var(--color-ink-dim)" }}>
            一度購入すれば永久に使えます
          </p>
        </div>
      </div>

      {showModal && <PremiumGateModal onClose={() => setShowModal(false)} />}
    </>
  );
}
