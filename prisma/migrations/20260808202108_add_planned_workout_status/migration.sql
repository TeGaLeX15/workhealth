-- AlterEnum
ALTER TYPE "WorkoutStatus" ADD VALUE 'PLANNED';

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "status" SET DEFAULT 'PLANNED';
