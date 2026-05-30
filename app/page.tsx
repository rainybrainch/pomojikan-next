"use client";

import { useState } from "react";
import Link from "next/link";
import { useGameState } from "@/lib/store/GameContext";
import { RARITY, getEvoStage } from "@/lib/engine/codex";
import { xpRequired } from "@/lib/engine/xp";
import DailyQuests from "@/components/DailyQuests";
import PremiumBanner from "@/components/PremiumBanner";
import StreakBanner from "@/components/StreakBanner";
import PremiumGateModal from "@/components/modals/PremiumGateModal";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "深夜の鍛錬。";
  if (h < 10) return "おはようございます。";
  if (h < 17) return "今日も積み上げよう。";
  if (h < 21) return "夕刻の集中時間。";
  return "夜の書斎へ。";
}

export default function HomePage() {
  const state = useGameState();
  const companion = state.party[0];
  const [showPurchase, setShowPurchase] = useState(false);
  const evo = companion ? getEvoStage(companion.level) : null;
  const xpNeeded = xpRequired(state.playerLevel);
  const xpPercent = Math.min(100, Math.round((state.playerXp / xpNeeded) * 100));
  const rd = companion ? RARITY[companion.rarity] : null;
  const compXpPct = companion
    ? Math.min(100, Math.round((companion.xp / xpRequired(companion.level)) * 100))
    : 0;

  const quests = state.dailyQuests.map(q => ({
    id: q.id, text: q.text, xpReward: q.xpReward, completed: q.completed,
    type: q.type as "pomodoro" | "collect" | "compose" | "daily",
  }));

  return (
    <div className="flex flex-col min-h-dvh md:pl-[72px]">

      {/* ━━ ヘッダー ━━ */}
      <header className="sticky top-0 z-40 px-5 py-3.5 flex items-center justify-between"
        style={{
          background: "rgba(6,16,27,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--color-line)",
        }}>
        {/* ロゴ */}
        <div className="flex items-center gap-0.5">
          <span className="font-kanji text-xl font-bold" style={{ color: "var(--color-accent)" }}>ぽも</span>
          <span className="font-kanji text-xl font-bold" style={{ color: "var(--color-ink)" }}>じかん</span>
        </div>
        {/* バッジ */}
        <div className="flex items-center gap-2">
          <Pill icon="🔥" value={`${state.streak}日`}
            color="var(--color-gold)" bg="rgba(240,212,138,0.08)" border="rgba(240,212,138,0.2)" />
          <Pill icon="🍅" value={`${state.todayPomodoros}`}
            color="var(--color-accent)" bg="rgba(135,206,235,0.08)" border="rgba(135,206,235,0.2)" />
        </div>
      </header>

      {/* PC: 2カラムグリッド / スマホ: 1カラム */}
      <main className="flex-1 px-4 pb-28 md:pb-8
        md:grid md:grid-cols-[1fr_360px] md:gap-6 md:px-8 md:pt-6
        space-y-4 md:space-y-0 md:items-start">

        {/* PC左カラム */}
        <div className="space-y-4">

        {/* ━━ ヒーロー ━━ */}
        <div className="pt-5 opacity-0 fade-up fade-up-1">
          <p className="text-xs tracking-widest mb-1" style={{ color: "var(--color-ink-dim)", fontFamily: "var(--font-body)" }}>
            {getGreeting()}
          </p>
          <h1 className="font-kanji text-2xl font-semibold leading-snug" style={{ color: "var(--color-ink)" }}>
            スマホ時間を、育つ時間に。
          </h1>
          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "var(--color-ink-dim)" }}>
            <span>{state.playerName} さん</span>
            <span style={{ color: "var(--color-line-strong)" }}>|</span>
            <span>Lv.<strong style={{ color: "var(--color-ink-mute)" }}>{state.playerLevel}</strong></span>
            <span style={{ color: "var(--color-line-strong)" }}>|</span>
            <span>総{state.totalPomodoros}ポモ</span>
          </div>
        </div>

        {/* ━━ 完全版ティーザー（未購入・上部・小） ━━ */}
        {!state.isPurchased && <MiniPurchaseTease onOpen={() => setShowPurchase(true)} />}

        {/* ━━ プレイヤーXPバー ━━ */}
        <div className="opacity-0 fade-up fade-up-1">
          <div className="rounded-xl px-4 py-2.5 flex items-center gap-3 glass-card-solid">
            <span className="text-xs font-mono" style={{ color: "var(--color-ink-dim)", minWidth: 28 }}>
              Lv.{state.playerLevel}
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(180,220,250,0.06)" }}>
              <div className="xp-bar-fill h-full rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="text-xs" style={{ color: "var(--color-ink-dim)", minWidth: 28, textAlign: "right" }}>
              {xpPercent}%
            </span>
          </div>
        </div>

        {/* ━━ 相棒カード + あそぶ ━━ */}
        <div className="opacity-0 fade-up fade-up-2">
          <Link href="/game" className="block group">
            <div className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group-active:scale-98"
              style={{
                background: "var(--color-surface-solid)",
                border: companion
                  ? `1px solid rgba(135,206,235,0.18)`
                  : "1px dashed rgba(135,206,235,0.25)",
                boxShadow: "0 4px 32px rgba(0,0,0,0.35)",
              }}>
              {companion ? (
                <>
                  {/* 漢字 */}
                  <div className="flex-none w-[76px] h-[76px] rounded-2xl flex items-center justify-center"
                    style={{
                      background: `rgba(${rd?.tier ?? 1 > 10 ? "240,212,138" : "135,206,235"},0.07)`,
                      border: `1px solid rgba(${rd?.tier ?? 1 > 10 ? "240,212,138" : "135,206,235"},0.15)`,
                    }}>
                    <span
                      className={`font-kanji font-bold${companion.isOriginal ? " kanji-glow-gold" : ""}`}
                      style={{
                        fontSize: 48,
                        lineHeight: 1,
                        color: companion.isOriginal ? "var(--color-gold)" : rd?.color,
                        textShadow: !companion.isOriginal && rd && rd.tier >= 8
                          ? `0 0 16px ${rd.color}66` : undefined,
                      }}>
                      {companion.char}
                    </span>
                  </div>

                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {companion.isOriginal && (
                        <span className="rarity-badge"
                          style={{ color: "var(--color-gold)", borderColor: "rgba(240,212,138,0.3)", background: "rgba(240,212,138,0.08)" }}>
                          ✦ オリジナル
                        </span>
                      )}
                      <span className="rarity-badge"
                        style={{ color: rd?.color, borderColor: `${rd?.color}44`, background: `${rd?.color}0f` }}>
                        {rd?.label}
                      </span>
                    </div>
                    <p className="font-semibold truncate" style={{ color: "var(--color-ink)", fontSize: 15 }}>
                      {companion.name}
                    </p>
                    <p className="text-xs mb-2.5" style={{ color: "var(--color-ink-mute)" }}>
                      Lv.{companion.level}&nbsp;{evo?.name}{evo?.glyph ? ` ${evo.glyph}` : ""}
                    </p>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(180,220,250,0.06)" }}>
                      <div className="xp-bar-fill h-full rounded-full" style={{ width: `${compXpPct}%` }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "var(--color-ink-dim)" }}>
                      {companion.xp} / {xpRequired(companion.level)} XP
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm flex items-center gap-2" style={{ color: "var(--color-ink-mute)" }}>
                  <span style={{ fontSize: 24 }}>＋</span>相棒を選ぼう
                </p>
              )}

              {/* あそぶ CTA */}
              <div className="flex-none flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all group-hover:scale-105"
                  style={{ background: "var(--color-accent)", boxShadow: "0 0 20px rgba(135,206,235,0.4)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-bg-deep)">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>あそぶ</span>
              </div>
            </div>
          </Link>
        </div>

          {/* ━━ 7日連続バナー（条件付き） ━━ */}
          <StreakBanner />

          {/* ━━ デイリークエスト ━━ */}
          <div className="opacity-0 fade-up fade-up-3">
            <DailyQuests quests={quests} />
          </div>

          {/* スマホ: プレミアムバナー */}
          <div className="md:hidden opacity-0 fade-up fade-up-4">
            <PremiumBanner />
          </div>
        </div>{/* /PC左カラム */}

        {/* ━━ PC右カラム ━━ */}
        <div className="desktop-only space-y-4 md:pt-0 sticky top-20">
          {/* 統計カード */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "連続記録", value: `${state.streak}日` },
              { label: "今日", value: `${state.todayPomodoros}回` },
              { label: "総ポモ", value: `${state.totalPomodoros}回` },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center glass-card-solid">
                <p className="text-xs mb-1" style={{ color: "var(--color-ink-dim)" }}>{s.label}</p>
                <p className="font-bold text-sm" style={{ color: "var(--color-ink)" }}>{s.value}</p>
              </div>
            ))}
          </div>
          {/* PC: プレミアムバナー */}
          <PremiumBanner />
        </div>
      </main>

      {showPurchase && (
        <PremiumGateModal onClose={() => setShowPurchase(false)} />
      )}
    </div>
  );
}

function Pill({ icon, value, color, bg, border }: {
  icon: string; value: string; color: string; bg: string; border: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
      style={{ background: bg, border: `1px solid ${border}` }}>
      <span className="text-sm leading-none">{icon}</span>
      <span className="text-xs font-bold" style={{ color, fontFamily: "var(--font-body)" }}>{value}</span>
    </div>
  );
}

// ホーム上部の小さいティーザーバー
function MiniPurchaseTease({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen}
      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left opacity-0 fade-up fade-up-1 transition-all active:scale-98"
      style={{
        background: "rgba(240,212,138,0.05)",
        border: "1px solid rgba(240,212,138,0.14)",
      }}>
      <div className="flex items-center gap-2.5">
        {/* ★16 サンプルグリフ */}
        <span className="font-kanji font-bold text-base"
          style={{ color: "#f0d48a", filter: "blur(1.5px)", textShadow: "0 0 10px rgba(240,212,138,0.6)" }}>
          拾
        </span>
        <span className="text-xs" style={{ color: "var(--color-ink-mute)" }}>
          ★10〜★16 の文字は完全版で解放
        </span>
      </div>
      <span className="text-xs font-bold px-2.5 py-1 rounded-lg flex-none"
        style={{ background: "rgba(240,212,138,0.12)", color: "var(--color-gold)", border: "1px solid rgba(240,212,138,0.22)" }}>
        ¥480
      </span>
    </button>
  );
}
