import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTeacherOrAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const materialInput = z.object({ slug: z.string().trim().min(3).max(90).regex(/^[a-z0-9-]+$/), title: z.string().trim().min(3).max(120), description: z.string().trim().min(10).max(400), category: z.string().trim().min(2).max(60), difficulty: z.enum(["Dasar", "Menengah", "Lanjutan"]), durationMins: z.number().int().min(1).max(600), content: z.string().trim().min(30).max(20000), objectives: z.string().trim().min(5).max(1000), published: z.boolean().default(false) });

export async function GET() {
  if (!await requireTeacherOrAdmin()) return NextResponse.json({ error: "Teacher/admin access required." }, { status: 403 });
  return NextResponse.json({ materials: await db.material.findMany({ orderBy: { updatedAt: "desc" }, select: { id: true, slug: true, title: true, category: true, difficulty: true, published: true, updatedAt: true } }) });
}

export async function POST(request: Request) {
  if (!await requireTeacherOrAdmin()) return NextResponse.json({ error: "Teacher/admin access required." }, { status: 403 });
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid data format." }, { status: 400 }); }
  const parsed = materialInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Check the material fields again.", issues: parsed.error.issues }, { status: 400 });
  const material = await db.material.create({ data: parsed.data });
  return NextResponse.json({ material }, { status: 201 });
}
