-- CreateEnum
CREATE TYPE "DocumentStorageStatus" AS ENUM ('PENDING', 'READY', 'DELETING');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "storageStatus" "DocumentStorageStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Document_storageStatus_createdAt_idx" ON "Document"("storageStatus", "createdAt");
