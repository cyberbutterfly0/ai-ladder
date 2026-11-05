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

        {/* 知行：两个入口平级并排，同一强度的可点提示 */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 64,
            marginTop: 44,
          }}
        >
          <button
            type="button"
            onClick={() => router.push(`/card/${p.current}`)}
            className="entry-main entry-item"
          >
            <span className="serif">行</span>
            <span className="entry-rule" aria-hidden />
          </button>

          <Link href="/principles" className="entry-main entry-item">
            <span className="serif">知</span>
            <span className="entry-rule" aria-hidden />
          </Link>
        </div>

        {/* AI 术语：比知行弱一级，细线常驻，hover 时两端略微延长 */}
        <p
          className="mono"
          style={{
            fontSize: FS.note,
            marginTop: 34,
            marginBottom: 0,
          }}
        >
          <Link href="/glossary" className="sub-link" style={{ color: INK.sub }}>
            AI 术语
          </Link>
        </p>

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
          <Link href="/quiz" className="sub-link">
            {hasTested ? "再答一遍 12 题" : "不知道从哪层开始？先答 12 题"}
          </Link>
        </p>

        <p
          className="mono"
          style={{
            fontSize: FS.micro,
            color: INK.sub,
            opacity: 0.55,
            marginTop: 18,
            marginBottom: 0,
          }}
        >
          <Link href="/settings" className="sub-link">
            设置
          </Link>
        </p>
      </section>

      <footer
        className="mono text-center"
        style={{
          paddingBottom: 28,
          fontSize: FS.micro,
          color: INK.sub,
          opacity: 0.55,
        }}
      >
        从借火到生火
        <span className="footer-city"> · 杭州电子科技大学</span>
      </footer>
    </main>
  );
}
