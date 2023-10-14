-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "numberOfRooms" INTEGER NOT NULL,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "flatNo" TEXT NOT NULL,
    "isConditionGood" BOOLEAN NOT NULL DEFAULT true,
    "isElectricityOkay" BOOLEAN NOT NULL DEFAULT true,
    "isSanitaryOkay" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
