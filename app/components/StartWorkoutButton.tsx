"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StartWorkoutButtonProps = {
  workoutId: string;
};

export default function StartWorkoutButton({
  workoutId,
}: StartWorkoutButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/workouts/${workoutId}/start`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Не удалось начать тренировку",
        );
        return;
      }

      router.refresh();
    } catch {
      setError(
        "Не удалось подключиться к серверу",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading}
        className="
          flex h-13 w-full items-center justify-center gap-2
          rounded-2xl bg-emerald-500 px-5
          text-sm font-semibold text-white
          shadow-sm
          transition
          hover:bg-emerald-600
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            <span>Начинаем...</span>
          </>
        ) : (
          <>
            <span>Начать тренировку</span>
            <span className="text-base">→</span>
          </>
        )}
      </button>
    </div>
  );
}