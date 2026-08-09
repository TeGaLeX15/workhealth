import Link from "next/link";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
  completedAt: Date | null;
  workoutId: string;
};

type Workout = {
  id: string;
  workoutNumber: number;
  status:
    | "PLANNED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  sets: WorkoutSet[];
};

type TrainingWeekCardProps = {
  weekNumber: number;
  workouts: Workout[];
};

function getStatusLabel(
  status: Workout["status"],
) {
  switch (status) {
    case "PLANNED":
      return "Запланирована";

    case "IN_PROGRESS":
      return "В процессе";

    case "COMPLETED":
      return "Выполнена";

    case "CANCELLED":
      return "Отменена";

    default:
      return "";
  }
}

function getStatusStyle(
  status: Workout["status"],
) {
  switch (status) {
    case "PLANNED":
      return "bg-zinc-100 text-zinc-500";

    case "IN_PROGRESS":
      return "bg-emerald-50 text-emerald-600";

    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";

    case "CANCELLED":
      return "bg-red-50 text-red-500";

    default:
      return "bg-zinc-100 text-zinc-500";
  }
}

export default function TrainingWeekCard({
  weekNumber,
  workouts,
}: TrainingWeekCardProps) {
  return (
    <div className="space-y-3">
      {workouts.map((workout) => {
        const completedSets = workout.sets.filter(
          (set) => set.completed,
        ).length;

        const totalSets = workout.sets.length;

        const progress =
          totalSets > 0
            ? Math.round(
                (completedSets / totalSets) * 100,
              )
            : 0;

        const isCompleted =
          workout.status === "COMPLETED";

        const isInProgress =
          workout.status === "IN_PROGRESS";

        return (
          <Link
            key={workout.id}
            href={`/workouts/${workout.id}`}
            className={[
              "group block overflow-hidden rounded-3xl",
              "border border-zinc-200 bg-white",
              "shadow-sm",
              "transition-all duration-200",
              "active:scale-[0.985]",
              "hover:border-zinc-300 hover:shadow-md",
            ].join(" ")}
          >
            {/* Верхняя часть */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Неделя {weekNumber}
                  </p>

                  <h3 className="mt-1 text-xl font-bold tracking-tight text-zinc-950">
                    Тренировка {workout.workoutNumber}
                  </h3>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full px-3 py-1.5",
                    "text-xs font-semibold",
                    getStatusStyle(workout.status),
                  ].join(" ")}
                >
                  {getStatusLabel(workout.status)}
                </span>
              </div>

              {/* Прогресс */}
              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold tracking-tight text-zinc-950">
                      {completedSets}
                    </span>

                    <span className="ml-1 text-sm text-zinc-400">
                      / {totalSets} подходов
                    </span>
                  </div>

                  <span className="text-xs font-medium text-zinc-400">
                    {progress}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Подходы */}
            <div className="border-t border-zinc-100 bg-zinc-50/70 px-5 py-4">
              <div className="flex gap-2 overflow-x-auto">
                {workout.sets.map((set) => (
                  <div
                    key={set.id}
                    className={[
                      "flex min-w-[64px] flex-col items-center",
                      "rounded-2xl border px-3 py-2.5",
                      set.completed
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-zinc-200 bg-white",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-[11px] font-medium",
                        set.completed
                          ? "text-emerald-600"
                          : "text-zinc-400",
                      ].join(" ")}
                    >
                      {set.setNumber} подход
                    </span>

                    <span
                      className={[
                        "mt-1 text-sm font-bold",
                        set.completed
                          ? "text-emerald-700"
                          : "text-zinc-950",
                      ].join(" ")}
                    >
                      {set.actualReps ??
                        set.targetReps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Нижняя строка */}
            <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3.5">
              <span className="text-xs font-medium text-zinc-400">
                {isCompleted
                  ? "Тренировка завершена"
                  : isInProgress
                    ? "Продолжить тренировку"
                    : "Готова к выполнению"}
              </span>

              <span className="text-zinc-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-500">
                →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}