"use client";

import { useState, useMemo } from "react";
import { useGameState } from "@/lib/store/GameContext";
import { RARITY, KANJI_CODEX } from "@/lib/engine/codex";
import type { RarityTier } from "@/lib/engine/codex";
import PremiumGateModal from "@/components/modals/PremiumGateModal";

const TIER_ORDER: RarityTier[] = [
  "★16","★15","★14","★13","★12","★11","★10","★9","★8","★7","★6","★5","★4","★3","★2","★1"
];

const PREMIUM_MIN_TIER = 10;

export default function InventoryPage() {
  const { inventory, friends, isPurchased } = useGameState();
  const [filter, setFilter] = useState<"all" | "locked" | RarityTier>("all");
  const [sortBy, setSortBy] = useState<"rarity" | "count" | "xp">("rarity");
  const [showPurchase, setShowPurchase] = useState(false);

  const totalChars = inventory.reduce((s, i) => s + i.count, 0);
  const uniqueChars = inventory.length;

  // 完全版で解放される文字の総数
  const lockedTotal = useMemo(() =>
    KANJI_CODEX.filter(e => RARITY[e.rarity].tier >= PREMIUM_MIN_TIER).length
  , []);

  const sorted = useMemo(() => {
    let items = [...inventory];
    if (filter === "locked") {
      items = items.filter(i => RARITY[i.rarity].tier >= PREMIUM_MIN_TIER);
    } else if (filter !== "all") {
      items = items.filter(i => i.rarity === filter);
    }
    if (sortBy === "rarity") items.sort((a, b) => RARITY[b.rarity].tier - RARITY[a.rarity].tier);
    else if (sortBy === "count") items.sort((a, b) => b.count - a.count);
    else items.sort((a, b) => b.totalXpGained - a.totalXpGained);
    return items;
  }, [inventory, filter, sortBy]);

  const isFriend = (char: string) => friends.some(f => f.char === char);

  return (
    <div className="flex flex-col h-dvh md:pl-[72px] max-w-4xl md:mx-auto">
      {/* ヘッダー */}
      <div className="flex-none px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid var(--color-line)" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="font-kanji text-lg font-semibold" style={{ color: "var(--color-ink)" }}>
              文字の図鑑
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-dim)" }}>
              {uniqueChars}種 / 合計{totalChars}字捕獲
            </p>
          </div>
          <div className="flex gap-1">
            {(["rarity","count","xp"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className="px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: sortBy === s ? "rgba(135,206,235,0.15)" : "rgba(255,255,255,0.04)",
                  color: sortBy === s ? "var(--color-accent)" : "var(--color-ink-dim)",
                }}>
                {s === "rarity" ? "★" : s === "count" ? "数" : "XP"}
              </button>
            ))}
          </div>
        </div>

        {/* フィルタ */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {["all", ...TIER_ORDER.filter(t => inventory.some(i => i.rarity === t))].map(t => {
            const isAll = t === "all";
            const active = filter === t;
            const color = isAll ? "var(--color-accent)" : RARITY[t as RarityTier].color;
            return (
              <button key={t} onClick={() => setFilter(t as typeof filter)}
                className="flex-none px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                style={{
                  background: active ? `${color}20` : "rgba(255,255,255,0.04)",
                  color: active ? color : "var(--color-ink-dim)",
                  border: `1px solid ${active ? `${color}40` : "transparent"}`,
                }}>
                {isAll ? "すべて" : t}
              </button>
            );
          })}
        </div>
      </div>

      {/* 未購入: ロックバナー */}
      {!isPurchased && (
        <button onClick={() => setShowPurchase(true)}
          className="mx-4 mt-3 flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-98"
          style={{
            background: "linear-gradient(135deg, rgba(240,212,138,0.08) 0%, rgba(135,206,235,0.04) 100%)",
            border: "1px solid rgba(240,212,138,0.2)",
          }}>
          <span className="font-kanji font-bold text-2xl leading-none"
            style={{ color: "#f0d48a", filter: "blur(2px)", textShadow: "0 0 12px rgba(240,212,138,0.7)" }}>
            謙
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: "var(--color-gold)" }}>
              {lockedTotal}字以上が完全版で解放されます
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-dim)" }}>
              ★10〜★16（中高校・人名・古典・神字）
            </p>
          </div>
          <span className="flex-none text-xs font-bold px-2.5 py-1.5 rounded-lg"
            style={{ background: "rgba(240,212,138,0.14)", color: "var(--color-gold)", border: "1px solid rgba(240,212,138,0.28)" }}>
            ¥480
          </span>
        </button>
      )}

      {/* グリッド */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 pb-20">
            <p className="font-kanji text-5xl" style={{ color: "rgba(255,255,255,0.04)" }}>字</p>
            <p className="text-sm text-center" style={{ color: "var(--color-ink-dim)" }}>
              まだ文字を捕獲していません<br />
              タイマーを起動して文字を集めよう
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2.5 pb-24">
            {sorted.map(item => {
              const r = RARITY[item.rarity];
              const friend = isFriend(item.char);
              const isLocked = r.tier >= PREMIUM_MIN_TIER && !isPurchased;

              return (
                <button key={item.char}
                  onClick={isLocked ? () => setShowPurchase(true) : undefined}
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl relative transition-all active:scale-95"
                  style={{
                    background: "var(--color-surface-solid)",
                    border: `1px solid ${friend ? "rgba(240,212,138,0.25)" : isLocked ? "rgba(240,212,138,0.10)" : "var(--color-line)"}`,
                  }}>
                  {friend && (
                    <span className="absolute top-1 right-1 text-xs" style={{ color: "var(--color-gold)" }}>✦</span>
                  )}
                  {isLocked && (
                    <span className="absolute top-1 left-1 text-xs" style={{ color: "var(--color-gold)", opacity: 0.7 }}>🔒</span>
                  )}
                  <span className="font-kanji text-2xl font-bold leading-none"
                    style={{
                      color: r.color,
                      filter: isLocked ? "blur(3px)" : "none",
                      textShadow: r.tier >= 10 ? `0 0 12px ${r.color}88` : "none",
                    }}>
                    {item.char}
                  </span>
                  <span className="font-bold" style={{ color: r.color, fontSize: 10 }}>{r.label}</span>
                  <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>×{item.count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showPurchase && <PremiumGateModal onClose={() => setShowPurchase(false)} />}
    </div>
  );
}
