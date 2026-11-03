import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import { hasRole } from "@/lib/authorization.mjs";

const cookieName = "nexanet_session";
const secret = () => {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(value);
};

function isSecureRequest(request: Request) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase();
  if (forwardedProtocol) return forwardedProtocol === "https";
  return new URL(request.url).protocol === "https:";
}

export async function createSession(userId: string, request?: Request) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { sessionVersion: true } });
  if (!user) throw new Error("User not found.");
  const token = await new SignJWT({ sv: user.sessionVersion }).setProtectedHeader({ alg: "HS256" }).setSubject(userId).setIssuedAt().setExpirationTime("7d").sign(secret());
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: request ? isSecureRequest(request) : process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function clearSession() {
  (await cookies()).delete(cookieName);
}

export async function getSessionUser() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const user = await db.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true, role: true, sessionVersion: true } });
    if (!user || payload.sv !== user.sessionVersion) return null;
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!hasRole(user, "ADMIN")) return null;
  return user;
}

export async function requireTeacherOrAdmin() {
  const user = await getSessionUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) return null;
  return user;
}
