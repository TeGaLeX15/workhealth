"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Exercise = {
  id: string;
  name: string;
  slug: string;
};

const exerciseIcons: Record<string, string> = {
  "pull-ups": "↑",
  "push-ups": "↑",
  dips: "↕",
  squats: "↓",
};

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch("/api/exercises");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Не удалось загрузить упражнения");
          return;
        }

        setExercises(data.exercises);
      } catch {
        setError("Не удалось подключиться к серверу");
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, []);

  if (isLoading) {
    return (
      <section className="mt-10 grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-2xl border border-red-900/50 bg-red-950/30 px-4 py-4 text-sm text-red-300">
        {error}
      </div>
    );
  }

  return (
    <section className="mt-10 grid grid-cols-2 gap-4">
      {exercises.map((exercise) => (
        <button
          key={exercise.id}
          type="button"
          onClick={() => {
            router.push(`/exercise/${exercise.id}`);
          }}
          className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700 hover:bg-zinc-800 active:scale-[0.98]"
        >
          <span className="text-3xl">
            {exerciseIcons[exercise.slug] ?? "•"}
          </span>

          <span className="mt-4 text-center text-sm font-medium">
            {exercise.name}
          </span>
        </button>
      ))}
    </section>
  );
}