"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/",
    label: "ホーム",
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" strokeWidth="1.8" fill="none"
          stroke={a ? "var(--color-bg-deep)" : "currentColor"} />
      </svg>
    ),
  },
  {
    href: "/game",
    label: "あそぶ",
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8"
          fill={a ? "var(--color-bg-deep)" : "currentColor"} stroke="none" />
      </svg>
    ),
  },
  {
    href: "/inventory",
    label: "図鑑",
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={a ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "設定",
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" fill={a ? "currentColor" : "none"} />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

// ━━ スマホ: 下部タブバー ━━
function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="mobile-only fixed bottom-0 left-0 right-0 z-40 flex pb-safe"
      style={{
        background: "rgba(6,16,27,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--color-line-strong)",
      }}>
      {NAV.map(item => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}
            className="relative flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-150"
            style={{ color: active ? "var(--color-accent)" : "var(--color-ink-dim)" }}>
            {active && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                style={{ background: "var(--color-accent)", boxShadow: "0 0 8px rgba(135,206,235,0.6)" }} />
            )}
            {item.icon(active)}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// ━━ PC: 左サイドナビ ━━
function DesktopSideNav({ pathname }: { pathname: string }) {
  return (
    <aside className="desktop-only fixed left-0 top-0 bottom-0 z-40 flex flex-col py-6 px-3 gap-1"
      style={{
        width: 72,
        background: "rgba(6,16,27,0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid var(--color-line)",
      }}>
      {/* ロゴ */}
      <Link href="/" className="flex items-center justify-center mb-6">
        <span className="font-kanji font-bold text-xl"
          style={{ color: "var(--color-accent)", textShadow: "0 0 16px rgba(135,206,235,0.4)" }}>
          字
        </span>
      </Link>

      {/* ナビアイテム */}
      {NAV.map(item => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}
            className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-150"
            style={{
              color: active ? "var(--color-accent)" : "var(--color-ink-dim)",
              background: active ? "rgba(135,206,235,0.08)" : "transparent",
            }}>
            {item.icon(active)}
            <span className="text-xs font-medium" style={{ fontSize: 10 }}>{item.label}</span>
          </Link>
        );
      })}

      {/* バージョン */}
      <div className="mt-auto text-center">
        <span className="text-xs" style={{ color: "var(--color-ink-dim)", fontSize: 9, opacity: 0.5 }}>
          v0.1
        </span>
      </div>
    </aside>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <>
      <MobileNav pathname={pathname} />
      <DesktopSideNav pathname={pathname} />
    </>
  );
}
