"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Plus, SkipForward } from "lucide-react";
import WorkoutProgress from "./WorkoutProgress";

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

  const [completedSets, setCompletedSets] = useState<WorkoutSet[]>(sets);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const firstIncomplete = sets.findIndex((set) => !set.completed);

    return firstIncomplete === -1 ? sets.length : firstIncomplete;
  });

  const [isResting, setIsResting] = useState(false);
  const [restSeconds, setRestSeconds] = useState(REST_SECONDS);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentSet = completedSets[currentIndex];

  const isFinished = currentIndex >= completedSets.length;

  /*
   * Таймер отдыха
   */
  useEffect(() => {
    if (!isResting) return;

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
   * Автоматическое завершение отдыха
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
   * Завершение подхода
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
        setError(data.error ?? "Не удалось сохранить подход");
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
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  function skipRest() {
    setIsResting(false);
    setRestSeconds(REST_SECONDS);
  }

  function increaseRest() {
    setRestSeconds((seconds) => seconds + 30);
  }

  /*
   * Завершённая тренировка
   */
  if (isFinished) {
    return (
      <div
        className="
          flex
          min-h-[65vh]
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        <div
          className="
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-[28px]
          "
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--accent) 10%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--accent) 18%, transparent)",
          }}
        >
          <Check
            size={34}
            strokeWidth={2.4}
            style={{
              color: "var(--accent)",
            }}
          />
        </div>

        <h2
          className="
            mt-6
            text-[27px]
            font-bold
            tracking-[-0.04em]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          Тренировка завершена
        </h2>

        <p
          className="mt-2 text-sm"
          style={{
            color: "var(--muted)",
          }}
        >
          Все подходы выполнены
        </p>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="
            mt-8
            flex
            h-[58px]
            w-full
            max-w-sm
            items-center
            justify-center
            rounded-[20px]
            text-[16px]
            font-bold
            text-white
            transition-transform
            active:scale-[0.98]
          "
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
   * Экран отдыха
   */
  if (isResting) {
    const progress = ((REST_SECONDS - restSeconds) / REST_SECONDS) * 100;

    const nextSetNumber = currentSet?.setNumber ?? currentIndex + 1;

    const minutes = Math.floor(restSeconds / 60);

    const seconds = restSeconds % 60;

    return (
      <div
        className="
          flex
          min-h-[calc(100dvh-300px)]
          flex-col
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.13em]
              "
              style={{
                color: "var(--accent)",
              }}
            >
              Восстановление
            </p>

            <h2
              className="
                mt-1
                text-[23px]
                font-bold
                tracking-[-0.04em]
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Отдых
            </h2>
          </div>

          <div
            className="
              rounded-full
              px-3
              py-1.5
              text-xs
              font-semibold
            "
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            Подход {nextSetNumber}
          </div>
        </div>

        {/* TIMER */}
        <div className="flex flex-1 items-center justify-center">
          <div
            className="
              relative
              flex
              h-[270px]
              w-[270px]
              items-center
              justify-center
              rounded-full
            "
            style={{
              background: `conic-gradient(
                var(--accent) ${progress}%,
                var(--surface) ${progress}% 100%
              )`,
            }}
          >
            <div
              className="
                absolute
                inset-[7px]
                rounded-full
              "
              style={{
                backgroundColor: "var(--card)",
              }}
            />

            <div className="relative text-center">
              <div
                className="
                  text-[64px]
                  font-bold
                  leading-none
                  tracking-[-0.07em]
                  tabular-nums
                "
                style={{
                  color: "var(--foreground)",
                }}
              >
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </div>

              <div
                className="mt-3 text-xs font-medium"
                style={{
                  color: "var(--muted)",
                }}
              >
                время отдыха
              </div>
            </div>
          </div>
        </div>

        {/* NEXT SET */}
        <div
          className="
            rounded-[22px]
            border
            px-4
            py-4
          "
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs"
                style={{
                  color: "var(--muted)",
                }}
              >
                Следующий подход
              </p>

              <p
                className="
                  mt-1
                  text-[17px]
                  font-bold
                "
                style={{
                  color: "var(--foreground)",
                }}
              >
                Подход {nextSetNumber}
              </p>
            </div>

            <div className="text-right">
              <span
                className="
                  text-[23px]
                  font-bold
                  tracking-[-0.04em]
                "
                style={{
                  color: "var(--foreground)",
                }}
              >
                {currentSet?.targetReps}
              </span>

              <span
                className="ml-1 text-xs"
                style={{
                  color: "var(--muted)",
                }}
              >
                раз
              </span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-3 flex gap-3 pb-2">
          <button
            type="button"
            onClick={skipRest}
            className="
              flex
              h-[54px]
              flex-1
              items-center
              justify-center
              gap-2
              rounded-[19px]
              border
              text-sm
              font-semibold
              transition-transform
              active:scale-[0.98]
            "
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <SkipForward size={17} />
            Пропустить
          </button>

          <button
            type="button"
            onClick={increaseRest}
            className="
              flex
              h-[54px]
              items-center
              justify-center
              gap-1.5
              rounded-[19px]
              border
              px-5
              text-sm
              font-semibold
              transition-transform
              active:scale-[0.98]
            "
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--foreground)",
            }}
          >
            <Plus size={16} />
            30 сек
          </button>
        </div>
      </div>
    );
  }

  /*
   * Текущий подход
   */

  const completedCount = completedSets.filter(
    (set) => set.completed,
  ).length;

  return (
    <div
      className="
        flex
        min-h-[calc(100dvh-300px)]
        flex-col
      "
    >
      {/* HEADER */}
      <div className="flex items-end justify-between">
        <div>
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.13em]
            "
            style={{
              color: "var(--accent)",
            }}
          >
            Текущий подход
          </p>

          <h2
            className="
              mt-1
              text-[25px]
              font-bold
              tracking-[-0.045em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Подход {currentSet.setNumber}
          </h2>
        </div>

        <div className="text-right">
          <span
            className="
              text-[15px]
              font-semibold
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {currentSet.setNumber}
          </span>

          <span
            className="mx-1 text-sm"
            style={{
              color: "var(--muted)",
            }}
          >
            /
          </span>

          <span
            className="
              text-[15px]
              font-semibold
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            {completedSets.length}
          </span>
        </div>
      </div>

      {/* PROGRESS */}
      <WorkoutProgress
        sets={completedSets}
        currentIndex={currentIndex}
        isResting={isResting}
      />

      {/* MAIN */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <button
            type="button"
            onClick={handleCompleteSet}
            disabled={isLoading}
            aria-label={`Завершить подход ${currentSet.setNumber}`}
            className="
              bodyos-current-set
              relative
              flex
              h-[270px]
              w-[270px]
              flex-col
              items-center
              justify-center
              rounded-full
              transition-transform
              active:scale-[0.96]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
            style={{
              backgroundColor: "var(--card)",
              border:
                "1px solid color-mix(in srgb, var(--accent) 18%, var(--border))",
              boxShadow:
                "0 16px 45px color-mix(in srgb, var(--accent) 7%, transparent)",
            }}
          >
            <div
              className="
                absolute
                inset-[8px]
                rounded-full
                border-2
              "
              style={{
                borderColor:
                  "color-mix(in srgb, var(--accent) 24%, transparent)",
              }}
            />

            <span
              className="
                relative
                text-[82px]
                font-bold
                leading-none
                tracking-[-0.075em]
                tabular-nums
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              {currentSet.targetReps}
            </span>

            <span
              className="
                relative
                mt-3
                text-[13px]
                font-medium
              "
              style={{
                color: "var(--muted)",
              }}
            >
              повторений
            </span>
          </button>

          <p
            className="
              mt-6
              text-sm
              font-medium
            "
            style={{
              color: "var(--muted)",
            }}
          >
            Выполни подход и нажми на круг
          </p>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="pb-1">
        {error && (
          <div
            className="
        mb-3
        rounded-[18px]
        border
        px-4
        py-3
        text-center
        text-sm
      "
            style={{
              backgroundColor: "color-mix(in srgb, #ef4444 6%, transparent)",
              borderColor: "color-mix(in srgb, #ef4444 20%, transparent)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <span
            className="text-xs font-medium"
            style={{
              color: "var(--muted)",
            }}
          >
            Выполнено
          </span>

          <span
            className="text-sm font-bold tabular-nums"
            style={{
              color: "var(--foreground)",
            }}
          >
            {completedCount}
          </span>

          <span
            className="text-xs"
            style={{
              color: "var(--muted)",
            }}
          >
            из {completedSets.length}
          </span>
        </div>
      </div>
    </div>
  );
}
