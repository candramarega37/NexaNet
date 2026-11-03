import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAiProvider } from "@/lib/ai/provider";

const inputSchema = z.object({ quizSlug: z.string().trim().min(1).max(90), questionIndex: z.number().int().min(0).max(99) });
export async function POST(request: Request) {
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid hint data." }, { status: 400 });
  const quiz = await db.quiz.findFirst({ where: { slug: parsed.data.quizSlug, published: true }, include: { questions: { select: { prompt: true } } } });
  const question = quiz?.questions[parsed.data.questionIndex];
  if (!question) return NextResponse.json({ error: "Question not found." }, { status: 404 });
  try { const provider = getAiProvider(); return NextResponse.json({ mode: provider.mode, hint: await provider.respond({ prompt: question.prompt, context: "quiz-hint" }) }); }
  catch { return NextResponse.json({ error: "Hint service is unavailable." }, { status: 503 }); }
}
