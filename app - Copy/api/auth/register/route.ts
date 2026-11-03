import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";

const schema = z.object({ name: z.string().trim().min(2).max(80), email: z.string().trim().email().max(254).transform(v => v.toLowerCase()), password: z.string().min(10).max(128) });

export async function POST(request: Request) {
  const rate = await enforceRateLimit(`register:${requestAddress(request)}`, 5, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many sign-ups from this network. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request format." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Provide a name, email, and a password of at least 10 characters." }, { status: 400 });
  try {
    const user = await db.user.create({ data: { name: parsed.data.name, email: parsed.data.email, passwordHash: await hash(parsed.data.password, 12), role: "STUDENT" }, select: { id: true, name: true } });
    await createSession(user.id, request);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return NextResponse.json({ error: "Email is already registered. Please sign in." }, { status: 409 });
    return NextResponse.json({ error: "Registration could not be processed." }, { status: 503 });
  }
}
