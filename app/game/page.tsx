"use client";

import { useState, useCallback } from "react";
import GameCanvas from "@/components/game/GameCanvas";
import PomodoroController from "@/components/game/PomodoroController";
import { useGameState } from "@/lib/store/GameContext";
import { RARITY, getEvoStage } from "@/lib/engine/codex";
import { xpRequired } from "@/lib/engine/xp";
import type { TimerMode } from "@/lib/types";

export default function GamePage() {
  const state = useGameState();
  const [timerMode, setTimerMode] = useState<TimerMode>("focus");
  const [timerRunning, setTimerRunning] = useState(false);
  const [lastCapture, setLastCapture] = useState<{ char: string; xp: number } | null>(null);

  const handleModeChange = useCallback((mode: TimerMode, running: boolean) => {
    setTimerMode(mode);
    setTimerRunning(running);
  }, []);

  const handleCapture = useCallback((char: string, xpGained: number) => {
    setLastCapture({ char, xp: xpGained });
    setTimeout(() => setLastCapture(null), 2000);
  }, []);

  const companion = state.party[0];
  const companionBond = companion?.bondCount ?? 0;
  const evo = companion ? getEvoStage(companion.level) : null;
  const rd = companion ? RARITY[companion.rarity] : null;
  const compXpPct = companion
    ? Math.min(100, Math.round((companion.xp / xpRequired(companion.level)) * 100))
    : 0;

  return (
    /* ━━ スマホ: 縦1カラム / PC: 横2カラム ━━ */
    <div className="flex flex-col md:flex-row h-dvh md:pl-[72px]">

      {/* ━━━ キャンバスエリア ━━━ */}
      <div className="relative flex-1 min-h-0 overflow-hidden"
        style={{
          background: timerMode === "focus"
            ? "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(135,206,235,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(110,231,183,0.06) 0%, transparent 70%)",
        }}>

        <GameCanvas
          isRunning={timerRunning}
          mode={timerMode}
          playerLevel={state.playerLevel}
          companionBond={companionBond}
          onCapture={handleCapture}
        />

        {/* 停止中ヒント */}
        {!timerRunning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-8">
              <p className="font-kanji mb-3"
                style={{ fontSize: 72, color: "rgba(135,206,235,0.08)", lineHeight: 1 }}>字</p>
              <p className="text-sm" style={{ color: "var(--color-ink-dim)" }}>
                タイマーを開始すると<br />文字が降ってきます
              </p>
            </div>
          </div>
        )}

        {/* 捕獲フラッシュ */}
        {lastCapture && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ animation: "fade-up 0.3s ease forwards" }}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(135,206,235,0.15)", border: "1px solid rgba(135,206,235,0.3)" }}>
              <span className="font-kanji text-xl font-bold" style={{ color: "var(--color-accent)" }}>
                {lastCapture.char}
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--color-gold)" }}>
                +{lastCapture.xp}XP
              </span>
            </div>
          </div>
        )}

        {/* スマホ: 相棒ミニバー（上部）*/}
        <div className="mobile-only absolute top-0 left-0 right-0 px-4 pt-3 pb-2 flex items-center gap-3"
          style={{ background: "linear-gradient(180deg,rgba(6,16,27,0.8),transparent)" }}>
          <CompanionMini companion={companion} evo={evo} rd={rd} compXpPct={compXpPct} />
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full ml-auto flex-none"
            style={{ background: "rgba(240,212,138,0.1)", border: "1px solid rgba(240,212,138,0.2)" }}>
            <span className="text-sm">🍅</span>
            <span className="text-xs font-bold" style={{ color: "var(--color-gold)" }}>
              {state.todayPomodoros}
            </span>
          </div>
        </div>

        {/* スマホ: タイマー（下部）*/}
        <div className="mobile-only absolute bottom-0 left-0 right-0 p-4 pb-24"
          style={{ background: "linear-gradient(0deg,rgba(6,16,27,0.95) 60%,transparent)" }}>
          <PomodoroController onModeChange={handleModeChange} />
        </div>
      </div>

      {/* ━━━ PC サイドバー ━━━ */}
      <aside className="desktop-only sidebar-scroll flex-none flex flex-col gap-4 p-5"
        style={{
          width: 340,
          borderLeft: "1px solid var(--color-line)",
          background: "rgba(6,16,27,0.7)",
          backdropFilter: "blur(16px)",
        }}>

        {/* 相棒カード */}
        {companion && (
          <div className="rounded-2xl p-4 glass-card-solid">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-none"
                style={{ background: `${rd?.color ?? "var(--color-accent)"}11` }}>
                <span className={`font-kanji font-bold${companion.isOriginal ? " kanji-glow-gold" : ""}`}
                  style={{ fontSize: 40, lineHeight: 1, color: companion.isOriginal ? "var(--color-gold)" : rd?.color }}>
                  {companion.char}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  {companion.isOriginal && (
                    <span className="rarity-badge"
                      style={{ color: "var(--color-gold)", borderColor: "rgba(240,212,138,0.3)", background: "rgba(240,212,138,0.08)", fontSize: 9 }}>
                      ✦ オリジナル
                    </span>
                  )}
                  <span className="rarity-badge"
                    style={{ color: rd?.color, borderColor: `${rd?.color}44`, background: `${rd?.color}0f`, fontSize: 9 }}>
                    {rd?.label}
                  </span>
                </div>
                <p className="font-semibold text-sm truncate" style={{ color: "var(--color-ink)" }}>
                  {companion.name}
                </p>
                <p className="text-xs" style={{ color: "var(--color-ink-mute)" }}>
                  Lv.{companion.level} {evo?.name} {evo?.glyph}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--color-ink-dim)" }}>
                <span>XP</span>
                <span>{companion.xp} / {xpRequired(companion.level)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(180,220,250,0.06)" }}>
                <div className="xp-bar-fill h-full rounded-full" style={{ width: `${compXpPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* タイマー */}
        <PomodoroController onModeChange={handleModeChange} />

        {/* 今日の統計 */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "今日", value: `${state.todayPomodoros}回` },
            { label: "連続", value: `${state.streak}日` },
            { label: "総計", value: `${state.totalPomodoros}回` },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3 text-center glass-card-solid">
              <p className="text-xs mb-1" style={{ color: "var(--color-ink-dim)" }}>{s.label}</p>
              <p className="font-bold text-sm" style={{ color: "var(--color-ink)" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* 図鑑ミニ（最近の捕獲）*/}
        {state.inventory.length > 0 && (
          <div>
            <p className="text-xs font-bold tracking-widest mb-2 px-1" style={{ color: "var(--color-ink-dim)" }}>
              最近の捕獲
            </p>
            <div className="flex flex-wrap gap-2">
              {state.inventory.slice(-12).reverse().map(item => (
                <div key={item.char}
                  className="w-10 h-10 rounded-lg flex items-center justify-center glass-card-solid">
                  <span className="font-kanji text-lg font-bold"
                    style={{ color: RARITY[item.rarity].color, lineHeight: 1 }}>
                    {item.char}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

// 相棒ミニ表示（スマホ上部用）
function CompanionMini({ companion, evo, rd, compXpPct }: {
  companion: ReturnType<typeof useGameState>["party"][0];
  evo: ReturnType<typeof getEvoStage> | null;
  rd: (typeof RARITY)[keyof typeof RARITY] | null;
  compXpPct: number;
}) {
  if (!companion) return null;
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className={`font-kanji font-bold text-2xl leading-none${companion.isOriginal ? " kanji-glow-gold" : ""}`}
        style={{ color: companion.isOriginal ? "var(--color-gold)" : rd?.color }}>
        {companion.char}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="truncate" style={{ color: "var(--color-ink-mute)" }}>
            {companion.name} Lv.{companion.level}
          </span>
          <span style={{ color: "var(--color-accent)" }}>{companion.xp}XP</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(180,220,250,0.06)" }}>
          <div className="xp-bar-fill h-full rounded-full" style={{ width: `${compXpPct}%` }} />
        </div>
      </div>
    </div>
  );
}
