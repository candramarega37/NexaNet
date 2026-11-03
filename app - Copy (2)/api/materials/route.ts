import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { materialFilterSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = materialFilterSchema.safeParse({ q: url.searchParams.get("q") ?? undefined, category: url.searchParams.get("category") ?? undefined, difficulty: url.searchParams.get("difficulty") ?? undefined });
  if (!parsed.success) return NextResponse.json({ error: "Invalid filter." }, { status: 400 });
  const { q, category, difficulty } = parsed.data;
  const materials = await db.material.findMany({ where: { published: true, ...(category ? { category } : {}), ...(difficulty ? { difficulty } : {}), ...(q ? { OR: [{ title: { contains: q } }, { description: { contains: q } }] } : {}) }, select: { slug: true, title: true, description: true, category: true, difficulty: true, durationMins: true }, orderBy: { title: "asc" } });
  return NextResponse.json({ materials });
}
