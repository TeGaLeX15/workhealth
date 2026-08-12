// app/components/workout/ActiveWorkoutCard.tsx
"use client";

import { Dumbbell } from "lucide-react";

import ActiveWorkoutHeader from "./active/ActiveWorkoutHeader";
import ActiveWorkoutProgress from "./active/ActiveWorkoutProgress";
import ActiveWorkoutSets from "./active/ActiveWorkoutSets";
import ActiveWorkoutCurrentSet from "./active/ActiveWorkoutCurrentSet";
import ActiveWorkoutAction from "./active/ActiveWorkoutAction";

import type { ActiveWorkoutCardProps } from "./active/types";

export default function ActiveWorkoutCard({
  workoutId,
  workoutNumber,
  sets,
}: ActiveWorkoutCardProps) {
  if (sets.length === 0) {
    return (
      <section
        className="
          rounded-[28px]
          border
          p-5
        "
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-[16px]
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--muted) 8%, var(--surface))",
            }}
          >
            <Dumbbell
              size={19}
              strokeWidth={1.8}
              style={{
                color: "var(--muted)",
              }}
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
              "
              style={{
                color: "var(--muted)",
              }}
            >
              Тренировка {workoutNumber}
            </p>

            <p
              className="
                mt-1
                text-[15px]
                font-semibold
              "
              style={{
                color: "var(--foreground)",
              }}
            >
              Нет подходов
            </p>
          </div>
        </div>
      </section>
    );
  }

  const completedSets = sets.filter((set) => set.completed).length;

  const totalSets = sets.length;

  const currentSetIndex = sets.findIndex((set) => !set.completed);

  const currentSet = currentSetIndex >= 0 ? sets[currentSetIndex] : null;

  const isCompleted = completedSets === totalSets;

  const progress =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <section
      className="
        overflow-hidden
        rounded-[30px]
        border
        transition-all
        duration-300
      "
      style={{
        borderColor: isCompleted
          ? "color-mix(in srgb, var(--accent) 22%, var(--border))"
          : "color-mix(in srgb, var(--accent) 28%, var(--border))",

        backgroundColor: "var(--surface)",

        boxShadow: isCompleted
          ? "none"
          : "0 8px 30px color-mix(in srgb, var(--accent) 5%, transparent)",
      }}
    >
      <ActiveWorkoutHeader
        workoutNumber={workoutNumber}
        completedSets={completedSets}
        totalSets={totalSets}
        isCompleted={isCompleted}
      />

      <ActiveWorkoutProgress progress={progress} />

      <ActiveWorkoutSets
        sets={sets}
        currentSetIndex={currentSetIndex}
        isCompleted={isCompleted}
      />

      <ActiveWorkoutCurrentSet
        currentSet={currentSet}
        completedSets={completedSets}
        totalSets={totalSets}
        isCompleted={isCompleted}
      />

      <ActiveWorkoutAction workoutId={workoutId} isCompleted={isCompleted} />
    </section>
  );
}
