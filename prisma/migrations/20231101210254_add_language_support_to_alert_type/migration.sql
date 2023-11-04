/*
  Warnings:

  - Added the required column `nameAr` to the `AlertType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameEn` to the `AlertType` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlertType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL
);
INSERT INTO "new_AlertType" ("id", "name") SELECT "id", "name" FROM "AlertType";
DROP TABLE "AlertType";
ALTER TABLE "new_AlertType" RENAME TO "AlertType";
CREATE UNIQUE INDEX "AlertType_name_key" ON "AlertType"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
