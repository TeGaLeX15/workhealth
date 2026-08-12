// app/components/training/types.ts
export type WorkoutStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "SKIPPED";

export type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
  completedAt: Date | null;
  workoutId: string;
};

export type Workout = {
  id: string;
  workoutNumber: number;
  scheduledDate: Date;
  status: WorkoutStatus;
  sets: WorkoutSet[];
};

export type TrainingWeekCardProps = {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  workouts: Workout[];
  currentWorkoutId: string | null;
};
