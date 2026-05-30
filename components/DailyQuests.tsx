// store の type と lib/types の type を両方受け入れる
interface Quest {
  id: string;
  text: string;
  xpReward: number;
  completed: boolean;
  type: string;
}

interface Props {
  quests: Quest[];
}

// 旧 lib/types と store/types の両方をカバー
const TYPE_ICONS: Record<string, string> = {
  pomodoro: "🍅",
  collect:  "⛩",
  capture:  "⛩",   // store型
  compose:  "⚗",
  daily:    "📱",
  phone:    "📱",   // store型
};

export default function DailyQuests({ quests }: Props) {
  const completed = quests.filter(q => q.completed).length;
  const total = quests.length;
  const pct = Math.round((completed / total) * 100);
  const allDone = pct === 100;

  return (
    <div className="rounded-2xl p-5 glass-card-solid"
      style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.3)" }}>

      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-kanji text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
            デイリークエスト
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-dim)" }}>
            {completed}/{total} 完了
          </p>
        </div>
        <span className="rarity-badge"
          style={{
            color: allDone ? "#6ee7b7" : "var(--color-accent)",
            borderColor: allDone ? "rgba(110,231,183,0.3)" : "rgba(135,206,235,0.25)",
            background: allDone ? "rgba(110,231,183,0.07)" : "rgba(135,206,235,0.07)",
          }}>
          {pct}%
        </span>
      </div>

      {/* プログレス */}
      <div className="h-1 rounded-full mb-5 overflow-hidden" style={{ background: "rgba(180,220,250,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: allDone
              ? "linear-gradient(90deg,#6ee7b7,#a7f3d0)"
              : "linear-gradient(90deg,var(--color-accent),var(--color-accent2))",
            boxShadow: allDone ? "0 0 8px rgba(110,231,183,0.5)" : "0 0 8px rgba(135,206,235,0.4)",
          }} />
      </div>

      {/* リスト */}
      <ul className="space-y-2.5">
        {quests.map(q => (
          <li key={q.id}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors"
            style={{
              background: q.completed ? "rgba(110,231,183,0.04)" : "rgba(180,220,250,0.03)",
              border: `1px solid ${q.completed ? "rgba(110,231,183,0.12)" : "var(--color-line)"}`,
              opacity: q.completed ? 0.65 : 1,
            }}>
            {/* チェック */}
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: q.completed ? "rgba(110,231,183,0.15)" : "rgba(180,220,250,0.05)",
                border: `1.5px solid ${q.completed ? "#6ee7b7" : "rgba(180,220,250,0.15)"}`,
              }}>
              {q.completed && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <polyline points="2 6 5 9 10 3" stroke="#6ee7b7" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <span className="text-base leading-none">{TYPE_ICONS[q.type] ?? "📋"}</span>

            <p className="flex-1 text-sm" style={{
              color: q.completed ? "var(--color-ink-dim)" : "var(--color-ink-mute)",
              textDecoration: q.completed ? "line-through" : "none",
            }}>
              {q.text}
            </p>

            <span className="text-xs font-bold flex-shrink-0"
              style={{ color: q.completed ? "var(--color-ink-dim)" : "var(--color-gold)" }}>
              +{q.xpReward}XP
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
