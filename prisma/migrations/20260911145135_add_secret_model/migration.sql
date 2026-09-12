-- CreateTable
CREATE TABLE "Secret" (
    "id" TEXT NOT NULL,
    "name" INTEGER NOT NULL,
    "Value" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Secret_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Secret" ADD CONSTRAINT "Secret_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
