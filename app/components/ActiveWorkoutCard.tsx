"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const completedSets = sets.filter(
    (set) => set.completed,
  ).length;

  const totalSets = sets.length;

  const currentSet =
    sets.find((set) => !set.completed) ?? null;

  async function completeSet() {
    if (!currentSet || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/workouts/${workoutId}/sets/${currentSet.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actualReps: currentSet.targetReps,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          data.error ??
            "Не удалось завершить подход",
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Complete set error:",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (sets.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <p className="text-sm text-zinc-500">
          В этой тренировке пока нет подходов.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            Тренировка
          </p>

          <p className="mt-1 text-xl font-semibold">
            {workoutNumber} из 3
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">
            Подходы
          </p>

          <p className="mt-1 text-xl font-semibold">
            {completedSets}/{totalSets}
          </p>
        </div>
      </div>

      {currentSet ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-500">
            Следующий подход
          </p>

          <div className="mt-6 text-center">
            <p className="text-7xl font-semibold tracking-tight">
              {currentSet.targetReps}
            </p>

            <p className="mt-2 text-sm text-zinc-500">
              повторений
            </p>
          </div>

          <button
            type="button"
            onClick={completeSet}
            disabled={isLoading}
            className="mt-8 h-14 w-full rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading
              ? "Сохраняем..."
              : "Выполнил"}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center">
          <p className="text-2xl font-semibold">
            Тренировка завершена
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Все подходы выполнены.
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {sets.map((set) => (
          <div
            key={set.id}
            className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
              set.completed
                ? "border-zinc-800 bg-zinc-900/50"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            <div>
              <p className="text-sm text-zinc-400">
                Подход {set.setNumber}
              </p>

              <p className="mt-1 font-medium">
                {set.actualReps ??
                  set.targetReps}{" "}
                повторений
              </p>
            </div>

            {set.completed && (
              <span className="text-sm text-zinc-500">
                ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
