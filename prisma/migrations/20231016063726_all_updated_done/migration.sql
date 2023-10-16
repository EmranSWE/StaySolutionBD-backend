/*
  Warnings:

  - You are about to drop the column `propertyId` on the `insurances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[insuranceId]` on the table `properties` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_propertyId_fkey";

-- AlterTable
ALTER TABLE "insurances" DROP COLUMN "propertyId";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "insuranceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "properties_insuranceId_key" ON "properties"("insuranceId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "insurances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
