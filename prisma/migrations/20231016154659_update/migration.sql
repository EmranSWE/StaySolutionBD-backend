/*
  Warnings:

  - The values [Available,Booked,UnderMaintenance] on the enum `PropertyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyStatus_new" AS ENUM ('available', 'booked', 'underMaintenance');
ALTER TABLE "properties" ALTER COLUMN "propertyStatus" TYPE "PropertyStatus_new" USING ("propertyStatus"::text::"PropertyStatus_new");
ALTER TYPE "PropertyStatus" RENAME TO "PropertyStatus_old";
ALTER TYPE "PropertyStatus_new" RENAME TO "PropertyStatus";
DROP TYPE "PropertyStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "propertyStatus" SET DEFAULT 'available';
