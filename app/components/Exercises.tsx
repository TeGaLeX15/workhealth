"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Dumbbell } from "lucide-react";
import Image from "next/image";

type Exercise = {
  id: string;
  name: string;
  slug: string;
};

const exerciseIcons: Record<string, string> = {
  "pull-ups": "/pull-up.svg",
  "push-ups": "/push-up.svg",
  dips: "/dips.svg",
  squats: "/squat.svg",
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
      <div className="border-y" style={{ borderColor: "var(--border)" }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={[
              "flex min-h-[104px] items-center gap-4 px-4",
              index !== 0 ? "border-t" : "",
            ].join(" ")}
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div
              className="h-14 w-14 shrink-0 animate-pulse"
              style={{
                backgroundColor: "var(--surface)",
              }}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div
                className="h-4 w-32 animate-pulse"
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />

              <div
                className="h-3 w-48 max-w-full animate-pulse"
                style={{
                  backgroundColor: "var(--surface)",
                }}
              />
            </div>

            <div
              className="h-8 w-8 shrink-0 animate-pulse"
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
        className="border-y px-4 py-5 text-sm"
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
        className="border-y px-4 py-5 text-sm"
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
    <div
      className="border-y"
      style={{
        borderColor: "var(--border)",
      }}
    >
      {exercises.map((exercise, index) => {
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
              "group relative flex w-full",
              "min-h-[112px]",
              "items-center gap-4",
              "px-4 py-4",
              "text-left",
              "transition-colors duration-150",
              "active:bg-[color-mix(in_srgb,var(--accent)_6%,var(--background))]",
              "hover:bg-[color-mix(in_srgb,var(--accent)_4%,var(--background))]",
              index !== 0 ? "border-t" : "",
            ].join(" ")}
            style={{
              borderColor: "var(--border)",
            }}
          >
            {/* Акцентная точка */}
            <span
              className="absolute left-0 top-1/2 h-8 w-[3px] -translate-y-1/2"
              style={{
                backgroundColor: "var(--accent)",
              }}
            />

            {/* Иконка */}
            <div
              className={[
                "flex h-16 w-16 shrink-0",
                "items-center justify-center",
              ].join(" ")}
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent) 8%, var(--surface))",
              }}
            >
              {icon ? (
                <Image
                  src={icon}
                  alt=""
                  width={48}
                  height={48}
                  className="h-11 w-11 object-contain"
                  draggable={false}
                  aria-hidden="true"
                />
              ) : (
                <Dumbbell
                  size={28}
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
              <div className="flex items-center gap-2">
                <h2
                  className="truncate text-[16px] font-bold tracking-[-0.02em]"
                  style={{
                    color: "var(--foreground)",
                  }}
                >
                  {exercise.name}
                </h2>
              </div>

              <p
                className="mt-1.5 max-w-[280px] text-[12px] leading-[1.45]"
                style={{
                  color: "var(--muted)",
                }}
              >
                {description}
              </p>

              <p
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
                style={{
                  color: "var(--accent)",
                }}
              >
                Открыть программу
              </p>
            </div>

            {/* Навигация */}
            <ChevronRight
              size={20}
              strokeWidth={1.7}
              className={[
                "shrink-0 transition-transform duration-150",
                "group-hover:translate-x-0.5",
                "group-active:translate-x-1",
              ].join(" ")}
              style={{
                color: "var(--muted)",
              }}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
