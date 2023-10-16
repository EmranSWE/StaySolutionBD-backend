-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('Available', 'Booked', 'UnderMaintenance');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "location" TEXT[],
    "city" TEXT,
    "numberOfRooms" INTEGER NOT NULL,
    "monthlyRent" INTEGER,
    "flatNo" TEXT,
    "description" TEXT,
    "amenities" TEXT[],
    "rules" TEXT[],
    "availableDate" TIMESTAMP(3),
    "imageGallery" TEXT[],
    "size" TEXT,
    "maxOccupancy" INTEGER NOT NULL,
    "PropertyStatus" "PropertyStatus" NOT NULL,
    "videoLink" TEXT,
    "propertyTags" TEXT[],
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
