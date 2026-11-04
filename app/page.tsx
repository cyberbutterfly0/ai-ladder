"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FireStage from "@/components/FireStage";
import { FS, INK, levelOf } from "@/lib/theme";
import {
  emptyProgress,
  lastAction,
  loadProgress,
  type Progress,
} from "@/lib/progress";

/**
 * 08 第三节 1：终端接入。
 * 没有大标题、没有副标题、没有台阶图。火是唯一有颜色的东西。
 */
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
      className="mx-auto flex w-full max-w-[720px] flex-col px-6 py-6 md:px-12"
      style={{ minHeight: "100dvh" }}
    >
      <header
        className="mono flex items-center justify-between"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.35 }}
      >
        <span>AI LADDER / TERMINAL 01 / HDU</span>
        <span>2026.11</span>
      </header>

      {/* 08 第一节：火 220×293 居中偏上 */}
      <section
        className="flex flex-1 flex-col items-center justify-center"
        style={{ paddingBottom: "10vh" }}
      >
        <FireStage color={lv.color} />

        <h1
          style={{
            fontSize: FS.title,
            fontWeight: 500,
            letterSpacing: "0.02em",
            marginTop: 40,
            lineHeight: 1.3,
          }}
        >
          {lv.name}
        </h1>

        <p
          style={{
            fontSize: FS.body,
            color: INK.main,
            opacity: 0.7,
            marginTop: 12,
            textAlign: "center",
            maxWidth: 340,
          }}
        >
          {ready && last ? `你上次${last}` : lv.line}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(hasTested ? `/card/${p.current}` : "/test")
          }
          className="transition-opacity hover:opacity-100"
          style={{
            marginTop: 40,
            fontSize: FS.body,
            color: INK.main,
            opacity: 0.9,
            paddingBottom: 4,
            borderBottom: `1px solid ${INK.line2}`,
          }}
        >
          [ 今天做一件小事 ]
        </button>

        <button
          type="button"
          onClick={() => router.push("/glossary")}
          className="transition-opacity hover:opacity-90"
          style={{
            marginTop: 16,
            fontSize: FS.note,
            color: INK.main,
            opacity: 0.45,
          }}
        >
          今天先看看
        </button>
      </section>

      <footer className="flex items-end justify-between gap-4">
        <span
          className="mono"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.3 }}
        >
          从借火到生火 · 杭州电子科技大学
        </span>
        <button
          type="button"
          onClick={() => router.push("/path")}
          className="mono transition-opacity hover:opacity-70"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.35 }}
        >
          四层 →
        </button>
      </footer>
    </main>
  );
}
