"use client";

import { useMemo } from "react";

interface RainLine {
  left: string;
  height: string;
  dur: string;
  delay: string;
  opacity: number;
}

export default function RainBackground() {
  const lines = useMemo<RainLine[]>(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => ({
      left: `${(i / count) * 100 + (Math.sin(i * 2.4) * 3)}%`,
      height: `${60 + Math.sin(i * 1.7) * 30}px`,
      dur: `${6 + Math.sin(i * 0.8) * 3}s`,
      delay: `${-Math.sin(i * 1.3) * 6}s`,
      opacity: 0.18 + Math.sin(i * 0.5) * 0.08,
    }));
  }, []);

  return (
    <div className="rain-bg" aria-hidden="true">
      {lines.map((l, i) => (
        <div key={i} className="rain-line"
          style={{
            left: l.left,
            height: l.height,
            opacity: l.opacity,
            animationDuration: l.dur,
            animationDelay: l.delay,
          }}
        />
      ))}
    </div>
  );
}
