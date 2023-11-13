/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `AuthToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AdminToken` table. All the data in the column will be lost.
  - Added the required column `token` to the `AdminToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" DATETIME NOT NULL,
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "AuthToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AuthToken" ("adminId", "createdAt", "expiration", "id", "valid") SELECT "adminId", "createdAt", "expiration", "id", "valid" FROM "AuthToken";
DROP TABLE "AuthToken";
ALTER TABLE "new_AuthToken" RENAME TO "AuthToken";
CREATE TABLE "new_AdminToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "token" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "expiration" DATETIME NOT NULL
);
INSERT INTO "new_AdminToken" ("createdAt", "expiration", "id", "valid") SELECT "createdAt", "expiration", "id", "valid" FROM "AdminToken";
DROP TABLE "AdminToken";
ALTER TABLE "new_AdminToken" RENAME TO "AdminToken";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
