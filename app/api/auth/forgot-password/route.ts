import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().trim().email().max(254).transform(v => v.toLowerCase()) });
const generic = { message: "If the email is registered, recovery instructions will be sent." };

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request format." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const emailDigest = createHash("sha256").update(parsed.data.email).digest("hex");
  const rate = await enforceRateLimit(`forgot:${requestAddress(request)}:${emailDigest}`, 3, 15 * 60_000);
  if (!rate.allowed) return NextResponse.json(generic, { status: 200 });
  if (process.env.NODE_ENV === "production" && (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.APP_URL)) return NextResponse.json({ error: "Account recovery service is not configured." }, { status: 503 });
  const user = await db.user.findUnique({ where: { email: parsed.data.email }, select: { id: true, email: true } });
  if (!user) return NextResponse.json(generic);
  await db.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } });
  const token = randomBytes(32).toString("hex");
  await db.passwordResetToken.create({ data: { userId: user.id, tokenHash: createHash("sha256").update(token).digest("hex"), expiresAt: new Date(Date.now() + 30 * 60_000) } });
  const baseUrl = process.env.APP_URL || new URL(request.url).origin;
  if (process.env.NODE_ENV === "production" && new URL(baseUrl).protocol !== "https:") return NextResponse.json({ error: "Account recovery service is not configured." }, { status: 503 });
  const resetUrl = new URL("/reset-password", baseUrl);
  resetUrl.searchParams.set("token", token);
  try {
    const delivery = await sendPasswordResetEmail(user.email, resetUrl.toString());
    return NextResponse.json({ ...generic, ...(delivery.delivered ? {} : process.env.NODE_ENV !== "production" ? { resetUrl: resetUrl.toString() } : {}) });
  } catch {
    return NextResponse.json({ error: "Email service is unavailable. Try again later." }, { status: 503 });
  }
}
