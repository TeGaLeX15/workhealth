// app/components/StartWorkoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";

type StartWorkoutButtonProps = {
  workoutId: string;
};

export default function StartWorkoutButton({
  workoutId,
}: StartWorkoutButtonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle starting the workout
  async function handleStart() {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/workouts/${workoutId}/start`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Не удалось начать тренировку");
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
    <div className="w-full">
      {error && (
        <p
          className="mb-3 rounded-xl px-3 py-2 text-center text-xs"
          style={{
            color: "#ef4444",
            backgroundColor: "color-mix(in srgb, #ef4444 7%, transparent)",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleStart}
        disabled={isLoading}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
        style={{
          backgroundColor: "var(--accent)",
        }}
      >
        {isLoading ? (
          <>
            <LoaderCircle size={18} strokeWidth={2} className="animate-spin" />

            <span>Начинаем...</span>
          </>
        ) : (
          <>
            <span>Начать тренировку</span>

            <ArrowRight size={18} strokeWidth={2} />
          </>
        )}
      </button>
    </div>
  );
}
