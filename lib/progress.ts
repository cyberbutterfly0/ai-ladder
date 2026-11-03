export interface Ash {
  date: string;
  text: string;
}

export interface Progress {
  current: number;
  passed: number[];
  /** 直接跳过的层：不等于完成，台阶上显示「跳过了」 */
  skipped: number[];
  recommended?: number;
  answers?: Record<string, string>;
  ashes: Ash[];
  lastSeen?: number;
}

const KEY = "ai-ladder:v1";

export function emptyProgress(): Progress {
  return { current: 1, passed: [], skipped: [], ashes: [] };
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...emptyProgress(),
      ...parsed,
      passed: Array.isArray(parsed.passed) ? parsed.passed : [],
      skipped: Array.isArray(parsed.skipped) ? parsed.skipped : [],
      ashes: Array.isArray(parsed.ashes) ? parsed.ashes : [],
      current:
        typeof parsed.current === "number" && parsed.current >= 1 && parsed.current <= 4
          ? parsed.current
          : 1,
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    KEY,
    JSON.stringify({ ...p, lastSeen: Date.now() })
  );
}

export function setLevel(level: number): Progress {
  const p = loadProgress();
  const next = { ...p, current: level };
  saveProgress(next);
  return next;
}

/** 完成一层的 5 分钟小事：记一笔灰烬，解锁下一层 */
export function markDone(level: number, text: string): Progress {
  const p = loadProgress();
  const passed = Array.from(new Set([...p.passed, level]));
  const next: Progress = {
    ...p,
    passed,
    current: Math.min(4, Math.max(p.current, level + 1)),
    ashes: [...p.ashes, { date: today(), text }],
  };
  saveProgress(next);
  return next;
}

/**
 * 跳过一层：不算完成，台阶上显示「跳过了」，下次直接从下一层开始。
 * 已经会了的人不该被前面的内容卡着走一遍。
 */
export function skipLevel(level: number, name: string): Progress {
  const p = loadProgress();
  const skipped = Array.from(new Set([...p.skipped, level]));
  const next: Progress = {
    ...p,
    skipped,
    current: Math.min(4, Math.max(p.current, level + 1)),
    ashes: [...p.ashes, { date: today(), text: `把「${name}」跳过了` }],
  };
  saveProgress(next);
  return next;
}

export function lastAction(p: Progress): string | null {
  if (!p.ashes.length) return null;
  return p.ashes[p.ashes.length - 1].text;
}

function today(): string {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
