import { PrismaClient } from "@prisma/client";
import { materials } from "./materials.mjs";

try { process.loadEnvFile(); } catch (error) { if (error?.code !== "ENOENT") throw error; }

const db = new PrismaClient();
try {
  for (const material of materials) {
    const { slug, ...data } = material;
    const result = await db.material.updateMany({ where: { slug }, data });
    console.log(`${slug}: ${result.count ? "updated" : "not found"}`);
  }
} finally {
  await db.$disconnect();
}
