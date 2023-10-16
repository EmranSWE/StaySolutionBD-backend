-- CreateTable
CREATE TABLE "Safety" (
    "id" TEXT NOT NULL,
    "safetyAmenities" TEXT[],
    "safetyScore" INTEGER NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "Safety_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Safety" ADD CONSTRAINT "Safety_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
