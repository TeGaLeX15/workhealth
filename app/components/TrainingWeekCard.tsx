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

function getStatusClass(
  status: Workout["status"],
) {
  switch (status) {
    case "PLANNED":
      return "text-zinc-500";

    case "IN_PROGRESS":
      return "text-white";

    case "COMPLETED":
      return "text-green-400";

    case "CANCELLED":
      return "text-red-400";

    default:
      return "text-zinc-500";
  }
}

export default function TrainingWeekCard({
  weekNumber,
  workouts,
}: TrainingWeekCardProps) {
  return (
    <section className="mt-8">
      <div className="mb-4">
        <p className="text-sm text-zinc-500">
          Тренировочная неделя
        </p>

        <h2 className="mt-1 text-xl font-semibold">
          Неделя {weekNumber}
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          {workouts.length} тренировки
        </p>
      </div>

      <div className="space-y-3">
        {workouts.map((workout) => {
          const completedSets = workout.sets.filter(
            (set) => set.completed,
          ).length;

          const totalSets = workout.sets.length;

          return (
            <Link
              key={workout.id}
              href={`/workouts/${workout.id}`}
              className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-zinc-700 hover:bg-zinc-800 active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">
                    Тренировка {workout.workoutNumber}
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${getStatusClass(
                      workout.status,
                    )}`}
                  >
                    {getStatusLabel(workout.status)}
                  </p>
                </div>

                <span className="text-xl text-zinc-600">
                  →
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 overflow-x-auto">
                {workout.sets.map((set) => (
                  <div
                    key={set.id}
                    className={`min-w-[72px] rounded-xl border px-3 py-2 ${
                      set.completed
                        ? "border-green-900/50 bg-green-950/20"
                        : "border-zinc-800 bg-zinc-950"
                    }`}
                  >
                    <p className="text-xs text-zinc-500">
                      Подход {set.setNumber}
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {set.actualReps ?? set.targetReps}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-xs text-zinc-500">
                Подходы: {completedSets}/{totalSets}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}