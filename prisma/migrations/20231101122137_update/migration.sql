/*
  Warnings:

  - The `city` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `title` on table `properties` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "title" SET NOT NULL,
DROP COLUMN "city",
ADD COLUMN     "city" TEXT[],
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "location" SET DATA TYPE TEXT;
