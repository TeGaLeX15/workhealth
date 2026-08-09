"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus } from "lucide-react";

type MaxRepsFormProps = {
  exerciseId: string;
  previousMaxReps?: number | null;
};

const MIN_REPS = 1;
const MAX_REPS = 1000;

export default function MaxRepsForm({
  exerciseId,
  previousMaxReps = null,
}: MaxRepsFormProps) {
  const router = useRouter();

  const [maxReps, setMaxReps] = useState(previousMaxReps ?? 10);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const changeReps = useCallback((amount: number) => {
    setMaxReps((current) =>
      Math.min(MAX_REPS, Math.max(MIN_REPS, current + amount)),
    );
  }, []);

  const stopPress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPress = useCallback(
    (direction: 1 | -1) => {
      if (isLoading) return;

      stopPress();
      changeReps(direction);

      timerRef.current = setTimeout(() => {
        let delay = 180;

        const repeat = () => {
          changeReps(direction);

          delay = Math.max(55, delay - 15);

          intervalRef.current = setTimeout(repeat, delay);
        };

        intervalRef.current = setTimeout(repeat, delay);
      }, 400);
    },
    [changeReps, isLoading, stopPress],
  );

  useEffect(() => {
    return () => stopPress();
  }, [stopPress]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setMaxReps(MIN_REPS);
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return;
    }

    setMaxReps(Math.min(MAX_REPS, Math.max(MIN_REPS, Math.floor(value))));
  }

  async function handleSubmit() {
    if (isLoading) return;

    stopPress();
    setError("");
    setIsLoading(true);

    try {
      const maxResponse = await fetch(`/api/exercises/${exerciseId}/max`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxReps,
        }),
      });

      const maxData = await maxResponse.json();

      if (!maxResponse.ok) {
        setError(maxData.error ?? "Не удалось сохранить максимум");
        return;
      }

      const weekResponse = await fetch("/api/training-weeks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseId,
        }),
      });

      const weekData = await weekResponse.json();

      if (!weekResponse.ok) {
        setError(weekData.error ?? "Не удалось создать программу");
        return;
      }

      if (!weekData.workoutId) {
        setError("Первая тренировка не найдена");
        return;
      }

      router.push(`/workouts/${weekData.workoutId}`);
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="
      flex
      min-h-[calc(70dvh-50px)]
      flex-col
    "
    >
      {/* Центральная область */}
      <div
        className="
        flex
        flex-1
        flex-col
        items-center
        justify-center
      "
      >
        {/* Счётчик */}
        <div className="flex items-center justify-center gap-1">
          {/* Минус */}
          <button
            type="button"
            disabled={isLoading || maxReps <= MIN_REPS}
            onPointerDown={() => startPress(-1)}
            onPointerUp={stopPress}
            onPointerCancel={stopPress}
            onPointerLeave={stopPress}
            aria-label="Уменьшить количество повторений"
            className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            transition-all
            active:scale-90
            disabled:opacity-30
          "
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--background)",
              touchAction: "none",
            }}
          >
            <Minus
              size={20}
              strokeWidth={2}
              style={{
                color: "var(--foreground)",
              }}
            />
          </button>

          {/* Значение */}
          <input
            type="number"
            inputMode="numeric"
            min={MIN_REPS}
            max={MAX_REPS}
            value={maxReps}
            onChange={handleInputChange}
            disabled={isLoading}
            aria-label="Максимальное количество повторений"
            className="
            w-[clamp(100px,30vw,150px)]
            appearance-none
            bg-transparent
            text-center
            text-[clamp(68px,20vw,92px)]
            font-bold
            leading-none
            tracking-[-0.09em]
            outline-none
            [appearance:textfield]
            [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none
          "
            style={{
              color: "var(--foreground)",
            }}
          />

          {/* Плюс */}
          <button
            type="button"
            disabled={isLoading || maxReps >= MAX_REPS}
            onPointerDown={() => startPress(1)}
            onPointerUp={stopPress}
            onPointerCancel={stopPress}
            onPointerLeave={stopPress}
            aria-label="Увеличить количество повторений"
            className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            transition-all
            active:scale-90
            disabled:opacity-30
          "
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--background)",
              touchAction: "none",
            }}
          >
            <Plus
              size={20}
              strokeWidth={2}
              style={{
                color: "var(--foreground)",
              }}
            />
          </button>
        </div>

        {/* Подпись */}
        <p
          className="
          mt-3
          text-[13px]
          font-medium
        "
          style={{
            color: "var(--muted)",
          }}
        >
          повторений за подход
        </p>

        {/* Предыдущий результат */}
        <div className="mt-5 text-center">
          <p
            className="text-xs"
            style={{
              color: "var(--muted)",
            }}
          >
            {previousMaxReps !== null ? (
              <>
                Предыдущий максимум{" "}
                <span
                  className="font-semibold"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {previousMaxReps}
                </span>
              </>
            ) : (
              "Первый замер"
            )}
          </p>
        </div>

        {/* Ошибка */}
        {error && (
          <p
            className="
            mx-auto
            mt-4
            max-w-[340px]
            rounded-2xl
            px-4
            py-3
            text-center
            text-xs
          "
            style={{
              color: "#ef4444",
              backgroundColor: "color-mix(in srgb, #ef4444 7%, transparent)",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Кнопка */}
      <div
        className="
        shrink-0
        pb-2
        pt-6
      "
      >
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="
          flex
          h-14
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          px-5
          text-[15px]
          font-semibold
          text-white
          transition-all
          active:scale-[0.98]
          disabled:opacity-50
        "
          style={{
            backgroundColor: "var(--accent)",
          }}
        >
          <span>{isLoading ? "Готовим программу..." : "Продолжить"}</span>

          {!isLoading && <ArrowRight size={18} strokeWidth={2} />}
        </button>
      </div>
    </div>
  );
}
