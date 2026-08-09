"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, SkipForward } from "lucide-react";

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
   * ------------------------------------------------------------------------
   * Таймер отдыха
   * ------------------------------------------------------------------------
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
   * ------------------------------------------------------------------------
   * Автоматическое завершение отдыха
   * ------------------------------------------------------------------------
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

  /*
   * ------------------------------------------------------------------------
   * Завершение подхода
   * ------------------------------------------------------------------------
   */

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
          data.error ?? "Не удалось сохранить подход",
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

  /*
   * ------------------------------------------------------------------------
   * Управление отдыхом
   * ------------------------------------------------------------------------
   */

  function skipRest() {
    setIsResting(false);
    setRestSeconds(REST_SECONDS);
  }

  function increaseRest() {
    setRestSeconds((seconds) => seconds + 30);
  }

  /*
   * ------------------------------------------------------------------------
   * Завершённая тренировка
   * ------------------------------------------------------------------------
   */

  if (isFinished) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 10%, transparent)",
            boxShadow:
              "0 0 0 1px color-mix(in srgb, var(--accent) 12%, transparent)",
          }}
        >
          <Check
            size={28}
            strokeWidth={2.5}
            style={{
              color: "var(--accent)",
            }}
          />
        </div>

        <p
          className="mt-5 text-xl font-bold tracking-[-0.03em]"
          style={{
            color: "var(--foreground)",
          }}
        >
          Тренировка завершена
        </p>

        <p
          className="mt-1.5 text-sm"
          style={{
            color: "var(--muted)",
          }}
        >
          Все подходы выполнены
        </p>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-7 flex h-12 w-full max-w-sm items-center justify-center rounded-2xl text-sm font-semibold text-white transition-transform active:scale-[0.98]"
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          Готово
        </button>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * Экран отдыха
   * ------------------------------------------------------------------------
   */

  if (isResting) {
    const progress =
      ((REST_SECONDS - restSeconds) /
        REST_SECONDS) *
      100;

    const nextSetNumber =
      currentSet?.setNumber ??
      currentIndex + 1;

    return (
      <div className="flex min-h-[60vh] flex-col">
        {/* Header */}

        <div className="text-center">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--muted)",
            }}
          >
            Отдых
          </p>

          <p
            className="mt-1 text-base font-semibold"
            style={{
              color: "var(--foreground)",
            }}
          >
            Следующий подход
          </p>
        </div>

        {/* Timer */}

        <div className="flex flex-1 items-center justify-center py-6">
          <div
            className="relative flex h-52 w-52 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(
                var(--accent) ${progress}%,
                var(--surface) ${progress}% 100%
              )`,
              boxShadow:
                "0 12px 36px color-mix(in srgb, var(--accent) 7%, transparent)",
            }}
          >
            <div
              className="absolute inset-[6px] rounded-full"
              style={{
                backgroundColor: "var(--card)",
              }}
            />

            <div className="relative flex flex-col items-center justify-center">
              <span
                className="text-[46px] font-bold leading-none tracking-[-0.06em] tabular-nums"
                style={{
                  color: "var(--foreground)",
                }}
              >
                {Math.floor(restSeconds / 60)
                  .toString()
                  .padStart(2, "0")}
                :
                {(restSeconds % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>

              <span
                className="mt-2 text-xs font-medium"
                style={{
                  color: "var(--muted)",
                }}
              >
                отдых
              </span>
            </div>
          </div>
        </div>

        {/* Info */}

        <div className="text-center">
          <p
            className="text-base font-semibold"
            style={{
              color: "var(--foreground)",
            }}
          >
            Отдыхай
          </p>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--muted)",
            }}
          >
            Следующий подход · {nextSetNumber}
          </p>
        </div>

        {/* Actions */}

        <div className="mt-6 flex gap-3 pb-2">
          <button
            type="button"
            onClick={skipRest}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border text-sm font-semibold transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <SkipForward size={16} />

            Пропустить
          </button>

          <button
            type="button"
            onClick={increaseRest}
            className="h-12 rounded-2xl border px-5 text-sm font-semibold transition-transform active:scale-[0.98]"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            +30 сек
          </button>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * Текущий подход
   * ------------------------------------------------------------------------
   */

  const completedCount = currentIndex;

  return (
    <div className="flex min-h-[60vh] flex-col">
      {/* Header */}

      <div className="text-center">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.1em]"
          style={{
            color: "var(--muted)",
          }}
        >
          Подход
        </p>

        <p
          className="mt-1 text-base font-semibold"
          style={{
            color: "var(--foreground)",
          }}
        >
          {currentSet.setNumber} из{" "}
          {completedSets.length}
        </p>
      </div>

      {/* Set indicators */}

      <div className="mt-5 flex items-center justify-center gap-1.5">
        {completedSets.map((set, index) => {
          const isCurrent =
            index === currentIndex;

          const isCompleted =
            index < currentIndex;

          return (
            <div
              key={set.id}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                isCurrent
                  ? "bodyos-current-indicator"
                  : "",
              ].join(" ")}
              style={{
                width: isCurrent ? 28 : 7,
                backgroundColor:
                  isCompleted || isCurrent
                    ? "var(--accent)"
                    : "var(--surface)",
              }}
            />
          );
        })}
      </div>

      {/* Main action */}

      <div className="flex flex-1 items-center justify-center py-6">
        <button
          type="button"
          onClick={handleCompleteSet}
          disabled={isLoading}
          aria-label={`Завершить подход ${currentSet.setNumber}`}
          className="bodyos-current-set relative flex h-52 w-52 flex-col items-center justify-center rounded-full transition-transform active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: "var(--card)",
            border:
              "1px solid color-mix(in srgb, var(--accent) 20%, var(--border))",
            boxShadow:
              "0 12px 36px color-mix(in srgb, var(--accent) 7%, transparent)",
          }}
        >
          <div
            className="absolute inset-2 rounded-full border-2"
            style={{
              borderColor:
                "color-mix(in srgb, var(--accent) 28%, transparent)",
            }}
          />

          <span
            className="relative text-[72px] font-bold leading-none tracking-[-0.07em] tabular-nums"
            style={{
              color: "var(--foreground)",
            }}
          >
            {currentSet.targetReps}
          </span>

          <span
            className="relative mt-2 text-xs font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            повторений
          </span>
        </button>
      </div>

      {/* Bottom information */}

      <div className="pb-2 text-center">
        <p
          className="text-xs font-medium"
          style={{
            color: "var(--muted)",
          }}
        >
          {completedCount} выполнено ·{" "}
          {completedSets.length} всего
        </p>

        {error && (
          <div
            className="mt-3 rounded-2xl border px-4 py-3 text-sm"
            style={{
              backgroundColor:
                "color-mix(in srgb, #ef4444 6%, transparent)",
              borderColor:
                "color-mix(in srgb, #ef4444 20%, transparent)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}