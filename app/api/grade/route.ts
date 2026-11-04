import { NextResponse } from "next/server";
import { grade } from "@/lib/grade";

const MAX = 2000;

export async function POST(req: Request) {
  let body: { level?: unknown; submission?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是 JSON" }, { status: 400 });
  }

  const level = Number(body.level);
  const submission =
    typeof body.submission === "string" ? body.submission.trim() : "";

  if (!Number.isInteger(level) || level < 1 || level > 4) {
    return NextResponse.json(
      { error: "level 只能是 1 / 2 / 3 / 4" },
      { status: 400 }
    );
  }
  if (!submission) {
    return NextResponse.json({ error: "submission 不能为空" }, { status: 400 });
  }
  if (submission.length > MAX) {
    return NextResponse.json(
      { error: `submission 不能超过 ${MAX} 字` },
      { status: 400 }
    );
  }

  const result = await grade(level, submission);
  return NextResponse.json(result);
}
