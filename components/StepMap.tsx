"use client";

import { DUR, EASE, FS, INK, LEVELS } from "@/lib/theme";

export function statusOf(id: number, current: number): string {
  if (id < current) return "烧过了";
  if (id === current) return "正在烧";
  return "还没点";
}

interface Props {
  current: number;
  /** 可点：默认 true（台阶图同时是导航） */
  onPick?: (level: number) => void;
  /** 卡片页用紧凑版：不显示“每级一个人”那行 */
  compact?: boolean;
}

/**
 * 07 第七节：四级台阶，同时是导航。
 * 状态词只用「烧过了 / 正在烧 / 还没点」，每级下面写一个具体的人。
 * 窄屏 2×2，否则四列会把层名挤成竖排。
 */
export default function StepMap({ current, onPick, compact = false }: Props) {
  return (
    <nav
      className="grid w-full auto-rows-fr grid-cols-2 gap-2 md:grid-cols-4"
      aria-label="四级台阶"
    >
      {LEVELS.map((lv) => {
        const active = lv.id === current;
        const passed = lv.id < current;

        const content = (
          <>
            <span className="flex w-full items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: passed || active ? lv.color : "transparent",
                  boxShadow: active ? `0 0 10px ${lv.color}` : "none",
                  border:
                    passed || active
                      ? "1px solid transparent"
                      : `1px solid ${lv.color}66`,
                  transition: `all ${DUR.step}ms ${EASE}`,
                }}
              />
              <span
                className="whitespace-nowrap"
                style={{
                  fontSize: FS.name,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  color: passed || active ? INK.main : INK.faint,
                  transition: `color ${DUR.step}ms ${EASE}`,
                }}
              >
                {lv.name}
              </span>
            </span>

            <span
              className="whitespace-nowrap"
              style={{
                fontSize: FS.mono,
                letterSpacing: "0.5px",
                color: active ? lv.color : INK.faint,
                opacity: active ? 0.9 : 0.55,
              }}
            >
              {statusOf(lv.id, current)}
            </span>

            {!compact && (
              <span
                style={{
                  fontSize: FS.label,
                  color: INK.faint,
                  lineHeight: 1.45,
                  textAlign: "left",
                }}
              >
                {lv.person}
              </span>
            )}
          </>
        );

        const base =
          "flex flex-col items-start gap-0.5 rounded-lg border px-2.5 py-2 text-left";
        const style = {
          borderColor: active ? lv.color : INK.hair,
          background: active ? "rgba(255,255,255,0.04)" : "transparent",
          boxShadow: active ? `0 0 18px -6px ${lv.color}` : "none",
          transition: `border-color ${DUR.step}ms ${EASE}, background ${DUR.step}ms ${EASE}, box-shadow ${DUR.step}ms ${EASE}`,
        } as const;

        if (!onPick) {
          return (
            <div key={lv.id} className={base} style={style}>
              {content}
            </div>
          );
        }

        return (
          <button
            key={lv.id}
            type="button"
            onClick={() => onPick(lv.id)}
            className={`${base} cursor-pointer`}
            style={style}
            aria-current={active ? "step" : undefined}
          >
            {content}
          </button>
        );
      })}
    </nav>
  );
}
