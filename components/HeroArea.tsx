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
  "集中の25分が、字を育てる。",
  "今日も、字と向き合う。",
  "降る字に、手を伸ばす。",
  "積み上げた字は、消えない。",
  "静けさの中に、力が宿る。",
  "今日の集中が、明日の財産になる。",
  "字を育てることは、自分を育てること。",
  "雨のように降る字を、ひとつひとつ。",
  "深呼吸ひとつ。さあ、始めよう。",
  "あなたの字の物語が、今日も続く。",
  "焦らず、でも確実に。",
];

export default function HeroArea({ stats }: Props) {
  const now = new Date();
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const phrase = PHRASES[daySeed % PHRASES.length];
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
        <StatPill label="今日" value={`${stats.todayPomodoros}回`} />
        <StatPill label="累計XP" value={`${stats.totalXp.toLocaleString()}`} accent />
        {stats.streak > 0 && (
          <StatPill
            label="連続"
            value={`${stats.streak}日 ${stats.streak >= 30 ? "🔥" : stats.streak >= 7 ? "✦" : "◈"}`}
          />
        )}
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
