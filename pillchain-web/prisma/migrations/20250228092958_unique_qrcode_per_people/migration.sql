/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `ClientQRCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClientQRCode_clientId_key" ON "ClientQRCode"("clientId");
