"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FireStage from "@/components/FireStage";
import StepMap from "@/components/StepMap";
import { FS, INK, levelOf } from "@/lib/theme";
import {
  emptyProgress,
  lastAction,
  loadProgress,
  setLevel,
  type Progress,
} from "@/lib/progress";

export default function Home() {
  const router = useRouter();
  const [p, setP] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setP(loadProgress());
    setReady(true);
  }, []);

  const lv = levelOf(p.current);
  const last = lastAction(p);
  const hasTested = Boolean(p.answers && Object.keys(p.answers).length);

  return (
    <main
      className="mx-auto flex w-full max-w-[1080px] flex-col gap-3 px-5 py-5"
      style={{ height: "100dvh" }}
    >
      {/* 台阶图：常驻导航，点哪层跳哪层 */}
      <StepMap
        current={p.current}
        onPick={(level) => setP(setLevel(level))}
      />

      {/* 首屏四物件：当前层名 / 一句“你上次做了什么” / 一个具体动作 / 一个按钮 */}
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 md:flex-row md:gap-16">
        <FireStage color={lv.color} level={lv.id} />

        <div className="w-full max-w-[420px]">
          <h1
            style={{
              fontSize: FS.name,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: INK.main,
              margin: 0,
            }}
          >
            {lv.name}
          </h1>

          <p
            style={{
              fontSize: FS.line,
              color: INK.sub,
              marginTop: 6,
              lineHeight: 1.65,
            }}
          >
            {ready && last ? `你上次${last}` : lv.line}
          </p>

          <div
            style={{
              height: 1,
              background: INK.hair,
              margin: "18px 0",
            }}
          />

          <p
            style={{
              fontSize: FS.label,
              letterSpacing: "1.5px",
              color: "rgba(255,255,255,0.45)",
              marginBottom: 8,
            }}
          >
            今天可以做的
          </p>
          <p
            style={{
              fontSize: FS.body,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {lv.fiveMinuteTask}
          </p>

          <div className="mt-7 flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(hasTested ? `/card/${p.current}` : "/test")
              }
              className="rounded-md px-4 py-2 transition-opacity hover:opacity-90"
              style={{
                fontSize: FS.body,
                background: lv.color,
                color: "#0A1024",
                fontWeight: 600,
              }}
            >
              {hasTested ? "继续这一层" : "开始"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/glossary")}
              className="transition-opacity hover:opacity-80"
              style={{ fontSize: FS.body, color: INK.faint }}
            >
              今天先看看
            </button>
          </div>
        </div>
      </section>

      <footer
        className="flex items-center justify-between"
        style={{
          fontSize: FS.label,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.5px",
        }}
      >
        <span>从借火到生火</span>
        <span>AI 阶梯 · 杭州电子科技大学</span>
      </footer>
    </main>
  );
}
