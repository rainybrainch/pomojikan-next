"use client";

import { useCallback, useRef } from "react";

// Web Audio API を使った軽量サウンドエンジン
// 外部ファイル不要・インライン生成

let _ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  gainPeak = 0.3,
  fadeStart = 0.05
) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + fadeStart);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // AudioContext not available (SSR etc.)
  }
}

// 捕獲音（ポン）
function playCaptureSound(tier: number) {
  const baseFreq = 440 + tier * 40;
  playTone(baseFreq, 0.18, "sine", 0.25);
  setTimeout(() => playTone(baseFreq * 1.25, 0.12, "sine", 0.15), 60);
}

// レベルアップチャイム（3音上昇）
function playLevelUpSound() {
  const notes = [523, 659, 784];  // C5 E5 G5
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.35, "sine", 0.3), i * 120);
  });
}

// 書体進化ファンファーレ（荘厳チャイム）
function playEvoSound() {
  const notes = [392, 523, 659, 784, 1047];  // G4 C5 E5 G5 C6
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.6, "sine", 0.28, 0.08), i * 180);
  });
  setTimeout(() => playTone(784, 1.5, "triangle", 0.2, 0.1), 900);
}

// ★16 神字捕獲音（荘厳・低速）
function playMythicSound() {
  playTone(196, 1.0, "triangle", 0.4, 0.15);  // G3
  setTimeout(() => playTone(294, 0.8, "sine", 0.3, 0.1), 300);   // D4
  setTimeout(() => playTone(392, 1.2, "sine", 0.35, 0.12), 600);  // G4
}

// プレミアム解放の歓喜音
function playPremiumSound() {
  [523, 659, 784, 1047, 1319].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.5, "sine", 0.25, 0.06), i * 100);
  });
}

// React hook
export function useSound(enabled: boolean) {
  return {
    capture: useCallback((tier: number) => {
      if (!enabled) return;
      playCaptureSound(tier);
    }, [enabled]),

    levelUp: useCallback(() => {
      if (!enabled) return;
      playLevelUpSound();
    }, [enabled]),

    evo: useCallback(() => {
      if (!enabled) return;
      playEvoSound();
    }, [enabled]),

    mythic: useCallback((tier: number) => {
      if (!enabled) return;
      if (tier >= 16) playMythicSound();
      else playCaptureSound(tier);
    }, [enabled]),

    premium: useCallback(() => {
      if (!enabled) return;
      playPremiumSound();
    }, [enabled]),
  };
}
