import type { UserStats } from "@/lib/types";

interface Props {
  stats: UserStats;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "深夜の鍛錬。";
  if (h < 10) return "おはようございます。";
  if (h < 17) return "今日も積み上げよう。";
  if (h < 21) return "夕刻の集中時間。";
  return "夜の書斎へ。";
}

const PHRASES = [
  "スマホ時間を、育つ時間に。",
  "一字ずつ、確かに育てる。",
  "落ちてくる文字を、捕まえよう。",
];

export default function HeroArea({ stats }: Props) {
  const phrase = PHRASES[0];
  const greeting = getGreeting();

  return (
    <div className="pt-6 pb-2 px-1">
      {/* あいさつ */}
      <p className="text-xs tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>
        {greeting}
      </p>

      {/* メインフレーズ */}
      <h1 className="font-kanji text-2xl font-bold leading-snug tracking-wide mb-3"
        style={{ color: "var(--color-text)" }}>
        {phrase}
      </h1>

      {/* 統計ピル */}
      <div className="flex items-center gap-3 flex-wrap">
        <StatPill label="総ポモドーロ" value={`${stats.totalPomodoros}回`} />
        <StatPill label="累計XP" value={`${stats.totalXp.toLocaleString()}`} accent />
        <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="rain-drop inline-block">雨</span>
          <span>文字は育っている</span>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className="font-bold" style={{ color: accent ? "var(--color-gold)" : "var(--color-text)" }}>
        {value}
      </span>
    </div>
  );
}
