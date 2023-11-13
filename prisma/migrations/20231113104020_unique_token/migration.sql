/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `AdminToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdminToken_token_key" ON "AdminToken"("token");
