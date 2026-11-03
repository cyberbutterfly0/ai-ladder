"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QUESTIONS, recommend, type Answer } from "@/lib/scoring";
import { loadProgress, saveProgress } from "@/lib/progress";
import { DUR, EASE, FS, INK } from "@/lib/theme";

export default function TestPage() {
  const router = useRouter();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  const q = QUESTIONS[i];
  const total = QUESTIONS.length;
  const pct = ((i + 1) / total) * 100;

  function pick(key: string) {
    if (picked) return;
    setPicked(key);
    const next = [...answers.filter((a) => a.qid !== q.id), { qid: q.id, key }];
    setAnswers(next);

    window.setTimeout(() => {
      if (i + 1 >= total) {
        const res = recommend(next);
        const p = loadProgress();
        saveProgress({
          ...p,
          answers: Object.fromEntries(next.map((a) => [a.qid, a.key])),
          recommended: res.recommended,
        });
        router.push("/result");
      } else {
        setI(i + 1);
        setPicked(null);
      }
    }, 220);
  }

  return (
    <main
      className="mx-auto flex w-full max-w-[620px] flex-col px-5 py-6"
      style={{ height: "100dvh" }}
    >
      <header className="flex items-center gap-4">
        <Link
          href="/"
          style={{ fontSize: FS.label, color: INK.faint, letterSpacing: "0.5px" }}
        >
          ← 回首页
        </Link>
        <span
          className="ml-auto"
          style={{ fontSize: FS.mono, color: INK.faint, letterSpacing: "0.5px" }}
        >
          {String(i + 1).padStart(2, "0")} / {total}
        </span>
      </header>

      <div
        className="mt-3 h-px w-full"
        style={{ background: INK.hair, position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 1,
            width: `${pct}%`,
            background: "#FF8A3D",
            transition: `width ${DUR.body}ms ${EASE}`,
          }}
        />
      </div>

      <section className="flex min-h-0 flex-1 flex-col justify-center">
        <p
          style={{
            fontSize: FS.label,
            color: INK.faint,
            letterSpacing: "1.5px",
            marginBottom: 10,
          }}
        >
          {q.kind}
        </p>
        <h1
          style={{
            fontSize: FS.name,
            fontWeight: 600,
            lineHeight: 1.55,
            letterSpacing: "0.3px",
            marginBottom: 22,
          }}
        >
          {q.scene}
        </h1>

        <div className="flex flex-col gap-2">
          {q.options.map((o) => {
            const on = picked === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => pick(o.key)}
                className="flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left"
                style={{
                  borderColor: on ? "#FF8A3D" : INK.hair,
                  background: on ? "rgba(255,138,61,0.10)" : "transparent",
                  transition: `border-color ${DUR.body}ms ${EASE}, background ${DUR.body}ms ${EASE}`,
                  cursor: picked ? "default" : "pointer",
                }}
              >
                <span
                  style={{
                    fontSize: FS.mono,
                    color: on ? "#FF8A3D" : INK.faint,
                    marginTop: 1,
                  }}
                >
                  {o.key}
                </span>
                <span
                  style={{
                    fontSize: FS.body,
                    lineHeight: 1.65,
                    color: INK.sub,
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
        style={{ fontSize: FS.label, color: "rgba(255,255,255,0.28)" }}
        className="pt-2"
      >
        选最接近的那个，不用想标准答案。
      </footer>
    </main>
  );
}
