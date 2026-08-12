// app/components/exercises/max-reps/useMaxReps.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MIN_REPS = 1;
const MAX_REPS = 1000;

export default function useMaxReps(exerciseId: string) {
  const router = useRouter();

  const [maxReps, setMaxReps] = useState(10);
  const [inputValue, setInputValue] = useState("10");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Counter ──────────────────────────────────────────────────────────────

  const changeReps = useCallback((amount: number) => {
    setMaxReps((current) => {
      const next = Math.min(MAX_REPS, Math.max(MIN_REPS, current + amount));

      setInputValue(String(next));

      return next;
    });
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

  // ─── Input ────────────────────────────────────────────────────────────────

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.value;

    if (rawValue === "") {
      setInputValue("");
      return;
    }

    if (!/^\d+$/.test(rawValue)) {
      return;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return;
    }

    const clampedValue = Math.min(
      MAX_REPS,
      Math.max(MIN_REPS, Math.floor(value)),
    );

    setInputValue(String(clampedValue));
    setMaxReps(clampedValue);
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

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
        setError("Тренировка не найдена");
        return;
      }

      router.push(`/training/workouts/${weekData.workoutId}`);
    } catch {
      setError("Не удалось подключиться к серверу");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    maxReps,
    inputValue,
    error,
    isLoading,
    changeReps,
    startPress,
    stopPress,
    handleInputChange,
    handleSubmit,
  };
}
