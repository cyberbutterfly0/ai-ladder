import { chromium } from "playwright-core";
import fs from "node:fs";

const EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://127.0.0.1:3000";
const SHOTS = "E:/dsh结算/考核/项目/ai-ladder/.shots";
fs.mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch({ executablePath: EXE, headless: true });

const probe = () =>
  document.fonts
    ? (async () => {
        const se = document.scrollingElement;
        let maxFs = 0;
        let maxText = "";
        for (const el of document.querySelectorAll("body *")) {
          const st = getComputedStyle(el);
          if (st.display === "none" || st.visibility === "hidden") continue;
          if (parseFloat(st.opacity) === 0) continue;
          const hasText = [...el.childNodes].some(
            (n) => n.nodeType === 3 && n.textContent.trim()
          );
          if (!hasText) continue;
          const fs = parseFloat(st.fontSize);
          if (fs > maxFs) {
            maxFs = fs;
            maxText = el.textContent.trim().slice(0, 24);
          }
        }
        const clipped = [];
        for (const el of document.querySelectorAll("body *")) {
          const st = getComputedStyle(el);
          if (st.display === "none" || st.visibility === "hidden") continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.bottom > window.innerHeight + 1 || r.right > window.innerWidth + 1) {
            clipped.push(
              `${el.tagName}.${String(el.className).slice(0, 30)} b=${Math.round(
                r.bottom
              )} r=${Math.round(r.right)}`
            );
          }
        }
        return {
          vh: window.innerHeight,
          vw: window.innerWidth,
          scrollH: se.scrollHeight,
          overflows: se.scrollHeight > window.innerHeight + 1,
          maxFontSize: maxFs,
          maxFontText: maxText,
          clipped: clipped.slice(0, 6),
          clippedCount: clipped.length,
        };
      })()
    : null;

async function measure(path, w, h, name) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const r = await page.evaluate(probe);
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
  console.log(name, JSON.stringify(r));
  await ctx.close();
  return r;
}

// 已解锁状态的卡片页：先注入进度再进页面
async function measureUnlocked(path, w, h, name) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() =>
    localStorage.setItem(
      "ai-ladder:v1",
      JSON.stringify({
        current: 2,
        passed: [1],
        skipped: [],
        ashes: [{ date: "11/03", text: "问它了明天那几道作业题" }],
      })
    )
  );
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const r = await page.evaluate(probe);
  await page.screenshot({ path: `${SHOTS}/${name}.png` });
  console.log(name, JSON.stringify(r));
  await ctx.close();
  return r;
}

await measure("/", 1440, 900, "home-1440");
await measure("/", 390, 844, "home-390");
await measure("/path", 1440, 900, "path-1440");
await measure("/path", 390, 844, "path-390");
await measure("/quiz", 1440, 900, "test-1440");
await measure("/quiz", 390, 844, "test-390");
await measure("/card/2", 1440, 900, "card-1440");
await measure("/glossary", 1440, 900, "glossary-1440");
await measureUnlocked("/card/1", 1440, 900, "card1-1440");
await measureUnlocked("/card/1", 390, 844, "card1-390");

// 走一遍完整流程：12 题 → 结果 → 卡片 → 我做到了 → 首页
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto(BASE + "/quiz", { waitUntil: "networkidle" });
for (let i = 0; i < 12; i++) {
  await page.locator("main section div button").first().click();
  await page.waitForTimeout(420);
}
await page.waitForURL("**/result", { timeout: 8000 });
await page.waitForTimeout(800);
console.log("result url:", page.url());
console.log(
  "result text:",
  (await page.locator("main").innerText()).replace(/\n+/g, " | ")
);
await page.screenshot({ path: `${SHOTS}/result.png` });

await page.getByRole("button", { name: "去这层看看" }).click();
await page.waitForTimeout(800);
console.log("card url:", page.url());
await page.screenshot({ path: `${SHOTS}/card-after.png` });

// 卡片页：三条自检全打勾 → 记下这件事（C 打底，不判好坏）
const boxes = page.locator('input[type="checkbox"]');
const boxCount = await boxes.count();
const commitBtn = page.getByRole("button", { name: "记下这件事" });
console.log("checkboxes:", boxCount, "| 未打勾时禁用:", await commitBtn.isDisabled());
for (let k = 0; k < boxCount; k++) await boxes.nth(k).check();
await page.waitForTimeout(200);
console.log("全打勾后可点:", !(await commitBtn.isDisabled()));
await commitBtn.click();
await page.waitForTimeout(600);
console.log(
  "card pass:",
  (await page.locator("main").innerText()).replace(/\n+/g, " | ").slice(-120)
);
await page.screenshot({ path: `${SHOTS}/card-pass.png` });

await page.getByRole("link", { name: "回终端看火" }).click();
await page.waitForTimeout(1200);
console.log("after done url:", page.url());
console.log(
  "home text:",
  (await page.locator("main").innerText()).replace(/\n+/g, " | ")
);
await page.screenshot({ path: `${SHOTS}/home-after.png` });
console.log("progress:", await page.evaluate(() => localStorage.getItem("ai-ladder:v1")));
console.log("errors:", JSON.stringify(errors));

await ctx.close();
await browser.close();
