"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FS, INK, PAD, PRINCIPLES, PRINCIPLES_INTRO } from "@/lib/theme";

/**
 * 12 号文件第四节：原理线五页索引。
 * 每页先给现象再给一句解释，不解释原理公式。
 */
export default function PrinciplesPage() {
  const router = useRouter();

  return (
    <main
      className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
      style={{ minHeight: "100dvh" }}
    >
      <header
        className="mono flex items-baseline justify-between"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55 }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="transition-opacity hover:opacity-100"
          style={{ padding: "12px 8px", margin: "-12px -8px" }}
        >
          ← 返回
        </button>
        <span>原理线 · 五个问题</span>
      </header>

      <section style={{ marginTop: 64 }}>
        <p
          style={{
            fontSize: FS.body,
            color: INK.sub,
            lineHeight: 1.8,
            margin: 0,
            maxWidth: 460,
          }}
        >
          {PRINCIPLES_INTRO}
        </p>

        <ul style={{ listStyle: "none", margin: "40px 0 0", padding: 0 }}>
          {PRINCIPLES.map((p, i) => (
            <li key={p.id}>
              <Link
                href={`/principle/${p.id}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr",
                  gap: 10,
                  alignItems: "baseline",
                  padding: "18px 0",
                  borderTop: i === 0 ? "none" : `1px solid ${INK.line}`,
                  transition: "opacity var(--t-state) ease-out",
                  opacity: 0.75,
                }}
                className="hover:opacity-100"
              >
                <span
                  className="mono"
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.65 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: FS.body, color: INK.main, lineHeight: 1.7 }}>
                  {p.question}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div style={{ flex: 1 }} />

      <footer
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55, paddingBottom: 8 }}
      >
        看不到现象就跳过 · 这五页是试出来的
      </footer>
    </main>
  );
}
