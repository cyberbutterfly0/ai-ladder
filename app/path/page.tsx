"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepMap from "@/components/StepMap";
import { FS, INK } from "@/lib/theme";
import {
  emptyProgress,
  loadProgress,
  setLevel,
  type Progress,
} from "@/lib/progress";

/**
 * 08 第三节 2：台阶图独立成页。
 * 四个火点沿 45° 斜线从下往上，点任一点 = 镜头推近到该层。
 */
export default function PathPage() {
  const router = useRouter();
  const [p, setP] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setP(loadProgress());
    setReady(true);
  }, []);

  return (
    <main
      className="mx-auto flex w-full max-w-[720px] flex-col px-6 py-6 md:px-12"
      style={{ minHeight: "100dvh" }}
    >
      <header
        className="mono flex items-center justify-between"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.35 }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="transition-opacity hover:opacity-70"
        >
          ← 终端
        </button>
        <span>PATH / 04</span>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center">
        {ready && (
          <StepMap
            current={p.current}
            skipped={p.skipped}
            onPick={(n) => {
              setP(setLevel(n));
              router.push(`/card/${n}`);
            }}
          />
        )}
      </section>

      <footer
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.3 }}
      >
        点任一层进去 · 从借火到生火
      </footer>
    </main>
  );
}
