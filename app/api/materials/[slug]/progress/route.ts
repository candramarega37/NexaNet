import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in to save progress." }, { status: 401 });
  const { slug } = await params;
  const material = await db.material.findFirst({ where: { slug, published: true }, select: { id: true } });
  if (!material) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  const progress = await db.materialProgress.upsert({ where: { userId_materialId: { userId: user.id, materialId: material.id } }, create: { userId: user.id, materialId: material.id, status: "COMPLETED", percent: 100, completedAt: new Date() }, update: { status: "COMPLETED", percent: 100, completedAt: new Date() } });
  await db.activity.create({ data: { userId: user.id, kind: "MATERIAL_COMPLETED", detail: slug } });
  return NextResponse.json({ progress });
}
