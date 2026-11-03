import { NextResponse } from "next/server";
import { z } from "zod";
import { getAiProvider } from "@/lib/ai/provider";

const inputSchema = z.object({ symptoms: z.array(z.string().trim().min(2).max(160)).min(1).max(8) });
export async function POST(request: Request) {
  let body: unknown; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid symptom data." }, { status: 400 }); }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Add at least one symptom." }, { status: 400 });
  try { const provider = getAiProvider(); return NextResponse.json({ mode: provider.mode, answer: await provider.respond({ prompt: parsed.data.symptoms.join("; "), context: "troubleshooting" }) }); }
  catch { return NextResponse.json({ error: "Troubleshooting assistant is unavailable." }, { status: 503 }); }
}
