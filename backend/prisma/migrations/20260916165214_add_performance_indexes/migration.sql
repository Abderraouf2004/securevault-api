-- CreateIndex
CREATE INDEX "Document_ownerId_createdAt_idx" ON "Document"("ownerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Secret_ownerId_createdAt_idx" ON "Secret"("ownerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
