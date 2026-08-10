/*
  Warnings:

  - A unique constraint covering the columns `[userId,exerciseId,scheduledDate]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Workout_userId_scheduledDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "Workout_userId_exerciseId_scheduledDate_key" ON "Workout"("userId", "exerciseId", "scheduledDate");
