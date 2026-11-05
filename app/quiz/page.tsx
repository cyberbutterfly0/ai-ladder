"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QUESTIONS, recommend, type Answer } from "@/lib/scoring";
import { loadProgress, saveProgress } from "@/lib/progress";
import { DUR, EASE, FS, INK, PAD } from "@/lib/theme";

/**
 * 08 第三节 4 + 13 第五节：全屏一题一屏，视觉中心上提。
 * 选完停在选中态 160ms，然后自己进下一题，底部不放「下一步」按钮。
 */
export default function QuizPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const q = QUESTIONS[i];
  const total = QUESTIONS.length;
  const last = i + 1 >= total;

  function pick(key: string) {
    if (picked) return;
    setPicked(key);
    const nextAnswers = [
      ...answers.filter((a) => a.qid !== q.id),
      { qid: q.id, key },
    ];
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (last) {
        const res = recommend(nextAnswers);
        const p = loadProgress();
        saveProgress({
          ...p,
          answers: Object.fromEntries(
            nextAnswers.map((a) => [a.qid, a.key])
          ),
          recommended: res.recommended,
        });
        router.push("/result");
        return;
      }
      setI(i + 1);
      setPicked(null);
    }, DUR.state * 2);
  }

  return (
    <main
      className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
      style={{ height: "100dvh" }}
    >
      <header className="flex items-baseline justify-between">
        <Link
          href="/"
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
        </Link>
        <span
          className="mono"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6 }}
        >
          <span className="readout" style={{ marginRight: 8 }}>
            {String(i + 1).padStart(2, "0")} / {total}
          </span>
          {q.kind}
        </span>
      </header>

      <section className="flex min-h-0 flex-1 flex-col justify-center pb-16">
        <h1
          className="serif"
          style={{
            fontSize: FS.title,
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            marginBottom: 32,
            maxWidth: 560,
          }}
        >
          {q.scene}
        </h1>

        <div style={{ borderTop: `1px solid ${INK.line}` }}>
          {q.options.map((o) => {
            const on = picked === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => pick(o.key)}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  width: "100%",
                  minHeight: 56,
                  paddingLeft: 22,
                  paddingRight: 8,
                  paddingTop: 8,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${INK.line}`,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    width: 2,
                    height: on ? 12 : 0,
                    background: INK.line2,
                    transform: "translateY(-50%)",
                    transition: `height ${DUR.state}ms ${EASE}`,
                  }}
                />
                <span
                  className="mono"
                  style={{
                    fontSize: FS.micro,
                    color: INK.sub,
                    opacity: on ? 1 : 0.5,
                    transition: `opacity ${DUR.state}ms ${EASE}`,
                  }}
                >
                  {o.key}
                </span>
                <span
                  style={{
                    fontSize: FS.body,
                    lineHeight: 1.6,
                    color: INK.main,
                    opacity: on ? 1 : 0.7,
                    transition: `opacity ${DUR.state}ms ${EASE}`,
                  }}
                >
                  {o.text}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55 }}
      >
        选一个就往下走
      </footer>
    </main>
  );
}
