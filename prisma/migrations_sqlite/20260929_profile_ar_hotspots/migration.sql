ALTER TABLE "User" ADD COLUMN "className" TEXT;
ALTER TABLE "User" ADD COLUMN "major" TEXT;
CREATE TABLE "ArHotspot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "arObjectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "example" TEXT NOT NULL,
  "x" REAL NOT NULL DEFAULT 0,
  "y" REAL NOT NULL DEFAULT 0,
  "z" REAL NOT NULL DEFAULT 0,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ArHotspot_arObjectId_fkey" FOREIGN KEY ("arObjectId") REFERENCES "ArObject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ArHotspot_arObjectId_sortOrder_idx" ON "ArHotspot"("arObjectId", "sortOrder");
