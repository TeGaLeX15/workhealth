/*
  Warnings:

  - A unique constraint covering the columns `[trainingWeekId,workoutNumber]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trainingWeekId` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutNumber` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TrainingWeekStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "trainingWeekId" TEXT NOT NULL,
ADD COLUMN     "workoutNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TrainingWeek" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "maxReps" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "status" "TrainingWeekStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TrainingWeek_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrainingWeek_userId_status_idx" ON "TrainingWeek"("userId", "status");

-- CreateIndex
CREATE INDEX "TrainingWeek_userId_exerciseId_status_idx" ON "TrainingWeek"("userId", "exerciseId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingWeek_userId_exerciseId_weekNumber_key" ON "TrainingWeek"("userId", "exerciseId", "weekNumber");

-- CreateIndex
CREATE INDEX "Workout_trainingWeekId_idx" ON "Workout"("trainingWeekId");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_trainingWeekId_workoutNumber_key" ON "Workout"("trainingWeekId", "workoutNumber");

-- AddForeignKey
ALTER TABLE "TrainingWeek" ADD CONSTRAINT "TrainingWeek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingWeek" ADD CONSTRAINT "TrainingWeek_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_trainingWeekId_fkey" FOREIGN KEY ("trainingWeekId") REFERENCES "TrainingWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
