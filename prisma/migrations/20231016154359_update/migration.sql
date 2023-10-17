/*
  Warnings:

  - You are about to drop the column `PropertyStatus` on the `properties` table. All the data in the column will be lost.
  - Added the required column `propertyStatus` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "PropertyStatus",
ADD COLUMN     "propertyStatus" "PropertyStatus" NOT NULL;
