import levelsJson from "@/content/levels.json";

export type LevelId = 1 | 2 | 3 | 4;

export interface CardEntry {
  name: string;
  why: string;
  howTo: string;
}

export interface Level {
  id: LevelId;
  name: string;
  canDo: string;
  line: string;
  person: string;
  color: string;
  cardTitle: string;
  cardCanDo: string;
  entries: CardEntry[];
  fiveMinuteTask: string;
  /** 完成这层后写进灰烬账本的一句话，要能接在“你上次”后面 */
  done: string;
  pitfall: string;
  pitfallFirst: boolean;
  whereToAsk: string;
}

export const LEVELS = levelsJson as unknown as Level[];

export function levelOf(id: number): Level {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

/** 07 文件第二节的字号表：桌面 / 窄屏两档，统一走 CSS 变量 */
export const FS = {
  hint: "var(--fs-hint)",
  name: "var(--fs-name)",
  line: "var(--fs-line)",
  body: "var(--fs-body)",
  label: "var(--fs-label)",
  mono: "var(--fs-mono)",
} as const;

export const INK = {
  main: "rgba(255,255,255,0.92)",
  sub: "rgba(255,255,255,0.72)",
  faint: "rgba(255,255,255,0.45)",
  hair: "rgba(255,255,255,0.12)",
} as const;

/** 07 第五节/第六节：层间切换 600ms，进阶 900ms */
export const DUR = {
  switch: 600,
  text: 400,
  textDelay: 120,
  body: 300,
  bodyDelay: 240,
  step: 500,
  advance: 900,
} as const;

export const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
