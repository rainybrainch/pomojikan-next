import type { Companion } from "@/lib/types";
import { RARITY_COLORS, RARITY_GLOW } from "@/lib/dummyData";

interface Props {
  companion: Companion;
}

const SCRIPT_LABELS: Record<string, string> = {
  楷書: "Lv1〜10",
  行書: "Lv11〜25",
  草書: "Lv26〜50",
  篆書: "Lv51〜80",
  甲骨: "Lv81+",
};

export default function CompanionCard({ companion }: Props) {
  const rarityColor = RARITY_COLORS[companion.rarity];
  const kanjiGlow = RARITY_GLOW[companion.rarity];
  const xpPercent = Math.round((companion.xp / companion.xpToNext) * 100);
  const isOriginal = companion.isOriginal;

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 h-full"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* ヘッダー: レアリティ + 名前 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {isOriginal && (
              <span className="text-xs px-1.5 py-0.5 rounded font-bold"
                style={{ background: "rgba(212,168,67,0.15)", color: "var(--color-gold)", fontSize: "10px" }}>
                ✦ オリジナル
              </span>
            )}
          </div>
          <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
            {companion.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {companion.yomi}
          </p>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              background: `${rarityColor}18`,
              color: rarityColor,
              border: `1px solid ${rarityColor}40`,
            }}
          >
            {companion.rarity}
          </span>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
            {companion.script}
          </p>
        </div>
      </div>

      {/* 漢字大表示 */}
      <div className="flex-1 flex items-center justify-center py-2">
        <span
          className={`font-kanji select-none${isOriginal ? " kanji-glow-gold" : ""}`}
          style={{
            fontSize: "96px",
            lineHeight: 1,
            color: isOriginal ? "var(--color-gold)" : rarityColor,
            textShadow: isOriginal ? undefined : kanjiGlow,
            fontWeight: 700,
          }}
        >
          {companion.kanji}
        </span>
      </div>

      {/* レベル + XPバー */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "var(--color-text-muted)" }}>
            Lv.<span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>{companion.level}</span>
            &nbsp;{companion.script}
          </span>
          <span style={{ color: "var(--color-text-muted)" }}>
            <span style={{ color: "var(--color-rain)" }}>{companion.xp}</span>
            &nbsp;/&nbsp;{companion.xpToNext} XP
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="xp-bar-fill h-full rounded-full"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          絆 {companion.bondCount}回 ・ {SCRIPT_LABELS[companion.script]}
        </p>
      </div>

      {/* 説明 */}
      <p
        className="text-xs leading-relaxed font-kanji"
        style={{ color: "var(--color-text-dim)" }}
      >
        {companion.desc}
      </p>

      {/* タグ */}
      <div className="flex flex-wrap gap-1">
        {companion.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(74,158,255,0.08)",
              color: "var(--color-text-muted)",
              border: "1px solid rgba(74,158,255,0.12)",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
