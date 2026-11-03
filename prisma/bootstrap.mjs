import { createHash, randomUUID } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

try { process.loadEnvFile(); } catch (error) { if (error?.code !== "ENOENT") throw error; }
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
if (!databaseUrl.startsWith("file:")) throw new Error("Local bootstrap supports SQLite file URLs only. Use Prisma migrate deploy for other providers.");
const databaseName = decodeURIComponent(databaseUrl.slice("file:".length).split("?")[0]);
const databasePath = databaseName === ":memory:" ? ":memory:" : databaseName.startsWith("/") ? databaseName : resolve(projectRoot, "prisma", databaseName);
const database = new DatabaseSync(databasePath);
database.exec("PRAGMA foreign_keys = ON;");
database.exec(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "checksum" TEXT NOT NULL,
  "finished_at" DATETIME,
  "migration_name" TEXT NOT NULL,
  "logs" TEXT,
  "rolled_back_at" DATETIME,
  "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0
);`);

const migrationsDir = resolve(projectRoot, "prisma", "migrations_sqlite");
const directories = readdirSync(migrationsDir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
for (const name of directories) {
  const path = resolve(migrationsDir, name, "migration.sql");
  if (!existsSync(path)) continue;
  const sqlBytes = readFileSync(path);
  const checksum = createHash("sha256").update(sqlBytes).digest("hex");
  const exists = database.prepare('SELECT "id" FROM "_prisma_migrations" WHERE "migration_name" = ? AND "rolled_back_at" IS NULL').get(name);
  if (exists) continue;
  database.exec("BEGIN IMMEDIATE;");
  try {
    database.exec(sqlBytes.toString("utf8"));
    database.prepare('INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count") VALUES (?, ?, ?, ?, ?, ?)').run(randomUUID(), checksum, new Date().toISOString(), name, new Date().toISOString(), 1);
    database.exec("COMMIT;");
    console.log(`Applied ${name}`);
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  }
}
database.close();
