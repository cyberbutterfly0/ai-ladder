"use client";

import Link from "next/link";
import glossary from "@/content/glossary.json";
import { FS, INK, PAD } from "@/lib/theme";

/**
 * 08 第三节 6：两列，左词条等宽 13px，右人话 13px，行间 1px 细线。
 */
export default function GlossaryPage() {
  return (
    <main
      className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
      style={{ minHeight: "100dvh" }}
    >
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="mono transition-opacity hover:opacity-70"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6 }}
        >
          ← 终端
        </Link>
        <span
          className="mono"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6 }}
        >
          GLOSSARY / {glossary.total}
        </span>
      </header>

      <p
        className="mono"
        style={{
          fontSize: FS.micro,
          color: INK.sub,
          opacity: 0.65,
          marginTop: 40,
          marginBottom: 0,
        }}
      >
        把 AI 黑话翻译成人话 · {glossary.total} 条
      </p>

      <ul style={{ listStyle: "none", margin: "16px 0 0", padding: 0 }}>
        {glossary.items.map((it) => (
          <li
            key={it.term}
            className="grid grid-cols-1 gap-1 transition-opacity hover:opacity-100 sm:grid-cols-[170px_1fr] sm:items-baseline sm:gap-6"
            style={{
              padding: "14px 0",
              borderTop: `1px solid ${INK.line}`,
              opacity: 0.75,
            }}
          >
            <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span
                className="mono"
                style={{ fontSize: FS.body, color: INK.main, letterSpacing: "0.04em" }}
              >
                {it.term}
              </span>
              {it.tag === "加餐" && (
                <span
                  className="mono"
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.65 }}
                >
                  加餐
                </span>
              )}
            </span>
            <span
              style={{
                fontSize: FS.body,
                color: INK.main,
                opacity: 0.7,
                lineHeight: 1.6,
              }}
            >
              {it.plain}
            </span>
          </li>
        ))}
      </ul>

      <p
        className="mono"
        style={{
          fontSize: FS.micro,
          color: INK.sub,
          opacity: 0.6,
          marginTop: 24,
          lineHeight: 1.8,
        }}
      >
        记不住没关系。往下做的时候会撞上这些词，撞一次就记住一个。
      </p>
    </main>
  );
}
