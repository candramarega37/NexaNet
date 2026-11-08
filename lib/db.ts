import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getRuntimeDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required.");

  const url = new URL(value);
  url.searchParams.set("schema", "nexanet_app");
  return url.toString();
}

export const db = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: getRuntimeDatabaseUrl() });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
