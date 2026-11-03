"use client";

import Link from "next/link";
import { FS, INK } from "@/lib/theme";

export default function GlossaryPage() {
  return (
    <main
      className="mx-auto flex w-full max-w-[620px] flex-col px-5 py-6"
      style={{ minHeight: "100dvh" }}
    >
      <Link
        href="/"
        style={{ fontSize: FS.label, color: INK.faint, letterSpacing: "0.5px" }}
      >
        ← 回首页
      </Link>

      <section className="flex flex-1 flex-col justify-center">
        <h1 style={{ fontSize: FS.name, fontWeight: 600, letterSpacing: "0.5px" }}>
          黑话表
        </h1>
        <p
          style={{
            fontSize: FS.line,
            color: INK.sub,
            lineHeight: 1.65,
            marginTop: 8,
          }}
        >
          12 个词，用人话讲一遍。这一页还在整理。
        </p>
      </section>
    </main>
  );
}
