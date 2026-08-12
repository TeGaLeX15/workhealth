// app/components/Exercises.tsx
"use client";

import { useEffect, useState } from "react";

import ExerciseCard from "./ExerciseCard";
import ExerciseCardSkeleton from "./ExerciseCardSkeleton";
import type { Exercise } from "./types";

const exerciseDescriptions: Record<string, string> = {
  "pull-ups": "Спина · бицепс · плечи",
  "push-ups": "Грудь · плечи · трицепс",
  dips: "Трицепс · грудь · плечи",
  squats: "Квадрицепс · ягодицы · ноги",
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadExercises() {
      try {
        const response = await fetch("/api/exercises", {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Не удалось загрузить упражнения");
          return;
        }

        setExercises(Array.isArray(data.exercises) ? data.exercises : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError("Не удалось подключиться к серверу");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadExercises();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <ExerciseCardSkeleton />;
  }

  if (error) {
    return (
      <div
        role="alert"
        className="
          rounded-[22px]
          border
          px-5
          py-5
          text-sm
          leading-relaxed
        "
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--muted)",
        }}
      >
        {error}
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div
        className="
          rounded-[22px]
          border
          px-5
          py-5
          text-sm
          leading-relaxed
        "
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--muted)",
        }}
      >
        Упражнения пока недоступны.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          description={
            exerciseDescriptions[exercise.slug] ?? "Тренировочное упражнение"
          }
        />
      ))}
    </div>
  );
}
