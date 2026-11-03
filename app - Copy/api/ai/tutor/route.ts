import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiProvider } from "@/lib/ai/provider";

const inputSchema = z.object({ message: z.string().trim().min(3).max(1000) });
export async function POST(request: Request) {
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid message." }, { status: 400 }); }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Write a question between 3 and 1000 characters." }, { status: 400 });
  try { const provider = getAiProvider(); return NextResponse.json({ mode: provider.mode, answer: await provider.respond({ prompt: parsed.data.message, context: "tutor" }) }); }
  catch { return NextResponse.json({ error: "AI service is not configured. Demo mode is available with AI_PROVIDER=mock." }, { status: 503 }); }
}
