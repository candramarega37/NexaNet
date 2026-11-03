import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quiz = await db.quiz.findFirst({ where: { slug, published: true }, select: { slug: true, title: true, description: true, questions: { select: { id: true, prompt: true, options: true } } } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
  return NextResponse.json({ quiz: { ...quiz, questions: quiz.questions.map(question => ({ ...question, options: JSON.parse(question.options) as string[] })) } });
}
