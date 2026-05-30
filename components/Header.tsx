import type { UserStats } from "@/lib/types";

interface Props {
  stats: UserStats;
}

export default function Header({ stats }: Props) {
  return (
    <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between backdrop-blur-md"
      style={{ background: "rgba(6,9,26,0.85)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      {/* ロゴ */}
      <div className="flex items-center gap-2">
        <span className="font-kanji text-xl font-bold tracking-widest" style={{ color: "var(--color-rain)" }}>
          ぽも
        </span>
        <span className="font-kanji text-xl font-bold tracking-widest" style={{ color: "var(--color-text)" }}>
          じかん
        </span>
      </div>

      {/* 右: streak + 設定 */}
      <div className="flex items-center gap-3">
        {/* Streak */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.2)" }}>
          <span className="text-sm" aria-label="炎">🔥</span>
          <span className="text-sm font-bold" style={{ color: "var(--color-gold)" }}>
            {stats.streak}日
          </span>
        </div>

        {/* 今日のポモ */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(74,158,255,0.1)", border: "1px solid rgba(74,158,255,0.2)" }}>
          <span className="text-sm" aria-label="集中">🍅</span>
          <span className="text-sm font-medium" style={{ color: "var(--color-rain)" }}>
            {stats.todayPomodoros}
          </span>
        </div>

        {/* 設定ボタン */}
        <button
          aria-label="設定"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--color-text-muted)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
