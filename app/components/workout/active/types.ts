// app/components/workout/active/types.ts
export type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
  completedAt: Date | null;
  workoutId: string;
};

export type ActiveWorkoutCardProps = {
  workoutId: string;
  workoutNumber: number;
  sets: WorkoutSet[];
};
