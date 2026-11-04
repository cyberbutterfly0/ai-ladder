"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  emptyProgress,
  loadProgress,
  markDone,
  skipLevel,
  type Progress,
} from "@/lib/progress";
import type { GradeResult } from "@/lib/grade";
import { FS, INK, LEVELS, PAD, levelOf } from "@/lib/theme";

/**
 * 08 第三节 3：细线分块，能干什么 20px 是这一页唯一大字，其余 13px。
 * 顶部只有「← 终端」和「02 / 篝火」，不放台阶图、不放火图。
 */
export default function CardPage() {
  const params = useParams<{ level: string }>();
  const router = useRouter();
  const [p, setP] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  const [text, setText] = useState("");
  const [judging, setJudging] = useState(false);
  const [res, setRes] = useState<GradeResult | null>(null);
  const [err, setErr] = useState("");

  const level = Number(params.level);
  const valid = LEVELS.some((l) => l.id === level);
  const lv = levelOf(valid ? level : 1);

  useEffect(() => {
    setP(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!valid) router.replace("/");
  }, [valid, router]);

  if (!valid) return null;

  const unlocked = ready && level <= p.current;

  async function submit() {
    const submission = text.trim();
    if (!submission || judging) return;
    setJudging(true);
    setErr("");
    setRes(null);
    try {
      const r = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, submission }),
      });
      const j = (await r.json()) as GradeResult & { error?: string };
      if (!r.ok) {
        setErr(j.error ?? "没交上去，再试一次");
        return;
      }
      setRes(j);
      if (j.passed) setP(markDone(level, lv.done));
    } catch {
      setErr("网络不通。先把做了什么写下来，等会儿再交。");
    } finally {
      setJudging(false);
    }
  }

  const pitfall = (
    <Block label={lv.pitfallFirst ? "先说坑" : "坑"}>
      <p style={{ fontSize: FS.body, lineHeight: 1.7, color: INK.main, opacity: 0.85, margin: 0 }}>
        {lv.pitfall}
      </p>
    </Block>
  );

  return (
    <main
      className={`mx-auto w-full max-w-[720px] ${PAD} py-6`}
      style={{ minHeight: "100dvh" }}
    >
      <header className="flex items-center justify-between">
        <Link
          href="/"
          className="mono transition-opacity hover:opacity-70"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6 }}
        >
          ← 终端
        </Link>
        <span className="mono" style={{ fontSize: FS.micro, color: INK.sub }}>
          <span className="readout" style={{ marginRight: 8, opacity: 0.8 }}>
            {String(level).padStart(2, "0")}
          </span>
          {lv.name}
        </span>
      </header>

      <article style={{ marginTop: 56 }}>
        <p
          className="mono"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.5, margin: 0 }}
        >
          能干什么
        </p>
        <h1
          style={{
            fontSize: FS.title,
            fontWeight: 500,
            letterSpacing: "0.02em",
            lineHeight: 1.4,
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          {lv.cardCanDo}
        </h1>

        {lv.pitfallFirst && pitfall}

        <Block label="三个入口">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {lv.entries.map((e, i) => (
              <li
                key={e.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  gap: 8,
                  paddingTop: i === 0 ? 0 : 20,
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.4, paddingTop: 2 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span style={{ fontSize: FS.body, color: INK.main }}>{e.name}</span>
                  <span style={{ display: "block", fontSize: FS.body, color: INK.sub, lineHeight: 1.7, marginTop: 2 }}>
                    {e.why}
                  </span>
                  <span style={{ display: "block", fontSize: FS.note, color: INK.sub, opacity: 0.7, lineHeight: 1.6, marginTop: 4 }}>
                    怎么开：{e.howTo}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Block>

        <Block label="今天五分钟">
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {lv.steps.map((s, i) => (
              <li
                key={s}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px 1fr",
                  gap: 8,
                  paddingTop: i === 0 ? 0 : 14,
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.4, paddingTop: 3 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: FS.body, lineHeight: 1.7, color: INK.main }}>{s}</span>
              </li>
            ))}
          </ol>
        </Block>

        {!lv.pitfallFirst && pitfall}

        <Block label="卡住了问谁">
          <p style={{ fontSize: FS.body, color: INK.sub, lineHeight: 1.7, margin: 0 }}>
            {lv.whereToAsk}
          </p>
        </Block>

        <Block label="做完了？说说你刚才怎么做的">
          {unlocked && !res?.passed ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="写清两件事：你做了什么、它回了什么。只写「我做了」会被拦下来。"
                style={{
                  width: "100%",
                  resize: "vertical",
                  fontSize: FS.body,
                  lineHeight: 1.7,
                  color: INK.main,
                  background: "var(--surface)",
                  border: 0,
                  borderRadius: 0,
                  padding: "12px 14px",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              />
              <p
                className="mono"
                style={{
                  fontSize: FS.micro,
                  color: INK.sub,
                  opacity: 0.45,
                  margin: "10px 0 0",
                }}
              >
                只在你这台电脑上判断，不存原文
                {text.length > 0 ? ` · ${text.length}/2000` : ""}
              </p>
            </>
          ) : (
            <p style={{ fontSize: FS.body, color: INK.sub, margin: 0, lineHeight: 1.7 }}>
              {res?.passed
                ? `记下来了：${lv.done}。`
                : `这层还没点着。先把「${levelOf(p.current).name}」烧完。`}
            </p>
          )}
        </Block>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 24,
            marginTop: 48,
          }}
        >
          {!unlocked ? (
            <span style={{ fontSize: FS.body, color: INK.sub }}>
              这层还没点着。先把「{levelOf(p.current).name}」烧完。
            </span>
          ) : res?.passed ? (
            <>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: FS.body,
                  color: INK.main,
                }}
              >
                <span
                  aria-hidden
                  className="inline-block rounded-full"
                  style={{ width: 6, height: 6, background: lv.color }}
                />
                过了。
              </span>
              {level < 4 && (
                <Link
                  href={`/card/${level + 1}`}
                  className="transition-opacity hover:opacity-70"
                  style={{ fontSize: FS.body, color: INK.main, opacity: 0.85 }}
                >
                  去下一层 →
                </Link>
              )}
              <Link
                href="/"
                className="transition-opacity hover:opacity-70"
                style={{ fontSize: FS.body, color: INK.sub }}
              >
                回终端看火
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={submit}
                disabled={!text.trim() || judging}
                className="transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  fontSize: FS.body,
                  color: INK.main,
                  opacity: 0.9,
                  paddingBottom: 3,
                  borderBottom: `1px solid ${INK.line2}`,
                }}
              >
                {judging ? "看看…" : "[ 交一下 ]"}
              </button>

              {level < 4 && (
                <button
                  type="button"
                  onClick={() => {
                    const next = skipLevel(level, lv.name);
                    setP(next);
                    router.push("/");
                  }}
                  className="transition-opacity hover:opacity-80"
                  style={{ fontSize: FS.body, color: INK.sub, opacity: 0.55 }}
                  title="已经会了？跳过这一层，下次直接从下一层开始"
                >
                  这层我会了，跳过
                </button>
              )}

              <Link
                href="/glossary"
                className="transition-opacity hover:opacity-80"
                style={{ fontSize: FS.note, color: INK.sub, opacity: 0.45 }}
              >
                今天先看看
              </Link>
            </>
          )}
        </div>

        {res && !res.passed && (
          <p
            style={{
              fontSize: FS.body,
              color: INK.main,
              opacity: 0.85,
              lineHeight: 1.7,
              marginTop: 20,
              marginBottom: 0,
            }}
          >
            {res.nextStep}
          </p>
        )}
        {err && (
          <p style={{ fontSize: FS.note, color: INK.sub, marginTop: 12 }}>{err}</p>
        )}
      </article>
    </main>
  );
}

/** 1px 细线 + 小标题 + 内容。08：分组靠线，不靠卡片。 */
function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ height: 1, background: INK.line, marginBottom: 16 }} />
      <p
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.5, margin: "0 0 14px" }}
      >
        {label}
      </p>
      {children}
    </section>
  );
}
