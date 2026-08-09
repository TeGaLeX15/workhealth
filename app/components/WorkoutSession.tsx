"use client";

import { useEffect, useMemo, useState } from "react";
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
   *
   * Важно:
   * effect только подписывается на interval.
   * Никаких setState напрямую из тела effect.
   */
  useEffect(() => {
    if (!isResting) {
      return;
    }

    const timer = window.setInterval(() => {
      setRestSeconds((seconds) =>
        seconds > 0 ? seconds - 1 : 0,
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isResting]);

  /*
   * Когда таймер дошёл до нуля,
   * следующий рендер покажет следующий подход.
   */
  const restFinished =
    isResting && restSeconds === 0;

  const formattedRestTime = useMemo(() => {
    const minutes = Math.floor(
      restSeconds / 60,
    )
      .toString()
      .padStart(2, "0");

    const seconds = (restSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [restSeconds]);

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

  function handleContinueAfterRest() {
    if (!restFinished) {
      return;
    }

    setIsResting(false);
    setRestSeconds(REST_SECONDS);
  }

  function increaseRest() {
    setRestSeconds(
      (seconds) => seconds + 30,
    );
  }

  /*
   * Закончили все подходы.
   */
  if (isFinished) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
            <span className="text-4xl">
              ✓
            </span>
          </div>

          <h2 className="mt-6 text-2xl font-semibold">
            Тренировка завершена
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Все подходы выполнены
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-8 rounded-xl border border-zinc-800 px-5 py-3 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
        >
          Вернуться
        </button>
      </div>
    );
  }

  /*
   * Отдых.
   */
  if (isResting) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center px-4 pt-10">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">
            Отдых
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            Следующий подход
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={
              restFinished
                ? handleContinueAfterRest
                : undefined
            }
            disabled={!restFinished}
            className={[
              "flex h-72 w-72 flex-col items-center justify-center rounded-full",
              "border transition-all duration-300",
              restFinished
                ? "cursor-pointer border-white bg-white text-zinc-950 hover:scale-[1.02] active:scale-[0.98]"
                : "cursor-default border-zinc-700 bg-zinc-900 text-white",
            ].join(" ")}
          >
            <span className="text-6xl font-semibold tabular-nums">
              {formattedRestTime}
            </span>

            <span
              className={[
                "mt-3 text-sm",
                restFinished
                  ? "text-zinc-500"
                  : "text-zinc-500",
              ].join(" ")}
            >
              {restFinished
                ? "Продолжить"
                : "отдых"}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={increaseRest}
          className="mt-8 rounded-xl border border-zinc-800 px-5 py-3 text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-white"
        >
          +30 сек
        </button>

        <p className="mt-6 text-center text-sm text-zinc-600">
          Отдохни перед следующим подходом
        </p>
      </div>
    );
  }

  /*
   * Текущий подход.
   */
  return (
    <div className="flex min-h-[70vh] flex-col items-center px-4 pt-10">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-600">
          Подход {currentSet.setNumber}
        </p>

        <p className="mt-2 text-sm text-zinc-600">
          {currentSet.setNumber} /{" "}
          {completedSets.length}
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={handleCompleteSet}
          disabled={isLoading}
          className={[
            "flex h-72 w-72 flex-col items-center justify-center rounded-full",
            "border border-zinc-500 bg-white text-zinc-950",
            "transition-all duration-300",
            "select-none",
            "hover:scale-[1.02]",
            "active:scale-[0.97]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          <span className="text-7xl font-semibold">
            {currentSet.targetReps}
          </span>

          <span className="mt-3 text-sm text-zinc-500">
            {isLoading
              ? "сохраняем..."
              : "повторений"}
          </span>
        </button>
      </div>

      {error && (
        <p className="mt-6 text-center text-sm text-red-400">
          {error}
        </p>
      )}

      <p className="mt-8 text-center text-sm text-zinc-600">
        Выполни подход и нажми на круг
      </p>
    </div>
  );
}