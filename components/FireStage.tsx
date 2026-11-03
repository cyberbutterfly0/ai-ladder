"use client";

import type { CSSProperties } from "react";

interface Props {
  color: string;
  level: number;
}

/**
 * 骨架阶段的火位占位。
 * 交接文档 01 第 6 行：视觉只做骨架，火图、配色、动画都可能被推翻，这里不做细化。
 * 四张火图到位后，整个组件替换成 <Image />，父级布局不变。
 */
export default function FireStage({ color, level }: Props) {
  return (
    <div
      className="fire-stage"
      style={{ "--fire": color } as CSSProperties}
      aria-hidden
    >
      <div className="fire-placeholder">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: color }}
        />
        L{level} 火图占位
      </div>
    </div>
  );
}
