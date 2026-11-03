"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepMap from "@/components/StepMap";
import { recommend, recommendLine, type Result } from "@/lib/scoring";
import { loadProgress, setLevel } from "@/lib/progress";
import { DUR, EASE, FS, INK, LEVELS, levelOf } from "@/lib/theme";

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
      router.replace("/test");
      return;
    }
    setRes(recommend(answers));
  }, [router]);

  if (!res) {
    return (
      <main
        className="mx-auto flex max-w-[620px] items-center justify-center px-5"
        style={{ height: "100dvh" }}
      />
    );
  }

  const lv = levelOf(res.recommended);

  function go(level: number) {
    setLevel(level);
    router.push(`/card/${level}`);
  }

  return (
    <main
      className="mx-auto flex w-full max-w-[620px] flex-col px-5 py-8"
      style={{ minHeight: "100dvh" }}
    >
      <section className="flex flex-1 flex-col justify-center">
        <p
          style={{
            fontSize: FS.label,
            color: INK.faint,
            letterSpacing: "1.5px",
            marginBottom: 12,
          }}
        >
          12 题答完了
        </p>

        {/* 全站唯一的大字：18px */}
        <h1
          style={{
            fontSize: FS.hint,
            fontWeight: 600,
            color: lv.color,
            lineHeight: 1.6,
            letterSpacing: "0.3px",
          }}
        >
          {recommendLine(res.recommended)}
        </h1>

        <p
          style={{
            fontSize: FS.line,
            color: INK.sub,
            lineHeight: 1.65,
            marginTop: 10,
          }}
        >
          这 12 题只能看出你到哪儿了，看不准你。
          {lv.line}
        </p>

        <div className="mt-6">
          <StepMap current={res.recommended} />
        </div>

        <p
          style={{
            fontSize: FS.label,
            color: INK.faint,
            lineHeight: 1.6,
            marginTop: 12,
          }}
        >
          过了：{res.passedLayers.length ? res.passedLayers.join("、") : "一层都没过"}
        </p>

        <div className="mt-8 flex items-center gap-5">
          <button
            type="button"
            onClick={() => go(res.recommended)}
            className="rounded-md px-4 py-2 font-semibold transition-opacity hover:opacity-90"
            style={{
              fontSize: FS.body,
              background: lv.color,
              color: "#0A1024",
            }}
          >
            就按这个
          </button>
          <button
            type="button"
            onClick={() => setPicking((v) => !v)}
            className="transition-opacity hover:opacity-80"
            style={{ fontSize: FS.body, color: INK.faint }}
          >
            我自己挑一层
          </button>
        </div>

        {picking && (
          <div className="mt-4 flex flex-col gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                className="flex items-center gap-3 rounded-md border px-3 py-2 text-left"
                style={{
                  borderColor: INK.hair,
                  fontSize: FS.body,
                  transition: `border-color ${DUR.body}ms ${EASE}`,
                }}
              >
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: l.color }}
                />
                <span style={{ fontWeight: 600 }}>{l.name}</span>
                <span style={{ color: INK.faint, marginLeft: "auto" }}>
                  {l.canDo}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <footer
        style={{ fontSize: FS.label, color: "rgba(255,255,255,0.28)" }}
        className="pt-4"
      >
        推荐只是起点，台阶图随时能改。
      </footer>
    </main>
  );
}
