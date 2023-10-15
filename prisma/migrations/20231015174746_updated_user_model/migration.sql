/*
  Warnings:

  - The values [user] on the enum `ROLE` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leases` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ROLE_new" AS ENUM ('owner', 'renter', 'admin', 'super_admin');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "ROLE_new" USING ("role"::text::"ROLE_new");
ALTER TYPE "ROLE" RENAME TO "ROLE_old";
ALTER TYPE "ROLE_new" RENAME TO "ROLE";
DROP TYPE "ROLE_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'renter';
COMMIT;

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_leaseId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "leases" DROP CONSTRAINT "leases_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "leases" DROP CONSTRAINT "leases_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_tenantId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "updatedAt",
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "preferredAmenities" TEXT[],
ADD COLUMN     "preferredLocation" TEXT,
ADD COLUMN     "preferredPropertyType" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "searchHistory" TEXT[],
ADD COLUMN     "socialMediaLink" TEXT[],
ADD COLUMN     "userStatus" TEXT[],
ALTER COLUMN "role" SET DEFAULT 'renter';

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "leases";

-- DropTable
DROP TABLE "properties";

-- DropTable
DROP TABLE "reviews";
