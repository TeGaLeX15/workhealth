// app/components/training/FutureWorkoutCard.tsx
import type { FC } from "react";
import { Lock } from "lucide-react";

import type { Workout } from "./types";
import { formatWorkoutDate, getTotalReps, getWorkoutSetLabel } from "./utils";

type FutureWorkoutCardProps = {
  workout: Workout;
};

const FutureWorkoutCard: FC<FutureWorkoutCardProps> = ({ workout }) => {
  const totalReps = getTotalReps(workout.sets);
  const totalSets = workout.sets.length;

  return (
    <div
      className="
        rounded-[20px]
        border
        px-4
        py-3.5
      "
      style={{
        backgroundColor: "color-mix(in srgb, var(--muted) 2%, var(--card))",
        borderColor: "color-mix(in srgb, var(--muted) 10%, var(--border))",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
            "
            style={{
              color: "var(--muted)",
            }}
          >
            {formatWorkoutDate(workout.scheduledDate)}
          </p>

          <p
            className="
              mt-0.5
              text-[15px]
              font-bold
              tracking-[-0.02em]
            "
            style={{
              color: "var(--foreground)",
            }}
          >
            Тренировка #{workout.workoutNumber}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className="
              rounded-full
              px-2.5
              py-1.5
              text-[10px]
              font-semibold
            "
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--muted) 7%, var(--surface))",
              color: "var(--muted)",
            }}
          >
            Запланирована
          </span>

          <Lock
            size={15}
            strokeWidth={2}
            style={{
              color: "var(--muted)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className="
          mt-3
          flex
          items-center
          gap-2
          text-[11px]
          font-medium
        "
        style={{
          color: "var(--muted)",
        }}
      >
        <span>
          {totalSets} {getWorkoutSetLabel(totalSets)}
        </span>

        <span
          className="h-1 w-1 rounded-full"
          style={{
            backgroundColor: "var(--border)",
          }}
          aria-hidden="true"
        />

        <span>{totalReps} повторений</span>
      </div>
    </div>
  );
};

export default FutureWorkoutCard;
