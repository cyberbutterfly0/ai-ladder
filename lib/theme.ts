import levelsJson from "@/content/levels.json";
import principlesJson from "@/content/principles.json";

export type LevelId = 1 | 2 | 3 | 4;

export interface CardEntry {
  name: string;
  why: string;
  howTo: string;
}

export interface Level {
  id: LevelId;
  /** 12 号文件：四层改星火 / 薪火 / 举火 / 炉火 */
  name: string;
  /** 元 · 始 / 亨 · 通 / 利 · 和 / 贞 · 正 */
  de: string;
  /** 立春 / 夏至 / 秋分 / 冬至 */
  term: string;
  /** 四季色：青灰 / 赤 / 金 / 玄，只做辅助标识 */
  season: string;
  /** 火光色，界面里唯一允许的彩色 */
  color: string;
  canDo: string;
  line: string;
  person: string;
  cardTitle: string;
  cardCanDo: string;
  /** 做完之后能看到什么 */
  afterDo: string;
  /** 这一层的动作，一句话 */
  task: string;
  /** 动作拆成 01 02 03 */
  steps: string[];
  /** 自检三条：13 号文件，验收改 C 打底，只做事实记录 */
  check: string[];
  /** 完成这层后写进灰烬账本的一句话，要能接在“你上次”后面 */
  done: string;
  pitfall: string;
  pitfallFirst: boolean;
  whereToAsk: string;
  entries: CardEntry[];
}

export interface Principle {
  id: number;
  question: string;
  phenomenon: string;
  explain: string;
  drawing: string;
}

export const LEVELS = levelsJson as unknown as Level[];

export const PRINCIPLES = (principlesJson as unknown as { items: Principle[] })
  .items;
export const PRINCIPLES_INTRO = (
  principlesJson as unknown as { intro: string }
).intro;

export function levelOf(id: number): Level {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

export function principleOf(id: number): Principle | undefined {
  return PRINCIPLES.find((p) => p.id === id);
}

/** 08 第四节的字号表 + 13 第六节：标题 20 / 正文 13 / 说明 12 / 等宽 11 / 微标注 10 */
export const FS = {
  title: "var(--fs-title)",
  /** 层名：13 号文件第二节，宋体 16px / 600 */
  level: "var(--fs-level)",
  body: "var(--fs-body)",
  note: "var(--fs-note)",
  label: "var(--fs-label)",
  mono: "var(--fs-mono)",
  micro: "var(--fs-micro)",
} as const;

/** 13 第四节：墨底、反白文字、次要说明、发丝线 */
export const INK = {
  main: "#ede8dc",
  sub: "#b3ada0",
  line: "rgba(237,232,220,0.12)",
  line2: "rgba(237,232,220,0.26)",
} as const;

/** 13 第四节：朱砂是唯一强调色，只给“当前动作”；描金只做细线 */
export const ACCENT = "#a63b2a";
export const GOLD = "#c9a227";

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
