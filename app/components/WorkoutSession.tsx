"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  actualReps: number | null;
  completed: boolean;
};

type WorkoutSessionProps = {
  workoutId: string;
  sets: WorkoutSet[];
};

const REST_SECONDS = 60;

export default function WorkoutSession({
  workoutId,
  sets,
}: WorkoutSessionProps) {
  const router = useRouter();

  const [completedSets, setCompletedSets] =
    useState<WorkoutSet[]>(sets);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstIncomplete = sets.findIndex(
      (set) => !set.completed,
    );

    return firstIncomplete === -1
      ? sets.length
      : firstIncomplete;
  });

  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] =
    useState(REST_SECONDS);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSet = completedSets[currentIndex];

  const isFinished =
    currentIndex >= completedSets.length;

  /*
   * Таймер отдыха.
   */
  useEffect(() => {
    if (!isResting) {
      return;
    }

    const timer = window.setInterval(() => {
      setRestSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isResting]);

  /*
   * Когда отдых закончился,
   * автоматически переходим к следующему подходу.
   */
  useEffect(() => {
    if (!isResting || restSeconds !== 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsResting(false);
      setRestSeconds(REST_SECONDS);
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isResting, restSeconds]);

  async function handleCompleteSet() {
    if (!currentSet || isLoading || isResting) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/workouts/${workoutId}/sets/${currentSet.id}/complete`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Не удалось сохранить подход",
        );
        return;
      }

      setCompletedSets((previous) =>
        previous.map((set) =>
          set.id === currentSet.id
            ? {
                ...set,
                completed: true,
                actualReps: set.targetReps,
              }
            : set,
        ),
      );

      if (data.completed) {
        setCurrentIndex(completedSets.length);
        router.refresh();
        return;
      }

      setCurrentIndex((index) => index + 1);

      setRestSeconds(REST_SECONDS);
      setIsResting(true);
    } catch {
      setError(
        "Не удалось подключиться к серверу",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function increaseRest() {
    setRestSeconds(
      (seconds) => seconds + 30,
    );
  }

  /*
   * Тренировка завершена.
   */
  if (isFinished) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl text-green-600">
            ✓
          </span>
        </div>

        <h2 className="mt-7 text-2xl font-bold tracking-tight text-zinc-950">
          Тренировка завершена
        </h2>

        <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
          Все подходы выполнены. Отличная работа.
        </p>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-8 h-12 rounded-xl bg-zinc-950 px-6 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          Вернуться
        </button>
      </div>
    );
  }

  /*
   * Экран отдыха.
   */
  if (isResting) {
    const progress =
      restSeconds === 0
        ? 100
        : ((REST_SECONDS - restSeconds) /
            REST_SECONDS) *
          100;

    return (
      <div className="flex min-h-[70vh] flex-col">
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-500">
            Отдых
          </p>

          <p className="mt-1 text-lg font-semibold text-zinc-950">
            Следующий подход
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50">
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent"
              style={{
                background: `conic-gradient(
                  #16a34a ${progress}%,
                  #e4e4e7 ${progress}% 100%
                )`,
                mask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                padding: "4px",
              }}
            />

            <div className="relative flex h-64 w-64 flex-col items-center justify-center rounded-full bg-white">
              {restSeconds === 0 ? (
                <>
                  <span className="text-4xl font-bold text-zinc-950">
                    Готово
                  </span>

                  <span className="mt-2 text-sm text-zinc-500">
                    следующий подход
                  </span>
                </>
              ) : (
                <>
                  <span className="text-6xl font-bold tabular-nums tracking-tight text-zinc-950">
                    {Math.floor(restSeconds / 60)
                      .toString()
                      .padStart(2, "0")}
                    :
                    {(restSeconds % 60)
                      .toString()
                      .padStart(2, "0")}
                  </span>

                  <span className="mt-2 text-sm text-zinc-500">
                    отдых
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="pb-4">
          <button
            type="button"
            onClick={increaseRest}
            className="h-12 w-full rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98]"
          >
            +30 сек
          </button>
        </div>
      </div>
    );
  }

  /*
   * Текущий подход.
   */
  const progress =
    (currentIndex / completedSets.length) * 100;

  return (
    <div className="flex min-h-[70vh] flex-col">
      {/* Верхняя часть */}
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-500">
          Подход {currentSet.setNumber}
        </p>

        <p className="mt-1 text-lg font-semibold text-zinc-950">
          {currentSet.setNumber} из{" "}
          {completedSets.length}
        </p>
      </div>

      {/* Основной круг */}
      <div className="flex flex-1 items-center justify-center">
        <button
          type="button"
          onClick={handleCompleteSet}
          disabled={isLoading}
          className="group relative flex h-72 w-72 flex-col items-center justify-center rounded-full bg-zinc-950 text-white shadow-xl shadow-zinc-200 transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-7xl font-bold tabular-nums tracking-tight">
            {currentSet.targetReps}
          </span>

          <span className="mt-2 text-sm text-zinc-400">
            {isLoading
              ? "сохраняем..."
              : "повторений"}
          </span>

          {!isLoading && (
            <span className="absolute bottom-12 text-xs text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">
              нажми после выполнения
            </span>
          )}
        </button>
      </div>

      {/* Нижняя часть */}
      <div className="pb-4">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>
            {currentIndex} выполнено
          </span>

          <span>
            {completedSets.length} всего
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-green-600 transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}