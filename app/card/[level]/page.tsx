"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import FireStage from "@/components/FireStage";
import StepMap from "@/components/StepMap";
import { loadProgress, markDone, setLevel, type Progress } from "@/lib/progress";
import { FS, INK, LEVELS, levelOf } from "@/lib/theme";
import { emptyProgress } from "@/lib/progress";

export default function CardPage() {
  const params = useParams<{ level: string }>();
  const router = useRouter();
  const [p, setP] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

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

  return (
    <main
      className="mx-auto flex w-full max-w-[980px] flex-col gap-6 px-5 py-5"
      style={{ minHeight: "100dvh" }}
    >
      <StepMap
        current={p.current}
        compact
        onPick={(l) => {
          setLevel(l);
          router.push(`/card/${l}`);
        }}
      />

      <section className="grid gap-8 md:grid-cols-[240px_1fr] md:gap-12">
        <div className="flex flex-col items-center gap-4 md:sticky md:top-6 md:self-start">
          <FireStage color={lv.color} level={lv.id} />
          <div className="text-center">
            <div
              style={{
                fontSize: FS.name,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {lv.name}
            </div>
            <div style={{ fontSize: FS.label, color: INK.faint, marginTop: 4 }}>
              {lv.canDo}
            </div>
          </div>
        </div>

        <article className="pb-6">
          <h1
            style={{
              fontSize: FS.name,
              fontWeight: 600,
              letterSpacing: "0.5px",
            }}
          >
            {lv.cardTitle}
          </h1>
          <p
            style={{
              fontSize: FS.line,
              color: INK.sub,
              lineHeight: 1.65,
              marginTop: 8,
            }}
          >
            {lv.cardCanDo}
          </p>

          {lv.pitfallFirst && (
            <>
              <Section label="先说坑" />
              <Pitfall text={lv.pitfall} />
            </>
          )}

          <blockquote
            style={{
              fontSize: FS.body,
              color: INK.sub,
              lineHeight: 1.65,
              borderLeft: `2px solid ${lv.color}66`,
              paddingLeft: 12,
              margin: "0 0 6px",
            }}
          >
            {lv.line}。
          </blockquote>

          <Section label="有这三样东西" />
          <ul className="flex flex-col gap-4">
            {lv.entries.map((e) => (
              <li key={e.name}>
                <div style={{ fontSize: FS.body, fontWeight: 600 }}>
                  {e.name}
                </div>
                <div
                  style={{
                    fontSize: FS.body,
                    color: INK.sub,
                    lineHeight: 1.65,
                    marginTop: 2,
                  }}
                >
                  {e.why}
                </div>
                <div
                  style={{
                    fontSize: FS.label,
                    color: INK.faint,
                    lineHeight: 1.6,
                    marginTop: 3,
                  }}
                >
                  怎么开：{e.howTo}
                </div>
              </li>
            ))}
          </ul>

          <Section label="今天五分钟" />
          <p
            style={{
              fontSize: FS.body,
              lineHeight: 1.7,
              color: INK.main,
              margin: 0,
            }}
          >
            {lv.fiveMinuteTask}
          </p>

          {!lv.pitfallFirst && (
            <>
              <Section label="别踩" />
              <Pitfall text={lv.pitfall} />
            </>
          )}

          <Section label="卡住了问谁" />
          <p
            style={{
              fontSize: FS.body,
              color: INK.sub,
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {lv.whereToAsk}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            {unlocked ? (
              <button
                type="button"
                onClick={() => {
                  const next = markDone(level, lv.done);
                  setP(next);
                  router.push("/");
                }}
                className="rounded-md px-4 py-2 font-semibold transition-opacity hover:opacity-90"
                style={{
                  fontSize: FS.body,
                  background: lv.color,
                  color: "#0A1024",
                }}
              >
                我做到了
              </button>
            ) : (
              <span style={{ fontSize: FS.body, color: INK.faint }}>
                这层还没点着。先把「{levelOf(p.current).name}」烧完。
              </span>
            )}
            <Link
              href="/"
              style={{ fontSize: FS.body, color: INK.faint }}
              className="hover:opacity-80"
            >
              {unlocked ? "还没做，先回去" : `回去烧 ${levelOf(p.current).name}`}
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}

function Section({ label }: { label: string }) {
  if (!label) return <div style={{ height: 20 }} />;
  return (
    <p
      style={{
        fontSize: FS.label,
        letterSpacing: "1.5px",
        color: "rgba(255,255,255,0.42)",
        marginTop: 26,
        marginBottom: 8,
      }}
    >
      {label}
    </p>
  );
}

function Pitfall({ text }: { text: string }) {
  return (
    <p
      style={{
        fontSize: FS.body,
        lineHeight: 1.65,
        color: "#FFD9C2",
        background: "rgba(255,138,61,0.08)",
        border: "1px solid rgba(255,138,61,0.22)",
        borderRadius: 6,
        padding: "10px 12px",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}
