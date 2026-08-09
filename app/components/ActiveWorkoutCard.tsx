"use client";

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

type ActiveWorkoutCardProps = {
  workoutId: string;
  workoutNumber: number;
  sets: WorkoutSet[];
};

export default function ActiveWorkoutCard({
  workoutId,
  workoutNumber,
  sets,
}: ActiveWorkoutCardProps) {
  if (sets.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
        <p className="text-sm font-medium text-zinc-500">
          Тренировка {workoutNumber}
        </p>

        <p className="mt-2 text-base font-semibold text-zinc-950">
          В этой тренировке пока нет подходов
        </p>
      </section>
    );
  }

  const completedSets = sets.filter(
    (set) => set.completed,
  ).length;

  const totalSets = sets.length;

  const currentSet =
    sets.find((set) => !set.completed) ?? null;

  const isCompleted = completedSets === totalSets;

  const progress =
    totalSets > 0
      ? Math.round(
          (completedSets / totalSets) * 100,
        )
      : 0;

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      {/* Верхняя часть */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">
              Тренировка
            </p>

            <h3 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">
              {workoutNumber}
            </h3>
          </div>

          <div className="rounded-full bg-emerald-50 px-3 py-1.5">
            <span className="text-sm font-semibold text-emerald-600">
              {completedSets}/{totalSets}
            </span>
          </div>
        </div>

        {/* Прогресс */}
        <div className="mt-6">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
            <span>Прогресс</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Текущий подход */}
      <div className="border-t border-zinc-100 bg-zinc-50 p-5">
        {isCompleted ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
              <span className="text-xl font-semibold text-emerald-600">
                ✓
              </span>
            </div>

            <div>
              <p className="font-semibold text-zinc-950">
                Тренировка выполнена
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Все подходы завершены
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Следующий подход
              </p>

              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold tracking-tight text-zinc-950">
                  {currentSet?.targetReps}
                </span>

                <span className="text-sm text-zinc-500">
                  повторений
                </span>
              </div>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-white">
              <span className="text-sm font-semibold text-emerald-600">
                {currentSet?.setNumber}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Кнопка */}
      <div className="p-5 pt-0">
        <Link
          href={`/workouts/${workoutId}`}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-4 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-zinc-800"
        >
          {isCompleted
            ? "Посмотреть тренировку"
            : "Открыть тренировку"}

          <span className="text-base">→</span>
        </Link>
      </div>
    </section>
  );
}