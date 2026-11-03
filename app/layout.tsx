import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 阶梯 · 杭电",
  description: "杭州电子科技大学大一学生的 AI 工具使用能力地图",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
