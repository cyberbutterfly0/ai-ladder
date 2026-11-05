"use client";

import { useEffect, useState } from "react";

/**
 * 火。14 号文件第三版：写意彩墨，四张图交叉淡入。
 * 容器 220×293（3:4），图 1:1 contain，火根在下三分之一，四层靠笔势和颜色递进。
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const SRC: Record<number, string> = {
  1: `${BASE}/fire/01-star.png`,
  2: `${BASE}/fire/02-fuel.png`,
  3: `${BASE}/fire/03-torch.png`,
  4: `${BASE}/fire/04-stove.png`,
};

export default function FireStage({
  level,
  color,
}: {
  level: number;
  color: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="fire-stage"
      style={{ position: "relative", width: 220, height: 293 }}
      aria-hidden
    >
      {[1, 2, 3, 4].map((id) => (
        <img
          key={id}
          src={SRC[id]}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: mounted && id === level ? 1 : 0,
            transition: "opacity 460ms cubic-bezier(0.2, 0, 0, 1)",
            filter: id === level ? "none" : "blur(0.3px)",
          }}
        />
      ))}
    </div>
  );
}
