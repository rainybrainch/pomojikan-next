"use client";

import { useState, useEffect, useCallback } from "react";
import type { TimerMode } from "@/lib/types";

const FOCUS_SEC = 25 * 60;
const BREAK_SEC = 5 * 60;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [total, setTotal] = useState(FOCUS_SEC);
  const [remaining, setRemaining] = useState(FOCUS_SEC);
  const [isRunning, setIsRunning] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    if (remaining <= 0) {
      // 完了 → 逆モードへ自動切替
      const nextMode: TimerMode = mode === "focus" ? "break" : "focus";
      const nextSec = nextMode === "focus" ? FOCUS_SEC : BREAK_SEC;
      setMode(nextMode);
      setTotal(nextSec);
      setRemaining(nextSec);
      setIsRunning(false);
      setJustCompleted(true);
      setTimeout(() => setJustCompleted(false), 2000);
      return;
    }
    const id = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, remaining, mode]);

  const switchMode = useCallback((m: TimerMode) => {
    setMode(m);
    setIsRunning(false);
    const t = m === "focus" ? FOCUS_SEC : BREAK_SEC;
    setTotal(t);
    setRemaining(t);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(total);
  }, [total]);

  const progress = 1 - remaining / total;
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * (1 - progress);

  const isFocus = mode === "focus";
  const accentColor = isFocus ? "var(--color-rain)" : "var(--color-sage)";
  const trackColor = isFocus ? "rgba(74,158,255,0.12)" : "rgba(52,211,153,0.12)";

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 h-full"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* モード切り替え */}
      <div
        className="flex rounded-xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)" }}
      >
        {(["focus", "break"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className="flex-1 py-1.5 text-xs font-medium transition-all"
            style={{
              background: mode === m ? accentColor : "transparent",
              color: mode === m ? "#fff" : "var(--color-text-muted)",
            }}
          >
            {m === "focus" ? "集中" : "休憩"}
          </button>
        ))}
      </div>

      {/* 円形タイマー */}
      <div className="flex items-center justify-center flex-1 py-2">
        <div className="relative">
          <svg width="136" height="136" viewBox="0 0 136 136">
            {/* track */}
            <circle
              cx="68" cy="68" r={r}
              fill="none"
              stroke={trackColor}
              strokeWidth="6"
            />
            {/* progress */}
            <circle
              cx="68" cy="68" r={r}
              fill="none"
              stroke={accentColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dash}
              transform="rotate(-90 68 68)"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          {/* 時間表示 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold tabular-nums tracking-tight"
              style={{ color: "var(--color-text)", fontVariantNumeric: "tabular-nums" }}
            >
              {formatTime(remaining)}
            </span>
            <span className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {isFocus ? "集中中" : "休憩中"}
            </span>
          </div>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center justify-center gap-4">
        {/* リセット */}
        <button
          onClick={reset}
          aria-label="リセット"
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
          </svg>
        </button>

        {/* 再生/停止 */}
        <button
          onClick={() => setIsRunning((r) => !r)}
          className="w-14 h-14 flex items-center justify-center rounded-full font-bold text-sm transition-all active:scale-95"
          style={{
            background: accentColor,
            color: "#fff",
            boxShadow: `0 0 20px ${isFocus ? "rgba(74,158,255,0.4)" : "rgba(52,211,153,0.4)"}`,
          }}
        >
          {isRunning ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* スキップ */}
        <button
          onClick={() => switchMode(mode === "focus" ? "break" : "focus")}
          aria-label="スキップ"
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--color-text-muted)", background: "rgba(255,255,255,0.04)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* ヒント / 完了フラッシュ */}
      <p className="text-center text-xs transition-colors" style={{
        color: justCompleted ? "var(--color-rain)" : "var(--color-text-muted)",
        fontWeight: justCompleted ? 600 : 400,
      }}>
        {justCompleted
          ? (isFocus ? "休憩へ ○" : "集中再開 ✦")
          : isFocus
            ? "集中中は文字が降ってくる ✦"
            : "休憩中は泡が浮かんで消える ○"}
      </p>
    </div>
  );
}
