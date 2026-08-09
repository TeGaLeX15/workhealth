// app/components/Exercises.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Dumbbell } from "lucide-react";
import Image from "next/image";

type Exercise = {
  id: string;
  name: string;
  slug: string;
  maxReps: number | null;
  maxUpdatedAt: string | null;
};

const exerciseIcons: Record<string, string> = {
  "pull-ups": "/exercises/pull-ups.png",
  "push-ups": "/exercises/push-ups.png",
  dips: "/exercises/dips.png",
  squats: "/exercises/squats.png",
};

const exerciseDescriptions: Record<string, string> = {
  "pull-ups": "Сила спины, рук и плечевого пояса",
  "push-ups": "Грудь, плечи и трицепс",
  dips: "Трицепс, грудь и плечевой пояс",
  squats: "Сила ног и общая выносливость",
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
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-[124px] items-center gap-4 rounded-[24px] border p-4"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="h-[72px] w-[72px] shrink-0 animate-pulse rounded-[14px]"
              style={{
                backgroundColor: "var(--surface)",
              }}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div
                className="h-5 w-36 animate-pulse rounded-full"
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />

              <div
                className="h-3.5 w-48 max-w-full animate-pulse rounded-full"
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />

              <div
                className="h-3 w-28 animate-pulse rounded-full"
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />
            </div>

            <div
              className="h-10 w-10 shrink-0 animate-pulse rounded-full"
              style={{
                backgroundColor: "var(--surface)",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-[22px] border px-5 py-5 text-sm"
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
        className="rounded-[22px] border px-5 py-5 text-sm"
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
      {exercises.map((exercise) => {
        const icon = exerciseIcons[exercise.slug];

        const description =
          exerciseDescriptions[exercise.slug] ??
          "Тренировочная программа";

        return (
          <button
            key={exercise.id}
            type="button"
            onClick={() => {
              router.push(`/exercise/${exercise.id}`);
            }}
            className={[
              "group flex w-full items-center gap-4",
              "rounded-[24px] border p-4",
              "text-left",
              "transition-all duration-150",
              "hover:border-[color-mix(in_srgb,var(--accent)_25%,var(--border))]",
              "hover:bg-[color-mix(in_srgb,var(--accent)_2%,var(--card))]",
              "active:scale-[0.985]",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-[var(--accent)]",
              "focus-visible:ring-offset-2",
              "motion-reduce:transition-none",
            ].join(" ")}
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            {/* Изображение */}
            <div
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[14px]"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent) 9%, var(--surface))",
              }}
            >
              {icon ? (
                <Image
                  src={icon}
                  alt=""
                  width={256}
                  height={256}
                  quality={100}
                  className="h-full w-full scale-[1.12] object-cover"
                  draggable={false}
                  aria-hidden="true"
                />
              ) : (
                <Dumbbell
                  size={30}
                  strokeWidth={1.7}
                  style={{
                    color: "var(--accent)",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Информация */}
            <div className="min-w-0 flex-1">
              <h2
                className="truncate text-[18px] font-bold leading-tight tracking-[-0.025em]"
                style={{
                  color: "var(--foreground)",
                }}
              >
                {exercise.name}
              </h2>

              <p
                className="mt-2 text-[13px] leading-[1.45]"
                style={{
                  color: "var(--muted)",
                }}
              >
                {description}
              </p>

              {/* Личный максимум */}
              <p
                className="mt-2 text-[11px] font-semibold leading-none"
                style={{
                  color:
                    exercise.maxReps !== null
                      ? "var(--accent)"
                      : "var(--subtle)",
                }}
              >
                {exercise.maxReps !== null
                  ? `Личный максимум · ${exercise.maxReps}`
                  : "Максимум не установлен"}
              </p>
            </div>

            {/* Arrow */}
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-150 group-hover:translate-x-0.5 group-active:translate-x-0.5"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--muted)",
              }}
            >
              <ChevronRight
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}