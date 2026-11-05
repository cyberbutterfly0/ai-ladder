"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FS, INK, LEVELS, PAD } from "@/lib/theme";
import {
  emptyProgress,
  loadProgress,
  setLevel,
  type Progress,
} from "@/lib/progress";
import { isUnlocked } from "@/lib/unlock";

/**
 * 设置。取代原来首页底部的「四层 →」。
 * 账号、API key、其他都是条目本身，不写状态标注；学习等级是真的，点进去是层卡。
 */
export default function SettingsPage() {
  const router = useRouter();
  const [p, setP] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setP(loadProgress());
    setReady(true);
  }, []);

  return (
    <main
      className={`mx-auto w-full max-w-[720px] ${PAD} py-6`}
      style={{ minHeight: "100dvh" }}
    >
      <header
        className="mono flex items-baseline justify-between"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55 }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="transition-opacity hover:opacity-100"
          style={{ padding: "12px 8px", margin: "-12px -8px" }}
        >
          ← 返回
        </button>
        <span>设置</span>
      </header>

      <h1
        className="serif"
        style={{
          fontSize: FS.title,
          letterSpacing: "0.5px",
          margin: "56px 0 0",
        }}
      >
        设置
      </h1>

      <Group label="账号">
        <Row label="用户账号" value="未登录" />
        <Row label="昵称" value="—" />
      </Group>

      <Group label="学习等级">
        <div className="level-line">
          <span className="level-track" aria-hidden />
          {LEVELS.map((l, i) => {
            const on = ready && p.current === l.id;
            // 解锁限制：步骤条的通行做法是「前一步没完成就禁用后面的」，
            // 见 17 号方案第 3 节的 Tchibo / Helsinki 规范。
            // 这一版先关掉——展示阶段要让老师能一次点开四层看完内容。
            // 恢复时把 LOCKED 改回 true 即可，下面一行不用动。
            const LOCKED = false;
            const open = ready && (!LOCKED || isUnlocked(l.id, p));
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setP(setLevel(l.id))}
                disabled={!open}
                className={`level-dot${on ? " is-on" : ""}${open ? "" : " is-locked"}`}
                style={{ left: `${((i + 0.5) / LEVELS.length) * 100}%` }}
                aria-label={l.name}
                aria-pressed={on}
              >
                <span
                  className="level-mark"
                  aria-hidden
                  style={
                    on
                      ? {
                          background: l.color,
                          boxShadow: `0 0 8px 2px ${l.color}40`,
                        }
                      : undefined
                  }
                />
                <span className="level-name">{l.name}</span>
              </button>
            );
          })}
        </div>
      </Group>

      <Group label="API key">
        <Row label="DeepSeek" value="未设置" />
      </Group>

      <Group label="其他">
        <Row label="主题" value="墨色" />
        <Row label="字号" value="标准" />
        <Row label="版本" value="0.1" />
      </Group>
    </main>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 44 }}>
      <p
        className="mono"
        style={{
          fontSize: FS.micro,
          color: INK.sub,
          opacity: 0.65,
          margin: "0 0 2px",
        }}
      >
        {label}
      </p>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 16,
        padding: "13px 0",
        borderBottom: `1px solid ${INK.line}`,
      }}
    >
      <span
        className="row-label"
        style={{ fontSize: FS.body, color: INK.main }}
      >
        {label}
      </span>
      <span
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.8 }}
      >
        {value}
      </span>
    </div>
  );
}
