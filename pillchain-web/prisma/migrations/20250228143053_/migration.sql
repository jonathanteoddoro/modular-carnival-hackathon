-- CreateTable
CREATE TABLE "Fraud" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pharmacyId" INTEGER NOT NULL,
    "pharmacyName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reportedDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Fraud_pharmacyId_idx" ON "Fraud"("pharmacyId");
