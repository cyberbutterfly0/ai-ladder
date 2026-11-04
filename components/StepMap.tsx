"use client";

import { DUR, EASE, FS, INK, LEVELS } from "@/lib/theme";

export function statusOf(
  id: number,
  current: number,
  skipped: number[] = []
): string {
  if (skipped.includes(id)) return "跳过了";
  if (id < current) return "烧过了";
  if (id === current) return "正在烧";
  return "还没点";
}

/** 四个点沿 45° 斜线从下往上：L1 左下 → L4 右上（百分比坐标） */
const NODES = [
  { x: 12, y: 88 },
  { x: 37, y: 63 },
  { x: 62, y: 38 },
  { x: 87, y: 13 },
];

interface Props {
  current: number;
  /** 直接跳过的层，显示「跳过了」而不是「烧过了」 */
  skipped?: number[];
  /** 点了哪一层 = 镜头推近到该层；不传则不可点 */
  onPick?: (level: number) => void;
}

/**
 * 08 第二节：台阶图是独立页的导航，不是进度条。
 * 四个火点、一条 1px 斜线（已走过实线 / 未走过 dash 4/6），点右侧层名 + 状态词。
 * 不做百分比、不做进度条。
 */
export default function StepMap({ current, skipped = [], onPick }: Props) {
  return (
    <div className="step-path" role="navigation" aria-label="四级台阶">
      <svg
        className="step-path-line"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {NODES.slice(0, -1).map((a, i) => {
          const b = NODES[i + 1];
          const walked = i + 1 < current;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={walked ? INK.line2 : INK.line}
              strokeWidth={0.25}
              strokeDasharray={walked ? undefined : "1.2 1.8"}
              style={{ transition: `stroke ${DUR.step}ms ${EASE}` }}
            />
          );
        })}
      </svg>

      {LEVELS.map((lv, i) => {
        const pos = NODES[i];
        const active = lv.id === current;
        const passed = lv.id < current;
        const skippedHere = skipped.includes(lv.id);
        const lit = passed || active;

        return (
          <button
            key={lv.id}
            type="button"
            className="step-node"
            onClick={() => onPick?.(lv.id)}
            style={{
              left: `calc(${pos.x}% - 10px)`,
              top: `calc(${pos.y}% - 10px)`,
            }}
            aria-current={active ? "step" : undefined}
          >
            <span
              className="step-dot"
              style={{
                background: lit ? lv.color : "transparent",
                border: lit
                  ? "none"
                  : skippedHere
                    ? `1px dashed ${lv.color}`
                    : `1px solid ${INK.line2}`,
                boxShadow: active ? `0 0 12px ${lv.color}99` : "none",
                transition: `all ${DUR.state}ms ease-out`,
              }}
            />
            <span className="step-text">
              <span
                style={{
                  fontSize: FS.body,
                  fontWeight: 400,
                  color: lit ? INK.main : INK.sub,
                }}
              >
                {lv.name}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: FS.micro,
                  color: active ? lv.color : INK.sub,
                }}
              >
                {statusOf(lv.id, current, skipped)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
