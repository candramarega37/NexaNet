import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const material = await db.material.findFirst({ where: { slug, published: true }, select: { slug: true, title: true, description: true, category: true, difficulty: true, durationMins: true, content: true, objectives: true } });
  if (!material) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  return NextResponse.json({ material });
}
