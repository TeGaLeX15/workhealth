"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MaxRepsFormProps = {
  exerciseId: string;
  exerciseName: string;
};

export default function MaxRepsForm({
  exerciseId,
  exerciseName,
}: MaxRepsFormProps) {
  const router = useRouter();

  const [maxReps, setMaxReps] = useState(10);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function decrease() {
    setMaxReps((value) => Math.max(1, value - 1));
  }

  function increase() {
    setMaxReps((value) => Math.min(1000, value + 1));
  }

  async function handleSubmit() {
    setError("");
    setIsLoading(true);

    try {
      const maxResponse = await fetch(
        `/api/exercises/${exerciseId}/max`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            maxReps,
          }),
        },
      );

      const maxData = await maxResponse.json();

      if (!maxResponse.ok) {
        setError(
          maxData.error ??
            "Не удалось сохранить максимум",
        );
        return;
      }

      const weekResponse = await fetch(
        "/api/training-weeks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exerciseId,
          }),
        },
      );

      const weekData = await weekResponse.json();

      if (!weekResponse.ok) {
        setError(
          weekData.error ??
            "Не удалось создать программу тренировок",
        );
        return;
      }

      if (!weekData.workoutId) {
        setError(
          "Программа создана, но первая тренировка не найдена",
        );
        return;
      }

      router.push(
        `/workouts/${weekData.workoutId}`,
      );
    } catch {
      setError(
        "Не удалось подключиться к серверу",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mt-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">
          Твой максимум
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">
          {exerciseName}
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Сколько повторений ты можешь выполнить
          максимум за один подход?
        </p>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={decrease}
            disabled={isLoading || maxReps <= 1}
            aria-label="Уменьшить максимум"
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-zinc-200
              bg-zinc-50
              text-2xl
              font-medium
              text-zinc-700
              transition
              hover:bg-zinc-100
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            −
          </button>

          <div className="mx-4 min-w-0 text-center">
            <input
              type="number"
              min={1}
              max={1000}
              value={maxReps}
              onChange={(event) => {
                const value = Number(
                  event.target.value,
                );

                if (Number.isNaN(value)) {
                  return;
                }

                setMaxReps(
                  Math.min(
                    1000,
                    Math.max(1, value),
                  ),
                );
              }}
              disabled={isLoading}
              aria-label="Максимальное количество повторений"
              className="
                w-32
                bg-transparent
                text-center
                text-6xl
                font-bold
                tracking-tight
                text-zinc-950
                outline-none
              "
            />

            <p className="mt-1 text-sm text-zinc-400">
              повторений
            </p>
          </div>

          <button
            type="button"
            onClick={increase}
            disabled={isLoading || maxReps >= 1000}
            aria-label="Увеличить максимум"
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-zinc-200
              bg-zinc-50
              text-2xl
              font-medium
              text-zinc-700
              transition
              hover:bg-zinc-100
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            +
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm leading-5 text-red-600">
              {error}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="
            mt-8
            h-14
            w-full
            rounded-2xl
            bg-emerald-500
            px-4
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-emerald-600
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isLoading
            ? "Готовим программу..."
            : "Начать программу"}
        </button>
      </div>
    </section>
  );
}