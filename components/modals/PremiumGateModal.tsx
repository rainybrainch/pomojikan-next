"use client";

import { useGameDispatch, useGameState } from "@/lib/store/GameContext";
import { RARITY } from "@/lib/engine/codex";
import type { RarityTier } from "@/lib/engine/codex";
import { useSound } from "@/lib/sound/useSound";

interface Props {
  triggeredChar?: string;
  triggeredRarity?: RarityTier;
  onClose: () => void;
}

// 無料版でできること（安心感）
const FREE_FEATURES = [
  "★1〜★9 の文字を集められる（ひらがな〜小4漢字）",
  "相棒を育てて行書まで進化",
  "ポモドーロタイマー・デイリークエスト",
];

// 完全版で解放されること（欲求）
const FULL_FEATURES = [
  { icon: "⭐", text: "★10〜★16 全文字（中高校・人名・古典・神字）" },
  { icon: "📖", text: "書体進化 全段階（草書・篆書・甲骨・神代文字）" },
  { icon: "⚗",  text: "熟語合成システム" },
  { icon: "🎭", text: "5テーマ全開放（墨道・苔庭・金閣・春霞）" },
  { icon: "👥", text: "パーティ 8枠・配合レシピ解放" },
];

export default function PremiumGateModal({ triggeredChar, triggeredRarity, onClose }: Props) {
  const dispatch = useGameDispatch();
  const { soundEnabled } = useGameState();
  const sound = useSound(soundEnabled);
  const rd = triggeredRarity ? RARITY[triggeredRarity] : null;

  const purchase = () => {
    // 本番はここに課金SDK（RevenueCat / App Store IAP）を繋ぐ
    dispatch({ type: "PURCHASE_FULL_VERSION" });
    sound.premium();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #100c18 0%, #06101b 100%)",
          border: "1px solid rgba(240,212,138,0.22)",
          borderBottom: "none",
          animation: "fade-up 0.4s cubic-bezier(.2,.7,.3,1) forwards",
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* グロー */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 0%, rgba(240,212,138,0.09) 0%, transparent 55%)" }} />

        {/* 閉じる */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{ background: "rgba(255,255,255,0.06)", color: "var(--color-ink-dim)" }}>
          ✕
        </button>

        <div className="px-6 pt-7 pb-8 flex flex-col gap-5 relative z-10">

          {/* トリガー文字（あれば） */}
          {triggeredChar && rd && (
            <div className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: `${rd.color}09`, border: `1px solid ${rd.color}20` }}>
              <span className="font-kanji text-5xl font-bold leading-none"
                style={{ color: rd.color, filter: "blur(3px)", textShadow: `0 0 20px ${rd.color}88` }}>
                {triggeredChar}
              </span>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--color-ink)" }}>
                  {rd.label} の文字
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-mute)" }}>
                  完全版で解放されます
                </p>
              </div>
            </div>
          )}

          {/* ヘッダー */}
          <div>
            <p className="text-xs tracking-widest mb-1.5" style={{ color: "var(--color-gold)" }}>
              ぽもじかん 完全版
            </p>
            <h2 className="font-kanji text-2xl font-bold leading-snug" style={{ color: "var(--color-ink)" }}>
              文字の博物館を<br />解放する
            </h2>
            <p className="text-sm mt-2" style={{ color: "var(--color-ink-mute)" }}>
              一度購入すれば、ずっと使えます。
            </p>
          </div>

          {/* 無料版でできること */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(180,220,250,0.04)", border: "1px solid var(--color-line)" }}>
            <p className="text-xs font-bold mb-2.5 tracking-wider" style={{ color: "var(--color-ink-dim)" }}>
              無料版でできること
            </p>
            <ul className="space-y-1.5">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs" style={{ color: "var(--color-ink-dim)" }}>
                  <span className="mt-0.5 flex-none" style={{ color: "var(--color-accent)" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* 完全版で追加されること */}
          <div>
            <p className="text-xs font-bold mb-2.5 tracking-wider" style={{ color: "var(--color-gold)" }}>
              完全版で追加されること
            </p>
            <ul className="space-y-2.5">
              {FULL_FEATURES.map(f => (
                <li key={f.text} className="flex items-start gap-3 text-sm">
                  <span className="text-base flex-none w-6 text-center">{f.icon}</span>
                  <span style={{ color: "var(--color-ink-mute)" }}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 価格 + 購入ボタン */}
          <div className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(240,212,138,0.08) 0%, rgba(201,168,76,0.06) 100%)",
              border: "1px solid rgba(240,212,138,0.25)",
            }}>
            <div className="flex items-baseline justify-between">
              <span className="font-kanji text-lg font-semibold" style={{ color: "var(--color-ink)" }}>
                完全版を購入
              </span>
              <div className="text-right">
                <span className="font-bold text-2xl" style={{ color: "var(--color-gold)" }}>¥480</span>
                <span className="text-xs ml-1" style={{ color: "var(--color-ink-dim)" }}>買い切り</span>
              </div>
            </div>
            <button onClick={purchase}
              className="w-full py-4 rounded-xl text-base font-bold tracking-wide btn-gold"
              style={{ borderRadius: 12 }}>
              ぽもじかん 完全版を手に入れる
            </button>
            <p className="text-center text-xs" style={{ color: "var(--color-ink-dim)" }}>
              一度購入すれば永久に使えます・返金保証あり
            </p>
          </div>

          <button onClick={onClose}
            className="text-center text-sm py-1" style={{ color: "var(--color-ink-dim)" }}>
            今はしない（無料版で続ける）
          </button>
        </div>
      </div>
    </div>
  );
}
