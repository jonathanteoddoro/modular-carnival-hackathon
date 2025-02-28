/*
  Warnings:

  - You are about to drop the `Fraud` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Fraud_pharmacyId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Fraud";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DetectedFraudes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pharmacyWallet" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "factory" TEXT NOT NULL,
    "activePrinciple" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ClientQRCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "clientId" INTEGER NOT NULL,
    "qrCode" TEXT NOT NULL,
    "validUntil" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ClientQRCode" ("clientId", "createdAt", "id", "qrCode", "updatedAt", "validUntil") SELECT "clientId", "createdAt", "id", "qrCode", "updatedAt", "validUntil" FROM "ClientQRCode";
DROP TABLE "ClientQRCode";
ALTER TABLE "new_ClientQRCode" RENAME TO "ClientQRCode";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "DetectedFraudes_pharmacyWallet_idx" ON "DetectedFraudes"("pharmacyWallet");

-- CreateIndex
CREATE INDEX "DetectedFraudes_medicineName_idx" ON "DetectedFraudes"("medicineName");
