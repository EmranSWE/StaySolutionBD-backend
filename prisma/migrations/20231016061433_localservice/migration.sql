-- CreateTable
CREATE TABLE "localservices" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactDetails" TEXT NOT NULL,
    "operatingHours" TEXT,

    CONSTRAINT "localservices_pkey" PRIMARY KEY ("id")
);
