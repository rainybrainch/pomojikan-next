"use client";

import { useEffect } from "react";
import { useGameDispatch } from "@/lib/store/GameContext";
import type { EvoEvent } from "@/lib/store/types";
import { useSound } from "@/lib/sound/useSound";

interface Props {
  event: EvoEvent;
  soundEnabled: boolean;
}

const EVO_DESCRIPTIONS: Record<string, string> = {
  行書: "筆の速さに魂が宿る。楷書の型を超え、躍動する線が生まれた。",
  草書: "型を溶かし、意を残す。省略の中に深みが宿る書の極地。",
  篆書: "印章に刻まれた古代の文字。時間を超えて響く重みを持つ。",
  甲骨: "骨に刻まれた最古の文字。この字はもう、歴史の一部だ。",
  神代文字: "言語の彼岸。もはや人の手によるものではない何かが宿る。",
};

export default function EvoModal({ event, soundEnabled }: Props) {
  const dispatch = useGameDispatch();
  const sound = useSound(soundEnabled);

  useEffect(() => {
    sound.evo();
  }, [sound]);

  const close = () => dispatch({ type: "CLEAR_EVO_EVENT" });
  const desc = EVO_DESCRIPTIONS[event.evoName] ?? "新たな書体へと進化した。";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={close}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl p-8 flex flex-col items-center gap-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0d1f2e 0%, #06101b 100%)",
          border: "1px solid rgba(240,212,138,0.25)",
          borderBottom: "none",
          animation: "fade-up 0.45s cubic-bezier(.2,.7,.3,1) forwards",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 背景グロー */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(240,212,138,0.12) 0%, transparent 65%)",
          }} />

        {/* バッジ */}
        <div className="relative px-4 py-1.5 rounded-full"
          style={{ background: "rgba(240,212,138,0.12)", border: "1px solid rgba(240,212,138,0.3)" }}>
          <span className="text-xs font-bold tracking-widest" style={{ color: "var(--color-gold)" }}>
            書体進化
          </span>
        </div>

        {/* 漢字 */}
        <div className="relative flex items-center justify-center">
          {/* オーラリング */}
          <div className="absolute rounded-full"
            style={{
              width: 140, height: 140,
              border: "1px solid rgba(240,212,138,0.2)",
              boxShadow: "0 0 40px rgba(240,212,138,0.15), inset 0 0 40px rgba(240,212,138,0.05)",
            }} />
          <span
            className="font-kanji font-bold kanji-glow-gold relative z-10"
            style={{ fontSize: 88, lineHeight: 1, color: "var(--color-gold)" }}
          >
            {event.char}
          </span>
          {/* グリフバッジ */}
          {event.evoGlyph && (
            <span className="absolute top-0 right-0 text-xl" style={{ color: "var(--color-gold)" }}>
              {event.evoGlyph}
            </span>
          )}
        </div>

        {/* テキスト */}
        <div className="text-center relative z-10">
          <p className="text-xs tracking-widest mb-2" style={{ color: "var(--color-ink-mute)" }}>
            {event.friendName} が
          </p>
          <p className="font-kanji text-3xl font-bold mb-1" style={{ color: "var(--color-ink)" }}>
            {event.evoName}
          </p>
          <p className="text-xs" style={{ color: "var(--color-ink-dim)" }}>
            Lv.{event.newLevel} {event.evoGlyph}
          </p>
        </div>

        {/* 説明 */}
        <p className="font-kanji text-sm leading-relaxed text-center relative z-10"
          style={{ color: "var(--color-ink-mute)" }}>
          {desc}
        </p>

        {/* 閉じるボタン */}
        <button
          onClick={close}
          className="relative z-10 w-full py-4 rounded-2xl font-bold text-sm tracking-wide btn-gold"
          style={{ borderRadius: 14 }}
        >
          素晴らしい ✦
        </button>

        {/* パーティクル（CSS only） */}
        {[...Array(8)].map((_, i) => (
          <div key={i}
            className="absolute pointer-events-none rounded-full"
            style={{
              width: 4, height: 4,
              background: "var(--color-gold)",
              top: `${20 + Math.sin(i * 0.8) * 30}%`,
              left: `${10 + i * 11}%`,
              opacity: 0.4 + (i % 3) * 0.2,
              animation: `gold-pulse ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite`,
            }} />
        ))}
      </div>
    </div>
  );
}
