import rubricJson from "@/content/rubric.json";

export interface RubricItem {
  key: string;
  item: string;
  keywords: string[];
}

export interface LevelRubric {
  level: number;
  title: string;
  task: string;
  passNeed: number;
  rubric: RubricItem[];
}

export const RUBRICS = (rubricJson as unknown as { levels: LevelRubric[] })
  .levels;

export function rubricOf(level: number): LevelRubric | null {
  return RUBRICS.find((r) => r.level === level) ?? null;
}

export type GradeSource = "model" | "retry" | "rule";

export interface GradeResult {
  passed: boolean;
  /** 命中判据的 key */
  hits: string[];
  /** 没命中判据的 key */
  missing: string[];
  /** 一句话，没过时告诉人下一步做什么 */
  nextStep: string;
  source: GradeSource;
}

/** 规则兜底：关键词匹配。模型挂了、没配 key、断网都用它。 */
export function gradeByRule(level: number, submission: string): GradeResult {
  const r = rubricOf(level);
  if (!r) {
    return {
      passed: false,
      hits: [],
      missing: [],
      nextStep: "这一层没有判据，检查 rubric.json。",
      source: "rule",
    };
  }

  const text = submission.trim();
  const hits: string[] = [];
  const missing: string[] = [];

  for (const item of r.rubric) {
    const hit = item.keywords.some((k) => text.includes(k));
    (hit ? hits : missing).push(item.key);
  }

  const passed = hits.length >= r.passNeed;
  return {
    passed,
    hits,
    missing,
    nextStep: passed
      ? "可以往上走了。"
      : `再试一次：${r.rubric.find((i) => i.key === missing[0])?.item ?? ""}`,
    source: "rule",
  };
}

const API = "https://api.deepseek.com/chat/completions";

/**
 * 判分 prompt。01 文件第十三节的结论：只在这一个接口返回结构化 JSON。
 * 先找缺失证据，再给结论——比直接问「过没过」严格得多。
 */
export function buildPrompt(level: number, submission: string): string {
  const r = rubricOf(level);
  if (!r) return "";

  const items = r.rubric
    .map((it, i) => `${i + 1}. [${it.key}] ${it.item}`)
    .join("\n");

  return [
    "你在给一个大一学生的「5 分钟练习」判分。只判断他有没有真的做，不评价文笔。",
    "",
    `这一层的练习：${r.task}`,
    "",
    `判据（${r.rubric.length} 条，命中 ${r.passNeed} 条算通过）：`,
    items,
    "",
    "学生的提交：",
    '"""',
    submission.slice(0, 2000),
    '"""',
    "",
    "步骤：",
    "第一步，逐条判断提交里有没有对应证据。有就引用原句，没有就写 null。",
    `第二步，数命中几条，达到 ${r.passNeed} 条就判通过。`,
    "",
    "规则：",
    "- 只有口头承诺、没有具体内容的（如「我做了」「挺好的」「已经弄好了」），一律算没做到。",
    "- 具体内容是：提到了题目/文件/文件名/课程/软件名/具体操作，或贴了 AI 说的话。",
    "- 不要因为对方写得客气、字数多就给过。",
    "",
    "只输出 JSON，不要任何解释：",
    '{"rubric":[{"key":"asked","hit":true,"evidence":"原句或 null"}],"nextStep":"一句话：没过的话下一步具体做什么"}',
  ].join("\n");
}

/** 模型判分一次。解析失败返回 null，由调用方决定重试还是落规则。 */
async function callOnce(
  level: number,
  submission: string,
  apiKey: string,
  signal: AbortSignal
): Promise<{
  hits: string[];
  missing: string[];
  nextStep: string;
} | null> {
  const r = rubricOf(level);
  if (!r) return null;

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: buildPrompt(level, submission) }],
    }),
    signal,
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) return null;

  let parsed: {
    rubric?: { key?: string; hit?: boolean }[];
    nextStep?: string;
  };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed.rubric)) return null;

  const known = new Set(r.rubric.map((i) => i.key));
  const hits = parsed.rubric
    .filter((x) => x.hit === true && typeof x.key === "string" && known.has(x.key))
    .map((x) => x.key as string);
  const missing = r.rubric.map((i) => i.key).filter((k) => !hits.includes(k));

  return {
    hits,
    missing,
    nextStep:
      typeof parsed.nextStep === "string" && parsed.nextStep.trim()
        ? parsed.nextStep.trim().slice(0, 120)
        : hits.length >= r.passNeed
          ? "可以往上走了。"
          : `再试一次：${r.rubric.find((i) => i.key === missing[0])?.item ?? ""}`,
  };
}

/**
 * 判分顺序：规则先算，模型补位。
 *
 * 1. 规则命中 ≥ passNeed → 直接过。快、确定、断网可用，演示时不看网络脸色。
 * 2. 规则没过 → 才叫模型，理解语义（「它说…」「没给答案」这类同义说法）。
 *    模型判过，但要求规则至少命中 1 条——一个具体名词都没有的提交，
 *    模型说过了也不认，防的是「我做了挺好的」被放过。
 * 3. 模型超时/报错/返回不合格式 → 重试 1 次 → 还是不行就用规则结论。
 *
 * 结论：模型永远不能单独决定「过」。
 */
export async function grade(
  level: number,
  submission: string
): Promise<GradeResult> {
  const rule = gradeByRule(level, submission);
  const r = rubricOf(level);
  if (!r) return rule;

  if (rule.passed) return rule;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return rule;

  const attempt = async () => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      return await callOnce(level, submission, apiKey, ctrl.signal);
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const model = (await attempt()) ?? (await attempt());
  if (!model) return rule;

  const modelPassed = model.hits.length >= r.passNeed;
  if (modelPassed && rule.hits.length >= 1) {
    return {
      passed: true,
      hits: model.hits,
      missing: model.missing,
      nextStep: "可以往上走了。",
      source: "model",
    };
  }

  return {
    ...rule,
    nextStep: model.nextStep || rule.nextStep,
  };
}
