"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGameDispatch } from "@/lib/store/GameContext";
import { getKanjiEntry } from "@/lib/engine/codex";
import type { PomojiFriend } from "@/lib/store/types";

type Step = "splash" | "welcome" | "name" | "char" | "naming" | "confirm";

const STARTER_KANJI = [
  "心", "愛", "夢", "光", "星", "海", "山", "雨",
  "花", "風", "月", "空", "水", "火", "木", "道",
  "静", "動", "力", "志", "魂", "音", "詩", "時",
];

const BG_CHARS = ["字","文","語","書","詩","歌","道","心","光","雨","月","星","夢","命","魂","風"];

function genId() { return `orig_${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }

/* 背景に浮かぶ薄い漢字群 */
function BackgroundGlyphs() {
  const glyphs = useRef<{ c: string; x: number; y: number; size: number; dur: number; delay: number }[]>([]);
  if (glyphs.current.length === 0) {
    for (let i = 0; i < 18; i++) {
      glyphs.current.push({
        c: BG_CHARS[i % BG_CHARS.length],
        x: 4 + Math.random() * 92,
        y: Math.random() * 100,
        size: 32 + Math.random() * 48,
        dur: 8 + Math.random() * 12,
        delay: Math.random() * -15,
      });
    }
  }
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {glyphs.current.map((g, i) => (
        <span key={i}
          className="absolute font-kanji select-none"
          style={{
            left: `${g.x}%`,
            top: `${g.y}%`,
            fontSize: g.size,
            color: "rgba(135,206,235,0.04)",
            fontWeight: 700,
            animation: `rain-fall ${g.dur}s ${g.delay}s linear infinite`,
          }}>
          {g.c}
        </span>
      ))}
    </div>
  );
}

/* ステッパー */
function Stepper({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            background: i === current
              ? "var(--color-accent)"
              : i < current
                ? "rgba(135,206,235,0.4)"
                : "rgba(135,206,235,0.12)",
          }} />
      ))}
    </div>
  );
}

export default function OnboardingFlow() {
  const dispatch = useGameDispatch();
  const [step, setStep] = useState<Step>("splash");
  const [playerName, setPlayerName] = useState("");
  const [selectedChar, setSelectedChar] = useState("");
  const [customChar, setCustomChar] = useState("");
  const [friendName, setFriendName] = useState("");

  const finalChar = selectedChar || customChar;

  // スプラッシュ → ウェルカム 自動遷移
  useEffect(() => {
    if (step !== "splash") return;
    const t = setTimeout(() => setStep("welcome"), 2400);
    return () => clearTimeout(t);
  }, [step]);

  const complete = useCallback(() => {
    const entry = getKanjiEntry(finalChar);
    const rarity = entry?.rarity ?? "★6";
    const friend: PomojiFriend = {
      id: genId(), char: finalChar, rarity,
      name: friendName || finalChar,
      level: 1, xp: 0, bondCount: 0,
      isOriginal: true,
      tags: entry?.tags ?? [],
      capturedAt: Date.now(),
    };
    dispatch({ type: "COMPLETE_ONBOARDING", payload: { playerName, originalFriend: friend } });
  }, [dispatch, playerName, finalChar, friendName]);

  const stepIndex = ["welcome","name","char","naming","confirm"].indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "var(--color-bg-deep)" }}>

      <BackgroundGlyphs />

      {/* ━━ スプラッシュ ━━ */}
      {step === "splash" && (
        <div className="relative flex flex-col items-center gap-6 fade-up">
          <div className="relative">
            <span className="font-kanji font-bold select-none"
              style={{ fontSize: 100, color: "var(--color-accent)", textShadow: "0 0 60px rgba(135,206,235,0.5)", lineHeight: 1 }}>
              字
            </span>
            {/* リング */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="rounded-full" style={{
                width: 130, height: 130,
                border: "1px solid rgba(135,206,235,0.15)",
                animation: "gold-pulse 3s ease-in-out infinite",
              }} />
            </div>
          </div>
          <div className="text-center">
            <p className="font-kanji font-semibold text-2xl tracking-widest" style={{ color: "var(--color-ink)" }}>
              ぽもじかん
            </p>
            <p className="text-sm tracking-wider mt-1" style={{ color: "var(--color-ink-mute)" }}>
              スマホ時間を、育つ時間に。
            </p>
          </div>
        </div>
      )}

      {/* ━━ メインコンテナ ━━ */}
      {step !== "splash" && (
        <div className="relative z-10 w-full max-w-sm px-6 flex flex-col gap-6">

          {/* ステッパー */}
          {stepIndex >= 0 && (
            <div className="flex justify-center fade-up">
              <Stepper current={stepIndex} total={4} />
            </div>
          )}

          {/* ━━ WELCOME ━━ */}
          {step === "welcome" && (
            <div className="flex flex-col gap-7 fade-up">
              {/* ロゴ */}
              <div className="text-center">
                <span className="font-kanji font-bold"
                  style={{ fontSize: 64, lineHeight: 1, color: "var(--color-accent)", textShadow: "0 0 40px rgba(135,206,235,0.45)" }}>
                  字
                </span>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  <span className="font-kanji text-2xl font-bold" style={{ color: "var(--color-accent)" }}>ぽも</span>
                  <span className="font-kanji text-2xl font-bold" style={{ color: "var(--color-ink)" }}>じかん</span>
                </div>
              </div>

              {/* コピー */}
              <div className="text-center">
                <p className="font-kanji text-lg font-semibold leading-relaxed" style={{ color: "var(--color-ink)" }}>
                  スマホ時間を、<br />育つ時間に。
                </p>
                <p className="text-sm leading-relaxed mt-2" style={{ color: "var(--color-ink-mute)" }}>
                  ポモドーロタイマーが動く間、<br />
                  漢字が空から降ってきます。<br />
                  捕まえて、育てて、進化させよう。
                </p>
              </div>

              {/* 3フィーチャー */}
              <div className="rounded-2xl p-4 space-y-3 glass-card-solid">
                {[
                  { icon: "🍅", title: "集中と休憩", desc: "タイマー中に字が降ってくる" },
                  { icon: "✦",  title: "文字を育てる", desc: "Lv が上がると書体が進化" },
                  { icon: "📖", title: "文字の博物館", desc: "★16 レアリティ・20,000字" },
                ].map(f => (
                  <div key={f.title} className="flex items-center gap-3">
                    <span className="text-xl w-7 text-center">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>{f.title}</p>
                      <p className="text-xs" style={{ color: "var(--color-ink-mute)" }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep("name")}
                className="w-full py-4 rounded-2xl text-base btn-primary"
                style={{ borderRadius: 16 }}>
                はじめる
              </button>
            </div>
          )}

          {/* ━━ NAME ━━ */}
          {step === "name" && (
            <div className="flex flex-col gap-6 fade-up">
              <div className="text-center">
                <p className="text-xs tracking-widest mb-1" style={{ color: "var(--color-ink-dim)" }}>あなたの名前</p>
                <h2 className="font-kanji text-xl font-semibold" style={{ color: "var(--color-ink)" }}>
                  名前を教えてください
                </h2>
              </div>

              <input type="text" value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="例：ふくろう"
                maxLength={16}
                className="w-full px-5 py-4 rounded-2xl text-base"
                style={{ borderRadius: 14 }}
              />

              <button onClick={() => setStep("char")} disabled={!playerName.trim()}
                className="w-full py-4 rounded-2xl text-base btn-primary disabled:opacity-30"
                style={{ borderRadius: 14 }}>
                次へ →
              </button>

              <button onClick={() => setStep("welcome")}
                className="text-center text-sm" style={{ color: "var(--color-ink-dim)" }}>
                ← 戻る
              </button>
            </div>
          )}

          {/* ━━ CHAR SELECTION ━━ */}
          {step === "char" && (
            <div className="flex flex-col gap-5 fade-up">
              <div className="text-center">
                <p className="text-xs tracking-widest mb-1" style={{ color: "var(--color-ink-dim)" }}>最初の一字</p>
                <h2 className="font-kanji text-xl font-semibold" style={{ color: "var(--color-ink)" }}>
                  あなたの字を選ぼう
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--color-ink-mute)" }}>
                  これがあなただけの専用ぽもじになります
                </p>
              </div>

              {/* グリッド */}
              <div className="grid grid-cols-6 gap-2">
                {STARTER_KANJI.map(k => {
                  const active = selectedChar === k;
                  return (
                    <button key={k} onClick={() => { setSelectedChar(k); setCustomChar(""); }}
                      className="aspect-square rounded-xl flex items-center justify-center font-kanji text-xl font-semibold transition-all active:scale-90"
                      style={{
                        background: active ? "rgba(135,206,235,0.18)" : "var(--color-surface-solid)",
                        border: `1.5px solid ${active ? "var(--color-accent)" : "var(--color-line)"}`,
                        color: active ? "var(--color-accent)" : "var(--color-ink-mute)",
                        boxShadow: active ? "0 0 14px rgba(135,206,235,0.25)" : "none",
                      }}>
                      {k}
                    </button>
                  );
                })}
              </div>

              {/* 区切り */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "var(--color-line)" }} />
                <span className="text-xs" style={{ color: "var(--color-ink-dim)" }}>または1字入力</span>
                <div className="flex-1 h-px" style={{ background: "var(--color-line)" }} />
              </div>

              <input type="text" value={customChar}
                onChange={e => { const v = e.target.value.slice(-1); setCustomChar(v); if (v) setSelectedChar(""); }}
                placeholder="好きな一字"
                maxLength={2}
                className="w-full px-4 py-3 rounded-xl text-center text-2xl font-kanji font-bold"
                style={{ borderRadius: 12, border: `1.5px solid ${customChar ? "var(--color-accent)" : "var(--color-line)"}` }}
              />

              {/* プレビュー */}
              {finalChar && (
                <div className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{ background: "rgba(135,206,235,0.07)", border: "1px solid rgba(135,206,235,0.2)", borderRadius: 16 }}>
                  <span className="font-kanji text-5xl font-bold"
                    style={{ color: "var(--color-accent)", textShadow: "0 0 24px rgba(135,206,235,0.5)", lineHeight: 1 }}>
                    {finalChar}
                  </span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--color-ink)" }}>「{finalChar}」を選択中</p>
                    <p className="text-xs" style={{ color: "var(--color-ink-mute)" }}>唯一無二の相棒になります</p>
                  </div>
                </div>
              )}

              <button onClick={() => setStep("naming")} disabled={!finalChar}
                className="w-full py-4 rounded-2xl text-base btn-primary disabled:opacity-30"
                style={{ borderRadius: 14 }}>
                この字を選ぶ
              </button>
              <button onClick={() => setStep("name")}
                className="text-center text-sm" style={{ color: "var(--color-ink-dim)" }}>
                ← 戻る
              </button>
            </div>
          )}

          {/* ━━ NAMING ━━ */}
          {step === "naming" && (
            <div className="flex flex-col gap-6 fade-up">
              <div className="text-center">
                <p className="text-xs tracking-widest mb-1" style={{ color: "var(--color-ink-dim)" }}>相棒に名前を</p>
                <h2 className="font-kanji text-xl font-semibold" style={{ color: "var(--color-ink)" }}>
                  名前を付けましょう
                </h2>
              </div>

              {/* 相棒プレビュー */}
              <div className="flex flex-col items-center gap-3 py-6 rounded-2xl glass-card-solid"
                style={{ border: "1px solid rgba(240,212,138,0.25)" }}>
                <span className="font-kanji font-bold kanji-glow-gold"
                  style={{ fontSize: 80, lineHeight: 1, color: "var(--color-gold)" }}>
                  {finalChar}
                </span>
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: "var(--color-gold)" }}>✦ オリジナル</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-mute)" }}>
                    {friendName || "（名前を入力してください）"}
                  </p>
                </div>
              </div>

              <input type="text" value={friendName}
                onChange={e => setFriendName(e.target.value)}
                placeholder={`例：${finalChar}の精霊`}
                maxLength={20}
                className="w-full px-5 py-4 rounded-2xl text-base"
                style={{ borderRadius: 14, border: "1.5px solid rgba(240,212,138,0.4)" }}
              />

              <button onClick={() => setStep("confirm")}
                className="w-full py-4 rounded-2xl text-base btn-gold"
                style={{ borderRadius: 14 }}>
                {friendName ? `「${friendName}」に決める` : "名前なしで始める"}
              </button>
              <button onClick={() => setStep("char")}
                className="text-center text-sm" style={{ color: "var(--color-ink-dim)" }}>
                ← 戻る
              </button>
            </div>
          )}

          {/* ━━ CONFIRM ━━ */}
          {step === "confirm" && (
            <div className="flex flex-col gap-6 fade-up text-center">
              <div>
                <p className="text-xs tracking-widest mb-1" style={{ color: "var(--color-ink-dim)" }}>準備完了</p>
                <h2 className="font-kanji text-2xl font-semibold" style={{ color: "var(--color-ink)" }}>
                  旅が始まる
                </h2>
              </div>

              <div className="py-7 rounded-2xl flex flex-col items-center gap-4 glass-card-solid"
                style={{ border: "1px solid rgba(240,212,138,0.3)" }}>
                <span className="font-kanji font-bold kanji-glow-gold"
                  style={{ fontSize: 88, lineHeight: 1, color: "var(--color-gold)" }}>
                  {finalChar}
                </span>
                <div>
                  <p className="font-kanji font-semibold text-lg" style={{ color: "var(--color-ink)" }}>
                    {friendName || finalChar}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-gold)" }}>
                    ✦ オリジナル ／ Lv.1 楷書
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-mute)" }}>
                {playerName}さん、{friendName || finalChar}と一緒に<br />
                文字の世界を探索しましょう。
              </p>

              <button onClick={complete}
                className="w-full py-4 rounded-2xl text-base font-bold btn-gold tracking-wide"
                style={{ borderRadius: 16 }}>
                ぽもじかんをはじめる ✦
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
