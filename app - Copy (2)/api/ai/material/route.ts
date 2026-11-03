import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAiProvider } from "@/lib/ai/provider";

const schema = z.object({ slug: z.string().trim().min(1).max(100), question: z.string().trim().min(3).max(1000) });
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Question must be between 3 and 1000 characters." }, { status: 400 });
  const material = await db.material.findFirst({ where: { slug: parsed.data.slug, published: true }, select: { title: true, content: true } });
  if (!material) return NextResponse.json({ error: "Material not found." }, { status: 404 });
  try {
    const provider = getAiProvider();
    const prompt = `Konteks materi "${material.title}":\n${material.content.slice(0, 6000)}\n\nPertanyaan siswa: ${parsed.data.question}`;
    return NextResponse.json({ mode: provider.mode, answer: await provider.respond({ prompt, context: "tutor" }) });
  } catch { return NextResponse.json({ error: "Material assistant is unavailable. Check the AI provider configuration." }, { status: 503 }); }
}
