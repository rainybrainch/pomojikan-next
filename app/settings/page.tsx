"use client";

import { useState } from "react";
import { useGameState, useGameDispatch } from "@/lib/store/GameContext";
import { getEvoStage } from "@/lib/engine/codex";
import { xpRequired } from "@/lib/engine/xp";
import PremiumGateModal from "@/components/modals/PremiumGateModal";

export default function SettingsPage() {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const companion = state.party[0];
  const evo = companion ? getEvoStage(companion.level) : null;
  const [showPurchase, setShowPurchase] = useState(false);

  const setSetting = (patch: Partial<Pick<typeof state, "focusMinutes" | "breakMinutes" | "soundEnabled">>) => {
    dispatch({ type: "SET_SETTING", payload: patch });
  };

  return (
    <div className="flex flex-col max-w-xl md:ml-[72px] md:mx-auto px-4 md:px-8 py-6 pb-28 md:pb-8 gap-6">
      {/* プロフィール */}
      <section>
        <SectionTitle>プロフィール</SectionTitle>
        <div className="rounded-2xl p-5" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center gap-4">
            {companion && (
              <span className="font-kanji text-4xl font-bold" style={{ color: "var(--color-gold)", textShadow: "0 0 20px rgba(212,168,67,0.6)" }}>
                {companion.char}
              </span>
            )}
            <div className="flex-1">
              <p className="font-bold" style={{ color: "var(--color-text)" }}>{state.playerName || "---"}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Lv.{state.playerLevel} / XP {state.playerXp}/{xpRequired(state.playerLevel)}
              </p>
              {evo && (
                <p className="text-xs mt-0.5" style={{ color: "var(--color-gold)" }}>
                  {evo.glyph} {evo.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "連続記録", value: `${state.streak}日` },
              { label: "総ポモ", value: `${state.totalPomodoros}回` },
              { label: "図鑑", value: `${state.inventory.length}種` },
            ].map(stat => (
              <div key={stat.label} className="text-center p-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{stat.label}</p>
                <p className="font-bold" style={{ color: "var(--color-text)" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* タイマー設定 */}
      <section>
        <SectionTitle>タイマー設定</SectionTitle>
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <SliderRow
            label="集中時間"
            value={state.focusMinutes}
            min={5} max={60} step={5}
            unit="分"
            onChange={v => setSetting({ focusMinutes: v })}
          />
          <SliderRow
            label="休憩時間"
            value={state.breakMinutes}
            min={1} max={30} step={1}
            unit="分"
            onChange={v => setSetting({ breakMinutes: v })}
          />
        </div>
      </section>

      {/* サウンド */}
      <section>
        <SectionTitle>サウンド</SectionTitle>
        <div className="rounded-2xl p-5" style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>効果音</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>捕獲音・レベルアップ音</p>
            </div>
            <button
              onClick={() => setSetting({ soundEnabled: !state.soundEnabled })}
              className="relative w-12 h-6 rounded-full transition-all"
              style={{ background: state.soundEnabled ? "var(--color-rain)" : "rgba(255,255,255,0.1)" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                style={{
                  background: "#fff",
                  left: state.soundEnabled ? "calc(100% - 22px)" : "2px",
                }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 完全版 / 購入セクション */}
      <section>
        <SectionTitle>完全版</SectionTitle>
        {state.isPurchased ? (
          <div className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: "rgba(240,212,138,0.06)", border: "1px solid rgba(240,212,138,0.2)" }}>
            <span className="font-kanji font-bold text-3xl" style={{ color: "var(--color-gold)" }}>✦</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-gold)" }}>
                完全版 購入済み
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-mute)" }}>
                ★1〜★16 全文字・全機能が使えます
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(240,212,138,0.18)" }}>
            <div className="p-4 flex items-center justify-between"
              style={{ background: "rgba(240,212,138,0.06)" }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--color-ink)" }}>
                  ぽもじかん 完全版
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-mute)" }}>
                  ★10〜★16・書体全段階・熟語合成
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg" style={{ color: "var(--color-gold)" }}>¥480</span>
                <p className="text-xs" style={{ color: "var(--color-ink-dim)" }}>買い切り</p>
              </div>
            </div>
            <button onClick={() => setShowPurchase(true)}
              className="w-full py-3.5 text-sm font-bold btn-gold">
              完全版を購入する
            </button>
            <button className="w-full py-2.5 text-xs"
              style={{ background: "rgba(0,0,0,0.1)", color: "var(--color-ink-dim)" }}>
              購入を復元する
            </button>
          </div>
        )}
      </section>

      {/* アプリ情報 */}
      <section>
        <SectionTitle>アプリ情報</SectionTitle>
        <div className="rounded-2xl p-5 space-y-2" style={{ background: "var(--color-surface-solid)", border: "1px solid var(--color-line)" }}>
          {[
            ["バージョン", "v0.1.0"],
            ["コンセプト", "スマホ時間を、育つ時間に。"],
            ["図鑑", `${state.inventory.length}種 捕獲済み`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span style={{ color: "var(--color-ink-dim)" }}>{label}</span>
              <span style={{ color: "var(--color-ink-mute)" }}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {showPurchase && <PremiumGateModal onClose={() => setShowPurchase(false)} />}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-bold tracking-widest mb-2 px-1" style={{ color: "var(--color-ink-dim)" }}>
      {children}
    </h2>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: "var(--color-text)" }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: "var(--color-rain)" }}>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: "var(--color-rain)", background: "rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}
