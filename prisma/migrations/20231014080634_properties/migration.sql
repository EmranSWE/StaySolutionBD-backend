/*
  Warnings:

  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_ownerId_fkey";

-- DropTable
DROP TABLE "Property";

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "flatNo" TEXT NOT NULL,
    "isConditionGood" BOOLEAN NOT NULL DEFAULT true,
    "isElectricityOkay" BOOLEAN NOT NULL DEFAULT true,
    "isSanitaryOkay" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
