-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "paymentStatus" SET DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "monthly_rent_payments" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "amount" INTEGER,
    "paymentDate" TIMESTAMP(3),
    "propertyId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,

    CONSTRAINT "monthly_rent_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "monthly_rent_payments" ADD CONSTRAINT "monthly_rent_payments_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthly_rent_payments" ADD CONSTRAINT "monthly_rent_payments_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
