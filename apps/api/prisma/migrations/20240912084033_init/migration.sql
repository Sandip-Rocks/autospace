/*
  Warnings:

  - The values [VALED_RETURNED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `licenceId` on the `Valet` table. All the data in the column will be lost.
  - Made the column `displayName` on table `Valet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('BOOKED', 'VALET_ASSIGNED_FOR_CHECK_IN', 'VALET_PICKED_UP', 'CHECKED_IN', 'VALET_ASSIGNED_FOR_CHECK_OUT', 'CHECKED_OUT', 'VALET_RETURNED');
ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TABLE "BookingTimeline" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'BOOKED';
COMMIT;

-- DropIndex
DROP INDEX "Slot_garageId_key";

-- AlterTable
ALTER TABLE "Valet" DROP COLUMN "licenceId",
ADD COLUMN     "licenceID" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "displayName" SET NOT NULL;
