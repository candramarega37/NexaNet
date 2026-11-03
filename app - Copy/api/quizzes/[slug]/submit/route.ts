import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { scoreAnswers } from "@/lib/quiz-scoring.mjs";

const submissionSchema = z.object({ answers: z.array(z.number().int().min(0).max(20)).min(1).max(100) });

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in to submit answers." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid answer format." }, { status: 400 }); }
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid answers." }, { status: 400 });
  const { slug } = await params;
  const quiz = await db.quiz.findFirst({ where: { slug, published: true }, include: { questions: true } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  if (parsed.data.answers.length !== quiz.questions.length) return NextResponse.json({ error: "Answer count does not match." }, { status: 400 });
  const result = scoreAnswers(parsed.data.answers, quiz.questions.map(question => question.correctAnswer));
  const { score } = result;
  const attempt = await db.quizAttempt.create({ data: { userId: user.id, quizId: quiz.id, score, answers: JSON.stringify(parsed.data.answers) } });
  await db.activity.create({ data: { userId: user.id, kind: "QUIZ_COMPLETED", detail: `${quiz.slug}:${score}` } });
  return NextResponse.json({ ...result, explanations: quiz.questions.map((question, index) => ({ correct: parsed.data.answers[index] === question.correctAnswer, explanation: question.explanation })) , attemptId: attempt.id });
}
