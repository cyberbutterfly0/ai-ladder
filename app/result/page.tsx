"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { recommend, recommendLine, type Result } from "@/lib/scoring";
import { loadProgress, setLevel } from "@/lib/progress";
import { DUR, EASE, FS, INK, LEVELS, PAD, levelOf } from "@/lib/theme";

/**
 * 08 第三节 5：结论一行 20px，下面是四层得分条（四维已作废，改成层得分）。
 * 数值右对齐等宽 11px 倾斜 -6°。两个动作。
 */
export default function ResultPage() {
  const router = useRouter();
  const [res, setRes] = useState<Result | null>(null);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    const answers = Object.entries(p.answers ?? {}).map(([qid, key]) => ({
      qid,
      key,
    }));
    if (!answers.length) {
      router.replace("/quiz");
      return;
    }
    setRes(recommend(answers));
  }, [router]);

  if (!res) {
    return (
      <main
        className={`mx-auto flex w-full max-w-[720px] ${PAD} items-center justify-center`}
        style={{ height: "100dvh" }}
      />
    );
  }

  function go(level: number) {
    setLevel(level);
    router.push(`/card/${level}`);
  }

  return (
    <main
      className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
      style={{ minHeight: "100dvh" }}
    >
      <header className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mono transition-opacity hover:opacity-70"
          style={{
            fontSize: FS.micro,
            color: INK.sub,
            opacity: 0.6,
            padding: "12px 8px",
            margin: "-12px -8px",
          }}
        >
          ← 返回
        </button>
        <span
          className="mono"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6 }}
        >
          RESULT / 12
        </span>
      </header>

      <section className="flex flex-1 flex-col justify-center">
        <p
          className="mono"
          style={{
            fontSize: FS.micro,
            color: INK.sub,
            opacity: 0.65,
            marginBottom: 16,
          }}
        >
          12 题答完了
        </p>

        <h1
          style={{
            fontSize: FS.title,
            fontWeight: 500,
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {recommendLine(res.recommended)}
        </h1>

        <p
          style={{
            fontSize: FS.body,
            color: INK.sub,
            lineHeight: 1.7,
            marginTop: 12,
          }}
        >
          这 12 题只能看出你到哪儿了，看不准你。
        </p>

        <div style={{ marginTop: 40 }}>
          {res.scores.map((s) => {
            const lay = levelOf(s.layer);
            return (
              <div
                key={s.layer}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  minHeight: 48,
                  borderBottom: `1px solid ${INK.line}`,
                }}
              >
                <span
                  aria-hidden
                  className="inline-block rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    background: s.hits >= s.need ? lay.color : "transparent",
                    boxShadow: s.hits >= s.need ? "none" : `inset 0 0 0 1px ${INK.line2}`,
                  }}
                />
                <span style={{ fontSize: FS.body, color: INK.main, minWidth: 40 }}>
                  {lay.name}
                </span>
                <span style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      style={{
                        width: 16,
                        height: 3,
                        background: k < s.hits ? INK.line2 : INK.line,
                        transition: `background ${DUR.state}ms ${EASE}`,
                      }}
                    />
                  ))}
                </span>
                <span
                  className="mono readout"
                  style={{ marginLeft: "auto", fontSize: FS.mono, color: INK.sub }}
                >
                  {s.hits}/{s.total}
                </span>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
          }}
        >
          <button
            type="button"
            onClick={() => go(res.recommended)}
            className="transition-opacity hover:opacity-100"
            style={{
              fontSize: FS.body,
              color: INK.main,
              opacity: 0.9,
              paddingBottom: 3,
              borderBottom: `1px solid ${INK.line2}`,
            }}
          >
            [ 去这层看看 ]
          </button>
          <button
            type="button"
            onClick={() => setPicking((v) => !v)}
            className="transition-opacity hover:opacity-80"
            style={{ fontSize: FS.body, color: INK.sub, opacity: 0.6 }}
          >
            自己选一层
          </button>
        </div>

        {picking && (
          <div style={{ marginTop: 20 }}>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  width: "100%",
                  minHeight: 44,
                  borderBottom: `1px solid ${INK.line}`,
                  textAlign: "left",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.65 }}
                >
                  {String(l.id).padStart(2, "0")}
                </span>
                <span style={{ fontSize: FS.body, color: INK.main }}>{l.name}</span>
                <span style={{ fontSize: FS.note, color: INK.sub, marginLeft: "auto" }}>
                  {l.canDo}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <footer
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55 }}
      >
        推荐只是起点 · 台阶图随时能改
      </footer>
    </main>
  );
}
