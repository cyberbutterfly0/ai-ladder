"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FireStage from "@/components/FireStage";
import {
  emptyProgress,
  lastAction,
  loadProgress,
  type Progress,
} from "@/lib/progress";
import { FS, INK, PAD, levelOf } from "@/lib/theme";

/**
 * 12 号文件：入口 = 两条线选择 + 当前层。
 * 08 的结构保留：没有大标题、没有副标题、没有台阶图，火是唯一有颜色的东西。
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
  const hasTested = Boolean(p.recommended);

  return (
    <main
      className={`mx-auto flex min-h-[100dvh] w-full max-w-[720px] flex-col ${PAD}`}
    >
      <header
        className="mono flex items-baseline justify-between"
        style={{
          paddingTop: 28,
          fontSize: FS.note,
          color: INK.sub,
          opacity: 0.75,
        }}
      >
        <span>AI 阶梯 · 杭电大一 AI 工具能力地图</span>
        <span className="hidden min-[420px]:inline">2026.11</span>
      </header>

      <section
        className="flex flex-1 flex-col items-center justify-center"
        style={{ paddingBottom: "8vh" }}
      >
        <FireStage level={lv.id} color={lv.color} />

        <p
          className="serif"
          style={{
            fontSize: FS.level,
            letterSpacing: "0.5px",
            marginTop: 40,
            marginBottom: 0,
          }}
        >
          {lv.name}
        </p>

        <p
          className="mono"
          style={{
            fontSize: FS.micro,
            color: INK.sub,
            opacity: 0.8,
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          {lv.de}
        </p>

        <p
          style={{
            fontSize: FS.body,
            color: INK.main,
            opacity: 0.7,
            marginTop: 12,
            marginBottom: 0,
            textAlign: "center",
            maxWidth: 340,
          }}
        >
          {ready && last ? `你上次${last}` : lv.line}
        </p>

        {/* 12 号文件第二节：两条线，是两种需求，不是深浅 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            marginTop: 44,
          }}
        >
          <button
            type="button"
            onClick={() =>
              router.push(hasTested ? `/card/${p.current}` : "/card/1")
            }
            className="entry-main"
          >
            <span>让它干活 →</span>
            <span className="entry-rule" aria-hidden />
          </button>

          <Link
            href="/principles"
            className="transition-opacity hover:opacity-100"
            style={{
              fontSize: FS.body,
              color: INK.main,
              opacity: 0.72,
              paddingBottom: 4,
              borderBottom: `1px solid ${INK.line}`,
            }}
          >
            想先搞懂它为什么这样
          </Link>
        </div>

        <p
          className="mono"
          style={{
            fontSize: FS.micro,
            color: INK.sub,
            opacity: 0.68,
            marginTop: 26,
            marginBottom: 0,
          }}
        >
          <Link href="/quiz" className="hover:opacity-100">
            {hasTested ? "再答一遍 12 题" : "不知道从哪层开始？先答 12 题"}
          </Link>
        </p>
      </section>

      <footer
        className="mono flex items-baseline justify-between"
        style={{
          paddingBottom: 28,
          fontSize: FS.micro,
          color: INK.sub,
          opacity: 0.55,
        }}
      >
        <span>从借火到生火 · 杭州电子科技大学</span>
        <span style={{ display: "flex", gap: 16 }}>
          <Link href="/glossary" className="hover:opacity-100">
            黑话
          </Link>
          <Link href="/path" className="hover:opacity-100">
            四层 →
          </Link>
        </span>
      </footer>
    </main>
  );
}
