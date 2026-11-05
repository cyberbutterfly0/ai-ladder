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
import { FS, INK, ACCENT, LEVELS, PAD, levelOf } from "@/lib/theme";

/**
 * 12 号文件：层卡片 = 场景 / 动作 / 做完看到什么 / 自检三条。
 * 验收改 C 打底——三条自检全部打勾才记「做过」，不声称「通过了」。
 * 模型建议折叠在底部，标「仅供参考」，不影响解锁。
 */
export default function CardPage() {
  const params = useParams<{ level: string }>();
  const router = useRouter();
  const [p, setP] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [ticked, setTicked] = useState<boolean[]>([false, false, false]);
  const [saved, setSaved] = useState(false);

  const [open, setOpen] = useState(false);
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
  const allTicked = ticked.every(Boolean);

  function toggle(i: number) {
    setTicked((t) => t.map((v, k) => (k === i ? !v : v)));
  }

  function commit() {
    if (!allTicked) return;
    setP(markDone(level, lv.done));
    setSaved(true);
  }

  async function askModel() {
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
    } catch {
      setErr("网络不通，等会儿再试。");
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
      <header className="flex items-baseline justify-between gap-4">
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
        <span className="mono" style={{ fontSize: FS.micro, color: INK.sub }}>
          <span className="readout" style={{ marginRight: 8, opacity: 0.8 }}>
            {String(level).padStart(2, "0")}
          </span>
          <span style={{ marginRight: 8 }}>{lv.name}</span>
          {lv.de}
        </span>
      </header>

      <article style={{ marginTop: 56 }}>
        <p
          className="mono"
          style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.65, margin: 0 }}
        >
          能干什么
        </p>
        <h1
          className="serif"
          style={{
            fontSize: FS.title,
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
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6, paddingTop: 2 }}
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

        <Block label="一次能做完的一件事">
          <p style={{ fontSize: FS.body, lineHeight: 1.7, color: INK.main, margin: 0 }}>
            {lv.task}
          </p>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, marginTop: 14 }}>
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
                  style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.6, paddingTop: 3 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: FS.body, lineHeight: 1.7, color: INK.main }}>{s}</span>
              </li>
            ))}
          </ol>
        </Block>

        <Block label="做完能看到什么">
          <p style={{ fontSize: FS.body, lineHeight: 1.7, color: INK.sub, margin: 0 }}>
            {lv.afterDo}
          </p>
        </Block>

        {!lv.pitfallFirst && pitfall}

        <Block label="卡住了问谁">
          <p style={{ fontSize: FS.body, color: INK.sub, lineHeight: 1.7, margin: 0 }}>
            {lv.whereToAsk}
          </p>
        </Block>

        <Block label="自检三条，真的做到了再打勾">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {lv.check.map((c, i) => (
              <li key={c} style={{ paddingTop: i === 0 ? 0 : 12 }}>
                <label
                  style={{
                    display: "grid",
                    gridTemplateColumns: "18px 1fr",
                    gap: 10,
                    alignItems: "start",
                    cursor: "pointer",
                    fontSize: FS.body,
                    lineHeight: 1.7,
                    color: INK.main,
                    opacity: ticked[i] ? 1 : 0.75,
                    transition: `opacity var(--t-state) ease-out`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={ticked[i]}
                    onChange={() => toggle(i)}
                    disabled={!unlocked || saved}
                    style={{
                      width: 13,
                      height: 13,
                      marginTop: 4,
                      accentColor: ACCENT,
                      cursor: "pointer",
                    }}
                  />
                  <span>{c}</span>
                </label>
              </li>
            ))}
          </ul>
          <p
            className="mono"
            style={{
              fontSize: FS.micro,
              color: INK.sub,
              opacity: 0.62,
              margin: "14px 0 0",
            }}
          >
            只记「做过」，不判「做好」。系统看不到你电脑上发生了什么，这三条你自己认。
          </p>
        </Block>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 24,
            marginTop: 40,
          }}
        >
          {!unlocked ? (
            <span style={{ fontSize: FS.body, color: INK.sub }}>
              这层还没点着。先把「{levelOf(p.current).name}」烧完。
            </span>
          ) : saved ? (
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
                记下了：{lv.done}。
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
                回去看火
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={commit}
                disabled={!allTicked}
                className="transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
                style={{
                  fontSize: FS.body,
                  color: INK.main,
                  opacity: allTicked ? 0.95 : 0.3,
                  paddingBottom: 3,
                  borderBottom: `1px solid ${allTicked ? ACCENT : INK.line2}`,
                }}
              >
                [ 记下这件事 ]
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
                style={{ fontSize: FS.note, color: INK.sub, opacity: 0.62 }}
              >
                今天先看看
              </Link>
            </>
          )}
        </div>

        {unlocked && !saved && (
          <div style={{ marginTop: 28 }}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mono transition-opacity hover:opacity-80"
              style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.65 }}
            >
              {open ? "收起" : "想让 AI 看一眼你写的？"}
            </button>
            {open && (
              <>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  placeholder="写清两件事：你做了什么、它回了什么。"
                  style={{
                    width: "100%",
                    resize: "vertical",
                    marginTop: 12,
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
                <button
                  type="button"
                  onClick={askModel}
                  disabled={!text.trim() || judging}
                  className="transition-opacity hover:opacity-100 disabled:opacity-30"
                  style={{
                    marginTop: 12,
                    fontSize: FS.note,
                    color: INK.main,
                    opacity: 0.7,
                    paddingBottom: 2,
                    borderBottom: `1px solid ${INK.line2}`,
                  }}
                >
                  {judging ? "看看…" : "看看"}
                </button>
                <p
                  className="mono"
                  style={{
                    fontSize: FS.micro,
                    color: INK.sub,
                    opacity: 0.6,
                    margin: "10px 0 0",
                  }}
                >
                  模型判断不可靠（同一句话重跑结果会变），这里只作参考，不影响解锁
                </p>
                {res && (
                  <p style={{ fontSize: FS.body, color: INK.main, opacity: 0.8, lineHeight: 1.7, marginTop: 12 }}>
                    参考：{res.passed ? "看着像做到了。" : res.nextStep}
                  </p>
                )}
                {err && (
                  <p style={{ fontSize: FS.note, color: INK.sub, marginTop: 10 }}>{err}</p>
                )}
              </>
            )}
          </div>
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
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.65, margin: "0 0 14px" }}
      >
        {label}
      </p>
      {children}
    </section>
  );
}
