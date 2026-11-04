// 推荐结果的一致性检查：同一个选项位全程选同一列，看推荐层是否单调递增
import { chromium } from "playwright-core";

const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://127.0.0.1:3000";

const browser = await chromium.launch({ executablePath: EXE, headless: true });

async function run(label, pick) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/test", { waitUntil: "networkidle" });
  for (let i = 0; i < 12; i++) {
    const btns = page.locator("main section button");
    const n = await btns.count();
    await btns.nth(Math.min(pick(i), n - 1)).click();
    await page.waitForTimeout(300);
  }
  await page.waitForURL("**/result", { timeout: 8000 });
  await page.waitForTimeout(700);
  const t = (await page.locator("main").innerText()).replace(/\n+/g, " | ");
  const rec = t.match(/你大概在 L(\d)/)?.[1] ?? "?";
  const passed = (t.match(/过了：([^|]*)/)?.[1] ?? "").trim();
  console.log(label.padEnd(18), "推荐 L" + rec, "| 过了:", passed);
  await ctx.close();
  return Number(rec);
}

const a = await run("全选 A", () => 0);
const b = await run("全选 B", () => 1);
const c = await run("全选 C", () => 2);
const d = await run("全选 D", () => 3);
const mix = await run("前 6 题 A 后 6 题 D", (i) => (i < 6 ? 0 : 3));

console.log("---");
console.log("A→B→C→D 是否不下降:", a <= b && b <= c && c <= d ? "是" : "否");
console.log("混合组:", mix);

await browser.close();
