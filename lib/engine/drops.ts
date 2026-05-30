import { RARITY, type RarityTier, pickDropChar, getDropPool } from "./codex";
import { dropFontSize, GRAVITY_BASE, MAX_FALL_VY, TIER_FALL_MUL } from "./xp";

export interface DropItem {
  id: string;
  char: string;
  rarity: RarityTier;
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  color: string;
  glowColor: string;
  opacity: number;
  captured: boolean;
  dying: boolean;
  dyingProgress: number; // 0→1 捕獲アニメ進行
  age: number;           // フレーム数
  swayPhase: number;     // 横揺れ位相
}

let _dropIdCounter = 0;
function nextId() {
  return `d_${++_dropIdCounter}_${Date.now()}`;
}

// 新しい落下アイテムを生成
export function spawnDrop(
  canvasWidth: number,
  playerLv: number
): DropItem {
  const pool = getDropPool(playerLv);
  const entry = pickDropChar(pool, playerLv);
  const r = RARITY[entry.rarity];
  const tier = r.tier;
  const size = dropFontSize(tier);
  const fallMul = TIER_FALL_MUL[tier - 1] ?? 1.0;

  // 高レア: 荘厳に遅く落ちる
  const vyBase = GRAVITY_BASE * 15 * fallMul;

  // グロー色（高レアほど派手）
  const glowColor = tier >= 15 ? "rgba(240,212,138,0.9)"
    : tier >= 12 ? "rgba(236,193,212,0.7)"
    : tier >= 9  ? "rgba(155,122,208,0.6)"
    : tier >= 6  ? "rgba(106,130,200,0.4)"
    : "rgba(154,168,181,0.2)";

  return {
    id: nextId(),
    char: entry.c,
    rarity: entry.rarity,
    x: size / 2 + Math.random() * (canvasWidth - size),
    y: -size,
    vy: vyBase,
    vx: 0,
    size,
    color: r.color,
    glowColor,
    opacity: 1,
    captured: false,
    dying: false,
    dyingProgress: 0,
    age: 0,
    swayPhase: Math.random() * Math.PI * 2,
  };
}

// 1フレーム更新
export function updateDrop(drop: DropItem, canvasHeight: number, dt: number): DropItem {
  if (drop.dying) {
    return { ...drop, dyingProgress: Math.min(1, drop.dyingProgress + 0.08) };
  }

  const vy = Math.min(drop.vy + GRAVITY_BASE * dt, MAX_FALL_VY);
  const y = drop.y + vy;
  const age = drop.age + 1;

  return { ...drop, vy, y, age, swayPhase: drop.swayPhase };
}

// 画面外か判定
export function isDropOffScreen(drop: DropItem, canvasHeight: number): boolean {
  if (drop.dying && drop.dyingProgress >= 1) return true;
  return drop.y > canvasHeight + drop.size;
}

// タップ / クリックのヒット判定
export function hitTestDrop(drop: DropItem, tapX: number, tapY: number): boolean {
  if (drop.captured || drop.dying) return false;
  const margin = drop.size * 0.7;
  return (
    tapX >= drop.x - margin && tapX <= drop.x + margin &&
    tapY >= drop.y - margin && tapY <= drop.y + margin
  );
}

// Canvas 1フレーム描画
export function renderDrops(
  ctx: CanvasRenderingContext2D,
  drops: DropItem[],
  dpr: number
): void {
  ctx.save();
  ctx.scale(dpr, dpr);

  for (const drop of drops) {
    if (drop.dying) {
      // 捕獲アニメ: 縮小＋フェードアウト＋上昇
      const p = drop.dyingProgress;
      const scale = 1 + p * 0.6;
      const alpha = 1 - p;
      if (alpha <= 0) continue;
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${Math.floor(drop.size * scale)}px 'Noto Serif JP', serif`;
      ctx.fillStyle = drop.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const yOff = drop.y - p * 40;
      // glow
      ctx.shadowColor = drop.glowColor;
      ctx.shadowBlur = 20 * (1 - p);
      ctx.fillText(drop.char, drop.x, yOff);
    } else {
      // 通常落下
      ctx.globalAlpha = drop.opacity;
      ctx.font = `bold ${drop.size}px 'Noto Serif JP', serif`;
      ctx.fillStyle = drop.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const tier = RARITY[drop.rarity].tier;
      if (tier >= 6) {
        ctx.shadowColor = drop.glowColor;
        ctx.shadowBlur = 4 + tier * 1.5;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillText(drop.char, drop.x, drop.y);

      // ★16: 虹色オーラ
      if (tier >= 16) {
        const hue = (drop.age * 3) % 360;
        ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
        ctx.shadowBlur = 30;
        ctx.globalAlpha = 0.4;
        ctx.fillText(drop.char, drop.x, drop.y);
        ctx.globalAlpha = drop.opacity;
      }
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}
