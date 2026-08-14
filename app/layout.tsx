import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "별빛 방 — 우루와 마음껏 상상하는 공간",
  description: "우파루파 우루와 함께 달빛과 색깔이 말을 거는 인터랙티브 별빛 방을 둘러보세요.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
