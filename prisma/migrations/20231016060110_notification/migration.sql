-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('Booking', 'Cancellation', 'Offers');

-- CreateEnum
CREATE TYPE "NotificationPlatform" AS ENUM ('Email', 'SMS', 'App');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "timestamps" TIMESTAMP(3) NOT NULL,
    "notificationPlatform" "NotificationPlatform" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
