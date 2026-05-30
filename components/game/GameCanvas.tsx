"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  spawnDrop, updateDrop, isDropOffScreen, hitTestDrop, type DropItem,
} from "@/lib/engine/drops";
import { RARITY, type RarityTier } from "@/lib/engine/codex";
import { expFromCapture } from "@/lib/engine/xp";
import { useGameDispatch, useGameState } from "@/lib/store/GameContext";
import { useSound } from "@/lib/sound/useSound";
import PremiumGateModal from "@/components/modals/PremiumGateModal";

// ★10+ はプレミアムが必要
const PREMIUM_MIN_TIER = 10;

interface Props {
  isRunning: boolean;
  mode: "focus" | "break";
  playerLevel: number;
  companionBond: number;
  onCapture?: (char: string, xpGained: number) => void;
}

interface CaptureFlash {
  id: string;
  x: number; y: number;
  text: string;
  color: string;
  age: number;
}

interface PremiumPrompt {
  char: string;
  rarity: RarityTier;
}

const SPAWN_INTERVAL = 90;

export default function GameCanvas({ isRunning, mode, playerLevel, companionBond, onCapture }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<DropItem[]>([]);
  const flashesRef = useRef<CaptureFlash[]>([]);
  const frameRef = useRef(0);
  const { isPurchased, soundEnabled } = useGameState();
  const isPremium = isPurchased; // alias
  const dispatch = useGameDispatch();
  const sound = useSound(soundEnabled);
  const [premiumPrompt, setPremiumPrompt] = useState<PremiumPrompt | null>(null);

  // リサイズ
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // タップ処理
  const handlePointer = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (let i = dropsRef.current.length - 1; i >= 0; i--) {
      const drop = dropsRef.current[i];
      if (!hitTestDrop(drop, x, y)) continue;

      const tier = RARITY[drop.rarity].tier;

      // ★10+ はプレミアムゲート
      if (tier >= PREMIUM_MIN_TIER && !isPremium) {
        setPremiumPrompt({ char: drop.char, rarity: drop.rarity });
        // ドロップは消えない（再チャレンジできる）
        break;
      }

      // 捕獲
      dropsRef.current[i] = { ...drop, dying: true, dyingProgress: 0 };
      const xpGained = expFromCapture(drop.rarity, companionBond);
      dispatch({ type: "CAPTURE_CHAR", payload: { char: drop.char, rarity: drop.rarity, xpGained } });
      onCapture?.(drop.char, xpGained);

      // サウンド
      if (tier >= 16) sound.mythic(tier);
      else sound.capture(tier);

      // フラッシュ
      flashesRef.current.push({
        id: `f_${Date.now()}`,
        x, y,
        text: `${drop.char} +${xpGained}XP`,
        color: RARITY[drop.rarity].color,
        age: 0,
      });
      break;
    }
  }, [companionBond, dispatch, isPremium, onCapture, sound]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    handlePointer(t.clientX, t.clientY);
  }, [handlePointer]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handlePointer(e.clientX, e.clientY);
  }, [handlePointer]);

  // アニメーションループ
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    let animId: number;

    function loop() {
      const ctx = canvas!.getContext("2d");
      if (!ctx) return;
      const W = canvas!.width / dpr;
      const H = canvas!.height / dpr;
      frameRef.current++;

      if (isRunning && mode === "focus" && frameRef.current % SPAWN_INTERVAL === 0) {
        dropsRef.current.push(spawnDrop(W, playerLevel));
      }

      dropsRef.current = dropsRef.current
        .map(d => updateDrop(d, H, 1))
        .filter(d => !isDropOffScreen(d, H));

      flashesRef.current = flashesRef.current
        .map(f => ({ ...f, age: f.age + 1 }))
        .filter(f => f.age < 40);

      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 休憩: 泡
      if (mode === "break" && isRunning) {
        const t = frameRef.current;
        for (let i = 0; i < 6; i++) {
          const phase = (t * 0.007 + i * 1.05) % (Math.PI * 2);
          const bx = (0.08 + i * 0.17) * W + Math.sin(phase * 2.5) * 18;
          const by = H - ((t * 0.35 + i * 55) % (H + 70));
          const br = 5 + (i % 3) * 4;
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(135,206,235,0.22)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // 文字描画（★10+ はシルエット）
      renderDropsWithPremium(ctx, dropsRef.current, isPremium);

      // フラッシュ
      for (const f of flashesRef.current) {
        const alpha = 1 - f.age / 40;
        ctx.globalAlpha = alpha;
        ctx.font = "bold 13px 'Zen Kaku Gothic New', sans-serif";
        ctx.fillStyle = f.color;
        ctx.textAlign = "center";
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 8;
        ctx.fillText(f.text, f.x, f.y - f.age * 1.1);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isRunning, mode, playerLevel, isPremium]);

  return (
    <>
      <canvas ref={canvasRef}
        className="w-full h-full touch-none"
        style={{ display: "block", cursor: isRunning ? "crosshair" : "default" }}
        onTouchStart={onTouchStart}
        onMouseDown={onMouseDown}
      />

      {premiumPrompt && (
        <PremiumGateModal
          triggeredChar={premiumPrompt.char}
          triggeredRarity={premiumPrompt.rarity}
          onClose={() => setPremiumPrompt(null)}
        />
      )}
    </>
  );
}

// ctx.filter サポートチェック（Safari 古バージョン等への対応）
const _supportsCtxFilter = (() => {
  try {
    const c = document.createElement("canvas");
    const g = c.getContext("2d");
    if (!g) return false;
    g.filter = "blur(1px)";
    return g.filter === "blur(1px)";
  } catch { return false; }
})();

// ★10+ 非プレミアム: シルエット + ロックアイコン描画
function renderDropsWithPremium(
  ctx: CanvasRenderingContext2D,
  drops: DropItem[],
  isPremium: boolean
): void {
  ctx.save();
  for (const drop of drops) {
    const tier = RARITY[drop.rarity].tier;
    const isLocked = tier >= PREMIUM_MIN_TIER && !isPremium;

    if (drop.dying) {
      const p = drop.dyingProgress;
      const alpha = 1 - p;
      if (alpha <= 0) continue;
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${Math.floor(drop.size * (1 + p * 0.5))}px 'Shippori Mincho B1', serif`;
      ctx.fillStyle = RARITY[drop.rarity].color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = RARITY[drop.rarity].color;
      ctx.shadowBlur = 20 * (1 - p);
      ctx.fillText(drop.char, drop.x, drop.y - p * 45);
    } else if (isLocked) {
      // シルエット: ぼかし + 金フレーム + ロックマーク
      ctx.globalAlpha = 0.75;
      ctx.font = `bold ${drop.size}px 'Shippori Mincho B1', serif`;
      ctx.fillStyle = RARITY[drop.rarity].color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = RARITY[drop.rarity].color;
      ctx.shadowBlur = 12;
      if (_supportsCtxFilter) ctx.filter = "blur(2px)";
      ctx.fillText(drop.char, drop.x, drop.y);
      if (_supportsCtxFilter) ctx.filter = "none";
      // 輝くロックマーク
      ctx.globalAlpha = 0.9;
      ctx.font = `bold ${Math.floor(drop.size * 0.38)}px 'Zen Kaku Gothic New', sans-serif`;
      ctx.fillStyle = "#f0d48a";
      ctx.shadowColor = "rgba(240,212,138,0.8)";
      ctx.shadowBlur = 10;
      ctx.fillText("✦", drop.x, drop.y - drop.size * 0.55);
    } else {
      ctx.globalAlpha = 1;
      ctx.font = `bold ${drop.size}px 'Shippori Mincho B1', serif`;
      ctx.fillStyle = RARITY[drop.rarity].color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (tier >= 6) {
        ctx.shadowColor = RARITY[drop.rarity].color;
        ctx.shadowBlur = 4 + tier * 1.5;
      } else {
        ctx.shadowBlur = 0;
      }
      if (tier >= 16) {
        const hue = (drop.age * 3) % 360;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 30;
        ctx.globalAlpha = 0.35;
        ctx.fillText(drop.char, drop.x, drop.y);
        ctx.globalAlpha = 1;
      }
      ctx.fillText(drop.char, drop.x, drop.y);
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    if (_supportsCtxFilter) ctx.filter = "none";
  }
  ctx.restore();
}
