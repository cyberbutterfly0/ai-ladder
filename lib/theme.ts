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
  /** 08 第三节 3：5 分钟小事拆成 01 02 03 三步 */
  steps: string[];
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

/** 08 第四节的字号表：标题 20 / 正文 13 / 说明 12 / 等宽 11 / 微标注 10 */
export const FS = {
  title: "var(--fs-title)",
  body: "var(--fs-body)",
  note: "var(--fs-note)",
  mono: "var(--fs-mono)",
  micro: "var(--fs-micro)",
} as const;

/** 08 第四节的颜色表。主副文字之外一律用 opacity 表达层级。 */
export const INK = {
  main: "#e6eaf0",
  sub: "#7a8493",
  line: "rgba(230,236,244,0.10)",
  line2: "rgba(230,236,244,0.22)",
} as const;

/** 08 第四节动效表：进入 460 / 返回 360 / 台阶切换 500 / 状态 160 */
export const DUR = {
  enter: 460,
  back: 360,
  step: 500,
  state: 160,
} as const;

export const EASE = "cubic-bezier(0.2, 0, 0, 1)";

/** 桌面 48px、手机 24px 的页面左右留白 */
export const PAD = "px-6 md:px-12";
