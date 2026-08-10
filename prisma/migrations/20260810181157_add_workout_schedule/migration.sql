/*
  Warnings:

  - A unique constraint covering the columns `[userId,scheduledDate]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.
  - Made the column `endDate` on table `TrainingWeek` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `scheduledDate` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Workout_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "TrainingWeek" ALTER COLUMN "startDate" DROP DEFAULT,
ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET NOT NULL,
ALTER COLUMN "endDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'Asia/Almaty';

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "scheduledDate" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "Workout_userId_scheduledDate_idx" ON "Workout"("userId", "scheduledDate");

-- CreateIndex
CREATE INDEX "Workout_userId_status_idx" ON "Workout"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_userId_scheduledDate_key" ON "Workout"("userId", "scheduledDate");
