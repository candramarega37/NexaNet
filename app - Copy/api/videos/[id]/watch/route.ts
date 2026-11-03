import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in to save activity." }, { status: 401 });
  const { id } = await params;
  const video = await db.video.findFirst({ where: { id, published: true }, select: { id: true } });
  if (!video) return NextResponse.json({ error: "Video not found." }, { status: 404 });
  await db.activity.create({ data: { userId: user.id, kind: "VIDEO_WATCHED", detail: id } });
  return NextResponse.json({ ok: true });
}
