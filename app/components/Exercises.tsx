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
  "push-ups": "↓",
  dips: "↕",
  squats: "↓",
};

export default function Exercises() {
  const router = useRouter();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExercises() {
      try {
        const response = await fetch("/api/exercises");

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.error ?? "Не удалось загрузить упражнения",
          );
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
      <section className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-2xl bg-zinc-200"
          />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      {exercises.map((exercise) => (
        <button
          key={exercise.id}
          type="button"
          onClick={() => {
            router.push(`/exercise/${exercise.id}`);
          }}
          className="
            group
            flex
            min-h-24
            w-full
            items-center
            rounded-2xl
            border
            border-zinc-200
            bg-white
            px-5
            text-left
            shadow-sm
            transition
            active:scale-[0.985]
            hover:border-zinc-300
            hover:shadow-md
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-zinc-100
              text-xl
              font-semibold
              text-zinc-700
              transition
              group-hover:bg-zinc-200
            "
          >
            {exerciseIcons[exercise.slug] ?? "•"}
          </div>

          <div className="ml-4 min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-zinc-950">
              {exercise.name}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Тренировочная программа
            </p>
          </div>

          <span
            className="
              ml-3
              text-xl
              text-zinc-300
              transition
              group-hover:translate-x-0.5
              group-hover:text-zinc-500
            "
          >
            →
          </span>
        </button>
      ))}
    </section>
  );
}