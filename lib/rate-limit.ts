import { createHash, randomUUID } from "node:crypto";
import { db } from "@/lib/db";

export async function enforceRateLimit(key: string, limit: number, windowMs: number) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowMs);
  const safeKey = createHash("sha256").update(key).digest("hex");
  await db.$executeRaw`INSERT INTO "nexanet_app"."RateLimitBucket" AS bucket ("id", "key", "hits", "windowStart", "updatedAt") VALUES (${randomUUID()}, ${safeKey}, 1, ${now}, ${now}) ON CONFLICT("key") DO UPDATE SET "hits" = CASE WHEN bucket."windowStart" <= ${cutoff} THEN 1 ELSE bucket."hits" + 1 END, "windowStart" = CASE WHEN bucket."windowStart" <= ${cutoff} THEN ${now} ELSE bucket."windowStart" END, "updatedAt" = ${now}`;
  const bucket = await db.rateLimitBucket.findUnique({ where: { key: safeKey }, select: { hits: true } });
  if (Math.random() < 0.01) await db.rateLimitBucket.deleteMany({ where: { windowStart: { lt: new Date(now.getTime() - 86_400_000) } } });
  return { allowed: (bucket?.hits ?? limit + 1) <= limit, retryAfter: Math.max(1, Math.ceil(windowMs / 1000)) };
}

export function requestAddress(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
