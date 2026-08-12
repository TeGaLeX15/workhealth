// app/components/training/SkippedWorkoutCard.tsx
import type { FC } from "react";

import type { Workout } from "./types";
import { formatWorkoutDate, getStatusStyle } from "./utils";

type SkippedWorkoutCardProps = {
  workout: Workout;
};

const SkippedWorkoutCard: FC<SkippedWorkoutCardProps> = ({ workout }) => {
  return (
    <div
      className="
        flex
        min-h-[58px]
        items-center
        justify-between
        gap-3
        rounded-[18px]
        border
        px-4
        py-3
        opacity-60
      "
      style={{
        backgroundColor: "color-mix(in srgb, var(--muted) 2%, var(--card))",
        borderColor: "color-mix(in srgb, var(--muted) 14%, var(--border))",
      }}
    >
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
            text-[14px]
            font-semibold
            tracking-[-0.02em]
          "
          style={{
            color: "var(--foreground)",
          }}
        >
          Тренировка #{workout.workoutNumber}
        </p>
      </div>

      <span
        className="
          shrink-0
          rounded-full
          px-2.5
          py-1.5
          text-[10px]
          font-semibold
        "
        style={getStatusStyle("SKIPPED")}
      >
        Пропущена
      </span>
    </div>
  );
};

export default SkippedWorkoutCard;
