import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "滑雪旅程規劃",
  description: "簡單好用的滑雪旅程規劃工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
