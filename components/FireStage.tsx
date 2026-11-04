"use client";

import type { CSSProperties } from "react";

/**
 * 火。08 第三节：220×293，首屏居中偏上，全站唯一有颜色的东西。
 * 四张冷调火图到位后，只把 .fire-glow / .fire-core 换成 background-image，不动布局。
 */
export default function FireStage({ color }: { color: string }) {
  return (
    <div
      className="fire-stage"
      style={{ "--fire": color } as CSSProperties}
      aria-hidden
    >
      <div className="fire-glow" />
      <div className="fire-core" />
    </div>
  );
}
