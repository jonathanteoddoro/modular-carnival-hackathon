-- CreateTable
CREATE TABLE "SalesHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pharmacyWallet" TEXT NOT NULL,
    "medicineName" TEXT NOT NULL,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerWallet" TEXT NOT NULL,
    "medicineId" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SupplyHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medicineName" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL,
    "pharmacyWallet" TEXT NOT NULL,
    "supplierWallet" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "transactionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClientQRCode_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ClientQRCode" ("clientId", "createdAt", "id", "qrCode", "updatedAt", "validUntil") SELECT "clientId", "createdAt", "id", "qrCode", "updatedAt", "validUntil" FROM "ClientQRCode";
DROP TABLE "ClientQRCode";
ALTER TABLE "new_ClientQRCode" RENAME TO "ClientQRCode";
CREATE UNIQUE INDEX "ClientQRCode_qrCode_key" ON "ClientQRCode"("qrCode");
CREATE INDEX "ClientQRCode_clientId_idx" ON "ClientQRCode"("clientId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "SalesHistory_pharmacyWallet_idx" ON "SalesHistory"("pharmacyWallet");

-- CreateIndex
CREATE INDEX "SalesHistory_customerWallet_idx" ON "SalesHistory"("customerWallet");

-- CreateIndex
CREATE INDEX "SalesHistory_medicineId_idx" ON "SalesHistory"("medicineId");

-- CreateIndex
CREATE INDEX "SupplyHistory_pharmacyWallet_idx" ON "SupplyHistory"("pharmacyWallet");

-- CreateIndex
CREATE INDEX "SupplyHistory_supplierWallet_idx" ON "SupplyHistory"("supplierWallet");

-- CreateIndex
CREATE INDEX "SupplyHistory_batchNumber_idx" ON "SupplyHistory"("batchNumber");
