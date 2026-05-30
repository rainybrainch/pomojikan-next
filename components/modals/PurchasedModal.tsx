"use client";

import { useEffect } from "react";
import { useGameDispatch, useGameState } from "@/lib/store/GameContext";
import { useSound } from "@/lib/sound/useSound";

const UNLOCKED_HIGHLIGHTS = [
  { icon: "⭐", text: "★10〜★16 の文字が降ってくる" },
  { icon: "📖", text: "草書・篆書・甲骨・神代文字へ進化できる" },
  { icon: "⚗",  text: "熟語合成システムが解放された" },
  { icon: "🎭", text: "5テーマすべて使えるようになった" },
];

export default function PurchasedModal() {
  const dispatch = useGameDispatch();
  const { soundEnabled, party } = useGameState();
  const sound = useSound(soundEnabled);
  const companion = party[0];

  useEffect(() => { sound.premium(); }, [sound]);

  const close = () => dispatch({ type: "CLEAR_JUST_PURCHASED" });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
      onClick={close}>
      <div className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a1008 0%, #06101b 100%)",
          border: "1px solid rgba(240,212,138,0.35)",
          boxShadow: "0 0 60px rgba(240,212,138,0.15)",
          animation: "fade-up 0.45s cubic-bezier(.2,.7,.3,1) forwards",
        }}
        onClick={e => e.stopPropagation()}>

        {/* 背景グロー */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 50% 20%, rgba(240,212,138,0.15) 0%, transparent 60%)" }} />

        {/* パーティクル */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute pointer-events-none rounded-full"
            style={{
              width: i % 3 === 0 ? 5 : 3,
              height: i % 3 === 0 ? 5 : 3,
              background: i % 2 === 0 ? "var(--color-gold)" : "var(--color-accent)",
              top: `${10 + (i * 7) % 80}%`,
              left: `${5 + (i * 8) % 90}%`,
              opacity: 0.3 + (i % 4) * 0.15,
              animation: `gold-pulse ${1.2 + (i * 0.2) % 1.5}s ${i * 0.15}s ease-in-out infinite`,
            }} />
        ))}

        {/* 購入済みバッジ */}
        <div className="relative px-5 py-2 rounded-full"
          style={{ background: "rgba(240,212,138,0.15)", border: "1px solid rgba(240,212,138,0.4)" }}>
          <span className="text-sm font-bold tracking-wider" style={{ color: "var(--color-gold)" }}>
            ✦ 完全版 解放
          </span>
        </div>

        {/* 相棒 + テキスト */}
        <div className="relative flex flex-col items-center gap-3 text-center">
          {companion && (
            <span className="font-kanji font-bold kanji-glow-gold"
              style={{ fontSize: 72, lineHeight: 1, color: "var(--color-gold)" }}>
              {companion.char}
            </span>
          )}
          <div>
            <h2 className="font-kanji text-2xl font-bold" style={{ color: "var(--color-ink)" }}>
              ありがとうございます
            </h2>
            <p className="text-sm mt-1.5" style={{ color: "var(--color-ink-mute)" }}>
              文字の博物館が全て開きました。<br />
              {companion?.name ?? "相棒"}と一緒に、さらに奥へ。
            </p>
          </div>
        </div>

        {/* 解放一覧 */}
        <div className="w-full rounded-2xl p-4 space-y-2.5"
          style={{ background: "rgba(240,212,138,0.06)", border: "1px solid rgba(240,212,138,0.15)" }}>
          {UNLOCKED_HIGHLIGHTS.map(u => (
            <div key={u.text} className="flex items-center gap-3 text-sm">
              <span className="text-base w-6 text-center flex-none">{u.icon}</span>
              <span style={{ color: "var(--color-ink-mute)" }}>{u.text}</span>
              <span className="ml-auto flex-none text-xs font-bold" style={{ color: "var(--color-gold)" }}>解放✓</span>
            </div>
          ))}
        </div>

        <button onClick={close}
          className="w-full py-4 rounded-2xl text-base font-bold tracking-wide btn-gold"
          style={{ borderRadius: 16 }}>
          あそびに行く ✦
        </button>
      </div>
    </div>
  );
}
