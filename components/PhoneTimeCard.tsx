import type { PhoneUsage } from "@/lib/types";

interface Props {
  usage: PhoneUsage[];
}

export default function PhoneTimeCard({ usage }: Props) {
  const totalMinutes = usage.reduce((s, u) => s + u.minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainMin = totalMinutes % 60;

  const maxMinutes = Math.max(...usage.map((u) => u.minutes));

  // 昨日比（ダミー: -32分）
  const yesterdayDelta = -32;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-1.5" style={{ color: "var(--color-text)" }}>
            📱 スマホ利用時間
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            今日の合計
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--color-text)" }}>
            {totalHours}
            <span className="text-sm font-normal" style={{ color: "var(--color-text-muted)" }}>h</span>
            {remainMin}
            <span className="text-sm font-normal" style={{ color: "var(--color-text-muted)" }}>m</span>
          </p>
          <p
            className="text-xs font-medium"
            style={{ color: yesterdayDelta < 0 ? "var(--color-sage)" : "#f87171" }}
          >
            {yesterdayDelta < 0 ? "▼" : "▲"} {Math.abs(yesterdayDelta)}分（昨日比）
          </p>
        </div>
      </div>

      {/* バーグラフ */}
      <div className="flex items-end gap-1 h-20 mb-3">
        {usage.map((u) => {
          const height = maxMinutes > 0 ? (u.minutes / maxMinutes) * 100 : 0;
          const isHigh = u.minutes >= 40;
          return (
            <div
              key={u.hour}
              className="flex-1 flex flex-col items-center justify-end gap-0.5"
            >
              <div
                className="w-full rounded-t-sm transition-all"
                style={{
                  height: `${height}%`,
                  minHeight: u.minutes > 0 ? "3px" : "0",
                  background: isHigh
                    ? "rgba(248,113,113,0.6)"
                    : "rgba(74,158,255,0.4)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 時間ラベル（間引き） */}
      <div className="flex items-center justify-between text-xs mb-4"
        style={{ color: "var(--color-text-muted)" }}>
        <span>{usage[0]?.hour}時</span>
        <span>{usage[Math.floor(usage.length / 2)]?.hour}時</span>
        <span>{usage[usage.length - 1]?.hour}時</span>
      </div>

      {/* ぽもじかん効果 */}
      <div
        className="rounded-xl p-3 flex items-center gap-3"
        style={{ background: "rgba(74,158,255,0.06)", border: "1px solid rgba(74,158,255,0.12)" }}
      >
        <span className="text-lg">✦</span>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
          ぽもじかん中の32分で、<br />
          <span style={{ color: "var(--color-rain)" }}>「静」</span>が+45XP育ちました。
        </p>
      </div>
    </div>
  );
}
