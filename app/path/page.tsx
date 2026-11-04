"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepMap from "@/components/StepMap";
import { FS, INK, LEVELS, PAD } from "@/lib/theme";
import {
  emptyProgress,
  loadProgress,
  setLevel,
  type Progress,
} from "@/lib/progress";

/**
 * 08 第三节 2：台阶图独立成页，四个火点沿 45° 斜线从下往上。
 * 12 号文件：台阶补四德与节气，写在台阶图下面一行。
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
      className={`mx-auto flex w-full max-w-[720px] flex-col ${PAD} py-6`}
      style={{ minHeight: "100dvh" }}
    >
      <header
        className="mono flex items-baseline justify-between"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55 }}
      >
        <button
          type="button"
          onClick={() => router.push("/")}
          className="transition-opacity hover:opacity-70"
        >
          ← 终端
        </button>
        <span>四层 · 从借火到生火</span>
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

      <div
        className="mono"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 18px",
          fontSize: FS.micro,
          color: INK.sub,
          opacity: 0.62,
          paddingBottom: 18,
        }}
      >
        {LEVELS.map((l) => (
          <span key={l.id}>
            {l.name} {l.de}
          </span>
        ))}
      </div>

      <footer
        className="mono"
        style={{ fontSize: FS.micro, color: INK.sub, opacity: 0.55 }}
      >
        点任一层进去
      </footer>
    </main>
  );
}
