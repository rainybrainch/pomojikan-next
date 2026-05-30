"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TimerMode } from "@/lib/types";
import { useGameDispatch, useGameState } from "@/lib/store/GameContext";

interface Props {
  onModeChange?: (mode: TimerMode, isRunning: boolean) => void;
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60).toString().padStart(2,"0")}:${(sec % 60).toString().padStart(2,"0")}`;
}

export default function PomodoroController({ onModeChange }: Props) {
  const { focusMinutes, breakMinutes } = useGameState();
  const dispatch = useGameDispatch();
  const [mode, setMode] = useState<TimerMode>("focus");
  const [remaining, setRemaining] = useState(focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const doneRef = useRef(false);

  const total = mode === "focus" ? focusMinutes * 60 : breakMinutes * 60;

  const switchMode = useCallback((m: TimerMode) => {
    setMode(m);
    setRunning(false);
    setRemaining(m === "focus" ? focusMinutes * 60 : breakMinutes * 60);
    doneRef.current = false;
    onModeChange?.(m, false);
  }, [focusMinutes, breakMinutes, onModeChange]);

  const toggle = useCallback(() => {
    setRunning(r => { const n = !r; onModeChange?.(mode, n); return n; });
  }, [mode, onModeChange]);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(total);
    doneRef.current = false;
    onModeChange?.(mode, false);
  }, [total, mode, onModeChange]);

  useEffect(() => {
    if (!running) return;
    let switchTimer: ReturnType<typeof setTimeout> | null = null;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          if (!doneRef.current) {
            doneRef.current = true;
            dispatch({ type: "POMODORO_COMPLETE", payload: { mode } });
            const next: TimerMode = mode === "focus" ? "break" : "focus";
            switchTimer = setTimeout(() => switchMode(next), 800);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
      if (switchTimer) clearTimeout(switchTimer);
    };
  }, [running, mode, dispatch, switchMode]);

  const progress = 1 - remaining / total;
  const R = 58;
  const circ = 2 * Math.PI * R;
  const dash = circ * (1 - progress);
  const isFocus = mode === "focus";

  const accentColor = isFocus ? "var(--color-accent)" : "#6ee7b7";
  const glowColor   = isFocus ? "rgba(135,206,235,0.4)" : "rgba(110,231,183,0.4)";
  const trackColor  = isFocus ? "rgba(135,206,235,0.08)" : "rgba(110,231,183,0.08)";

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 glass-card-solid h-full"
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.35)" }}>

      {/* モード切替 */}
      <div className="flex rounded-xl overflow-hidden"
        style={{ background: "rgba(180,220,250,0.04)", border: "1px solid var(--color-line)" }}>
        {(["focus", "break"] as TimerMode[]).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            className="flex-1 py-2 text-xs font-medium transition-all duration-200"
            style={{
              background: mode === m ? accentColor : "transparent",
              color: mode === m ? "var(--color-bg-deep)" : "var(--color-ink-dim)",
              fontFamily: "var(--font-body)",
            }}>
            {m === "focus" ? "集中" : "休憩"}
          </button>
        ))}
      </div>

      {/* 円形タイマー */}
      <div className="flex items-center justify-center flex-1 py-1">
        <div className="relative">
          <svg width="152" height="152" viewBox="0 0 152 152">
            {/* トラック */}
            <circle cx="76" cy="76" r={R} fill="none" stroke={trackColor} strokeWidth="7" />
            {/* プログレス */}
            <circle cx="76" cy="76" r={R} fill="none"
              stroke={accentColor} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={dash}
              transform="rotate(-90 76 76)"
              style={{
                transition: running ? "stroke-dashoffset 1s linear" : "none",
                filter: `drop-shadow(0 0 6px ${glowColor})`,
              }} />
          </svg>

          {/* 時間テキスト */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-bold tabular-nums"
              style={{ color: "var(--color-ink)", letterSpacing: "-0.02em" }}>
              {fmt(remaining)}
            </span>
            <span className="text-xs mt-0.5" style={{ color: "var(--color-ink-dim)", fontFamily: "var(--font-body)" }}>
              {isFocus ? "集中" : "休憩"}
            </span>
            {running && isFocus && (
              <span className="text-xs mt-1 font-semibold animate-pulse"
                style={{ color: accentColor, fontFamily: "var(--font-body)" }}>
                ✦ 字が降る
              </span>
            )}
          </div>
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center justify-center gap-5">
        {/* リセット */}
        <button onClick={reset} aria-label="リセット"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(180,220,250,0.05)", border: "1px solid var(--color-line)", color: "var(--color-ink-dim)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
          </svg>
        </button>

        {/* 再生/停止 */}
        <button onClick={toggle} aria-label={running ? "停止" : "開始"}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-93"
          style={{
            background: accentColor,
            color: "var(--color-bg-deep)",
            boxShadow: `0 0 28px ${glowColor}, 0 4px 16px rgba(0,0,0,0.4)`,
          }}>
          {running
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
          }
        </button>

        {/* スキップ */}
        <button onClick={() => switchMode(mode === "focus" ? "break" : "focus")} aria-label="スキップ"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: "rgba(180,220,250,0.05)", border: "1px solid var(--color-line)", color: "var(--color-ink-dim)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* ヒント */}
      <p className="text-center text-xs" style={{ color: "var(--color-ink-dim)", fontFamily: "var(--font-body)" }}>
        {isFocus ? "集中中は字が降ってくる ✦" : "休憩中は泡が浮かんで消える ○"}
      </p>
    </div>
  );
}
