-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Apartment', 'Condominium', 'Single_family_home', 'Townhouse', 'Studio', 'Duplex', 'Villa', 'Cottage');

-- CreateTable
CREATE TABLE "marketplaces" (
    "id" TEXT NOT NULL,
    "itemDescription" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'Apartment',
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "marketplaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurances" (
    "id" TEXT NOT NULL,
    "policyDetails" TEXT NOT NULL,
    "coverageAmount" INTEGER NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "marketplaces" ADD CONSTRAINT "marketplaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
