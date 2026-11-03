ALTER TABLE "ArHotspot" RENAME TO "ThreeDHotspot";
ALTER TABLE "ThreeDHotspot" RENAME COLUMN "arObjectId" TO "threeDModelId";
ALTER TABLE "ArObject" RENAME TO "ThreeDModel";

DROP INDEX "ArObject_slug_key";
CREATE UNIQUE INDEX "ThreeDModel_slug_key" ON "ThreeDModel"("slug");
DROP INDEX "ArHotspot_arObjectId_sortOrder_idx";
CREATE INDEX "ThreeDHotspot_threeDModelId_sortOrder_idx" ON "ThreeDHotspot"("threeDModelId", "sortOrder");
