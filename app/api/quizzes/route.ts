import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const quizzes = await db.quiz.findMany({ where: { published: true }, select: { slug: true, title: true, description: true, _count: { select: { questions: true } } } });
  return NextResponse.json({ quizzes });
}
