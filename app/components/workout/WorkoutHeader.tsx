// app/components/workout/WorkoutHeader.tsx
type WorkoutHeaderProps = {
  workout: {
    workoutNumber: number;
    status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "SKIPPED";
    exercise: {
      name: string;
    };
    trainingWeek: {
      weekNumber: number;
    };
  };
};

const statusLabel = {
  PLANNED: "Готова",
  IN_PROGRESS: "В процессе",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
  SKIPPED: "Пропущена",
};

export default function WorkoutHeader({ workout }: WorkoutHeaderProps) {
  const isCompleted = workout.status === "COMPLETED";
  const isCancelled = workout.status === "CANCELLED";
  const isSkipped = workout.status === "SKIPPED";

  const isUnavailable = isCancelled || isSkipped;

  return (
    <header className="mb-5">
      {/* TOP META */}
      <div className="flex items-center justify-between gap-3">
        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.12em]
          "
          style={{
            color: "var(--muted)",
          }}
        >
          Неделя {workout.trainingWeek.weekNumber}
        </p>

        <div
          className="
            shrink-0
            rounded-full
            px-3
            py-1.5
            text-[11px]
            font-semibold
          "
          style={{
            backgroundColor: isCompleted
              ? "color-mix(in srgb, var(--accent) 10%, transparent)"
              : isUnavailable
                ? "color-mix(in srgb, #ef4444 8%, transparent)"
                : "var(--surface)",

            color: isCompleted
              ? "var(--accent)"
              : isUnavailable
                ? "#ef4444"
                : "var(--muted)",
          }}
        >
          {statusLabel[workout.status]}
        </div>
      </div>

      {/* TITLE */}
      <div className="mt-3 text-center">
        <h1
          className="
            text-[32px]
            font-bold
            leading-none
            tracking-[-0.055em]
            sm:text-[36px]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          Тренировка {workout.workoutNumber}
        </h1>

        <p
          className="
            mt-2
            text-[15px]
            font-semibold
          "
          style={{
            color: "var(--muted)",
          }}
        >
          {workout.exercise.name}
        </p>
      </div>
    </header>
  );
}
