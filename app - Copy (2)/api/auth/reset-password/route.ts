import { createHash } from "node:crypto";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";

const schema = z.object({ token: z.string().length(64), password: z.string().min(10).max(128) });
export async function POST(request: Request) {
  const rate = await enforceRateLimit(`reset:${requestAddress(request)}`, 5, 15 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request format." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid link or password." }, { status: 400 });
  const tokenHash = createHash("sha256").update(parsed.data.token).digest("hex");
  const candidate = await db.passwordResetToken.findFirst({ where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } }, select: { id: true, userId: true } });
  if (!candidate) return NextResponse.json({ error: "Link has expired or was already used. Request a new link." }, { status: 400 });
  const passwordHash = await hash(parsed.data.password, 12);
  const consumed = await db.$transaction(async tx => {
    const result = await tx.passwordResetToken.updateMany({ where: { id: candidate.id, usedAt: null, expiresAt: { gt: new Date() } }, data: { usedAt: new Date() } });
    if (result.count !== 1) return false;
    await tx.user.update({ where: { id: candidate.userId }, data: { passwordHash, sessionVersion: { increment: 1 } } });
    return true;
  });
  if (!consumed) return NextResponse.json({ error: "Link has expired or was already used. Request a new link." }, { status: 400 });
  return NextResponse.json({ message: "Password updated successfully. Please sign in again." });
}
