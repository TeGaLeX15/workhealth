// app/components/training/WorkoutSetsPreview.tsx
import type { FC } from "react";

import type { WorkoutSet } from "./types";

type WorkoutSetsPreviewProps = {
  sets: WorkoutSet[];
  isInProgress: boolean;
  currentSetIndex: number;
};

const WorkoutSetsPreview: FC<WorkoutSetsPreviewProps> = ({
  sets,
  isInProgress,
  currentSetIndex,
}) => {
  return (
    <div
      className="
        border-t
        px-4
        py-3.5
      "
      style={{
        borderColor: "var(--border)",
        backgroundColor:
          "color-mix(in srgb, var(--background) 35%, var(--card))",
      }}
    >
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: `repeat(${Math.max(
            sets.length,
            1,
          )}, minmax(0, 1fr))`,
        }}
      >
        {sets.map((set, index) => {
          const completed = set.completed;

          const current =
            isInProgress && currentSetIndex !== -1 && index === currentSetIndex;

          const upcoming = !completed && !current;

          return (
            <div
              key={set.id}
              className="
                relative
                flex
                min-h-[64px]
                min-w-0
                flex-col
                items-center
                justify-center
                overflow-hidden
                rounded-[16px]
                border
              "
              style={{
                borderColor: completed
                  ? "color-mix(in srgb, var(--accent) 25%, var(--border))"
                  : current
                    ? "color-mix(in srgb, var(--accent) 55%, var(--border))"
                    : "color-mix(in srgb, var(--border) 55%, transparent)",

                backgroundColor: completed
                  ? "color-mix(in srgb, var(--accent) 8%, var(--surface))"
                  : current
                    ? "color-mix(in srgb, var(--accent) 14%, var(--surface))"
                    : "var(--surface)",

                opacity: upcoming ? 0.55 : 1,
              }}
            >
              {current && (
                <span
                  className="
                    absolute
                    left-2
                    right-2
                    top-0
                    h-0.5
                    rounded-full
                  "
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                  aria-hidden="true"
                />
              )}

              <span
                className="
                  flex
                  h-4
                  items-center
                  justify-center
                  text-[11px]
                  font-semibold
                "
                style={{
                  color:
                    completed || current ? "var(--accent)" : "var(--muted)",
                }}
              >
                {completed ? (
                  <span aria-label="Подход выполнен">✓</span>
                ) : current ? (
                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                    "
                    style={{
                      backgroundColor: "var(--accent)",
                    }}
                    aria-label="Текущий подход"
                  />
                ) : (
                  set.setNumber
                )}
              </span>

              <span
                className="
                  mt-1
                  text-[17px]
                  font-bold
                  leading-none
                  tracking-[-0.025em]
                "
                style={{
                  color: current
                    ? "var(--accent)"
                    : completed
                      ? "var(--foreground)"
                      : "var(--muted)",
                }}
              >
                {set.actualReps ?? set.targetReps}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutSetsPreview;
