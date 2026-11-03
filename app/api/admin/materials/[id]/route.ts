import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTeacherOrAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({ title: z.string().trim().min(3).max(120).optional(), description: z.string().trim().min(10).max(400).optional(), category: z.string().trim().min(2).max(60).optional(), difficulty: z.enum(["Dasar", "Menengah", "Lanjutan"]).optional(), durationMins: z.number().int().min(1).max(600).optional(), content: z.string().trim().min(30).max(20000).optional(), objectives: z.string().trim().min(5).max(1000).optional(), published: z.boolean().optional() }).refine(value => Object.keys(value).length > 0);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireTeacherOrAdmin()) return NextResponse.json({ error: "Teacher/admin access required." }, { status: 403 });
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid data format." }, { status: 400 }); }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid update data." }, { status: 400 });
  const { id } = await params;
  const found = await db.material.findUnique({ where: { id }, select: { id: true } });
  if (!found) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  return NextResponse.json({ material: await db.material.update({ where: { id }, data: parsed.data }) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireTeacherOrAdmin()) return NextResponse.json({ error: "Teacher/admin access required." }, { status: 403 });
  const { id } = await params;
  const found = await db.material.findUnique({ where: { id }, select: { id: true } });
  if (!found) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  await db.material.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
