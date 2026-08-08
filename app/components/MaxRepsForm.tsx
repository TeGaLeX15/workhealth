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
      // 1. Сохраняем максимум
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

      // 2. Создаём тренировочную неделю
      //    и сразу получаем первую тренировку
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

      // 3. Сразу открываем первую тренировку
      router.push(
        `/workout/${weekData.workoutId}`,
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
    <div className="mt-8">
      <p className="text-sm text-zinc-500">
        Твой максимум
      </p>

      <h2 className="mt-2 text-lg font-medium">
        {exerciseName}
      </h2>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={decrease}
          disabled={isLoading}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-2xl transition hover:bg-zinc-700 active:scale-95 disabled:opacity-50"
        >
          −
        </button>

        <div className="text-center">
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
                setMaxReps(1);
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
            className="w-32 bg-transparent text-center text-6xl font-semibold tracking-tight outline-none"
          />

          <p className="mt-1 text-sm text-zinc-500">
            повторений
          </p>
        </div>

        <button
          type="button"
          onClick={increase}
          disabled={isLoading}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-2xl transition hover:bg-zinc-700 active:scale-95 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="mt-8 h-12 w-full rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Готовим программу..."
          : "Подтвердить максимум"}
      </button>
    </div>
  );
}
