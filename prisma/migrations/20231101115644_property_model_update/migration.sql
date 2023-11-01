/*
  Warnings:

  - The `city` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "location" SET DATA TYPE TEXT,
DROP COLUMN "city",
ADD COLUMN     "city" TEXT[];
