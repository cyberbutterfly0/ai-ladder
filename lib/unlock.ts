import type { Progress } from "./progress";

/**
 * 层级解锁：只做「能不能进」，不做限制性拦截。
 * 06 文件第五节：测评不锁人，台阶图点哪层跳哪层；解锁只是默认顺序。
 */
export function isUnlocked(level: number, p: Progress): boolean {
  return level <= p.current;
}

/** 下一个还没烧过的层；全过了返回 4 */
export function nextLevel(p: Progress): number {
  for (const l of [1, 2, 3, 4]) {
    if (!p.passed.includes(l)) return l;
  }
  return 4;
}

export function allPassed(p: Progress): boolean {
  return [1, 2, 3, 4].every((l) => p.passed.includes(l));
}
