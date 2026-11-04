"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QUESTIONS, recommend, type Answer } from "@/lib/scoring";
import { loadProgress, saveProgress } from "@/lib/progress";
import { DUR, EASE, FS, INK, PAD } from "@/lib/theme";

/**
 * 08 第三节 4：全屏一题一屏，视觉中心上提。
 * 顶部 QUESTION 03 / 12 是倾斜读数；选项四条细线行，选中靠左侧 2px 竖线长出来。
 */
export default function TestPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const q = QUESTIONS[i];
  const total = QUESTIONS.length;
  const last = i + 1 >= total;

  function pick(key: string) {
    setPicked(key);
    setAnswers([...answers.filter((a) => a.qid !== q.id), { qid: q.id, key }]);
  }

  function next() {
    if (!picked) return;
    if (last) {
      const res = recommend(answers);
      const p = loadProgress();
      saveProgress({
        ...p,
        answers: Object.fromEntries(answers.map((a) => [a.qid, a.key])),
        recommended: res.recommended,
      });
      router.push("/result");
      return;
    }
    setI(i + 1);
    setPicked(null);
  }

  return (
    <main
      className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
      style={{ height: "100dvh" }}
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
          <span className="readout" style={{ marginRight: 6 }}>
            QUESTION {String(i + 1).padStart(2, "0")} / {total}
          </span>
          {q.kind}
        </span>
      </header>

      <section className="flex min-h-0 flex-1 flex-col justify-center pb-16">
        <h1
          style={{
            fontSize: FS.title,
            fontWeight: 500,
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

      <footer className="flex justify-end">
        <button
          type="button"
          onClick={next}
          disabled={!picked}
          className="transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-25"
          style={{
            fontSize: FS.body,
            color: INK.main,
            opacity: 0.9,
            paddingBottom: 3,
            borderBottom: `1px solid ${INK.line2}`,
          }}
        >
          {last ? "[ 看结果 ]" : "[ 下一题 ]"}
        </button>
      </footer>
    </main>
  );
}
