/*
  Warnings:

  - The `location` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "location",
ADD COLUMN     "location" TEXT[],
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "city" SET DATA TYPE TEXT;
