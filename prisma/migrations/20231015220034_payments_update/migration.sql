-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Completed', 'Pending', 'Failed');

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "securityDeposit" INTEGER NOT NULL,
    "paymentAmount" INTEGER NOT NULL,
    "bookingId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
