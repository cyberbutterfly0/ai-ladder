import questionsJson from "@/content/questions.json";

export type Kind = "认知" | "行为" | "情境";

export interface Option {
  key: string;
  text: string;
  level: number;
}

export interface Question {
  id: string;
  layer: number;
  kind: Kind;
  scene: string;
  options: Option[];
}

export interface Answer {
  qid: string;
  key: string;
}

export const QUESTIONS = (questionsJson as unknown as { items: Question[] })
  .items;

export const PASS_NEED = (questionsJson as unknown as { passNeed: number })
  .passNeed;

export const LAYERS = [1, 2, 3, 4] as const;

export interface LayerScore {
  layer: number;
  hits: number;
  need: number;
  /** 这一层一共几题，result 页显示 hits/total */
  total: number;
}

export interface Result {
  recommended: number;
  passedLayers: number[];
  scores: LayerScore[];
}

/**
 * 06 文件第五节：同一层选到 2 题及以上 → 判定这层过；
 * 从 L4 往下取最高通过的层作为推荐；一层都不过则兜底 L1。
 * 纯函数，不碰 localStorage、不碰模型。
 */
export function recommend(answers: Answer[]): Result {
  const chosen = new Map(answers.map((a) => [a.qid, a.key]));

  const scores: LayerScore[] = LAYERS.map((layer) => {
    let hits = 0;
    let total = 0;
    for (const q of QUESTIONS) {
      if (q.layer !== layer) continue;
      total += 1;
      const key = chosen.get(q.id);
      if (!key) continue;
      const opt = q.options.find((o) => o.key === key);
      if (opt && opt.level >= layer) hits += 1;
    }
    return { layer, hits, need: PASS_NEED, total };
  });

  const passedLayers = scores
    .filter((s) => s.hits >= s.need)
    .map((s) => s.layer)
    .sort((a, b) => a - b);

  let recommended = 1;
  for (const layer of [4, 3, 2, 1]) {
    if (passedLayers.includes(layer)) {
      recommended = layer;
      break;
    }
  }

  return { recommended, passedLayers, scores };
}

/** 结果页拿这一句当推荐语，先认怂 */
export function recommendLine(level: number): string {
  const lv = { 1: "火种", 2: "篝火", 3: "火把", 4: "炉火" }[level] ?? "火种";
  return `你大概在 L${level} ${lv}。猜的。`;
}
