import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import { credentialsSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";

export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request format." }, { status: 400 }); }
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  const address = requestAddress(request);
  const rateKey = address === "unknown" ? `login:account:${parsed.data.email.toLowerCase()}` : `login:${address}`;
  let user;
  try {
    const rate = await enforceRateLimit(rateKey, 10, 15 * 60_000);
    if (!rate.allowed) return NextResponse.json({ error: "Too many attempts. Try again in a few minutes." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
    user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    console.error("[auth/login] database request failed", { code });
    return NextResponse.json({ error: "Login service is temporarily unavailable." }, { status: 503 });
  }
  if (!user || !(await compare(parsed.data.password, user.passwordHash))) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  try { await createSession(user.id, request); } catch { return NextResponse.json({ error: "Session is not configured. Make sure AUTH_SECRET is set." }, { status: 503 }); }
  return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } });
}
