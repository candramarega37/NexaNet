import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

test("3D catalog migration preserves model and learning hotspot records", () => {
  const database = new DatabaseSync(":memory:");
  try {
    database.exec(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE "ArObject" (
        "id" TEXT NOT NULL PRIMARY KEY, "slug" TEXT NOT NULL, "title" TEXT NOT NULL,
        "description" TEXT NOT NULL, "purpose" TEXT NOT NULL, "components" TEXT NOT NULL,
        "modelUrl" TEXT, "thumbnailUrl" TEXT, "published" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" DATETIME NOT NULL
      );
      CREATE TABLE "ArHotspot" (
        "id" TEXT NOT NULL PRIMARY KEY, "arObjectId" TEXT NOT NULL, "title" TEXT NOT NULL,
        "description" TEXT NOT NULL, "example" TEXT NOT NULL, "x" REAL NOT NULL DEFAULT 0,
        "y" REAL NOT NULL DEFAULT 0, "z" REAL NOT NULL DEFAULT 0, "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "ArHotspot_arObjectId_fkey" FOREIGN KEY ("arObjectId") REFERENCES "ArObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
      CREATE UNIQUE INDEX "ArObject_slug_key" ON "ArObject"("slug");
      CREATE INDEX "ArHotspot_arObjectId_sortOrder_idx" ON "ArHotspot"("arObjectId", "sortOrder");
      INSERT INTO "ArObject" ("id", "slug", "title", "description", "purpose", "components", "modelUrl", "published", "updatedAt")
        VALUES ('model-1', 'router', 'Router', 'Network router', 'Routes packets', '["WAN"]', '/models/router.glb', true, CURRENT_TIMESTAMP);
      INSERT INTO "ArHotspot" ("id", "arObjectId", "title", "description", "example", "x", "y", "z", "sortOrder")
        VALUES ('point-1', 'model-1', 'WAN port', 'Connects to an upstream network', 'Connect a modem', 0.1, 0.2, 0.3, 0);
    `);

    database.exec(readFileSync(new URL("../prisma/migrations/20261029_rename_3d_catalog/migration.sql", import.meta.url), "utf8"));

    assert.deepEqual({ ...database.prepare('SELECT "id", "slug", "modelUrl" FROM "ThreeDModel"').get() }, {
      id: "model-1", slug: "router", modelUrl: "/models/router.glb",
    });
    assert.deepEqual({ ...database.prepare('SELECT "id", "threeDModelId", "title", "x" FROM "ThreeDHotspot"').get() }, {
      id: "point-1", threeDModelId: "model-1", title: "WAN port", x: 0.1,
    });
    assert.equal(database.prepare('PRAGMA foreign_key_check("ThreeDHotspot")').all().length, 0);
    assert.equal(database.prepare("SELECT name FROM sqlite_schema WHERE type='table' AND name LIKE '%Object'").all().length, 0);
  } finally {
    database.close();
  }
});
