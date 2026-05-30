import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "@/lib/store/GameContext";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "ぽもじかん",
  description: "スマホ時間を、育つ時間に。ポモドーロして、文字を育てる。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ぽもじかん",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#06101b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* 正典フォント: Shippori Mincho B1 (display/kanji) + Zen Kaku Gothic New (body) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;500;600;700;800&family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh">
        <GameProvider>
          <ClientShell>{children}</ClientShell>
        </GameProvider>
      </body>
    </html>
  );
}
