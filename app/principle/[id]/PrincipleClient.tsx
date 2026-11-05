"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FS, INK, PAD, PRINCIPLES, principleOf } from "@/lib/theme";

/**
 * 12 号文件第四节：原理页 = 界画 + 现象 + 一句解释。
 * 顺序不能反：先给能自己看到的现象，再给解释。
 */
export default function PrinciplePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const p = principleOf(id);

  if (!p) {
    return (
      <main
        className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
        style={{ minHeight: "100dvh" }}
      >
        <p style={{ fontSize: FS.body, color: INK.sub }}>没有这一页。</p>
        <Link href="/principles" style={{ fontSize: FS.body, marginTop: 12 }}>
          ← 五个问题
        </Link>
      </main>
    );
  }

  const next = PRINCIPLES.find((x) => x.id === id + 1);

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
          onClick={() => router.push("/principles")}
          className="transition-opacity hover:opacity-70"
        >
          ← 五个问题
        </button>
        <span>
          <span className="readout" style={{ marginRight: 6 }}>
            {String(id).padStart(2, "0")}
          </span>
          / {String(PRINCIPLES.length).padStart(2, "0")}
        </span>
      </header>

      <article style={{ marginTop: 56 }}>
        <h1
          className="serif"
          style={{
            fontSize: FS.title,
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {p.question}
        </h1>

        {/* 界画占位：等用户出图，先只留位置与说明 */}
        <div
          style={{
            marginTop: 32,
            height: 300,
            border: `1px dashed ${INK.line2}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 32px",
          }}
        >
          <span
            className="mono"
            style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.62 }}
          >
            界画占位 · {p.drawing}
          </span>
        </div>

        <section style={{ marginTop: 32 }}>
          <div style={{ height: 1, background: INK.line, marginBottom: 16 }} />
          <p
            className="mono"
            style={{
              fontSize: FS.micro,
              color: INK.sub,
              opacity: 0.65,
              margin: "0 0 12px",
            }}
          >
            自己试
          </p>
          <p style={{ fontSize: FS.body, color: INK.main, lineHeight: 1.8, margin: 0 }}>
            {p.phenomenon}
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <div style={{ height: 1, background: INK.line, marginBottom: 16 }} />
          <p
            className="mono"
            style={{
              fontSize: FS.micro,
              color: INK.sub,
              opacity: 0.65,
              margin: "0 0 12px",
            }}
          >
            看到之后
          </p>
          <p style={{ fontSize: FS.body, color: INK.sub, lineHeight: 1.8, margin: 0 }}>
            {p.explain}
          </p>
        </section>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            marginTop: 48,
          }}
        >
          {next ? (
            <Link
              href={`/principle/${next.id}`}
              className="transition-opacity hover:opacity-70"
              style={{
                fontSize: FS.body,
                color: INK.main,
                opacity: 0.85,
                paddingBottom: 3,
                borderBottom: `1px solid ${INK.line2}`,
              }}
            >
              下一个：{next.question} →
            </Link>
          ) : (
            <Link
              href="/principles"
              className="transition-opacity hover:opacity-70"
              style={{
                fontSize: FS.body,
                color: INK.main,
                opacity: 0.85,
                paddingBottom: 3,
                borderBottom: `1px solid ${INK.line2}`,
              }}
            >
              五个问题看完了，回去让它干活 →
            </Link>
          )}
        </div>
      </article>
    </main>
  );
}
