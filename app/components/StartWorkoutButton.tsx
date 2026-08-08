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
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading}
        className="h-12 w-full rounded-xl bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading
          ? "Начинаем..."
          : "Начать тренировку"}
      </button>
    </div>
  );
}